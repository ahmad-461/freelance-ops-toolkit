import React from "react";
import { Metadata } from "next";
import HomeClient from "./HomeClient";

export const metadata: Metadata = {
  title: "Free Freelance Operations & Management Tools | Freelance Ops",
  description: "Optimize your freelance client operations with 15 free, privacy-first tools. Access professional invoice, proposal, and contract generators with no signup.",
};

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Freelance Ops Toolkit",
    "url": "https://freelance-ops-toolkit-6w1z.vercel.app",
    "description": "Optimize your freelance client operations with 15 free, privacy-first tools. Access professional invoice, proposal, and contract generators with no signup.",
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
      <HomeClient />
    </>
  );
}
