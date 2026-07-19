import React from "react";
import { Metadata } from "next";
import RetainerGeneratorClient from "./RetainerGeneratorClient";

export const metadata: Metadata = {
  title: "Monthly Freelance Retainer Agreement Generator | Freelance Ops",
  description: "Draft standard retainer agreements and ongoing freelance contracts. Secure recurring monthly revenue and define hourly overage terms easily.",
};

export default function Page() {
  return <RetainerGeneratorClient />;
}
