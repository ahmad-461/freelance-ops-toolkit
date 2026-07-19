import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export interface SeoSection {
  title: string;
  prose: string;
}

export interface InternalLink {
  label: string;
  href: string;
}

interface ToolSeoContentProps {
  h2Title: string;
  intro: string;
  sections: SeoSection[];
  internalLinks: InternalLink[];
}

export default function ToolSeoContent({
  h2Title,
  intro,
  sections,
  internalLinks,
}: ToolSeoContentProps) {
  return (
    <section className="mt-16 border-t border-slate-200/60 dark:border-slate-800/60 pt-16">
      <div className="max-w-4xl mx-auto space-y-10 text-left">
        {/* H2 Heading & Intro */}
        <div className="space-y-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            {h2Title}
          </h2>
          <p className="text-slate-600 dark:text-slate-350 text-sm sm:text-base leading-relaxed">
            {intro}
          </p>
        </div>

        {/* Vertical Stack of H3 Sections */}
        <div className="space-y-8">
          {sections.map((section, index) => (
            <div key={index} className="space-y-2.5">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                {section.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-350 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                {section.prose}
              </p>
            </div>
          ))}
        </div>

        {/* Internal Linking Footer */}
        {internalLinks.length > 0 && (
          <div className="p-5 sm:p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-[#0c0d12] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block">
                Explore More Operational Utilities
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Unlock further capabilities of the Freelance Ops Toolkit to automate more of your workflow.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              {internalLinks.map((link, idx) => (
                <Link
                  key={idx}
                  href={link.href}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-850 border border-slate-200 dark:border-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 transition-all shadow-sm"
                >
                  {link.label}
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
