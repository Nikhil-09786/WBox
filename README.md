# WBox (White-Black Box)
## Digital Community Funding, Double-Entry Financial Ledger & Hybrid Transparency System

> **Platform Version:** 1.0 (MVP)  
> **Allocation Policy:** 30% Charity Fund + 60% Beneficiary Grants + 10% Platform Operations  
> **Tech Stack:** Next.js 14 (App Router), TypeScript, Tailwind CSS, Lucide Icons, Double-Entry Ledger Engine  
> **Compliance Standard:** Gratuitous Voluntary Philanthropy (Zero lottery / Zero prize draws / 100% need-based grants)

---

## 1. Overview & Concept

**WBox** is an open, auditable community funding platform built on a hybrid transparency model:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        THE WBox HYBRID SYSTEM                        │
├───────────────────────────────────┬────────────────────────────────────┤
│     WHITE BOX: TRANSPARENCY       │        BLACK BOX: PRIVACY          │
├───────────────────────────────────┼────────────────────────────────────┤
│ • Append-only double-entry ledger │ • AES-256 envelope PII encryption  │
│ • Real-time 30/60/10 distribution │ • Zero Donated-To-Grant bias rule  │
│ • Public cycle close reports      │ • Dual-admin (Maker-Checker) auth  │
│ • Cryptographic SHA-256 seal      │ • Webhook idempotency & fraud scan │
└───────────────────────────────────┴────────────────────────────────────┘
```

1. **White Box (Public & Explainable):**
   - Live funding cycle metrics (settled collections, contributor count, and days remaining).
   - Real-time double-entry general ledger with balanced debits and credits ($\sum Debits \equiv \sum Credits$).
   - Published 30/60/10 allocation terms locked before funds are collected.
   - Verified 80G/tax-exempt charity utilization reports.
2. **Black Box (Confidential & Protected):**
   - Encrypted donor PII, banking details, and government identity documents.
   - Encrypted hardship narratives for medical emergency and disaster applicants.
   - Strict zero-bias air gap: grant reviewers cannot see whether an applicant has donated.
   - Dual-admin (Maker-Checker) approval prevents single-admin embezzlement.

---

## 2. General Ledger Chart of Accounts (COA)

| Code | Account Name | Type | Description |
|---|---|---|---|
| `1000` | **Asset: Gateway Escrow Clearing** | Asset (Debit +) | Unsettled digital payments captured by the payment gateway |
| `1010` | **Asset: Platform Bank Payout Account** | Asset (Debit +) | Liquid bank account utilized for charity and beneficiary disbursements |
| `2000` | **Liability: Contributor Unallocated Pool** | Liability (Credit +) | Active cycle contributions held in trust prior to cycle allocation |
| `2010` | **Liability: Charity Allocation Fund (30%)** | Liability (Credit +) | Earmarked funds for registered 80G NGO partners |
| `2020` | **Liability: Beneficiary Grant Fund (60%)** | Liability (Credit +) | Earmarked funds for direct humanitarian grants |
| `4000` | **Revenue: Platform Operating Fee (10%)** | Revenue (Credit +) | Disclosed operating revenue for servers, verification & compliance |
| `5000` | **Expense: Payment Gateway Fees** | Expense (Debit +) | Merchant Discount Rate (MDR ~2%) transparently accounted for |

---

## 3. Key Pages & Routes

- `/` — **Homepage:** Hero mission, live Cycle #1 progress card, 30/60/10 visualizer, verified charity showcase, and trust guarantees.
- `/contribute` — **Contribute Page:** Real-time fee and 30/60/10 math calculator, anonymous contribution toggle, digital payment simulation, and instant downloadable receipt.
- `/transparency` — **Public Transparency Dashboard:** Real-time Chart of Accounts, append-only journal entries explorer, and audit JSON export.
- `/charities` — **Charity Directory:** Verified 80G partner NGOs, registration numbers, fund utilization, and partner onboarding application.
- `/apply` — **Beneficiary Assistance Application:** Encrypted grant submission wizard, category selection, and live Application ID status tracker.
- `/admin` — **Platform Governance Console:** Funding cycle lock controller, Maker-Checker dual authorization queue, and inbound webhook simulator.

---

## 4. Quick Start & Developer Guide

### Installation
```bash
# Navigate to project directory
cd "C:\Users\Nikhil Yadav\.gemini\antigravity\scratch\wb-box"

# Install dependencies (already installed)
npm install
```

### Run Unit Tests
Verifies mathematical balance invariants ($\sum Debits = \sum Credits$) and 30/60/10 cycle allocations:
```bash
npm test
```

### Start Local Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build
```bash
npm run build
npm start
```

---

## 5. Verification Checklist (PRD Section 21 Acceptance Criteria)

- [x] Contribution creates unique financial records in ledger.
- [x] Allocation calculations are mathematically balanced ($30\% + 60\% + 10\% \equiv 100\%$).
- [x] Contributor can view exact fee breakdown (~2% MDR) prior to payment.
- [x] Beneficiaries can apply with zero payment requirement.
- [x] Maker-Checker dual authorization enforces `makerAdmin != checkerAdmin`.
- [x] Double-entry ledger invariant verified ($\text{Assets} = \text{Liabilities} + \text{Revenue} - \text{Expenses}$).
- [x] Sensitive applicant hardship data protected via encrypted vaults.

