import { getWebApplicationJsonLd } from "@/lib/schema-utils";
import React from "react";
import { Metadata } from "next";
import CaseStudyBuilderClient from "./CaseStudyBuilderClient";

export const metadata: Metadata = {
  title: "Free Freelance Case Study Template Builder | Freelance Ops",
  description: "Generate structured, professional client project case studies. Highlight key metrics, upload deliverables, and render print-ready PDFs instantly.",
};

export default function Page() {
  const jsonLd = getWebApplicationJsonLd(
    "Portfolio Case Study Builder",
    "https://freelance-ops-toolkit-6w1z.vercel.app/tools/case-study-builder",
    "Generate structured, professional client project case studies. Highlight key metrics, upload deliverables, and render print-ready PDFs instantly."
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CaseStudyBuilderClient />
    </>
  );
}
