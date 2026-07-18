"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Briefcase, ChevronDown, ChevronUp } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  // Mobile Accordion State: all collapsed by default
  const [expandedSections, setExpandedSections] = useState({
    product: false,
    resources: false,
    company: false,
  });

  const toggleSection = (section: "product" | "resources" | "company") => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-gray-500 dark:text-gray-400">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">

        {/* Desktop Grid & Mobile Accordion */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-gray-200 dark:border-gray-800">

          {/* Column 1 - Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="font-bold text-gray-900 dark:text-gray-100 text-lg">
                Freelance Ops
              </span>
            </div>
            <p className="text-xs sm:text-sm leading-relaxed text-gray-500 dark:text-gray-400">
              Free tools for freelancers to manage clients, contracts, and cash flow.
            </p>

            {/* Social Icons - GitHub only for now. Placeholders for LinkedIn and X commented out below */}
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/ahmad-461/freelance-ops-toolkit"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub Repository"
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                  <path d="M9 18c-4.51 2-5-2-7-2" />
                </svg>
              </a>
              {/* Commented-out placeholders for LinkedIn and X
              <a
                href="https://linkedin.com/in/YOUR_PROFILE"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <svg ... />
              </a>
              <a
                href="https://x.com/YOUR_HANDLE"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X (formerly Twitter)"
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <svg ... />
              </a>
              */}
            </div>
          </div>

          {/* Column 2 - Product */}
          <div className="border-t border-gray-100 dark:border-gray-900/50 pt-4 md:pt-0 md:border-t-0">
            {/* Desktop Heading */}
            <h3 className="hidden md:block font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider text-xs mb-4">
              Product
            </h3>
            {/* Mobile Header (Accordion Trigger) */}
            <button
              onClick={() => toggleSection("product")}
              className="flex md:hidden items-center justify-between w-full font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider text-xs py-2"
            >
              <span>Product</span>
              {expandedSections.product ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {/* Links List */}
            <ul className={`mt-2 md:mt-0 space-y-2 text-sm ${expandedSections.product ? "block" : "hidden md:block"}`}>
              <li>
                <Link
                  href="/tools/invoice-generator"
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-150 block py-1"
                >
                  Invoice Generator
                </Link>
              </li>
              <li>
                <Link
                  href="/tools/proposal-generator"
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-150 block py-1"
                >
                  Proposal Generator
                </Link>
              </li>
              <li>
                <Link
                  href="/tools/time-tracker"
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-150 block py-1"
                >
                  Time Tracker
                </Link>
              </li>
              <li>
                <Link
                  href="/tools/rate-benchmark"
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-150 block py-1"
                >
                  Rate Benchmark Tool
                </Link>
              </li>
              <li>
                <Link
                  href="/#tools-section"
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-150 block py-1 font-medium text-gray-700 dark:text-gray-300"
                >
                  View All Tools
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3 - Resources */}
          <div className="border-t border-gray-100 dark:border-gray-900/50 pt-4 md:pt-0 md:border-t-0">
            {/* Desktop Heading */}
            <h3 className="hidden md:block font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider text-xs mb-4">
              Resources
            </h3>
            {/* Mobile Header (Accordion Trigger) */}
            <button
              onClick={() => toggleSection("resources")}
              className="flex md:hidden items-center justify-between w-full font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider text-xs py-2"
            >
              <span>Resources</span>
              {expandedSections.resources ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {/* Links List */}
            <ul className={`mt-2 md:mt-0 space-y-2 text-sm ${expandedSections.resources ? "block" : "hidden md:block"}`}>
              <li>
                <Link
                  href="/about#faq"
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-150 block py-1"
                >
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link
                  href="/disclaimers"
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-150 block py-1"
                >
                  Disclaimers & Notices
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4 - Company */}
          <div className="border-t border-gray-100 dark:border-gray-900/50 pt-4 md:pt-0 md:border-t-0">
            {/* Desktop Heading */}
            <h3 className="hidden md:block font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider text-xs mb-4">
              Company
            </h3>
            {/* Mobile Header (Accordion Trigger) */}
            <button
              onClick={() => toggleSection("company")}
              className="flex md:hidden items-center justify-between w-full font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider text-xs py-2"
            >
              <span>Company</span>
              {expandedSections.company ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {/* Links List */}
            <ul className={`mt-2 md:mt-0 space-y-2 text-sm ${expandedSections.company ? "block" : "hidden md:block"}`}>
              <li>
                <Link
                  href="/about"
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-150 block py-1"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-150 block py-1"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-150 block py-1"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-150 block py-1"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 text-xs text-gray-400 dark:text-gray-500">

          <div className="text-center sm:text-left space-y-1">
            <p>&copy; {currentYear} Freelance Ops Toolkit. All rights reserved.</p>
            <p>
              Built by <span className="font-semibold text-gray-700 dark:text-gray-300">Ahmad Khan</span>
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Privacy
            </Link>
            <span>|</span>
            <Link href="/terms" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Terms
            </Link>
            {/* Omit Sitemap gracefully as no sitemap.xml exists yet */}
          </div>

        </div>

      </div>
    </footer>
  );
}
