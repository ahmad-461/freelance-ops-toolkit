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
import ToolSeoContent from "@/components/layout/ToolSeoContent";
import { formatPdfDate } from "@/components/shared/PdfComponents";

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
    { id: "1", description: "Initial concept design & conceptual setup", amount: 1500 }
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
              <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-gray-100 dark:border-gray-850">
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

            {/* Premium Executive Styled Live Preview Page */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-lg text-slate-900 dark:text-slate-100 transition-colors relative">
              <div className="space-y-6 text-left">

                {/* Header Row: Company Brand + Title */}
                <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b border-slate-100 dark:border-slate-800 pb-6">
                  {/* Left: Branding */}
                  <div className="space-y-2">
                    <span className="text-xs font-black tracking-widest text-blue-600 dark:text-blue-400 uppercase">
                      PROJECT PROPOSAL
                    </span>
                    <h3 className="text-sm font-extrabold tracking-tight text-slate-900 dark:text-white">
                      {businessName || "Your Business Name"}
                    </h3>
                  </div>

                  {/* Right: Wordmark */}
                  <div className="sm:text-right">
                    <h3 className="text-2xl font-black tracking-[0.12em] uppercase text-slate-900 dark:text-white leading-none">
                      PROPOSAL
                    </h3>
                    <div className="h-1 bg-blue-600 dark:bg-blue-500 w-12 sm:ml-auto mt-3" />
                  </div>
                </div>

                {/* Executive Metadata block */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 px-4 rounded-xl">
                  <div>
                    <span className="block text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                      PREPARED FOR
                    </span>
                    <span className="block text-xs font-extrabold text-slate-900 dark:text-white mt-1 truncate">
                      {clientName || "Acme Corporation"}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                      DATE OF ISSUE
                    </span>
                    <span className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mt-1">
                      {new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                      ESTIMATED TIMELINE
                    </span>
                    <span className="block text-xs font-semibold text-slate-900 dark:text-white mt-1">
                      {timelineType === "structured" ? (
                        <>
                          {startDate ? formatPdfDate(startDate) : "TBD"} to {endDate ? formatPdfDate(endDate) : "TBD"}
                        </>
                      ) : (
                        customTimeline || "Specified scope terms"
                      )}
                    </span>
                  </div>
                </div>

                {/* 1. Project Strategy */}
                <div>
                  <span className="block text-[9px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-1.5">
                    1. PROJECT OVERVIEW
                  </span>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line">
                    {projectDescription || <span className="italic text-slate-400 dark:text-slate-500">No project description defined yet.</span>}
                  </p>
                </div>

                {/* 2. Scope / Deliverables List */}
                <div className="pt-2">
                  <span className="block text-[9px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-2">
                    2. SERVICES &amp; DELIVERABLES
                  </span>
                  <ul className="space-y-1.5 pl-4 list-disc text-xs text-slate-600 dark:text-slate-400">
                    {deliverables.map(d => (
                      <li key={d.id}>
                        {d.description || <span className="italic text-slate-300 dark:text-slate-700">Empty scope description</span>}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 3. Pricing & Investments */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                  <span className="block text-[9px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-2.5">
                    3. FINANCIAL STRUCTURE
                  </span>

                  {pricingModel === "fixed" ? (
                    <div className="space-y-3">
                      <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400 pb-1.5">
                        <span>Project Fee (Flat Pricing Model)</span>
                        <span className="font-mono font-semibold">
                          {currency.symbol}{totalInvestment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </div>
                      <div className="border-t-2 border-b-2 border-slate-950 dark:border-slate-100 bg-slate-50 dark:bg-slate-800/40 py-3 px-4 flex justify-between items-center">
                        <span className="text-xs font-black tracking-widest uppercase text-slate-900 dark:text-white">
                          Total Investment
                        </span>
                        <span className="text-lg font-black font-mono text-slate-900 dark:text-white">
                          {currency.symbol}{totalInvestment.toLocaleString(undefined, { minimumFractionDigits: 2 })} {currency.code}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="space-y-1.5">
                        {milestones.map((m, idx) => (
                          <div key={m.id} className="flex justify-between text-xs text-slate-600 dark:text-slate-400 border-b border-slate-50 dark:border-slate-850 py-1">
                            <span>
                              {m.description || <span className="italic text-slate-300 dark:text-slate-700">Milestone #{idx + 1}</span>}
                            </span>
                            <span className="font-mono font-semibold">
                              {currency.symbol}{(m.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="border-t-2 border-b-2 border-slate-950 dark:border-slate-100 bg-slate-50 dark:bg-slate-800/40 py-3 px-4 flex justify-between items-center">
                        <span className="text-xs font-black tracking-widest uppercase text-slate-900 dark:text-white">
                          Total Investment
                        </span>
                        <span className="text-lg font-black font-mono text-slate-900 dark:text-white">
                          {currency.symbol}{totalInvestment.toLocaleString(undefined, { minimumFractionDigits: 2 })} {currency.code}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* 4. Terms / Notes */}
                {notes && (
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                    <span className="block text-[9px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-1">
                      4. TERMS &amp; CONDITIONS
                    </span>
                    <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400 whitespace-pre-line">
                      {notes}
                    </p>
                  </div>
                )}

              </div>
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

        <ToolSeoContent
          h2Title="Close More Deals with a Free Proposal Generator"
          intro="Drafting clean, persuasive business proposals is fundamental to securing premium clients and scaling your freelance income. Our free proposal generator lets you build customized, structured scope-of-work documents with professional deliverables and clear budgets. Render high-fidelity, print-optimized A4 PDFs instantly and present your solutions with complete operational authority."
          sections={[
            {
              title: "How to Write a Client Proposal That Wins Projects",
              prose: "A winning freelance proposal template must solve a real business problem rather than just listing technical skills. Start by defining the client's current pain points and state how your solution directly solves them. Outline the key deliverables sequentially as distinct phases of work, providing a highly logical timeline. Finish by specifying the total financial investment clearly—either as a flat project-based fee or divided into structured project milestones."
            },
            {
              title: "Essential Sections Every Freelance Proposal Needs",
              prose: "To protect your business from scope creep, ensure your proposals include three core pillars: an explicit list of deliverables, an estimated project completion timeline, and transparent billing terms. Adding brief notes regarding revision limits, project dependencies, and standard communication procedures establishes realistic boundaries, ensuring client-contractor alignment from day one."
            },
            {
              title: "Transitioning from Proposal to Signed Contract",
              prose: "Once a client approves your proposed scope of work and pricing model, immediately transition the agreed terms into a formal, binding contract. Consolidating the details of your proposal into standard legal agreements guarantees that both parties have agreed to the same scope, payment structures, and intellectual property rights before work officially begins."
            }
          ]}
          internalLinks={[
            { label: "Contract Template Builder", href: "/tools/contract-generator" },
            { label: "Project Scope Estimator", href: "/tools/scope-estimator" }
          ]}
        />

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
            color: "#0f172a",
            padding: "56px",
            fontFamily: "system-ui, -apple-system, sans-serif",
            boxSizing: "border-box",
            position: "relative"
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "32px", height: "100%" }}>

            {/* Executive top-to-bottom header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "1px solid #e2e8f0", paddingBottom: "24px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <h4 style={{ fontSize: "14px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.5px", margin: "0", color: "#0f172a" }}>
                  {businessName || "Your Business Name"}
                </h4>
                <p style={{ fontSize: "11px", color: "#475569", margin: "0" }}>
                  Professional Creative &amp; Consulting Services
                </p>
              </div>

              <div style={{ textAlign: "right" }}>
                <h1 style={{ fontSize: "32px", fontWeight: "900", letterSpacing: "0.15em", textTransform: "uppercase", margin: "0", color: "#0f172a", lineHeight: "1" }}>
                  PROPOSAL
                </h1>
                <div style={{ height: "4px", backgroundColor: "#2563eb", width: "48px", marginTop: "12px", marginLeft: "auto" }} />
              </div>
            </div>

            {/* Executive Metadata Block */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "16px",
              padding: "16px",
              backgroundColor: "#f8fafc",
              borderBottom: "1px solid #e2e8f0",
              borderRadius: "8px"
            }}>
              <div>
                <span style={{ fontSize: "9px", fontWeight: "bold", color: "#64748b", textTransform: "uppercase", letterSpacing: "1.5px" }}>
                  PREPARED FOR
                </span>
                <span style={{ fontSize: "12px", fontWeight: "bold", color: "#0f172a", display: "block", marginTop: "4px" }}>
                  {clientName || "Client Name"}
                </span>
              </div>
              <div>
                <span style={{ fontSize: "9px", fontWeight: "bold", color: "#64748b", textTransform: "uppercase", letterSpacing: "1.5px" }}>
                  DATE OF ISSUE
                </span>
                <span style={{ fontSize: "12px", fontWeight: "600", color: "#334155", display: "block", marginTop: "4px" }}>
                  {new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
              </div>
              <div>
                <span style={{ fontSize: "9px", fontWeight: "bold", color: "#64748b", textTransform: "uppercase", letterSpacing: "1.5px" }}>
                  TIMELINE
                </span>
                <span style={{ fontSize: "12px", fontWeight: "600", color: "#0f172a", display: "block", marginTop: "4px" }}>
                  {timelineType === "structured" ? (
                    <>
                      {startDate ? formatPdfDate(startDate) : "TBD"} to {endDate ? formatPdfDate(endDate) : "TBD"}
                    </>
                  ) : (
                    customTimeline
                  )}
                </span>
              </div>
            </div>

            {/* 1. Overview */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <span style={{ fontSize: "9px", fontWeight: "bold", color: "#2563eb", textTransform: "uppercase", letterSpacing: "1.5px" }}>
                1. Project Strategy &amp; Overview
              </span>
              <p style={{ fontSize: "11px", color: "#475569", whiteSpace: "pre-line", margin: "0", lineHeight: "1.6" }}>
                {projectDescription}
              </p>
            </div>

            {/* 2. Scope & Deliverables */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <span style={{ fontSize: "9px", fontWeight: "bold", color: "#2563eb", textTransform: "uppercase", letterSpacing: "1.5px" }}>
                2. Scope &amp; Deliverables
              </span>
              <ul style={{ margin: "0", paddingLeft: "16px", fontSize: "11px", color: "#475569", lineHeight: "1.6" }}>
                {deliverables.map(d => (
                  <li key={d.id} style={{ marginBottom: "4px" }}>{d.description}</li>
                ))}
              </ul>
            </div>

            {/* 3. Pricing Milestones / Plan */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <span style={{ fontSize: "9px", fontWeight: "bold", color: "#2563eb", textTransform: "uppercase", letterSpacing: "1.5px" }}>
                3. Financial &amp; Milestone Investment
              </span>

              {pricingModel === "fixed" ? (
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#475569", paddingBottom: "4px" }}>
                  <span>Flat project pricing model terms</span>
                  <span style={{ fontFamily: "monospace", fontWeight: "bold" }}>
                    {currency.symbol}{totalInvestment.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  {milestones.map((m, idx) => (
                    <div key={m.id} style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#475569", borderBottom: "1px solid #f1f5f9", paddingBottom: "4px" }}>
                      <span>{m.description || `Milestone #${idx + 1}`}</span>
                      <span style={{ fontFamily: "monospace", fontWeight: "bold" }}>
                        {currency.symbol}{m.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Minimalist Corporate Highlight Box for Total Investment */}
              <div style={{
                borderTop: "2px solid #0f172a",
                borderBottom: "2px solid #0f172a",
                backgroundColor: "#f1f5f9",
                padding: "12px 16px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "12px"
              }}>
                <span style={{ fontSize: "11px", fontWeight: "900", textTransform: "uppercase", letterSpacing: "1px", color: "#0f172a" }}>
                  Total Project Investment
                </span>
                <span style={{ fontSize: "18px", fontWeight: "900", fontFamily: "monospace", color: "#0f172a" }}>
                  {currency.symbol}{totalInvestment.toLocaleString(undefined, { minimumFractionDigits: 2 })} {currency.code}
                </span>
              </div>
            </div>

            {/* 4. Notes & Provisions */}
            {notes ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "12px" }}>
                <span style={{ fontSize: "9px", fontWeight: "bold", color: "#2563eb", textTransform: "uppercase", letterSpacing: "1.5px" }}>
                  4. Additional Terms &amp; Provisions
                </span>
                <p style={{ fontSize: "10px", color: "#475569", whiteSpace: "pre-line", margin: "0", lineHeight: "1.6" }}>
                  {notes}
                </p>
              </div>
            ) : null}

          </div>

          {/* PDF Footer element */}
          <div style={{
            position: "absolute",
            bottom: "56px",
            left: "56px",
            right: "56px",
            borderTop: "1px solid #e2e8f0",
            paddingTop: "16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            textTransform: "uppercase",
            fontSize: "8px",
            color: "#94a3b8",
            letterSpacing: "0.5px"
          }}>
            <span>
              Generated via Freelance Ops Toolkit
            </span>
            <span style={{ fontWeight: "600" }}>
              Empowering independent operations
            </span>
          </div>

        </div>
      </div>

    </div>
  );
}
