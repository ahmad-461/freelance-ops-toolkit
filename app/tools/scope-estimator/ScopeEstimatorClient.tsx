"use client";

import React, { useState, useEffect } from "react";
import { ToolHero } from "@/components/layout/ToolHero";
import { ScopeEstimatorVisual } from "@/components/layout/ToolHeroVisuals";
import {
  Plus,
  Info,
  Layers,
  Trash2
} from "lucide-react";
import ToolSeoContent from "@/components/layout/ToolSeoContent";

interface Deliverable {
  id: string;
  name: string;
  complexity: "Simple" | "Medium" | "Complex";
  checked: boolean;
}

const PROJECT_TYPES = [
  { value: "Website", label: "Website Development" },
  { value: "App", label: "Mobile or Web Application" },
  { value: "Design", label: "Brand or Product Design" },
  { value: "Writing/Content", label: "Copywriting & Content Strategy" },
  { value: "Consulting", label: "Professional Consulting" },
  { value: "Other", label: "Other / Custom Project" }
];

// Default deliverables per project type as approved
const DEFAULT_DELIVERABLES: Record<string, string[]> = {
  Website: ["Homepage Design & Dev", "Contact Page & Inquiry Form", "Blog Setup & Integration", "Basic SEO & Performance Setup"],
  App: ["User Auth & Account Setup", "Database Integration & Schema Design", "External API Integrations", "Admin Dashboard UI"],
  Design: ["Brand Logo & Icon Set", "Brand Styleguide & Assets", "High-fidelity UX Mockups", "Interactive Prototype"],
  "Writing/Content": ["Professional Copywriting", "Proofreading & Editing", "SEO Keywords Research", "Content Distribution Plan"],
  Consulting: ["Strategic Operations Audit", "Competitor Research Report", "One-on-One Mentoring Session", "Actionable Roadmap & Checklist"],
  Other: ["Custom Deliverable Item"]
};

/**
 * Hour ranges per complexity level (approved guidelines):
 * - Simple: 2 to 5 hours
 * - Medium: 6 to 15 hours
 * - Complex: 16 to 30 hours
 */
const COMPLEXITY_HOURS = {
  Simple: { min: 2, max: 5 },
  Medium: { min: 6, max: 15 },
  Complex: { min: 16, max: 30 }
};

