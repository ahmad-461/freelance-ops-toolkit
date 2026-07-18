"use client";

import React, { useState, useRef } from "react";
import { exportToPdf } from "@/lib/pdf-export";
import { ToolHero } from "@/components/layout/ToolHero";
import { NDAVisual } from "@/components/layout/ToolHeroVisuals";
import {
  Download,
  Calendar,
  Info,
  CheckCircle2,
  Briefcase,
  Scale,
  ShieldAlert
} from "lucide-react";

export default function NdaGenerator() {
  // --- Form State ---
  const [party1Name, setParty1Name] = useState("");
  const [party2Name, setParty2Name] = useState("");
  const [effectiveDate, setEffectiveDate] = useState("");
  const [confidentialityDuration, setConfidentialityDuration] = useState("3 years");
  const [ndaType, setNdaType] = useState<"mutual" | "oneway">("mutual");
  const [jurisdiction, setJurisdiction] = useState<"US" | "UK">("US");

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

  if (!party1Name.trim()) {
    errors.party1Name = "Party 1 name is required.";
  }
  if (!party2Name.trim()) {
    errors.party2Name = "Party 2 name is required.";
  }
  if (!effectiveDate) {
    errors.effectiveDate = "Effective date is required.";
  }
  if (!confidentialityDuration.trim()) {
    errors.confidentialityDuration = "Confidentiality duration is required.";
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
      const cleanFilename = `NDA_${party1Name.replace(/\s+/g, "_")}_${party2Name.replace(/\s+/g, "_")}.pdf`;
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
        title="NDA Generator"
        description="Quickly draft a professional Mutual or One-way Non-Disclosure Agreement to safeguard your proprietary data and IP terms."
        actionLabel="Draft NDA ↓"
        visual={<NDAVisual />}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Form top action bar */}
        <div id="tool-form" className="scroll-mt-12 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-slate-200/60 dark:border-slate-800/60 pb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">NDA Builder</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 font-medium">Configure disclosing parties, durations, and protective provisions.</p>
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

            {/* General NDA Frame */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-800/80 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100 dark:border-gray-800">
                <Scale className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">NDA Framework</h2>
              </div>

              <div className="space-y-4">
                {/* NDA Type */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                    Agreement Type *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setNdaType("mutual")}
                      className={`py-2.5 px-4 rounded-xl border text-sm font-semibold transition-all ${
                        ndaType === "mutual"
                          ? "border-blue-600 bg-blue-50/50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400"
                          : "border-gray-200 dark:border-gray-800 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800"
                      }`}
                    >
                      Mutual (Two-way)
                    </button>
                    <button
                      type="button"
                      onClick={() => setNdaType("oneway")}
                      className={`py-2.5 px-4 rounded-xl border text-sm font-semibold transition-all ${
                        ndaType === "oneway"
                          ? "border-blue-600 bg-blue-50/50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400"
                          : "border-gray-200 dark:border-gray-800 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800"
                      }`}
                    >
                      One-way
                    </button>
                  </div>
                </div>

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
                    {ndaType === "mutual" ? "Party 1 Name *" : "Disclosing Party (You) *"}
                  </label>
                  <input
                    type="text"
                    value={party1Name}
                    onChange={(e) => setParty1Name(e.target.value)}
                    onBlur={() => handleBlur("party1Name")}
                    placeholder="e.g. Pixelcraft Digital Studio LLC"
                    className={getInputFieldClass("party1Name")}
                  />
                  {renderError("party1Name")}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                    {ndaType === "mutual" ? "Party 2 Name *" : "Receiving Party (Client) *"}
                  </label>
                  <input
                    type="text"
                    value={party2Name}
                    onChange={(e) => setParty2Name(e.target.value)}
                    onBlur={() => handleBlur("party2Name")}
                    placeholder="e.g. Acme Industries Inc."
                    className={getInputFieldClass("party2Name")}
                  />
                  {renderError("party2Name")}
                </div>
              </div>
            </div>

            {/* Dates & Duration */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-800/80 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100 dark:border-gray-800">
                <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Terms &amp; Dates</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                    Effective Date *
                  </label>
                  <input
                    type="date"
                    value={effectiveDate}
                    onChange={(e) => setEffectiveDate(e.target.value)}
                    onBlur={() => handleBlur("effectiveDate")}
                    className={getInputFieldClass("effectiveDate")}
                  />
                  {renderError("effectiveDate")}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                    Confidentiality Duration *
                  </label>
                  <input
                    type="text"
                    value={confidentialityDuration}
                    onChange={(e) => setConfidentialityDuration(e.target.value)}
                    onBlur={() => handleBlur("confidentialityDuration")}
                    placeholder="e.g. 3 years, 5 years, or Indefinite"
                    className={getInputFieldClass("confidentialityDuration")}
                  />
                  {renderError("confidentialityDuration")}
                </div>
              </div>
            </div>

          </div>

          {/* Right Live Preview Panel */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" /> NDA Preview
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
                  {ndaType === "mutual" ? "MUTUAL NON-DISCLOSURE AGREEMENT" : "NON-DISCLOSURE AGREEMENT (ONE-WAY)"}
                </h3>
                <p className="text-[10px] text-gray-400 mt-1">Jurisdiction: {jurisdiction === "US" ? "United States (NY)" : "United Kingdom (E&W)"}</p>
              </div>

              <div>
                <p className="leading-relaxed">
                  This Non-Disclosure Agreement (the &quot;Agreement&quot;) is entered into as of the Effective Date of{" "}
                  <strong>{effectiveDate || "[Effective Date]"}</strong>, by and between:
                </p>
                <div className="mt-2 pl-3 border-l-2 border-blue-500 space-y-1">
                  {ndaType === "mutual" ? (
                    <>
                      <div><strong>Party 1:</strong> {party1Name || "[Party 1 Name]"}</div>
                      <div><strong>Party 2:</strong> {party2Name || "[Party 2 Name]"}</div>
                    </>
                  ) : (
                    <>
                      <div><strong>Disclosing Party:</strong> {party1Name || "[Party 1 Name]"}</div>
                      <div><strong>Receiving Party:</strong> {party2Name || "[Party 2 Name]"}</div>
                    </>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 dark:text-white uppercase mb-1">1. Purpose</h4>
                <p className="leading-relaxed">
                  {ndaType === "mutual"
                    ? "The Parties wish to disclose to each other certain confidential information of a proprietary nature for the purpose of evaluating or pursuing a mutual business relationship."
                    : "The Disclosing Party wishes to disclose certain confidential information to the Receiving Party solely for the purpose of discussing or performing business cooperation."}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 dark:text-white uppercase mb-1">
                  {ndaType === "mutual" ? "2. Mutual Confidentiality Obligation" : "2. Confidentiality Obligation"}
                </h4>
                <p className="leading-relaxed">
                  {ndaType === "mutual"
                    ? `Both Parties shall keep all confidential information received from the other party strictly confidential. This obligation shall continue for a duration of: ${confidentialityDuration || "[Confidentiality Duration]"}.`
                    : `The Receiving Party shall keep all confidential information strictly confidential. This obligation shall continue for a duration of: ${confidentialityDuration || "[Confidentiality Duration]"}.`}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 dark:text-white uppercase mb-1">3. Standard of Care</h4>
                <p className="leading-relaxed">
                  {ndaType === "mutual"
                    ? "Each Party shall protect the other Party's Confidential Information with the same degree of care that it uses to protect its own confidential information, but no less than a reasonable standard of care."
                    : "The Receiving Party shall protect the Confidential Information using at least the same degree of care as it uses to protect its own confidential info, but not less than a reasonable standard of care."}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 dark:text-white uppercase mb-1">4. Governing Law</h4>
                <p className="leading-relaxed">
                  {jurisdiction === "US"
                    ? "This Agreement shall be governed by and construed in accordance with the laws of the State of New York, United States, without regard to conflicts of law provisions."
                    : "This Agreement shall be governed by and construed in accordance with the laws of England and Wales, and the parties submit to the exclusive jurisdiction of the English courts."}
                </p>
              </div>
            </div>

            {/* Validation helper summary */}
            <div className={`p-4 rounded-xl border flex items-start gap-3 transition-colors ${
              isFormValid
                ? "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/30 text-emerald-800 dark:text-emerald-400"
                : "bg-amber-50/50 dark:bg-amber-950/20 border-amber-100 dark:border-amber-900/30 text-amber-800 dark:text-amber-400"
            }`}>
              <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div className="text-xs leading-normal">
                {isFormValid ? (
                  <div className="font-semibold">
                    NDA framework is valid! Ready to download your PDF.
                  </div>
                ) : (
                  <div>
                    <span className="font-bold">Missing required fields:</span>
                    <ul className="list-disc list-inside mt-1 space-y-0.5 opacity-90">
                      {!party1Name.trim() && <li>{ndaType === "mutual" ? "Party 1 Name" : "Disclosing Party Name"}</li>}
                      {!party2Name.trim() && <li>{ndaType === "mutual" ? "Party 2 Name" : "Receiving Party Name"}</li>}
                      {!effectiveDate && <li>Effective Date</li>}
                      {!confidentialityDuration.trim() && <li>Confidentiality Duration</li>}
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
              {ndaType === "mutual" ? "MUTUAL NON-DISCLOSURE AGREEMENT" : "NON-DISCLOSURE AGREEMENT (ONE-WAY)"}
            </h1>
            <div style={{ width: "60px", height: "3px", backgroundColor: "#2563eb", margin: "12px auto" }} />
          </div>

          {/* Intro & Parties Block */}
          <div style={{ fontSize: "12px", lineHeight: "1.6", color: "#374151", marginBottom: "24px" }}>
            This Non-Disclosure Agreement (the &quot;Agreement&quot;) is made and entered into as of the Effective Date of{" "}
            <strong>{effectiveDate}</strong>, by and between:
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginTop: "12px", backgroundColor: "#f9fafb", padding: "16px", borderRadius: "8px" }}>
              <div>
                <strong style={{ color: "#111827" }}>
                  {ndaType === "mutual" ? "PARTY 1:" : "DISCLOSING PARTY:"}
                </strong>
                <div style={{ marginTop: "4px" }}>{party1Name}</div>
              </div>
              <div>
                <strong style={{ color: "#111827" }}>
                  {ndaType === "mutual" ? "PARTY 2:" : "RECEIVING PARTY:"}
                </strong>
                <div style={{ marginTop: "4px" }}>{party2Name}</div>
              </div>
            </div>
          </div>

          {/* Agreement Provisions */}
          <div style={{ fontSize: "12px", lineHeight: "1.6", color: "#374151" }}>

            <div style={{ marginBottom: "20px" }}>
              <h3 style={{ fontSize: "13px", fontWeight: "bold", color: "#111827", textTransform: "uppercase", margin: "0 0 6px 0" }}>
                1. Purpose
              </h3>
              <p style={{ margin: "0" }}>
                {ndaType === "mutual"
                  ? "The Parties wish to disclose to each other certain confidential information of a proprietary nature for the purpose of evaluating or pursuing a mutual business relationship."
                  : "The Disclosing Party wishes to disclose certain confidential information to the Receiving Party solely for the purpose of discussing or performing business cooperation."}
              </p>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <h3 style={{ fontSize: "13px", fontWeight: "bold", color: "#111827", textTransform: "uppercase", margin: "0 0 6px 0" }}>
                2. Confidentiality Obligation
              </h3>
              <p style={{ margin: "0" }}>
                {ndaType === "mutual"
                  ? `Both Parties shall keep all confidential information received from the other party strictly confidential. This obligation shall continue for a duration of: ${confidentialityDuration}.`
                  : `The Receiving Party shall keep all confidential information strictly confidential. This obligation shall continue for a duration of: ${confidentialityDuration}.`}
              </p>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <h3 style={{ fontSize: "13px", fontWeight: "bold", color: "#111827", textTransform: "uppercase", margin: "0 0 6px 0" }}>
                3. Standard of Care
              </h3>
              <p style={{ margin: "0" }}>
                {ndaType === "mutual"
                  ? "Each Party shall protect the other Party's Confidential Information with the same degree of care that it uses to protect its own, but no less than a reasonable standard of care."
                  : "The Receiving Party shall protect the Confidential Information using at least the same degree of care as it uses to protect its own confidential info, but not less than a reasonable standard of care."}
              </p>
            </div>

            <div style={{ marginBottom: "32px" }}>
              <h3 style={{ fontSize: "13px", fontWeight: "bold", color: "#111827", textTransform: "uppercase", margin: "0 0 6px 0" }}>
                4. Governing Law &amp; Jurisdiction
              </h3>
              <p style={{ margin: "0" }}>
                {jurisdiction === "US"
                  ? "This Agreement and all disputes arising out of or in connection with it shall be governed by and construed in accordance with the laws of the State of New York, United States, without regard to conflicts of law principles."
                  : "This Agreement and all disputes arising out of or in connection with it shall be governed by and construed in accordance with the laws of England and Wales. Both parties consent to the exclusive jurisdiction of the English courts."}
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
                <div style={{ marginTop: "6px", fontWeight: "bold", color: "#111827" }}>
                  {ndaType === "mutual" ? "Party 1 Representative" : "Disclosing Party Representative"}
                </div>
                <div style={{ fontSize: "11px", color: "#4b5563" }}>Date: ________________________</div>
              </div>
              <div>
                <div style={{ borderBottom: "1px solid #9ca3af", height: "40px" }} />
                <div style={{ marginTop: "6px", fontWeight: "bold", color: "#111827" }}>
                  {ndaType === "mutual" ? "Party 2 Representative" : "Receiving Party Representative"}
                </div>
                <div style={{ fontSize: "11px", color: "#4b5563" }}>Date: ________________________</div>
              </div>
            </div>
          </div>

          {/* Print Footer */}
          <div style={{ borderTop: "1px solid #f3f4f6", paddingTop: "12px", marginTop: "auto", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "10px", color: "#9ca3af" }}>
            <span>Generated via Freelance Ops Toolkit • NDA Generator</span>
            <span>Client-Side Security • Zero Database</span>
          </div>

        </div>
      </div>

    </div>
  );
}
