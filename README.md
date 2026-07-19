# Freelance Ops Toolkit

A free, no-login collection of independent tools built for freelancers and independent contractors to manage client operations — from proposals and contracts to invoicing, calculations, and client communication.

**Live site:** https://freelance-ops-toolkit-6w1z.vercel.app/

## About

Freelance Ops Toolkit is a cohesive, single toolkit for freelance/client workflows — not a random bundle of unrelated utilities. All 15 tools were built across 7 planned roadmap phases and are fully implemented and live, alongside a professional homepage redesign, an AI assistant, a command palette, and SEO-optimized content throughout.

## Tools

### Available Now (All 15 Tools)

#### Billing & Financial
- **Invoice Generator** — Create professional, branded invoices with line items, tax, and one-click PDF export.
- **Rate Calculator** — Convert your desired income into a suggested hourly and project-based rate.
- **Currency Converter** — Convert amounts between currencies using live exchange rates, for international clients.
- **Late Payment Fee Calculator** — Calculate late fees and updated totals for overdue invoices.

#### Agreements & Legal
- **Proposal Generator** — Create professional proposals and quotes with a breakdown of deliverables, timeline, and investment.
- **Contract Template Builder** — Draft standard agreements and contracts for freelance projects.
- **NDA Generator** — Create custom Non-Disclosure Agreements to protect your business.
- **Retainer Agreement Generator** — Set up ongoing monthly retainer agreements.

#### Client Assets & Onboarding
- **Client Intake Form Builder** — Onboard clients with customizable, interactive questionnaires.
- **Portfolio Case Study Builder** — Generate structured case studies to showcase your results.

#### AI Communication
- **Payment Reminder Generator** — Draft polished, tone-adjustable payment reminder emails using AI.
- **Meeting Recap Generator** — Turn rough meeting notes into a polished recap email with clear action items.

#### Planning & Tracking (account required to save)
- **Time Tracker** — Log hours, track sessions, and convert logged time directly into an invoice.
- **Project Scope Estimator** — Estimate hour ranges and timelines by deliverable complexity; usable with or without an account.

#### Reference
- **Rate Benchmark Tool** — Compare freelance hourly rates across skill categories, experience levels, and regions.

## Additional Features

- **AI Freelance Assistant** — A site-wide chat assistant that helps draft proposals, emails, meeting recaps, and project scopes, with deep links into the relevant tool for final generation/export.
- **Command Palette (⌘K / Ctrl+K)** — Instant keyboard-driven search and navigation across all 15 tools.
- **Popular Tools & Continue Where You Left Off** — A personalized homepage section (via localStorage) surfacing a visitor's 5 curated popular tools or their recently used tools.
- **Custom Logo & Branding** — A hand-built SVG "FO" monogram used consistently across the Navbar, Footer, and favicon.
- **SEO-Optimized Content** — Each tool page includes original, keyword-targeted supporting content aimed at long-tail freelance search terms.

## Tech Stack

- **Framework:** Next.js 15 (App Router), React, TypeScript
- **Styling:** Tailwind CSS v3
- **PDF Export:** jsPDF + html2canvas (shared utility, reused across all document-producing tools, with a fixed A4 print-optimized layout for consistent output)
- **AI Features:** Google Gemini API (`gemini-1.5-flash`) via the official `@google/generative-ai` SDK, called through a shared Next.js serverless API route
- **Authentication & Persistence:** Supabase (email/password + magic link auth, Postgres database with Row Level Security), used only for Time Tracker and Project Scope Estimator
- **Hosting:** Vercel

## Design Principles

- No login required for most tools — only the two tools that genuinely need saved data (Time Tracker, Project Scope Estimator) require a free account.
- No payment processing anywhere in the app.
- Every document-producing tool shares one PDF export pipeline; every AI-assisted feature shares one Gemini API pipeline — built once, reused everywhere.
- Legal document tools (Contract, NDA, Retainer) are generic templates limited to specific supported jurisdictions, with a clear "not legal advice" disclaimer — not a substitute for professional legal review.
- The AI Assistant is a drafting/concierge tool, not an autonomous agent — it never silently saves, submits, or generates final documents without the user reviewing and acting through the relevant tool.

## Getting Started (Local Development)

```bash
