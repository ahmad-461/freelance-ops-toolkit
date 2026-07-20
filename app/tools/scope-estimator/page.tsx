import React from "react";
import { Metadata } from "next";
import ScopeEstimatorClient from "./ScopeEstimatorClient";

export const metadata: Metadata = {
  title: "Freelance Project Scope Estimator Tool | Freelance Ops",
  description: "Estimate precise hour ranges and client-ready project timelines mapped to deliverable complexity rules. Prevent scope creep with clear, fast planning.",
};

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Project Scope Estimator",
    "url": "https://freelance-ops-toolkit-6w1z.vercel.app/tools/scope-estimator",
    "description": "Estimate precise hour ranges and client-ready project timelines mapped to deliverable complexity rules. Prevent scope creep with clear, fast planning.",
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
      <ScopeEstimatorClient />
    </>
  );
}
