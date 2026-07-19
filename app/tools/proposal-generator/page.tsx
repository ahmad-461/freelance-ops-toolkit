import React from "react";
import { Metadata } from "next";
import ProposalGeneratorClient from "./ProposalGeneratorClient";

export const metadata: Metadata = {
  title: "Free Proposal Generator for Freelancers | Freelance Ops",
  description: "Draft modern, professional client proposals with deliverables, timelines, and milestones. Free proposal maker with high-fidelity PDF output.",
};

export default function Page() {
  return <ProposalGeneratorClient />;
}
