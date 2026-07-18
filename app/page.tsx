"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  FileText,
  ArrowRight,
  Shield,
  Sparkles,
  FileSignature,
  Calculator,
  RefreshCw,
  CalendarClock,
  ClipboardList,
  Briefcase,
  Clock,
  Layers,
  TrendingUp,
  CheckCircle2,
  Lock,
  Zap,
  Play,
  Pause,
  Search,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import FeaturedToolsRow from "@/components/layout/FeaturedToolsRow";
import { toolsRegistry, ToolItem } from "@/lib/tools-registry";

// Curated 5 tools fallback list
const POPULAR_TOOL_SLUGS = [
  "invoice-generator",
  "proposal-generator",
  "contract-generator",
  "rate-calculator",
  "time-tracker",
];

export default function Home() {
  const [visitedTools, setVisitedTools] = useState<ToolItem[]>([]);
  const [visitedTimestamps, setVisitedTimestamps] = useState<Record<string, number>>({});
  const [isRecentState, setIsRecentState] = useState(false);

  // Load visited tools and timestamps on mount or storage update
  const loadVisitedTools = () => {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem("visited_tools");
      if (stored) {
        const visits: { slug: string; timestamp: number }[] = JSON.parse(stored);
        if (visits && visits.length > 0) {
          // Map stored slugs back to complete toolsRegistry items
          const mappedTools: ToolItem[] = [];
          const timestampsMap: Record<string, number> = {};

          visits.forEach((item) => {
            const tool = toolsRegistry.find((t) => t.slug === item.slug);
            if (tool) {
              mappedTools.push(tool);
              timestampsMap[item.slug] = item.timestamp;
            }
          });

          setVisitedTools(mappedTools);
          setVisitedTimestamps(timestampsMap);
          setIsRecentState(true);
          return;
        }
      }

      // Fallback: load hardcoded popular tools
      const popularMapped = POPULAR_TOOL_SLUGS.map(slug => toolsRegistry.find(t => t.slug === slug)).filter(Boolean) as ToolItem[];
      setVisitedTools(popularMapped);
      setVisitedTimestamps({});
      setIsRecentState(false);
    } catch (e) {
      console.error("Failed to parse visited tools history", e);
    }
  };

  useEffect(() => {
    loadVisitedTools();

    // Listen to our custom storage updated event or window storage events
    window.addEventListener("storage_visited_tools_updated", loadVisitedTools);
    window.addEventListener("storage", loadVisitedTools);

    return () => {
      window.removeEventListener("storage_visited_tools_updated", loadVisitedTools);
      window.removeEventListener("storage", loadVisitedTools);
    };
  }, []);

  const [isExpanded, setIsExpanded] = useState(false);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!searchQuery) {
      setIsExpanded(false);
    }
  }, [searchQuery]);

  const popularTools = POPULAR_TOOL_SLUGS.map(slug => toolsRegistry.find(t => t.slug === slug)).filter(Boolean) as ToolItem[];

  const categorizedTools = [
    {
      categoryName: "Billing & Financial",
      badge: "Billing",
      tools: [
        {
          title: "Invoice Generator",
          description: "Create, customize, and export professional PDF invoices for clients in seconds. Supporting logos, custom currencies, and auto-tax calculation.",
          href: "/tools/invoice-generator",
          icon: FileText,
          badge: "v1.0 - Live",
        },
        {
          title: "Rate Calculator",
          description: "Determine your ideal hourly rate based on desired income, expenses, and billable hours, and convert it to project-based pricing.",
          href: "/tools/rate-calculator",
          icon: Calculator,
          badge: "v2.0 - Live",
        },
        {
          title: "Currency Converter",
          description: "Convert international project fees and currency values using live exchange rates with caching support.",
          href: "/tools/currency-converter",
          icon: RefreshCw,
          badge: "v2.0 - Live",
        },
        {
          title: "Late Payment Fee Calculator",
          description: "Calculate exact days overdue, months overdue, prorated monthly late fees, and new total invoice balance owed.",
          href: "/tools/late-payment-fee-calculator",
          icon: CalendarClock,
          badge: "v2.0 - Live",
        },
      ],
    },
    {
      categoryName: "Agreements & Legal",
      badge: "Agreements",
      tools: [
        {
          title: "Proposal Generator",
          description: "Create professional proposals and quotes with breakdown of deliverables, timeline, and investment.",
          href: "/tools/proposal-generator",
          icon: Sparkles,
          badge: "v3.0 - Live",
        },
        {
          title: "Contract Template Builder",
          description: "Draft legally binding, standard contracts and agreements for freelance projects.",
          href: "/tools/contract-generator",
          icon: FileSignature,
          badge: "v3.0 - Live",
        },
        {
          title: "NDA Generator",
          description: "Create custom Non-Disclosure Agreements to protect your intellectual property and business info.",
          href: "/tools/nda-generator",
          icon: Shield,
          badge: "v3.0 - Live",
        },
        {
          title: "Retainer Agreement Generator",
          description: "Set up ongoing monthly retainer agreements to guarantee monthly income and reserve your bandwidth.",
          href: "/tools/retainer-generator",
          icon: CalendarClock,
          badge: "v3.0 - Live",
        },
      ],
    },
    {
      categoryName: "Client Assets & Onboarding",
      badge: "Client Assets",
      tools: [
        {
          title: "Client Intake Form Builder",
          description: "Draft tailored client intake questionnaires with editable questions, custom category structure, dynamic inline validation, copy-to-clipboard, and clean PDF export.",
          href: "/tools/client-intake-form",
          icon: ClipboardList,
          badge: "v4.0 - Live",
        },
        {
          title: "Portfolio Case Study Builder",
          description: "Generate structured, professional case studies complete with client details, metrics/results, testimonials, and client-side image uploads.",
          href: "/tools/case-study-builder",
          icon: Briefcase,
          badge: "v4.0 - Live",
        },
      ],
    },
    {
      categoryName: "AI Communication",
      badge: "AI Communication",
      tools: [
        {
          title: "Payment Reminder Generator",
          description: "Draft perfectly tuned, professional email reminders for past-due client invoices using smart AI guidance.",
          href: "/tools/payment-reminder-generator",
          icon: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>,
          badge: "v5.0 - Live",
        },
        {
          title: "Meeting Recap Generator",
          description: "Turn your rough bullet points or raw meeting notes into a beautifully polished email summary complete with clear, actionable items.",
          href: "/tools/meeting-recap-generator",
          icon: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M2 6h4"/><path d="M2 10h4"/><path d="M2 14h4"/><path d="M2 18h4"/><rect width="12" height="18" x="10" y="3" rx="2"/></svg>,
          badge: "v5.0 - Live",
        },
      ],
    },
    {
      categoryName: "Planning & Tracking",
      badge: "Account Tools",
      tools: [
        {
          title: "Time Tracker",
          description: "Log hours, track live sessions, and instantly prefill your invoices. Cloud sync allows you to manage entries anywhere. (Free account required to save)",
          href: "/tools/time-tracker",
          icon: Clock,
          badge: "v6.0 - Live",
        },
        {
          title: "Project Scope Estimator",
          description: "Estimate hour ranges and project timelines by deliverability complexity. Perform one-off calculations or save results. (Free account required to save)",
          href: "/tools/scope-estimator",
          icon: Layers,
          badge: "v6.0 - Live",
        },
      ],
    },
    {
      categoryName: "Reference & Market Data",
      badge: "Reference",
      tools: [
        {
          title: "Rate Benchmark Tool",
          description: "Compare freelance hourly rates across common professional categories, experience levels, and global regions to price confidently.",
          href: "/tools/rate-benchmark",
          icon: TrendingUp,
          badge: "v1.0 - Live",
        },
      ],
    },
  ];

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setSearchQuery("");
    }
  };

  // Live real-time search filtering
  const filteredCategorizedTools = categorizedTools
    .map((category) => {
      const matchedTools = category.tools.filter((tool) => {
        const query = searchQuery.toLowerCase().trim();
        if (!query) return true;
        return (
          tool.title.toLowerCase().includes(query) ||
          tool.description.toLowerCase().includes(query)
        );
      });
      return {
        ...category,
        tools: matchedTools,
      };
    })
    .filter((category) => category.tools.length > 0);

  // Hero Mockup Active Tabs
  const [activeTab, setActiveTab] = useState<"invoice" | "proposal" | "contract">("invoice");
  const [isAutoplay, setIsAutoplay] = useState(true);
  const autoplayTimerRef = useRef<NodeJS.Timeout | null>(null);

  const tabs: { id: "invoice" | "proposal" | "contract"; label: string }[] = [
    { id: "invoice", label: "Invoice Builder" },
    { id: "proposal", label: "Proposal Draft" },
    { id: "contract", label: "Contract Builder" },
  ];

  // Handle Tab rotation
  useEffect(() => {
    // Respect reduced motion setting
    if (typeof window !== "undefined") {
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReducedMotion) {
        setIsAutoplay(false);
        return;
      }
    }

    if (!isAutoplay) return;

    autoplayTimerRef.current = setInterval(() => {
      setActiveTab((prev) => {
        if (prev === "invoice") return "proposal";
        if (prev === "proposal") return "contract";
        return "invoice";
      });
    }, 4500);

    return () => {
      if (autoplayTimerRef.current) {
        clearInterval(autoplayTimerRef.current);
      }
    };
  }, [isAutoplay]);

  const selectTab = (tabId: "invoice" | "proposal" | "contract") => {
    setActiveTab(tabId);
    setIsAutoplay(false); // Stop autoplay once user interacts manually
  };

  return (
    <div className="bg-[#f8fafc] dark:bg-[#090a0f] text-[#0f172a] dark:text-[#f8fafc] min-h-screen transition-colors duration-200">

      {/* SECTION 1: Hero Section with Split Layout & Document Live Preview */}
      <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 overflow-hidden border-b border-slate-200/60 dark:border-slate-800/50 bg-white dark:bg-[#090a0f]/80">

        {/* Subtle geometric pattern lines for a sophisticated layout structure */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

            {/* Hero Text Context - Left Column */}
            <div className="lg:col-span-5 text-left space-y-6">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 dark:bg-blue-400/10 border border-blue-200/40 dark:border-blue-500/30 px-3.5 py-1.5 text-xs font-semibold tracking-wider uppercase text-blue-600 dark:text-blue-400">
                <span className="flex h-2 w-2 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse" />
                15 Professional Utilities • Fully Live
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[2.75rem] font-black leading-[1.1] tracking-tight text-slate-900 dark:text-white">
                The Complete, <br className="hidden sm:inline" />
                <span className="text-blue-600 dark:text-blue-500">Privacy-First</span> Operating Suite for Freelancers.
              </h1>

              <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed max-w-xl">
                A highly refined suite of business-operations utilities designed to make you look exceptionally credible to your clients. Run invoices, contracts, proposals, and tracking completely serverless and secure.
              </p>

              {/* Primary Call to Action */}
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <a
                  href="#tools-section"
                  className="inline-flex items-center justify-center gap-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 text-white font-bold px-6 py-4 shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.01]"
                >
                  Explore the 15 Tools
                  <ArrowRight className="w-5 h-5" />
                </a>
                <Link
                  href="/about"
                  className="inline-flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-semibold px-6 py-4 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
                >
                  Learn How It&apos;s Built
                </Link>
              </div>

              {/* Trust Badge Indicators */}
              <div className="pt-4 flex items-center gap-6 border-t border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-blue-500" />
                  100% Client-Side Data
                </span>
                <span className="flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-blue-500" />
                  No Account Obligation
                </span>
              </div>
            </div>

            {/* Signature Interactive Preview - Right Column */}
            <div className="lg:col-span-7">
              <div className="relative rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#0d0e15] shadow-2xl overflow-hidden transition-all duration-300">

                {/* Simulated Browser Top Bar */}
                <div className="flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-slate-900/40 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                    <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                    <span className="ml-4 text-xs font-medium text-slate-400 dark:text-slate-500 font-mono tracking-wider">
                      freelance-ops-toolkit.com
                    </span>
                  </div>

                  {/* Play/Pause controls for auto rotation */}
                  <button
                    onClick={() => setIsAutoplay(!isAutoplay)}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded bg-slate-100 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-[10px] font-mono hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-all focus:outline-none focus:ring-1 focus:ring-blue-500"
                    title={isAutoplay ? "Pause rotation" : "Play rotation"}
                  >
                    {isAutoplay ? (
                      <>
                        <Pause className="w-3 h-3" />
                        <span>AUTO</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3 h-3" />
                        <span>PAUSED</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Sub-Nav Switcher Tabs for Document Mockups */}
                <div className="flex border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-[#0c0d13]">
                  {tabs.map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => selectTab(tab.id)}
                        className={`flex-1 py-3 px-4 text-xs sm:text-sm font-semibold tracking-wide border-b-2 text-center transition-all focus:outline-none ${
                          isActive
                            ? "border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-400 bg-white dark:bg-[#0d0e15]"
                            : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                        }`}
                      >
                        {tab.label}
                      </button>
                    );
                  })}
                </div>

                {/* Simulated live-assembled operational previews */}
                <div className="p-6 sm:p-8 min-h-[340px] sm:min-h-[380px] bg-white dark:bg-[#0d0e15] font-sans text-left transition-all duration-300">

                  {/* TAB 1: INVOICE SIMULATOR */}
                  {activeTab === "invoice" && (
                    <div className="space-y-6 animate-fadeIn">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                            ACME CREATIVE
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                            hello@acmecreative.io
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="inline-block text-[10px] font-bold tracking-wider uppercase bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400 px-2 py-1 rounded-md">
                            PREPARED
                          </span>
                          <p className="text-xs text-slate-400 dark:text-slate-500 mt-2 font-mono">
                            INV-2025-084
                          </p>
                        </div>
                      </div>

                      <div className="border-t border-slate-100 dark:border-slate-800 pt-4 grid grid-cols-2 gap-4 text-xs">
                        <div>
                          <span className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                            Billed To:
                          </span>
                          <span className="font-semibold text-slate-800 dark:text-slate-200 mt-1 block">
                            Stellar Horizon Corp.
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                            Issue Date:
                          </span>
                          <span className="font-mono text-slate-600 dark:text-slate-400 mt-1 block">
                            October 12, 2025
                          </span>
                        </div>
                      </div>

                      {/* Mocked Invoice Line items */}
                      <div className="space-y-3 pt-3">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800 pb-1.5 flex justify-between">
                          <span>Description</span>
                          <span>Total</span>
                        </div>
                        <div className="flex justify-between text-xs items-center py-0.5">
                          <div>
                            <span className="font-semibold text-slate-800 dark:text-slate-200">
                              System Architecture & NextJS Build
                            </span>
                            <span className="block text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                              40 Hours @ $95/hr
                            </span>
                          </div>
                          <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">$3,800.00</span>
                        </div>
                        <div className="flex justify-between text-xs items-center py-0.5">
                          <div>
                            <span className="font-semibold text-slate-800 dark:text-slate-200">
                              UI/UX & Interactive Design Prototyping
                            </span>
                            <span className="block text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                              Flat project rate
                            </span>
                          </div>
                          <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">$1,000.00</span>
                        </div>
                      </div>

                      {/* Summary calculations */}
                      <div className="border-t border-slate-100 dark:border-slate-800 pt-4 flex justify-end">
                        <div className="w-1/2 text-right space-y-2">
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-500 dark:text-slate-400">Subtotal:</span>
                            <span className="font-mono text-slate-800 dark:text-slate-200">$4,800.00</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-500 dark:text-slate-400">VAT (20%):</span>
                            <span className="font-mono text-slate-800 dark:text-slate-200">$960.00</span>
                          </div>
                          <div className="flex justify-between text-sm pt-2 border-t border-slate-100 dark:border-slate-800">
                            <span className="font-bold text-slate-800 dark:text-white">Amount Due:</span>
                            <span className="font-mono font-bold text-blue-600 dark:text-blue-400 text-base">$5,760.00</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: PROPOSAL SIMULATOR */}
                  {activeTab === "proposal" && (
                    <div className="space-y-6 animate-fadeIn">
                      <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                        <span className="text-[10px] font-mono uppercase bg-blue-100 dark:bg-blue-950/40 text-blue-800 dark:text-blue-400 px-2 py-0.5 rounded font-bold">
                          Client Proposal
                        </span>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-2">
                          Enterprise Portal Migration & Optimization
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          Prepared for: <span className="font-semibold text-slate-700 dark:text-slate-300">NovaSphere Technologies</span>
                        </p>
                      </div>

                      {/* Deliverables outline */}
                      <div className="space-y-4">
                        <h4 className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                          Key Deliverables
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-3.5 rounded-lg border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-[#090a0f]">
                            <span className="font-bold text-xs text-slate-800 dark:text-white block">
                              Phase 1: Blueprint & Architecture
                            </span>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                              Database optimization plan, performance diagnostics, and custom UI design specs.
                            </p>
                          </div>
                          <div className="p-3.5 rounded-lg border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-[#090a0f]">
                            <span className="font-bold text-xs text-slate-800 dark:text-white block">
                              Phase 2: Live Integration
                            </span>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                              Serverless migration, API logic construction, and client onboard pipeline.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Scope & Cost Footer */}
                      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                        <div>
                          <span className="block text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold tracking-wider">
                            Estimated Investment
                          </span>
                          <span className="text-lg font-extrabold text-blue-600 dark:text-blue-400">
                            $12,500.00 USD
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="block text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold tracking-wider">
                            Estimated Duration
                          </span>
                          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                            4-6 Weeks Total
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 3: CONTRACT SIMULATOR */}
                  {activeTab === "contract" && (
                    <div className="space-y-4 animate-fadeIn text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-mono">

                      <div className="border-b border-slate-100 dark:border-slate-800 pb-3 text-center">
                        <span className="text-[9px] font-bold uppercase text-amber-600 dark:text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
                          STANDARD TEMPLATE - LEGAL PREVIEW
                        </span>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-2 uppercase tracking-wide">
                          Independent Contractor Services Agreement
                        </h4>
                      </div>

                      <p className="text-[11px]">
                        This agreement is entered into as of <span className="text-blue-600 dark:text-blue-400 underline font-semibold">October 1, 2025</span> (the &quot;Effective Date&quot;), by and between:
                      </p>

                      <div className="p-3 rounded border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-[#090a0f] text-[11px] space-y-1.5 font-sans">
                        <p>
                          <strong className="text-slate-800 dark:text-white">Contractor:</strong> Jane Doe, Freelance Developer (&quot;Jane Doe Design LLC&quot;)
                        </p>
                        <p>
                          <strong className="text-slate-800 dark:text-white">Client:</strong> Horizon Retail Analytics, Inc. (&quot;Horizon&quot;)
                        </p>
                      </div>

                      <div className="space-y-1.5 font-sans text-[11px]">
                        <p className="font-bold text-slate-800 dark:text-white uppercase tracking-wider text-[10px]">
                          1. Services Provided & Deliverables
                        </p>
                        <p className="text-slate-500 dark:text-slate-400">
                          Contractor agrees to perform comprehensive front-end systems engineering, accessibility auditing, and performance tuning under the conditions set forth herein.
                        </p>

                        <p className="font-bold text-slate-800 dark:text-white uppercase tracking-wider text-[10px] pt-1">
                          2. IP Ownership & Assignment
                        </p>
                        <p className="text-slate-500 dark:text-slate-400">
                          Upon receipt of full compensation due, Contractor assigns all rights, titles, and interests in the created deliverables directly to the Client.
                        </p>
                      </div>
                    </div>
                  )}

                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 2: Brief & Highly Credible Toolkit Description */}
      <section className="py-12 bg-slate-50 dark:bg-[#06070a]/90 border-b border-slate-200/50 dark:border-slate-900/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-lg sm:text-xl font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
            &ldquo;We built Freelance Ops Toolkit to package essential, institutional-grade calculations, professional documents, and communication guides usually gated behind expensive corporate platform subscriptions. No trackers, no data traps—just pristine utilities designed specifically to help independent professionals transact with complete authority.&rdquo;
          </p>
        </div>
      </section>

      {/* SECTION 2.5: Popular / Recently Used Tools Row (Only visible if history exists) */}
      {isRecentState && visitedTools.length > 0 && (
        <div className="relative">
          <FeaturedToolsRow
            title="Continue Where You Left Off"
            tools={visitedTools}
            isRecentState={isRecentState}
            timestamps={visitedTimestamps}
          />
        </div>
      )}

      {/* SECTION 3: The Categorized 15-Tool Directory Grid */}
      <section id="tools-section" className="py-16 sm:py-24 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Section Header */}
          <div className="text-center md:text-left mb-12 border-b border-slate-200/50 dark:border-slate-800/50 pb-8">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl tracking-tight">
              Operational Toolkit
            </h2>
            <p className="mt-3 text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
              Launch client-facing actions instantly with our 15 production-ready calculators, generators, and tracking components.
            </p>
          </div>

          {/* Search / Filter Input */}
          <div className="flex justify-center mb-16">
            <div className="relative w-full max-w-2xl group">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <Search className="w-5 h-5 text-slate-400 dark:text-slate-500 group-focus-within:text-blue-500 transition-colors" />
              </span>
              <input
                type="text"
                placeholder="Search tools... (e.g. invoice, contract, rate)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full pl-11 pr-12 py-3.5 bg-white dark:bg-[#0c0d12] text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800/80 rounded-2xl shadow-sm hover:border-slate-300 dark:hover:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base placeholder-slate-400 dark:placeholder-slate-500"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                  aria-label="Clear search"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Main Directory Area */}
          {searchQuery ? (
            /* Search Override View - always categorized matching tools */
            filteredCategorizedTools.length > 0 ? (
              <div className="space-y-16 animate-fadeIn">
                {filteredCategorizedTools.map((category) => (
                  <div key={category.categoryName} className="space-y-6">
                    {/* Category Header */}
                    <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                      <span className="px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {category.badge}
                      </span>
                      <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                        {category.categoryName}
                      </h3>
                    </div>

                    {/* Sub Grid of Tools under Category */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                      {category.tools.map((tool) => {
                        const Icon = tool.icon;
                        return (
                          <div
                            key={tool.title}
                            className="group relative rounded-xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#0c0d12] p-6 sm:p-8 shadow-sm hover:shadow-md hover:border-blue-500/40 dark:hover:border-blue-500/40 transition-all flex flex-col justify-between"
                          >
                            <div>
                              {/* Top Tag badge inside cards */}
                              <div className="absolute top-6 right-6 inline-flex items-center rounded bg-slate-50 dark:bg-slate-900 px-2 py-0.5 text-[10px] font-semibold text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-slate-800/40">
                                {tool.badge}
                              </div>

                              {/* Icon Accent */}
                              <div className="p-3 rounded-lg bg-blue-600 text-white w-12 h-12 flex items-center justify-center shadow-md shadow-blue-500/10 group-hover:scale-105 transition-transform duration-200">
                                <Icon className="w-5 h-5" />
                              </div>

                              <h4 className="text-lg font-bold text-slate-900 dark:text-white mt-6">
                                {tool.title}
                              </h4>

                              {/* text-slate-600 meets AAA/AA on white; text-slate-400 meets AA on dark obsidian */}
                              <p className="text-slate-600 dark:text-slate-400 mt-3 text-sm leading-relaxed">
                                {tool.description}
                              </p>
                            </div>

                            {/* Open Tool CTA Link footer */}
                            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/50">
                              <Link
                                href={tool.href}
                                className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors"
                              >
                                Launch Utility
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                              </Link>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Friendly Empty Search State */
              <div className="text-center py-16 px-4 bg-white dark:bg-[#0c0d12] border border-slate-200 dark:border-slate-800/80 rounded-2xl max-w-xl mx-auto space-y-4 shadow-sm">
                <div className="inline-flex items-center justify-center p-3.5 rounded-full bg-slate-50 dark:bg-slate-900 text-slate-400 dark:text-slate-500">
                  <Search className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  No tools found
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm max-w-md mx-auto leading-relaxed">
                  No tools found for &ldquo;<span className="font-semibold text-blue-600 dark:text-blue-400">{searchQuery}</span>&rdquo;. Try a different search.
                </p>
              </div>
            )
          ) : (
            /* Default State View (Collapsed to 5 popular flat grid, or expanded to all 15 categorized) */
            <div className="space-y-12">
              {!isExpanded ? (
                /* Flat Unified Grid of 5 Popular Tools (No Categories) */
                <div className="space-y-10 animate-fadeIn">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {popularTools.map((tool) => {
                      const Icon = tool.icon;
                      return (
                        <div
                          key={tool.title}
                          className="group relative rounded-xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#0c0d12] p-6 sm:p-8 shadow-sm hover:shadow-md hover:border-blue-500/40 dark:hover:border-blue-500/40 transition-all flex flex-col justify-between"
                        >
                          <div>
                            {/* Top Tag/Category badge inside cards */}
                            <div className="absolute top-6 right-6 inline-flex items-center rounded bg-slate-50 dark:bg-slate-900 px-2 py-0.5 text-[10px] font-semibold text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-slate-800/40">
                              {tool.category}
                            </div>

                            {/* Icon Accent */}
                            <div className="p-3 rounded-lg bg-blue-600 text-white w-12 h-12 flex items-center justify-center shadow-md shadow-blue-500/10 group-hover:scale-105 transition-transform duration-200">
                              <Icon className="w-5 h-5" />
                            </div>

                            <h4 className="text-lg font-bold text-slate-900 dark:text-white mt-6">
                              {tool.title}
                            </h4>

                            <p className="text-slate-600 dark:text-slate-400 mt-3 text-sm leading-relaxed">
                              {tool.description}
                            </p>
                          </div>

                          {/* Open Tool CTA Link footer */}
                          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/50">
                            <Link
                              href={tool.href}
                              className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors"
                            >
                              Launch Utility
                              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Expand CTA Button */}
                  <div className="flex justify-center pt-4">
                    <button
                      onClick={() => setIsExpanded(true)}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 text-white font-bold px-8 py-4 shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.01]"
                    >
                      View All 15 Tools
                      <ChevronDown className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ) : (
                /* Full Categorized Listing (all 6 categories, all 15 tools) */
                <div className="space-y-16 animate-fadeIn">
                  {categorizedTools.map((category) => (
                    <div key={category.categoryName} className="space-y-6">
                      {/* Category Header */}
                      <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                        <span className="px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {category.badge}
                        </span>
                        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                          {category.categoryName}
                        </h3>
                      </div>

                      {/* Sub Grid of Tools under Category */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                        {category.tools.map((tool) => {
                          const Icon = tool.icon;
                          return (
                            <div
                              key={tool.title}
                              className="group relative rounded-xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#0c0d12] p-6 sm:p-8 shadow-sm hover:shadow-md hover:border-blue-500/40 dark:hover:border-blue-500/40 transition-all flex flex-col justify-between"
                            >
                              <div>
                                {/* Top Tag badge inside cards */}
                                <div className="absolute top-6 right-6 inline-flex items-center rounded bg-slate-50 dark:bg-slate-900 px-2 py-0.5 text-[10px] font-semibold text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-slate-800/40">
                                  {tool.badge}
                                </div>

                                {/* Icon Accent */}
                                <div className="p-3 rounded-lg bg-blue-600 text-white w-12 h-12 flex items-center justify-center shadow-md shadow-blue-500/10 group-hover:scale-105 transition-transform duration-200">
                                  <Icon className="w-5 h-5" />
                                </div>

                                <h4 className="text-lg font-bold text-slate-900 dark:text-white mt-6">
                                  {tool.title}
                                </h4>

                                <p className="text-slate-600 dark:text-slate-400 mt-3 text-sm leading-relaxed">
                                  {tool.description}
                                </p>
                              </div>

                              {/* Open Tool CTA Link footer */}
                              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/50">
                                <Link
                                  href={tool.href}
                                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors"
                                >
                                  Launch Utility
                                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Link>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}

                  {/* Collapse CTA Button */}
                  <div className="flex justify-center pt-8 border-t border-slate-200/50 dark:border-slate-800/50">
                    <button
                      onClick={() => setIsExpanded(false)}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-semibold px-8 py-4 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
                    >
                      Show Less
                      <ChevronUp className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </section>

      {/* SECTION 4: High-Integrity Benefits and Trust Section (Instead of duplicated FAQ) */}
      <section className="py-20 sm:py-24 bg-white dark:bg-[#07080d]/80 border-t border-slate-200/50 dark:border-slate-900/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-16">

          <div className="max-w-2xl mx-auto space-y-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              An Institutional Suite Designed For Absolute Autonomy
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
              Unlike modern software companies that lock basic utilities behind paywalls and cookie traps, we operate on three hard, developer-guided principles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* Pillar 1: Total Privacy */}
            <div className="p-6 sm:p-8 rounded-xl border border-slate-200 dark:border-slate-800 bg-[#f8fafc] dark:bg-[#0d0e14] text-left space-y-4">
              <div className="p-3 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 w-12 h-12 flex items-center justify-center">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Total Privacy By Design
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Your business and client data stays inside your browser state. Calculations, PDF builds, and templates run 100% locally on your computer—never sent to or stored on our servers.
              </p>
            </div>

            {/* Pillar 2: Start Instantly */}
            <div className="p-6 sm:p-8 rounded-xl border border-slate-200 dark:border-slate-800 bg-[#f8fafc] dark:bg-[#0d0e14] text-left space-y-4">
              <div className="p-3 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 w-12 h-12 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Start Instantly, Zero Blockers
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                No signups, no credit cards, no premium locks, and absolutely no marketing newsletters. Launch any of the 15 utilities and output high-quality assets in under 30 seconds.
              </p>
            </div>

            {/* Pillar 3: Professional Credibility */}
            <div className="p-6 sm:p-8 rounded-xl border border-slate-200 dark:border-slate-800 bg-[#f8fafc] dark:bg-[#0d0e14] text-left space-y-4">
              <div className="p-3 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 w-12 h-12 flex items-center justify-center">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Professional Credibility
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Generate highly polished, print-optimized A4-compliant PDF agreements and calculations. All documents feature pristine typography and clean structural elements.
              </p>
            </div>

          </div>

          <div className="pt-6">
            <p className="text-xs text-slate-500 dark:text-slate-500">
              Need cloud persistence or automated time sheet syncing? An optional free account is only required for the cloud-enabled Time Tracker and Project Scope Estimator tools.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
