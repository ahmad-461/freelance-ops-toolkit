"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Info, ArrowLeft, ChevronDown, ChevronUp, HelpCircle } from "lucide-react";

export default function AboutPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      question: "Is this free?",
      answer: "Yes, Freelance Ops Toolkit is 100% free. There are no hidden fees, subscriptions, or premium tiers. The tools are made freely available to support the freelance community.",
    },
    {
      question: "Do I need an account?",
      answer: "Most tools do not require an account and operate entirely offline inside your browser. Account registration (which is free) is only required for tools that need cloud persistence, such as the Time Tracker and Project Scope Estimator.",
    },
    {
      question: "Is my data safe?",
      answer: "Absolutely. For stateless tools, your data is kept strictly inside your browser state and is never uploaded anywhere. For persistent tools, your data is securely stored with database-level security policies, ensuring only you have access to your saved records.",
    },
    {
      question: "Can I suggest a new tool?",
      answer: "We welcome all feedback and suggestions! Please head over to our Contact page to reach out via email or suggest ideas, report bugs, or submit feature proposals.",
    },
  ];

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-3xl mx-auto space-y-8">

        {/* Main Content Box */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/60 dark:border-gray-800/60 p-6 sm:p-10 shadow-sm">
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
              <Info className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
                About Freelance Ops Toolkit
              </h1>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                A solo-developer project built for independent professionals.
              </p>
            </div>
          </div>

          {/* Body Text */}
          <div className="space-y-6 text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed font-sans">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              The Ultimate Freelance Operations Toolkit
            </h2>
            <p>
              Freelance Ops Toolkit is an comprehensive collection of 15 free, lightweight, privacy-focused client-management and operation utilities. Designed specifically for freelancers, independent contractors, consultants, and solo-creatives, it packages the critical operational features usually gated behind expensive corporate platforms.
            </p>
            <p>
              Managing a freelance business is hard enough without having to pay heavy monthly subscription fees for basic operational necessities. Freelance Ops Toolkit provides an open-access, zero-login utility framework for the most common freelance workflows, guaranteeing that your information stays where it belongs—in your hands.
            </p>

            <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-8">
              A Free Alternative to Bonsai and HoneyBook
            </h3>
            <p>
              While platforms like Bonsai and HoneyBook offer extensive client management suites, their high monthly pricing tiers and gating of standard documents (like simple proposals, basic NDAs, and standard invoices) create a significant barrier for independent contractors starting out or looking to keep overhead low.
            </p>
            <p>
              We position Freelance Ops as a direct, free alternative to Bonsai HoneyBook for freelancers who need immediate, high-fidelity operations utilities without being forced into lock-in subscriptions, automatic billing, or complex corporate accounts. You can generate unlimited, professional, print-optimized A4 agreements and calculations in under 30 seconds.
            </p>

            <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-8">
              Built with a Privacy-First Engineering Philosophy
            </h3>
            <p>
              Your business deals, pricing calculations, and client details are highly confidential. Instead of tracking your activity or sending your data to remote corporate marketing engines, our toolkit runs entirely inside your own browser window.
            </p>
            <p>
              All inputs, logo uploads, and calculations are computed locally on your device, ensuring total security. Your data is never sold or used for marketing. For cloud-enabled tools where saving data is necessary, only your explicit permission is required, keeping your security and privacy fully intact.
            </p>

            <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-8">
              Empowering Independent Contractors Worldwide
            </h3>
            <p>
              Our ultimate goal is to remove administrative hurdles and help solo professionals present themselves with absolute credibility. By standardizing contracts, proposal layouts, invoicing, and timeline estimations, we enable you to run your client operations with the same professional rigor as large-scale agencies.
            </p>
            <p>
              Hi, I&apos;m Ahmad. I created this toolkit as a solo/portfolio project to help independent professionals scale their workflows securely. It is completely open-access, with no corporate board behind it—just code built to make client management seamless.
            </p>
          </div>
        </div>

        {/* FAQ Section */}
        <div id="faq" className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/60 dark:border-gray-800/60 p-6 sm:p-10 shadow-sm scroll-mt-24">
          <div className="flex items-center gap-2 mb-8 border-b border-gray-100 dark:border-gray-850 pb-4">
            <HelpCircle className="w-5 h-5 text-blue-500" />
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="border border-gray-100 dark:border-gray-800/80 rounded-xl overflow-hidden transition-all"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="flex items-center justify-between w-full px-5 py-4 text-left font-semibold text-sm sm:text-base text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <span>{faq.question}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-4 pt-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400 bg-gray-50/50 dark:bg-gray-900/30 leading-relaxed border-t border-gray-50 dark:border-gray-800/40">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