export default function ScopeEstimator() {
  // Project Type & Deliverables list state
  const [projectType, setProjectType] = useState("Website");
  const [deliverables, setDeliverables] = useState<Deliverable[]>([]);
  const [customItemName, setCustomItemName] = useState("");

  // Populate deliverables whenever project type changes
  useEffect(() => {
    const defaultList = DEFAULT_DELIVERABLES[projectType] || [];
    const formatted = defaultList.map((name, idx) => ({
      id: `${projectType}-${idx}-${Date.now()}`,
      name,
      complexity: "Medium" as const,
      checked: true
    }));
    setDeliverables(formatted);
  }, [projectType]);

  // Handlers
  const toggleChecked = (id: string) => {
    setDeliverables(prev =>
      prev.map(item => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const handleComplexityChange = (id: string, complexity: "Simple" | "Medium" | "Complex") => {
    setDeliverables(prev =>
      prev.map(item => (item.id === id ? { ...item, complexity } : item))
    );
  };

  const addCustomDeliverable = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customItemName.trim()) return;

    const newItem: Deliverable = {
      id: `custom-${Date.now()}`,
      name: customItemName.trim(),
      complexity: "Medium",
      checked: true
    };

    setDeliverables(prev => [...prev, newItem]);
    setCustomItemName("");
  };

  const deleteDeliverable = (id: string) => {
    setDeliverables(prev => prev.filter(item => item.id !== id));
  };

  // Estimation math logic based on approved guidelines
  const selectedDeliverables = deliverables.filter(item => item.checked);

  const estimatedMinHours = selectedDeliverables.reduce(
    (sum, d) => sum + COMPLEXITY_HOURS[d.complexity].min,
    0
  );

  const estimatedMaxHours = selectedDeliverables.reduce(
    (sum, d) => sum + COMPLEXITY_HOURS[d.complexity].max,
    0
  );

  // Timeline: Midpoint divided by 25 billable hours per week
  const midpoint = (estimatedMinHours + estimatedMaxHours) / 2;
  const suggestedWeeks = Math.max(1, Math.round(midpoint / 25));
  const suggestedTimeline = `${suggestedWeeks} Week${suggestedWeeks > 1 ? "s" : ""}`;

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen pb-16 transition-colors duration-200">
      <ToolHero
        title="Project Scope Estimator"
        description="Estimate precise hour ranges and client-ready project timelines mapped directly to deliverable complexity rules. Fully client-side calculator."
        actionLabel="Estimate Scope ↓"
        visual={<ScopeEstimatorVisual />}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Outer Split layout */}
        <div id="tool-form" className="scroll-mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left panel: Estimator interactive builder (7 columns) */}
          <div className="lg:col-span-7 space-y-6">

            {/* Type & Deliverables Selector */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-800/80 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Layers className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                Configure Project Deliverables
              </h2>

              <div className="space-y-4">
                {/* Select project type */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                    Select Project Type
                  </label>
                  <select
                    value={projectType}
                    onChange={(e) => setProjectType(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-900 py-2.5 px-3.5 text-sm shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100"
                  >
                    {PROJECT_TYPES.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>

                {/* Deliverables Checklist with Rating */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                    Deliverables Checklist & Complexity Rating
                  </label>

                  <div className="space-y-3.5">
                    {deliverables.map((item) => (
                      <div
                        key={item.id}
                        className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                          item.checked
                            ? "border-blue-100 dark:border-blue-900/30 bg-blue-50/10 dark:bg-blue-950/5"
                            : "border-gray-100 dark:border-gray-850 opacity-60"
                        }`}
                      >
                        <div className="flex items-start gap-3 min-w-0">
                          <input
                            type="checkbox"
                            checked={item.checked}
                            onChange={() => toggleChecked(item.id)}
                            className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                          />
                          <span
                            className={`text-sm font-semibold truncate ${
                              item.checked ? "text-gray-900 dark:text-gray-100" : "text-gray-400 line-through"
                            }`}
                          >
                            {item.name}
                          </span>
                        </div>

                        {item.checked && (
                          <div className="flex items-center gap-2 ml-7 sm:ml-0">
                            {/* Complexity Selector */}
                            <select
                              value={item.complexity}
                              onChange={(e) => handleComplexityChange(item.id, e.target.value as "Simple" | "Medium" | "Complex")}
                              className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 py-1 px-2.5 text-xs font-medium text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            >
                              <option value="Simple">Simple (2-5 hrs)</option>
                              <option value="Medium">Medium (6-15 hrs)</option>
                              <option value="Complex">Complex (16-30 hrs)</option>
                            </select>

                            {/* Delete custom item button */}
                            {item.id.startsWith("custom-") && (
                              <button
                                type="button"
                                onClick={() => deleteDeliverable(item.id)}
                                className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Add Custom Deliverable Form */}
                <form onSubmit={addCustomDeliverable} className="flex gap-2 pt-2 border-t border-gray-100 dark:border-gray-850">
                  <input
                    type="text"
                    value={customItemName}
                    onChange={(e) => setCustomItemName(e.target.value)}
                    placeholder="Add custom deliverable item..."
                    className="flex-1 rounded-xl border border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-900 py-2 px-3.5 text-xs shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100"
                  />
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-1 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold px-4 text-xs hover:bg-blue-100/80 transition-colors"
                  >
                    <Plus className="w-4 h-4" /> Add
                  </button>
                </form>
              </div>
            </div>

            {/* Assumptions & Reference Cards */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-800/80 p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-3">
                <Info className="w-5 h-5 text-blue-500" />
                Methodology & Scope Assumptions
              </h3>
              <div className="space-y-2.5 text-xs text-gray-500 dark:text-gray-400 leading-normal">
                <p>
                  To help freelancers estimate with confidence, we apply standard complexity metrics based on years of freelance data:
                </p>
                <ul className="list-disc list-inside space-y-1.5 pl-1.5">
                  <li>
                    <strong className="text-gray-800 dark:text-gray-200">Simple complexity (2-5 hrs):</strong> Small tweaks, minor pages, straightforward copywriting, or basic template setup.
                  </li>
                  <li>
                    <strong className="text-gray-800 dark:text-gray-200">Medium complexity (6-15 hrs):</strong> Responsive layouts, interactive panels, customized layouts, schema migrations, or multi-step content.
                  </li>
                  <li>
                    <strong className="text-gray-800 dark:text-gray-200">Complex complexity (16-30 hrs):</strong> Fully custom backend schemas, multi-role auth, intricate UI/animations, or high-stake strategic plans.
                  </li>
                </ul>
              </div>
            </div>

          </div>

          {/* Right panel: Live calculated outputs & saved lists (5 columns) */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">

            {/* Estimated Output Panel */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-800/80 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Scope Estimate Output</h2>

              {selectedDeliverables.length === 0 ? (
                <div className="text-center py-8 space-y-2 text-gray-400">
                  <Layers className="w-8 h-8 mx-auto" />
                  <p className="text-xs">Select or add deliverables to calculate estimate ranges.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Hours block */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 dark:bg-gray-950/60 p-4 rounded-xl border border-gray-100 dark:border-gray-850">
                      <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider block">
                        Estimated Hours
                      </span>
                      <span className="text-xl font-extrabold text-blue-600 dark:text-blue-400 block mt-1.5">
                        {estimatedMinHours} - {estimatedMaxHours} hrs
                      </span>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-950/60 p-4 rounded-xl border border-gray-100 dark:border-gray-850">
                      <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider block">
                        Timeline (Weeks)
                      </span>
                      <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 block mt-1.5">
                        ~{suggestedTimeline}
                      </span>
                    </div>
                  </div>

                  {/* Billable Capacity Note */}
                  <div className="p-3 bg-blue-50/50 dark:bg-blue-950/20 rounded-xl text-[11px] text-blue-800 dark:text-blue-300 leading-relaxed flex items-start gap-2">
                    <Info className="w-4.5 h-4.5 text-blue-500 flex-shrink-0" />
                    <span>
                      Timeline is estimated using a standard developer pace of <strong>~25 billable hours/week</strong> based on the midpoint of the hours range.
                    </span>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>

        <ToolSeoContent
          h2Title="Prevent Scope Creep with a Project Scope Estimator"
          intro="Accurately pricing a project and planning realistic timelines is one of the most critical challenges of running a freelance business. When deliverables are poorly defined, projects inevitably suffer from scope creep, which quietly erodes your margins. Our free project scope estimator lets you map out deliverables, calculate exact hour ranges, and establish client-ready timeline targets immediately."
          sections={[
            {
              title: "How to Estimate Freelance Project Hours Accurately",
              prose: "To estimate a project with high precision, break down the entire scope into distinct, itemized deliverables. Evaluate each deliverable's complexity—categorizing them as simple, medium, or complex. Simple deliverables typically require 2 to 5 hours, medium items take 6 to 15 hours, and complex, high-risk features require 16 to 30 hours of focused engineering or design."
            },
            {
              title: "Building a Safe Buffer into Your Project Timeline",
              prose: "A common operational mistake is estimating project delivery dates assuming 40 billable hours per week of raw coding or design. In reality, meetings, technical debugging, administrative tasks, and revisions consume up to 40% of your bandwidth. To create a sustainable, client-ready schedule, divide your total estimated hour midpoint by a realistic capacity of 25 billable hours per week."
            },
            {
              title: "Defining Clear Deliverables for Client Alignment",
              prose: "Clients value transparency above almost everything else. Sharing an itemized scope breakdown alongside your proposal demonstrates rigorous operational standards. Outlining exactly what is included in the project scope—and what constitutes an overage—creates complete alignment before signing contracts."
            }
          ]}
          internalLinks={[
            { label: "Proposal Generator", href: "/tools/proposal-generator" },
            { label: "Time Tracker", href: "/tools/time-tracker" }
          ]}
        />

      </div>
    </div>
  );
}
