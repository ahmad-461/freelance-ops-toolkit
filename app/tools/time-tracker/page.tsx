import { getWebApplicationJsonLd } from "@/lib/schema-utils";
import React from "react";
import { Metadata } from "next";
import TimeTrackerClient from "./TimeTrackerClient";

export const metadata: Metadata = {
  title: "Free Freelance Time Tracker with Invoice Sync | Freelance Ops",
  description: "Log billable hours, run live tracking sessions, and instantly prefill your invoices. Free freelance time tracker with cloud sync. Start now.",
};

export default function Page() {
  const jsonLd = getWebApplicationJsonLd(
    "Time Tracker",
    "https://freelance-ops-toolkit-6w1z.vercel.app/tools/time-tracker",
    "Log billable hours, run live tracking sessions, and instantly prefill your invoices. Free freelance time tracker with cloud sync. Start now."
  );

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
