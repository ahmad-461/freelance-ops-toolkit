"use client";

import React, { useState, useRef } from "react";
import { exportToPdf } from "@/lib/pdf-export";
import { ToolHero } from "@/components/layout/ToolHero";
import { PortfolioCaseStudyVisual } from "@/components/layout/ToolHeroVisuals";
import {
  Plus,
  Trash2,
  Download,
  Image as ImageIcon,
  CheckCircle,
  AlertCircle,
  FileText,
  User,
  Quote,
  Eye
} from "lucide-react";

interface Metric {
  id: string;
  label: string;
  value: string;
}

interface UploadedImage {
  id: string;
  base64: string;
  name: string;
}

export default function CaseStudyBuilder() {
  const [projectName, setProjectName] = useState("");
  const [clientName, setClientName] = useState("");
  const [keepClientConfidential, setKeepClientConfidential] = useState(false);

  const [problem, setProblem] = useState("");
  const [approach, setApproach] = useState("");

  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [images, setImages] = useState<UploadedImage[]>([]);

  const [testimonial, setTestimonial] = useState("");
  const [testimonialAttribution, setTestimonialAttribution] = useState("");

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showAllErrors, setShowAllErrors] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const printRef = useRef<HTMLDivElement>(null);

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  // --- Image Upload Handler ---
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const filesArray = Array.from(e.target.files);

    if (images.length + filesArray.length > 3) {
      alert("You can upload a maximum of 3 images.");
      return;
    }

    filesArray.forEach(file => {
      if (file.size > 2 * 1024 * 1024) {
        alert(`Image "${file.name}" exceeds the 2MB size limit.`);
        return;
      }
      if (!file.type.startsWith("image/")) {
        alert(`File "${file.name}" is not a valid image file.`);
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setImages(prev => [
            ...prev,
            { id: `img-${Date.now()}-${Math.random()}`, base64: reader.result as string, name: file.name }
          ]);
        }
      };
      reader.readAsDataURL(file);
    });

    // Reset input value so same file can be uploaded if deleted
    e.target.value = "";
  };

  const removeImage = (id: string) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };

  // --- Metrics Handlers ---
  const addMetric = () => {
    setMetrics(prev => [...prev, { id: `metric-${Date.now()}`, label: "", value: "" }]);
  };

  const updateMetric = (id: string, field: "label" | "value", value: string) => {
    setMetrics(prev => prev.map(m => (m.id === id ? { ...m, [field]: value } : m)));
  };

  const removeMetric = (id: string) => {
    setMetrics(prev => prev.filter(m => m.id !== id));
  };

  // --- Validation ---
  const errors: Record<string, string> = {};
  if (!projectName.trim()) {
    errors.projectName = "Project name is required.";
  }
  if (!problem.trim()) {
    errors.problem = "Problem / challenge details are required.";
  }
  if (!approach.trim()) {
    errors.approach = "Approach / solution details are required.";
  }

  const isFormValid = Object.keys(errors).length === 0;

  const renderError = (field: string) => {
    const isTouched = touched[field] || showAllErrors;
    if (isTouched && errors[field]) {
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
    const isTouched = touched[field] || showAllErrors;
    const hasError = isTouched && errors[field];
    return `w-full rounded-xl border ${
      hasError
        ? "border-red-300 dark:border-red-800 bg-red-50/50 dark:bg-red-950/20 focus:ring-red-500 focus:border-red-500"
        : "border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-900 focus:ring-blue-500 focus:border-blue-500"
    } py-2.5 px-3.5 text-sm shadow-sm transition-all focus:outline-none focus:ring-2 text-gray-900 dark:text-gray-100`;
  };

  const handleDownloadPdf = async () => {
    setTouched({ projectName: true, problem: true, approach: true });
    setShowAllErrors(true);
    if (!isFormValid) {
      alert("Please correct validation errors before exporting.");
      return;
    }

    if (printRef.current) {
      setIsExporting(true);
      const filename = `Case_Study_${projectName.trim().replace(/\s+/g, "_")}.pdf`;
      await exportToPdf(printRef.current, {
        filename,
        onComplete: () => setIsExporting(false),
        onError: () => setIsExporting(false)
      });
    }
  };

  const displayClientName = keepClientConfidential
    ? "Confidential Client"
    : clientName.trim()
    ? clientName.trim()
    : "Confidential Client";

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen pb-16 transition-colors duration-200">
      <ToolHero
        title="Portfolio Case Study Builder"
        description="Generate structured, highly professional case studies showcasing project outcomes, core metrics, client testimonials, and visual deliverables."
        actionLabel="Build Case Study ↓"
        visual={<PortfolioCaseStudyVisual />}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Form top action bar */}
        <div id="tool-form" className="scroll-mt-12 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-slate-200/60 dark:border-slate-800/60 pb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Case Study Configurator</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 font-medium">Outline challenges, solutions, deliverables, and testimonials below.</p>
          </div>
          <button
            onClick={handleDownloadPdf}
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

          {/* Left Panel: Inputs */}
          <div className="lg:col-span-7 space-y-6">

            {/* General Info */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-800/80 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100 dark:border-gray-800">
                <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">General Info</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                    Project Name *
                  </label>
                  <input
                    type="text"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    onBlur={() => handleBlur("projectName")}
                    placeholder="e.g. E-Commerce Redesign"
                    className={getInputFieldClass("projectName")}
                  />
                  {renderError("projectName")}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                    Client Name
                  </label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    disabled={keepClientConfidential}
                    placeholder={keepClientConfidential ? "Confidential Client" : "e.g. Acme Corporation"}
                    className="w-full rounded-xl border border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-900 py-2.5 px-3.5 text-sm shadow-sm transition-all focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 dark:text-gray-100 disabled:opacity-50"
                  />

                  <div className="flex items-center gap-2 mt-2">
                    <input
                      type="checkbox"
                      id="confidential"
                      checked={keepClientConfidential}
                      onChange={(e) => setKeepClientConfidential(e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <label htmlFor="confidential" className="text-xs font-semibold text-gray-600 dark:text-gray-400 cursor-pointer select-none">
                      Keep client name confidential
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Core Narrative */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-800/80 p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 mb-2 pb-3 border-b border-gray-100 dark:border-gray-800">
                <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Core Narrative</h2>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                  The Problem / Challenge *
                </label>
                <textarea
                  rows={4}
                  value={problem}
                  onChange={(e) => setProblem(e.target.value)}
                  onBlur={() => handleBlur("problem")}
                  placeholder="Describe the initial situation, the client's pain points, or what goals needed to be met..."
                  className={`w-full rounded-xl border ${
                    (touched.problem || showAllErrors) && errors.problem
                      ? "border-red-300 dark:border-red-800 bg-red-50/50 dark:bg-red-950/20"
                      : "border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-900"
                  } py-2.5 px-3.5 text-sm shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100`}
                />
                {renderError("problem")}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                  The Approach / Solution *
                </label>
                <textarea
                  rows={4}
                  value={approach}
                  onChange={(e) => setApproach(e.target.value)}
                  onBlur={() => handleBlur("approach")}
                  placeholder="Explain how you solved the problem, the specific actions you took, and your creative process..."
                  className={`w-full rounded-xl border ${
                    (touched.approach || showAllErrors) && errors.approach
                      ? "border-red-300 dark:border-red-800 bg-red-50/50 dark:bg-red-950/20"
                      : "border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-900"
                  } py-2.5 px-3.5 text-sm shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100`}
                />
                {renderError("approach")}
              </div>
            </div>

            {/* Results / Metrics */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-800/80 p-6 shadow-sm">
              <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">Results &amp; Metrics</h2>
                </div>
                <button
                  type="button"
                  onClick={addMetric}
                  className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" /> Add Metric
                </button>
              </div>

              {metrics.length > 0 ? (
                <div className="space-y-3">
                  {metrics.map((m) => (
                    <div key={m.id} className="flex gap-2 items-center">
                      <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={m.label}
                          onChange={(e) => updateMetric(m.id, "label", e.target.value)}
                          placeholder="Metric label (e.g. Sales Increase)"
                          className="w-full rounded-xl border border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-900 py-2 px-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 dark:text-gray-100"
                        />
                        <input
                          type="text"
                          value={m.value}
                          onChange={(e) => updateMetric(m.id, "value", e.target.value)}
                          placeholder="Value (e.g. +34% or $20k)"
                          className="w-full rounded-xl border border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-900 py-2 px-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 dark:text-gray-100"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeMetric(m.id)}
                        className="text-gray-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-400 italic text-center py-4">No metrics added yet. Click &quot;Add Metric&quot; to highlight key results.</p>
              )}
            </div>

            {/* Optional Project Images */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-800/80 p-6 shadow-sm">
              <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">Project Images (Up to 3)</h2>
                </div>
                <span className="text-xs text-gray-400">{images.length}/3 uploaded</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                {images.map((img) => (
                  <div key={img.id} className="relative rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 aspect-video group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img.base64} alt={img.name} className="object-cover w-full h-full" />
                    <button
                      type="button"
                      onClick={() => removeImage(img.id)}
                      className="absolute top-1 right-1 p-1 rounded-lg bg-red-600 text-white shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {images.length < 3 && (
                <div className="relative border-2 border-dashed border-gray-300 dark:border-gray-800 rounded-xl p-6 text-center hover:bg-gray-50 dark:hover:bg-gray-850/30 transition-all cursor-pointer">
                  <input
                    type="file"
                    accept="image/png, image/jpeg, image/jpg"
                    multiple
                    onChange={handleImageUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">Click to upload portfolio images</p>
                  <p className="text-[10px] text-gray-400 mt-1">PNG or JPEG, up to 2MB each</p>
                </div>
              )}
            </div>

            {/* Testimonial Quote */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-800/80 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100 dark:border-gray-800">
                <Quote className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Client Testimonial</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                    Testimonial Quote
                  </label>
                  <textarea
                    rows={3}
                    value={testimonial}
                    onChange={(e) => setTestimonial(e.target.value)}
                    placeholder="e.g. This redesigned store doubled our transaction volume within the first week of deployment!"
                    className="w-full rounded-xl border border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-900 py-2.5 px-3.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                    Attribution (Name &amp; Role)
                  </label>
                  <input
                    type="text"
                    value={testimonialAttribution}
                    onChange={(e) => setTestimonialAttribution(e.target.value)}
                    placeholder="e.g. Sarah Connor, VP of Growth at Acme Corp"
                    className="w-full rounded-xl border border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-900 py-2.5 px-3.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>
            </div>

          </div>

          {/* Right Panel: Live Preview */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Eye className="w-5 h-5 text-emerald-500" /> Live Preview
              </h2>
              <span className="text-xs font-semibold px-2 py-1 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400">
                A4 Layout Aspect
              </span>
            </div>

            {/* Interactive Preview Container */}
            <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 sm:p-8 shadow-lg text-gray-800 dark:text-gray-100 transition-colors">
              <div className="mb-6 pb-4 border-b border-gray-100 dark:border-gray-800">
                <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest block mb-1">
                  CASE STUDY
                </span>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white leading-tight">
                  {projectName || <span className="text-gray-300 dark:text-gray-700 italic">Project Name</span>}
                </h3>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  Client: <span className="font-semibold text-gray-700 dark:text-gray-300">{displayClientName}</span>
                </p>
              </div>

              {/* Narratives */}
              <div className="space-y-4 mb-6">
                <div>
                  <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">The Problem</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">
                    {problem || <span className="text-gray-300 dark:text-gray-700 italic">Provide problem narrative...</span>}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">The Solution</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">
                    {approach || <span className="text-gray-300 dark:text-gray-700 italic">Provide solution narrative...</span>}
                  </p>
                </div>
              </div>

              {/* Metrics Highlights */}
              {metrics.length > 0 && (
                <div className="mb-6 pt-4 border-t border-gray-100 dark:border-gray-800">
                  <h4 className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">Key Results</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {metrics.map((m) => (
                      <div key={m.id} className="p-3 bg-blue-50/50 dark:bg-blue-950/20 rounded-xl border border-blue-100/40 dark:border-blue-900/10">
                        <span className="text-[10px] text-gray-400 uppercase tracking-wider block leading-snug">{m.label || "Metric"}</span>
                        <span className="text-base font-bold text-blue-600 dark:text-blue-400 block mt-1">{m.value || "—"}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Images Preview with dynamic layout logic */}
              {images.length > 0 && (
                <div className="mb-6 pt-4 border-t border-gray-100 dark:border-gray-800">
                  <h4 className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">Project Deliverables</h4>

                  {images.length === 1 && (
                    <div className="rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800 aspect-video w-full bg-gray-50">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={images[0].base64} alt={images[0].name} className="object-cover w-full h-full" />
                    </div>
                  )}

                  {images.length === 2 && (
                    <div className="grid grid-cols-2 gap-3">
                      {images.map((img) => (
                        <div key={img.id} className="rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800 aspect-square bg-gray-50">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={img.base64} alt={img.name} className="object-cover w-full h-full" />
                        </div>
                      ))}
                    </div>
                  )}

                  {images.length === 3 && (
                    <div className="grid grid-cols-3 gap-2 sm:gap-3">
                      {images.map((img) => (
                        <div key={img.id} className="rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800 aspect-square bg-gray-50">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={img.base64} alt={img.name} className="object-cover w-full h-full" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Testimonial Preview */}
              {testimonial.trim() && (
                <div className="mb-2 pt-4 border-t border-gray-100 dark:border-gray-800">
                  <figure className="relative bg-gray-50 dark:bg-gray-950/30 p-4 rounded-xl border border-gray-100 dark:border-gray-850">
                    <p className="text-xs italic text-gray-600 dark:text-gray-300 relative z-10 leading-relaxed">
                      &ldquo;{testimonial.trim()}&rdquo;
                    </p>
                    {testimonialAttribution.trim() && (
                      <figcaption className="mt-3 text-[10px] font-bold text-gray-500 dark:text-gray-400">
                        &mdash; {testimonialAttribution.trim()}
                      </figcaption>
                    )}
                  </figure>
                </div>
              )}

            </div>

            {/* Inline validation errors */}
            <div className={`p-4 rounded-xl border flex items-start gap-3 transition-colors ${
              isFormValid
                ? "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/30 text-emerald-800 dark:text-emerald-400"
                : showAllErrors
                ? "bg-red-50/50 dark:bg-red-950/20 border-red-100 dark:border-red-900/30 text-red-800 dark:text-red-400"
                : "bg-amber-50/50 dark:bg-amber-950/20 border-amber-100 dark:border-amber-900/30 text-amber-800 dark:text-amber-400"
            }`}>
              {isFormValid ? (
                <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              )}
              <div className="text-xs leading-normal">
                {isFormValid ? (
                  <div className="font-semibold">
                    Case study parameters are valid. Ready to export!
                  </div>
                ) : (
                  <div>
                    <span className="font-bold">Missing required parameters:</span>
                    <ul className="list-disc list-inside mt-1 space-y-0.5 opacity-95">
                      {!projectName.trim() && <li>Project Name</li>}
                      {!problem.trim() && <li>The Problem / Challenge</li>}
                      {!approach.trim() && <li>The Approach / Solution</li>}
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
      {/* ========================================================================= */}
      <div style={{ position: "absolute", left: "-9999px", top: "0", width: "794px", overflow: "hidden" }}>
        <div
          ref={printRef}
          style={{
            width: "794px",
            minHeight: "1123px",
            backgroundColor: "#ffffff",
            color: "#1f2937",
            padding: "56px",
            fontFamily: "system-ui, -apple-system, sans-serif",
            boxSizing: "border-box"
          }}
          className="text-gray-800"
        >
          {/* Header section */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "40px" }}>
            <div>
              <div style={{ fontSize: "11px", fontWeight: "bold", color: "#2563eb", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "4px" }}>
                Project Case Study
              </div>
              <h1 style={{ fontSize: "28px", fontWeight: "900", color: "#111827", margin: "0 0 4px 0" }}>
                {projectName || "Case Study Project"}
              </h1>
              <p style={{ fontSize: "12px", color: "#4b5563", margin: "0" }}>
                Client Name: <strong>{displayClientName}</strong>
              </p>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "10px", color: "#9ca3af" }}>Date Generated</div>
              <strong style={{ fontSize: "12px", color: "#111827" }}>
                {new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
              </strong>
            </div>
          </div>

          {/* 1. Problem / Challenge */}
          <div style={{ borderTop: "2px solid #e5e7eb", paddingTop: "24px", marginBottom: "28px" }}>
            <h3 style={{ fontSize: "13px", fontWeight: "bold", color: "#111827", textTransform: "uppercase", letterSpacing: "0.5px", margin: "0 0 10px 0" }}>
              1. The Challenge
            </h3>
            <p style={{ fontSize: "12px", color: "#4b5563", whiteSpace: "pre-line", margin: "0", lineHeight: "1.6" }}>
              {problem}
            </p>
          </div>

          {/* 2. Approach / Solution */}
          <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: "24px", marginBottom: "28px" }}>
            <h3 style={{ fontSize: "13px", fontWeight: "bold", color: "#111827", textTransform: "uppercase", letterSpacing: "0.5px", margin: "0 0 10px 0" }}>
              2. The Solution &amp; Approach
            </h3>
            <p style={{ fontSize: "12px", color: "#4b5563", whiteSpace: "pre-line", margin: "0", lineHeight: "1.6" }}>
              {approach}
            </p>
          </div>

          {/* 3. Metrics/Results */}
          {metrics.length > 0 && (
            <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: "24px", marginBottom: "28px" }}>
              <h3 style={{ fontSize: "13px", fontWeight: "bold", color: "#111827", textTransform: "uppercase", letterSpacing: "0.5px", margin: "0 0 16px 0" }}>
                3. Business Results &amp; Metrics
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px" }}>
                {metrics.map(m => (
                  <div key={m.id} style={{ backgroundColor: "#f8fafc", padding: "16px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                    <span style={{ fontSize: "10px", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px", display: "block" }}>
                      {m.label || "Result"}
                    </span>
                    <strong style={{ fontSize: "16px", color: "#2563eb", display: "block", marginTop: "4px" }}>
                      {m.value || "—"}
                    </strong>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. Portfolio Images */}
          {images.length > 0 && (
            <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: "24px", marginBottom: "28px" }}>
              <h3 style={{ fontSize: "13px", fontWeight: "bold", color: "#111827", textTransform: "uppercase", letterSpacing: "0.5px", margin: "0 0 16px 0" }}>
                4. Visual Assets &amp; Deliverables
              </h3>

              {images.length === 1 && (
                <div style={{ borderRadius: "8px", overflow: "hidden", border: "1px solid #e2e8f0", width: "100%", height: "240px", backgroundColor: "#f8fafc" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={images[0].base64} alt={images[0].name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              )}

              {images.length === 2 && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px" }}>
                  {images.map(img => (
                    <div key={img.id} style={{ borderRadius: "8px", overflow: "hidden", border: "1px solid #e2e8f0", height: "180px", backgroundColor: "#f8fafc" }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img.base64} alt={img.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                  ))}
                </div>
              )}

              {images.length === 3 && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
                  {images.map(img => (
                    <div key={img.id} style={{ borderRadius: "8px", overflow: "hidden", border: "1px solid #e2e8f0", height: "140px", backgroundColor: "#f8fafc" }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img.base64} alt={img.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 5. Testimonial Quote */}
          {testimonial.trim() && (
            <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: "24px", marginBottom: "28px" }}>
              <div style={{ backgroundColor: "#f8fafc", borderLeft: "4px solid #2563eb", padding: "16px", borderRadius: "0 8px 8px 0" }}>
                <p style={{ fontSize: "12px", fontStyle: "italic", color: "#334155", margin: "0", lineHeight: "1.6" }}>
                  &ldquo;{testimonial.trim()}&rdquo;
                </p>
                {testimonialAttribution.trim() && (
                  <p style={{ fontSize: "10px", fontWeight: "bold", color: "#64748b", margin: "8px 0 0 0" }}>
                    &mdash; {testimonialAttribution.trim()}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Footer branding */}
          <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: "12px", marginTop: "auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "9px", color: "#9ca3af" }}>
              Generated via Freelance Ops Toolkit • Portfolio Case Study Builder
            </span>
            <span style={{ fontSize: "9px", color: "#9ca3af" }}>
              Secure &amp; Private • Client-facing Visuals
            </span>
          </div>

        </div>
      </div>

    </div>
  );
}
