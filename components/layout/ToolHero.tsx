"use client";

import React from "react";
import { ArrowDown } from "lucide-react";

interface ToolHeroProps {
  title: string;
  description: string;
  actionLabel?: string;
  visual: React.ReactNode;
}

export function ToolHero({
  title,
  description,
  actionLabel = "Get Started",
  visual,
}: ToolHeroProps) {
  const handleScroll = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const element = document.getElementById("tool-form");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section className="relative overflow-hidden border-b border-slate-200/60 dark:border-slate-800/50 bg-white dark:bg-[#090a0f]/80 py-8 md:py-12 mb-8 sm:mb-10 transition-colors duration-200">
      {/* Subtle background lines matching homepage */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Title, Description, CTA */}
          <div className="lg:col-span-7 space-y-4 md:space-y-5 text-left">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 dark:bg-blue-400/10 border border-blue-200/40 dark:border-blue-500/30 px-3 py-1 text-[11px] font-semibold tracking-wider uppercase text-blue-600 dark:text-blue-400">
              <span className="flex h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse" />
              Utility Page
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-[2.5rem] font-black leading-[1.15] tracking-tight text-slate-900 dark:text-white">
              {title}
            </h1>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl">
              {description}
            </p>

            <div className="pt-2">
              <button
                onClick={handleScroll}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-3 text-sm shadow-md transition-all hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-[#090a0f]"
              >
                {actionLabel}
                <ArrowDown className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Column: Unique Visual Detail Container */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="w-full max-w-[380px] aspect-[16/10] rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-[#0d0e15] shadow-sm overflow-hidden flex items-center justify-center p-6 relative transition-all duration-300">
              {/* Subtle visual grid inside the slot box */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808003_1px,transparent_1px),linear-gradient(to_bottom,#80808003_1px,transparent_1px)] bg-[size:10px_10px] pointer-events-none" />

              <div className="relative z-10 w-full h-full flex items-center justify-center">
                {visual}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
