import React from "react";
import Link from "next/link";
import { Briefcase } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-gray-500 dark:text-gray-400">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">

          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span className="font-semibold text-gray-900 dark:text-gray-100">
              Freelance Ops Toolkit
            </span>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Home
            </Link>
            <Link href="/tools/invoice-generator" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Invoice Generator
            </Link>
          </div>

          <div className="text-sm">
            &copy; {currentYear} Freelance Ops Toolkit. Built for Freelancers.
          </div>

        </div>
      </div>
    </footer>
  );
}
