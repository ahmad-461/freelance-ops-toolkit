import React from "react";
import Link from "next/link";
import { FileText, ArrowRight, Shield, Zap, Sparkles, CheckCircle, FileSignature, HelpCircle, Calculator, RefreshCw, CalendarClock, ClipboardList, Briefcase } from "lucide-react";

export default function Home() {
  const activeTools = [
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
  ];

  const comingSoonTools: Array<{ title: string; description: string; icon: React.ComponentType<{ className?: string }> }> = [
    // Future placeholders can be placed here as needed
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
            <Sparkles className="w-4 h-4 animate-pulse" /> Phase 1: Operational Essentials
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
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/tools/invoice-generator"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3.5 shadow-md shadow-blue-500/10 transition-all hover:scale-[1.01]"
            >
              Try Invoice Generator
              <ArrowRight className="w-5 h-5" />
            </Link>
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
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center md:text-left mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Explore Toolkit Tools</h2>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              Start operations immediately with our live tools, or review what is coming in future phases.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Active Tools */}
            {activeTools.map((tool) => {
              const Icon = tool.icon;
              return (
                <div
                  key={tool.title}
                  className="group relative rounded-2xl border border-blue-100 dark:border-blue-900/30 bg-gradient-to-br from-white to-blue-50/10 dark:from-gray-900 dark:to-blue-950/10 p-8 shadow-sm hover:shadow-md hover:border-blue-300 dark:hover:border-blue-800 transition-all"
                >
                  <div className="absolute top-6 right-6 inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-900/50 px-2.5 py-0.5 text-xs font-semibold text-blue-600 dark:text-blue-400">
                    {tool.badge}
                  </div>
                  <div className="p-3 rounded-xl bg-blue-500 text-white w-12 h-12 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6">
                    {tool.title}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mt-3 text-sm leading-relaxed">
                    {tool.description}
                  </p>
                  <div className="mt-6">
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


            {/* Coming Soon Tools */}
            {comingSoonTools.map((tool) => {
              const Icon = tool.icon;
              return (
                <div
                  key={tool.title}
                  className="relative rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/40 dark:bg-gray-900/40 p-8 opacity-75"
                >
                  <div className="absolute top-6 right-6 inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-800 px-2.5 py-0.5 text-xs font-semibold text-gray-500 dark:text-gray-400">
                    Coming Soon
                  </div>
                  <div className="p-3 rounded-xl bg-gray-100 dark:bg-gray-850 text-gray-400 w-12 h-12 flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-400 dark:text-gray-500 mt-6">
                    {tool.title}
                  </h3>
                  <p className="text-gray-400 dark:text-gray-500 mt-3 text-sm leading-relaxed">
                    {tool.description}
                  </p>
                </div>
              );
            })}
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
                No. All invoice operations, calculations, state, and PDF compilation are executed 100% on your local machine using React state. Once you refresh or leave the page, the data is completely cleared.
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
