"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Info, ArrowLeft, ChevronDown, ChevronUp, HelpCircle, Code } from "lucide-react";

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
      answer: "No, you do not need an account. Every single one of the 15 tools in the Freelance Ops Toolkit operates 100% locally and is completely stateless. We have completely removed all login screens, database requirements, and user accounts so that you can use the toolkit with zero friction.",
    },
    {
      question: "Is my data safe?",
      answer: "Absolutely. All tools run entirely offline inside your browser's local state. Your input data, generated agreements, and uploaded logos are processed in client-side memory and are never uploaded, transmitted, or stored on any server. Once you close or refresh your tab, the data is instantly cleared.",
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

            <div className="border-t border-gray-150 dark:border-gray-800/80 pt-8 mt-10">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="p-4 rounded-xl bg-blue-50/50 dark:bg-blue-900/10 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30 flex-shrink-0">
                  <Code className="w-8 h-8" />
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Meet the Developer
                  </h3>
                  <p className="text-gray-650 dark:text-gray-300">
                    Hi! I&apos;m <strong>Muhammad Ahmad Khan</strong>, a student developer building Freelance Ops Toolkit as a genuine personal portfolio and open-source project. This toolkit represents an honest, phase-by-phase engineering journey, reflecting my dedication to building high-integrity, practical web software.
                  </p>
                  <p className="text-gray-650 dark:text-gray-300">
                    Rather than a corporate-backed entity, this suite was built from the ground up over <strong>7 planned development phases</strong>. Iteratively designed and refined alongside Jules, my AI software development partner, the project serves as a real-world playground for solving technical and user-experience challenges:
                  </p>
                  <ul className="list-disc pl-5 space-y-2 text-sm text-gray-650 dark:text-gray-300">
                    <li>
                      <strong>PDF Export Pipeline Optimization:</strong> We designed a custom hidden print-optimized wrapper for A4-width rendering. This resolved a tricky color-rendering issue with modern CSS functions (like <code>oklch()</code> and <code>lab()</code>) breaking <code>html2canvas</code> by restricting the PDF rendering pipeline to standard stable hexadecimal and RGB color tokens.
                    </li>
                    <li>
                      <strong>API Model Migration:</strong> Successfully migrated serverless generative pipelines away from deprecated models to a modern, pinned <code>gemini-2.5-flash</code> configuration to guarantee robust, predictable AI template suggestions for payment reminders and meeting recaps.
                    </li>
                    <li>
                      <strong>Transition to Local-First Autonomy:</strong> In our commitment to total user privacy, we decommissioned all Supabase persistent databases, magic links, user sign-ins, and account restrictions. Every single tool was re-engineered to run entirely client-side, making the toolkit 100% serverless, stateless, and safe.
                    </li>
                  </ul>
                  <p className="text-gray-650 dark:text-gray-300">
                    No fabricated credentials, fake reviews, or corporate fluff—just clean code, privacy-first architecture, and genuine utility designed to simplify independent operations. You can verify my work or connect with me via my official profiles below:
                  </p>

                  <div className="flex flex-wrap gap-4 pt-2">
                    <a
                      href="https://github.com/ahmad-461"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-2.5 text-sm font-semibold transition-all"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                      </svg>
                      GitHub Profile
                    </a>
                    <a
                      href="https://www.linkedin.com/in/ahmad-khan-77441833a"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 text-sm font-semibold transition-all shadow-md shadow-blue-500/10"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                      </svg>
                      LinkedIn Profile
                    </a>
                  </div>
                </div>
              </div>
            </div>
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
