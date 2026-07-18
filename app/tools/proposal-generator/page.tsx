"use client";

import React, { useState, useRef } from "react";
import { exportToPdf } from "@/lib/pdf-export";
import { ToolHero } from "@/components/layout/ToolHero";
import { ProposalVisual } from "@/components/layout/ToolHeroVisuals";
import {
  Plus,
  Trash2,
  Download,
  Building2,
  DollarSign,
  Info,
  CheckCircle2,
  Briefcase,
  Layers,
  Clock
} from "lucide-react";

interface Deliverable {
  id: string;
  description: string;
}

interface Milestone {
  id: string;
  description: string;
  amount: number;
}

const CURRENCIES = [
  { code: "USD", symbol: "$", label: "USD ($)" },
  { code: "EUR", symbol: "€", label: "EUR (€)" },
  { code: "GBP", symbol: "£", label: "GBP (£)" },
  { code: "PKR", symbol: "Rs.", label: "PKR (Rs.)" },
  { code: "AUD", symbol: "A$", label: "AUD (A$)" },
  { code: "CAD", symbol: "C$", label: "CAD (C$)" },
  { code: "INR", symbol: "₹", label: "INR (₹)" },
];

export default function ProposalGenerator() {
  // --- Form State ---
  const [clientName, setClientName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [notes, setNotes] = useState("");

  // Deliverables
  const [deliverables, setDeliverables] = useState<Deliverable[]>([
    { id: "1", description: "Deep-dive discovery session & project brief definition" }
  ]);

  // Timeline: structured vs custom toggle
  const [timelineType, setTimelineType] = useState<"structured" | "custom">("structured");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [customTimeline, setCustomTimeline] = useState("");

  // Pricing model: fixed vs milestone
  const [pricingModel, setPricingModel] = useState<"fixed" | "milestone">("fixed");
  const [fixedAmount, setFixedAmount] = useState<number | "">("");
  const [milestones, setMilestones] = useState<Milestone[]>([
    { id: "1", description: "Initial setup & concept proposal", amount: 1500 }
  ]);

  const [currency, setCurrency] = useState(CURRENCIES[0]);

  // --- Touch Tracking / Validation State ---
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showAllErrors, setShowAllErrors] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Hidden print ref
  const printRef = useRef<HTMLDivElement>(null);

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  // --- Deliverable Handlers ---
  const addDeliverable = () => {
    setDeliverables([...deliverables, { id: Date.now().toString(), description: "" }]);
  };

  const updateDeliverable = (id: string, description: string) => {
    setDeliverables(prev => prev.map(d => d.id === id ? { ...d, description } : d));
  };

  const removeDeliverable = (id: string) => {
    if (deliverables.length <= 1) {
      alert("At least one deliverable is required.");
      return;
    }
    setDeliverables(prev => prev.filter(d => d.id !== id));
  };

  // --- Milestone Handlers ---
  const addMilestone = () => {
    setMilestones([...milestones, { id: Date.now().toString(), description: "", amount: 0 }]);
  };

  const updateMilestone = (id: string, updates: Partial<Milestone>) => {
    setMilestones(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
  };

  const removeMilestone = (id: string) => {
    if (milestones.length <= 1) {
      alert("At least one milestone is required.");
      return;
    }
    setMilestones(prev => prev.filter(m => m.id !== id));
  };

  // --- Calculations ---
  const milestoneTotal = milestones.reduce((sum, m) => sum + (m.amount || 0), 0);
  const totalInvestment = pricingModel === "fixed" ? (Number(fixedAmount) || 0) : milestoneTotal;

  // --- Validation ---
  const errors: Record<string, string> = {};

  if (!clientName.trim()) {
    errors.clientName = "Client name is required.";
  }
  if (!businessName.trim()) {
    errors.businessName = "Business/Freelancer name is required.";
  }
  if (!projectDescription.trim()) {
    errors.projectDescription = "Project description is required.";
  }

  // Deliverables validation
  let deliverablesValid = deliverables.length > 0;
  deliverables.forEach(d => {
    if (!d.description.trim()) {
      deliverablesValid = false;
    }
  });

  // Timeline validation
  if (timelineType === "structured") {
    if (!startDate) {
      errors.startDate = "Start date is required.";
    }
    if (!endDate) {
      errors.endDate = "Estimated completion date is required.";
    } else if (startDate && endDate < startDate) {
      errors.endDate = "Completion date cannot be before start date.";
    }
  } else {
    if (!customTimeline.trim()) {
      errors.customTimeline = "Timeline description is required.";
    }
  }

  // Pricing validation
  if (pricingModel === "fixed") {
    if (fixedAmount === "" || fixedAmount < 0) {
      errors.fixedAmount = "Fixed amount must be a positive number.";
    }
  } else {
    milestones.forEach(m => {
      if (!m.description.trim() || m.amount < 0) {
        errors.milestones = "All milestones must have descriptions and non-negative amounts.";
      }
    });
  }

  const isFormValid = Object.keys(errors).length === 0 && deliverablesValid;

  const renderError = (field: string) => {
    const isFieldTouched = touched[field] || showAllErrors;
    if (isFieldTouched && errors[field]) {
      return (
        <p className="mt-1.5 text-xs text-red-600 dark:text-red-400 font-medium flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-red-600 dark:bg-red-400 inline-block" />
          {errors[field]}
        </p>
      );
    }
    return null;
  };

  const getInputFieldClass = (field: string) => {
    const isFieldTouched = touched[field] || showAllErrors;
    const hasError = isFieldTouched && errors[field];
    return `w-full rounded-xl border ${
      hasError
        ? "border-red-300 dark:border-red-800 bg-red-50/50 dark:bg-red-950/20 focus:ring-red-500 focus:border-red-500"
        : "border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-900 focus:ring-blue-500 focus:border-blue-500"
    } py-2.5 px-3.5 text-sm shadow-sm transition-all focus:outline-none focus:ring-2 text-gray-900 dark:text-gray-100`;
  };

  const handleDownload = async () => {
    setShowAllErrors(true);
    if (!isFormValid) {
      alert("Please fix all invalid or missing fields before generating the PDF.");
      return;
    }

    if (printRef.current) {
      setIsExporting(true);
      const cleanFilename = `Proposal_${clientName.replace(/\s+/g, "_")}.pdf`;
      await exportToPdf(printRef.current, {
        filename: cleanFilename,
        onComplete: () => setIsExporting(false),
        onError: () => setIsExporting(false)
      });
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen pb-16 transition-colors duration-200">
      <ToolHero
        title="Proposal Generator"
        description="Create compelling, modern project proposals complete with milestones, precise schedules, and fixed or milestone pricing."
        actionLabel="Draft Proposal ↓"
        visual={<ProposalVisual />}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Form top action bar */}
        <div id="tool-form" className="scroll-mt-12 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-slate-200/60 dark:border-slate-800/60 pb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Proposal Builder</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Customize your project scope and billing details below.</p>
          </div>
          <button
            onClick={handleDownload}
            disabled={isExporting}
            className={`inline-flex items-center justify-center gap-2 rounded-xl font-bold py-3 px-5 text-sm shadow-md transition-all ${
              isFormValid
                ? "bg-blue-600 hover:bg-blue-700 text-white hover:scale-[1.01] cursor-pointer"
                : "bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed"
            }`}
          >
            {isExporting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Download PDF
              </>
            )}
          </button>
        </div>

        {/* Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left Inputs Section */}
          <div className="lg:col-span-7 space-y-6">

            {/* Entities Card */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-800/80 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100 dark:border-gray-800">
                <Briefcase className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Parties Involved</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                    Your Business Name *
                  </label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    onBlur={() => handleBlur("businessName")}
                    placeholder="e.g. Pixelcraft Studio"
                    className={getInputFieldClass("businessName")}
                  />
                  {renderError("businessName")}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                    Client Name / Company *
                  </label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    onBlur={() => handleBlur("clientName")}
                    placeholder="e.g. Acme Corp"
                    className={getInputFieldClass("clientName")}
                  />
                  {renderError("clientName")}
                </div>
              </div>
            </div>

            {/* Overview Card */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-800/80 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100 dark:border-gray-800">
                <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Project Overview</h2>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                  Project Description *
                </label>
                <textarea
                  rows={4}
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  onBlur={() => handleBlur("projectDescription")}
                  placeholder="Describe the client's problem, your solution, and the high-level goals of this project..."
                  className={`w-full rounded-xl border ${
                    (touched.projectDescription || showAllErrors) && errors.projectDescription
                      ? "border-red-300 dark:border-red-800 bg-red-50/50 dark:bg-red-950/20"
                      : "border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-900"
                  } py-2.5 px-3.5 text-sm shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100`}
                />
                {renderError("projectDescription")}
              </div>
            </div>

            {/* Scope / Deliverables */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-800/80 p-6 shadow-sm">
              <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-2">
                  <Layers className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">Scope &amp; Deliverables</h2>
                </div>
                <button
                  type="button"
                  onClick={addDeliverable}
                  className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" /> Add Deliverable
                </button>
              </div>

              <div className="space-y-3">
                {deliverables.map((item, index) => {
                  const isItemTouched = touched[`del-${item.id}`] || showAllErrors;
                  const itemError = !item.description.trim();

                  return (
                    <div key={item.id} className="flex gap-2 items-center">
                      <div className="flex-grow">
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => updateDeliverable(item.id, e.target.value)}
                          onBlur={() => handleBlur(`del-${item.id}`)}
                          placeholder={`Deliverable #${index + 1}`}
                          className={`w-full rounded-xl border ${
                            isItemTouched && itemError
                              ? "border-red-300 dark:border-red-800 bg-red-50/50 dark:bg-red-950/20"
                              : "border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-900"
                          } py-2 px-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 dark:text-gray-100`}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeDeliverable(item.id)}
                        className="text-gray-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-800/80 p-6 shadow-sm">
              <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">Timeline</h2>
                </div>
                <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setTimelineType("structured")}
                    className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                      timelineType === "structured"
                        ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm"
                        : "text-gray-500 hover:text-gray-700 dark:text-gray-400"
                    }`}
                  >
                    Structured Date
                  </button>
                  <button
                    type="button"
                    onClick={() => setTimelineType("custom")}
                    className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                      timelineType === "custom"
                        ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm"
                        : "text-gray-500 hover:text-gray-700 dark:text-gray-400"
                    }`}
                  >
                    Custom text
                  </button>
                </div>
              </div>

              {timelineType === "structured" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                      Start Date *
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      onBlur={() => handleBlur("startDate")}
                      className={getInputFieldClass("startDate")}
                    />
                    {renderError("startDate")}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                      Estimated Completion *
                    </label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      onBlur={() => handleBlur("endDate")}
                      className={getInputFieldClass("endDate")}
                    />
                    {renderError("endDate")}
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                    Custom Timeline Description *
                  </label>
                  <input
                    type="text"
                    value={customTimeline}
                    onChange={(e) => setCustomTimeline(e.target.value)}
                    onBlur={() => handleBlur("customTimeline")}
                    placeholder="e.g. 4 weeks total. Phase 1 (Week 1-2), Phase 2 (Week 3-4)"
                    className={getInputFieldClass("customTimeline")}
                  />
                  {renderError("customTimeline")}
                </div>
              )}
            </div>

            {/* Pricing Model & currency */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-800/80 p-6 shadow-sm">
              <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">Investment (Pricing)</h2>
                </div>
                <div className="flex bg-gray-100 dark:bg-gray-850 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setPricingModel("fixed")}
                    className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                      pricingModel === "fixed"
                        ? "bg-white dark:bg-gray-750 text-blue-600 dark:text-blue-400 shadow-sm"
                        : "text-gray-500 hover:text-gray-700 dark:text-gray-400"
                    }`}
                  >
                    Fixed Price
                  </button>
                  <button
                    type="button"
                    onClick={() => setPricingModel("milestone")}
                    className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                      pricingModel === "milestone"
                        ? "bg-white dark:bg-gray-750 text-blue-600 dark:text-blue-400 shadow-sm"
                        : "text-gray-500 hover:text-gray-700 dark:text-gray-400"
                    }`}
                  >
                    Milestones
                  </button>
                </div>
              </div>

              {/* Currency Dropdown */}
              <div className="mb-4">
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                  Currency Select
                </label>
                <select
                  value={currency.code}
                  onChange={(e) => {
                    const selected = CURRENCIES.find(c => c.code === e.target.value);
                    if (selected) setCurrency(selected);
                  }}
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-900 py-2.5 px-3.5 text-sm shadow-sm focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100"
                >
                  {CURRENCIES.map(c => (
                    <option key={c.code} value={c.code}>{c.label}</option>
                  ))}
                </select>
              </div>

              {pricingModel === "fixed" ? (
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                    Fixed Price Amount ({currency.symbol}) *
                  </label>
                  <input
                    type="number"
                    value={fixedAmount}
                    onChange={(e) => setFixedAmount(e.target.value === "" ? "" : Number(e.target.value))}
                    onBlur={() => handleBlur("fixedAmount")}
                    placeholder="e.g. 5000"
                    className={getInputFieldClass("fixedAmount")}
                  />
                  {renderError("fixedAmount")}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Milestone Breakdown</span>
                    <button
                      type="button"
                      onClick={addMilestone}
                      className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Milestone
                    </button>
                  </div>

                  <div className="space-y-3">
                    {milestones.map((m, index) => (
                      <div key={m.id} className="flex gap-2 items-center p-3 border border-gray-100 dark:border-gray-800 rounded-xl bg-gray-50/40 dark:bg-gray-950/30">
                        <div className="flex-grow grid grid-cols-1 md:grid-cols-12 gap-2">
                          <div className="md:col-span-8">
                            <input
                              type="text"
                              value={m.description}
                              onChange={(e) => updateMilestone(m.id, { description: e.target.value })}
                              placeholder={`Milestone #${index + 1} Description`}
                              className="w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 py-1.5 px-3 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none text-gray-900 dark:text-gray-100"
                            />
                          </div>
                          <div className="md:col-span-4 relative">
                            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-medium">{currency.symbol}</span>
                            <input
                              type="number"
                              value={m.amount || ""}
                              onChange={(e) => updateMilestone(m.id, { amount: Number(e.target.value) || 0 })}
                              placeholder="Amount"
                              className="w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 py-1.5 pl-7 pr-3 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none text-gray-900 dark:text-gray-100"
                            />
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeMilestone(m.id)}
                          className="text-gray-400 hover:text-red-500 p-1 rounded hover:bg-red-50 dark:hover:bg-red-950/20"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  {showAllErrors && errors.milestones && (
                    <p className="text-xs text-red-600 dark:text-red-400 font-medium">
                      {errors.milestones}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Terms / Notes */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-800/80 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100 dark:border-gray-800">
                <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Terms &amp; Notes</h2>
              </div>

              <div>
                <textarea
                  rows={4}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Revision policy, payment schedules, and any client responsibilities..."
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-900 py-2.5 px-3.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100"
                />
              </div>
            </div>

          </div>

          {/* Right Live Preview Panel */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Live Preview
              </h2>
              <span className="text-xs font-semibold px-2 py-1 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400">
                Real-Time Preview
              </span>
            </div>

            {/* Interactive Preview Canvas */}
            <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 sm:p-8 shadow-lg text-gray-800 dark:text-gray-100 transition-colors">
              <div className="mb-6 pb-4 border-b border-gray-100 dark:border-gray-800">
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block mb-1">
                  PROJECT PROPOSAL
                </span>
                <h3 className="text-xl font-extrabold text-gray-900 dark:text-white">
                  For: {clientName || <span className="text-gray-300 dark:text-gray-700 italic">Client Name</span>}
                </h3>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  Prepared by: <span className="font-semibold text-gray-700 dark:text-gray-300">{businessName || "Your Business"}</span>
                </p>
              </div>

              {/* Overview */}
              <div className="mb-6">
                <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
                  1. Project Overview
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">
                  {projectDescription || <span className="text-gray-300 dark:text-gray-700 italic">No project description provided yet.</span>}
                </p>
              </div>

              {/* Deliverables */}
              <div className="mb-6">
                <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
                  2. Scope &amp; Deliverables
                </h4>
                <ul className="space-y-1.5 pl-4 list-disc text-xs text-gray-600 dark:text-gray-400">
                  {deliverables.map(d => (
                    <li key={d.id}>
                      {d.description || <span className="text-gray-300 dark:text-gray-700 italic">Empty deliverable description</span>}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Timeline */}
              <div className="mb-6">
                <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
                  3. Timeline
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-300 font-medium">
                  {timelineType === "structured" ? (
                    <>
                      Estimated Schedule: <span className="text-blue-600 dark:text-blue-400">{startDate || "Start Date"}</span> to <span className="text-blue-600 dark:text-blue-400">{endDate || "Completion Date"}</span>
                    </>
                  ) : (
                    customTimeline || <span className="text-gray-300 dark:text-gray-700 italic">No timeline defined</span>
                  )}
                </p>
              </div>

              {/* Investment */}
              <div className="mb-6 pt-4 border-t border-gray-100 dark:border-gray-800">
                <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
                  4. Investment &amp; Pricing
                </h4>

                {pricingModel === "fixed" ? (
                  <div className="bg-blue-50/50 dark:bg-blue-950/20 p-3 rounded-xl">
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider block mb-0.5">Fixed Project Fee</span>
                    <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                      {currency.symbol}{totalInvestment.toLocaleString()} {currency.code}
                    </span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {milestones.map((m, index) => (
                      <div key={m.id} className="flex justify-between items-center text-xs border-b border-gray-50 dark:border-gray-850 py-1.5">
                        <span className="text-gray-600 dark:text-gray-400">
                          {m.description || <span className="italic text-gray-300 dark:text-gray-700">Milestone #{index + 1}</span>}
                        </span>
                        <span className="font-bold text-gray-900 dark:text-white">
                          {currency.symbol}{(m.amount || 0).toLocaleString()}
                        </span>
                      </div>
                    ))}
                    <div className="flex justify-between items-center pt-2 font-bold text-sm text-blue-600 dark:text-blue-400">
                      <span>Total Investment</span>
                      <span>{currency.symbol}{totalInvestment.toLocaleString()} {currency.code}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Notes */}
              {notes && (
                <div className="border-t border-gray-100 dark:border-gray-800 pt-4">
                  <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1.5">
                    5. Terms &amp; Conditions
                  </h4>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed whitespace-pre-line">
                    {notes}
                  </p>
                </div>
              )}
            </div>

            {/* Form Validation Indicator */}
            <div className={`p-4 rounded-xl border flex items-start gap-3 transition-colors ${
              isFormValid
                ? "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/30 text-emerald-800 dark:text-emerald-400"
                : "bg-amber-50/50 dark:bg-amber-950/20 border-amber-100 dark:border-amber-900/30 text-amber-800 dark:text-amber-400"
            }`}>
              <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div className="text-xs leading-normal">
                {isFormValid ? (
                  <div className="font-semibold">
                    Proposal parameters are valid. Ready to download your PDF!
                  </div>
                ) : (
                  <div>
                    <span className="font-bold">Missing required fields:</span>
                    <ul className="list-disc list-inside mt-1 space-y-0.5 opacity-90">
                      {!businessName.trim() && <li>Your Business Name</li>}
                      {!clientName.trim() && <li>Client Name</li>}
                      {!projectDescription.trim() && <li>Project Description</li>}
                      {!deliverablesValid && <li>All Deliverables must be filled</li>}
                      {timelineType === "structured" && (!startDate || !endDate) && <li>Valid Timeline Dates</li>}
                      {timelineType === "custom" && !customTimeline.trim() && <li>Custom Timeline text</li>}
                      {pricingModel === "fixed" && fixedAmount === "" && <li>Fixed Pricing Amount</li>}
                    </ul>
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* HIDDEN PRINT-OPTIMIZED CONTAINER FOR HIGH-FIDELITY A4 PDF EXPORTS          */}
      {/* Set at exactly 794px width (96 DPI standard A4 width) positioned off-screen */}
      {/* ========================================================================= */}
      <div style={{ position: "absolute", left: "-9999px", top: "0", width: "794px", overflow: "hidden" }}>
        <div
          ref={printRef}
          style={{
            width: "794px",
            minHeight: "1123px",
            backgroundColor: "#ffffff",
            color: "#1f2937",
            padding: "48px",
            fontFamily: "system-ui, -apple-system, sans-serif",
            boxSizing: "border-box"
          }}
          className="text-gray-800"
        >
          {/* Header section */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "40px" }}>
            <div>
              <div style={{ fontSize: "12px", fontWeight: "bold", color: "#2563eb", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "4px" }}>
                Project Proposal
              </div>
              <h1 style={{ fontSize: "28px", fontWeight: "900", color: "#111827", margin: "0 0 4px 0" }}>
                {clientName || "Client Company"}
              </h1>
              <p style={{ fontSize: "12px", color: "#4b5563", margin: "0" }}>
                Prepared by: <strong>{businessName || "Your Business"}</strong>
              </p>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "11px", color: "#9ca3af" }}>Date Generated</div>
              <strong style={{ fontSize: "12px", color: "#111827" }}>
                {new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
              </strong>
            </div>
          </div>

          {/* 1. Overview */}
          <div style={{ borderTop: "2px solid #e5e7eb", paddingTop: "24px", marginBottom: "32px" }}>
            <h3 style={{ fontSize: "14px", fontWeight: "bold", color: "#111827", textTransform: "uppercase", letterSpacing: "0.5px", margin: "0 0 12px 0" }}>
              1. Project Overview &amp; Strategy
            </h3>
            <p style={{ fontSize: "12px", color: "#4b5563", whiteSpace: "pre-line", margin: "0", lineHeight: "1.6" }}>
              {projectDescription}
            </p>
          </div>

          {/* 2. Deliverables */}
          <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: "24px", marginBottom: "32px" }}>
            <h3 style={{ fontSize: "14px", fontWeight: "bold", color: "#111827", textTransform: "uppercase", letterSpacing: "0.5px", margin: "0 0 12px 0" }}>
              2. Deliverables &amp; Scope
            </h3>
            <ul style={{ margin: "0", paddingLeft: "20px", fontSize: "12px", color: "#4b5563", lineHeight: "1.6" }}>
              {deliverables.map(d => (
                <li key={d.id} style={{ marginBottom: "6px" }}>{d.description}</li>
              ))}
            </ul>
          </div>

          {/* 3. Timeline */}
          <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: "24px", marginBottom: "32px" }}>
            <h3 style={{ fontSize: "14px", fontWeight: "bold", color: "#111827", textTransform: "uppercase", letterSpacing: "0.5px", margin: "0 0 12px 0" }}>
              3. Proposed Timeline
            </h3>
            <p style={{ fontSize: "12px", color: "#4b5563", margin: "0", lineHeight: "1.5" }}>
              {timelineType === "structured" ? (
                <>
                  Project kick-off scheduled for <strong>{startDate}</strong>, with estimated completion and final delivery on <strong>{endDate}</strong>.
                </>
              ) : (
                customTimeline
              )}
            </p>
          </div>

          {/* 4. Financial Plan */}
          <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: "24px", marginBottom: "32px" }}>
            <h3 style={{ fontSize: "14px", fontWeight: "bold", color: "#111827", textTransform: "uppercase", letterSpacing: "0.5px", margin: "0 0 12px 0" }}>
              4. Investment Structure
            </h3>

            {pricingModel === "fixed" ? (
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#f9fafb", padding: "16px", borderRadius: "8px" }}>
                <span style={{ fontSize: "12px", color: "#4b5563", fontWeight: "bold" }}>Total Project Fee (Flat)</span>
                <span style={{ fontSize: "18px", fontWeight: "bold", color: "#2563eb" }}>
                  {currency.symbol}{totalInvestment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {currency.code}
                </span>
              </div>
            ) : (
              <div>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px", marginBottom: "16px" }}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid #e5e7eb" }}>
                      <th style={{ padding: "8px", textAlign: "left", fontWeight: "bold" }}>Milestone Description</th>
                      <th style={{ padding: "8px", textAlign: "right", fontWeight: "bold", width: "120px" }}>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {milestones.map(m => (
                      <tr key={m.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                        <td style={{ padding: "10px 8px", color: "#4b5563" }}>{m.description}</td>
                        <td style={{ padding: "10px 8px", textAlign: "right", fontWeight: "bold", color: "#111827" }}>
                          {currency.symbol}{m.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div style={{ display: "flex", justifyContent: "flex-end", padding: "8px 0" }}>
                  <div style={{ textAlign: "right" }}>
                    <span style={{ fontSize: "11px", color: "#9ca3af", textTransform: "uppercase" }}>Total Proposed Investment</span>
                    <div style={{ fontSize: "18px", fontWeight: "bold", color: "#2563eb", marginTop: "4px" }}>
                      {currency.symbol}{totalInvestment.toLocaleString(undefined, { minimumFractionDigits: 2 })} {currency.code}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 5. Notes */}
          {notes ? (
            <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: "24px", marginTop: "24px" }}>
              <h3 style={{ fontSize: "13px", fontWeight: "bold", color: "#111827", textTransform: "uppercase", letterSpacing: "0.5px", margin: "0 0 8px 0" }}>
                5. Terms &amp; Provisions
              </h3>
              <p style={{ fontSize: "11px", color: "#4b5563", whiteSpace: "pre-line", margin: "0", lineHeight: "1.6" }}>
                {notes}
              </p>
            </div>
          ) : null}

          {/* Footer branding */}
          <div style={{ borderTop: "1px solid #f3f4f6", paddingTop: "12px", marginTop: "auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "10px", color: "#9ca3af" }}>
              Generated via Freelance Ops Toolkit • Proposal Generator
            </span>
            <span style={{ fontSize: "10px", color: "#9ca3af" }}>
              Zero-Server • Secure &amp; Private
            </span>
          </div>

        </div>
      </div>

    </div>
  );
}
