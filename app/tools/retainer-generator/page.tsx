import React from "react";
import { Metadata } from "next";
import RetainerGeneratorClient from "./RetainerGeneratorClient";

export const metadata: Metadata = {
  title: "Monthly Freelance Retainer Agreement Generator | Freelance Ops",
  description: "Draft standard retainer agreements and ongoing freelance contracts. Secure recurring monthly revenue and define hourly overage terms easily.",
};

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Retainer Agreement Generator",
    "url": "https://freelance-ops-toolkit-6w1z.vercel.app/tools/retainer-generator",
    "description": "Draft standard retainer agreements and ongoing freelance contracts. Secure recurring monthly revenue and define hourly overage terms easily.",
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
      <RetainerGeneratorClient />
    </>
  );
}
