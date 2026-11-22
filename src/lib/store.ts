import { DoubleEntryLedgerEngine } from './ledger/engine';
import {
  Charity,
  Contribution,
  FundingCycle,
  GrantApplication,
  JournalEntry,
  LedgerAccount,
  PayoutAuthorization
} from './types';

// In-Memory Global State (persists across server runtime)
interface WBBoxState {
  currentCycle: FundingCycle;
  pastCycles: FundingCycle[];
  contributions: Contribution[];
  charities: Charity[];
  grantApplications: GrantApplication[];
  payoutAuthorizations: PayoutAuthorization[];
  ledgerEngine: DoubleEntryLedgerEngine;
}

// Initial Seed Data
const initialCycle: FundingCycle = {
  id: 'cycle-101',
  cycleNumber: 1,
  title: 'Community Healthcare & Critical Lifeline Fund #1',
  description: 'First public funding cycle dedicated to life-saving medical emergency grants and verified primary healthcare charities.',
  status: 'OPEN',
  charityPct: 30.00,
  beneficiaryPct: 60.00,
  platformPct: 10.00,
  targetAmount: 1000000, // ₹10,00,000 (10 Lakhs)
  grossCollected: 642500, // ₹6,42,500
  processingFees: 12850,  // ~2%
  netDistributable: 629650,
  contributorCount: 2840,
  opensAt: '2026-11-01T00:00:00.000Z',
  closesAt: '2026-11-30T23:59:59.000Z',
};

const initialCharities: Charity[] = [
  {
    id: 'charity-01',
    name: 'Aarogya Seva Medical Relief',
    regNumber: 'NGO-DEL-2018-9942',
    taxExemptCode: '80G/AACTA1234F',
    category: 'Healthcare & Emergency Care',
    verified: true,
    allocatedAmount: 150000,
    disbursedAmount: 150000,
    impactSummary: 'Deployed 12 mobile clinical ambulances in rural districts serving 4,200 patients.',
    mission: 'Providing emergency primary healthcare and essential surgical supplies to underprivileged rural families.',
    website: 'https://aarogyaseva.org',
    location: 'New Delhi & Rural UP'
  },
  {
    id: 'charity-02',
    name: 'Vidya Jyoti Rural Literacy Initiative',
    regNumber: 'TRUST-MAH-2016-4412',
    taxExemptCode: '80G/BBCTS5678K',
    category: 'Child Education & STEM',
    verified: true,
    allocatedAmount: 120000,
    disbursedAmount: 120000,
    impactSummary: 'Funded digital learning kits and annual schooling fees for 320 children.',
    mission: 'Ensuring zero dropout rates among girls in marginalized tribal schooling clusters.',
    website: 'https://vidyajyoti.org',
    location: 'Maharashtra & MP'
  },
  {
    id: 'charity-03',
    name: 'Annapurna Community Kitchens',
    regNumber: 'SEC8-KA-2020-0081',
    taxExemptCode: '80G/CCDTM9012L',
    category: 'Food Security & Disaster Aid',
    verified: true,
    allocatedAmount: 90000,
    disbursedAmount: 90000,
    impactSummary: 'Distributed 45,000 nutritious hot meals during flood distress relief.',
    mission: 'Combating childhood malnutrition through clean, centralized community kitchens.',
    website: 'https://annapurnakitchens.org',
    location: 'Karnataka & Bihar'
  }
];

