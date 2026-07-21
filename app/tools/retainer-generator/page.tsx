import { getWebApplicationJsonLd } from "@/lib/schema-utils";
import React from "react";
import { Metadata } from "next";
import RetainerGeneratorClient from "./RetainerGeneratorClient";

export const metadata: Metadata = {
  title: "Monthly Freelance Retainer Agreement Generator | Freelance Ops",
  description: "Draft standard retainer agreements and ongoing freelance contracts. Secure recurring monthly revenue and define hourly overage terms easily.",
};

export default function Page() {
  const jsonLd = getWebApplicationJsonLd(
    "Retainer Agreement Generator",
    "https://freelance-ops-toolkit-6w1z.vercel.app/tools/retainer-generator",
    "Draft standard retainer agreements and ongoing freelance contracts. Secure recurring monthly revenue and define hourly overage terms easily."
  );

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
