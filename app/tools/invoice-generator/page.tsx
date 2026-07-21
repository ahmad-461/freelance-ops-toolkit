import { getWebApplicationJsonLd } from "@/lib/schema-utils";
import React from "react";
import { Metadata } from "next";
import InvoiceGeneratorClient from "./InvoiceGeneratorClient";

export const metadata: Metadata = {
  title: "Free Invoice Generator for Freelancers | Freelance Ops",
  description: "Create professional, branded PDF invoices instantly. Free invoice maker with no signup required. Customize client details, tax, and export.",
};

export default function Page() {
  const jsonLd = getWebApplicationJsonLd(
    "Invoice Generator",
    "https://freelance-ops-toolkit-6w1z.vercel.app/tools/invoice-generator",
    "Create professional, branded PDF invoices instantly. Free invoice maker with no signup required. Customize client details, tax, and export."
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <InvoiceGeneratorClient />
    </>
  );
}
