import { getWebApplicationJsonLd } from "@/lib/schema-utils";
import React from "react";
import { Metadata } from "next";
import RateCalculatorClient from "./RateCalculatorClient";

export const metadata: Metadata = {
  title: "Freelance Hourly Rate Calculator by Income | Freelance Ops",
  description: "Calculate your ideal suggested freelance hourly rate and project-based pricing target. Factor in your desired income, weeks off, and business expenses.",
};

export default function Page() {
  const jsonLd = getWebApplicationJsonLd(
    "Rate Calculator",
    "https://freelance-ops-toolkit-6w1z.vercel.app/tools/rate-calculator",
    "Calculate your ideal suggested freelance hourly rate and project-based pricing target. Factor in your desired income, weeks off, and business expenses."
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <RateCalculatorClient />
    </>
  );
}
