"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronUp } from "lucide-react";
import Logo from "@/components/shared/Logo";

interface FooterLink {
  label: string;
  href: string;
}

interface FooterColumn {
  title: string;
  key: "product" | "resources" | "company";
  links: FooterLink[];
}

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

  const footerColumns: FooterColumn[] = [
    {
      title: "Product",
      key: "product",
      links: [
        { label: "Invoice Generator", href: "/tools/invoice-generator" },
        { label: "Proposal Generator", href: "/tools/proposal-generator" },
        { label: "Time Tracker", href: "/tools/time-tracker" },
        { label: "Rate Benchmark Tool", href: "/tools/rate-benchmark" },
        { label: "View All Tools", href: "/#tools-section" },
      ],
    },
    {
      title: "Resources",
      key: "resources",
      links: [
        { label: "Frequently Asked Questions", href: "/about#faq" },
        { label: "Disclaimers & Notices", href: "/disclaimers" },
      ],
    },
    {
      title: "Company",
      key: "company",
      links: [
        { label: "About", href: "/about" },
        { label: "Contact", href: "/contact" },
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Terms of Service", href: "/terms" },
      ],
    },
  ];

  return (
    <footer className="relative bg-[#090a0f] text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 pt-14 pb-12 sm:px-6 lg:px-8">

        {/* Desktop Grid & Mobile Accordion */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-8 border-b border-slate-800">

          {/* Column 1 - Brand */}
          <div className="space-y-4 pr-4">
            <div className="flex items-center gap-2">
              <Logo size={28} className="text-white" />
              <span className="font-extrabold text-white text-lg tracking-tight">
                Freelance Ops
              </span>
            </div>
            <p className="text-xs sm:text-sm leading-relaxed text-slate-400">
              Free tools for freelancers to manage clients, contracts, and cash flow.
            </p>
          </div>

          {/* Columns 2, 3, 4 - Dynamic mapping */}
          {footerColumns.map((col) => {
            const isExpanded = expandedSections[col.key];
            return (
              <div
                key={col.key}
                className="border-t border-slate-800 pt-5 md:pt-0 md:border-t-0"
              >
                {/* Desktop Heading */}
                <h3 className="hidden md:block font-bold text-white uppercase tracking-widest text-xs mb-4">
                  {col.title}
                </h3>
                {/* Mobile Header (Accordion Trigger) */}
                <button
                  onClick={() => toggleSection(col.key)}
                  className="flex md:hidden items-center justify-between w-full font-bold text-white uppercase tracking-widest text-xs py-2"
                >
                  <span>{col.title}</span>
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </button>

                {/* Links List */}
                <ul
                  className={`mt-3 md:mt-0 space-y-2.5 text-sm ${
                    isExpanded ? "block" : "hidden md:block"
                  }`}
                >
                  {col.links.map((link) => {
                    const isViewAll = link.label === "View All Tools";
                    return (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className={`hover:text-white transition-colors duration-150 block py-1 ${
                            isViewAll
                              ? "font-medium text-white"
                              : "text-slate-400 hover:text-white"
                          }`}
                        >
                          {link.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}

        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 text-xs text-slate-400">

          <div className="text-center sm:text-left space-y-1">
            <p>&copy; {currentYear} Freelance Ops Toolkit. All rights reserved.</p>
            <p>
              Built by <span className="font-semibold text-white">Ahmad Khan</span>
            </p>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy
            </Link>
            <span>|</span>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms
            </Link>
          </div>

        </div>

      </div>
    </footer>
  );
}
