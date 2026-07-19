import React from "react";
import { Metadata } from "next";
import CaseStudyBuilderClient from "./CaseStudyBuilderClient";

export const metadata: Metadata = {
  title: "Free Freelance Case Study Template Builder | Freelance Ops",
  description: "Generate structured, professional client project case studies. Highlight key metrics, upload deliverables, and render print-ready PDFs instantly.",
};

export default function Page() {
  return <CaseStudyBuilderClient />;
}
