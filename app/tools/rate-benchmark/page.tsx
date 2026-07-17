"use client";

import React, { useState, useMemo } from "react";
import { Info, HelpCircle, Briefcase, GraduationCap, Globe2, AlertCircle } from "lucide-react";
import {
  SKILL_CATEGORIES,
  EXPERIENCE_LEVELS,
  REGIONS,
  getRateRange,
  getAbsoluteRangeForSkill,
  EXPERIENCE_LEVEL_LABELS,
  SkillCategory,
  ExperienceLevel,
  Region,
} from "@/lib/rate-benchmark-data";

export default function RateBenchmarkPage() {
  const [skill, setSkill] = useState<SkillCategory>("Web Development");
  const [experience, setExperience] = useState<ExperienceLevel>("intermediate");
  const [region, setRegion] = useState<Region>("North America");

  const range = useMemo(() => {
    return getRateRange(skill, experience, region);
  }, [skill, experience, region]);

  const absoluteRange = useMemo(() => {
    return getAbsoluteRangeForSkill(skill);
  }, [skill]);

  // Option A relative bar calculation:
  // Position of selected min and max as percentages of the absolute skill category range.
  const barPositions = useMemo(() => {
    const totalDiff = absoluteRange.max - absoluteRange.min;
    if (totalDiff <= 0) return { left: 0, width: 100 };

    const leftPercent = ((range.min - absoluteRange.min) / totalDiff) * 100;
    const rightPercent = ((range.max - absoluteRange.min) / totalDiff) * 100;

    return {
      left: Math.max(0, Math.min(100, leftPercent)),
      width: Math.max(5, Math.min(100, rightPercent - leftPercent)),
    };
  }, [range, absoluteRange]);

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen py-12 transition-colors duration-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">

        {/* Breadcrumb / Title */}
        <div className="mb-8">
          <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2">
            Reference Tool
          </p>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Freelance Rate Benchmark Tool
          </h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Compare regional and skill-based freelance market rate ranges to confidently price your services.
          </p>
        </div>

        {/* Permanent Note */}
        <div className="mb-8 p-4 rounded-xl border border-amber-200/60 dark:border-amber-900/30 bg-amber-50/50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-300 flex gap-3 items-start">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p className="text-xs sm:text-sm leading-relaxed">
            <strong>Notice:</strong> These figures are general estimates for guidance purposes, last reviewed <span className="font-semibold underline">July 2026</span>, and are not a substitute for your own market research.
          </p>
        </div>

        {/* Main Interface Card */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">

          {/* Inputs Section */}
          <div className="md:col-span-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-3 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-blue-500" />
              Configure Criteria
            </h2>

            {/* Skill / Role Select */}
            <div className="space-y-2">
              <label htmlFor="skill-select" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Freelance Category / Role
              </label>
              <div className="relative">
                <select
                  id="skill-select"
                  value={skill}
                  onChange={(e) => setSkill(e.target.value as SkillCategory)}
                  className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 py-3 px-4 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none transition-all cursor-pointer"
                >
                  {SKILL_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Experience Level Select */}
            <div className="space-y-2">
              <label htmlFor="experience-select" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-gray-400" />
                Experience Level
              </label>
              <div className="relative">
                <select
                  id="experience-select"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value as ExperienceLevel)}
                  className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 py-3 px-4 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none transition-all cursor-pointer"
                >
                  {EXPERIENCE_LEVELS.map((exp) => (
                    <option key={exp} value={exp}>
                      {EXPERIENCE_LEVEL_LABELS[exp]}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Region Select */}
            <div className="space-y-2">
              <label htmlFor="region-select" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                <Globe2 className="w-4 h-4 text-gray-400" />
                Region
              </label>
              <div className="relative">
                <select
                  id="region-select"
                  value={region}
                  onChange={(e) => setRegion(e.target.value as Region)}
                  className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 py-3 px-4 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none transition-all cursor-pointer"
                >
                  {REGIONS.map((reg) => (
                    <option key={reg} value={reg}>
                      {reg}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>

          </div>

          {/* Output / Visualization Section */}
          <div className="md:col-span-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm flex flex-col justify-between self-stretch">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-3 flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-500" />
                Benchmark Results
              </h2>

              {/* Huge rate display */}
              <div className="py-8 text-center bg-gray-50 dark:bg-gray-950 rounded-xl my-6 border border-gray-100 dark:border-gray-800/60">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">
                  Suggested Hourly Rate
                </p>
                <p className="text-4xl sm:text-5xl font-extrabold text-blue-600 dark:text-blue-400 tracking-tight">
                  ${range.min}–${range.max} <span className="text-lg font-medium text-gray-500">/hr</span>
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  Standardized to USD equivalents
                </p>
              </div>

              {/* Context Note */}
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed italic mb-8">
                &ldquo;Rates vary based on niche specialization, portfolio strength, and client type. High-demand niches and enterprise clients routinely support rates well above the median benchmarks.&rdquo;
              </p>

              {/* Range Visualization Section (Option A) */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs font-bold text-gray-400 uppercase tracking-wider">
                  <span>Relative Position</span>
                  <span>Skill Category Bounds</span>
                </div>

                {/* Horizontal Bar */}
                <div className="relative w-full h-4 bg-gray-100 dark:bg-gray-800 rounded-full overflow-visible">
                  {/* Highlighted portion representing the selected criteria */}
                  <div
                    style={{
                      left: `${barPositions.left}%`,
                      width: `${barPositions.width}%`,
                    }}
                    className="absolute h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center shadow-inner"
                  />
                </div>

                {/* Min/Max indicators underneath */}
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 font-semibold pt-1">
                  <div className="flex flex-col">
                    <span>${absoluteRange.min}/hr</span>
                    <span className="text-[10px] text-gray-400 font-medium">Category Low</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-blue-600 dark:text-blue-400 font-bold">${range.min}–${range.max}</span>
                    <span className="text-[10px] text-gray-400 font-medium">Selected Level</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span>${absoluteRange.max}/hr</span>
                    <span className="text-[10px] text-gray-400 font-medium">Category High</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom FAQ / Tip Box */}
            <div className="mt-8 pt-4 border-t border-gray-100 dark:border-gray-800 flex gap-2.5 items-start">
              <HelpCircle className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                Want to convert hourly rate expectations into a full project pricing strategy? Try our <a href="/tools/rate-calculator" className="text-blue-500 hover:underline font-semibold">Rate Calculator</a> to calculate dynamic billable rates!
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
