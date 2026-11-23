# WBox (White-Black Box)
## Technical & Governance Specification — Baseline Implementation

> **Platform Version:** 1.0  
> **Status:** Proposed Baseline Architecture  
> **Visual Identity:** 100% Monochrome (Pure Black & White)  
> **Data Integrity:** 100% Genuine Zero State (Zero fake data, zero mock amounts)  
> **Allocation Model:** 50% First Recipient + 10% Second Recipient + 20% Direct Charity + 10% Permanent Emergency Vault + 10% Platform Operations

---

## 1. Product Architecture: Four Independent Programs

WBox operates four completely independent event programs:

| Program | Frequency | Geographic Scope | Independence Rules |
|---|---|---|---|
| **District WBox** | Daily | Eligible district residents | No shared pool, no progression, separate reserves |
| **State WBox** | Weekly | Eligible state residents | No shared pool, no progression, separate reserves |
| **Country WBox** | Monthly | Eligible national residents | No shared pool, no progression, separate reserves |
| **World WBox** | Annually | Permitted international jurisdictions | No shared pool, no progression, separate reserves |

### Strict Independence Invariants
- No shared recipient pool across programs.
- No transfer of recipient allocations between events.
- No automatic progression from district to state to country to world.
- No shared Emergency Vault — each program maintains its own segregated reserve.
- No use of another program's money to cover a shortfall.
- Separate financial accounting, ledger postings, and audit statements for every event.

---

## 2. Financial Allocation Model (5 Buckets)

Every eligible event allocation base is divided into five strictly defined buckets:

```
┌────────────────────────────────────────────────────────────────────────┐
│               WBOX FIXED 5-BUCKET ALLOCATION (100%)                    │
├──────────────────┬─────────────────┬───────────────────────────────────┤
│ Bucket           │ Percentage      │ Purpose                           │
├──────────────────┼─────────────────┼───────────────────────────────────┤
│ First Recipient  │ 50%             │ Primary awarded event participant │
│ Second Recipient │ 10%             │ Secondary awarded participant     │
│ Direct Charity   │ 20%             │ Verified registered charities     │
│ Emergency Vault  │ 10%             │ Permanent board-governed reserve  │
│ Platform Ops     │ 10%             │ Disclosed operational fee         │
└──────────────────┴─────────────────┴───────────────────────────────────┘
```

**Net Allocation Rule:** Percentages are applied to the net settled allocation base after deducting disclosed payment gateway fees (~2% MDR). Allocations are locked and cryptographically sealed before an event opens.

---

## 3. General Ledger Chart of Accounts (COA)

Every financial movement is logged using strict double-entry bookkeeping ($\sum \text{Debits} \equiv \sum \text{Credits}$):

| Code | Account Name | Type | Description |
|---|---|---|---|
| `1000` | **Asset: Payment Gateway Clearing** | Asset (Debit +) | Unsettled digital payments captured by gateway |
| `1010` | **Asset: Platform Operating Bank Account** | Asset (Debit +) | Liquid bank account for approved disbursements |
| `1020` | **Asset: Emergency Vault Custody Account** | Asset (Debit +) | Segregated custody account holding emergency reserves |
| `2000` | **Liability: Contributor Pool (Unallocated)** | Liability (Credit +) | Unallocated contributions held during open event |
| `2010` | **Liability: First Recipient Payable (50%)** | Liability (Credit +) | Earmarked for verified first recipient |
| `2020` | **Liability: Second Recipient Payable (10%)** | Liability (Credit +) | Earmarked for verified second recipient |
| `2030` | **Liability: Charity Payable (20%)** | Liability (Credit +) | Earmarked for verified registered charities |
| `2040` | **Liability: Emergency Vault Deposit (10%)** | Liability (Credit +) | Restricted permanent reserve deposit |
| `2050` | **Liability: Refund & Chargeback Control** | Liability (Credit +) | Amounts due back to contributors |
| `4000` | **Revenue: Platform Operations (10%)** | Revenue (Credit +) | Disclosed operating revenue |
| `5000` | **Expense: Payment Processing Fees (MDR)** | Expense (Debit +) | Transparent gateway MDR fee accounting |

---

## 4. Emergency Vault Governance (Section 4)

- **Permanent Accumulation:** The 10% reserve never expires and unused funds accumulate indefinitely.
- **Segregated Custody:** Cannot be merged with operating accounts or used to cover operating deficits.
- **Preservation-First Policy:** Speculative investments, cryptocurrencies, and loans to founders or employees are strictly prohibited.
- **5-Member Independent Board:** Decisions require a minimum quorum of 4 of 5 members with 4 affirmative votes. The platform founder cannot unilaterally approve withdrawals.

---

## 5. Development & Verification Commands

```powershell
# Navigate to project directory
cd "C:\Users\Nikhil Yadav\.gemini\antigravity\scratch\wb-box"

# Run double-entry accounting unit tests
npm test

# Build production bundle
npm run build

# Start local development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to inspect the 100% monochrome, genuine-state platform.
