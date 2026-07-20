import React from "react";
import { Metadata } from "next";
import ContractGeneratorClient from "./ContractGeneratorClient";

export const metadata: Metadata = {
  title: "Free Freelance Contract Template Builder | Freelance Ops",
  description: "Draft standard client contracts and independent contractor agreements in US or UK jurisdiction. Free freelance contract generator with clean PDF exports.",
};

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Contract Template Builder",
    "url": "https://freelance-ops-toolkit-6w1z.vercel.app/tools/contract-generator",
    "description": "Draft standard client contracts and independent contractor agreements in US or UK jurisdiction. Free freelance contract generator with clean PDF exports.",
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
      <ContractGeneratorClient />
    </>
  );
}
