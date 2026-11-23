export type ProgramType = 'DISTRICT' | 'STATE' | 'COUNTRY' | 'WORLD';
export type EventStatus =
  | 'DRAFT'
  | 'LEGAL_APPROVAL'
  | 'SCHEDULED'
  | 'OPEN'
  | 'CLOSED'
  | 'RECONCILED'
  | 'ALLOCATED'
  | 'COMPLETED'
  | 'ARCHIVED';

export interface EventProgram {
  id: string;
  name: string;
  programType: ProgramType;
  geographicScope: string;
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'ANNUALLY';
  legalStatus: 'PENDING' | 'APPROVED' | 'SUSPENDED';
  description: string;
}

export interface EventInstance {
  id: string;
  programId: string;
  programType: ProgramType;
  geographicScope: string;
  eventNumber: number;
  status: EventStatus;
  currency: string;
  // Allocation percentages — fixed and disclosed before contributions open
  firstRecipientPct: number;    // 50%
  secondRecipientPct: number;   // 10%
  charityPct: number;           // 20%
  emergencyVaultPct: number;    // 10%
  platformPct: number;          // 10%
  // Financials (genuine — start at zero)
  grossCollected: number;
  processingFees: number;
  refunds: number;
  chargebacks: number;
  netDistributable: number;
  contributorCount: number;
  opensAt: string;
  closesAt: string;
  stateHash?: string;
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
  referenceType:
    | 'CONTRIBUTION'
    | 'EVENT_ALLOCATION'
    | 'RECIPIENT_PAYOUT'
    | 'CHARITY_TRANSFER'
    | 'VAULT_DEPOSIT'
    | 'VAULT_WITHDRAWAL'
    | 'REFUND'
    | 'CHARGEBACK';
  referenceId: string;
  postings: Posting[];
  isReversal?: boolean;
}

export interface Contribution {
  id: string;
  eventId: string;
  programType: ProgramType;
  amount: number;
  feeDeducted: number;
  netAmount: number;
  currency: string;
  status: 'PENDING' | 'SUCCESS' | 'REFUNDED' | 'CHARGEBACK';
  paymentMethod: string;
  paymentRef: string;
  isAnonymous: boolean;
  createdAt: string;
}

export interface CharityOrganization {
  id: string;
  legalName: string;
  registrationRef: string;
  verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
  authorizedPurpose: string;
  location: string;
  totalReceived: number;
  website: string;
}

export interface EmergencyReserve {
  id: string;
  programId: string;
  programType: ProgramType;
  geographicScope: string;
  currency: string;
  principalBalance: number;
  accruedReturns: number;
  status: 'ACTIVE' | 'FROZEN';
}

export interface EmergencyRequest {
  id: string;
  reserveId: string;
  applicantRef: string;
  requestedAmount: number;
  purpose: string;
  verificationStatus: 'SUBMITTED' | 'UNDER_REVIEW' | 'BOARD_REVIEW' | 'APPROVED' | 'REJECTED';
  boardDecision?: 'APPROVED' | 'REJECTED';
  submittedAt: string;
  resolvedAt?: string;
}

export interface BoardMember {
  id: string;
  role: string;
  appointmentRef: string;
  termStart: string;
  termEnd: string;
  independenceStatus: 'INDEPENDENT' | 'DISCLOSED_INTEREST';
  active: boolean;
}

export interface PayoutAuthorization {
  id: string;
  eventId: string;
  recipientType: 'FIRST_RECIPIENT' | 'SECOND_RECIPIENT' | 'CHARITY' | 'EMERGENCY';
  recipientRef: string;
  amount: number;
  status: 'PENDING_MAKER' | 'PENDING_CHECKER' | 'RELEASED' | 'REJECTED';
  makerAdmin: string | null;
  makerNotes: string | null;
  checkerAdmin: string | null;
  checkerNotes: string | null;
  bankRef: string | null;
  createdAt: string;
  releasedAt: string | null;
}
