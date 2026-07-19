import React from "react";
import { Metadata } from "next";
import AboutClient from "./AboutClient";

export const metadata: Metadata = {
  title: "About the Freelance Operations Toolkit | Freelance Ops",
  description: "Learn about the positioning, engineering philosophy, and privacy-first features of our free freelance operations toolkit. Free alternative to Bonsai and HoneyBook.",
};

export default function Page() {
  return <AboutClient />;
}
