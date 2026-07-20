import React from "react";
import { Metadata } from "next";
import LatePaymentFeeCalculatorClient from "./LatePaymentFeeCalculatorClient";

export const metadata: Metadata = {
  title: "Overdue Invoice Late Payment Fee Calculator | Freelance Ops",
  description: "Calculate days overdue, prorated monthly late fees, and new total invoice balance owed. Protect your freelance cash flow with clear calculations.",
};

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Late Payment Fee Calculator",
    "url": "https://freelance-ops-toolkit-6w1z.vercel.app/tools/late-payment-fee-calculator",
    "description": "Calculate days overdue, prorated monthly late fees, and new total invoice balance owed. Protect your freelance cash flow with clear calculations.",
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
      <LatePaymentFeeCalculatorClient />
    </>
  );
}
