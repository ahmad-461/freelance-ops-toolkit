import React from "react";
import { Metadata } from "next";
import CurrencyConverterClient from "./CurrencyConverterClient";

export const metadata: Metadata = {
  title: "Freelance Currency Converter for Payments | Freelance Ops",
  description: "Convert client payment currencies instantly with our freelance currency converter. Calculate global project fees using live, cached exchange rates.",
};

export default function Page() {
  return <CurrencyConverterClient />;
}