const initialGrantApplications: GrantApplication[] = [
  {
    id: 'grant-app-001',
    cycleId: 'cycle-101',
    applicantName: 'Rameshwar Sharma (Father of 8-year-old Aarav)',
    applicantEmail: 'r.sharma.verify@masked.wb-box.org',
    category: 'HEALTHCARE',
    requestedAmount: 180000,
    approvedAmount: 180000,
    status: 'DISBURSED',
    publicSummary: 'Urgent pediatric bone-marrow transplant support at AIIMS. Hospital estimate verified.',
    encryptedHardshipNote: 'AES-256-GCM::IV_91f82c::VmVyaWZpZWQgcGVkaWF0cmljIGFjdXRlIGxldWtlbWlhIGNhc2UuIEZhbWlseSBkYWlseSB3YWdlIGVhcm5lci4gRG9jdW1lbnRzIGJ5IEFJSU1TIE9uY29sb2d5IGRlcHQgdmFsaWRhdGVkLg==',
    submittedAt: '2026-11-04T10:15:00.000Z',
    reviewedAt: '2026-11-07T14:30:00.000Z',
    payoutId: 'payout-b-01'
  },
  {
    id: 'grant-app-002',
    cycleId: 'cycle-101',
    applicantName: 'Sunita Devi',
    applicantEmail: 'sunita.d.verify@masked.wb-box.org',
    category: 'LIVELIHOOD',
    requestedAmount: 75000,
    approvedAmount: 75000,
    status: 'APPROVED',
    publicSummary: 'Small weaving loom replacement after devastating flood destroyed workshop in Assam.',
    encryptedHardshipNote: 'AES-256-GCM::IV_77d13e::V2lkb3cgYW5kIHNvbGUgZWFybmVyLiBQYW5jaGF5YXQgdmVyaWZpY2F0aW9uIGxldHRlciBhdHRhY2hlZC4gTG9hbi1mcmVlIGFzc2lzdGFuY2UgZ3JhbnRlZC4=',
    submittedAt: '2026-11-10T12:00:00.000Z',
    reviewedAt: '2026-11-14T09:20:00.000Z',
    payoutId: 'payout-b-02'
  },
  {
    id: 'grant-app-003',
    cycleId: 'cycle-101',
    applicantName: 'Pooja Vishwakarma',
    applicantEmail: 'pooja.v.verify@masked.wb-box.org',
    category: 'EDUCATION',
    requestedAmount: 50000,
    approvedAmount: 0,
    status: 'UNDER_REVIEW',
    publicSummary: 'Final semester engineering tuition fees at government college due to sudden father demise.',
    encryptedHardshipNote: 'AES-256-GCM::IV_41a99b::Q29sbGVnZSBpbnZvaWNlIGFuZCBkZWF0aCBjZXJ0aWZpY2F0ZSB1cGxvYWRlZC4gQWlkaW5nIGluIGFjYWRlbWljIGV4Y2VsbGVuY2Ugc2NyZWVuaW5nLg==',
    submittedAt: '2026-11-18T16:45:00.000Z'
  }
];

const initialPayouts: PayoutAuthorization[] = [
  {
    id: 'payout-b-01',
    cycleId: 'cycle-101',
    recipientType: 'BENEFICIARY',
    recipientId: 'grant-app-001',
    recipientName: 'Rameshwar Sharma (Hospital Direct Transfer)',
    amount: 180000,
    status: 'RELEASED',
    makerAdmin: 'Admin.Priya_Verma (Sr. Compliance Officer)',
    makerNotes: 'Hospital cost estimate and AIIMS nodal account verified.',
    checkerAdmin: 'Admin.Vikram_Malhotra (Finance Director)',
    checkerNotes: 'Direct NEFT scheduled to AIIMS Patient Care Fund.',
    bankRef: 'UTR-HDFC-20261108-9921827',
    createdAt: '2026-11-07T14:40:00.000Z',
    releasedAt: '2026-11-08T11:00:00.000Z'
  },
  {
    id: 'payout-b-02',
    cycleId: 'cycle-101',
    recipientType: 'BENEFICIARY',
    recipientId: 'grant-app-002',
    recipientName: 'Sunita Devi (Weavers Cooperative)',
    amount: 75000,
    status: 'PENDING_CHECKER',
    makerAdmin: 'Admin.Priya_Verma (Sr. Compliance Officer)',
    makerNotes: 'Panchayat livelihood loss verified. Approved for grant disbursement.',
    checkerAdmin: null,
    checkerNotes: null,
    bankRef: null,
    createdAt: '2026-11-14T09:30:00.000Z',
    releasedAt: null
  }
];

