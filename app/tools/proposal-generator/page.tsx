import React from "react";
import { Metadata } from "next";
import ProposalGeneratorClient from "./ProposalGeneratorClient";

export const metadata: Metadata = {
  title: "Free Proposal Generator for Freelancers | Freelance Ops",
  description: "Draft modern, professional client proposals with deliverables, timelines, and milestones. Free proposal maker with high-fidelity PDF output.",
};

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Proposal Generator",
    "url": "https://freelance-ops-toolkit-6w1z.vercel.app/tools/proposal-generator",
    "description": "Draft modern, professional client proposals with deliverables, timelines, and milestones. Free proposal maker with high-fidelity PDF output.",
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
      <ProposalGeneratorClient />
    </>
  );
}
