"use client";

import React from "react";
import Link from "next/link";
import { Shield, ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/60 dark:border-gray-800/60 p-6 sm:p-10 shadow-sm">

        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {/* Header */}
        <div className="flex items-center gap-3 border-b border-gray-100 dark:border-gray-850 pb-6 mb-8">
          <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
              Privacy Policy
            </h1>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              Last Reviewed: July 2026
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6 text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed font-sans">
          <p>
            Welcome to Freelance Ops Toolkit. We are committed to protecting your privacy. This policy explains how we handle your information across our website and tools.
          </p>

          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mt-8">
            1. 100% Stateless & Client-Side Design
          </h2>
          <p>
            Every single one of the 15 tools in the Freelance Ops Toolkit (such as the Invoice Generator, Proposal Generator, Contract Builder, NDA Generator, and calculators) is completely stateless and runs entirely inside your browser. All input data, logo uploads, financial amounts, and PDF formatting occur 100% locally inside your web browser (client-side) using React state, <code>sessionStorage</code>, and <code>localStorage</code>.
          </p>
          <p>
            We do not transmit, process, or store your client details, financial amounts, or generated agreements on our servers. When you close or refresh your browser tab, this data is permanently cleared from your device&apos;s memory.
          </p>

          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mt-8">
            2. Fully Local Storage & No Database Persistence
          </h2>
          <p>
            We have completely decoupled this platform from all external cloud databases, magic links, user accounts, and sign-ups.
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Time Tracker:</strong> Runs entirely in stateless local session mode. Your entries are stored strictly inside your browser&apos;s <code>sessionStorage</code> and are cleared once your browser session ends.
            </li>
            <li>
              <strong>Project Scope Estimator:</strong> Functions purely as a stateless client-side calculator without any server connection or saved data constraints.
            </li>
            <li>
              <strong>Image/Logo Uploads:</strong> Client logo uploads (such as in the Invoice Generator or Case Study Builder) are instantly converted into Base64 data URLs in client-side memory to avoid remote hosting or cross-origin issues during HTML-to-PDF compilation.
            </li>
          </ul>

          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mt-8">
            3. No Third-Party Tracking, Cookies, or Ads
          </h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>We do not sell, rent, or trade your personal information, client records, or document content to any third parties.</li>
            <li>We do not use advertising networks, behavioral marketing cookies, or tracking pixels on this platform.</li>
            <li>
              <strong>Local Storage Usage:</strong> We utilize <code>localStorage</code> solely to remember your chosen visual theme (dark or light mode) for your next visit, as well as to keep a private, local log of your 5 most recently visited tool paths to support the homepage&apos;s dynamic &ldquo;Continue Where You Left Off&rdquo; section (which can be cleared at any time directly from the homepage UI).
            </li>
          </ul>

          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mt-8">
            4. Secured Serverless AI Processing
          </h2>
          <p>
            For tools that utilize AI template drafting (the Meeting Recap Generator and Payment Reminder Generator), your prompt inputs are transmitted securely via SSL encryption to Google&apos;s Gemini API (specifically the <code>gemini-2.5-flash</code> model) called through a server-side Next.js route. No API keys are exposed to the browser, and neither our servers nor Google&apos;s APIs retain, train on, or store your transmitted prompt details.
          </p>

          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mt-8">
            5. Inquiries & Support
          </h2>
          <p>
            Since we store absolutely zero database records, we cannot access, retrieve, or audit any of your generated agreements or tracked sessions. For general support inquiries or feedback, you can contact Muhammad Ahmad Khan directly at{" "}
            <span className="font-semibold text-gray-900 dark:text-white select-all">ahmadkhanzada618@gmail.com</span>.
          </p>
        </div>

      </div>
    </div>
  );
}
