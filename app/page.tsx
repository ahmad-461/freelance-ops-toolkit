import React from "react";
import { Metadata } from "next";
import HomeClient from "./HomeClient";

export const metadata: Metadata = {
  title: "Free Freelance Operations & Management Tools | Freelance Ops",
  description: "Optimize your freelance client operations with 15 free, privacy-first tools. Access professional invoice, proposal, and contract generators with no signup.",
};

export default function Page() {
  return <HomeClient />;
}
