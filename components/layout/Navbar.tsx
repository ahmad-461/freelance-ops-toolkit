"use client";

import React, { useState, useRef, useEffect } from "react";
import LinkComponent from "next/link";
import ThemeToggle from "./ThemeToggle";
import Logo from "@/components/shared/Logo";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  Briefcase,
  FileText,
  Menu,
  X,
  Calculator,
  RefreshCw,
  CalendarClock,
  Sparkles,
  FileSignature,
  Shield,
  ClipboardList,
  Clock,
  Layers,
  TrendingUp,
  Search,
  ChevronRight,
  Home,
} from "lucide-react";

interface ToolItem {
  name: string;
  description: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface ToolCategory {
  categoryName: string;
  items: ToolItem[];
}

export default function Navbar() {
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Scroll tracking state
  const [isScrolled, setIsScrolled] = useState(false);
  const [shouldAnimate, setShouldAnimate] = useState(true);

  useEffect(() => {
    // Respect prefers-reduced-motion
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      setShouldAnimate(!mediaQuery.matches);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Handle visited tools tracking
  useEffect(() => {
    if (!pathname || !pathname.startsWith("/tools/")) return;

    const slug = pathname.replace("/tools/", "");
    if (!slug) return;

    try {
      const stored = localStorage.getItem("visited_tools");
      let visits: { slug: string; timestamp: number }[] = [];
      if (stored) {
        visits = JSON.parse(stored);
      }

      visits = visits.filter((item) => item.slug !== slug);
      visits.unshift({ slug, timestamp: Date.now() });
      visits = visits.slice(0, 5);

      localStorage.setItem("visited_tools", JSON.stringify(visits));
      window.dispatchEvent(new Event("storage_visited_tools_updated"));
    } catch (e) {
      console.error("Failed to update tool visits history in localStorage", e);
    }
  }, [pathname]);

  // Open Command Palette custom event dispatcher
  const openCommandPalette = () => {
    window.dispatchEvent(new CustomEvent("open-command-palette"));
  };

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsToolsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const categorizedTools: ToolCategory[] = [
    {
      categoryName: "Get Paid Faster",
      items: [
        {
          name: "Invoice Generator",
          description: "Create professional business invoices",
          href: "/tools/invoice-generator",
          icon: FileText,
        },
        {
          name: "Rate Calculator",
          description: "Determine your ideal hourly rate",
          href: "/tools/rate-calculator",
          icon: Calculator,
        },
        {
          name: "Currency Converter",
          description: "Convert international project fees",
          href: "/tools/currency-converter",
          icon: RefreshCw,
        },
        {
          name: "Late Payment Fee Calculator",
          description: "Calculate late interest and overdue fees",
          href: "/tools/late-payment-fee-calculator",
          icon: CalendarClock,
        },
      ],
    },
    {
      categoryName: "Agreements & Contracts",
      items: [
        {
          name: "Proposal Generator",
          description: "Create professional quotes & proposals",
          href: "/tools/proposal-generator",
          icon: Sparkles,
        },
        {
          name: "Contract Template Builder",
          description: "Draft standard client contracts",
          href: "/tools/contract-generator",
          icon: FileSignature,
        },
        {
          name: "NDA Generator",
          description: "Create custom Non-Disclosure agreements",
          href: "/tools/nda-generator",
          icon: Shield,
        },
        {
          name: "Retainer Agreement Generator",
          description: "Draft ongoing monthly retainer terms",
          href: "/tools/retainer-generator",
          icon: CalendarClock,
        },
      ],
    },
    {
      categoryName: "Win & Onboard Clients",
      items: [
        {
          name: "Client Intake Form Builder",
          description: "Onboard clients with custom questions",
          href: "/tools/client-intake-form",
          icon: ClipboardList,
        },
        {
          name: "Portfolio Case Study Builder",
          description: "Generate structured, metrics-driven stories",
          href: "/tools/case-study-builder",
          icon: Briefcase,
        },
      ],
    },
    {
      categoryName: "AI-Assisted Communication",
      items: [
        {
          name: "Payment Reminder Generator",
          description: "Perfect professional emails for past-due clients",
          href: "/tools/payment-reminder-generator",
          icon: ({ className }: { className?: string }) => (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={className || "w-4 h-4"}
            >
              <rect width="20" height="16" x="2" y="4" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
          ),
        },
        {
          name: "Meeting Recap Generator",
          description: "Draft professional recap emails with action items",
          href: "/tools/meeting-recap-generator",
          icon: ({ className }: { className?: string }) => (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={className || "w-4 h-4"}
            >
              <path d="M2 6h4" />
              <path d="M2 10h4" />
              <path d="M2 14h4" />
              <path d="M2 18h4" />
              <rect width="12" height="18" x="10" y="3" rx="2" />
            </svg>
          ),
        },
      ],
    },
    {
      categoryName: "Track Time & Scope Projects",
      items: [
        {
          name: "Time Tracker",
          description: "Log hours, track sessions & export to invoices",
          href: "/tools/time-tracker",
          icon: Clock,
        },
        {
          name: "Project Scope Estimator",
          description: "Calculate complexity and timeline targets",
          href: "/tools/scope-estimator",
          icon: Layers,
        },
      ],
    },
    {
      categoryName: "Price Your Work",
      items: [
        {
          name: "Rate Benchmark Tool",
          description: "Compare regional freelance market rates",
          href: "/tools/rate-benchmark",
          icon: TrendingUp,
        },
      ],
    },
  ];

  // Concept 3: "The Borderless Editorial Monolith" - completely solid or transparent background without hard boundaries
  const navbarClasses = isScrolled
    ? "bg-[#090a0f] py-3 text-white shadow-[0_4px_30px_rgba(0,0,0,0.8)] border-b border-transparent"
    : "bg-[#090a0f] py-4 text-white border-b border-transparent";

  const transitionClasses = shouldAnimate ? "transition-all duration-300 ease-in-out" : "";

  // Pure white or electric blue logo for premium presence
  const logoClasses = "text-white flex-shrink-0 hover:text-blue-500 transition-colors duration-200";

  // Sophisticated elegant wide-tracking typography
  const brandTextClasses = "hidden md:inline text-white font-black tracking-[0.2em] uppercase text-xs";

  // Monolith sleek editorial interactive states: links draw dynamic line or expand underline on hover
  const linkClasses = "text-slate-300 hover:text-white text-xs uppercase tracking-widest transition-colors duration-200 py-1.5 px-3 rounded relative group";

  // Sleek, high-contrast, inset input field for search block
  const searchBtnClasses = "inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 hover:bg-slate-900 text-xs font-mono transition-all duration-200 shadow-inner w-44 md:w-56 justify-between";
  const kbdClasses = "inline-flex items-center gap-0.5 rounded border border-slate-800 bg-slate-900 px-1.5 py-0.5 text-[9px] font-mono text-slate-500 shadow-sm";

  const themeToggleClasses = "p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:bg-slate-900 hover:text-white transition-all duration-200 focus:outline-none";

  const mobileToggleClasses = "p-2 rounded-xl text-slate-300 hover:text-white bg-slate-950 border border-slate-800 transition-all duration-200";

  const mobileMenuContainerClasses = "md:hidden bg-[#090a0f] border-t border-slate-900 px-4 py-6 space-y-6 max-h-[85vh] overflow-y-auto text-white shadow-2xl";

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 w-full ${navbarClasses} ${transitionClasses}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center flex-shrink-0">
            <LinkComponent
              href="/"
              className="flex items-center gap-3 font-bold hover:opacity-95 transition-opacity"
              aria-label="Freelance Ops Home"
            >
              <Logo size={28} className={logoClasses} />
              <span className={brandTextClasses}>
                Freelance Ops
              </span>
            </LinkComponent>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-4">
            <LinkComponent
              href="/"
              className={linkClasses}
            >
              Home
              <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-blue-500 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-200" />
            </LinkComponent>

            {/* Tools Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsToolsOpen(!isToolsOpen)}
                className={`flex items-center gap-1.5 focus:outline-none ${linkClasses}`}
                aria-expanded={isToolsOpen}
                aria-haspopup="true"
              >
                Tools
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-250 ${isToolsOpen ? "rotate-180 text-blue-500" : ""}`}
                />
                <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-blue-500 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-200" />
              </button>

              {isToolsOpen && (
                <div className="absolute left-1/2 -translate-x-1/2 mt-3 w-[480px] rounded-2xl border border-slate-800/80 bg-[#090a0f]/95 backdrop-blur-md p-4 shadow-[0_10px_40px_rgba(0,0,0,0.8)] focus:outline-none grid grid-cols-2 gap-4 max-h-[85vh] overflow-y-auto z-50">
                  {categorizedTools.map((cat) => (
                    <div key={cat.categoryName} className="space-y-1">
                      <div className="px-2 py-1 text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] border-b border-slate-900 pb-1.5 mb-2">
                        {cat.categoryName}
                      </div>
                      <div className="space-y-1">
                        {cat.items.map((tool) => {
                          const Icon = tool.icon;
                          return (
                            <LinkComponent
                              key={tool.name}
                              href={tool.href}
                              onClick={() => setIsToolsOpen(false)}
                              className="flex items-start gap-2.5 rounded-xl p-2 hover:bg-slate-950 transition-all duration-150"
                            >
                              <div className="p-1 rounded-lg bg-blue-950/50 text-blue-400 flex-shrink-0 mt-0.5">
                                <Icon className="w-3.5 h-3.5" />
                              </div>
                              <div className="min-w-0">
                                <div className="text-xs font-bold text-slate-100 truncate group-hover:text-white">
                                  {tool.name}
                                </div>
                                <div className="text-[10px] text-slate-400 line-clamp-1 mt-0.5 leading-relaxed">
                                  {tool.description}
                                </div>
                              </div>
                            </LinkComponent>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Right Action Items */}
          <div className="hidden md:flex items-center gap-4 ml-auto">
            {/* High-contrast inset search trigger */}
            <button
              onClick={openCommandPalette}
              className={searchBtnClasses}
              title="Search utilities (Cmd+K)"
            >
              <div className="flex items-center gap-2">
                <Search className="w-3.5 h-3.5 text-slate-500" />
                <span>Search...</span>
              </div>
              <kbd className={kbdClasses}>
                <span>⌘</span><span>K</span>
              </kbd>
            </button>
            <ThemeToggle className={themeToggleClasses} />
          </div>

          {/* Mobile Menu Toggle / Quick Search */}
          <div className="flex items-center gap-2 md:hidden ml-auto">
            <ThemeToggle className={themeToggleClasses} />
            {/* High-contrast inset style for mobile search trigger */}
            <button
              onClick={openCommandPalette}
              className={mobileToggleClasses}
              aria-label="Search utilities"
            >
              <Search className="w-4 h-4 text-slate-300" />
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={mobileToggleClasses}
              aria-expanded={isMobileMenuOpen}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5 text-slate-300" /> : <Menu className="w-5 h-5 text-slate-300" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu dropdown */}
      {isMobileMenuOpen && (
        <div className={mobileMenuContainerClasses}>
          {/* Standalone Home Card */}
          <LinkComponent
            href="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center justify-between p-3.5 rounded-xl border border-slate-900 bg-slate-950 hover:bg-slate-900/60 transition-all shadow-md active:scale-[0.99]"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-950/60 text-blue-400 flex-shrink-0">
                <Home className="w-4 h-4" />
              </div>
              <span className="text-xs font-black tracking-[0.1em] uppercase text-white">
                Home
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </LinkComponent>

          {/* Categorized Tools List */}
          <div className="space-y-6">
            {categorizedTools.map((cat) => (
              <div key={cat.categoryName} className="space-y-3">
                {/* Category Header */}
                <div className="flex items-center gap-2 px-1">
                  <span className="w-1 h-3 rounded-full bg-blue-500 flex-shrink-0 animate-pulse" />
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    {cat.categoryName}
                  </span>
                </div>

                {/* Stacked Group Card */}
                <div className="bg-slate-950 border border-slate-900 rounded-2xl overflow-hidden divide-y divide-slate-900/50 shadow-md">
                  {cat.items.map((tool) => {
                    const Icon = tool.icon;
                    return (
                      <LinkComponent
                        key={tool.name}
                        href={tool.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center justify-between p-3.5 hover:bg-slate-900 transition-all duration-150 active:scale-[0.99]"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="p-2 rounded-lg bg-blue-950/40 text-blue-400 flex-shrink-0">
                            <Icon className="w-4 h-4" />
                          </div>
                          <span className="text-xs font-bold text-slate-200 truncate">
                            {tool.name}
                          </span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-500 flex-shrink-0" />
                      </LinkComponent>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
