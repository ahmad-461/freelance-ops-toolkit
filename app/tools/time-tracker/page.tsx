import React from "react";
import { Metadata } from "next";
import TimeTrackerClient from "./TimeTrackerClient";

export const metadata: Metadata = {
  title: "Free Freelance Time Tracker with Invoice Sync | Freelance Ops",
  description: "Log billable hours, run live tracking sessions, and instantly prefill your invoices. Free freelance time tracker with cloud sync. Start now.",
};

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Time Tracker",
    "url": "https://freelance-ops-toolkit-6w1z.vercel.app/tools/time-tracker",
    "description": "Log billable hours, run live tracking sessions, and instantly prefill your invoices. Free freelance time tracker with cloud sync. Start now.",
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
      <TimeTrackerClient />
    </>
  );
}
