"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import { ChevronDown, Briefcase, FileText, Menu, X, Calculator, RefreshCw, CalendarClock } from "lucide-react";

export default function Navbar() {
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const tools = [
    {
      name: "Invoice Generator",
      description: "Create professional business invoices",
      href: "/tools/invoice-generator",
      icon: FileText,
      active: true,
    },
    {
      name: "Rate Calculator",
      description: "Determine your ideal hourly rate & project pricing",
      href: "/tools/rate-calculator",
      icon: Calculator,
      active: true,
    },
    {
      name: "Currency Converter",
      description: "Convert international currencies with live rates",
      href: "/tools/currency-converter",
      icon: RefreshCw,
      active: true,
    },
    {
      name: "Late Payment Fee Calculator",
      description: "Calculate overdue invoices and late interest fees",
      href: "/tools/late-payment-fee-calculator",
      icon: CalendarClock,
      active: true,
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">

          {/* Logo & Brand */}
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-xl hover:opacity-90 transition-opacity">
              <Briefcase className="w-6 h-6" />
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                Freelance Ops
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Home
            </Link>

            {/* Tools Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsToolsOpen(!isToolsOpen)}
                className="flex items-center gap-1 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors focus:outline-none"
              >
                Tools
                <ChevronDown className={`w-4 h-4 transition-transform ${isToolsOpen ? "rotate-180" : ""}`} />
              </button>

              {isToolsOpen && (
                <div className="absolute right-0 mt-2 w-80 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-2 shadow-lg ring-1 ring-black/5 focus:outline-none">
                  <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Available Tools
                  </div>
                  <div className="space-y-1">
                    {tools.map((tool) => {
                      const Icon = tool.icon;
                      if (tool.active) {
                        return (
                          <Link
                            key={tool.name}
                            href={tool.href}
                            onClick={() => setIsToolsOpen(false)}
                            className="flex items-start gap-3 rounded-lg p-3 hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors"
                          >
                            <div className="p-1.5 rounded-md bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">
                              <Icon className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{tool.name}</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">{tool.description}</div>
                            </div>
                          </Link>
                        );
                      } else {
                        return (
                          <div
                            key={tool.name}
                            className="flex items-start gap-3 rounded-lg p-3 opacity-60 cursor-not-allowed"
                          >
                            <div className="p-1.5 rounded-md bg-gray-50 dark:bg-gray-800 text-gray-400">
                              <Icon className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-500 dark:text-gray-400">{tool.name}</div>
                              <div className="text-xs text-gray-400 dark:text-gray-500">{tool.description}</div>
                            </div>
                          </div>
                        );
                      }
                    })}
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Right Action Items */}
          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-4 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-850"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-4 py-3 space-y-3">
          <Link
            href="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block text-base font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 py-1"
          >
            Home
          </Link>
          <div className="space-y-2">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-1">
              Tools
            </div>
            {tools.map((tool) => {
              const Icon = tool.icon;
              if (tool.active) {
                return (
                  <Link
                    key={tool.name}
                    href={tool.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 rounded-lg p-2 hover:bg-gray-50 dark:hover:bg-gray-900"
                  >
                    <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <div>
                      <div className="text-sm font-medium text-gray-800 dark:text-gray-100">{tool.name}</div>
                    </div>
                  </Link>
                );
              } else {
                return (
                  <div
                    key={tool.name}
                    className="flex items-center gap-3 rounded-lg p-2 opacity-50 cursor-not-allowed"
                  >
                    <Icon className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="text-sm font-medium text-gray-500 dark:text-gray-400">{tool.name} (Soon)</div>
                    </div>
                  </div>
                );
              }
            })}
          </div>
        </div>
      )}
    </header>
  );
}
