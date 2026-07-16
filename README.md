# Freelance Ops Toolkit

A free, no-login collection of independent tools built for freelancers and independent contractors to manage client operations — from proposals and contracts to invoicing, calculations, and client communication.

Live site: [add your deployed Vercel URL here]

## About

Freelance Ops Toolkit is being built in 7 phases, with each phase adding a set of related tools to the same live site. The goal is a single, cohesive toolkit — not a random bundle of unrelated utilities — so every tool here is specifically for freelancer/client workflows.

## Tools

### Available now
- **Invoice Generator** — Create professional, branded invoices with line items, tax, and one-click PDF export.
- **Rate Calculator** — Convert your desired income into a suggested hourly and project-based rate.
- **Currency Converter** — Convert amounts between currencies using live exchange rates, for international clients.
- **Late Payment Fee Calculator** — Calculate late fees and updated totals for overdue invoices.

### Coming soon
- Proposal / Quote Generator
- Contract Template Builder
- NDA Generator
- Retainer Agreement Generator
- Client Intake Form Builder
- Portfolio Case Study Builder
- AI-assisted Payment Reminder & Meeting Recap generators
- Time Tracker, Project Scope Estimator, Scope Creep Tracker (account-based)
- Client Feedback Form, Testimonial Request Generator, Project Handoff Checklist
- Freelance Tax Estimator, Freelance Rate Benchmark Tool

## Tech Stack

- **Framework:** Next.js 15 (App Router), React, TypeScript
- **Styling:** Tailwind CSS v3
- **PDF Export:** jsPDF + html2canvas (shared utility, reused across all document-producing tools)
- **AI features (upcoming):** Google Gemini API via serverless functions
- **Persistence (upcoming):** Supabase (auth + database), introduced starting Phase 6
- **Hosting:** Vercel

## Design Principles

- No login or account required for most tools — only the tools that genuinely need saved data (time tracking, scope tracking) will require an account.
- No payment processing anywhere in the app.
- Every document-producing tool shares one PDF export pipeline; every AI-assisted tool shares one Gemini API pipeline — built once, reused everywhere.
- Legal document tools (contracts, NDAs, retainers) are generic templates with a clear "not legal advice" disclaimer, not a substitute for professional legal review.

## Getting Started (Local Development)

```bash
npm install
npm run dev
