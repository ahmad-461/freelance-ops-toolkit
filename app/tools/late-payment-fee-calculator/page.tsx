"use client";

import React, { useState, useEffect } from "react";
import { CalendarClock, DollarSign, Calendar, Percent, HelpCircle, AlertCircle } from "lucide-react";

export default function LatePaymentFeeCalculator() {
  // Input states
  const [invoiceAmount, setInvoiceAmount] = useState<string>("1000");
  const [dueDate, setDueDate] = useState<string>("");
  const [todayDate, setTodayDate] = useState<string>("");
  const [lateFeeType, setLateFeeType] = useState<"flat" | "percentage">("percentage");
  const [lateFeeValue, setLateFeeValue] = useState<string>("5"); // default 5% or $50

  // Touch tracking state for validation
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  // Set initial dates on mount to prevent Next.js hydration mismatches
  useEffect(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    const formattedToday = `${yyyy}-${mm}-${dd}`;

    setTodayDate(formattedToday);

    // Set default due date to 30 days ago to show an active overdue state by default
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);
    const prevYyyy = thirtyDaysAgo.getFullYear();
    const prevMm = String(thirtyDaysAgo.getMonth() + 1).padStart(2, "0");
    const prevDd = String(thirtyDaysAgo.getDate()).padStart(2, "0");
    setDueDate(`${prevYyyy}-${prevMm}-${prevDd}`);
  }, []);

  // Logical calculations
  const parsedAmount = parseFloat(invoiceAmount) || 0;
  const parsedFeeValue = parseFloat(lateFeeValue) || 0;

  let daysOverdue = 0;
  let breakdownMonths = 0;
  let breakdownDays = 0;
  let isOverdue = false;

  if (dueDate && todayDate) {
    const start = new Date(dueDate);
    const end = new Date(todayDate);

    // Calculate difference in milliseconds
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 0) {
      daysOverdue = diffDays;
      isOverdue = true;

      // Breakdown of months & days
      breakdownMonths = Math.floor(daysOverdue / 30);
      breakdownDays = daysOverdue % 30;
    }
  }

  // Calculate late fee amount
  let calculatedLateFee = 0;
  if (isOverdue) {
    if (lateFeeType === "percentage") {
      // Option A (prorated daily): (days overdue / 30) * monthly rate * invoice amount
      const monthlyRateDecimal = parsedFeeValue / 100;
      calculatedLateFee = (daysOverdue / 30) * monthlyRateDecimal * parsedAmount;
    } else {
      // Flat fee
      calculatedLateFee = parsedFeeValue;
    }
  }

  const newTotalOwed = parsedAmount + calculatedLateFee;

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen py-10 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Tool Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold text-sm mb-1">
            <CalendarClock className="w-4 h-4" />
            <span>Operational Tools</span>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            Late Payment Fee Calculator
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Calculate accurate prorated interest rates, total days past due, and updated outstanding invoice totals.
          </p>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Form Fields (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-800/80 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-6 pb-3 border-b border-gray-100 dark:border-gray-800">
                <CalendarClock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Invoice &amp; Due Date Details</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Invoice Amount */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                    Invoice Amount ($)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-semibold pointer-events-none">$</span>
                    <input
                      type="number"
                      min="0"
                      value={invoiceAmount}
                      onChange={(e) => setInvoiceAmount(e.target.value)}
                      placeholder="e.g. 1000"
                      className="w-full rounded-xl border border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-900 py-2.5 pl-9 pr-4 text-sm shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                  {parsedAmount < 0 && (
                    <p className="mt-1 text-xs text-red-600 dark:text-red-400 font-medium">Invoice amount cannot be negative.</p>
                  )}
                </div>

                {/* Late Fee Type */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                    Late Fee Calculation Model
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setLateFeeType("percentage");
                        setLateFeeValue("5"); // Reset default percentage
                      }}
                      className={`py-2.5 px-4 rounded-xl border text-sm font-semibold transition-all ${
                        lateFeeType === "percentage"
                          ? "border-blue-500 bg-blue-50/50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400"
                          : "border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 hover:border-gray-400"
                      }`}
                    >
                      Monthly %
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setLateFeeType("flat");
                        setLateFeeValue("50"); // Reset default flat fee
                      }}
                      className={`py-2.5 px-4 rounded-xl border text-sm font-semibold transition-all ${
                        lateFeeType === "flat"
                          ? "border-blue-500 bg-blue-50/50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400"
                          : "border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 hover:border-gray-400"
                      }`}
                    >
                      One-time Flat Fee
                    </button>
                  </div>
                </div>

                {/* Late Fee Value */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                    {lateFeeType === "percentage" ? "Monthly Interest Rate (%)" : "Flat Fee Amount ($)"}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-semibold pointer-events-none">
                      {lateFeeType === "percentage" ? <Percent className="w-4 h-4" /> : <DollarSign className="w-4 h-4" />}
                    </span>
                    <input
                      type="number"
                      min="0"
                      value={lateFeeValue}
                      onChange={(e) => setLateFeeValue(e.target.value)}
                      placeholder={lateFeeType === "percentage" ? "e.g. 5" : "e.g. 50"}
                      className="w-full rounded-xl border border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-900 py-2.5 pl-9 pr-4 text-sm shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                  {parsedFeeValue < 0 && (
                    <p className="mt-1 text-xs text-red-600 dark:text-red-400 font-medium">Late fee cannot be negative.</p>
                  )}
                </div>

                {/* Due Date */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                    Invoice Due Date
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-semibold pointer-events-none">
                      <Calendar className="w-4 h-4" />
                    </span>
                    <input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      onBlur={() => handleBlur("dueDate")}
                      className="w-full rounded-xl border border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-900 py-2.5 pl-9 pr-4 text-sm shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                  {!dueDate && touched["dueDate"] && (
                    <p className="mt-1 text-xs text-red-600 dark:text-red-400 font-medium">Due date is required.</p>
                  )}
                </div>

                {/* Today's Date Override */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                    Calculation Date (Today)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-semibold pointer-events-none">
                      <Calendar className="w-4 h-4" />
                    </span>
                    <input
                      type="date"
                      value={todayDate}
                      onChange={(e) => setTodayDate(e.target.value)}
                      onBlur={() => handleBlur("todayDate")}
                      className="w-full rounded-xl border border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-900 py-2.5 pl-9 pr-4 text-sm shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                  {!todayDate && touched["todayDate"] && (
                    <p className="mt-1 text-xs text-red-600 dark:text-red-400 font-medium">Calculation date is required.</p>
                  )}
                </div>

              </div>
            </div>
          </div>

          {/* Sidebar calculations (5 Cols) */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <CalendarClock className="w-5 h-5 text-blue-100" />
                Overdue Calculations
              </h3>

              {!isOverdue ? (
                <div className="space-y-6">
                  {/* Under Due/Neutral State Display */}
                  <div className="p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-blue-100" />
                    <div>
                      <p className="text-sm font-bold leading-relaxed">
                        Not yet overdue
                      </p>
                      <p className="text-xs text-blue-100 mt-1 leading-normal">
                        The designated due date has not been surpassed yet based on the calculation date.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <span className="text-xs font-semibold text-blue-100 uppercase tracking-wider block mb-1">
                        Calculated Late Fee
                      </span>
                      <div className="text-3xl sm:text-4xl font-extrabold flex items-baseline">
                        <span className="text-xl sm:text-2xl font-bold opacity-90 mr-1">$</span>
                        0.00
                      </div>
                    </div>

                    <div className="pt-6 border-t border-white/20">
                      <span className="text-xs font-semibold text-blue-100 uppercase tracking-wider block mb-1">
                        New Total Balance
                      </span>
                      <div className="text-3xl sm:text-4xl font-extrabold flex items-baseline">
                        <span className="text-xl sm:text-2xl font-bold opacity-90 mr-1">$</span>
                        {parsedAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Overdue Tracker Status */}
                  <div>
                    <span className="text-xs font-semibold text-blue-100 uppercase tracking-wider block mb-1">
                      Overdue Timeline
                    </span>
                    <div className="text-2xl font-extrabold leading-tight">
                      {daysOverdue} days overdue
                    </div>
                    <span className="text-xs text-blue-200 mt-1 block">
                      ({breakdownMonths} {breakdownMonths === 1 ? "month" : "months"}, {breakdownDays} {breakdownDays === 1 ? "day" : "days"})
                    </span>
                  </div>

                  {/* Calculated Late Fee */}
                  <div className="pt-6 border-t border-white/20">
                    <span className="text-xs font-semibold text-blue-100 uppercase tracking-wider block mb-1">
                      Calculated Late Fee
                    </span>
                    <div className="text-3xl sm:text-4xl font-extrabold flex items-baseline">
                      <span className="text-xl sm:text-2xl font-bold opacity-90 mr-1">$</span>
                      {calculatedLateFee.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                  </div>

                  {/* New total owed */}
                  <div className="pt-6 border-t border-white/20">
                    <span className="text-xs font-semibold text-blue-100 uppercase tracking-wider block mb-1">
                      New Total Balance Owed
                    </span>
                    <div className="text-3xl sm:text-4xl font-extrabold flex items-baseline">
                      <span className="text-xl sm:text-2xl font-bold opacity-90 mr-1">$</span>
                      {newTotalOwed.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Calculations Explanation Card */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-800/80 p-6 shadow-sm">
              <h4 className="font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-3">
                <HelpCircle className="w-5 h-5 text-blue-500" />
                How are fees prorated?
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-3">
                To keep billing terms highly professional and fair to your clients, percentage interest rates are computed on a prorated daily schedule:
              </p>
              <div className="bg-gray-50 dark:bg-gray-950 p-3 rounded-lg border border-gray-100 dark:border-gray-850 font-mono text-[11px] text-gray-600 dark:text-gray-400 leading-normal">
                (Days Overdue / 30) * Monthly Rate * Invoice Amount
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mt-3">
                One-time flat fees are added to the balance immediately as soon as the calculation date exceeds the designated invoice due date.
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
