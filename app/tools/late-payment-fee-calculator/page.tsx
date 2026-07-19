import React from "react";
import { Metadata } from "next";
import LatePaymentFeeCalculatorClient from "./LatePaymentFeeCalculatorClient";

export const metadata: Metadata = {
  title: "Overdue Invoice Late Payment Fee Calculator | Freelance Ops",
  description: "Calculate days overdue, prorated monthly late fees, and new total invoice balance owed. Protect your freelance cash flow with clear calculations.",
};

export default function Page() {
  return <LatePaymentFeeCalculatorClient />;
}
