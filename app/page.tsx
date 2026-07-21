import React from "react";
import { Metadata } from "next";
import HomeClient from "./HomeClient";

export const metadata: Metadata = {
  title: "Free Freelance Operations & Management Tools | Freelance Ops",
  description: "Optimize your freelance client operations with 15 free, privacy-first tools. Access professional invoice, proposal, and contract generators with no signup.",
};

import { getWebApplicationJsonLd } from "@/lib/schema-utils";

export default function Page() {
  const jsonLdList = getWebApplicationJsonLd(
    "Freelance Ops Toolkit",
    "https://freelance-ops-toolkit-6w1z.vercel.app",
    "Optimize your freelance client operations with 15 free, privacy-first tools. Access professional invoice, proposal, and contract generators with no signup."
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdList) }}
      />
      <HomeClient />
    </>
  );
}
