import { getWebApplicationJsonLd } from "@/lib/schema-utils";
import React from "react";
import { Metadata } from "next";
import PaymentReminderGeneratorClient from "./PaymentReminderGeneratorClient";

export const metadata: Metadata = {
  title: "Payment Reminder Email Template Generator | Freelance Ops",
  description: "Draft perfectly tuned, professional email reminders for past-due client invoices. Generate polite or firm reminder templates with smart AI guidance.",
};

export default function Page() {
  const jsonLd = getWebApplicationJsonLd(
    "Payment Reminder Generator",
    "https://freelance-ops-toolkit-6w1z.vercel.app/tools/payment-reminder-generator",
    "Draft perfectly tuned, professional email reminders for past-due client invoices. Generate polite or firm reminder templates with smart AI guidance."
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PaymentReminderGeneratorClient />
    </>
  );
}
