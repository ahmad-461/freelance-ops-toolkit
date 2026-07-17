"use client";

import React, { useState, useRef } from "react";
import { exportToPdf } from "@/lib/pdf-export";
import {
  FileSignature,
  Plus,
  Trash2,
  Download,
  DollarSign,
  Info,
  CheckCircle2,
  Briefcase,
  Layers,
  Scale,
  ShieldAlert
} from "lucide-react";

interface Deliverable {
  id: string;
  description: string;
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

export default function ContractGenerator() {
  // --- Form State ---
  const [contractType, setContractType] = useState<"fixed" | "hourly">("fixed");
  const [freelancerName, setFreelancerName] = useState("");
  const [clientName, setClientName] = useState("");
  const [paymentTerms, setPaymentTerms] = useState("50% upfront, 50% on completion");
  const [revisionLimit, setRevisionLimit] = useState<number>(3);
  const [terminationClause, setTerminationClause] = useState(
    "Either party may terminate this Contract by providing 14 days written notice. In the event of termination, Client shall pay for all work completed up to the termination date."
  );
  const [jurisdiction, setJurisdiction] = useState<"US" | "UK">("US");
  const [currency, setCurrency] = useState(CURRENCIES[0]);

  // Deliverables
  const [deliverables, setDeliverables] = useState<Deliverable[]>([
    { id: "1", description: "Design & development of fully responsive professional website" }
  ]);

  // --- Touch & Validation State ---
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showAllErrors, setShowAllErrors] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Print ref
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

  // --- Validation ---
  const errors: Record<string, string> = {};

  if (!freelancerName.trim()) {
    errors.freelancerName = "Freelancer/Business name is required.";
  }
  if (!clientName.trim()) {
    errors.clientName = "Client name is required.";
  }
  if (!paymentTerms.trim()) {
    errors.paymentTerms = "Payment terms are required.";
  }
  if (revisionLimit < 0) {
    errors.revisionLimit = "Revision limit must be a non-negative number.";
  }
  if (!terminationClause.trim()) {
    errors.terminationClause = "Termination clause is required.";
  }

