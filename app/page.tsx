import React from "react";
import Link from "next/link";
import {
  FileText,
  ArrowRight,
  Shield,
  Zap,
  Sparkles,
  CheckCircle,
  FileSignature,
  HelpCircle,
  Calculator,
  RefreshCw,
  CalendarClock,
  ClipboardList,
  Briefcase,
  Clock,
  Layers,
  TrendingUp,
} from "lucide-react";

export default function Home() {
  const categorizedTools = [
    {
      categoryName: "Billing & Financial",
      badge: "Billing",
      tools: [
        {
          title: "Invoice Generator",
          description: "Create, customize, and export professional PDF invoices for clients in seconds. Supporting logos, custom currencies, and auto-tax calculation.",
          href: "/tools/invoice-generator",
          icon: FileText,
          badge: "v1.0 - Live",
        },
        {
          title: "Rate Calculator",
          description: "Determine your ideal hourly rate based on desired income, expenses, and billable hours, and convert it to project-based pricing.",
          href: "/tools/rate-calculator",
          icon: Calculator,
          badge: "v2.0 - Live",
        },
        {
          title: "Currency Converter",
          description: "Convert international project fees and currency values using live exchange rates with caching support.",
          href: "/tools/currency-converter",
          icon: RefreshCw,
          badge: "v2.0 - Live",
        },
        {
          title: "Late Payment Fee Calculator",
          description: "Calculate exact days overdue, months overdue, prorated monthly late fees, and new total invoice balance owed.",
          href: "/tools/late-payment-fee-calculator",
          icon: CalendarClock,
          badge: "v2.0 - Live",
        },
      ],
    },
    {
      categoryName: "Agreements & Legal",
      badge: "Agreements",
      tools: [
        {
          title: "Proposal Generator",
          description: "Create professional proposals and quotes with breakdown of deliverables, timeline, and investment.",
          href: "/tools/proposal-generator",
          icon: Sparkles,
          badge: "v3.0 - Live",
        },
        {
          title: "Contract Template Builder",
          description: "Draft legally binding, standard contracts and agreements for freelance projects.",
          href: "/tools/contract-generator",
          icon: FileSignature,
          badge: "v3.0 - Live",
        },
        {
          title: "NDA Generator",
          description: "Create custom Non-Disclosure Agreements to protect your intellectual property and business info.",
          href: "/tools/nda-generator",
          icon: Shield,
          badge: "v3.0 - Live",
        },
        {
          title: "Retainer Agreement Generator",
          description: "Set up ongoing monthly retainer agreements to guarantee monthly income and reserve your bandwidth.",
          href: "/tools/retainer-generator",
          icon: CalendarClock,
          badge: "v3.0 - Live",
        },
      ],
    },
    {
      categoryName: "Client Assets & Onboarding",
      badge: "Client Assets",
      tools: [
        {
          title: "Client Intake Form Builder",
          description: "Draft tailored client intake questionnaires with editable questions, custom category structure, dynamic inline validation, copy-to-clipboard, and clean PDF export.",
          href: "/tools/client-intake-form",
          icon: ClipboardList,
          badge: "v4.0 - Live",
        },
        {
          title: "Portfolio Case Study Builder",
          description: "Generate structured, professional case studies complete with client details, metrics/results, testimonials, and client-side image uploads.",
          href: "/tools/case-study-builder",
          icon: Briefcase,
          badge: "v4.0 - Live",
        },
      ],
    },
    {
      categoryName: "AI Communication",
      badge: "AI Communication",
      tools: [
        {
          title: "Payment Reminder Generator",
          description: "Draft perfectly tuned, professional email reminders for past-due client invoices using smart AI guidance.",
          href: "/tools/payment-reminder-generator",
          icon: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>,
          badge: "v5.0 - Live",
        },
        {
          title: "Meeting Recap Generator",
          description: "Turn your rough bullet points or raw meeting notes into a beautifully polished email summary complete with clear, actionable items.",
          href: "/tools/meeting-recap-generator",
          icon: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M2 6h4"/><path d="M2 10h4"/><path d="M2 14h4"/><path d="M2 18h4"/><rect width="12" height="18" x="10" y="3" rx="2"/></svg>,
          badge: "v5.0 - Live",
        },
      ],
    },
    {
      categoryName: "Planning & Tracking",
      badge: "Account Tools",
      tools: [
        {
          title: "Time Tracker",
          description: "Log hours, track live sessions, and instantly prefill your invoices. Cloud sync allows you to manage entries anywhere. (Free account required to save)",
          href: "/tools/time-tracker",
          icon: Clock,
          badge: "v6.0 - Live",
        },
        {
          title: "Project Scope Estimator",
          description: "Estimate hour ranges and project timelines by deliverability complexity. Perform one-off calculations or save results. (Free account required to save)",
          href: "/tools/scope-estimator",
          icon: Layers,
          badge: "v6.0 - Live",
        },
      ],
    },
    {
      categoryName: "Reference & Market Data",
      badge: "Reference",
      tools: [
        {
          title: "Rate Benchmark Tool",
          description: "Compare freelance hourly rates across common professional categories, experience levels, and global regions to price confidently.",
          href: "/tools/rate-benchmark",
          icon: TrendingUp,
          badge: "v1.0 - Live",
        },
      ],
    },
  ];

  const features = [
    {
      title: "100% Client-Side & Private",
      description: "Your business and client data never touches our servers. All processing and calculations happen directly inside your browser.",
      icon: Shield,
    },
    {
      title: "Instant PDF Export",
      description: "Generate highly professional, print-optimized A4 format PDFs instantly without dynamic rendering artifacts.",
      icon: Zap,
    },
    {
      title: "No Account Required",
      description: "Skip the signup and registration. Get straight to work generating assets for your client operations immediately.",
      icon: CheckCircle,
    },
  ];

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen transition-colors duration-200">

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 sm:pt-24 sm:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 dark:bg-blue-900/40 px-3 py-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 mb-6">
            <Sparkles className="w-4 h-4 animate-pulse" /> Complete Toolkit - All 15 Tools Live
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight">
            The Ultimate Toolkit for <br />
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
              Smart Freelance Operations
            </span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg sm:text-xl text-gray-500 dark:text-gray-400">
            A privacy-first, ultra-fast suite of professional client management tools designed to streamline your business workflows. Zero logins, infinite capability.
          </p>
          <div id="hero-cta" className="mt-10 flex flex-wrap justify-center gap-4">
            <a
              href="#tools-section"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3.5 shadow-md shadow-blue-500/10 transition-all hover:scale-[1.01]"
            >
              Browse All Tools
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Background Decorative Blur */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none opacity-40 dark:opacity-20">
          <div className="absolute top-12 left-10 w-72 h-72 rounded-full bg-blue-400 blur-[120px]" />
          <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-indigo-400 blur-[150px]" />
        </div>
      </section>

      {/* Core Features */}
      <section className="py-12 border-y border-gray-200/60 dark:border-gray-800/60 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feat) => {
              const Icon = feat.icon;
              return (
                <div key={feat.title} className="flex gap-4 p-4 rounded-xl">
                  <div className="flex-shrink-0 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 h-12 w-12 flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{feat.title}</h3>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                      {feat.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section id="tools-section" className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center md:text-left mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">Explore our Suite of 15 Tools</h2>
            <p className="mt-3 text-lg text-gray-500 dark:text-gray-400">
              Start operations immediately with our complete, production-ready operational tools.
            </p>
          </div>

          <div className="space-y-16">
            {categorizedTools.map((category) => (
              <div key={category.categoryName} className="space-y-6">
                <div className="flex items-center gap-3 border-b border-gray-200 dark:border-gray-800 pb-3">
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400">
                    {category.badge}
                  </span>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {category.categoryName}
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {category.tools.map((tool) => {
                    const Icon = tool.icon;
                    return (
                      <div
                        key={tool.title}
                        className="group relative rounded-2xl border border-blue-100 dark:border-blue-900/30 bg-gradient-to-br from-white to-blue-50/10 dark:from-gray-900 dark:to-blue-950/10 p-8 shadow-sm hover:shadow-md hover:border-blue-300 dark:hover:border-blue-800 transition-all flex flex-col justify-between"
                      >
                        <div>
                          <div className="absolute top-6 right-6 inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-900/50 px-2.5 py-0.5 text-xs font-semibold text-blue-600 dark:text-blue-400">
                            {tool.badge}
                          </div>
                          <div className="p-3 rounded-xl bg-blue-500 text-white w-12 h-12 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
                            <Icon className="w-6 h-6" />
                          </div>
                          <h4 className="text-xl font-bold text-gray-900 dark:text-white mt-6">
                            {tool.title}
                          </h4>
                          <p className="text-gray-500 dark:text-gray-400 mt-3 text-sm leading-relaxed">
                            {tool.description}
                          </p>
                        </div>
                        <div className="mt-6 pt-4 border-t border-gray-100/60 dark:border-gray-800/60">
                          <Link
                            href={tool.href}
                            className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors"
                          >
                            Open Tool
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security & FAQ Info Section */}
      <section className="py-16 bg-gray-100/50 dark:bg-gray-900/40 border-t border-gray-200/50 dark:border-gray-800/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-2">
              <HelpCircle className="w-6 h-6 text-blue-500" />
              Frequently Asked Questions
            </h2>
          </div>
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200/50 dark:border-gray-800/50">
              <h4 className="font-bold text-gray-900 dark:text-white">Are my invoices stored on any server?</h4>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                No. All invoice operations, calculations, state, and PDF compilation are executed 100% on your local machine using React state. Once you refresh or leave the page, the data is completely cleared unless cloud-synced using our Time Tracker operations.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200/50 dark:border-gray-800/50">
              <h4 className="font-bold text-gray-900 dark:text-white">Why does the generated PDF look perfectly formatted compared to screenshots?</h4>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                We render the PDF inside an A4 fixed layout (794px width) offset from the viewport, avoiding viewport/device responsive scaling issues. This ensures the output is always professional, perfectly aligned, and consistent.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
