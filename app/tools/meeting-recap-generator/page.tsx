import React from "react";
import { Metadata } from "next";
import MeetingRecapGeneratorClient from "./MeetingRecapGeneratorClient";

export const metadata: Metadata = {
  title: "Client Meeting Recap Email Summary Generator | Freelance Ops",
  description: "Convert messy client meeting notes and rough scribbles into beautiful, structured recap emails with action items instantly using smart AI.",
};

export default function Page() {
  return <MeetingRecapGeneratorClient />;
}
