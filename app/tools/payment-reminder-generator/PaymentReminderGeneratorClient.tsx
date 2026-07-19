"use client";

import React, { useState } from "react";
import { ToolHero } from "@/components/layout/ToolHero";
import { PaymentReminderVisual } from "@/components/layout/ToolHeroVisuals";
import { Copy, CheckCircle, AlertCircle, RefreshCw, Send } from "lucide-react";
import ToolSeoContent from "@/components/layout/ToolSeoContent";

const CURRENCIES = [
  { code: "USD", symbol: "$" },
  { code: "EUR", symbol: "€" },
  { code: "GBP", symbol: "£" },
  { code: "PKR", symbol: "Rs." },
  { code: "AUD", symbol: "A$" },
  { code: "CAD", symbol: "C$" },
  { code: "INR", symbol: "₹" },
];

export default function PaymentReminderGenerator() {
  // Fields
  const [clientName, setClientName] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [invoiceAmount, setInvoiceAmount] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [daysOverdue, setDaysOverdue] = useState("");
  const [tone, setTone] = useState("Friendly");
  const [extraContext, setExtraContext] = useState("");

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

  // Inline validations
  const isClientNameValid = clientName.trim().length > 0;
  const isInvoiceNumberValid = invoiceNumber.trim().length > 0;
  const isInvoiceAmountValid = parseFloat(invoiceAmount) > 0;
  const isDaysOverdueValid = parseInt(daysOverdue, 10) >= 1;

  const isFormValid =
    isClientNameValid &&
    isInvoiceNumberValid &&
    isInvoiceAmountValid &&
    isDaysOverdueValid;

  const handleGenerate = async () => {
    // Force show validation errors
    setShowAllErrors(true);
    setError("");

    if (!isFormValid) {
      return;
    }

    setLoading(true);
    setResultText("");

    const currencySymbol = CURRENCIES.find((c) => c.code === currency)?.symbol || "$";

    // Build specialized prompt depending on the selected tone
    let tonePromptGuideline = "";
    if (tone === "Friendly") {
      tonePromptGuideline = "Keep the email warm, friendly, collaborative, and conversational. Emphasize maintaining a strong ongoing relationship, and treat the delay as an accidental oversight.";
    } else if (tone === "Firm") {
      tonePromptGuideline = "Keep the email direct, clear, objective, and highly professional. State the overdue status clearly and ask for an update, but remain professional and respectful.";
    } else if (tone === "Final Notice") {
      tonePromptGuideline = "Make the email serious, firm, and urgent, but strictly professional. Clearly outline that this is a final notice, mention the next steps (like applying outstanding late fees or suspending project access if applicable), but do NOT make legal threats or use legal-sounding intimidation.";
    }

    const prompt = `You are a professional freelance operational assistant.
Please write a single, copy-paste ready, highly professional payment reminder email draft.

Here is the context:
- Client Name: ${clientName.trim()}
- Invoice Number: ${invoiceNumber.trim()}
- Invoice Amount: ${currencySymbol}${invoiceAmount} (${currency})
- Days Past Due / Overdue: ${daysOverdue} days
- Tone: ${tone}
- Tone Guidelines: ${tonePromptGuideline}
${extraContext.trim() ? `- Additional custom context to include: ${extraContext.trim()}` : ""}

Ensure the generated text strictly provides:
1. A clear, appropriate Subject line.
2. The complete email body including standard placeholders (like [Your Name] or [Your Contact Info]) so it is ready to be filled in.
3. Keep the output neat, clean, well-spaced, with no additional markdown conversational commentary around the email draft (start directly with "Subject:").`;

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
        throw new Error(data.error || "Failed to generate text");
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
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen pb-16 transition-colors duration-200">
      <ToolHero
        title="Payment Reminder Generator"
        description="Draft perfectly tuned, polite, firm, or final-notice email reminders for past-due client invoices using smart, local AI guidelines."
        actionLabel="Compose Reminder ↓"
        visual={<PaymentReminderVisual />}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Note Banner */}
        <div className="bg-blue-50/60 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 rounded-xl p-4 mb-8 flex gap-3 items-start text-blue-800 dark:text-blue-300">
          <Send className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p className="text-xs leading-normal">
            <strong>Operational Drafts:</strong> This tool generates ready-to-use email drafts. This app does not send any emails automatically — copy the drafted text to send it manually via your favorite email client.
          </p>
        </div>

        {/* Split Grid Layout */}
        <div id="tool-form" className="scroll-mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left: Input Form (7 Cols) */}
          <div className="lg:col-span-7 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-800/80 p-6 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white pb-3 border-b border-gray-100 dark:border-gray-800">
              Reminder Parameters
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Client Name */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                  Client Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  onBlur={() => handleBlur("clientName")}
                  placeholder="e.g. Acme Corp"
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-900 py-2.5 px-3.5 text-sm shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100"
                />
                {((!isClientNameValid && touched["clientName"]) || (showAllErrors && !isClientNameValid)) && (
                  <p className="mt-1.5 text-xs text-red-600 dark:text-red-400 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> Client Name is required.
                  </p>
                )}
              </div>

              {/* Invoice Number */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                  Invoice Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  onBlur={() => handleBlur("invoiceNumber")}
                  placeholder="e.g. INV-2026-004"
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-900 py-2.5 px-3.5 text-sm shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100"
                />
                {((!isInvoiceNumberValid && touched["invoiceNumber"]) || (showAllErrors && !isInvoiceNumberValid)) && (
                  <p className="mt-1.5 text-xs text-red-600 dark:text-red-400 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> Invoice Number is required.
                  </p>
                )}
              </div>

              {/* Invoice Amount & Currency */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                  Invoice Amount <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="rounded-xl border border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-900 py-2.5 px-3 text-sm shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100"
                  >
                    {CURRENCIES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.code} ({c.symbol})
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={invoiceAmount}
                    onChange={(e) => setInvoiceAmount(e.target.value)}
                    onBlur={() => handleBlur("invoiceAmount")}
                    placeholder="e.g. 1500"
                    className="flex-grow w-full rounded-xl border border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-900 py-2.5 px-3.5 text-sm shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100"
                  />
                </div>
                {((!isInvoiceAmountValid && touched["invoiceAmount"]) || (showAllErrors && !isInvoiceAmountValid)) && (
                  <p className="mt-1.5 text-xs text-red-600 dark:text-red-400 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> Invoice Amount must be greater than 0.
                  </p>
                )}
              </div>

              {/* Days Overdue */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                  Days Overdue <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={daysOverdue}
                  onChange={(e) => setDaysOverdue(e.target.value)}
                  onBlur={() => handleBlur("daysOverdue")}
                  placeholder="e.g. 15"
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-900 py-2.5 px-3.5 text-sm shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100"
                />
                {((!isDaysOverdueValid && touched["daysOverdue"]) || (showAllErrors && !isDaysOverdueValid)) && (
                  <p className="mt-1.5 text-xs text-red-600 dark:text-red-400 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> Days Overdue must be 1 or more.
                  </p>
                )}
              </div>

              {/* Tone dropdown */}
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                  Reminder Tone
                </label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-900 py-2.5 px-3.5 text-sm shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100"
                >
                  <option value="Friendly">Friendly (Warm, collaborative relationship starter)</option>
                  <option value="Firm">Firm (Direct, professional, polite update request)</option>
                  <option value="Final Notice">Final Notice (Urgent, serious, outline suspension steps, professional)</option>
                </select>
              </div>

              {/* Extra Context */}
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                  Extra Context / Custom Instructions (Optional)
                </label>
                <textarea
                  value={extraContext}
                  onChange={(e) => setExtraContext(e.target.value)}
                  placeholder="e.g. 'Mention we are happy to split this into two payment installments if they're facing cash flow issues'"
                  rows={4}
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-900 py-2.5 px-3.5 text-sm shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100 placeholder:text-gray-400"
                />
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
                    Generating Email...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Generate Email
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right: Output Draft (5 Cols) */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-500" />
              Generated Email Draft
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

            {/* Results Output box */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden flex flex-col">
              <div className="bg-gray-50 dark:bg-gray-850 px-4 py-3 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                  Draft Content
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
                  placeholder="Your generated payment reminder draft will appear here..."
                  rows={16}
                  className="w-full bg-transparent border-0 p-0 text-sm leading-relaxed text-gray-800 dark:text-gray-200 focus:ring-0 focus:outline-none resize-none font-sans"
                />
              </div>
            </div>
          </div>

        </div>

        <ToolSeoContent
          h2Title="Collect Overdue Invoices with a Polite Payment Reminder Email Freelancer"
          intro="Dealing with overdue client accounts is one of the most delicate challenges in freelance business management. Asking for payments shouldn't feel awkward or confrontational. Our free payment reminder generator lets you compose polite, firm, or final-notice emails using smart, context-driven AI patterns, protecting your cash flow while safeguarding important professional relationships."
          sections={[
            {
              title: "How to Ask a Client for Late Payments Without Damaging the Relationship",
              prose: "When an invoice first crosses its due date, always start with a friendly reminder, treating the delay as a simple oversight. State the invoice number, date, and outstanding balance clearly. Provide direct digital payment routing links to make it as simple as possible for the client to settle the account immediately."
            },
            {
              title: "A Structured Timeline for Sending Payment Reminders",
              prose: "Manage past-due collections using a standardized sequence: send a polite heads-up 3 days before the due date, a warm follow-up on day 1 past due, a direct status inquiry on day 7, a firm demand on day 14 (outlining any prorated late fees), and a formal final notice on day 30 before taking next steps."
            },
            {
              title: "Automating and Standardizing Your Follow-Up Workflow",
              prose: "Using pre-written templates eliminates the emotional friction of asking for money. Standardizing your follow-up copy signals that your payment collections are managed systematically, encouraging clients to prioritize your invoices and settle their balances quickly."
            }
          ]}
          internalLinks={[
            { label: "Late Payment Fee Calculator", href: "/tools/late-payment-fee-calculator" },
            { label: "Invoice Generator", href: "/tools/invoice-generator" }
          ]}
        />

      </div>
    </div>
  );
}
