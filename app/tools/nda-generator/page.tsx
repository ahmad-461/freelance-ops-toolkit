import React from "react";
import { Metadata } from "next";
import NdaGeneratorClient from "./NdaGeneratorClient";

export const metadata: Metadata = {
  title: "Free Non-Disclosure Agreement Generator | Freelance Ops",
  description: "Create custom, professional Non-Disclosure Agreements. Free NDA generator for freelancers in US or UK jurisdiction with pristine PDF exports.",
};

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "NDA Generator",
    "url": "https://freelance-ops-toolkit-6w1z.vercel.app/tools/nda-generator",
    "description": "Create custom, professional Non-Disclosure Agreements. Free NDA generator for freelancers in US or UK jurisdiction with pristine PDF exports.",
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
      <NdaGeneratorClient />
    </>
  );
}
