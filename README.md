# Freelance Ops Toolkit

A free, no-login collection of independent tools built for freelancers and independent contractors to manage client operations — from proposals and contracts to invoicing, calculations, and client communication.

Live site: [add your deployed Vercel URL here]

## About

Freelance Ops Toolkit is built as a cohesive, single toolkit for freelance/client workflows. All 15 professional, highly useful tools across 7 roadmap phases are fully implemented and live.

## Tools

### Available Now (All 15 Tools)

#### Billing & Financial
- **Invoice Generator** — Create professional, branded invoices with line items, tax, and one-click PDF export.
- **Rate Calculator** — Convert your desired income into a suggested hourly and project-based rate.
- **Currency Converter** — Convert amounts between currencies using live exchange rates, for international clients.
- **Late Payment Fee Calculator** — Calculate late fees and updated totals for overdue invoices.

#### Agreements & Legal
- **Proposal Generator** — Create professional proposals and quotes with breakdown of deliverables, timeline, and investment.
- **Contract Template Builder** — Draft standard agreements and contracts for freelance projects.
- **NDA Generator** — Create custom Non-Disclosure Agreements to protect your business.
- **Retainer Agreement Generator** — Set up ongoing monthly retainer agreements.

#### Client Assets & Onboarding
- **Client Intake Form Builder** — Onboard clients with customizable, interactive questionnaires.
- **Portfolio Case Study Builder** — Generate beautiful, structured case studies to showcase your results.

#### AI Communication
- **Payment Reminder Generator** — Draft perfect payment reminders using customizable, AI-assisted tones.
- **Meeting Recap Generator** — Instantly convert meeting bullet points into polished recap emails.

#### Planning & Tracking
- **Time Tracker** — Log hours, track sessions, and easily convert hours directly to invoices.
- **Project Scope Estimator** — Calculate hour ranges and project timelines by deliverable complexity.

#### Reference
- **Freelance Rate Benchmark Tool** — Compare global freelance hourly rate ranges across experience levels, categories, and regional markets.

## Tech Stack

- **Framework:** Next.js 15 (App Router), React, TypeScript
- **Styling:** Tailwind CSS v3 (using safe hex/RGB values only to preserve PDF exports)
- **PDF Export:** jsPDF + html2canvas (shared utility, reused across all document-producing tools)
- **AI features:** Google Gemini API via serverless functions
- **Persistence:** Supabase (auth + database)
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
```
