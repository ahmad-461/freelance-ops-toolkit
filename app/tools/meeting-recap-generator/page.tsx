import { getWebApplicationJsonLd } from "@/lib/schema-utils";
import React from "react";
import { Metadata } from "next";
import MeetingRecapGeneratorClient from "./MeetingRecapGeneratorClient";

export const metadata: Metadata = {
  title: "Client Meeting Recap Email Summary Generator | Freelance Ops",
  description: "Convert messy client meeting notes and rough scribbles into beautiful, structured recap emails with action items instantly using smart AI.",
};

export default function Page() {
  const jsonLd = getWebApplicationJsonLd(
    "Meeting Recap Generator",
    "https://freelance-ops-toolkit-6w1z.vercel.app/tools/meeting-recap-generator",
    "Convert messy client meeting notes and rough scribbles into beautiful, structured recap emails with action items instantly using smart AI."
  );

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
