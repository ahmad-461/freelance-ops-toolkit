"use client";

import React, { useState } from "react";
import { ToolHero } from "@/components/layout/ToolHero";
import { RateCalculatorVisual } from "@/components/layout/ToolHeroVisuals";
import { Calculator, DollarSign, Clock, Calendar, HelpCircle, Sparkles } from "lucide-react";
import ToolSeoContent from "@/components/layout/ToolSeoContent";

export default function RateCalculator() {
  // Rate Inputs
  const [desiredIncome, setDesiredIncome] = useState<string>("80000");
  const [billableHours, setBillableHours] = useState<string>("25");
  const [workingWeeks, setWorkingWeeks] = useState<string>("48");
  const [expenses, setExpenses] = useState<string>("10000");

  // Project Inputs
  const [projectHours, setProjectHours] = useState<string>("40");

  // Numeric parsing helper
  const numDesiredIncome = parseFloat(desiredIncome) || 0;
  const numBillableHours = parseFloat(billableHours) || 0;
  const numWorkingWeeks = parseFloat(workingWeeks) || 0;
  const numExpenses = parseFloat(expenses) || 0;
  const numProjectHours = parseFloat(projectHours) || 0;

  // Touch tracking state (simple validation check)
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  // Math logical checks
  const isZeroOrNegativeWeeksOrHours = numBillableHours <= 0 || numWorkingWeeks <= 0;

  // Suggested hourly rate calculations
  let suggestedHourlyRate = 0;
  if (!isZeroOrNegativeWeeksOrHours) {
    suggestedHourlyRate = (numDesiredIncome + numExpenses) / (numBillableHours * numWorkingWeeks);
  }

  // Estimated Project Price
  const estimatedProjectPrice = suggestedHourlyRate * numProjectHours;

  const getInputFieldClass = (value: string, fieldName: string) => {
    const val = parseFloat(value) || 0;
    const isError = (fieldName === "billableHours" || fieldName === "workingWeeks") && val <= 0 && touched[fieldName];
    return `w-full rounded-xl border ${
      isError
        ? "border-red-300 dark:border-red-800 bg-red-50/50 dark:bg-red-950/20 focus:ring-red-500 focus:border-red-500"
        : "border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-900 focus:ring-blue-500 focus:border-blue-500"
    } py-2.5 pl-9 pr-4 text-sm shadow-sm transition-all focus:outline-none focus:ring-2 text-gray-900 dark:text-gray-100`;
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen pb-16 transition-colors duration-200">
      <ToolHero
        title="Rate Calculator"
        description="Determine your ideal suggested freelance hourly rate and project-based pricing target based on desired annual goals, Schedule overheads, and predictable expenses."
        actionLabel="Calculate Rate ↓"
        visual={<RateCalculatorVisual />}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Layout Grid */}
        <div id="tool-form" className="scroll-mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Inputs Section (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-800/80 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-6 pb-3 border-b border-gray-100 dark:border-gray-800">
                <DollarSign className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Financial &amp; Schedule Assumptions</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Desired Annual Income */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                    Desired Annual Income ($)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-semibold pointer-events-none">$</span>
                    <input
                      type="number"
                      min="0"
                      value={desiredIncome}
                      onChange={(e) => setDesiredIncome(e.target.value)}
                      onBlur={() => handleBlur("desiredIncome")}
                      placeholder="e.g. 80000"
                      className={getInputFieldClass(desiredIncome, "desiredIncome")}
                    />
                  </div>
                  {parseFloat(desiredIncome) < 0 && (
                    <p className="mt-1 text-xs text-red-600 dark:text-red-400 font-medium">Income cannot be negative.</p>
                  )}
                </div>

                {/* Estimated Annual Business Expenses */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                    Estimated Annual Expenses ($)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-semibold pointer-events-none">$</span>
                    <input
                      type="number"
                      min="0"
                      value={expenses}
                      onChange={(e) => setExpenses(e.target.value)}
                      onBlur={() => handleBlur("expenses")}
                      placeholder="e.g. 10000"
                      className={getInputFieldClass(expenses, "expenses")}
                    />
                  </div>
                  {parseFloat(expenses) < 0 && (
                    <p className="mt-1 text-xs text-red-600 dark:text-red-400 font-medium">Expenses cannot be negative.</p>
                  )}
                </div>

                {/* Billable Hours Per Week */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                    Billable Hours Per Week
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-semibold pointer-events-none">
                      <Clock className="w-4 h-4" />
                    </span>
                    <input
                      type="number"
                      min="0"
                      value={billableHours}
                      onChange={(e) => setBillableHours(e.target.value)}
                      onBlur={() => handleBlur("billableHours")}
                      placeholder="e.g. 25"
                      className={getInputFieldClass(billableHours, "billableHours")}
                    />
                  </div>
                  {parseFloat(billableHours) < 0 && (
                    <p className="mt-1 text-xs text-red-600 dark:text-red-400 font-medium">Hours cannot be negative.</p>
                  )}
                  {parseFloat(billableHours) === 0 && touched["billableHours"] && (
                    <p className="mt-1 text-xs text-amber-600 dark:text-amber-400 font-medium">Hours should be greater than 0.</p>
                  )}
                </div>

                {/* Working Weeks Per Year */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                    Working Weeks Per Year
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-semibold pointer-events-none">
                      <Calendar className="w-4 h-4" />
                    </span>
                    <input
                      type="number"
                      min="0"
                      max="52"
                      value={workingWeeks}
                      onChange={(e) => setWorkingWeeks(e.target.value)}
                      onBlur={() => handleBlur("workingWeeks")}
                      placeholder="e.g. 48"
                      className={getInputFieldClass(workingWeeks, "workingWeeks")}
                    />
                  </div>
                  {parseFloat(workingWeeks) < 0 && (
                    <p className="mt-1 text-xs text-red-600 dark:text-red-400 font-medium">Weeks cannot be negative.</p>
                  )}
                  {parseFloat(workingWeeks) > 52 && (
                    <p className="mt-1 text-xs text-amber-600 dark:text-amber-400 font-medium">Maximum weeks per year is 52.</p>
                  )}
                  {parseFloat(workingWeeks) === 0 && touched["workingWeeks"] && (
                    <p className="mt-1 text-xs text-amber-600 dark:text-amber-400 font-medium">Weeks should be greater than 0.</p>
                  )}
                </div>

              </div>
            </div>

            {/* Project Conversion Block */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-800/80 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100 dark:border-gray-800">
                <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Project-Based Pricing Estimator</h2>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                Calculate a custom project quote using your suggested hourly rate.
              </p>

              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                  Estimated Hours for a Project
                </label>
                <div className="relative max-w-md">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-semibold pointer-events-none">
                    <Clock className="w-4 h-4" />
                  </span>
                  <input
                    type="number"
                    min="0"
                    value={projectHours}
                    onChange={(e) => setProjectHours(e.target.value)}
                    placeholder="e.g. 40"
                    className="w-full rounded-xl border border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-900 py-2.5 pl-9 pr-4 text-sm shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100"
                  />
                </div>
                {parseFloat(projectHours) < 0 && (
                  <p className="mt-1 text-xs text-red-600 dark:text-red-400 font-medium">Hours cannot be negative.</p>
                )}
              </div>
            </div>
          </div>

          {/* Results Sidebar (5 Cols) */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <Calculator className="w-5 h-5 text-blue-100" />
                Live Rate Output
              </h3>

              {isZeroOrNegativeWeeksOrHours ? (
                <div className="p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10">
                  <p className="text-sm font-semibold leading-relaxed">
                    Please enter billable hours greater than 0 and working weeks greater than 0 to calculate your suggested hourly rate
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Suggested Hourly Rate */}
                  <div>
                    <span className="text-xs font-semibold text-blue-100 uppercase tracking-wider block mb-1">
                      Suggested Hourly Rate
                    </span>
                    <div className="text-4xl sm:text-5xl font-extrabold flex items-baseline">
                      <span className="text-2xl sm:text-3xl font-bold opacity-90 mr-1">$</span>
                      {suggestedHourlyRate.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      <span className="text-sm font-medium opacity-80 ml-2">/ hr</span>
                    </div>
                  </div>

                  {/* Pricing Estimator Result */}
                  {numProjectHours > 0 && (
                    <div className="pt-6 border-t border-white/20">
                      <span className="text-xs font-semibold text-blue-100 uppercase tracking-wider block mb-1">
                        Project Price Estimate ({numProjectHours} hours)
                      </span>
                      <div className="text-3xl sm:text-4xl font-extrabold flex items-baseline">
                        <span className="text-xl sm:text-2xl font-bold opacity-90 mr-1">$</span>
                        {estimatedProjectPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Calculations Explanation Card */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-800/80 p-6 shadow-sm">
              <h4 className="font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-3">
                <HelpCircle className="w-5 h-5 text-blue-500" />
                How is this calculated?
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-3">
                Your suggested hourly rate is calculated using the formula:
              </p>
              <div className="bg-gray-50 dark:bg-gray-950 p-3 rounded-lg border border-gray-100 dark:border-gray-850 font-mono text-[11px] text-gray-600 dark:text-gray-400 leading-normal">
                (Desired Income + Expenses) <br />
                -------------------------- <br />
                (Hours/Week * Weeks/Year)
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mt-3">
                This ensures that your working weeks and billable hours account for non-billable operations, vacations, and annual expenses.
              </p>
            </div>
          </div>

        </div>

        <ToolSeoContent
          h2Title="Calculate Your Income Safely with a Freelance Hourly Rate Calculator"
          intro="Accurately estimating your value is one of the most critical challenges of running a successful freelance business. Our free freelance hourly rate calculator allows you to model your target income, factor in realistic business overhead expenses, and account for necessary non-billable hours. By standardizing your assumptions, you can establish an hourly rate that comfortably secures your personal and business financial health."
          sections={[
            {
              title: "How to Calculate Freelance Rates by Desired Income",
              prose: "To determine your baseline hourly rate, start with your desired annual income. To this target, add your expected annual business expenses (including software subscriptions, professional services, hardware amortization, and health insurance). Next, calculate your true annual billable weeks—subtracting vacation, national holidays, and sick leave. Finally, estimate your realistic billable hours per week, acknowledging that administrative overhead, prospecting, and operations typically consume 30% to 50% of your workweek. Divide your gross financial target by these total billable hours to uncover your suggested hourly rate."
            },
            {
              title: "Factoring in Taxes and Overhead Costs",
              prose: "A common mistake among new freelancers is pricing services based on former corporate salaries without considering self-employment taxes and overhead. As an independent contractor, you are fully responsible for the employer share of social security, Medicare, and regional business taxes. Incorporating a healthy safety buffer into your expenses ensures you don't face unexpected year-end tax liabilities, keeping your operations fully sustainable."
            },
            {
              title: "Shifting from Hourly to Value-Based Project Pricing",
              prose: "While establishing an hourly baseline is important, many advanced freelancers scale their earnings by adopting value-based project pricing. This approach bases quotes on the overall value of deliverables to the client's business rather than physical hours logged. Use our rate estimator to benchmark project-based pricing targets, ensuring your work remains highly profitable and aligned with your broader lifestyle goals."
            }
          ]}
          internalLinks={[
            { label: "Rate Benchmark Tool", href: "/tools/rate-benchmark" },
            { label: "Project Scope Estimator", href: "/tools/scope-estimator" }
          ]}
        />

      </div>
    </div>
  );
}