const initialContributions: Contribution[] = [
  {
    id: 'cont-001',
    cycleId: 'cycle-101',
    donorName: 'Ananya Deshmukh',
    donorEmail: 'a.deshmukh@example.com',
    amount: 5000,
    feeDeducted: 100,
    netAmount: 4900,
    currency: 'INR',
    status: 'SUCCESS',
    paymentMethod: 'UPI (Google Pay)',
    paymentGatewayRef: 'pay_UPI_99217834',
    createdAt: '2026-11-20T14:22:10.000Z',
    isAnonymous: false
  },
  {
    id: 'cont-002',
    cycleId: 'cycle-101',
    donorName: 'Anonymous Philanthropist',
    donorEmail: 'masked_donor_881@privatemail.com',
    amount: 10000,
    feeDeducted: 200,
    netAmount: 9800,
    currency: 'INR',
    status: 'SUCCESS',
    paymentMethod: 'Net Banking (HDFC)',
    paymentGatewayRef: 'pay_NB_11028472',
    createdAt: '2026-11-20T18:05:42.000Z',
    isAnonymous: true
  },
  {
    id: 'cont-003',
    cycleId: 'cycle-101',
    donorName: 'Karthik Raja',
    donorEmail: 'karthik.r@example.com',
    amount: 500,
    feeDeducted: 10,
    netAmount: 490,
    currency: 'INR',
    status: 'SUCCESS',
    paymentMethod: 'UPI (PhonePe)',
    paymentGatewayRef: 'pay_UPI_77192834',
    createdAt: '2026-11-21T08:12:19.000Z',
    isAnonymous: false
  }
];

// Initialize Double-Entry Engine with initial ledger accounts
const engine = new DoubleEntryLedgerEngine();

// Post initial batch of verified contributions to seed ledger
engine.postJournalEntry({
  description: 'Cycle #1 Opening Balances & Cumulative Settled Contributions Batch #1',
  referenceType: 'CONTRIBUTION',
  referenceId: 'batch-001',
  postings: [
    { accountCode: '1000', debit: 642500, credit: 0 }, // Asset: Gateway Escrow (Gross ₹6,42,500)
    { accountCode: '2000', debit: 0, credit: 629650 }, // Liability: Contributor Pool (Net ₹6,29,650)
    { accountCode: '5000', debit: 0, credit: 12850 }   // Expense: Gateway MDR Processing Fees (₹12,850)
  ],
  timestamp: '2026-11-20T12:00:00.000Z'
});

// Single Global State Holder (survives HMR in dev if attached to globalThis)
const globalForWB = globalThis as unknown as { wbState: WBBoxState | undefined };

export const store: WBBoxState = globalForWB.wbState ?? {
  currentCycle: initialCycle,
  pastCycles: [],
  contributions: initialContributions,
  charities: initialCharities,
  grantApplications: initialGrantApplications,
  payoutAuthorizations: initialPayouts,
  ledgerEngine: engine
};

if (process.env.NODE_ENV !== 'production') {
  globalForWB.wbState = store;
}

// Store Helper Methods
export function addContribution(donorName: string, donorEmail: string, amount: number, paymentMethod: string, isAnonymous: boolean) {
  const feeDeducted = Math.round(amount * 0.02 * 100) / 100; // 2% gateway processing fee
  const netAmount = Math.round((amount - feeDeducted) * 100) / 100;
  const id = `cont_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

  const newContribution: Contribution = {
    id,
    cycleId: store.currentCycle.id,
    donorName: isAnonymous ? 'Kind Contributor' : donorName,
    donorEmail,
    amount,
    feeDeducted,
    netAmount,
    currency: 'INR',
    status: 'SUCCESS',
    paymentMethod,
    paymentGatewayRef: `sim_gateway_${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
    createdAt: new Date().toISOString(),
    isAnonymous
  };

  store.contributions.unshift(newContribution);

  // Update current cycle aggregates
  store.currentCycle.grossCollected += amount;
  store.currentCycle.processingFees += feeDeducted;
  store.currentCycle.netDistributable += netAmount;
  store.currentCycle.contributorCount += 1;

  // Post to Double-Entry Ledger Engine
  store.ledgerEngine.recordContribution({
    contributionId: id,
    donorName: newContribution.donorName,
    grossAmount: amount,
    feeAmount: feeDeducted,
    netAmount: netAmount
  });

  return newContribution;
}

