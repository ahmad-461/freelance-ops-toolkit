"use client";

import React from "react";
import Link from "next/link";
import { Mail, ArrowLeft, HelpCircle } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/60 dark:border-gray-800/60 p-6 sm:p-10 shadow-sm">

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
            <Mail className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
              Contact Us
            </h1>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              Have feedback, found a bug, or have a suggestion? Reach out.
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-8 font-sans">
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
            Freelance Ops Toolkit is built entirely for freelancers to streamline operational tasks. If you have run into an error, want to request a new tool, or have feedback, please reach out to us. We’d love to hear from you.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {/* Email Contact (mailto: button) */}
            <div className="p-5 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/30 flex flex-col justify-between space-y-4">
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white text-sm sm:text-base">
                  Email Support
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Reach out directly for general feedback or custom requests.
                </p>
              </div>
              <a
                href="mailto:YOUR_EMAIL@example.com?subject=Freelance%20Ops%20Toolkit%20Feedback"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-4 py-2.5 transition-all text-center"
              >
                <Mail className="w-4 h-4" />
                Send Email
              </a>
            </div>

            {/* GitHub Issues */}
            <div className="p-5 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/30 flex flex-col justify-between space-y-4">
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white text-sm sm:text-base">
                  Report an Issue
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Encountered a bug or want to suggest code changes? Open an issue on GitHub.
                </p>
              </div>
              <a
                href="https://github.com/ahmad-461/freelance-ops-toolkit/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 font-semibold text-sm px-4 py-2.5 transition-all text-center"
              >
                {/* SVG for GitHub icon to avoid lucide-react import issues with newer versions */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4"
                >
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                  <path d="M9 18c-4.51 2-5-2-7-2" />
                </svg>
                Submit Issue
              </a>
            </div>

          </div>

          <div className="p-4 rounded-xl bg-blue-50/40 dark:bg-blue-900/10 text-xs text-blue-600 dark:text-blue-400 leading-relaxed border border-blue-100/50 dark:border-blue-900/20 flex gap-2 items-start">
            <HelpCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>
              <strong>Note on Privacy:</strong> Emails sent to the address above are only processed to handle your request. No contact emails or user lists are harvested, shared, or compiled for marketing operations.
            </span>
          </div>

        </div>

      </div>
    </div>
  );
}
