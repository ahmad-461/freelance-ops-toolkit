import React from "react";
import { Metadata } from "next";
import RateCalculatorClient from "./RateCalculatorClient";

export const metadata: Metadata = {
  title: "Freelance Hourly Rate Calculator by Income | Freelance Ops",
  description: "Calculate your ideal suggested freelance hourly rate and project-based pricing target. Factor in your desired income, weeks off, and business expenses.",
};

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Rate Calculator",
    "url": "https://freelance-ops-toolkit-6w1z.vercel.app/tools/rate-calculator",
    "description": "Calculate your ideal suggested freelance hourly rate and project-based pricing target. Factor in your desired income, weeks off, and business expenses.",
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
      <RateCalculatorClient />
    </>
  );
}
