import React from "react";
import { Metadata } from "next";
import MeetingRecapGeneratorClient from "./MeetingRecapGeneratorClient";

export const metadata: Metadata = {
  title: "Client Meeting Recap Email Summary Generator | Freelance Ops",
  description: "Convert messy client meeting notes and rough scribbles into beautiful, structured recap emails with action items instantly using smart AI.",
};

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Meeting Recap Generator",
    "url": "https://freelance-ops-toolkit-6w1z.vercel.app/tools/meeting-recap-generator",
    "description": "Convert messy client meeting notes and rough scribbles into beautiful, structured recap emails with action items instantly using smart AI.",
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
      <MeetingRecapGeneratorClient />
    </>
  );
}
