import { LedgerAccount } from '../types';

export const CHART_OF_ACCOUNTS: Record<string, Omit<LedgerAccount, 'balance'>> = {
  '1000': {
    code: '1000',
    name: 'Asset: Gateway Escrow Clearing',
    classification: 'ASSET',
    description: 'Unsettled funds captured digitally by authorized payment aggregators prior to bank clearance.'
  },
  '1010': {
    code: '1010',
    name: 'Asset: Platform Bank Operating & Payout Account',
    classification: 'ASSET',
    description: 'Actual liquid funds settled in the verified bank accounts for payouts.'
  },
  '2000': {
    code: '2000',
    name: 'Liability: Contributor Unallocated Pool',
    classification: 'LIABILITY',
    description: 'Active voluntary contributions held in trust during an open funding cycle prior to close.'
  },
  '2010': {
    code: '2010',
    name: 'Liability: Charity Allocation Fund (30%)',
    classification: 'LIABILITY',
    description: 'Legally earmarked pool assigned to verified charitable organizations and public social causes.'
  },
  '2020': {
    code: '2020',
    name: 'Liability: Beneficiary Grant Fund (60%)',
    classification: 'LIABILITY',
    description: 'Legally earmarked pool for verified direct humanitarian and hardship grants.'
  },
  '4000': {
    code: '4000',
    name: 'Revenue: Platform Operating Fee (10%)',
    classification: 'REVENUE',
    description: 'Disclosed operating fee earned by WBox for platform infrastructure, compliance and security.'
  },
  '5000': {
    code: '5000',
    name: 'Expense: Payment Processing Gateway Fees',
    classification: 'EXPENSE',
    description: 'Transparently disclosed merchant discount rates (MDR) and banking transmission costs.'
  },
  '5010': {
    code: '5010',
    name: 'Expense: Contributor Refunds & Chargebacks',
    classification: 'EXPENSE',
    description: 'Contributions returned to source payment methods upon verified donor dispute or reversal.'
  }
};

