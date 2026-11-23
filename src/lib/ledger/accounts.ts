import { LedgerAccount } from '../types';

export const CHART_OF_ACCOUNTS: Record<string, Omit<LedgerAccount, 'balance'>> = {
  // ── ASSETS ──────────────────────────────────────────────────────────────
  '1000': {
    code: '1000',
    name: 'Asset: Payment Gateway Clearing',
    classification: 'ASSET',
    description: 'Funds captured by the authorized payment provider awaiting bank settlement.'
  },
  '1010': {
    code: '1010',
    name: 'Asset: Platform Operating Bank Account',
    classification: 'ASSET',
    description: 'Settled funds in the main bank account available for authorized disbursements.'
  },
  '1020': {
    code: '1020',
    name: 'Asset: Emergency Vault — Custodian Account',
    classification: 'ASSET',
    description: 'Segregated custody account holding permanent emergency reserve funds. Board-controlled only.'
  },

  // ── LIABILITIES ─────────────────────────────────────────────────────────
  '2000': {
    code: '2000',
    name: 'Liability: Contributor Pool (Unallocated)',
    classification: 'LIABILITY',
    description: 'Settled contributions held in trust during an open event prior to allocation.'
  },
  '2010': {
    code: '2010',
    name: 'Liability: First Recipient Payable (50%)',
    classification: 'LIABILITY',
    description: 'Funds legally earmarked for the verified first recipient of the event.'
  },
  '2020': {
    code: '2020',
    name: 'Liability: Second Recipient Payable (10%)',
    classification: 'LIABILITY',
    description: 'Funds legally earmarked for the verified second recipient of the event.'
  },
  '2030': {
    code: '2030',
    name: 'Liability: Charity Payable (20%)',
    classification: 'LIABILITY',
    description: 'Funds earmarked for verified registered charitable organizations.'
  },
  '2040': {
    code: '2040',
    name: 'Liability: Emergency Vault Deposit (10%)',
    classification: 'LIABILITY',
    description: 'Permanent emergency reserve. Restricted. Board approval required for any withdrawal.'
  },
  '2050': {
    code: '2050',
    name: 'Liability: Refund & Chargeback Control',
    classification: 'LIABILITY',
    description: 'Amounts due back to contributors for failed, disputed or reversed transactions.'
  },

  // ── REVENUE ──────────────────────────────────────────────────────────────
  '4000': {
    code: '4000',
    name: 'Revenue: Platform Operations (10%)',
    classification: 'REVENUE',
    description: 'Disclosed operating fee covering hosting, compliance, security and administration.'
  },

  // ── EXPENSES ─────────────────────────────────────────────────────────────
  '5000': {
    code: '5000',
    name: 'Expense: Payment Processing Fees (MDR)',
    classification: 'EXPENSE',
    description: 'Merchant discount rate and transaction charges levied by the payment provider.'
  },
};
