import React from "react";
import { Metadata } from "next";
import RateCalculatorClient from "./RateCalculatorClient";

export const metadata: Metadata = {
  title: "Freelance Hourly Rate Calculator by Income | Freelance Ops",
  description: "Calculate your ideal suggested freelance hourly rate and project-based pricing target. Factor in your desired income, weeks off, and business expenses.",
};

export default function Page() {
  return <RateCalculatorClient />;
}
