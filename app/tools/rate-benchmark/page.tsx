import React from "react";
import { Metadata } from "next";
import RateBenchmarkClient from "./RateBenchmarkClient";

export const metadata: Metadata = {
  title: "Freelance Rate Benchmarks by Industry 2026 | Freelance Ops",
  description: "Compare global freelance hourly rate ranges across experience levels, categories, and regional markets. Discover average freelance hourly rates in 2026.",
};

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Rate Benchmark Tool",
    "url": "https://freelance-ops-toolkit-6w1z.vercel.app/tools/rate-benchmark",
    "description": "Compare global freelance hourly rate ranges across experience levels, categories, and regional markets. Discover average freelance hourly rates in 2026.",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "All",
    "browserRequirements": "Requires HTML5 compatible browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "isAccessibleForFree": true
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <RateBenchmarkClient />
    </>
  );
}
