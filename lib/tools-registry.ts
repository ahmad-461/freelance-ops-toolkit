import React from "react";
import {
  FileText,
  Calculator,
  RefreshCw,
  CalendarClock,
  Sparkles,
  FileSignature,
  Shield,
  ClipboardList,
  Briefcase,
  Clock,
  Layers,
  TrendingUp,
} from "lucide-react";

export interface ToolItem {
  slug: string;
  title: string;
  description: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  category: string;
}

export const toolsRegistry: ToolItem[] = [
  {
    slug: "invoice-generator",
    title: "Invoice Generator",
    description: "Create, customize, and export professional PDF invoices for clients in seconds. Supporting logos, custom currencies, and auto-tax calculation.",
    href: "/tools/invoice-generator",
    icon: FileText,
    badge: "v1.0 - Live",
    category: "Get Paid Faster",
  },
  {
    slug: "rate-calculator",
    title: "Rate Calculator",
    description: "Determine your ideal hourly rate based on desired income, expenses, and billable hours, and convert it to project-based pricing.",
    href: "/tools/rate-calculator",
    icon: Calculator,
    badge: "v2.0 - Live",
    category: "Get Paid Faster",
  },
  {
    slug: "currency-converter",
    title: "Currency Converter",
    description: "Convert international project fees and currency values using live exchange rates with caching support.",
    href: "/tools/currency-converter",
    icon: RefreshCw,
    badge: "v2.0 - Live",
    category: "Get Paid Faster",
  },
  {
    slug: "late-payment-fee-calculator",
    title: "Late Payment Fee Calculator",
    description: "Calculate exact days overdue, months overdue, prorated monthly late fees, and new total invoice balance owed.",
    href: "/tools/late-payment-fee-calculator",
    icon: CalendarClock,
    badge: "v2.0 - Live",
    category: "Get Paid Faster",
  },
  {
    slug: "proposal-generator",
    title: "Proposal Generator",
    description: "Create professional proposals and quotes with breakdown of deliverables, timeline, and investment.",
    href: "/tools/proposal-generator",
    icon: Sparkles,
    badge: "v3.0 - Live",
    category: "Agreements & Contracts",
  },
  {
    slug: "contract-generator",
    title: "Contract Template Builder",
    description: "Draft professional, standard contracts and agreements for freelance projects.",
    href: "/tools/contract-generator",
    icon: FileSignature,
    badge: "v3.0 - Live",
    category: "Agreements & Contracts",
  },
  {
    slug: "nda-generator",
    title: "NDA Generator",
    description: "Create custom Non-Disclosure Agreements to protect your intellectual property and business info.",
    href: "/tools/nda-generator",
    icon: Shield,
    badge: "v3.0 - Live",
    category: "Agreements & Contracts",
  },
  {
    slug: "retainer-generator",
    title: "Retainer Agreement Generator",
    description: "Set up ongoing monthly retainer agreements to guarantee monthly income and reserve your bandwidth.",
    href: "/tools/retainer-generator",
    icon: CalendarClock,
    badge: "v3.0 - Live",
    category: "Agreements & Contracts",
  },
  {
    slug: "client-intake-form",
    title: "Client Intake Form Builder",
    description: "Draft tailored client intake questionnaires with editable questions, custom category structure, dynamic inline validation, copy-to-clipboard, and clean PDF export.",
    href: "/tools/client-intake-form",
    icon: ClipboardList,
    badge: "v4.0 - Live",
    category: "Win & Onboard Clients",
  },
  {
    slug: "case-study-builder",
    title: "Portfolio Case Study Builder",
    description: "Generate structured, professional case studies complete with client details, metrics/results, testimonials, and client-side image uploads.",
    href: "/tools/case-study-builder",
    icon: Briefcase,
    badge: "v4.0 - Live",
    category: "Win & Onboard Clients",
  },
  {
    slug: "payment-reminder-generator",
    title: "Payment Reminder Generator",
    description: "Draft perfectly tuned, professional email reminders for past-due client invoices using smart AI guidance.",
    href: "/tools/payment-reminder-generator",
    icon: () => React.createElement("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      width: "24",
      height: "24",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      className: "w-6 h-6"
    }, [
      React.createElement("rect", { key: "rect", width: "20", height: "16", x: "2", y: "4", rx: "2" }),
      React.createElement("path", { key: "path", d: "m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" })
    ]),
    badge: "v5.0 - Live",
    category: "AI-Assisted Communication",
  },
  {
    slug: "meeting-recap-generator",
    title: "Meeting Recap Generator",
    description: "Turn your rough bullet points or raw meeting notes into a beautifully polished email summary complete with clear, actionable items.",
    href: "/tools/meeting-recap-generator",
    icon: () => React.createElement("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      width: "24",
      height: "24",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      className: "w-6 h-6"
    }, [
      React.createElement("path", { key: "p1", d: "M2 6h4" }),
      React.createElement("path", { key: "p2", d: "M2 10h4" }),
      React.createElement("path", { key: "p3", d: "M2 14h4" }),
      React.createElement("path", { key: "p4", d: "M2 18h4" }),
      React.createElement("rect", { key: "rect", width: "12", height: "18", x: "10", y: "3", rx: "2" })
    ]),
    badge: "v5.0 - Live",
    category: "AI-Assisted Communication",
  },
  {
    slug: "time-tracker",
    title: "Time Tracker",
    description: "Log hours, track live sessions, and instantly prefill your invoices. Runs entirely in your browser — no account or signup required.",
    href: "/tools/time-tracker",
    icon: Clock,
    badge: "v6.0 - Live",
    category: "Track Time & Scope Projects",
  },
  {
    slug: "scope-estimator",
    title: "Project Scope Estimator",
    description: "Estimate precise hour ranges and project timelines based on deliverable complexity. Runs entirely in your browser — no account or signup required.",
    href: "/tools/scope-estimator",
    icon: Layers,
    badge: "v6.0 - Live",
    category: "Track Time & Scope Projects",
  },
  {
    slug: "rate-benchmark",
    title: "Rate Benchmark Tool",
    description: "Compare freelance hourly rates across common professional categories, experience levels, and global regions to price confidently.",
    href: "/tools/rate-benchmark",
    icon: TrendingUp,
    badge: "v1.0 - Live",
    category: "Price Your Work",
  },
];
