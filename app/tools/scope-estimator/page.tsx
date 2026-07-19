import React from "react";
import { Metadata } from "next";
import ScopeEstimatorClient from "./ScopeEstimatorClient";

export const metadata: Metadata = {
  title: "Freelance Project Scope Estimator Tool | Freelance Ops",
  description: "Estimate precise hour ranges and client-ready project timelines mapped to deliverable complexity rules. Prevent scope creep with clear, fast planning.",
};

export default function Page() {
  return <ScopeEstimatorClient />;
}
