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
    // Run once on mount to handle initial state if started scrolled
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Handle auto tracking of visited tools
  useEffect(() => {
    if (!pathname || !pathname.startsWith("/tools/")) return;

    // Derive slug from pathname, e.g., "/tools/invoice-generator" -> "invoice-generator"
    const slug = pathname.replace("/tools/", "");
    if (!slug) return;

    try {
      const stored = localStorage.getItem("visited_tools");
      let visits: { slug: string; timestamp: number }[] = [];
      if (stored) {
        visits = JSON.parse(stored);
      }

      // Filter out existing and prepend new visit
      visits = visits.filter((item) => item.slug !== slug);
      visits.unshift({ slug, timestamp: Date.now() });

      // Cap at most recent 5 items
      visits = visits.slice(0, 5);

      localStorage.setItem("visited_tools", JSON.stringify(visits));
      // Dispatch a storage event so components on the same page can re-render immediately if needed
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

  // Reorganized categories and tools as requested
  const categorizedTools: ToolCategory[] = [
    {
      categoryName: "Billing & Financial",
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
      categoryName: "Agreements & Legal",
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
      categoryName: "Client & Portfolio",
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
      categoryName: "AI Communication",
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
      categoryName: "Planning & Tracking",
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
      categoryName: "Reference",
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

  // Dynamically compute navbar classes based on scroll state
  const navbarClasses = isScrolled
    ? "bg-blue-600 border-b border-blue-700/50 shadow-md py-3 text-white"
    : "bg-transparent border-b border-transparent py-4";

  const transitionClasses = shouldAnimate ? "transition-all duration-300 ease-in-out" : "";

  // Dynamic class selections for components inside Navbar
  const logoClasses = isScrolled
    ? "text-white flex-shrink-0"
    : "text-blue-600 dark:text-blue-400 flex-shrink-0";

  const brandTextClasses = isScrolled
    ? "hidden md:inline text-white font-extrabold tracking-tight"
    : "hidden md:inline bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent font-extrabold tracking-tight";

  const linkClasses = isScrolled
    ? "text-blue-100 hover:text-white"
    : "text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400";

  const searchBtnClasses = isScrolled
    ? "inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-blue-500 bg-blue-700/60 hover:bg-blue-700 text-blue-100 hover:text-white text-xs font-mono transition-all"
    : "inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50/50 hover:bg-gray-100 dark:bg-gray-900/50 dark:hover:bg-gray-900 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 text-xs font-mono transition-all";

  const kbdClasses = isScrolled
    ? "inline-flex items-center gap-0.5 rounded border border-blue-400 bg-blue-800 px-1.5 text-[9px] font-sans font-medium text-blue-200 shadow-sm"
    : "inline-flex items-center gap-0.5 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 px-1.5 text-[9px] font-sans font-medium text-gray-400 dark:text-gray-500 shadow-sm";

  const themeToggleClasses = isScrolled
    ? "p-2 rounded-lg bg-blue-700 text-blue-100 hover:bg-blue-800 hover:text-white transition-colors focus:outline-none"
    : "p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500";

  const mobileToggleClasses = isScrolled
    ? "p-2 rounded-lg text-blue-100 hover:text-white hover:bg-blue-700 transition-colors"
    : "p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-850 transition-colors";

  const mobileMenuContainerClasses = isScrolled
    ? "md:hidden border-t border-blue-700 bg-blue-600 px-4 py-3 space-y-4 max-h-[85vh] overflow-y-auto text-white"
    : "md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-4 py-3 space-y-4 max-h-[85vh] overflow-y-auto";

  const mobileHomeLinkClasses = isScrolled
    ? "block text-base font-semibold text-blue-100 hover:text-white py-1 border-b border-blue-500 pb-2"
    : "block text-base font-semibold text-gray-700 dark:text-gray-200 hover:text-blue-600 py-1 border-b border-gray-100 dark:border-gray-900 pb-2";

  const mobileCatClasses = isScrolled
    ? "text-[10px] font-bold text-blue-200 uppercase tracking-wider px-1"
    : "text-[10px] font-bold text-gray-400 uppercase tracking-wider px-1";

  const mobileItemClasses = isScrolled
    ? "flex items-center gap-3 rounded-lg p-2 hover:bg-blue-700 text-blue-100 hover:text-white transition-colors"
    : "flex items-center gap-3 rounded-lg p-2 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors";

  const mobileItemIconClasses = isScrolled
    ? "w-4 h-4 text-blue-200 flex-shrink-0"
    : "w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0";

  return (
    <header className={`sticky top-0 z-50 w-full ${navbarClasses} ${transitionClasses}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center flex-shrink-0">
            <LinkComponent
              href="/"
              className="flex items-center gap-2.5 font-bold text-xl hover:opacity-90 transition-opacity"
              aria-label="Freelance Ops Home"
            >
              <Logo size={34} className={logoClasses} />
              <span className={brandTextClasses}>
                Freelance Ops
              </span>
            </LinkComponent>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <LinkComponent
              href="/"
              className={`text-sm font-semibold transition-colors ${linkClasses}`}
            >
              Home
            </LinkComponent>

            {/* Tools Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsToolsOpen(!isToolsOpen)}
                className={`flex items-center gap-1.5 text-sm font-semibold transition-colors focus:outline-none ${linkClasses}`}
                aria-expanded={isToolsOpen}
                aria-haspopup="true"
              >
                Tools
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${isToolsOpen ? "rotate-180" : ""}`}
                />
              </button>

              {isToolsOpen && (
                <div className="absolute left-1/2 -translate-x-1/2 mt-3 w-[480px] rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-xl ring-1 ring-black/5 focus:outline-none grid grid-cols-2 gap-4 max-h-[85vh] overflow-y-auto z-50">
                  {categorizedTools.map((cat) => (
                    <div key={cat.categoryName} className="space-y-1">
                      <div className="px-2 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 dark:border-gray-800 pb-1 mb-2">
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
                              className="flex items-start gap-2.5 rounded-lg p-2 hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors"
                            >
                              <div className="p-1 rounded-md bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5">
                                <Icon className="w-3.5 h-3.5" />
                              </div>
                              <div className="min-w-0">
                                <div className="text-xs font-semibold text-gray-900 dark:text-gray-100 truncate">
                                  {tool.name}
                                </div>
                                <div className="text-[10px] text-gray-500 dark:text-gray-400 line-clamp-1">
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
            {/* Desktop CMD+K Search Shortcut button */}
            <button
              onClick={openCommandPalette}
              className={searchBtnClasses}
              title="Search utilities (Cmd+K)"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search...</span>
              <kbd className={kbdClasses}>
                <span>⌘</span><span>K</span>
              </kbd>
            </button>
            <ThemeToggle className={themeToggleClasses} />
          </div>

          {/* Mobile Menu Toggle / Quick Search */}
          <div className="flex items-center gap-2 md:hidden ml-auto">
            <ThemeToggle className={themeToggleClasses} />
            {/* Mobile quick search icon button placed next to hamburger menu toggle */}
            <button
              onClick={openCommandPalette}
              className={mobileToggleClasses}
              aria-label="Search utilities"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={mobileToggleClasses}
              aria-expanded={isMobileMenuOpen}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu dropdown */}
      {isMobileMenuOpen && (
        <div className={mobileMenuContainerClasses}>
          <LinkComponent
            href="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className={mobileHomeLinkClasses}
          >
            Home
          </LinkComponent>
          <div className="space-y-4">
            {categorizedTools.map((cat) => (
              <div key={cat.categoryName} className="space-y-2">
                <div className={mobileCatClasses}>
                  {cat.categoryName}
                </div>
                <div className="space-y-1">
                  {cat.items.map((tool) => {
                    const Icon = tool.icon;
                    return (
                      <LinkComponent
                        key={tool.name}
                        href={tool.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={mobileItemClasses}
                      >
                        <Icon className={mobileItemIconClasses} />
                        <div className="min-w-0">
                          <div className="text-sm font-medium truncate">
                            {tool.name}
                          </div>
                        </div>
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
