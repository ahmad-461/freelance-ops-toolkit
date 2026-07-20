import React from "react";
import { Metadata } from "next";
import ClientIntakeFormClient from "./ClientIntakeFormClient";

export const metadata: Metadata = {
  title: "Client Intake Form Template & Questionnaire | Freelance Ops",
  description: "Draft tailored client intake questionnaires with editable questions. Free freelance client questionnaire generator with clean PDF & text exports.",
};

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Client Intake Form Builder",
    "url": "https://freelance-ops-toolkit-6w1z.vercel.app/tools/client-intake-form",
    "description": "Draft tailored client intake questionnaires with editable questions. Free freelance client questionnaire generator with clean PDF & text exports.",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "All",
    "browserRequirements": "Requires HTML5 compatible browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "isAccessibleForFree": true
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ClientIntakeFormClient />
    </>
  );
}
