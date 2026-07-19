import React from "react";
import { Metadata } from "next";
import RateBenchmarkClient from "./RateBenchmarkClient";

export const metadata: Metadata = {
  title: "Freelance Rate Benchmarks by Industry 2026 | Freelance Ops",
  description: "Compare global freelance hourly rate ranges across experience levels, categories, and regional markets. Discover average freelance hourly rates in 2026.",
};

export default function Page() {
  return <RateBenchmarkClient />;
}
