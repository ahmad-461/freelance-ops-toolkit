"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { MessageSquare, X, Send, Trash2, ArrowLeft } from "lucide-react";
import { toolsRegistry } from "@/lib/tools-registry";

interface Message {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: Date;
}

const SUGGESTED_PROMPTS = [
  { label: "Write a proposal for a web design project", prompt: "Write a proposal for a web design project" },
  { label: "Draft a polite payment reminder", prompt: "Draft a polite payment reminder" },
  { label: "Summarize meeting notes into action items", prompt: "Summarize these meeting notes into action items" },
  { label: "Outline a project scope", prompt: "Help me outline a project scope" },
  { label: "Draft a standard NDA outline", prompt: "Draft a standard NDA outline" },
  { label: "Calculate an hourly rate from my target income", prompt: "Calculate an hourly rate from my target income" },
];

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [isVisibleOnMobile, setIsVisibleOnMobile] = useState(true);

  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Once-per-session entrance animation
  useEffect(() => {
    if (typeof window !== "undefined") {
      const animatedThisSession = sessionStorage.getItem("ai-assistant-animated");
      if (!animatedThisSession) {
        setShouldAnimate(true);
        sessionStorage.setItem("ai-assistant-animated", "true");
      }
    }
  }, []);

  // Track scroll and resize to hide on mobile viewports when near the top of the page (< 100px)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleScrollAndResize = () => {
      const isMobile = window.innerWidth < 768;
      if (isMobile && window.scrollY < 100) {
        setIsVisibleOnMobile(false);
      } else {
        setIsVisibleOnMobile(true);
      }
    };

    window.addEventListener("scroll", handleScrollAndResize);
    window.addEventListener("resize", handleScrollAndResize);
    // Initial evaluation
    handleScrollAndResize();

    return () => {
      window.removeEventListener("scroll", handleScrollAndResize);
      window.removeEventListener("resize", handleScrollAndResize);
    };
  }, []);

  // Manage body scroll and focus when panel opens
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
    } else {
      document.body.style.overflow = "";
      if (triggerRef.current) {
        triggerRef.current.focus();
      }
    }
  }, [isOpen]);

  // Scroll to bottom of message log on change or loading state change
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Auto-resize the input textarea based on content length
  useEffect(() => {
    const textarea = inputRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  }, [input]);

  // Handle keyboard events (Escape to close, Enter to send)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  const handleTextAreaKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Focus trap inside the open panel
  const handleFocusTrap = (e: React.KeyboardEvent) => {
    if (e.key !== "Tab") return;

    const focusableEls = panelRef.current?.querySelectorAll(
      'button, textarea, [href], input, select, [tabindex="0"]'
    );
    if (!focusableEls || focusableEls.length === 0) return;

    const firstEl = focusableEls[0] as HTMLElement;
    const lastEl = focusableEls[focusableEls.length - 1] as HTMLElement;

    if (e.shiftKey) {
      if (document.activeElement === firstEl) {
        e.preventDefault();
        lastEl.focus();
      }
    } else {
      if (document.activeElement === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    }
  };

  const handleSend = async (customText?: string) => {
    const textToSend = customText !== undefined ? customText : input;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: Message = {
      id: Math.random().toString(36).substring(7),
      sender: "user",
      text: textToSend.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (customText === undefined) {
      setInput("");
    }
    setIsLoading(true);

    try {
      // Build a comprehensive prompt detailing system guidelines
      const systemContext = `You are the "Freelance Ops Assistant", a highly polished, professional AI concierge and writing helper embedded in the Freelance Ops Toolkit website.
Your purpose is to assist freelancers by answering questions, outlining project scopes, drafting templates, proposals, emails, or summaries.

Operational boundaries & guidelines:
1. You are ADDITIVE and helper-focused only.
2. You CANNOT autonomously generate files, finalize contracts, or compile final downloadable PDF documents on behalf of the user. If asked to generate a PDF, document, or export, you must:
   - Politely explain that you cannot produce direct PDF downloads or legal final documents in chat.
   - Draft the content or recommendations clearly in the chat window.
   - Direct/deep-link the user to the dedicated tool on the site by appending the exact markdown pattern: [LINK:slug] at the end of your response.
3. Supported Tool Slugs & Descriptions:
   - [LINK:invoice-generator] : To create, customize, and export professional PDF invoices.
   - [LINK:rate-calculator] : To calculate ideal hourly rate or project fees.
   - [LINK:currency-converter] : To convert foreign currency using live exchange rates.
   - [LINK:late-payment-fee-calculator] : To calculate overdue invoice interest and late fees.
   - [LINK:proposal-generator] : To draft comprehensive proposals, quotes, and schedules.
   - [LINK:contract-generator] : To construct professional freelance client agreement templates.
   - [LINK:nda-generator] : To generate secure client Non-Disclosure Agreements.
   - [LINK:retainer-generator] : To establish monthly freelance retainers.
   - [LINK:client-intake-form] : To build onboarding questionnaires.
   - [LINK:case-study-builder] : To compile structured client portfolio case studies.
   - [LINK:payment-reminder-generator] : To refine email reminders for unpaid invoices.
   - [LINK:meeting-recap-generator] : To convert bullet lists to recap emails.
   - [LINK:time-tracker] : To log hours and track live tasks.
   - [LINK:scope-estimator] : To estimate project complexity and scope ranges.
   - [LINK:rate-benchmark] : To research market rate benchmarks.

4. Never invent tool slugs. Always use the exact slug specified above.
5. Keep your tone helpful, professional, minimalist, and clear. Format output utilizing clean spacing and markdown elements (bullet points, bolding) to ensure high readability.`;

      // Construct messages context for the stateless API call
      const historyContext = messages
        .map((m) => `${m.sender === "user" ? "User" : "Assistant"}: ${m.text}`)
        .join("\n\n");

      const prompt = `${systemContext}\n\nConversation History:\n${historyContext}\n\nUser: ${userMsg.text}\n\nAssistant:`;

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

      const assistantMsg: Message = {
        id: Math.random().toString(36).substring(7),
        sender: "assistant",
        text: data.text,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error(err);
      const errorMsg: Message = {
        id: Math.random().toString(36).substring(7),
        sender: "assistant",
        text: "We couldn't generate this right now, please try again. [ERROR]",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTryAgain = () => {
    // Find the last user message in the current list
    const userMessages = messages.filter((m) => m.sender === "user");
    if (userMessages.length === 0) return;
    const lastUserMessage = userMessages[userMessages.length - 1];

    // Clear the error message and re-send the last user query
    setMessages((prev) => prev.slice(0, prev.length - 1));
    handleSend(lastUserMessage.text);
  };

  const clearConversation = () => {
    setMessages([]);
  };

  // Helper to parse response text for tool links [LINK:slug]
  const parseResponseText = (text: string) => {
    // We will extract links like [LINK:invoice-generator]
    const regex = /\[LINK:([a-zA-Z0-9-]+)\]/g;
    const linksFound: string[] = [];
    let match;
    while ((match = regex.exec(text)) !== null) {
      linksFound.push(match[1]);
    }

    // Cleaned text with [LINK:...] strings removed
    const cleanedText = text.replace(regex, "").trim();

    return { cleanedText, linksFound };
  };

  return (
    <>
      {/* Part A — Trigger Floating Action Button */}
      {isVisibleOnMobile && (
        <button
          ref={triggerRef}
          onClick={() => setIsOpen(true)}
          className={`fixed bottom-6 right-6 z-[90] flex items-center gap-2 rounded-full bg-blue-600 dark:bg-blue-500 text-white px-5 py-3 shadow-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-950 font-semibold text-sm ${
            shouldAnimate ? "animate-slideIn" : ""
          }`}
          aria-label="Open AI Assistant"
          aria-haspopup="dialog"
          aria-expanded={isOpen}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Ask AI</span>
        </button>
      )}

      {/* Part B — Chat Panel Wrapper (Slide-in right/Mobile full-screen) */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex justify-end bg-slate-900/40 dark:bg-black/70 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsOpen(false);
          }}
          onKeyDown={handleKeyDown}
        >
          <div
            ref={panelRef}
            onKeyDown={handleFocusTrap}
            role="dialog"
            aria-modal="true"
            aria-labelledby="assistant-title"
            className="w-full md:w-[440px] h-full bg-white dark:bg-[#0c0d12] border-l border-slate-200 dark:border-slate-800/80 shadow-2xl flex flex-col overflow-hidden animate-slideInRight"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-4 border-b border-slate-100 dark:border-slate-800/50">
              <div className="flex items-center gap-2">
                {/* Mobile Back / Close Button */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="md:hidden p-1.5 -ml-1 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900"
                  aria-label="Close Assistant"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h2 id="assistant-title" className="text-sm font-bold text-slate-900 dark:text-white">
                    Freelance Ops Assistant
                  </h2>
                  <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Online
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {messages.length > 0 && (
                  <button
                    onClick={clearConversation}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-slate-50 dark:hover:bg-slate-900/60 transition-colors flex items-center gap-1 text-xs font-semibold"
                    title="Clear conversation"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Clear</span>
                  </button>
                )}
                {/* Desktop Close Button */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="hidden md:block p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
                  aria-label="Close Assistant"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Message Thread or Empty State */}
            <div
              className="flex-1 overflow-y-auto p-4 space-y-4"
              role="log"
              aria-label="Chat conversation history"
            >
              {messages.length === 0 ? (
                /* Empty State */
                <div className="h-full flex flex-col justify-center py-6 space-y-6">
                  <div className="text-center space-y-2 max-w-sm mx-auto">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      Your operational co-pilot
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      Ask questions, outline client scopes, draft professional proposals, or email communication. I can direct you straight to the right tool.
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-1">
                      Suggested prompts
                    </p>
                    <div className="grid grid-cols-1 gap-2">
                      {SUGGESTED_PROMPTS.map((item) => (
                        <button
                          key={item.label}
                          onClick={() => handleSend(item.prompt)}
                          className="w-full text-left px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 hover:bg-blue-50/50 dark:bg-slate-900/40 dark:hover:bg-blue-950/20 text-xs text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                /* Message list */
                messages.map((m) => {
                  const isAssistant = m.sender === "assistant";
                  const isError = m.text.includes("[ERROR]") && isAssistant;
                  const { cleanedText, linksFound } = parseResponseText(m.text);

                  return (
                    <div
                      key={m.id}
                      className={`flex flex-col ${
                        isAssistant ? "items-start" : "items-end"
                      }`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed ${
                          isAssistant
                            ? isError
                              ? "bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 text-red-800 dark:text-red-400"
                              : "bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200"
                            : "bg-blue-600 text-white"
                        }`}
                      >
                        {isError ? (
                          <div className="space-y-2">
                            <p className="font-semibold">{cleanedText.replace("[ERROR]", "").trim()}</p>
                            <button
                              onClick={handleTryAgain}
                              className="text-xs font-bold bg-red-100 hover:bg-red-200 dark:bg-red-900/40 dark:hover:bg-red-900/60 text-red-700 dark:text-red-400 px-3.5 py-1.5 rounded-lg transition-colors"
                            >
                              Try Again
                            </button>
                          </div>
                        ) : (
                          <div className="whitespace-pre-wrap">{cleanedText}</div>
                        )}

                        {/* Direct tool links if matching is found */}
                        {linksFound.length > 0 && (
                          <div className="mt-3 pt-2.5 border-t border-slate-200/50 dark:border-slate-800/60 space-y-2">
                            {linksFound.map((slug) => {
                              const registryItem = toolsRegistry.find((t) => t.slug === slug);
                              if (!registryItem) return null;
                              return (
                                <Link
                                  key={slug}
                                  href={registryItem.href}
                                  onClick={() => setIsOpen(false)}
                                  className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-lg transition-colors w-full sm:w-auto"
                                >
                                  Open in {registryItem.title} →
                                </Link>
                              );
                            })}
                          </div>
                        )}
                      </div>
                      <span className="text-[9px] text-slate-400 dark:text-slate-500 mt-1 px-1.5">
                        {m.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  );
                })
              )}

              {/* Loading indicator */}
              {isLoading && (
                <div className="flex items-start">
                  <div className="bg-slate-100 dark:bg-slate-900 rounded-2xl px-4 py-3 flex items-center space-x-1.5">
                    <span className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce delay-75"></span>
                    <span className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce delay-150"></span>
                    <span className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce delay-225"></span>
                  </div>
                </div>
              )}

              <div ref={messageEndRef} />
            </div>

            {/* Input area */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800/50 bg-white dark:bg-[#0c0d12]">
              <div className="relative flex items-end gap-2 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-2 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleTextAreaKeyDown}
                  placeholder="Ask for an email draft, outline a proposal, or type..."
                  rows={1}
                  className="flex-grow bg-transparent border-0 py-1.5 px-2 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-0 focus:outline-none resize-none font-sans min-h-[36px] max-h-[120px] self-center"
                  style={{
                    height: "auto",
                  }}
                />
                <button
                  onClick={() => handleSend()}
                  disabled={!input.trim() || isLoading}
                  className="p-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 dark:disabled:bg-slate-800/50 text-white disabled:text-slate-400 dark:disabled:text-slate-600 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 text-center mt-2.5">
                Conversations are transient (held in-memory) and not stored on our servers. Message content is securely processed via Google Gemini API.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
