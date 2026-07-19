import React from "react";
import { Metadata } from "next";
import InvoiceGeneratorClient from "./InvoiceGeneratorClient";

export const metadata: Metadata = {
  title: "Free Invoice Generator for Freelancers | Freelance Ops",
  description: "Create professional, branded PDF invoices instantly. Free invoice maker with no signup required. Customize client details, tax, and export.",
};

export default function Page() {
  return <InvoiceGeneratorClient />;
}