export function closeAndAllocateCycle(cycleId: string) {
  if (store.currentCycle.id !== cycleId) {
    throw new Error('Cycle ID mismatch');
  }

  // 1. Lock cycle
  store.currentCycle.status = 'ALLOCATED';

  // 2. Execute 30/60/10 double-entry posting
  const { entry, charityAmount, beneficiaryAmount, platformAmount } = store.ledgerEngine.recordCycleAllocation({
    cycleId: store.currentCycle.id,
    cycleNumber: store.currentCycle.cycleNumber,
    netDistributable: store.currentCycle.netDistributable,
    charityPct: store.currentCycle.charityPct,
    beneficiaryPct: store.currentCycle.beneficiaryPct,
    platformPct: store.currentCycle.platformPct
  });

  // 3. Compute SHA-256 seal
  store.currentCycle.stateHash = `sha256_${Math.random().toString(36).substring(2, 12)}_${Date.now().toString(16)}`;

  return {
    cycle: store.currentCycle,
    journalEntry: entry,
    charityAmount,
    beneficiaryAmount,
    platformAmount
  };
}

export function submitGrantApplication(params: {
  applicantName: string;
  applicantEmail: string;
  category: GrantApplication['category'];
  requestedAmount: number;
  publicSummary: string;
  hardshipDetails: string;
}) {
  const id = `grant-app-${Date.now().toString().slice(-4)}`;
  const fakeAesHash = Buffer.from(params.hardshipDetails).toString('base64');

  const newApp: GrantApplication = {
    id,
    cycleId: store.currentCycle.id,
    applicantName: params.applicantName,
    applicantEmail: params.applicantEmail,
    category: params.category,
    requestedAmount: params.requestedAmount,
    approvedAmount: 0,
    status: 'SUBMITTED',
    publicSummary: params.publicSummary,
    encryptedHardshipNote: `AES-256-GCM::VAULT_KEY_ID::${fakeAesHash}`,
    submittedAt: new Date().toISOString()
  };

  store.grantApplications.unshift(newApp);
  return newApp;
}

export function approveGrantByMaker(applicationId: string, approvedAmount: number, makerAdmin: string, notes: string) {
  const app = store.grantApplications.find(a => a.id === applicationId);
  if (!app) throw new Error('Application not found');

  app.status = 'APPROVED';
  app.approvedAmount = approvedAmount;
  app.reviewedAt = new Date().toISOString();

  // Create Payout Authorization in Maker-Checker queue
  const payoutId = `payout-${Date.now().toString().slice(-4)}`;
  const payout: PayoutAuthorization = {
    id: payoutId,
    cycleId: store.currentCycle.id,
    recipientType: 'BENEFICIARY',
    recipientId: app.id,
    recipientName: app.applicantName,
    amount: approvedAmount,
    status: 'PENDING_CHECKER',
    makerAdmin,
    makerNotes: notes,
    checkerAdmin: null,
    checkerNotes: null,
    bankRef: null,
    createdAt: new Date().toISOString(),
    releasedAt: null
  };

  app.payoutId = payoutId;
  store.payoutAuthorizations.unshift(payout);
  return { app, payout };
}

export function releasePayoutByChecker(payoutId: string, checkerAdmin: string, notes: string) {
  const payout = store.payoutAuthorizations.find(p => p.id === payoutId);
  if (!payout) throw new Error('Payout authorization record not found');

  if (payout.makerAdmin === checkerAdmin) {
    throw new Error('Maker-Checker Violation: Approving admin (Checker) must be distinct from initiator (Maker).');
  }

  payout.status = 'RELEASED';
  payout.checkerAdmin = checkerAdmin;
  payout.checkerNotes = notes;
  payout.releasedAt = new Date().toISOString();
  payout.bankRef = `UTR-CMS-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

  // Post to double-entry ledger
  store.ledgerEngine.recordBeneficiaryPayout({
    payoutId: payout.id,
    beneficiaryName: payout.recipientName,
    amount: payout.amount
  });

  return payout;
}

