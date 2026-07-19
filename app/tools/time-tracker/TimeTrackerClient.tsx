"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ToolHero } from "@/components/layout/ToolHero";
import { TimeTrackerVisual } from "@/components/layout/ToolHeroVisuals";
import {
  Clock,
  Plus,
  Trash2,
  Receipt,
  Play,
  Square,
  Calendar,
  DollarSign,
  CheckCircle,
} from "lucide-react";
import ToolSeoContent from "@/components/layout/ToolSeoContent";

interface TimeEntry {
  id: string;
  client_name: string;
  hourly_rate: number;
  description: string;
  hours: number;
  date: string;
  created_at?: string;
}

export default function TimeTracker() {
  const router = useRouter();
  const [loadingEntries, setLoadingEntries] = useState(true);
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  const [selectedEntries, setSelectedEntries] = useState<Record<string, boolean>>({});

  // Form Inputs
  const [clientName, setClientName] = useState("");
  const [hourlyRate, setHourlyRate] = useState<number>(100);
  const [description, setDescription] = useState("");
  const [hoursInput, setHoursInput] = useState<number | "">("");
  const [dateInput, setDateInput] = useState(new Date().toISOString().split("T")[0]);

  // Touch & Validation State
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [formError, setFormError] = useState<string | null>(null);

  // Timer State
  const [timerActive, setTimerActive] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Load entries from sessionStorage on mount
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("time_tracker_entries");
      if (stored) {
        setEntries(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load time entries from sessionStorage", e);
    } finally {
      setLoadingEntries(false);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const saveToSessionStorage = (newEntries: TimeEntry[]) => {
    try {
      sessionStorage.setItem("time_tracker_entries", JSON.stringify(newEntries));
    } catch (e) {
      console.error("Failed to save time entries to sessionStorage", e);
    }
  };

  // Timer handlers
  const startTimer = () => {
    if (!clientName.trim()) {
      setFormError("Please fill in a Client/Project Name before starting the timer.");
      setTouched({ clientName: true });
      return;
    }
    setFormError(null);
    setTimerActive(true);
    timerRef.current = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);
  };

  const stopTimerAndSave = async () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setTimerActive(false);

    // Calculate hours (minimum 0.01 hours to prevent 0 division)
    const calculatedHours = Math.max(0.01, parseFloat((seconds / 3600).toFixed(2)));
    const generatedDescription = description.trim() || `Session on ${clientName}`;

    try {
      const newEntry: TimeEntry = {
        id: `time-entry-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        client_name: clientName,
        hourly_rate: hourlyRate,
        description: generatedDescription,
        hours: calculatedHours,
        date: dateInput,
      };

      const updatedEntries = [newEntry, ...entries];
      setEntries(updatedEntries);
      saveToSessionStorage(updatedEntries);

      // Reset timer inputs
      setSeconds(0);
      setDescription("");
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Failed to save time entry";
      alert(errMsg);
    }
  };

  const cancelTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setTimerActive(false);
    setSeconds(0);
  };

  // Manual save handler
  const saveManualEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({
      clientName: true,
      description: true,
      hoursInput: true,
      dateInput: true,
    });

    if (!clientName.trim() || !description.trim() || !hoursInput || hoursInput <= 0 || !dateInput) {
      setFormError("Please correct all form errors before submitting.");
      return;
    }

    setFormError(null);
    try {
      const newEntry: TimeEntry = {
        id: `time-entry-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        client_name: clientName,
        hourly_rate: hourlyRate,
        description,
        hours: Number(hoursInput),
        date: dateInput,
      };

      const updatedEntries = [newEntry, ...entries];
      setEntries(updatedEntries);
      saveToSessionStorage(updatedEntries);

      // Reset fields
      setDescription("");
      setHoursInput("");
      setTouched({});
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Failed to save time entry";
      alert(errMsg);
    }
  };

  // Delete handler
  const deleteEntry = async (id: string) => {
    if (!confirm("Are you sure you want to delete this time entry?")) return;

    try {
      const updatedEntries = entries.filter(e => e.id !== id);
      setEntries(updatedEntries);
      saveToSessionStorage(updatedEntries);

      setSelectedEntries(prev => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Failed to delete entry";
      alert(errMsg);
    }
  };

  // Hand-off to Invoice Generator
  const convertToInvoice = () => {
    const selectedList = entries.filter(e => selectedEntries[e.id]);
    if (selectedList.length === 0) {
      alert("Please select at least one time entry to convert.");
      return;
    }

    // Pass data through sessionStorage (cleaner & safer than URL parameters)
    const payload = {
      clientName: selectedList[0].client_name, // prefill first client name
      hourlyRate: selectedList[0].hourly_rate,
      lineItems: selectedList.map(e => ({
        description: `${e.description} (${e.date})`,
        quantity: e.hours,
        rate: e.hourly_rate,
      }))
    };

    sessionStorage.setItem("prefilled_invoice_data", JSON.stringify(payload));
    router.push("/tools/invoice-generator");
  };

  // Total calculations
  const totalHours = entries.reduce((sum, e) => sum + Number(e.hours), 0);
  const totalCost = entries.reduce((sum, e) => sum + (Number(e.hours) * Number(e.hourly_rate)), 0);

  const selectedCount = Object.values(selectedEntries).filter(Boolean).length;
  const selectedHours = entries.filter(e => selectedEntries[e.id]).reduce((sum, e) => sum + Number(e.hours), 0);
  const selectedCost = entries.filter(e => selectedEntries[e.id]).reduce((sum, e) => sum + (Number(e.hours) * Number(e.hourly_rate)), 0);

  // Format seconds to HH:MM:SS
  const formatTime = (totalSecs: number) => {
    const h = Math.floor(totalSecs / 3600).toString().padStart(2, "0");
    const m = Math.floor((totalSecs % 3600) / 60).toString().padStart(2, "0");
    const s = (totalSecs % 60).toString().padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen pb-16 transition-colors duration-200">
      <ToolHero
        title="Time Tracker"
        description="Log hours, run live tracking sessions, and instantly prefill your professional client invoices. Fully client-side and session-only."
        actionLabel="Track Time ↓"
        visual={<TimeTrackerVisual />}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div id="tool-form" className="scroll-mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left panel: Log Time Inputs (5 columns) */}
          <div className="lg:col-span-5 space-y-6">

            {/* Quick Timer / Active Session Card */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-800/80 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                Live Timer
              </h2>

              <div className="space-y-4">
                {/* Simulated Timer Display */}
                <div className="bg-gray-50 dark:bg-gray-950/50 rounded-2xl py-6 text-center border border-gray-100 dark:border-gray-850">
                  <span className="font-mono text-4xl font-extrabold text-gray-800 dark:text-gray-100 tracking-wider">
                    {formatTime(seconds)}
                  </span>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1.5 font-medium">
                    {timerActive ? "Session Active" : "Session Paused"}
                  </p>
                </div>

                {/* Common client name & hourly rate Inputs (shared between timer and manual entry) */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                      Client/Project Name *
                    </label>
                    <input
                      type="text"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      onBlur={() => setTouched(prev => ({ ...prev, clientName: true }))}
                      placeholder="e.g. Pixelcraft Digital"
                      disabled={timerActive}
                      className={`w-full rounded-xl border py-2.5 px-3.5 text-sm shadow-sm transition-all focus:outline-none focus:ring-2 text-gray-900 dark:text-gray-100 ${
                        touched.clientName && !clientName.trim()
                          ? "border-red-300 dark:border-red-800 bg-red-50/50"
                          : "border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-900"
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                      Hourly Rate * ($)
                    </label>
                    <input
                      type="number"
                      value={hourlyRate}
                      onChange={(e) => setHourlyRate(Math.max(0, parseFloat(e.target.value) || 0))}
                      placeholder="e.g. 100"
                      disabled={timerActive}
                      className="w-full rounded-xl border border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-900 py-2.5 px-3.5 text-sm shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                </div>

                {/* Optional session note description */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                    Session Note / Work Description
                  </label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="What are you currently focusing on? e.g. Frontend layout redesign"
                    className="w-full rounded-xl border border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-900 py-2 px-3.5 text-sm shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100"
                  />
                </div>

                {/* Control Action Buttons */}
                <div className="flex gap-3">
                  {timerActive ? (
                    <>
                      <button
                        onClick={stopTimerAndSave}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold py-3 text-sm transition-all shadow-md"
                      >
                        <Square className="w-4 h-4" /> Stop & Save
                      </button>
                      <button
                        onClick={cancelTimer}
                        className="rounded-xl border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/60 font-medium px-4 py-3 text-xs text-gray-500 dark:text-gray-400 transition-colors"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={startTimer}
                      className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 text-sm transition-all shadow-md shadow-blue-500/10"
                    >
                      <Play className="w-4 h-4 fill-current" /> Start Timer Session
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Manual Time Logger Card */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-850 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Plus className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                Manual Entry
              </h2>

              <form onSubmit={saveManualEntry} className="space-y-4">
                {/* Description */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                    Service / Task Description *
                  </label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    onBlur={() => setTouched(prev => ({ ...prev, description: true }))}
                    placeholder="e.g. Consulted on deployment server setup"
                    className={`w-full rounded-xl border py-2.5 px-3.5 text-sm shadow-sm transition-all focus:outline-none focus:ring-2 text-gray-900 dark:text-gray-100 ${
                      touched.description && !description.trim()
                        ? "border-red-300 dark:border-red-800 bg-red-50/50"
                        : "border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-900"
                    }`}
                  />
                </div>

                {/* Hours & Date */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                      Hours logged *
                    </label>
                    <input
                      type="number"
                      step="any"
                      min="0.01"
                      value={hoursInput}
                      onChange={(e) => setHoursInput(e.target.value === "" ? "" : parseFloat(e.target.value))}
                      onBlur={() => setTouched(prev => ({ ...prev, hoursInput: true }))}
                      placeholder="e.g. 4.5"
                      className={`w-full rounded-xl border py-2.5 px-3.5 text-sm shadow-sm transition-all focus:outline-none focus:ring-2 text-gray-900 dark:text-gray-100 ${
                        touched.hoursInput && (!hoursInput || hoursInput <= 0)
                          ? "border-red-300 dark:border-red-800 bg-red-50/50"
                          : "border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-900"
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                      Log Date *
                    </label>
                    <input
                      type="date"
                      value={dateInput}
                      onChange={(e) => setDateInput(e.target.value)}
                      className="w-full rounded-xl border border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-900 py-2.5 px-3.5 text-sm shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                </div>

                {formError && (
                  <p className="text-xs text-red-600 dark:text-red-400 font-medium">{formError}</p>
                )}

                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl border border-blue-600 dark:border-blue-500 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/20 font-bold py-2.5 text-sm transition-all"
                >
                  <Plus className="w-4 h-4" /> Save Manual Entry
                </button>
              </form>
            </div>

          </div>

          {/* Right panel: Run-list of entries & prefill conversion action (7 columns) */}
          <div className="lg:col-span-7 space-y-6">

            {/* Overall Analytics Summary Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-800/80 p-5 shadow-sm">
                <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider block">
                  Total Billable Hours
                </span>
                <span className="text-2xl font-extrabold text-gray-900 dark:text-white block mt-1">
                  {totalHours.toLocaleString(undefined, { maximumFractionDigits: 2 })} hrs
                </span>
              </div>

              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-800/80 p-5 shadow-sm">
                <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider block">
                  Total Projected Cost
                </span>
                <span className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 block mt-1">
                  ${totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {/* List container */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-800/80 p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-3 border-b border-gray-100 dark:border-gray-850">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Logged Time Entries</h3>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                    Select the entries you wish to send to the Invoice Generator.
                  </p>
                </div>

                {selectedCount > 0 && (
                  <button
                    onClick={convertToInvoice}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold px-4.5 py-2.5 text-xs shadow-md shadow-blue-500/10 transition-all hover:scale-[1.01]"
                  >
                    <Receipt className="w-4 h-4" />
                    Convert ({selectedCount}) to Invoice
                  </button>
                )}
              </div>

              {selectedCount > 0 && (
                <div className="bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 rounded-xl p-3.5 mb-4 text-xs text-gray-600 dark:text-gray-400 flex flex-wrap justify-between items-center gap-2">
                  <div className="flex items-center gap-1.5 font-medium text-blue-800 dark:text-blue-300">
                    <CheckCircle className="w-4 h-4" />
                    <span>Selected: {selectedHours.toLocaleString(undefined, { maximumFractionDigits: 2 })} hours</span>
                  </div>
                  <div className="font-bold text-gray-900 dark:text-gray-200">
                    Accumulated: ${selectedCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
              )}

              {loadingEntries ? (
                <div className="py-12 text-center space-y-2">
                  <div className="w-8 h-8 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin mx-auto" />
                  <p className="text-xs text-gray-400 dark:text-gray-500">Retrieving logged entries...</p>
                </div>
              ) : entries.length === 0 ? (
                <div className="py-16 text-center max-w-sm mx-auto space-y-3">
                  <Clock className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto" />
                  <h4 className="text-base font-bold text-gray-900 dark:text-white">No time entries yet</h4>
                  <p className="text-xs text-gray-400 dark:text-gray-500 leading-relaxed">
                    Once you save your running timers or manually log hour entries for client assignments, they will appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                  {entries.map((entry) => (
                    <div
                      key={entry.id}
                      className={`p-4 rounded-xl border flex items-start gap-3 transition-all ${
                        selectedEntries[entry.id]
                          ? "border-blue-200 dark:border-blue-900 bg-blue-50/20 dark:bg-blue-950/10"
                          : "border-gray-100 dark:border-gray-850 hover:bg-gray-50/60 dark:hover:bg-gray-900/40 bg-white dark:bg-gray-900"
                      }`}
                    >
                      {/* Selection Box */}
                      <input
                        type="checkbox"
                        checked={!!selectedEntries[entry.id]}
                        onChange={(e) => {
                          setSelectedEntries(prev => ({
                            ...prev,
                            [entry.id]: e.target.checked
                          }));
                        }}
                        className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />

                      {/* Details */}
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-sm font-bold text-gray-900 dark:text-white truncate" title={entry.client_name}>
                            {entry.client_name}
                          </h4>
                          <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {entry.date}
                          </span>
                        </div>

                        <p className="text-xs text-gray-500 dark:text-gray-400 leading-normal line-clamp-2" title={entry.description}>
                          {entry.description}
                        </p>

                        <div className="flex items-center gap-4 pt-1 text-[11px] text-gray-400 dark:text-gray-500 font-medium">
                          <span className="flex items-center gap-0.5">
                            <Clock className="w-3.5 h-3.5 text-gray-400" />
                            {entry.hours} hours
                          </span>
                          <span className="flex items-center gap-0.5">
                            <DollarSign className="w-3.5 h-3.5 text-gray-400" />
                            ${entry.hourly_rate}/hr
                          </span>
                          <span className="text-blue-600 dark:text-blue-400 font-bold ml-auto text-xs">
                            ${(entry.hours * entry.hourly_rate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                        </div>
                      </div>

                      {/* Delete */}
                      <button
                        onClick={() => deleteEntry(entry.id)}
                        className="text-gray-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors self-center"
                        title="Delete entry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>

        <ToolSeoContent
          h2Title="Track Billable Hours Seamlessly with a Freelance Time Tracker Free"
          intro="Accurately tracking where your working hours are spent is vital for protecting your freelance profitability. Manual spreadsheets are easily forgotten and prone to calculation errors. Our free freelance time tracker offers live stopwatch recording and manual logging, allowing you to organize your client billable hours and track them inside your browser session."
          sections={[
            {
              title: "Why Accurate Time Tracking is Vital for Freelancers",
              prose: "Time is your ultimate limited asset. When you fail to log shorter discovery calls, revisions, or technical debugging sessions, you are quietly giving away your services for free. standardizing your time-tracking workflow ensures you maintain precise records, giving you the direct evidence needed to invoice clients fairly for all hours spent."
            },
            {
              title: "Converting Tracked Billable Hours Directly to Invoices",
              prose: "Our toolkit features an optimized transition workflow that lets you convert selected logged entries into a prefilled draft in our Invoice Generator with a single click. This eliminates manual data entry, reducing administrative overhead and ensuring your billing remains completely error-free."
            },
            {
              title: "Maximizing Profitability Through Time Analysis",
              prose: "Logging your hours also lets you analyze your true project efficiency. By comparing estimated project hours against the actual time logged, you can discover which deliverables are highly profitable and which require safety buffers or pricing adjustments in future client proposals."
            }
          ]}
          internalLinks={[
            { label: "Invoice Generator", href: "/tools/invoice-generator" },
            { label: "Project Scope Estimator", href: "/tools/scope-estimator" }
          ]}
        />

      </div>
    </div>
  );
}
