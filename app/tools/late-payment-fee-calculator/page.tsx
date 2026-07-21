import { getWebApplicationJsonLd } from "@/lib/schema-utils";
import React from "react";
import { Metadata } from "next";
import LatePaymentFeeCalculatorClient from "./LatePaymentFeeCalculatorClient";

export const metadata: Metadata = {
  title: "Overdue Invoice Late Payment Fee Calculator | Freelance Ops",
  description: "Calculate days overdue, prorated monthly late fees, and new total invoice balance owed. Protect your freelance cash flow with clear calculations.",
};

export default function Page() {
  const jsonLd = getWebApplicationJsonLd(
    "Late Payment Fee Calculator",
    "https://freelance-ops-toolkit-6w1z.vercel.app/tools/late-payment-fee-calculator",
    "Calculate days overdue, prorated monthly late fees, and new total invoice balance owed. Protect your freelance cash flow with clear calculations."
  );

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
