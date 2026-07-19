import React from "react";
import { Metadata } from "next";
import ClientIntakeFormClient from "./ClientIntakeFormClient";

export const metadata: Metadata = {
  title: "Client Intake Form Template & Questionnaire | Freelance Ops",
  description: "Draft tailored client intake questionnaires with editable questions. Free freelance client questionnaire generator with clean PDF & text exports.",
};

export default function Page() {
  return <ClientIntakeFormClient />;
}
