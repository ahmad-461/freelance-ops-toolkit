import React from "react";
import { Metadata } from "next";
import ContractGeneratorClient from "./ContractGeneratorClient";

export const metadata: Metadata = {
  title: "Free Freelance Contract Template Builder | Freelance Ops",
  description: "Draft standard client contracts and independent contractor agreements in US or UK jurisdiction. Free freelance contract generator with clean PDF exports.",
};

export default function Page() {
  return <ContractGeneratorClient />;
}
