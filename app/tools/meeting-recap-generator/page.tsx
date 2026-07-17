"use client";

import React, { useState } from "react";
import { Notebook, Copy, CheckCircle, AlertCircle, RefreshCw, Send } from "lucide-react";

export default function MeetingRecapGenerator() {
  // Fields
  const [clientName, setClientName] = useState("");
  const [meetingNotes, setMeetingNotes] = useState("");
  const [tone, setTone] = useState("Professional");

  // UI state
  const [loading, setLoading] = useState(false);
  const [resultText, setResultText] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  // Validation touch state
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showAllErrors, setShowAllErrors] = useState(false);

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  // Validation checks
  const isMeetingNotesValid = meetingNotes.trim().length > 0;

  const isFormValid = isMeetingNotesValid;

  const handleGenerate = async () => {
    setShowAllErrors(true);
    setError("");

    if (!isFormValid) {
      return;
    }

    setLoading(true);
    setResultText("");

    // Build the instruction
    const greetingGuideline = clientName.trim()
      ? `Address the email to ${clientName.trim()}.`
      : "Address the email with a generic professional greeting like 'Hi there' or 'Hi team'.";

    const toneGuideline = tone === "Professional"
      ? "Maintain a polite, polished, business-like tone. Focus on clarity and accuracy."
      : "Maintain a friendly, casual, and warm but professional tone. Focus on collaboration and enthusiasm.";

    const prompt = `You are an expert freelance assistant. Your job is to transform raw meeting notes or bullet points into a clean, highly structured, and professional meeting recap email draft.

Here are the details:
- Client / Recipient Name: ${clientName.trim() ? clientName.trim() : "None provided"}
- Greeting Guidance: ${greetingGuideline}
- Tone Selected: ${tone}
- Tone Guidance: ${toneGuideline}

Here are the raw meeting notes/bullet points:
${meetingNotes.trim()}

Instructions for the response format:
1. Provide a clear and helpful Subject Line (e.g. "Subject: Meeting Recap & Action Items - [Project Name]").
2. Write a professional email body summarizing the key discussion points from the notes in a concise and clear manner.
3. Crucially, pull out and list a clearly separated, bulleted "Action Items" section highlighting who is responsible for each item if names/roles can be inferred or guessed from the notes.
4. Keep the output tidy, well-formatted, and copy-paste ready. Do not surround the email with any extra chatty conversational remarks from you (the AI) — start directly with the Subject.`;

    try {
      const response = await fetch("/api/generate-text", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate recap");
      }

      setResultText(data.text);
    } catch (err: unknown) {
      console.error(err);
      setError("We couldn't generate this right now, please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!resultText) return;
    try {
      await navigator.clipboard.writeText(resultText);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen py-10 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold text-sm mb-1">
            <Notebook className="w-4 h-4" />
            <span>AI Operations</span>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            Meeting Recap Email Generator
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Convert raw bullet points, quick notes, and messy scribbles into structured summary emails with clear action items using Google Gemini AI.
          </p>
        </div>

        {/* Disclaimer Banner */}
        <div className="bg-blue-50/60 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 rounded-xl p-4 mb-8 flex gap-3 items-start text-blue-800 dark:text-blue-300">
          <Send className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p className="text-xs leading-normal">
            <strong>Operational Drafts:</strong> This tool generates ready-to-use email drafts. This app does not send any emails automatically — copy the drafted text to send it manually via your favorite email client.
          </p>
        </div>

        {/* Split Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left Panel: Inputs (7 Cols) */}
          <div className="lg:col-span-7 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-800/80 p-6 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white pb-3 border-b border-gray-100 dark:border-gray-800">
              Meeting Parameters
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Client Name (Optional) */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                  Client / Recipient Name (Optional)
                </label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="e.g. Sarah Connor or Team Connor"
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-900 py-2.5 px-3.5 text-sm shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100 placeholder:text-gray-400"
                />
              </div>

              {/* Tone Selection */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                  Recap Tone
                </label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-900 py-2.5 px-3.5 text-sm shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100"
                >
                  <option value="Professional">Professional (Polished, formal, precise summary)</option>
                  <option value="Friendly/Casual">Friendly/Casual (Warm, cooperative, collaborative vibes)</option>
                </select>
              </div>

              {/* Raw Meeting Notes */}
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                  Raw Meeting Notes / Scribbles <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={meetingNotes}
                  onChange={(e) => setMeetingNotes(e.target.value)}
                  onBlur={() => handleBlur("meetingNotes")}
                  placeholder={`e.g.
- Discussed website redesign scope.
- John likes the dark blue color theme but Sarah prefers dark teal.
- Agreed to deliver first wireframe draft by Friday next week (Sarah will review).
- Pricing is approved. Need contract signed by Tuesday.
- Next sync call scheduled for Wednesday 2 PM.`}
                  rows={12}
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-900 py-2.5 px-3.5 text-sm shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100 placeholder:text-gray-400"
                />
                {((!isMeetingNotesValid && touched["meetingNotes"]) || (showAllErrors && !isMeetingNotesValid)) && (
                  <p className="mt-1.5 text-xs text-red-600 dark:text-red-400 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> Meeting Notes cannot be empty.
                  </p>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-end">
              <button
                type="button"
                onClick={handleGenerate}
                disabled={loading}
                className="w-full md:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-3 px-6 text-sm shadow-md transition-all hover:scale-[1.01]"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Generating Recap...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Generate Recap
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Panel: Output Draft (5 Cols) */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-500" />
              Generated Email Recap
            </h2>

            {/* Error Area */}
            {error && (
              <div className="bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 rounded-xl p-4 flex flex-col gap-3">
                <div className="flex gap-2 items-start text-red-800 dark:text-red-400">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <p className="text-xs font-semibold leading-normal">{error}</p>
                </div>
                <button
                  type="button"
                  onClick={handleGenerate}
                  className="self-start text-xs font-bold bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-700 dark:text-red-400 px-3.5 py-1.5 rounded-lg transition-colors"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Results Output Box */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden flex flex-col">
              <div className="bg-gray-50 dark:bg-gray-850 px-4 py-3 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                  Recap Draft
                </span>
                {resultText && (
                  <button
                    onClick={handleCopy}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors"
                  >
                    {copied ? (
                      <>
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        Copy to Clipboard
                      </>
                    )}
                  </button>
                )}
              </div>

              <div className="p-4">
                <textarea
                  value={resultText}
                  onChange={(e) => setResultText(e.target.value)}
                  placeholder="Your generated meeting recap draft will appear here..."
                  rows={20}
                  className="w-full bg-transparent border-0 p-0 text-sm leading-relaxed text-gray-800 dark:text-gray-200 focus:ring-0 focus:outline-none resize-none font-sans"
                />
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
