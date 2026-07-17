"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { User as SupabaseUser } from "@supabase/supabase-js";
import {
  Save,
  Trash2,
  Plus,
  Info,
  Layers,
  FolderOpen
} from "lucide-react";

interface Deliverable {
  id: string;
  name: string;
  complexity: "Simple" | "Medium" | "Complex";
  checked: boolean;
}

interface SavedEstimate {
  id: string;
  project_type: string;
  inputs: {
    deliverables: { name: string; complexity: string }[];
  };
  estimated_hours_min: number;
  estimated_hours_max: number;
  suggested_timeline: string;
  created_at: string;
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
  const router = useRouter();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingEstimates, setLoadingEstimates] = useState(false);
  const [savedEstimates, setSavedEstimates] = useState<SavedEstimate[]>([]);

  // Project Type & Deliverables list state
  const [projectType, setProjectType] = useState("Website");
  const [deliverables, setDeliverables] = useState<Deliverable[]>([]);
  const [customItemName, setCustomItemName] = useState("");

  // Load User & Saved Estimates
  useEffect(() => {
    async function checkUser() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
        if (user) {
          fetchSavedEstimates(user.id);
        }
      } catch (err) {
        console.error("Error retrieving user session:", err);
      } finally {
        setLoadingUser(false);
      }
    }
    checkUser();
  }, []);

  // Fetch Saved Estimates
  const fetchSavedEstimates = async (userId: string) => {
    setLoadingEstimates(true);
    try {
      const { data, error } = await supabase
        .from("scope_estimates")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setSavedEstimates((data as SavedEstimate[]) || []);
    } catch (err: unknown) {
      console.error("Error fetching saved estimates:", err);
    } finally {
      setLoadingEstimates(false);
    }
  };

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

  // Save Estimate
  const saveEstimate = async () => {
    if (!user) {
      alert("Please sign in or register to save estimates.");
      return;
    }

    if (selectedDeliverables.length === 0) {
      alert("Please select or add at least one deliverable to save.");
      return;
    }

    try {
      const inputs = {
        deliverables: selectedDeliverables.map(d => ({
          name: d.name,
          complexity: d.complexity
        }))
      };

      const { data, error } = await supabase
        .from("scope_estimates")
        .insert({
          user_id: user.id,
          project_type: projectType,
          inputs,
          estimated_hours_min: estimatedMinHours,
          estimated_hours_max: estimatedMaxHours,
          suggested_timeline: suggestedTimeline
        })
        .select();

      if (error) throw error;

      if (data) {
        setSavedEstimates(prev => [data[0] as SavedEstimate, ...prev]);
        alert("Estimate saved successfully!");
      }
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Failed to save estimate";
      alert(errMsg);
    }
  };

  // Delete Estimate
  const deleteEstimate = async (id: string) => {
    if (!confirm("Are you sure you want to delete this saved estimate?")) return;

    try {
      const { error } = await supabase
        .from("scope_estimates")
        .delete()
        .eq("id", id);

      if (error) throw error;
      setSavedEstimates(prev => prev.filter(e => e.id !== id));
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Failed to delete saved estimate";
      alert(errMsg);
    }
  };

  if (loadingUser) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Layers className="w-10 h-10 text-blue-600 animate-spin" />
          <p className="text-sm text-gray-500 dark:text-gray-400 font-semibold">Loading Scope Estimator...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen py-10 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold text-sm mb-1">
            <Layers className="w-4 h-4" />
            <span>Operational Tools</span>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            Project Scope Estimator
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Build reliable timeline and hour range estimates based on project complexity. No account required to estimate!
          </p>
        </div>

        {/* Outer Split layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

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
                            className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
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

                  {/* Action buttons (Sign in to Save OR Save directly) */}
                  {user ? (
                    <button
                      onClick={saveEstimate}
                      className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 text-sm transition-all shadow-md shadow-blue-500/10"
                    >
                      <Save className="w-4 h-4" /> Save This Estimate
                    </button>
                  ) : (
                    <div className="p-4 bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-850 rounded-xl space-y-3">
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-normal">
                        <strong>Want to save this?</strong> Create a free account or log in to persist this scope estimate.
                      </p>
                      <button
                        onClick={() => router.push("/login")}
                        className="w-full inline-flex items-center justify-center gap-1 rounded-xl bg-gray-200 dark:bg-gray-850 hover:bg-gray-300 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold py-2 text-xs transition-colors"
                      >
                        Sign In / Register to Save
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Cloud Saved Estimates section */}
            {user && (
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-800/80 p-6 shadow-sm">
                <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-gray-850">
                  <FolderOpen className="w-4 h-4 text-blue-500" />
                  My Saved Estimates
                </h2>

                {loadingEstimates ? (
                  <div className="text-center py-6 text-gray-400 space-y-1.5">
                    <div className="w-6 h-6 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin mx-auto" />
                    <p className="text-[10px]">Syncing with database...</p>
                  </div>
                ) : savedEstimates.length === 0 ? (
                  <div className="text-center py-8 text-gray-400 space-y-1">
                    <p className="text-xs font-semibold">No saved estimates yet</p>
                    <p className="text-[10px]">Your saved estimations will be listed here.</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                    {savedEstimates.map((est) => (
                      <div
                        key={est.id}
                        className="p-3 rounded-xl border border-gray-100 dark:border-gray-850 bg-gray-50/40 dark:bg-gray-950/20 text-xs space-y-2 relative group"
                      >
                        <div className="flex justify-between items-start gap-4">
                          <div className="min-w-0">
                            <span className="inline-block px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400 font-bold text-[9px] uppercase tracking-wider mb-1">
                              {est.project_type}
                            </span>
                            <div className="font-bold text-gray-900 dark:text-white truncate">
                              {est.inputs.deliverables.length} Deliverable{est.inputs.deliverables.length > 1 ? "s" : ""}
                            </div>
                          </div>
                          <button
                            onClick={() => deleteEstimate(est.id)}
                            className="text-gray-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                            title="Delete estimate"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Summary specifications */}
                        <div className="grid grid-cols-2 gap-2 pt-1.5 border-t border-gray-100/60 dark:border-gray-850/60 text-[10px] text-gray-500 dark:text-gray-400 font-medium">
                          <div>Range: <span className="font-bold text-gray-800 dark:text-gray-200">{est.estimated_hours_min}-{est.estimated_hours_max} hrs</span></div>
                          <div>Timeline: <span className="font-bold text-emerald-600 dark:text-emerald-400">~{est.suggested_timeline}</span></div>
                        </div>

                        <div className="text-[9px] text-gray-400 pt-0.5">
                          Saved: {new Date(est.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
