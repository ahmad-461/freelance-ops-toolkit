import { getWebApplicationJsonLd } from "@/lib/schema-utils";
import React from "react";
import { Metadata } from "next";
import ScopeEstimatorClient from "./ScopeEstimatorClient";

export const metadata: Metadata = {
  title: "Freelance Project Scope Estimator Tool | Freelance Ops",
  description: "Estimate precise hour ranges and client-ready project timelines mapped to deliverable complexity rules. Prevent scope creep with clear, fast planning.",
};

export default function Page() {
  const jsonLd = getWebApplicationJsonLd(
    "Project Scope Estimator",
    "https://freelance-ops-toolkit-6w1z.vercel.app/tools/scope-estimator",
    "Estimate precise hour ranges and client-ready project timelines mapped to deliverable complexity rules. Prevent scope creep with clear, fast planning."
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ScopeEstimatorClient />
    </>
  );
}
