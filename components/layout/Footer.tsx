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
    <footer className="relative bg-white dark:bg-gray-950 text-gray-500 dark:text-gray-400">
      {/* Subtle top border with gradient */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />

      <div className="max-w-7xl mx-auto px-4 pt-14 pb-12 sm:px-6 lg:px-8">

        {/* Desktop Grid & Mobile Accordion */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-8 border-b border-gray-200 dark:border-gray-800">

          {/* Column 1 - Brand */}
          <div className="space-y-4 pr-4">
            <div className="flex items-center gap-2">
              <Briefcase className="w-5.5 h-5.5 text-blue-600 dark:text-blue-400" />
              <span className="font-extrabold text-gray-900 dark:text-gray-100 text-lg tracking-tight">
                Freelance Ops
              </span>
            </div>
            <p className="text-xs sm:text-sm leading-relaxed text-gray-500 dark:text-gray-400">
              Free tools for freelancers to manage clients, contracts, and cash flow.
            </p>
          </div>

          {/* Column 2 - Product */}
          <div className="border-t border-gray-100 dark:border-gray-900/50 pt-5 md:pt-0 md:border-t-0">
            {/* Desktop Heading */}
            <h3 className="hidden md:block font-bold text-gray-900 dark:text-gray-100 uppercase tracking-widest text-xs mb-4">
              Product
            </h3>
            {/* Mobile Header (Accordion Trigger) */}
            <button
              onClick={() => toggleSection("product")}
              className="flex md:hidden items-center justify-between w-full font-bold text-gray-900 dark:text-gray-100 uppercase tracking-widest text-xs py-2"
            >
              <span>Product</span>
              {expandedSections.product ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {/* Links List */}
            <ul className={`mt-3 md:mt-0 space-y-2.5 text-sm ${expandedSections.product ? "block" : "hidden md:block"}`}>
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
          <div className="border-t border-gray-100 dark:border-gray-900/50 pt-5 md:pt-0 md:border-t-0">
            {/* Desktop Heading */}
            <h3 className="hidden md:block font-bold text-gray-900 dark:text-gray-100 uppercase tracking-widest text-xs mb-4">
              Resources
            </h3>
            {/* Mobile Header (Accordion Trigger) */}
            <button
              onClick={() => toggleSection("resources")}
              className="flex md:hidden items-center justify-between w-full font-bold text-gray-900 dark:text-gray-100 uppercase tracking-widest text-xs py-2"
            >
              <span>Resources</span>
              {expandedSections.resources ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {/* Links List */}
            <ul className={`mt-3 md:mt-0 space-y-2.5 text-sm ${expandedSections.resources ? "block" : "hidden md:block"}`}>
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
          <div className="border-t border-gray-100 dark:border-gray-900/50 pt-5 md:pt-0 md:border-t-0">
            {/* Desktop Heading */}
            <h3 className="hidden md:block font-bold text-gray-900 dark:text-gray-100 uppercase tracking-widest text-xs mb-4">
              Company
            </h3>
            {/* Mobile Header (Accordion Trigger) */}
            <button
              onClick={() => toggleSection("company")}
              className="flex md:hidden items-center justify-between w-full font-bold text-gray-900 dark:text-gray-100 uppercase tracking-widest text-xs py-2"
            >
              <span>Company</span>
              {expandedSections.company ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {/* Links List */}
            <ul className={`mt-3 md:mt-0 space-y-2.5 text-sm ${expandedSections.company ? "block" : "hidden md:block"}`}>
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
