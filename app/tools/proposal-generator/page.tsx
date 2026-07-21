import { getWebApplicationJsonLd } from "@/lib/schema-utils";
import React from "react";
import { Metadata } from "next";
import ProposalGeneratorClient from "./ProposalGeneratorClient";

export const metadata: Metadata = {
  title: "Free Proposal Generator for Freelancers | Freelance Ops",
  description: "Draft modern, professional client proposals with deliverables, timelines, and milestones. Free proposal maker with high-fidelity PDF output.",
};

export default function Page() {
  const jsonLd = getWebApplicationJsonLd(
    "Proposal Generator",
    "https://freelance-ops-toolkit-6w1z.vercel.app/tools/proposal-generator",
    "Draft modern, professional client proposals with deliverables, timelines, and milestones. Free proposal maker with high-fidelity PDF output."
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProposalGeneratorClient />
    </>
  );
}
