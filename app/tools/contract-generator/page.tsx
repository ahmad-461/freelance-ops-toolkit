import { getWebApplicationJsonLd } from "@/lib/schema-utils";
import React from "react";
import { Metadata } from "next";
import ContractGeneratorClient from "./ContractGeneratorClient";

export const metadata: Metadata = {
  title: "Free Freelance Contract Template Builder | Freelance Ops",
  description: "Draft standard client contracts and independent contractor agreements in US or UK jurisdiction. Free freelance contract generator with clean PDF exports.",
};

export default function Page() {
  const jsonLd = getWebApplicationJsonLd(
    "Contract Template Builder",
    "https://freelance-ops-toolkit-6w1z.vercel.app/tools/contract-generator",
    "Draft standard client contracts and independent contractor agreements in US or UK jurisdiction. Free freelance contract generator with clean PDF exports."
  );

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
