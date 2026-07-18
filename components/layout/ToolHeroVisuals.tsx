"use client";

import React, { useState, useEffect } from "react";
import {
  FileText,
  DollarSign,
  Coins,
  ArrowLeftRight,
  TrendingUp,
  Calendar,
  CheckSquare,
  FileSignature,
  Shield,
  RefreshCw,
  ListTodo,
  Briefcase,
  Mail,
  FileCheck,
  Clock,
  Layers
} from "lucide-react";

// Hook to detect prefers-reduced-motion
function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mediaQuery.matches);

    const listener = (event: MediaQueryListEvent) => {
      setReduced(event.matches);
    };

    mediaQuery.addEventListener("change", listener);
    return () => mediaQuery.removeEventListener("change", listener);
  }, []);

  return reduced;
}

/* ==========================================
   1. INVOICE GENERATOR VISUAL
   - Miniature mock invoice panel with line items.
   - Total number "ticks up" from $0.00 to $4,850.00 on load.
   ========================================== */
export function InvoiceVisual() {
  const isReduced = usePrefersReducedMotion();
  const [total, setTotal] = useState(isReduced ? 4850 : 0);

  useEffect(() => {
    if (isReduced) return;
    const duration = 1200; // ms
    const startTime = performance.now();

    let animationFrameId: number;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Easing function: cubic ease-out
      const ease = 1 - Math.pow(1 - progress, 3);
      setTotal(ease * 4850);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isReduced]);

  return (
    <div className="w-full h-full flex flex-col justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm font-sans text-xs">
      {/* Mini Header */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2 mb-2">
        <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
          <FileText className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span>INV-2025-001</span>
        </div>
        <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 font-mono">DRAFT</span>
      </div>

      {/* Mini Line Items */}
      <div className="space-y-1.5 flex-1 py-1">
        <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800/60 pb-1">
          <span>ITEM</span>
          <span>AMOUNT</span>
        </div>
        <div className="flex justify-between items-center text-slate-700 dark:text-slate-300">
          <span className="truncate max-w-[120px]">Web Development Build</span>
          <span className="font-mono font-medium">$3,500.00</span>
        </div>
        <div className="flex justify-between items-center text-slate-700 dark:text-slate-300">
          <span className="truncate max-w-[120px]">UI/UX Prototype Design</span>
          <span className="font-mono font-medium">$1,350.00</span>
        </div>
      </div>

      {/* Mini Total (Ticks up) */}
      <div className="border-t border-slate-100 dark:border-slate-800 pt-2 mt-2 flex justify-between items-center">
        <span className="text-slate-500 dark:text-slate-400 font-medium">TOTAL DUE:</span>
        <span className="font-mono text-base font-extrabold text-blue-600 dark:text-blue-400">
          ${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      </div>
    </div>
  );
}

/* ==========================================
   2. RATE CALCULATOR VISUAL
   - Miniature slider showing target goal.
   - Suggested hourly rate slides smoothly into place.
   ========================================== */
export function RateCalculatorVisual() {
  const isReduced = usePrefersReducedMotion();
  const [offset, setOffset] = useState(isReduced ? 72 : 0);

  useEffect(() => {
    if (isReduced) return;
    const timer = setTimeout(() => {
      setOffset(72); // smooth shift to 72%
    }, 200);
    return () => clearTimeout(timer);
  }, [isReduced]);

  return (
    <div className="w-full h-full flex flex-col justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm font-sans text-xs">
      <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200 mb-2">
        <DollarSign className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
        <span>Rate Target Estimator</span>
      </div>

      <div className="space-y-4 my-auto">
        {/* Goal Indicator */}
        <div className="flex justify-between items-center">
          <span className="text-slate-500 dark:text-slate-400">Target Income:</span>
          <span className="font-mono font-bold text-slate-800 dark:text-white">$100,000 /yr</span>
        </div>

        {/* Sliding Range Representation */}
        <div className="relative pt-4 pb-2">
          {/* Track */}
          <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full" />
          {/* Progress fill */}
          <div
            style={{ width: `${offset}%` }}
            className="absolute top-4 left-0 h-1.5 bg-blue-600 dark:bg-blue-500 rounded-full transition-all duration-1000 ease-out"
          />
          {/* Thumb marker */}
          <div
            style={{ left: `${offset}%` }}
            className="absolute top-2.5 -ml-2 w-4.5 h-4.5 bg-white dark:bg-slate-900 border-2 border-blue-600 dark:border-blue-500 rounded-full transition-all duration-1000 ease-out flex items-center justify-center shadow-sm"
          />
        </div>

        {/* Recommended rate output */}
        <div className="text-center">
          <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">Suggested Rate</span>
          <div className="text-xl font-extrabold text-blue-600 dark:text-blue-400 font-mono mt-0.5">
            $52.08 /hr
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==========================================
   3. CURRENCY CONVERTER VISUAL
   - Live-looking exchange rate layout.
   - Periodic rotation of exchange icon and currency badges.
   ========================================== */
export function CurrencyConverterVisual() {
  const isReduced = usePrefersReducedMotion();
  const [rotated, setRotated] = useState(false);

  useEffect(() => {
    if (isReduced) return;
    const interval = setInterval(() => {
      setRotated(prev => !prev);
    }, 3000);
    return () => clearInterval(interval);
  }, [isReduced]);

  return (
    <div className="w-full h-full flex flex-col justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm font-sans text-xs">
      <div className="flex items-center justify-between font-bold text-slate-800 dark:text-slate-200 mb-2">
        <span className="flex items-center gap-1.5">
          <Coins className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span>Exchange Ticker</span>
        </span>
        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono bg-emerald-50 dark:bg-emerald-950/30 px-1.5 py-0.5 rounded font-bold">
          LIVE
        </span>
      </div>

      <div className="flex items-center justify-around flex-1 py-2">
        {/* Source Currency */}
        <div className={`text-center transition-all duration-500 ${rotated ? "scale-95 opacity-80" : "scale-105 font-bold"}`}>
          <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 text-sm font-bold">
            $
          </div>
          <span className="text-[10px] block mt-1 font-mono text-slate-600 dark:text-slate-400">USD</span>
        </div>

        {/* Rotating swap arrow */}
        <div className="p-2 rounded-full bg-slate-50 dark:bg-slate-800/80">
          <ArrowLeftRight
            className={`w-4 h-4 text-slate-400 transition-transform duration-700 ${isReduced ? "" : rotated ? "rotate-180 text-blue-500" : ""}`}
          />
        </div>

        {/* Target Currency */}
        <div className={`text-center transition-all duration-500 ${!rotated ? "scale-95 opacity-80" : "scale-105 font-bold"}`}>
          <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-sm font-bold">
            €
          </div>
          <span className="text-[10px] block mt-1 font-mono text-slate-600 dark:text-slate-400">EUR</span>
        </div>
      </div>

      {/* Mini rate details */}
      <div className="border-t border-slate-100 dark:border-slate-800 pt-2 text-center text-[11px] font-mono text-slate-500 dark:text-slate-400">
        1.00 USD = {rotated ? "0.9248 EUR" : "0.9248 EUR"}
      </div>
    </div>
  );
}

/* ==========================================
   4. LATE PAYMENT FEE CALCULATOR VISUAL
   - Miniature calendar grid highlighting overdue days in red.
   - Accumulating late fee badge blinking/ticking.
   ========================================== */
export function LatePaymentFeeVisual() {
  const isReduced = usePrefersReducedMotion();
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    if (isReduced) return;
    const interval = setInterval(() => {
      setPulse(p => !p);
    }, 1500);
    return () => clearInterval(interval);
  }, [isReduced]);

  return (
    <div className="w-full h-full flex flex-col justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm font-sans text-xs">
      <div className="flex items-center justify-between font-bold text-slate-800 dark:text-slate-200 mb-2">
        <span className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-red-500" />
          <span>Calendar Grid</span>
        </span>
        <span className={`text-[10px] font-mono bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 px-1.5 py-0.5 rounded font-bold transition-all duration-300 ${!isReduced && pulse ? "opacity-70" : ""}`}>
          +14 Days Late
        </span>
      </div>

      {/* Calendar representation */}
      <div className="grid grid-cols-7 gap-1 flex-1 py-1">
        {Array.from({ length: 28 }).map((_, i) => {
          const isOverdue = i >= 14 && i < 24; // 10 late days
          return (
            <div
              key={i}
              className={`aspect-square rounded flex items-center justify-center text-[9px] font-semibold border ${
                isOverdue
                  ? "border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400"
                  : "border-slate-100 dark:border-slate-850 bg-slate-50 dark:bg-slate-900/40 text-slate-400 dark:text-slate-600"
              }`}
            >
              {i + 1}
            </div>
          );
        })}
      </div>

      {/* Fee Calculation details */}
      <div className="border-t border-slate-100 dark:border-slate-800 pt-1.5 mt-1.5 flex justify-between items-center text-[10px]">
        <span className="text-slate-500 dark:text-slate-400 font-medium">Accumulating Fee:</span>
        <span className="font-mono font-bold text-red-600 dark:text-red-400 text-xs">
          +$140.00 Owed
        </span>
      </div>
    </div>
  );
}

/* ==========================================
   5. PROPOSAL GENERATOR VISUAL
   - Outline checklist milestones.
   - Milestone checkboxes stagger check themselves off upon load.
   ========================================== */
export function ProposalVisual() {
  const isReduced = usePrefersReducedMotion();
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({
    0: isReduced,
    1: isReduced,
    2: isReduced,
  });

  useEffect(() => {
    if (isReduced) return;
    const timers = [
      setTimeout(() => setCheckedItems(prev => ({ ...prev, 0: true })), 400),
      setTimeout(() => setCheckedItems(prev => ({ ...prev, 1: true })), 900),
      setTimeout(() => setCheckedItems(prev => ({ ...prev, 2: true })), 1400),
    ];
    return () => timers.forEach(clearTimeout);
  }, [isReduced]);

  const milestones = [
    "Core Discovery Phase",
    "Database Migration Spec",
    "Tailwind Frontend Mockups",
  ];

  return (
    <div className="w-full h-full flex flex-col justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm font-sans text-xs">
      <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200 mb-2">
        <CheckSquare className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
        <span>Scope & Milestones</span>
      </div>

      <div className="space-y-2.5 my-auto">
        {milestones.map((text, idx) => {
          const isChecked = checkedItems[idx];
          return (
            <div
              key={idx}
              className={`flex items-center gap-2.5 p-2 rounded-lg border transition-all duration-300 ${
                isChecked
                  ? "border-blue-100 dark:border-blue-900/30 bg-blue-50/30 dark:bg-blue-950/10 text-slate-800 dark:text-slate-200"
                  : "border-slate-100 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-900/10 text-slate-400 dark:text-slate-500"
              }`}
            >
              <div
                className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                  isChecked
                    ? "bg-blue-600 dark:bg-blue-500 border-blue-600 dark:border-blue-500 text-white"
                    : "border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                }`}
              >
                {isChecked && (
                  <svg className="w-2.5 h-2.5 stroke-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span className={`font-medium ${isChecked ? "" : "line-through opacity-70"}`}>{text}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ==========================================
   6. CONTRACT TEMPLATE BUILDER VISUAL
   - Subtle paper mockup with a signature placeholder.
   - Drawing pen slowly drawing/tracing standard signature line.
   ========================================== */
export function ContractVisual() {
  const isReduced = usePrefersReducedMotion();
  const [lineWidth, setLineWidth] = useState(isReduced ? 100 : 0);

  useEffect(() => {
    if (isReduced) return;
    const timer = setTimeout(() => {
      setLineWidth(100);
    }, 400);
    return () => clearTimeout(timer);
  }, [isReduced]);

  return (
    <div className="w-full h-full flex flex-col justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm font-sans text-xs">
      <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200 mb-2">
        <FileSignature className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
        <span>Contract Agreement Preview</span>
      </div>

      <div className="flex-1 flex flex-col justify-center space-y-2 py-1">
        {/* Simple mock contract text block */}
        <div className="space-y-1.5">
          <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-sm" />
          <div className="h-2 w-5/6 bg-slate-100 dark:bg-slate-800 rounded-sm" />
          <div className="h-2 w-4/5 bg-slate-100 dark:bg-slate-800 rounded-sm" />
        </div>

        {/* Signature Box */}
        <div className="border border-dashed border-slate-200 dark:border-slate-800 rounded-lg p-2.5 bg-slate-50/50 dark:bg-slate-950/20 relative">
          <div className="flex justify-between items-end text-[10px] text-slate-400">
            <span>Jane Doe, Contractor</span>
            <span className="text-blue-600 dark:text-blue-400 font-serif italic text-xs">J. Doe</span>
          </div>

          {/* Growing trace line */}
          <div className="relative h-1.5 w-full mt-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              style={{ width: `${lineWidth}%` }}
              className="h-full bg-blue-600 dark:bg-blue-500 rounded-full transition-all duration-1200 ease-out"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==========================================
   7. NDA GENERATOR VISUAL
   - Folded sheet document with lock overlay.
   - Clean protective shield outline tracing/fading on load/hover.
   ========================================== */
export function NDAVisual() {
  const isReduced = usePrefersReducedMotion();
  const [shieldActive, setShieldActive] = useState(false);

  useEffect(() => {
    if (isReduced) return;
    const timer = setTimeout(() => {
      setShieldActive(true);
    }, 300);
    return () => clearTimeout(timer);
  }, [isReduced]);

  return (
    <div className="w-full h-full flex flex-col justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm font-sans text-xs">
      <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200 mb-2">
        <Shield className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
        <span>Confidential Protection</span>
      </div>

      <div className="flex-1 flex items-center justify-center relative">
        {/* Document Silhouette */}
        <div className="w-24 h-28 bg-slate-50 dark:bg-slate-950/40 rounded-lg border border-slate-150 dark:border-slate-850 p-2 relative flex flex-col justify-between">
          {/* Folded paper corner representation */}
          <div className="absolute top-0 right-0 w-4 h-4 bg-slate-200 dark:bg-slate-800 rounded-bl-md border-l border-b border-slate-300 dark:border-slate-700" />

          <div className="space-y-1 w-16">
            <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded" />
            <div className="h-1.5 w-4/5 bg-slate-200 dark:bg-slate-800 rounded" />
            <div className="h-1.5 w-2/3 bg-slate-200 dark:bg-slate-800 rounded" />
          </div>

          {/* Overlay Shield (Draw/fade transition) */}
          <div
            className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 ${
              shieldActive ? "scale-100 opacity-100" : "scale-75 opacity-0"
            }`}
          >
            <div className="p-2.5 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-600 dark:text-blue-400 shadow-md">
              <Shield className="w-6 h-6 stroke-2" />
            </div>
          </div>

          <div className="h-1.5 w-1/2 bg-slate-200 dark:bg-slate-800 rounded mt-auto" />
        </div>
      </div>
    </div>
  );
}

/* ==========================================
   8. RETAINER AGREEMENT GENERATOR VISUAL
   - Clean repeating arrow animation showing continuous billing.
   - Standardized rate amount details ($3,500/mo).
   ========================================== */
export function RetainerVisual() {
  const isReduced = usePrefersReducedMotion();

  return (
    <div className="w-full h-full flex flex-col justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm font-sans text-xs">
      <div className="flex items-center justify-between font-bold text-slate-800 dark:text-slate-200 mb-2">
        <span className="flex items-center gap-1.5">
          <RefreshCw className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span>Recurring Revenue</span>
        </span>
        <span className="text-[10px] bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 px-1.5 py-0.5 rounded font-mono font-bold">
          Monthly
        </span>
      </div>

      <div className="flex-1 flex flex-col justify-center items-center py-2 space-y-3">
        {/* Animated Refresh Loops */}
        <div className="relative p-4 rounded-full bg-blue-500/5 dark:bg-blue-400/5 border border-blue-500/10 flex items-center justify-center">
          <RefreshCw
            className={`w-8 h-8 text-blue-600 dark:text-blue-400 transition-transform ${
              isReduced ? "" : "animate-spin-slow"
            }`}
          />
          <span className="absolute text-xs font-black font-sans text-blue-600 dark:text-blue-400">$</span>
        </div>

        {/* Counter Rate Block */}
        <div className="text-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Guaranteed Retainer</span>
          <span className="font-mono text-base font-extrabold text-slate-800 dark:text-white mt-0.5 block">$3,500.00 /mo</span>
        </div>
      </div>
    </div>
  );
}

/* ==========================================
   9. CLIENT INTAKE FORM BUILDER VISUAL
   - Multi-step wizard layout with interactive circles.
   - Sequence pulses incrementally.
   ========================================== */
export function ClientIntakeVisual() {
  const isReduced = usePrefersReducedMotion();
  const [step, setStep] = useState(1);

  useEffect(() => {
    if (isReduced) return;
    const interval = setInterval(() => {
      setStep(s => (s % 3) + 1);
    }, 2000);
    return () => clearInterval(interval);
  }, [isReduced]);

  return (
    <div className="w-full h-full flex flex-col justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm font-sans text-xs">
      <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200 mb-2">
        <ListTodo className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
        <span>Onboard Pipeline Wizard</span>
      </div>

      <div className="flex-1 flex flex-col justify-center space-y-5 py-2">
        {/* Wizard Multi-Step Circles */}
        <div className="flex items-center justify-around relative">
          {/* Connector Line */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-100 dark:bg-slate-800 -translate-y-1/2 z-0" />

          {[1, 2, 3].map(item => {
            const isActive = step >= item;
            const isCurrent = step === item;
            return (
              <div
                key={item}
                className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs border-2 z-10 transition-all duration-500 ${
                  isCurrent
                    ? "border-blue-600 bg-blue-600 text-white scale-110 shadow-sm"
                    : isActive
                    ? "border-blue-600 bg-blue-50 dark:bg-blue-950 text-blue-600"
                    : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-400"
                }`}
              >
                {item}
              </div>
            );
          })}
        </div>

        {/* Step Details Label */}
        <div className="text-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Currently Customizing</span>
          <span className="font-semibold text-slate-700 dark:text-slate-300 text-xs mt-0.5 block">
            {step === 1 ? "Step 1: Project Goals" : step === 2 ? "Step 2: Budget Range" : "Step 3: Upload Scope"}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ==========================================
   10. PORTFOLIO CASE STUDY BUILDER VISUAL
   - Miniature bar chart measuring metrics going from low to high.
   - Highlights data metrics: "+150% Leads".
   ========================================== */
export function PortfolioCaseStudyVisual() {
  const isReduced = usePrefersReducedMotion();
  const [filled, setFilled] = useState(isReduced);

  useEffect(() => {
    if (isReduced) return;
    const timer = setTimeout(() => {
      setFilled(true);
    }, 300);
    return () => clearTimeout(timer);
  }, [isReduced]);

  return (
    <div className="w-full h-full flex flex-col justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm font-sans text-xs">
      <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200 mb-2">
        <Briefcase className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
        <span>Case Study Metric Output</span>
      </div>

      <div className="flex-1 flex gap-3 items-end justify-center py-2 relative">
        {/* Metric Bar 1 */}
        <div className="flex flex-col items-center">
          <div className="w-4 bg-slate-100 dark:bg-slate-800 rounded-t h-8" />
          <span className="text-[9px] text-slate-400 mt-1">Before</span>
        </div>

        {/* Metric Bar 2 */}
        <div className="flex flex-col items-center">
          <div className="w-4 bg-blue-100 dark:bg-blue-950 rounded-t h-12" />
          <span className="text-[9px] text-slate-400 mt-1">Phase 1</span>
        </div>

        {/* Metric Bar 3 */}
        <div className="flex flex-col items-center">
          <div
            style={{ height: filled ? "56px" : "0px" }}
            className="w-4 bg-blue-600 dark:bg-blue-500 rounded-t transition-all duration-1000 ease-out"
          />
          <span className="text-[9px] text-slate-400 mt-1">Result</span>
        </div>

        {/* Floating Stat Badge */}
        <div className="absolute top-2 right-2 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/30 rounded-lg p-1.5 text-right shadow-sm">
          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 block">+150% Conversion</span>
        </div>
      </div>
    </div>
  );
}

/* ==========================================
   11. PAYMENT REMINDER GENERATOR VISUAL
   - Floating envelope slides left to right.
   - Gentle bouncing landing inside secure mailbox frame.
   ========================================== */
export function PaymentReminderVisual() {
  const isReduced = usePrefersReducedMotion();
  const [slide, setSlide] = useState(false);

  useEffect(() => {
    if (isReduced) return;
    const interval = setInterval(() => {
      setSlide(prev => !prev);
    }, 4000);
    return () => clearInterval(interval);
  }, [isReduced]);

  return (
    <div className="w-full h-full flex flex-col justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm font-sans text-xs">
      <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200 mb-2">
        <Mail className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
        <span>Reminder Mail Pipeline</span>
      </div>

      <div className="flex-1 flex items-center relative overflow-hidden h-20">
        {/* Track Line */}
        <div className="absolute left-4 right-4 h-0.5 border-t border-dashed border-slate-200 dark:border-slate-800 top-1/2 -translate-y-1/2" />

        {/* Outgoing Station */}
        <div className="w-8 h-8 rounded-full border border-slate-100 dark:border-slate-850 bg-slate-50 dark:bg-slate-900/40 flex items-center justify-center text-slate-400">
          📨
        </div>

        {/* Sliding Envelope */}
        <div
          className={`absolute transition-all duration-1000 ease-out z-10 ${
            isReduced ? "left-[60px]" : slide ? "left-[180px] scale-110" : "left-[36px] scale-100"
          }`}
          style={{ top: "calc(50% - 10px)" }}
        >
          <div className="p-1.5 rounded bg-blue-600 dark:bg-blue-500 text-white shadow-md">
            <Mail className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Client Inbox Station */}
        <div className="w-8 h-8 rounded-full border border-blue-100 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center text-blue-600 dark:text-blue-400 ml-auto">
          📥
        </div>
      </div>
    </div>
  );
}

/* ==========================================
   12. MEETING RECAP GENERATOR VISUAL
   - Speech bubble text transition to bulleted points.
   - Text cursor blink.
   ========================================== */
export function MeetingRecapVisual() {
  const isReduced = usePrefersReducedMotion();

  return (
    <div className="w-full h-full flex flex-col justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm font-sans text-xs">
      <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200 mb-2">
        <FileCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
        <span>Speech-to-Recap Analyzer</span>
      </div>

      <div className="flex-1 flex flex-col justify-center space-y-2.5 py-1">
        {/* Outspoken Speech Bubble */}
        <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850/80 max-w-[180px]">
          <p className="text-[10px] text-slate-500 italic leading-snug">
            &quot;Let&apos;s build the API route and launch by Friday...&quot;
          </p>
        </div>

        {/* Structured bullet summary block */}
        <div className="space-y-1.5 pl-2 border-l-2 border-blue-600 dark:border-blue-500">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
            <span className="text-[10px] text-slate-800 dark:text-slate-200 font-medium">Build Serverless APIs</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
            <span className="text-[10px] text-slate-800 dark:text-slate-200 font-medium flex items-center">
              Deploy to Staging
              <span className={`w-1 h-3.5 bg-blue-600 ml-1 inline-block ${isReduced ? "" : "animate-pulse"}`} />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==========================================
   13. TIME TRACKER VISUAL
   - elegant live-updating Mock Timer display.
   - Rotating circular track.
   ========================================== */
export function TimeTrackerVisual() {
  const isReduced = usePrefersReducedMotion();
  const [seconds, setSeconds] = useState(8);

  useEffect(() => {
    if (isReduced) return;
    const interval = setInterval(() => {
      setSeconds(s => (s + 1) % 60);
    }, 1000);
    return () => clearInterval(interval);
  }, [isReduced]);

  return (
    <div className="w-full h-full flex flex-col justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm font-sans text-xs">
      <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200 mb-2">
        <Clock className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
        <span>Time Tracking Session</span>
      </div>

      <div className="flex-1 flex flex-col justify-center items-center py-2 space-y-3">
        {/* Timer loop */}
        <div className="relative w-14 h-14 rounded-full border-2 border-slate-100 dark:border-slate-850 flex items-center justify-center">
          <RefreshCw
            className={`absolute inset-1 text-blue-600/20 dark:text-blue-400/10 transition-transform ${
              isReduced ? "" : "animate-spin-slow"
            }`}
          />
          <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </div>

        {/* Timer display */}
        <div className="text-center">
          <span className="font-mono text-base font-extrabold text-slate-800 dark:text-white">
            01:42:{seconds < 10 ? `0${seconds}` : seconds}
          </span>
          <span className="text-[9px] uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-bold block mt-0.5 animate-pulse">
            ACTIVE SESSION
          </span>
        </div>
      </div>
    </div>
  );
}

/* ==========================================
   14. PROJECT SCOPE ESTIMATOR VISUAL
   - Range meter/gauge with Low, Medium, High complexity markers.
   - Pin/needle points pivots slowly back and forth around Medium complexity.
   ========================================== */
export function ScopeEstimatorVisual() {
  const isReduced = usePrefersReducedMotion();
  const [pivot, setPivot] = useState(false);

  useEffect(() => {
    if (isReduced) return;
    const interval = setInterval(() => {
      setPivot(p => !p);
    }, 2500);
    return () => clearInterval(interval);
  }, [isReduced]);

  return (
    <div className="w-full h-full flex flex-col justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm font-sans text-xs">
      <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200 mb-2">
        <Layers className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
        <span>Scope Complexity Gauge</span>
      </div>

      <div className="flex-1 flex flex-col justify-center py-2 space-y-4">
        {/* Semi-circular gauge */}
        <div className="relative w-full max-w-[200px] h-12 mx-auto overflow-hidden">
          {/* Arc */}
          <div className="absolute top-0 left-0 right-0 bottom-0 rounded-t-full border-4 border-slate-100 dark:border-slate-800 border-b-0" />

          {/* Active colored section */}
          <div className="absolute top-0 left-0 right-0 bottom-0 rounded-t-full border-4 border-blue-600 dark:border-blue-500 border-b-0 clip-half" />

          {/* Needle pin */}
          <div
            className="absolute bottom-0 left-1/2 w-1.5 h-10 bg-slate-800 dark:bg-white rounded-t origin-bottom transition-transform duration-1000 ease-in-out"
            style={{
              transform: isReduced
                ? "translateX(-50%) rotate(0deg)"
                : pivot
                ? "translateX(-50%) rotate(25deg)"
                : "translateX(-50%) rotate(-25deg)"
            }}
          />
          <div className="absolute bottom-0 left-1/2 -ml-2.5 w-5 h-2.5 bg-slate-800 dark:bg-white rounded-t-full" />
        </div>

        {/* Labels */}
        <div className="flex justify-between text-[9px] font-bold text-slate-400 uppercase tracking-wider px-4">
          <span>Low</span>
          <span className="text-blue-600 dark:text-blue-400">Sweet Spot</span>
          <span>High</span>
        </div>
      </div>
    </div>
  );
}

/* ==========================================
   15. FREELANCE RATE BENCHMARK TOOL VISUAL
   - Horizontal slider rate benchmark with minimum, median, maximum markers.
   - highlighted median market rate bubble pulses smoothly.
   ========================================== */
export function RateBenchmarkVisual() {
  const isReduced = usePrefersReducedMotion();

  return (
    <div className="w-full h-full flex flex-col justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm font-sans text-xs">
      <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200 mb-2">
        <TrendingUp className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
        <span>Market Rate Index</span>
      </div>

      <div className="flex-1 flex flex-col justify-center space-y-4 py-2">
        {/* Horizontal bar index */}
        <div className="relative pt-2">
          {/* Main Track */}
          <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full" />

          {/* Highlight Range */}
          <div className="absolute top-2 left-[25%] right-[25%] h-1.5 bg-blue-100 dark:bg-blue-950/40 rounded-full" />

          {/* Markers */}
          <div className="absolute top-1 left-[10%] w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-700" title="Min" />
          <div className="absolute top-1 left-[85%] w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-700" title="Max" />

          {/* Highlight Median Bubble */}
          <div
            className={`absolute top-0.5 left-[50%] -ml-2 w-4 h-4 rounded-full bg-blue-600 dark:bg-blue-500 border-2 border-white dark:border-slate-900 shadow ${
              isReduced ? "" : "animate-pulse"
            }`}
            title="Median"
          />
        </div>

        {/* Pricing tag values */}
        <div className="flex justify-between items-center text-[10px] text-slate-500 dark:text-slate-400 font-mono">
          <span>Min: $45</span>
          <span className="font-bold text-blue-600 dark:text-blue-400">Median: $85</span>
          <span>Max: $150</span>
        </div>
      </div>
    </div>
  );
}
