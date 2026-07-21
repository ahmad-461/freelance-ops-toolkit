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

function ToolPreviewThumbnail({ slug }: { slug: string }) {
  if (slug === "invoice-generator") {
    return (
      <div className="w-full h-32 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-900 p-3 flex flex-col justify-between overflow-hidden font-mono text-[9px] text-slate-600 dark:text-slate-400 select-none mb-4">
        <div className="flex justify-between items-start border-b border-slate-100 dark:border-slate-800 pb-1.5">
          <div className="font-bold text-slate-800 dark:text-white">INVOICE</div>
          <div className="text-right text-[7px] text-slate-400">#INV-0824</div>
        </div>
        <div className="space-y-1 my-1">
          <div className="flex justify-between border-b border-slate-100/50 dark:border-slate-800/50 pb-0.5">
            <span>Development Services</span>
            <span className="font-bold text-slate-850 dark:text-white">$3,200</span>
          </div>
          <div className="flex justify-between border-b border-slate-100/50 dark:border-slate-800/50 pb-0.5">
            <span>UI/UX Design Spec</span>
            <span className="font-bold text-slate-850 dark:text-white">$1,500</span>
          </div>
        </div>
        <div className="bg-slate-150 dark:bg-slate-900 rounded p-1 flex justify-between items-center text-[10px] text-slate-800 dark:text-white font-bold">
          <span className="uppercase text-[8px] tracking-wider text-slate-400">TOTAL DUE</span>
          <span>$4,700.00</span>
        </div>
      </div>
    );
  }

  if (slug === "proposal-generator") {
    return (
      <div className="w-full h-32 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-900 p-3 flex flex-col justify-between overflow-hidden text-[9px] text-slate-600 dark:text-slate-400 select-none mb-4">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-1 flex justify-between items-center">
          <span className="font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider text-[8px]">PROPOSAL</span>
          <span className="text-[7px] bg-blue-500/10 text-blue-600 dark:text-blue-400 px-1 py-0.5 rounded">v1.2</span>
        </div>
        <div className="space-y-1">
          <div className="font-bold text-slate-800 dark:text-white">NovaSphere Brand Migration</div>
          <p className="text-[8px] text-slate-400 line-clamp-2">Complete frontend audit, Next.js application rebuild, and design system migration.</p>
        </div>
        <div className="flex justify-between items-center border-t border-slate-100 dark:border-slate-800 pt-1">
          <div>
            <span className="text-[7px] text-slate-400 block">EST. BUDGET</span>
            <span className="font-bold font-mono text-slate-800 dark:text-white text-[10px]">$12,500</span>
          </div>
          <div className="text-right">
            <span className="text-[7px] text-slate-400 block">DURATION</span>
            <span className="font-bold text-slate-850 dark:text-white">5 Weeks</span>
          </div>
        </div>
      </div>
    );
  }

  if (slug === "contract-generator") {
    return (
      <div className="w-full h-32 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-900 p-3 flex flex-col justify-between overflow-hidden text-[9px] text-slate-600 dark:text-slate-400 select-none mb-4">
        <div className="bg-red-500/5 border border-red-500/20 text-red-600 dark:text-red-400 text-[7px] p-1 rounded leading-normal">
          DISCLAIMER: For informational purposes only.
        </div>
        <div className="space-y-1">
          <div className="font-bold text-slate-800 dark:text-white uppercase text-[8px] tracking-wider border-b border-slate-100 dark:border-slate-800 pb-0.5">1. SCOPE OF SERVICES</div>
          <p className="text-[8px] text-slate-400 leading-relaxed line-clamp-2">The Service Provider agrees to perform design and engineering duties under NY jurisdiction...</p>
        </div>
        <div className="flex justify-between gap-2 border-t border-slate-100 dark:border-slate-800 pt-1 text-[7px]">
          <div className="border-r border-slate-200 dark:border-slate-800 pr-2">
            <span className="text-slate-400 block">PROVIDER</span>
            <span className="font-bold text-slate-800 dark:text-white">Jane Doe LLC</span>
          </div>
          <div>
            <span className="text-slate-400 block">CLIENT</span>
            <span className="font-bold text-slate-850 dark:text-white">Horizon Analytics</span>
          </div>
        </div>
      </div>
    );
  }

  if (slug === "rate-calculator") {
    return (
      <div className="w-full h-32 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-900 p-3 flex flex-col justify-between overflow-hidden text-[9px] text-slate-600 dark:text-slate-400 select-none mb-4 font-mono">
        <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-1">
          <span className="font-bold text-slate-850 dark:text-white uppercase text-[8px]">RATE MODELER</span>
          <span className="font-mono text-emerald-600 text-[10px] font-bold">+$115K/yr</span>
        </div>
        <div className="grid grid-cols-2 gap-1.5 my-1 text-[8px]">
          <div className="bg-slate-100 dark:bg-slate-900 p-1 rounded">
            <span className="text-slate-400 block">Target Income</span>
            <span className="font-bold text-slate-850 dark:text-white">$95,000</span>
          </div>
          <div className="bg-slate-100 dark:bg-slate-900 p-1 rounded">
            <span className="text-slate-400 block">Expenses</span>
            <span className="font-bold text-slate-850 dark:text-white">$20,000</span>
          </div>
        </div>
        <div className="bg-blue-600/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 border border-blue-200/30 p-1 rounded flex justify-between items-center text-[10px] font-bold">
          <span className="text-[8px] uppercase tracking-wider text-blue-500 font-sans">HOURLY RATE</span>
          <span className="font-mono">$85.00/hr</span>
        </div>
      </div>
    );
  }

  if (slug === "time-tracker") {
    return (
      <div className="w-full h-32 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-900 p-3 flex flex-col justify-between overflow-hidden text-[9px] text-slate-600 dark:text-slate-400 select-none mb-4 font-mono">
        <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-1.5">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="font-bold text-slate-800 dark:text-white">LIVE TRACK</span>
          </div>
          <div className="font-bold text-blue-600 dark:text-blue-400 text-[10px]">02:45:12</div>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between text-[7px] text-slate-400">
            <span>CLIENT / PROJECT</span>
            <span>DURATION</span>
          </div>
          <div className="flex justify-between text-[8px] border-b border-slate-150 dark:border-slate-850 pb-0.5">
            <span className="truncate text-slate-750 dark:text-slate-200">Stellar Horizon Corp</span>
            <span className="font-semibold text-slate-800 dark:text-white">4.5 hrs</span>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="flex-1 text-center py-1 rounded bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[8px] font-semibold font-sans">PAUSE</div>
          <div className="flex-1 text-center py-1 rounded bg-blue-600 text-white text-[8px] font-black font-sans">LOG HOURS</div>
        </div>
      </div>
    );
  }

  return null;
}

