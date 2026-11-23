import { DoubleEntryLedgerEngine } from './ledger/engine';
import {
  Contribution,
  CharityOrganization,
  EmergencyReserve,
  EventInstance,
  EventProgram,
  PayoutAuthorization,
  ProgramType,
} from './types';

// ─── Genuine zero-state store — no fake amounts ───────────────────────────────

interface WBoxState {
  programs: EventProgram[];
  events: EventInstance[];
  contributions: Contribution[];
  charities: CharityOrganization[];
  emergencyReserves: EmergencyReserve[];
  payoutAuthorizations: PayoutAuthorization[];
  ledgerEngine: DoubleEntryLedgerEngine;
}

const PROGRAM_DEFAULTS: EventProgram[] = [
  {
    id: 'prog-district',
    name: 'District WBox',
    programType: 'DISTRICT',
    geographicScope: 'TBD — requires legal approval per district',
    frequency: 'DAILY',
    legalStatus: 'PENDING',
    description: 'Daily community contribution pool for eligible district residents.',
  },
  {
    id: 'prog-state',
    name: 'State WBox',
    programType: 'STATE',
    geographicScope: 'TBD — requires legal approval per state',
    frequency: 'WEEKLY',
    legalStatus: 'PENDING',
    description: 'Weekly contribution pool for eligible state residents.',
  },
  {
    id: 'prog-country',
    name: 'Country WBox',
    programType: 'COUNTRY',
    geographicScope: 'TBD — requires legal approval per jurisdiction',
    frequency: 'MONTHLY',
    legalStatus: 'PENDING',
    description: 'Monthly contribution pool for eligible national residents.',
  },
  {
    id: 'prog-world',
    name: 'World WBox',
    programType: 'WORLD',
    geographicScope: 'TBD — requires legal approval per permitted country',
    frequency: 'ANNUALLY',
    legalStatus: 'PENDING',
    description: 'Annual global contribution pool across legally permitted countries.',
  },
];

function createEmptyEvent(programId: string, programType: ProgramType, eventNumber: number): EventInstance {
  const now = new Date();
  const future = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  return {
    id: `evt-${programType.toLowerCase()}-${eventNumber}`,
    programId,
    programType,
    geographicScope: 'TBD — pending legal clearance',
    eventNumber,
    status: 'DRAFT',
    currency: 'INR',
    firstRecipientPct: 50,
    secondRecipientPct: 10,
    charityPct: 20,
    emergencyVaultPct: 10,
    platformPct: 10,
    grossCollected: 0,
    processingFees: 0,
    refunds: 0,
    chargebacks: 0,
    netDistributable: 0,
    contributorCount: 0,
    opensAt: now.toISOString(),
    closesAt: future.toISOString(),
  };
}

const globalForWB = globalThis as unknown as { wboxState: WBoxState | undefined };

export const store: WBoxState = globalForWB.wboxState ?? {
  programs: PROGRAM_DEFAULTS,
  events: [
    createEmptyEvent('prog-district', 'DISTRICT', 1),
    createEmptyEvent('prog-state',    'STATE',    1),
    createEmptyEvent('prog-country',  'COUNTRY',  1),
    createEmptyEvent('prog-world',    'WORLD',    1),
  ],
  contributions: [],
  charities: [],
  emergencyReserves: PROGRAM_DEFAULTS.map(p => ({
    id: `reserve-${p.id}`,
    programId: p.id,
    programType: p.programType,
    geographicScope: p.geographicScope,
    currency: 'INR',
    principalBalance: 0,
    accruedReturns: 0,
    status: 'ACTIVE' as const,
  })),
  payoutAuthorizations: [],
  ledgerEngine: new DoubleEntryLedgerEngine(),
};

if (process.env.NODE_ENV !== 'production') {
  globalForWB.wboxState = store;
}

// ─── Store helpers ────────────────────────────────────────────────────────────

export function getEventsByProgram(programType: ProgramType) {
  return store.events.filter(e => e.programType === programType);
}

export function addContribution(params: {
  eventId: string;
  programType: ProgramType;
  amount: number;
  paymentMethod: string;
  isAnonymous: boolean;
}) {
  const event = store.events.find(e => e.id === params.eventId);
  if (!event) throw new Error('Event not found');
  if (event.status !== 'OPEN') throw new Error('This event is not open for contributions');

  const feeRate   = 0.02; // 2% MDR
  const feeAmount = Math.round(params.amount * feeRate * 100) / 100;
  const netAmount = Math.round((params.amount - feeAmount) * 100) / 100;

  const id = `ctr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const contribution: Contribution = {
    id,
    eventId:       params.eventId,
    programType:   params.programType,
    amount:        params.amount,
    feeDeducted:   feeAmount,
    netAmount,
    currency:      event.currency,
    status:        'SUCCESS',
    paymentMethod: params.paymentMethod,
    paymentRef:    `sim_${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
    isAnonymous:   params.isAnonymous,
    createdAt:     new Date().toISOString(),
  };

  store.contributions.unshift(contribution);
  event.grossCollected    = Math.round((event.grossCollected    + params.amount) * 100) / 100;
  event.processingFees    = Math.round((event.processingFees    + feeAmount)     * 100) / 100;
  event.netDistributable  = Math.round((event.netDistributable  + netAmount)     * 100) / 100;
  event.contributorCount += 1;

  store.ledgerEngine.recordContribution({ contributionId: id, grossAmount: params.amount, feeAmount, netAmount });
  return contribution;
}

export function lockEventAndAllocate(eventId: string) {
  const event = store.events.find(e => e.id === eventId);
  if (!event) throw new Error('Event not found');

  event.status = 'ALLOCATED';
  const label  = `${event.programType} WBox Event #${event.eventNumber}`;

  const result = store.ledgerEngine.recordEventAllocation({
    eventId: event.id,
    eventLabel: label,
    netDistributable: event.netDistributable,
    firstPct:    event.firstRecipientPct,
    secondPct:   event.secondRecipientPct,
    charityPct:  event.charityPct,
    vaultPct:    event.emergencyVaultPct,
    platformPct: event.platformPct,
  });

  // Update emergency reserve principal
  const reserve = store.emergencyReserves.find(r => r.programId === event.programId);
  if (reserve) {
    reserve.principalBalance = Math.round((reserve.principalBalance + result.vaultAmount) * 100) / 100;
  }

  event.stateHash = `sha256_${Math.random().toString(36).substring(2, 14)}_${Date.now().toString(16)}`;
  return { event, ...result };
}

export function openEvent(eventId: string) {
  const event = store.events.find(e => e.id === eventId);
  if (!event) throw new Error('Event not found');
  event.status = 'OPEN';
  return event;
}

export function releasePayout(payoutId: string, checkerAdmin: string, notes: string) {
  const payout = store.payoutAuthorizations.find(p => p.id === payoutId);
  if (!payout) throw new Error('Payout not found');
  if (payout.makerAdmin === checkerAdmin) throw new Error('Maker-Checker violation: same admin cannot approve own payout.');

  payout.status        = 'RELEASED';
  payout.checkerAdmin  = checkerAdmin;
  payout.checkerNotes  = notes;
  payout.releasedAt    = new Date().toISOString();
  payout.bankRef       = `UTR-${Date.now().toString().slice(-8)}-${Math.random().toString(36).substring(2,5).toUpperCase()}`;
  return payout;
}
