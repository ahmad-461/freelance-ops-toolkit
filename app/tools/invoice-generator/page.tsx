import React from "react";
import { Metadata } from "next";
import InvoiceGeneratorClient from "./InvoiceGeneratorClient";

export const metadata: Metadata = {
  title: "Free Invoice Generator for Freelancers | Freelance Ops",
  description: "Create professional, branded PDF invoices instantly. Free invoice maker with no signup required. Customize client details, tax, and export.",
};

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Invoice Generator",
    "url": "https://freelance-ops-toolkit-6w1z.vercel.app/tools/invoice-generator",
    "description": "Create professional, branded PDF invoices instantly. Free invoice maker with no signup required. Customize client details, tax, and export.",
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
      <InvoiceGeneratorClient />
    </>
  );
}
