"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Clock, X } from "lucide-react";
import { ToolItem } from "@/lib/tools-registry";

interface FeaturedToolsRowProps {
  title: string;
  tools: ToolItem[];
  isRecentState: boolean;
  timestamps?: Record<string, number>;
  onRemoveRecent?: (slug: string) => void;
}

// Function to calculate friendly relative time strings (e.g., "5 minutes ago", "2 hours ago")
function getRelativeTime(timestamp: number): string {
  const diffMs = Date.now() - timestamp;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) {
    return "just now";
  } else if (diffMin < 60) {
    return `${diffMin}m ago`;
  } else if (diffHour < 24) {
    return `${diffHour}h ago`;
  } else if (diffDay === 1) {
    return "yesterday";
  } else {
    return `${diffDay}d ago`;
  }
}

export default function FeaturedToolsRow({
  title,
  tools,
  isRecentState,
  timestamps = {},
  onRemoveRecent,
}: FeaturedToolsRowProps) {
  if (tools.length === 0) return null;

  return (
    <section className="py-10 bg-slate-50/50 dark:bg-[#07080d]/60 border-b border-slate-200/50 dark:border-slate-900/60 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Row Header */}
        <div className="flex items-center justify-between mb-6 pb-2 border-b border-slate-200/30 dark:border-slate-800/40">
          <div className="flex items-center gap-2">
            {isRecentState && (
              <span className="flex h-2 w-2 rounded-full bg-blue-600 dark:bg-blue-500 animate-pulse" />
            )}
            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              {title}
            </h2>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
            {isRecentState ? "Your Activity" : "Curated Selection"}
          </span>
        </div>

        {/* Featured Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => {
            const Icon = tool.icon;
            const visitedTime = timestamps[tool.slug];

            return (
              <div
                key={tool.slug}
                className="group relative rounded-xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#0c0d12] p-5 shadow-sm hover:shadow-md hover:border-blue-500/40 dark:hover:border-blue-500/40 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Category and Visited Timestamp Indicator with Delete Button spacer */}
                  <div className="flex items-center justify-between gap-2 mb-4 pr-6">
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200/40 dark:border-slate-700/40">
                      {tool.category}
                    </span>
                    {isRecentState && visitedTime && (
                      <span className="flex items-center gap-1 text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                        <Clock className="w-3 h-3 text-blue-500" />
                        {getRelativeTime(visitedTime)}
                      </span>
                    )}
                  </div>

                  {/* Optional Dismiss/Remove recent item button */}
                  {isRecentState && onRemoveRecent && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onRemoveRecent(tool.slug);
                      }}
                      className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 opacity-70 md:opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all cursor-pointer z-10"
                      aria-label={`Remove ${tool.title} from recent history`}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}

                  {/* Icon & Title */}
                  <div className="flex items-start gap-3.5">
                    <div className="p-2.5 rounded-lg bg-blue-600 text-white flex-shrink-0 shadow-md shadow-blue-500/10 group-hover:scale-105 transition-transform duration-200">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                        {tool.title}
                      </h4>
                      <p className="text-slate-600 dark:text-slate-400 mt-1.5 text-xs sm:text-sm line-clamp-2 leading-relaxed">
                        {tool.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Open/Launch footer link */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/50 flex justify-end">
                  <Link
                    href={tool.href}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors"
                  >
                    Launch Utility
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
