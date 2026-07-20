import React from "react";
import { Metadata } from "next";
import CurrencyConverterClient from "./CurrencyConverterClient";

export const metadata: Metadata = {
  title: "Freelance Currency Converter for Payments | Freelance Ops",
  description: "Convert client payment currencies instantly with our freelance currency converter. Calculate global project fees using live, cached exchange rates.",
};

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Currency Converter",
    "url": "https://freelance-ops-toolkit-6w1z.vercel.app/tools/currency-converter",
    "description": "Convert client payment currencies instantly with our freelance currency converter. Calculate global project fees using live, cached exchange rates.",
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
      <CurrencyConverterClient />
    </>
  );
}
