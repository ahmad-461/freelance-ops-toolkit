import { getWebApplicationJsonLd } from "@/lib/schema-utils";
import React from "react";
import { Metadata } from "next";
import CurrencyConverterClient from "./CurrencyConverterClient";

export const metadata: Metadata = {
  title: "Freelance Currency Converter for Payments | Freelance Ops",
  description: "Convert client payment currencies instantly with our freelance currency converter. Calculate global project fees using live, cached exchange rates.",
};

export default function Page() {
  const jsonLd = getWebApplicationJsonLd(
    "Currency Converter",
    "https://freelance-ops-toolkit-6w1z.vercel.app/tools/currency-converter",
    "Convert client payment currencies instantly with our freelance currency converter. Calculate global project fees using live, cached exchange rates."
  );

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
