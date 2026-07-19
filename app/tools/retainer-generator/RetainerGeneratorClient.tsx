"use client";

import React, { useState, useRef } from "react";
import { exportToPdf } from "@/lib/pdf-export";
import { ToolHero } from "@/components/layout/ToolHero";
import { RetainerVisual } from "@/components/layout/ToolHeroVisuals";
import {
  CalendarClock,
  Download,
  DollarSign,
  Info,
  CheckCircle2,
  Briefcase,
  Scale,
  ShieldAlert
} from "lucide-react";
import ToolSeoContent from "@/components/layout/ToolSeoContent";

const CURRENCIES = [
  { code: "USD", symbol: "$", label: "USD ($)" },
  { code: "EUR", symbol: "€", label: "EUR (€)" },
  { code: "GBP", symbol: "£", label: "GBP (£)" },
  { code: "PKR", symbol: "Rs.", label: "PKR (Rs.)" },
  { code: "AUD", symbol: "A$", label: "AUD (A$)" },
  { code: "CAD", symbol: "C$", label: "CAD (C$)" },
  { code: "INR", symbol: "₹", label: "INR (₹)" },
];

export default function RetainerGenerator() {
  // --- Form State ---
  const [freelancerName, setFreelancerName] = useState("");
  const [clientName, setClientName] = useState("");
  const [monthlyRetainer, setMonthlyRetainer] = useState<number | "">("");
  const [includedScope, setIncludedScope] = useState("");
  const [overageRate, setOverageRate] = useState<number | "">("");
  const [renewalTerms, setRenewalTerms] = useState(
    "This agreement auto-renews monthly unless cancelled with 30 days notice."
  );
  const [jurisdiction, setJurisdiction] = useState<"US" | "UK">("US");
  const [currency, setCurrency] = useState(CURRENCIES[0]);

  // --- Touch & Validation State ---
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showAllErrors, setShowAllErrors] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Print ref
  const printRef = useRef<HTMLDivElement>(null);

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  // --- Validation ---
  const errors: Record<string, string> = {};

  if (!freelancerName.trim()) {
    errors.freelancerName = "Freelancer/Business name is required.";
  }
  if (!clientName.trim()) {
    errors.clientName = "Client name is required.";
  }
  if (monthlyRetainer === "" || monthlyRetainer < 0) {
    errors.monthlyRetainer = "Monthly retainer amount is required.";
  }
  if (!includedScope.trim()) {
    errors.includedScope = "Included monthly scope is required.";
  }
  if (overageRate === "" || overageRate < 0) {
    errors.overageRate = "Overage rate is required.";
  }
  if (!renewalTerms.trim()) {
    errors.renewalTerms = "Renewal terms are required.";
  }

  const isFormValid = Object.keys(errors).length === 0;

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
        : "border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-900 py-2.5 px-3.5 text-sm shadow-sm transition-all focus:outline-none focus:ring-2 text-gray-900 dark:text-gray-100"
    }`;
  };

  const handleDownload = async () => {
    setShowAllErrors(true);
    if (!isFormValid) {
      alert("Please fix all invalid or missing fields before downloading PDF.");
      return;
    }

    if (printRef.current) {
      setIsExporting(true);
      const cleanFilename = `Retainer_Agreement_${clientName.replace(/\s+/g, "_")}.pdf`;
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
        title="Retainer Agreement Generator"
        description="Establish stable, monthly recurring retainer agreements to guarantee your recurring revenue and reserve dedicated service bandwidth."
        actionLabel="Draft Retainer ↓"
        visual={<RetainerVisual />}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Form top action bar */}
        <div id="tool-form" className="scroll-mt-12 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-slate-200/60 dark:border-slate-800/60 pb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Retainer Configurator</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 font-medium">Define recurring allotments, payment cycles, and cancellation provisions.</p>
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

        {/* Legal disclaimer */}
        <div className="mb-8 p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 rounded-xl flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-800 dark:text-amber-400 leading-relaxed font-medium">
            DISCLAIMER: This document is a generic template and does not constitute legal advice. Consult a qualified lawyer before use.
          </p>
        </div>

        {/* Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left Inputs Section */}
          <div className="lg:col-span-7 space-y-6">

            {/* Agreement context */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-800/80 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100 dark:border-gray-800">
                <Scale className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Agreement Settings</h2>
              </div>

              <div className="space-y-4">
                {/* Jurisdiction */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                    Governing Jurisdiction *
                  </label>
                  <select
                    value={jurisdiction}
                    onChange={(e) => setJurisdiction(e.target.value as "US" | "UK")}
                    className="w-full rounded-xl border border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-900 py-2.5 px-3.5 text-sm shadow-sm focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100"
                  >
                    <option value="US">United States (State of New York)</option>
                    <option value="UK">United Kingdom (England &amp; Wales)</option>
                  </select>
                </div>

                {/* Currency select */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                    Currency Selection
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
              </div>
            </div>

            {/* Parties */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-800/80 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100 dark:border-gray-800">
                <Briefcase className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Parties</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                    Freelancer Name / Business *
                  </label>
                  <input
                    type="text"
                    value={freelancerName}
                    onChange={(e) => setFreelancerName(e.target.value)}
                    onBlur={() => handleBlur("freelancerName")}
                    placeholder="e.g. Pixelcraft Studio LLC"
                    className={getInputFieldClass("freelancerName")}
                  />
                  {renderError("freelancerName")}
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
                    placeholder="e.g. Acme Corp LLC"
                    className={getInputFieldClass("clientName")}
                  />
                  {renderError("clientName")}
                </div>
              </div>
            </div>

            {/* Scope details */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-800/80 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100 dark:border-gray-800">
                <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Included Scope</h2>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                  Monthly Deliverables or Included Hours *
                </label>
                <textarea
                  rows={4}
                  value={includedScope}
                  onChange={(e) => setIncludedScope(e.target.value)}
                  onBlur={() => handleBlur("includedScope")}
                  placeholder="e.g. 20 hours of design & development support per month, or: 4 brand illustrations, 1 SEO audit, and weekly sync."
                  className={`w-full rounded-xl border ${
                    (touched.includedScope || showAllErrors) && errors.includedScope
                      ? "border-red-300 dark:border-red-800 bg-red-50/50 dark:bg-red-950/20"
                      : "border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-900"
                  } py-2.5 px-3.5 text-sm focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100`}
                />
                {renderError("includedScope")}
              </div>
            </div>

            {/* Retainer Pricing */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-800/80 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100 dark:border-gray-800">
                <DollarSign className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Financial Structure</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                    Monthly Retainer Amount ({currency.symbol}) *
                  </label>
                  <input
                    type="number"
                    value={monthlyRetainer}
                    onChange={(e) => setMonthlyRetainer(e.target.value === "" ? "" : Number(e.target.value))}
                    onBlur={() => handleBlur("monthlyRetainer")}
                    placeholder="e.g. 3000"
                    className={getInputFieldClass("monthlyRetainer")}
                  />
                  {renderError("monthlyRetainer")}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                    Hourly Overage Rate ({currency.symbol}) *
                  </label>
                  <input
                    type="number"
                    value={overageRate}
                    onChange={(e) => setOverageRate(e.target.value === "" ? "" : Number(e.target.value))}
                    onBlur={() => handleBlur("overageRate")}
                    placeholder="e.g. 150"
                    className={getInputFieldClass("overageRate")}
                  />
                  {renderError("overageRate")}
                </div>
              </div>
            </div>

            {/* Renewal terms */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-800/80 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100 dark:border-gray-800">
                <CalendarClock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Renewal Terms</h2>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                  Renewal Conditions *
                </label>
                <textarea
                  rows={3}
                  value={renewalTerms}
                  onChange={(e) => setRenewalTerms(e.target.value)}
                  onBlur={() => handleBlur("renewalTerms")}
                  className={`w-full rounded-xl border ${
                    (touched.renewalTerms || showAllErrors) && errors.renewalTerms
                      ? "border-red-300 dark:border-red-800 bg-red-50/50 dark:bg-red-950/20"
                      : "border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-900"
                  } py-2.5 px-3.5 text-sm focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100`}
                />
                {renderError("renewalTerms")}
              </div>
            </div>

          </div>

          {/* Right Live Preview Panel */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Agreement Preview
              </h2>
              <span className="text-xs font-semibold px-2 py-1 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400">
                Live Preview
              </span>
            </div>

            {/* Simulated legal paper */}
            <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 sm:p-8 shadow-lg text-gray-850 dark:text-gray-200 text-xs transition-colors space-y-4 max-h-[500px] overflow-y-auto">
              <p className="text-[10px] text-amber-600 dark:text-amber-400 font-bold border border-dashed border-amber-200 dark:border-amber-900/40 p-2.5 rounded bg-amber-50/40 dark:bg-amber-950/10 leading-normal">
                DISCLAIMER: This is a generic template for informational purposes only and does not constitute legal advice. Consult a qualified lawyer before using this document.
              </p>

              <div className="text-center pb-2 border-b border-gray-100 dark:border-gray-800">
                <h3 className="font-bold text-sm text-gray-900 dark:text-white uppercase">
                  MONTHLY RETAINER AGREEMENT
                </h3>
                <p className="text-[10px] text-gray-400 mt-1">Jurisdiction: {jurisdiction === "US" ? "United States (NY)" : "United Kingdom (E&W)"}</p>
              </div>

              <div>
                <p className="leading-relaxed">
                  This Retainer Agreement is entered into by and between:
                </p>
                <div className="mt-2 pl-3 border-l-2 border-blue-500 space-y-1">
                  <div><strong>Service Provider:</strong> {freelancerName || "[Freelancer Name]"}</div>
                  <div><strong>Client:</strong> {clientName || "[Client Name]"}</div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 dark:text-white uppercase mb-1">1. Services &amp; Deliverables</h4>
                <p className="leading-relaxed whitespace-pre-line">
                  {includedScope || <span className="italic text-gray-300 dark:text-gray-700">No scope/deliverables described yet.</span>}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 dark:text-white uppercase mb-1">2. Monthly Retainer Fee</h4>
                <p className="leading-relaxed">
                  The Client shall pay the Service Provider a flat retainer amount of{" "}
                  <strong>
                    {currency.symbol}
                    {monthlyRetainer !== "" ? monthlyRetainer.toLocaleString() : "[Amount]"}
                  </strong>{" "}
                  per month, due in advance of each service period.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 dark:text-white uppercase mb-1">3. Overage Fees</h4>
                <p className="leading-relaxed">
                  Any work requested by the Client that exceeds the specified monthly allotment will be billed at an hourly overage rate of{" "}
                  <strong>
                    {currency.symbol}
                    {overageRate !== "" ? overageRate.toLocaleString() : "[Rate]"}
                  </strong>{" "}
                  per hour.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 dark:text-white uppercase mb-1">4. Renewal &amp; Termination</h4>
                <p className="leading-relaxed whitespace-pre-line">{renewalTerms || "[Renewal details]"}</p>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 dark:text-white uppercase mb-1">5. Governing Law</h4>
                <p className="leading-relaxed">
                  {jurisdiction === "US"
                    ? "This Agreement shall be governed by and construed under the laws of the State of New York, United States."
                    : "This Agreement shall be governed by and construed under the laws of England and Wales."}
                </p>
              </div>
            </div>

            {/* Validation summary */}
            <div className={`p-4 rounded-xl border flex items-start gap-3 transition-colors ${
              isFormValid
                ? "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/30 text-emerald-800 dark:text-emerald-400"
                : "bg-amber-50/50 dark:bg-amber-950/20 border-amber-100 dark:border-amber-900/30 text-amber-800 dark:text-amber-400"
            }`}>
              <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div className="text-xs leading-normal">
                {isFormValid ? (
                  <div className="font-semibold">
                    Retainer framework is valid! Ready to download your PDF.
                  </div>
                ) : (
                  <div>
                    <span className="font-bold">Missing required fields:</span>
                    <ul className="list-disc list-inside mt-1 space-y-0.5 opacity-90">
                      {!freelancerName.trim() && <li>Freelancer/Business Name</li>}
                      {!clientName.trim() && <li>Client Name</li>}
                      {monthlyRetainer === "" && <li>Monthly Retainer Amount</li>}
                      {!includedScope.trim() && <li>Included Scope details</li>}
                      {overageRate === "" && <li>Overage Rate</li>}
                      {!renewalTerms.trim() && <li>Renewal Conditions</li>}
                    </ul>
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>

        <ToolSeoContent
          h2Title="Secure Predictable Income with a Monthly Retainer Agreement Freelancer"
          intro="Transitioning your business from fluctuating project-based cycles to predictable recurring revenue is key to long-term freelance sustainability. Our monthly retainer agreement freelancer generator allows you to draft standard retainer arrangements immediately. Reserve your dedicated bandwidth, secure advanced monthly compensation, and manage overage expectations with operational clarity."
          sections={[
            {
              title: "How a Retainer Agreement Benefits Your Freelance Business",
              prose: "A retainer arrangement shifts the client relationship from transactional to collaborative. By guaranteeing a stable monthly income, it allows you to plan your business expenses confidently and reduce the pressure of continuous client prospecting. For clients, it secures a dedicated expert who understands their operations, guaranteeing immediate support without the overhead of negotiating new one-off project estimates."
            },
            {
              title: "Setting Up Your First Freelance Retainer Contract",
              prose: "To structure a monthly retainer contract generator model correctly, define two critical components: the monthly included scope (either represented as a specific pool of billable hours or dedicated ongoing deliverables) and the hourly overage rate. Specifying an overage rate ensures you are compensated fairly if client requests exceed their standard monthly allotment."
            },
            {
              title: "Pitfalls to Avoid in Long-Term Client Retainers",
              prose: "The most common issue in retainer-based partnerships is 'scope creep,' where clients gradually request extra work beyond the initial agreement boundaries. To prevent this, always document included services in detail, log hours precisely using our Time Tracker, and include a clear, written 30-day cancellation clause."
            }
          ]}
          internalLinks={[
            { label: "Time Tracker", href: "/tools/time-tracker" },
            { label: "Client Intake Form Builder", href: "/tools/client-intake-form" }
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
            color: "#1f2937",
            padding: "54px",
            fontFamily: "system-ui, -apple-system, sans-serif",
            boxSizing: "border-box"
          }}
          className="text-gray-800"
        >
          {/* Top Legal Disclaimer */}
          <div style={{
            border: "1px dashed #d1d5db",
            padding: "12px",
            borderRadius: "6px",
            backgroundColor: "#fef3c7",
            color: "#92400e",
            fontSize: "10px",
            lineHeight: "1.5",
            marginBottom: "30px",
            fontWeight: "500"
          }}>
            DISCLAIMER: This is a generic template for informational purposes only and does not constitute legal advice. Consult a qualified lawyer before using this document.
          </div>

          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <h1 style={{ fontSize: "20px", fontWeight: "bold", textTransform: "uppercase", color: "#111827", margin: "0" }}>
              MONTHLY RETAINER AGREEMENT
            </h1>
            <div style={{ width: "60px", height: "3px", backgroundColor: "#2563eb", margin: "12px auto" }} />
          </div>

          {/* Parties Block */}
          <div style={{ fontSize: "12px", lineHeight: "1.6", color: "#374151", marginBottom: "24px" }}>
            This Monthly Retainer Agreement (the &quot;Agreement&quot;) is entered into by and between the following parties:
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginTop: "12px", backgroundColor: "#f9fafb", padding: "16px", borderRadius: "8px" }}>
              <div>
                <strong style={{ color: "#111827" }}>SERVICE PROVIDER:</strong>
                <div style={{ marginTop: "4px" }}>{freelancerName || "[Freelancer Name]"}</div>
              </div>
              <div>
                <strong style={{ color: "#111827" }}>CLIENT:</strong>
                <div style={{ marginTop: "4px" }}>{clientName || "[Client Name]"}</div>
              </div>
            </div>
          </div>

          {/* Provisions */}
          <div style={{ fontSize: "12px", lineHeight: "1.6", color: "#374151" }}>

            <div style={{ marginBottom: "20px" }}>
              <h3 style={{ fontSize: "13px", fontWeight: "bold", color: "#111827", textTransform: "uppercase", margin: "0 0 6px 0" }}>
                1. Services &amp; Deliverables
              </h3>
              <p style={{ margin: "0", whiteSpace: "pre-line" }}>
                {includedScope}
              </p>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <h3 style={{ fontSize: "13px", fontWeight: "bold", color: "#111827", textTransform: "uppercase", margin: "0 0 6px 0" }}>
                2. Monthly Retainer Fee
              </h3>
              <p style={{ margin: "0" }}>
                The Client shall pay the Service Provider a flat retainer amount of{" "}
                <strong>
                  {currency.symbol}
                  {monthlyRetainer !== "" ? monthlyRetainer.toLocaleString() : "0"}
                </strong>{" "}
                per month, due in advance of each service period.
              </p>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <h3 style={{ fontSize: "13px", fontWeight: "bold", color: "#111827", textTransform: "uppercase", margin: "0 0 6px 0" }}>
                3. Overage Fees
              </h3>
              <p style={{ margin: "0" }}>
                Any work requested by the Client that exceeds the specified monthly allotment will be billed at an hourly overage rate of{" "}
                <strong>
                  {currency.symbol}
                  {overageRate !== "" ? overageRate.toLocaleString() : "0"}
                </strong>{" "}
                per hour.
              </p>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <h3 style={{ fontSize: "13px", fontWeight: "bold", color: "#111827", textTransform: "uppercase", margin: "0 0 6px 0" }}>
                4. Renewal &amp; Termination
              </h3>
              <p style={{ margin: "0", whiteSpace: "pre-line" }}>
                {renewalTerms}
              </p>
            </div>

            <div style={{ marginBottom: "32px" }}>
              <h3 style={{ fontSize: "13px", fontWeight: "bold", color: "#111827", textTransform: "uppercase", margin: "0 0 6px 0" }}>
                5. Governing Law
              </h3>
              <p style={{ margin: "0" }}>
                {jurisdiction === "US"
                  ? "This Agreement shall be governed by and construed under the laws of the State of New York, United States."
                  : "This Agreement shall be governed by and construed under the laws of England and Wales."}
              </p>
            </div>

          </div>

          {/* Signatures */}
          <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: "30px", marginTop: "40px", fontSize: "12px" }}>
            <p style={{ margin: "0 0 30px 0", fontStyle: "italic", color: "#4b5563" }}>
              IN WITNESS WHEREOF, the parties hereto have executed this Agreement as of the date written below.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px" }}>
              <div>
                <div style={{ borderBottom: "1px solid #9ca3af", height: "40px" }} />
                <div style={{ marginTop: "6px", fontWeight: "bold", color: "#111827" }}>Service Provider Representative</div>
                <div style={{ fontSize: "11px", color: "#4b5563" }}>Date: ________________________</div>
              </div>
              <div>
                <div style={{ borderBottom: "1px solid #9ca3af", height: "40px" }} />
                <div style={{ marginTop: "6px", fontWeight: "bold", color: "#111827" }}>Client Representative</div>
                <div style={{ fontSize: "11px", color: "#4b5563" }}>Date: ________________________</div>
              </div>
            </div>
          </div>

          {/* Print Footer */}
          <div style={{ borderTop: "1px solid #f3f4f6", paddingTop: "12px", marginTop: "auto", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "10px", color: "#9ca3af" }}>
            <span>Generated via Freelance Ops Toolkit • Retainer Agreement Generator</span>
            <span>Client-Side Security • Zero Database</span>
          </div>

        </div>
      </div>

    </div>
  );
}
