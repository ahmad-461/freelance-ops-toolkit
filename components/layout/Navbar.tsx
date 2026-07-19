"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
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
  LogIn,
  LogOut,
  Clock,
  Layers,
  TrendingUp,
  Search,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { User as SupabaseUser } from "@supabase/supabase-js";

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
  const [user, setUser] = useState<SupabaseUser | null>(null);
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

  // Listen to Auth State Changes
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    window.location.reload();
  };

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
    ? "bg-white dark:bg-gray-950 shadow-sm border-b border-gray-200/50 dark:border-gray-800/50 py-3"
    : "bg-transparent border-b border-transparent py-4";

  const transitionClasses = shouldAnimate ? "transition-all duration-300 ease-in-out" : "";

  return (
    <header className={`sticky top-0 z-50 w-full ${navbarClasses} ${transitionClasses}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center flex-shrink-0">
            <Link
              href="/"
              className="flex items-center gap-2.5 text-blue-600 dark:text-blue-400 font-bold text-xl hover:opacity-90 transition-opacity"
              aria-label="Freelance Ops Home"
            >
              <Logo size={34} className="flex-shrink-0" />
              <span className="hidden md:inline bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent font-extrabold tracking-tight">
                Freelance Ops
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Home
            </Link>

            {/* Tools Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsToolsOpen(!isToolsOpen)}
                className="flex items-center gap-1.5 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors focus:outline-none"
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
                            <Link
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
                            </Link>
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
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50/50 hover:bg-gray-100 dark:bg-gray-900/50 dark:hover:bg-gray-900 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 text-xs font-mono transition-all"
              title="Search utilities (Cmd+K)"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search...</span>
              <kbd className="inline-flex items-center gap-0.5 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 px-1.5 text-[9px] font-sans font-medium text-gray-400 dark:text-gray-500 shadow-sm">
                <span>⌘</span><span>K</span>
              </kbd>
            </button>
            <ThemeToggle />
            {user ? (
              <div className="flex items-center gap-3 pl-2 border-l border-gray-200 dark:border-gray-800">
                <span
                  className="text-xs font-semibold text-gray-500 dark:text-gray-400 max-w-[150px] truncate"
                  title={user.email}
                >
                  {user.email}
                </span>
                <button
                  onClick={handleSignOut}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 px-2.5 py-1.5 rounded-lg transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-1.5 shadow-sm transition-all"
              >
                <LogIn className="w-3.5 h-3.5" />
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle / Quick Search */}
          <div className="flex items-center gap-2 md:hidden ml-auto">
            <ThemeToggle />
            {/* Mobile quick search icon button placed next to hamburger menu toggle */}
            <button
              onClick={openCommandPalette}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-850 transition-colors"
              aria-label="Search utilities"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-850 transition-colors"
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
        <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-4 py-3 space-y-4 max-h-[85vh] overflow-y-auto">
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-900 pb-3">
            {user ? (
              <div className="flex flex-col gap-1">
                <span className="text-xs text-gray-400 dark:text-gray-500">Logged in as</span>
                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 max-w-[200px] truncate">
                  {user.email}
                </span>
              </div>
            ) : (
              <span className="text-xs font-medium text-gray-500">Guest User</span>
            )}
            {user ? (
              <button
                onClick={() => {
                  handleSignOut();
                  setIsMobileMenuOpen(false);
                }}
                className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 px-2.5 py-1.5 rounded bg-red-50 dark:bg-red-950/30"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </button>
            ) : (
              <Link
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="inline-flex items-center gap-1 text-xs font-bold bg-blue-600 text-white px-3 py-1.5 rounded-lg"
              >
                <LogIn className="w-3.5 h-3.5" />
                Sign In
              </Link>
            )}
          </div>
          <Link
            href="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block text-base font-semibold text-gray-700 dark:text-gray-200 hover:text-blue-600 py-1 border-b border-gray-100 dark:border-gray-900 pb-2"
          >
            Home
          </Link>
          <div className="space-y-4">
            {categorizedTools.map((cat) => (
              <div key={cat.categoryName} className="space-y-2">
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-1">
                  {cat.categoryName}
                </div>
                <div className="space-y-1">
                  {cat.items.map((tool) => {
                    const Icon = tool.icon;
                    return (
                      <Link
                        key={tool.name}
                        href={tool.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-3 rounded-lg p-2 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                      >
                        <Icon className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                        <div className="min-w-0">
                          <div className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">
                            {tool.name}
                          </div>
                        </div>
                      </Link>
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
