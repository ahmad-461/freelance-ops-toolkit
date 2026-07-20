import React from "react";
import { Metadata } from "next";
import CaseStudyBuilderClient from "./CaseStudyBuilderClient";

export const metadata: Metadata = {
  title: "Free Freelance Case Study Template Builder | Freelance Ops",
  description: "Generate structured, professional client project case studies. Highlight key metrics, upload deliverables, and render print-ready PDFs instantly.",
};

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Portfolio Case Study Builder",
    "url": "https://freelance-ops-toolkit-6w1z.vercel.app/tools/case-study-builder",
    "description": "Generate structured, professional client project case studies. Highlight key metrics, upload deliverables, and render print-ready PDFs instantly.",
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
      <CaseStudyBuilderClient />
    </>
  );
}