  let deliverablesValid = deliverables.length > 0;
  deliverables.forEach(d => {
    if (!d.description.trim()) {
      deliverablesValid = false;
    }
  });

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
      alert("Please fix all invalid or missing fields before downloading PDF.");
      return;
    }

    if (printRef.current) {
      setIsExporting(true);
      const cleanFilename = `Contract_${clientName.replace(/\s+/g, "_")}.pdf`;
      await exportToPdf(printRef.current, {
        filename: cleanFilename,
        onComplete: () => setIsExporting(false),
        onError: () => setIsExporting(false)
      });
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen py-10 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Tool Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold text-sm mb-1">
              <FileSignature className="w-4 h-4" />
              <span>Operational Tools</span>
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
              Contract Template Builder
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Draft professional service contracts based on jurisdiction.
            </p>
          </div>

          <button
            onClick={handleDownload}
            disabled={isExporting}
            className={`inline-flex items-center justify-center gap-2 rounded-xl font-bold py-3.5 px-6 shadow-md transition-all ${
              isFormValid
                ? "bg-blue-600 hover:bg-blue-700 text-white hover:scale-[1.01] cursor-pointer"
                : "bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed"
            }`}
          >
            {isExporting ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
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

            {/* General Contract settings */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-800/80 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100 dark:border-gray-800">
                <Scale className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Contract Framework</h2>
              </div>

              <div className="space-y-4">
                {/* Contract Type */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                    Contract Type *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setContractType("fixed")}
                      className={`py-2.5 px-4 rounded-xl border text-sm font-semibold transition-all ${
                        contractType === "fixed"
                          ? "border-blue-600 bg-blue-50/50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400"
                          : "border-gray-200 dark:border-gray-800 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800"
                      }`}
                    >
                      Fixed-Price
                    </button>
                    <button
                      type="button"
                      onClick={() => setContractType("hourly")}
                      className={`py-2.5 px-4 rounded-xl border text-sm font-semibold transition-all ${
                        contractType === "hourly"
                          ? "border-blue-600 bg-blue-50/50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400"
                          : "border-gray-200 dark:border-gray-800 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800"
                      }`}
                    >
                      Hourly Rate
                    </button>
                  </div>
                </div>

                {/* Jurisdiction selection */}
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
                    placeholder="e.g. John Doe Consulting"
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

            {/* Scope / Deliverables list */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-800/80 p-6 shadow-sm">
              <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-2">
                  <Layers className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">Deliverables</h2>
                </div>
                <button
                  type="button"
                  onClick={addDeliverable}
                  className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" /> Add Item
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
                          placeholder={`Deliverable Description #${index + 1}`}
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

            {/* Payment & Revisions */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-800/80 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100 dark:border-gray-800">
                <DollarSign className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Payment &amp; Terms</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                    Payment Schedule Terms *
                  </label>
                  <input
                    type="text"
                    value={paymentTerms}
                    onChange={(e) => setPaymentTerms(e.target.value)}
                    onBlur={() => handleBlur("paymentTerms")}
                    placeholder="e.g. 50% upfront deposit, 50% upon final website delivery"
                    className={getInputFieldClass("paymentTerms")}
                  />
                  {renderError("paymentTerms")}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                    Revision Limit (Rounds) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={revisionLimit}
                    onChange={(e) => setRevisionLimit(Number(e.target.value))}
                    onBlur={() => handleBlur("revisionLimit")}
                    className={getInputFieldClass("revisionLimit")}
                  />
                  {renderError("revisionLimit")}
                </div>
              </div>
            </div>

            {/* Termination clause */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-800/80 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100 dark:border-gray-800">
                <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Termination Provisions</h2>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                  Termination Clause *
                </label>
                <textarea
                  rows={4}
                  value={terminationClause}
                  onChange={(e) => setTerminationClause(e.target.value)}
                  onBlur={() => handleBlur("terminationClause")}
                  className={`w-full rounded-xl border ${
                    (touched.terminationClause || showAllErrors) && errors.terminationClause
                      ? "border-red-300 dark:border-red-800 bg-red-50/50 dark:bg-red-950/20"
                      : "border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-900"
                  } py-2.5 px-3.5 text-sm focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100`}
                />
                {renderError("terminationClause")}
              </div>
            </div>

          </div>

          {/* Right Live Preview Panel */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Contract Preview
              </h2>
              <span className="text-xs font-semibold px-2 py-1 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400">
                Live Preview
              </span>
            </div>

            {/* Simulated legal paper */}
            <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 sm:p-8 shadow-lg text-gray-850 dark:text-gray-200 text-xs transition-colors space-y-4 max-h-[600px] overflow-y-auto">
              <p className="text-[10px] text-amber-600 dark:text-amber-400 font-bold border border-dashed border-amber-200 dark:border-amber-900/40 p-2.5 rounded bg-amber-50/40 dark:bg-amber-950/10 leading-normal">
                DISCLAIMER: This is a generic template for informational purposes only and does not constitute legal advice. Consult a qualified lawyer before using this document.
              </p>

              <div className="text-center pb-2 border-b border-gray-100 dark:border-gray-800">
                <h3 className="font-bold text-sm text-gray-900 dark:text-white uppercase">
                  CONTRACT FOR SERVICES ({contractType === "fixed" ? "FIXED-PRICE" : "HOURLY"})
                </h3>
                <p className="text-[10px] text-gray-400 mt-1">Jurisdiction: {jurisdiction === "US" ? "United States (NY)" : "United Kingdom (E&W)"}</p>
              </div>

              <div>
                <p className="leading-relaxed">
                  This Contract is entered into as of the Effective Date of signing, by and between:
                </p>
                <div className="mt-2 pl-3 border-l-2 border-blue-500 space-y-1">
                  <div><strong>Service Provider:</strong> {freelancerName || "[Freelancer Name]"}</div>
                  <div><strong>Client:</strong> {clientName || "[Client Name]"}</div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 dark:text-white uppercase mb-1">1. Scope of Work &amp; Deliverables</h4>
                <p className="mb-1.5 leading-relaxed">
                  {contractType === "fixed"
                    ? "The Service Provider agrees to perform and deliver the following services:"
                    : "The Service Provider agrees to perform the following services on an hourly basis:"}
                </p>
                <ul className="list-disc pl-4 space-y-1">
                  {deliverables.map(d => (
                    <li key={d.id}>{d.description || <span className="italic text-gray-300 dark:text-gray-700">Empty deliverable</span>}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 dark:text-white uppercase mb-1">
                  {contractType === "fixed" ? "2. Payment Terms" : "2. Hourly Rates &amp; Payment Terms"}
                </h4>
                <p className="leading-relaxed">
                  {contractType === "fixed"
                    ? `The Client agrees to pay the Service Provider according to the following payment terms: ${paymentTerms || "[Payment Terms]"}`
                    : `The Client agrees to pay the Service Provider according to the rate structure and terms of: ${paymentTerms || "[Payment Terms]"} (All rates denominated in ${currency.code})`}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 dark:text-white uppercase mb-1">3. Revisions</h4>
                <p className="leading-relaxed">
                  {contractType === "fixed"
                    ? `The Client is entitled to a maximum of ${revisionLimit} rounds of revisions. Any revisions exceeding this limit will be billed at the Service Provider's standard hourly rate.`
                    : `Revisions will be billed at the standard hourly rate. The Client is entitled to review progress up to ${revisionLimit} check-ins or milestones.`}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 dark:text-white uppercase mb-1">4. Termination</h4>
                <p className="leading-relaxed whitespace-pre-line">{terminationClause || "[Termination Clause Details]"}</p>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 dark:text-white uppercase mb-1">5. Governing Law</h4>
                <p className="leading-relaxed">
                  {jurisdiction === "US"
                    ? "This Contract shall be governed by and construed in accordance with the laws of the State of New York, United States, without regard to conflict of law principles."
                    : "This Contract shall be governed by and construed in accordance with the laws of England and Wales, and the parties submit to the exclusive jurisdiction of the English courts."}
                </p>
              </div>
            </div>

            {/* Validation helper */}
            <div className={`p-4 rounded-xl border flex items-start gap-3 transition-colors ${
              isFormValid
                ? "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/30 text-emerald-800 dark:text-emerald-400"
                : "bg-amber-50/50 dark:bg-amber-950/20 border-amber-100 dark:border-amber-900/30 text-amber-800 dark:text-amber-400"
            }`}>
              <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div className="text-xs leading-normal">
                {isFormValid ? (
                  <div className="font-semibold">
                    Framework is valid! Ready to download your PDF.
                  </div>
                ) : (
                  <div>
                    <span className="font-bold">Missing required fields:</span>
                    <ul className="list-disc list-inside mt-1 space-y-0.5 opacity-90">
                      {!freelancerName.trim() && <li>Freelancer Name</li>}
                      {!clientName.trim() && <li>Client Name</li>}
                      {!paymentTerms.trim() && <li>Payment Terms</li>}
                      {!terminationClause.trim() && <li>Termination Clause</li>}
                      {!deliverablesValid && <li>At least one valid deliverable</li>}
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
              CONTRACT FOR SERVICES ({contractType === "fixed" ? "FIXED-PRICE" : "HOURLY"})
            </h1>
            <div style={{ width: "60px", height: "3px", backgroundColor: "#2563eb", margin: "12px auto" }} />
          </div>

          {/* Parties Block */}
          <div style={{ fontSize: "12px", lineHeight: "1.6", color: "#374151", marginBottom: "24px" }}>
            This Contract for Services (the &quot;Agreement&quot;) is entered into as of the date of signing, by and between the following parties:
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

          {/* Clauses */}
          <div style={{ fontSize: "12px", lineHeight: "1.6", color: "#374151" }}>

            <div style={{ marginBottom: "20px" }}>
              <h3 style={{ fontSize: "13px", fontWeight: "bold", color: "#111827", textTransform: "uppercase", margin: "0 0 6px 0" }}>
                1. Scope of Work &amp; Deliverables
              </h3>
              <p style={{ margin: "0 0 8px 0" }}>
                The Service Provider agrees to perform and render the following deliverables for the Client:
              </p>
              <ul style={{ margin: "0", paddingLeft: "20px" }}>
                {deliverables.map(d => (
                  <li key={d.id} style={{ marginBottom: "4px" }}>{d.description}</li>
                ))}
              </ul>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <h3 style={{ fontSize: "13px", fontWeight: "bold", color: "#111827", textTransform: "uppercase", margin: "0 0 6px 0" }}>
                2. Compensation &amp; Payments
              </h3>
              <p style={{ margin: "0" }}>
                {contractType === "fixed"
                  ? `The Client shall compensate the Service Provider according to the following agreed schedule: ${paymentTerms}`
                  : `The Client shall compensate the Service Provider on an hourly basis, under the following rate guidelines: ${paymentTerms}. All fees are represented in ${currency.code}.`}
              </p>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <h3 style={{ fontSize: "13px", fontWeight: "bold", color: "#111827", textTransform: "uppercase", margin: "0 0 6px 0" }}>
                3. Revisions &amp; Scope Creep
              </h3>
              <p style={{ margin: "0" }}>
                {contractType === "fixed"
                  ? `The client is entitled to up to ${revisionLimit} rounds of feedback/revisions. Additional requests or major structural changes will be treated as out of scope and billed at standard hourly rates.`
                  : `All reviews, feedback iterations, and deliverables will be tracked on an hourly schedule up to ${revisionLimit} milestones.`}
              </p>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <h3 style={{ fontSize: "13px", fontWeight: "bold", color: "#111827", textTransform: "uppercase", margin: "0 0 6px 0" }}>
                4. Term &amp; Termination
              </h3>
              <p style={{ margin: "0", whiteSpace: "pre-line" }}>
                {terminationClause}
              </p>
            </div>

            <div style={{ marginBottom: "32px" }}>
              <h3 style={{ fontSize: "13px", fontWeight: "bold", color: "#111827", textTransform: "uppercase", margin: "0 0 6px 0" }}>
                5. Governing Law &amp; Dispute Resolution
              </h3>
              <p style={{ margin: "0" }}>
                {jurisdiction === "US"
                  ? "This Contract and all rights and obligations hereunder shall be governed by, interpreted, and enforced in accordance with the laws of the State of New York, United States, without regard to conflicts of law principles."
                  : "This Contract and all rights and obligations hereunder shall be governed by and construed in accordance with the laws of England and Wales. Both parties consent to the exclusive jurisdiction of the courts of England and Wales."}
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
            <span>Generated via Freelance Ops Toolkit • Contract Template Builder</span>
            <span>Client-Side Security • Zero Database</span>
          </div>

        </div>
      </div>

    </div>
  );
}
