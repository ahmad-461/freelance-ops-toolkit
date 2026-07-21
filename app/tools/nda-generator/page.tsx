import { getWebApplicationJsonLd } from "@/lib/schema-utils";
import React from "react";
import { Metadata } from "next";
import NdaGeneratorClient from "./NdaGeneratorClient";

export const metadata: Metadata = {
  title: "Free Non-Disclosure Agreement Generator | Freelance Ops",
  description: "Create custom, professional Non-Disclosure Agreements. Free NDA generator for freelancers in US or UK jurisdiction with pristine PDF exports.",
};

export default function Page() {
  const jsonLd = getWebApplicationJsonLd(
    "NDA Generator",
    "https://freelance-ops-toolkit-6w1z.vercel.app/tools/nda-generator",
    "Create custom, professional Non-Disclosure Agreements. Free NDA generator for freelancers in US or UK jurisdiction with pristine PDF exports."
  );

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
