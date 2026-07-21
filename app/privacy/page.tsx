"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Shield, ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
  const [currentYear, setCurrentYear] = useState<number | string>("");

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

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
              Last Updated: January {currentYear || "..."}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6 text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed font-sans">
          <p>
            Welcome to Freelance Ops Toolkit. We are committed to protecting your privacy. This policy explains how we handle your information across our website and tools.
          </p>

          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mt-8">
            1. Stateless & Client-Side Tools
          </h2>
          <p>
            The vast majority of the tools in the Freelance Ops Toolkit (such as the Invoice Generator, Proposal Generator, Contract Builder, NDA Generator, and calculators) are completely stateless. All input data, calculations, and PDF generation occur 100% inside your web browser (client-side). We do not transmit, process, or store your client details, financial amounts, or generated agreements on our servers. When you close or refresh your browser tab, this data is permanently cleared.
          </p>

          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mt-8">
            2. Account-Based Tools (Supabase Persistence)
          </h2>
          <p>
            A few of our advanced tools require persistent storage to be useful over time:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Time Tracker</strong>: Stores your logged hours, active tracking sessions, and project details.
            </li>
            <li>
              <strong>Project Scope Estimator</strong>: Allows you to save your scope estimates for later retrieval.
            </li>
          </ul>
          <p>
            To use these persistent features, you must sign up for a free account. These accounts and their associated data are powered and secured by <strong>Supabase</strong>. We store:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Your account email address (used solely for authentication and secure login).</li>
            <li>Your saved time entries and project scope configuration data.</li>
          </ul>
          <p>
            This data is kept private and is only accessible to you when you are signed in.
          </p>

          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mt-8">
            3. No Third-Party Tracking or Selling
          </h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>We do not sell, rent, or trade your personal information or account data to third parties.</li>
            <li>We do not use advertising trackers, marketing cookies, or third-party behavioral analytics on this website.</li>
          </ul>

          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mt-8">
            4. Data Deletion & Account Closure
          </h2>
          <p>
            If you have created an account and wish to delete it and remove all associated data, you have two options:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>You can trigger account deletion directly through your account dashboard, or</li>
            <li>
              You can request manual account and data deletion by sending an email to our contact address at{" "}
              <span className="font-semibold text-gray-900 dark:text-white select-all">ahmadkhanzada618@gmail.com</span>. Upon verification, we will permanently purge your account and all associated saved data from our database.
            </li>
          </ul>

          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mt-8">
            5. Browser Storage & Cookies
          </h2>
          <p>
            To enhance your experience, we use minimal local browser storage and secure cookies. Specifically:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Local Storage:</strong> We use <code>localStorage</code> solely to remember your theme preference (dark or light mode) so the site displays correctly on your next visit.
            </li>
            <li>
              <strong>Auth Cookies:</strong> For signed-in users, standard Supabase session and authentication cookies are stored to keep you securely logged in to your account.
            </li>
            <li>
              <strong>No Tracking:</strong> We do not use any marketing cookies, third-party analytics trackers, or advertising trackers of any kind on this website.
            </li>
          </ul>
        </div>

      </div>
    </div>
  );
}
