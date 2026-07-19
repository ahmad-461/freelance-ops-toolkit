import React from "react";
import { Metadata } from "next";
import PaymentReminderGeneratorClient from "./PaymentReminderGeneratorClient";

export const metadata: Metadata = {
  title: "Payment Reminder Email Template Generator | Freelance Ops",
  description: "Draft perfectly tuned, professional email reminders for past-due client invoices. Generate polite or firm reminder templates with smart AI guidance.",
};

export default function Page() {
  return <PaymentReminderGeneratorClient />;
}