export default function Home() {
  const [visitedTools, setVisitedTools] = useState<ToolItem[]>([]);
  const [visitedTimestamps, setVisitedTimestamps] = useState<Record<string, number>>({});
  const [isRecentState, setIsRecentState] = useState(false);
  const [openHomepageFaq, setOpenHomepageFaq] = useState<number | null>(null);

  const [issueDate, setIssueDate] = useState("12 October 2025");
  const [dueDate, setDueDate] = useState("26 October 2025");
  const [proposalDate, setProposalDate] = useState("12 October 2025");
  const [contractDate, setContractDate] = useState("1 October 2025");

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

    // Calculate relative dynamic dates
    const now = new Date();
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    const formatDate = (date: Date) => {
      return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
    };
    const due = new Date(now);
    due.setDate(now.getDate() + 14);

    setIssueDate(formatDate(now));
    setDueDate(formatDate(due));
    setProposalDate(formatDate(now));
    setContractDate(formatDate(now));

    return () => {
      window.removeEventListener("storage_visited_tools_updated", loadVisitedTools);
      window.removeEventListener("storage", loadVisitedTools);
    };
  }, []);

  // Delete/dismiss item from visited tools list in localStorage
  const handleRemoveRecent = (slug: string) => {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem("visited_tools");
      if (stored) {
        let visits: { slug: string; timestamp: number }[] = JSON.parse(stored);
        visits = visits.filter((item) => item.slug !== slug);

        if (visits.length > 0) {
          localStorage.setItem("visited_tools", JSON.stringify(visits));
        } else {
          localStorage.removeItem("visited_tools");
        }

        // Dispatch custom storage updated event to notify of history change
        window.dispatchEvent(new Event("storage_visited_tools_updated"));

        // Directly trigger load of updated tools to immediately sync client state
        loadVisitedTools();
      }
    } catch (e) {
      console.error("Failed to remove tool from visited tools history", e);
    }
  };

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
          description: "Draft professional, standard contracts and agreements for freelance projects.",
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

              <h1 className="text-4xl sm:text-5xl lg:text-[2.75rem] font-black leading-[1.15] tracking-tight text-slate-900 dark:text-white">
                Everything you need to <br className="hidden sm:inline" />
                run your freelance business — <span className="text-blue-600 dark:text-blue-500">free, private, no signup</span>.
              </h1>

              <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed max-w-xl">
                Create professional invoices, contracts, proposals, and trackers instantly. All tools run entirely in your browser—meaning your business data and client agreements remain 100% secure and private, with no accounts or hidden subscriptions.
              </p>

              {/* Primary Call to Action */}
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <a
                  href="#workflow-section"
                  className="inline-flex items-center justify-center gap-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 text-white font-bold px-6 py-4 shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.01]"
                >
                  Start With Any Tool — No Signup
                  <ArrowRight className="w-5 h-5" />
                </a>
                <Link
                  href="/about"
                  className="inline-flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200/20 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-semibold px-6 py-4 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
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
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-[10px] font-mono hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-all focus:outline-none focus:ring-1 focus:ring-blue-500"
                    title={isAutoplay ? "Pause rotation" : "Play rotation"}
                  >
                    {isAutoplay ? (
                      <>
                        <Pause className="w-3 h-3 text-blue-500 animate-pulse" />
                        <span>Auto-cycling preview</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3 h-3" />
                        <span>Rotation paused</span>
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
                    <div className="space-y-6 animate-fadeIn text-slate-850 dark:text-slate-200">
                      {/* Premium executive header matching PdfHeader */}
                      <div className="flex justify-between items-start border-b border-slate-100 dark:border-slate-800 pb-5">
                        <div>
                          <div className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                            ACME CREATIVE
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-1">
                            123 Freelance Way, Tech Hub
                          </p>
                        </div>
                        <div className="text-right">
                          <h1 className="text-xl font-black tracking-widest text-slate-900 dark:text-white leading-none uppercase">
                            INVOICE
                          </h1>
                          <div className="h-1 bg-blue-600 dark:bg-blue-500 w-10 mt-2 ml-auto" />
                        </div>
                      </div>

                      {/* 3-Column Metadata Block matching PdfMetadataBlock */}
                      <div className="grid grid-cols-3 gap-4 p-4 bg-slate-50 dark:bg-[#12131a] border-b border-slate-100 dark:border-slate-800/85 rounded-lg text-xs">
                        <div>
                          <span className="block text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                            INVOICE NO.
                          </span>
                          <span className="font-bold text-slate-900 dark:text-white mt-1 block">
                            #INV-2025-084
                          </span>
                        </div>
                        <div>
                          <span className="block text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                            DATE OF ISSUE
                          </span>
                          <span className="font-semibold text-slate-600 dark:text-slate-400 mt-1 block">
                            {issueDate}
                          </span>
                        </div>
                        <div>
                          <span className="block text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                            DUE DATE
                          </span>
                          <span className="font-semibold text-slate-900 dark:text-white mt-1 block">
                            {dueDate}
                          </span>
                        </div>
                      </div>

                      {/* Billed to Section */}
                      <div className="text-xs space-y-1">
                        <span className="block text-[9px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
                          BILL TO CLIENT
                        </span>
                        <h4 className="font-bold text-slate-900 dark:text-white">
                          Stellar Horizon Corp.
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          456 Enterprise Boulevard, Suite 800
                        </p>
                      </div>

                      {/* Mocked Invoice Line items table */}
                      <div className="space-y-3 pt-2">
                        <div className="text-[9px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 border-b border-slate-200 dark:border-slate-800 pb-1.5 flex justify-between">
                          <span>Services / Deliverables</span>
                          <span>Total</span>
                        </div>
                        <div className="flex justify-between text-xs items-center py-0.5">
                          <div>
                            <span className="font-semibold text-slate-900 dark:text-white">
                              System Architecture & NextJS Build
                            </span>
                            <span className="block text-[10px] text-slate-500 dark:text-slate-450 mt-0.5">
                              40 Hours @ $95/hr
                            </span>
                          </div>
                          <span className="font-mono font-bold text-slate-900 dark:text-white">$3,800.00</span>
                        </div>
                        <div className="flex justify-between text-xs items-center py-0.5">
                          <div>
                            <span className="font-semibold text-slate-900 dark:text-white">
                              UI/UX & Interactive Design Prototyping
                            </span>
                            <span className="block text-[10px] text-slate-500 dark:text-slate-450 mt-0.5">
                              Flat project rate
                            </span>
                          </div>
                          <span className="font-mono font-bold text-slate-900 dark:text-white">$1,000.00</span>
                        </div>
                      </div>

                      {/* Subtotal & Premium High-Contrast TOTAL DUE highlight box */}
                      <div className="pt-2 flex flex-col items-end gap-3">
                        <div className="w-1/2 flex justify-between text-xs text-slate-500 dark:text-slate-400 pr-4">
                          <span>Subtotal:</span>
                          <span className="font-mono font-semibold">$4,800.00</span>
                        </div>
                        <div className="w-full border-t border-b border-slate-900 dark:border-slate-100 bg-slate-100 dark:bg-[#151722]/80 py-2.5 px-4 flex justify-between items-center rounded">
                          <span className="text-[10px] font-black text-slate-950 dark:text-white uppercase tracking-widest">
                            Total Due
                          </span>
                          <span className="font-mono font-black text-slate-950 dark:text-white text-base">
                            $5,760.00
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: PROPOSAL SIMULATOR */}
                  {activeTab === "proposal" && (
                    <div className="space-y-6 animate-fadeIn text-slate-850 dark:text-slate-200">
                      {/* Premium executive header matching PdfHeader */}
                      <div className="flex justify-between items-start border-b border-slate-100 dark:border-slate-800 pb-5">
                        <div>
                          <div className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                            ACME CREATIVE
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                            Professional Creative & Consulting Services
                          </p>
                        </div>
                        <div className="text-right">
                          <h1 className="text-xl font-black tracking-widest text-slate-900 dark:text-white leading-none uppercase">
                            PROPOSAL
                          </h1>
                          <div className="h-1 bg-blue-600 dark:bg-blue-500 w-10 mt-2 ml-auto" />
                        </div>
                      </div>

                      {/* 3-Column Metadata Block matching PdfMetadataBlock */}
                      <div className="grid grid-cols-3 gap-4 p-4 bg-slate-50 dark:bg-[#12131a] border-b border-slate-100 dark:border-slate-800/85 rounded-lg text-xs">
                        <div>
                          <span className="block text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                            PREPARED FOR
                          </span>
                          <span className="font-bold text-slate-900 dark:text-white mt-1 block truncate">
                            NovaSphere Tech
                          </span>
                        </div>
                        <div>
                          <span className="block text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                            DATE OF ISSUE
                          </span>
                          <span className="font-semibold text-slate-600 dark:text-slate-400 mt-1 block">
                            {proposalDate}
                          </span>
                        </div>
                        <div>
                          <span className="block text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                            TIMELINE
                          </span>
                          <span className="font-semibold text-slate-900 dark:text-white mt-1 block">
                            4-6 Weeks Total
                          </span>
                        </div>
                      </div>

                      {/* Deliverables outline */}
                      <div className="space-y-3">
                        <span className="block text-[9px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
                          1. Project Strategy & Overview
                        </span>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-3 rounded-lg border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-[#090a0f] space-y-1">
                            <span className="font-bold text-xs text-slate-900 dark:text-white block">
                              Phase 1: Blueprint & Architecture
                            </span>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                              Database optimization plan, performance diagnostics, and custom UI design specs.
                            </p>
                          </div>
                          <div className="p-3 rounded-lg border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-[#090a0f] space-y-1">
                            <span className="font-bold text-xs text-slate-900 dark:text-white block">
                              Phase 2: Live Integration
                            </span>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                              Serverless migration, API logic construction, and client onboard pipeline.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Scope & Cost Footer */}
                      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                        <div>
                          <span className="block text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold tracking-widest">
                            Estimated Investment
                          </span>
                          <span className="text-base font-black text-blue-600 dark:text-blue-400 font-mono">
                            $12,500.00 USD
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="block text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold tracking-widest">
                            Estimated Duration
                          </span>
                          <span className="text-xs font-bold text-slate-900 dark:text-white">
                            4-6 Weeks Total
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 3: CONTRACT SIMULATOR */}
                  {activeTab === "contract" && (
                    <div className="space-y-4 animate-fadeIn text-slate-850 dark:text-slate-200">
                      {/* Authentic legal disclaimer matching PdfDisclaimer */}
                      <div className="border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#12131a] text-slate-600 dark:text-slate-400 text-[10px] leading-relaxed p-3 rounded-lg font-medium select-none">
                        DISCLAIMER: This is a generic template for informational purposes only and does not constitute legal advice. Consult a qualified lawyer before using this document.
                      </div>

                      {/* Premium executive header matching PdfHeader */}
                      <div className="flex justify-between items-start border-b border-slate-100 dark:border-slate-800 pb-4 pt-1">
                        <div>
                          <div className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                            Jane Doe Design LLC
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                            Independent Creative Consulting
                          </p>
                        </div>
                        <div className="text-right">
                          <h1 className="text-xl font-black tracking-widest text-slate-900 dark:text-white leading-none uppercase">
                            CONTRACT
                          </h1>
                          <p className="text-[9px] text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1.5">
                            Service Agreement
                          </p>
                          <div className="h-1 bg-blue-600 dark:bg-blue-500 w-10 mt-2 ml-auto" />
                        </div>
                      </div>

                      {/* 3-Column Metadata Block matching PdfMetadataBlock */}
                      <div className="grid grid-cols-3 gap-4 p-4 bg-slate-50 dark:bg-[#12131a] border-b border-slate-100 dark:border-slate-800/85 rounded-lg text-xs">
                        <div>
                          <span className="block text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                            CLIENT
                          </span>
                          <span className="font-bold text-slate-900 dark:text-white mt-1 block truncate">
                            Horizon Analytics
                          </span>
                        </div>
                        <div>
                          <span className="block text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                            EFFECTIVE DATE
                          </span>
                          <span className="font-semibold text-slate-600 dark:text-slate-400 mt-1 block font-mono text-[11px]">
                            {contractDate}
                          </span>
                        </div>
                        <div>
                          <span className="block text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                            JURISDICTION
                          </span>
                          <span className="font-semibold text-slate-900 dark:text-white mt-1 block truncate">
                            State of New York
                          </span>
                        </div>
                      </div>

                      {/* Standard legal copy block */}
                      <div className="space-y-3 text-[11px] leading-relaxed">
                        <div className="space-y-1 font-sans">
                          <h4 className="font-bold text-slate-950 dark:text-white uppercase tracking-wider text-[10px]">
                            1. Scope of Work & Deliverables
                          </h4>
                          <p className="text-slate-500 dark:text-slate-400">
                            The Service Provider agrees to perform comprehensive front-end systems engineering, accessibility auditing, and performance tuning under the conditions set forth herein.
                          </p>
                        </div>

                        <div className="space-y-1 font-sans">
                          <h4 className="font-bold text-slate-950 dark:text-white uppercase tracking-wider text-[10px]">
                            2. Compensation & Financial Terms
                          </h4>
                          <p className="text-slate-500 dark:text-slate-400">
                            The Client shall compensate the Service Provider according to the following agreed schedule: 50% upfront retainer, 50% upon final delivery of assets.
                          </p>
                        </div>
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
            &ldquo;We built Freelance Ops Toolkit to package essential, professional-grade calculations, standard business documents, and communication guides usually gated behind expensive corporate subscriptions. No sign-ups, no data tracking—just secure, local utilities designed specifically to help independent professionals run their business with confidence and clarity.&rdquo;
          </p>
        </div>
      </section>

      {/* SECTION 2.2: Freelance Operational Workflow Sequence */}
      <section id="workflow-section" className="py-16 sm:py-20 bg-white dark:bg-[#090a0f] border-b border-slate-200/50 dark:border-slate-900/60 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight sm:text-4xl">
              Discover Tools by Freelance Workflow
            </h2>
            <p className="text-base text-slate-650 dark:text-slate-400">
              Stop looking at tools as disconnected utilities. Follow the actual lifecycle of a client project and jump straight to the exact generator or calculator you need right now.
            </p>
          </div>

          {/* Workflow steps layout */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 relative">

            {/* Step 1: Find & Onboard */}
            <div className="group relative rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-[#0c0d12]/50 p-6 flex flex-col justify-between hover:border-blue-500/30 transition-all shadow-sm">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black tracking-widest text-slate-400 dark:text-slate-500 uppercase">STAGE 1</span>
                  <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                    <Briefcase className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Find & Onboard</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                    Showcase past work with professional case studies and qualify prospects during intake.
                  </p>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200/30 dark:border-slate-800/40 space-y-2">
                <span className="block text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Launch Utility:</span>
                <div className="flex flex-wrap gap-1.5">
                  <Link href="/tools/case-study-builder" className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-blue-500/10 dark:bg-blue-400/10 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-500 dark:hover:text-white text-[11px] font-semibold transition-all">
                    Case Study Builder
                  </Link>
                  <Link href="/tools/client-intake-form" className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-blue-500/10 dark:bg-blue-400/10 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-500 dark:hover:text-white text-[11px] font-semibold transition-all">
                    Intake Form
                  </Link>
                </div>
              </div>
            </div>

            {/* Step 2: Send a Proposal */}
            <div className="group relative rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-[#0c0d12]/50 p-6 flex flex-col justify-between hover:border-blue-500/30 transition-all shadow-sm">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black tracking-widest text-slate-400 dark:text-slate-500 uppercase">STAGE 2</span>
                  <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                    <Sparkles className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Send a Proposal</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                    Estimate deliverable complexities, timelines, and pitch pricing with clean proposals.
                  </p>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200/30 dark:border-slate-800/40 space-y-2">
                <span className="block text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Launch Utility:</span>
                <div className="flex flex-wrap gap-1.5">
                  <Link href="/tools/proposal-generator" className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-blue-500/10 dark:bg-blue-400/10 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-500 dark:hover:text-white text-[11px] font-semibold transition-all">
                    Proposal Gen
                  </Link>
                  <Link href="/tools/scope-estimator" className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-blue-500/10 dark:bg-blue-400/10 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-500 dark:hover:text-white text-[11px] font-semibold transition-all">
                    Scope Estimator
                  </Link>
                </div>
              </div>
            </div>

            {/* Step 3: Sign a Contract */}
            <div className="group relative rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-[#0c0d12]/50 p-6 flex flex-col justify-between hover:border-blue-500/30 transition-all shadow-sm">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black tracking-widest text-slate-400 dark:text-slate-500 uppercase">STAGE 3</span>
                  <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                    <FileSignature className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Sign a Contract</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                    Protect intellectual property and secure monthly income before doing any work.
                  </p>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200/30 dark:border-slate-800/40 space-y-2">
                <span className="block text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Launch Utility:</span>
                <div className="flex flex-wrap gap-1.5">
                  <Link href="/tools/contract-generator" className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-blue-500/10 dark:bg-blue-400/10 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-500 dark:hover:text-white text-[11px] font-semibold transition-all">
                    Contract Builder
                  </Link>
                  <Link href="/tools/nda-generator" className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-blue-500/10 dark:bg-blue-400/10 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-500 dark:hover:text-white text-[11px] font-semibold transition-all">
                    NDA Gen
                  </Link>
                </div>
              </div>
            </div>

            {/* Step 4: Track Your Time */}
            <div className="group relative rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-[#0c0d12]/50 p-6 flex flex-col justify-between hover:border-blue-500/30 transition-all shadow-sm">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black tracking-widest text-slate-400 dark:text-slate-500 uppercase">STAGE 4</span>
                  <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                    <Clock className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Track Your Time</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                    Log billable hours, record client sessions, and instantly prefill your invoices.
                  </p>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200/30 dark:border-slate-800/40 space-y-2">
                <span className="block text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Launch Utility:</span>
                <div className="flex flex-wrap gap-1.5">
                  <Link href="/tools/time-tracker" className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-blue-500/10 dark:bg-blue-400/10 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-500 dark:hover:text-white text-[11px] font-semibold transition-all">
                    Time Tracker
                  </Link>
                </div>
              </div>
            </div>

            {/* Step 5: Get Paid */}
            <div className="group relative rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-[#0c0d12]/50 p-6 flex flex-col justify-between hover:border-blue-500/30 transition-all shadow-sm">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black tracking-widest text-slate-400 dark:text-slate-500 uppercase">STAGE 5</span>
                  <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                    <FileText className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Get Paid</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                    Generate polished invoices, calculate late payment fees, and draft polite payment reminders.
                  </p>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200/30 dark:border-slate-800/40 space-y-2">
                <span className="block text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Launch Utility:</span>
                <div className="flex flex-wrap gap-1.5">
                  <Link href="/tools/invoice-generator" className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-blue-500/10 dark:bg-blue-400/10 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-500 dark:hover:text-white text-[11px] font-semibold transition-all">
                    Invoice Gen
                  </Link>
                  <Link href="/tools/late-payment-fee-calculator" className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-blue-500/10 dark:bg-blue-400/10 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-500 dark:hover:text-white text-[11px] font-semibold transition-all">
                    Late Fee Calc
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 2.3: Data flow / Privacy Transparency Section */}
      <section className="py-16 bg-slate-50 dark:bg-[#07080d]/60 border-b border-slate-200/50 dark:border-slate-900/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Where Does Your Business Data Go?
            </h2>
            <p className="text-base text-slate-605 dark:text-slate-400">
              Complete transparency. A privacy-focused professional should know exactly how their confidential data is handled under the hood.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Class 1: Local Only */}
            <div className="p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c0d12] flex flex-col justify-between shadow-sm">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-400 border border-emerald-200/20 dark:border-emerald-500/30">
                    100% Client-Side
                  </span>
                  <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500 font-semibold">12 of 15 Tools</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Fully Local Tools</h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Calculators, invoice editors, and standard document contract builders run completely in your browser. All logo uploads, financial entries, and client names are processed in browser memory. <strong>No data ever leaves your computer.</strong>
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/60">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">Applies to:</span>
                <p className="text-[11px] text-slate-500 dark:text-slate-500 leading-relaxed">
                  Invoice Generator, Proposal Draft, Contract Builder, NDA Generator, Retainer Generator, Client Intake Form, Portfolio Case Study, Rate Calculator, Currency Converter, Late Fee Calculator, Rate Benchmark.
                </p>
              </div>
            </div>

            {/* Class 2: Account-Optional */}
            <div className="p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c0d12] flex flex-col justify-between shadow-sm">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-600 dark:bg-indigo-400/10 dark:text-indigo-400 border border-indigo-200/20 dark:border-indigo-500/30">
                    Account Optional
                  </span>
                  <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500 font-semibold">2 of 15 Tools</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Local-First, Sync Optional</h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Time tracker logs and project scopes operate on your browser storage with zero login required. You can opt to register a free, secure account if you want your active timesheets to sync across devices—otherwise, it remains 100% local.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/60">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">Applies to:</span>
                <p className="text-[11px] text-slate-500 dark:text-slate-500 leading-relaxed">
                  Time Tracker, Project Scope Estimator.
                </p>
              </div>
            </div>

            {/* Class 3: AI-Assisted */}
            <div className="p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c0d12] flex flex-col justify-between shadow-sm">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-600 dark:bg-amber-400/10 dark:text-amber-400 border border-amber-200/20 dark:border-amber-500/30">
                    SSL Encryption
                  </span>
                  <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500 font-semibold">2 of 15 Tools</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">AI-Drafted, Never Retained</h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Email reminder drafts and meeting bullet summaries. Your text inputs are securely encrypted and processed by Google&apos;s Gemini API to generate response templates, but <strong>no prompts or results are saved or retained afterward.</strong>
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/60">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">Applies to:</span>
                <p className="text-[11px] text-slate-500 dark:text-slate-500 leading-relaxed">
                  Payment Reminder Generator, Meeting Recap Generator.
                </p>
              </div>
            </div>
          </div>
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
        onRemoveRecent={handleRemoveRecent}
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
                        {category.categoryName} <span className="text-slate-400 dark:text-slate-500 font-normal">({category.tools.length})</span>
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

                            {/* Tool Preview Thumbnail */}
                            <ToolPreviewThumbnail slug={tool.slug} />

                            {/* Icon Accent & Title block */}
                            <div className="flex items-center gap-3 mt-4">
                              <div className="p-2.5 rounded-lg bg-blue-600 text-white w-10 h-10 flex items-center justify-center shadow-md shadow-blue-500/10 group-hover:scale-105 transition-transform duration-200 flex-shrink-0">
                                <Icon className="w-4 h-4" />
                              </div>
                              <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white line-clamp-1 leading-tight">
                                {tool.title}
                              </h4>
                            </div>

                            <p className="text-slate-650 dark:text-slate-400 mt-4 text-xs sm:text-sm leading-relaxed line-clamp-3">
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
                          {category.categoryName} <span className="text-slate-400 dark:text-slate-500 font-normal">({category.tools.length})</span>
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
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-850 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-semibold px-8 py-4 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

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

      {/* SECTION 5: Condensed Homepage FAQ Preview Section */}
      <section className="py-16 sm:py-20 bg-slate-50 dark:bg-[#090a0f] border-t border-slate-200/50 dark:border-slate-900/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">

          <div className="space-y-3">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Trust & Frequently Asked Questions
            </h2>
            <p className="text-sm sm:text-base text-slate-605 dark:text-slate-400">
              Quick, clear answers to the most common questions freelancers ask about our platform.
            </p>
          </div>

          <div className="space-y-4 max-w-3xl mx-auto text-left">
            {/* FAQ 1 */}
            <div className="border border-slate-200 dark:border-slate-850 bg-white dark:bg-[#0c0d12] rounded-xl overflow-hidden transition-all shadow-sm">
              <button
                onClick={() => setOpenHomepageFaq(openHomepageFaq === 0 ? null : 0)}
                className="flex items-center justify-between w-full px-5 py-4 text-left font-bold text-sm sm:text-base text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-950/40 transition-colors"
              >
                <span>Is this really free?</span>
                {openHomepageFaq === 0 ? (
                  <ChevronUp className="w-4 h-4 text-blue-500" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-500" />
                )}
              </button>
              {openHomepageFaq === 0 && (
                <div className="px-5 pb-4 pt-1 text-xs sm:text-sm text-slate-650 dark:text-slate-450 leading-relaxed border-t border-slate-100 dark:border-slate-850/40 animate-fadeIn">
                  Yes, Freelance Ops Toolkit is 100% free. There are no subscriptions, paywalls, or hidden fees. We operate completely serverless for stateless tools to keep overhead minimal and pass all benefits on to the independent community.
                </div>
              )}
            </div>

            {/* FAQ 2 */}
            <div className="border border-slate-200 dark:border-slate-850 bg-white dark:bg-[#0c0d12] rounded-xl overflow-hidden transition-all shadow-sm">
              <button
                onClick={() => setOpenHomepageFaq(openHomepageFaq === 1 ? null : 1)}
                className="flex items-center justify-between w-full px-5 py-4 text-left font-bold text-sm sm:text-base text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-950/40 transition-colors"
              >
                <span>Where does my business data go?</span>
                {openHomepageFaq === 1 ? (
                  <ChevronUp className="w-4 h-4 text-blue-500" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-500" />
                )}
              </button>
              {openHomepageFaq === 1 && (
                <div className="px-5 pb-4 pt-1 text-xs sm:text-sm text-slate-650 dark:text-slate-450 leading-relaxed border-t border-slate-100 dark:border-slate-850/40 animate-fadeIn">
                  90% of our tools operate completely client-side in browser memory. Invoices, contracts, rates, and client details are calculated and generated locally—meaning your sensitive data never leaves your browser window and is never sent to or stored on our servers.
                </div>
              )}
            </div>

            {/* FAQ 3 */}
            <div className="border border-slate-200 dark:border-slate-850 bg-white dark:bg-[#0c0d12] rounded-xl overflow-hidden transition-all shadow-sm">
              <button
                onClick={() => setOpenHomepageFaq(openHomepageFaq === 2 ? null : 2)}
                className="flex items-center justify-between w-full px-5 py-4 text-left font-bold text-sm sm:text-base text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-950/40 transition-colors"
              >
                <span>Do I need an account?</span>
                {openHomepageFaq === 2 ? (
                  <ChevronUp className="w-4 h-4 text-blue-500" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-500" />
                )}
              </button>
              {openHomepageFaq === 2 && (
                <div className="px-5 pb-4 pt-1 text-xs sm:text-sm text-slate-650 dark:text-slate-450 leading-relaxed border-t border-slate-100 dark:border-slate-850/40 animate-fadeIn">
                  No. You can generate unlimited invoices, NDAs, proposals, and track late fees with no account or signup. An optional free account is only required if you use cloud persistence features in the Time Tracker or Project Scope Estimator.
                </div>
              )}
            </div>
          </div>

          <div className="pt-4">
            <Link
              href="/about#faq"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-850 border border-slate-200 dark:border-slate-850 text-slate-800 dark:text-slate-200 font-semibold px-6 py-3.5 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
            >
              Read our full FAQ on the About page
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </section>


    </div>
  );
}
