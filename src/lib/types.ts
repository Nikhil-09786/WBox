export type CycleStatus = 'DRAFT' | 'OPEN' | 'CLOSING' | 'ALLOCATED' | 'DISTRIBUTING' | 'COMPLETED';

export interface FundingCycle {
  id: string;
  cycleNumber: number;
  title: string;
  description: string;
  status: CycleStatus;
  charityPct: number;       // default 30%
  beneficiaryPct: number;   // default 60%
  platformPct: number;      // default 10%
  targetAmount: number;
  grossCollected: number;
  processingFees: number;
  netDistributable: number;
  contributorCount: number;
  opensAt: string;
  closesAt: string;
  stateHash?: string;       // SHA-256 seal when locked/allocated
}

export type AccountClassification = 'ASSET' | 'LIABILITY' | 'EQUITY' | 'REVENUE' | 'EXPENSE';

export interface LedgerAccount {
  code: string;
  name: string;
  classification: AccountClassification;
  balance: number;
  description: string;
}

export interface Posting {
  accountCode: string;
  debit: number;
  credit: number;
}

export interface JournalEntry {
  id: string;
  entryNumber: number;
  timestamp: string;
  description: string;
  referenceType: 'CONTRIBUTION' | 'CYCLE_ALLOCATION' | 'GRANT_PAYOUT' | 'CHARITY_PAYOUT' | 'REFUND';
  referenceId: string;
  postings: Posting[];
  isReversal?: boolean;
}

export interface Contribution {
  id: string;
  cycleId: string;
  donorName: string;
  donorEmail: string;
  amount: number;
  feeDeducted: number;
  netAmount: number;
  currency: string;
  status: 'SUCCESS' | 'PENDING' | 'REFUNDED';
  paymentMethod: string;
  paymentGatewayRef: string;
  createdAt: string;
  isAnonymous: boolean;
}

export interface Charity {
  id: string;
  name: string;
  regNumber: string;
  taxExemptCode: string; // 80G / 12A / 501(c)(3)
  category: string;
  verified: boolean;
  allocatedAmount: number;
  disbursedAmount: number;
  impactSummary: string;
  mission: string;
  website: string;
  location: string;
}

export type GrantCategory = 'HEALTHCARE' | 'EDUCATION' | 'EMERGENCY' | 'LIVELIHOOD' | 'DISABILITY';

export type GrantStatus = 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'DISBURSED' | 'REJECTED';

export interface GrantApplication {
  id: string;
  cycleId: string;
  applicantName: string;
  applicantEmail: string;
  category: GrantCategory;
  requestedAmount: number;
  approvedAmount: number;
  status: GrantStatus;
  publicSummary: string;
  encryptedHardshipNote: string; // Black Box encrypted representation
  submittedAt: string;
  reviewedAt?: string;
  payoutId?: string;
}

export type PayoutStatus = 'PENDING_MAKER' | 'PENDING_CHECKER' | 'RELEASED' | 'REJECTED';

export interface PayoutAuthorization {
  id: string;
  cycleId: string;
  recipientType: 'BENEFICIARY' | 'CHARITY';
  recipientId: string;
  recipientName: string;
  amount: number;
  status: PayoutStatus;
  makerAdmin: string | null;
  makerNotes: string | null;
  checkerAdmin: string | null;
  checkerNotes: string | null;
  bankRef: string | null;
  createdAt: string;
  releasedAt: string | null;
}

