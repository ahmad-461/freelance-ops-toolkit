"use client";

import React, { useState, useEffect, useRef } from "react";
import { RefreshCw, Coins, ArrowLeftRight, TrendingUp } from "lucide-react";

const SUPPORTED_CURRENCIES = [
  { code: "USD", symbol: "$", label: "USD ($)" },
  { code: "EUR", symbol: "€", label: "EUR (€)" },
  { code: "GBP", symbol: "£", label: "GBP (£)" },
  { code: "PKR", symbol: "Rs.", label: "PKR (Rs.)" },
  { code: "AUD", symbol: "A$", label: "AUD (A$)" },
  { code: "CAD", symbol: "C$", label: "CAD (C$)" },
  { code: "INR", symbol: "₹", label: "INR (₹)" },
];

interface ExchangeRateData {
  rates: Record<string, number>;
  time_next_update_utc?: string;
  time_last_update_utc?: string;
}

export default function CurrencyConverter() {
  const [amount, setAmount] = useState<string>("1000");
  const [sourceCurrency, setSourceCurrency] = useState<string>("USD");
  const [targetCurrency, setTargetCurrency] = useState<string>("EUR");

  // State for fetched rates
  const [ratesData, setRatesData] = useState<ExchangeRateData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Client-side cache ref to avoid multiple requests in the same active page session
  const cacheRef = useRef<ExchangeRateData | null>(null);

  useEffect(() => {
    async function fetchRates() {
      // Return cached data if exists
      if (cacheRef.current) {
        setRatesData(cacheRef.current);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/rates");
        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.error || "Failed to fetch conversion rates.");
        }
        const data = await response.json();
        if (data && data.rates) {
          cacheRef.current = data;
          setRatesData(data);
        } else {
          throw new Error("Invalid API response format.");
        }
      } catch (err) {
        console.error("Fetch rates error:", err);
        const errMsg = err instanceof Error ? err.message : "An unexpected error occurred while loading rates.";
        setError(errMsg);
      } finally {
        setLoading(false);
      }
    }

    fetchRates();
  }, []);

  // Compute conversion
  const parsedAmount = parseFloat(amount) || 0;
  let convertedAmount = 0;
  let singleRate = 0;

  if (ratesData && ratesData.rates) {
    const usdToSource = ratesData.rates[sourceCurrency];
    const usdToTarget = ratesData.rates[targetCurrency];

    if (usdToSource && usdToTarget) {
      // If we have rates relative to USD (USD is base currency from er-api):
      // rate_source_to_target = usdToTarget / usdToSource
      singleRate = usdToTarget / usdToSource;
      convertedAmount = parsedAmount * singleRate;
    }
  }

  // Get active currency symbols
  const sourceSymbol = SUPPORTED_CURRENCIES.find(c => c.code === sourceCurrency)?.symbol || "";
  const targetSymbol = SUPPORTED_CURRENCIES.find(c => c.code === targetCurrency)?.symbol || "";

  // Swap currencies handler
  const handleSwap = () => {
    const temp = sourceCurrency;
    setSourceCurrency(targetCurrency);
    setTargetCurrency(temp);
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen py-10 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Tool Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold text-sm mb-1">
            <Coins className="w-4 h-4" />
            <span>Operational Tools</span>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            Currency Converter
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Convert international client fees using live, cached currency exchange rates.
          </p>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Form & Switch (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-800/80 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-2">
                  <Coins className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">Convert Amount</h2>
                </div>

                {loading && (
                  <div className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                    <div className="w-4 h-4 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
                    Fetching live rates...
                  </div>
                )}
              </div>

              {/* Amount input */}
              <div className="mb-6">
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                  Amount to Convert
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-semibold pointer-events-none">
                    {sourceSymbol}
                  </span>
                  <input
                    type="number"
                    min="0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="e.g. 1000"
                    className="w-full rounded-xl border border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-900 py-2.5 pl-9 pr-4 text-sm shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100"
                  />
                </div>
                {parsedAmount < 0 && (
                  <p className="mt-1 text-xs text-red-600 dark:text-red-400 font-medium">Amount cannot be negative.</p>
                )}
              </div>

              {/* Dropdowns Row with Swap Button */}
              <div className="grid grid-cols-1 md:grid-cols-9 items-center gap-4">

                {/* Source Currency */}
                <div className="md:col-span-4">
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                    From Currency
                  </label>
                  <select
                    value={sourceCurrency}
                    onChange={(e) => setSourceCurrency(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-900 py-2.5 px-3.5 text-sm shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100"
                  >
                    {SUPPORTED_CURRENCIES.map(curr => (
                      <option key={curr.code} value={curr.code}>
                        {curr.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Swap Icon Button */}
                <div className="md:col-span-1 flex justify-center pt-5">
                  <button
                    type="button"
                    onClick={handleSwap}
                    className="p-2.5 rounded-full border border-gray-200 dark:border-gray-800 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/20 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all shadow-sm"
                    title="Swap Currencies"
                  >
                    <ArrowLeftRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Target Currency */}
                <div className="md:col-span-4">
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                    To Currency
                  </label>
                  <select
                    value={targetCurrency}
                    onChange={(e) => setTargetCurrency(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-900 py-2.5 px-3.5 text-sm shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100"
                  >
                    {SUPPORTED_CURRENCIES.map(curr => (
                      <option key={curr.code} value={curr.code}>
                        {curr.label}
                      </option>
                    ))}
                  </select>
                </div>

              </div>

              {/* Error block */}
              {error && (
                <div className="mt-6 p-4 rounded-xl border border-red-100 dark:border-red-900/30 bg-red-50/50 dark:bg-red-950/20 text-red-700 dark:text-red-400 flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-600 dark:bg-red-400 mt-2 flex-shrink-0" />
                  <div>
                    <span className="font-bold block text-sm">Failed to retrieve exchange rates</span>
                    <p className="text-xs leading-normal mt-0.5">{error}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Result Sidebar (5 Cols) */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-blue-100 animate-spin-slow" />
                Live Conversion
              </h3>

              {loading ? (
                <div className="p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 space-y-2">
                  <div className="h-4 bg-white/20 rounded w-1/3 animate-pulse" />
                  <div className="h-8 bg-white/20 rounded w-3/4 animate-pulse" />
                </div>
              ) : error ? (
                <div className="p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10">
                  <p className="text-sm font-semibold leading-relaxed">
                    Live rates are unavailable. Please check your internet connection or try again shortly.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Converted Amount Output */}
                  <div>
                    <span className="text-xs font-semibold text-blue-100 uppercase tracking-wider block mb-1">
                      Converted Amount
                    </span>
                    <div className="text-4xl sm:text-5xl font-extrabold flex items-baseline flex-wrap">
                      <span className="text-2xl sm:text-3xl font-bold opacity-90 mr-1">{targetSymbol}</span>
                      {convertedAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      <span className="text-xs font-medium opacity-80 ml-2">{targetCurrency}</span>
                    </div>
                  </div>

                  {/* Single Unit Rate Conversion Details */}
                  {singleRate > 0 && (
                    <div className="pt-6 border-t border-white/20">
                      <span className="text-xs font-semibold text-blue-100 uppercase tracking-wider block mb-1">
                        Exchange Rate Details
                      </span>
                      <p className="text-sm font-medium">
                        1 {sourceCurrency} = {singleRate.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 })} {targetCurrency}
                      </p>
                      {ratesData?.time_last_update_utc && (
                        <p className="text-[10px] text-blue-200 mt-2">
                          Rates updated: {ratesData.time_last_update_utc}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Calculations Explanation Card */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-800/80 p-6 shadow-sm">
              <h4 className="font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-3">
                <TrendingUp className="w-5 h-5 text-blue-500" />
                No-CORS Serverless Proxy
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-3">
                To guarantee flawless speed and privacy, our toolkit uses an API route to proxy standard exchange rate data to your client dashboard.
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                Rates are cached briefly in the page session (React memory), so switching currencies repeatedly performs instant client calculations without flooding the API.
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
