import { CHART_OF_ACCOUNTS } from './accounts';
import { JournalEntry, LedgerAccount, Posting } from '../types';

export class DoubleEntryLedgerEngine {
  private accounts: Map<string, LedgerAccount>;
  private journal: JournalEntry[];
  private nextEntryNumber: number;

  constructor() {
    this.accounts = new Map();
    this.journal = [];
    this.nextEntryNumber = 1;

    Object.values(CHART_OF_ACCOUNTS).forEach(coa => {
      this.accounts.set(coa.code, { ...coa, balance: 0 });
    });
  }

  public getAccounts(): LedgerAccount[] {
    return Array.from(this.accounts.values());
  }

  public getAccount(code: string): LedgerAccount | undefined {
    return this.accounts.get(code);
  }

  public getJournal(): JournalEntry[] {
    return [...this.journal];
  }

  public postJournalEntry(params: {
    description: string;
    referenceType: JournalEntry['referenceType'];
    referenceId: string;
    postings: Posting[];
    isReversal?: boolean;
    timestamp?: string;
  }): JournalEntry {
    const { description, referenceType, referenceId, postings, isReversal, timestamp } = params;

    if (!postings || postings.length < 2) {
      throw new Error('A journal entry must contain at least two postings.');
    }

    let totalDebit = 0;
    let totalCredit = 0;

    for (const p of postings) {
      if (p.debit < 0 || p.credit < 0) throw new Error(`Negative posting on account ${p.accountCode}`);
      if (p.debit > 0 && p.credit > 0) throw new Error(`Single posting has both debit and credit on ${p.accountCode}`);
      if (!this.accounts.has(p.accountCode)) throw new Error(`Unknown account: ${p.accountCode}`);
      totalDebit  += p.debit;
      totalCredit += p.credit;
    }

    const roundedDebit  = Math.round(totalDebit  * 100) / 100;
    const roundedCredit = Math.round(totalCredit * 100) / 100;
    if (Math.abs(roundedDebit - roundedCredit) > 0.001) {
      throw new Error(`Out of balance — DR: ₹${roundedDebit} ≠ CR: ₹${roundedCredit}`);
    }

    for (const p of postings) {
      const acc = this.accounts.get(p.accountCode)!;
      const delta =
        acc.classification === 'ASSET' || acc.classification === 'EXPENSE'
          ? p.debit - p.credit
          : p.credit - p.debit;
      acc.balance = Math.round((acc.balance + delta) * 100) / 100;
    }

    const entry: JournalEntry = {
      id: `je_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      entryNumber: this.nextEntryNumber++,
      timestamp: timestamp || new Date().toISOString(),
      description,
      referenceType,
      referenceId,
      postings,
      isReversal: !!isReversal,
    };

    this.journal.push(entry);
    return entry;
  }

  /** Record a confirmed contribution */
  public recordContribution(params: {
    contributionId: string;
    grossAmount: number;
    feeAmount: number;
    netAmount: number;
  }): JournalEntry {
    const { contributionId, grossAmount, feeAmount, netAmount } = params;
    return this.postJournalEntry({
      description: `Contribution settled — Gross ₹${grossAmount}, MDR ₹${feeAmount}`,
      referenceType: 'CONTRIBUTION',
      referenceId: contributionId,
      postings: [
        { accountCode: '1000', debit: grossAmount, credit: 0 },
        { accountCode: '2000', debit: 0, credit: netAmount },
        { accountCode: '5000', debit: 0, credit: feeAmount },
      ],
    });
  }

  /** Execute the 50/10/20/10/10 event allocation */
  public recordEventAllocation(params: {
    eventId: string;
    eventLabel: string;
    netDistributable: number;
    firstPct?: number;    // 50
    secondPct?: number;   // 10
    charityPct?: number;  // 20
    vaultPct?: number;    // 10
    platformPct?: number; // 10
  }): {
    entry: JournalEntry;
    firstAmount: number;
    secondAmount: number;
    charityAmount: number;
    vaultAmount: number;
    platformAmount: number;
  } {
    const {
      eventId, eventLabel, netDistributable,
    } = params;
    const fPct = params.firstPct    ?? 50;
    const sPct = params.secondPct   ?? 10;
    const cPct = params.charityPct  ?? 20;
    const vPct = params.vaultPct    ?? 10;
    const pPct = params.platformPct ?? 10;

    if (fPct + sPct + cPct + vPct + pPct !== 100) {
      throw new Error('Allocation percentages must sum to 100.');
    }

    const firstAmount   = Math.round(netDistributable * (fPct / 100) * 100) / 100;
    const secondAmount  = Math.round(netDistributable * (sPct / 100) * 100) / 100;
    const charityAmount = Math.round(netDistributable * (cPct / 100) * 100) / 100;
    const vaultAmount   = Math.round(netDistributable * (vPct / 100) * 100) / 100;
    // Platform absorbs any sub-paisa rounding residual
    const platformAmount = Math.round(
      (netDistributable - firstAmount - secondAmount - charityAmount - vaultAmount) * 100
    ) / 100;

    const entry = this.postJournalEntry({
      description: `${eventLabel} — Allocation locked: 50% 1st / 10% 2nd / 20% Charity / 10% Vault / 10% Ops`,
      referenceType: 'EVENT_ALLOCATION',
      referenceId: eventId,
      postings: [
        { accountCode: '2000', debit: netDistributable, credit: 0 },
        { accountCode: '2010', debit: 0, credit: firstAmount   },
        { accountCode: '2020', debit: 0, credit: secondAmount  },
        { accountCode: '2030', debit: 0, credit: charityAmount },
        { accountCode: '2040', debit: 0, credit: vaultAmount   },
        { accountCode: '4000', debit: 0, credit: platformAmount },
      ],
    });

    return { entry, firstAmount, secondAmount, charityAmount, vaultAmount, platformAmount };
  }

  /** Record a recipient payout */
  public recordRecipientPayout(params: {
    payoutId: string;
    label: string;
    amount: number;
    isFirst: boolean;
  }): JournalEntry {
    return this.postJournalEntry({
      description: `Recipient payout — ${params.label}`,
      referenceType: 'RECIPIENT_PAYOUT',
      referenceId: params.payoutId,
      postings: [
        { accountCode: params.isFirst ? '2010' : '2020', debit: params.amount, credit: 0 },
        { accountCode: '1010', debit: 0, credit: params.amount },
      ],
    });
  }

  /** Record a charity transfer */
  public recordCharityTransfer(params: {
    payoutId: string;
    charityName: string;
    amount: number;
  }): JournalEntry {
    return this.postJournalEntry({
      description: `Charity transfer — ${params.charityName}`,
      referenceType: 'CHARITY_TRANSFER',
      referenceId: params.payoutId,
      postings: [
        { accountCode: '2030', debit: params.amount, credit: 0 },
        { accountCode: '1010', debit: 0, credit: params.amount },
      ],
    });
  }

  /** Record Emergency Vault deposit (move from liability to segregated asset) */
  public recordVaultDeposit(params: { eventId: string; amount: number }): JournalEntry {
    return this.postJournalEntry({
      description: `Emergency Vault deposit — segregated to custody account`,
      referenceType: 'VAULT_DEPOSIT',
      referenceId: params.eventId,
      postings: [
        { accountCode: '2040', debit: params.amount, credit: 0 },
        { accountCode: '1020', debit: params.amount, credit: 0 }, // vault asset increases
        { accountCode: '1010', debit: 0, credit: params.amount * 2 }, // net bank out
      ],
    });
  }

  /** Verify accounting balance */
  public verifyLedgerBalance(): {
    isBalanced: boolean;
    totalAssets: number;
    totalLiabilities: number;
    totalRevenue: number;
    totalExpenses: number;
    discrepancy: number;
  } {
    let assets = 0, liabilities = 0, revenue = 0, expenses = 0;
    for (const acc of Array.from(this.accounts.values())) {
      if (acc.classification === 'ASSET')    assets      += acc.balance;
      if (acc.classification === 'LIABILITY') liabilities += acc.balance;
      if (acc.classification === 'REVENUE')   revenue     += acc.balance;
      if (acc.classification === 'EXPENSE')   expenses    += acc.balance;
    }
    const roundedA = Math.round(assets      * 100) / 100;
    const roundedC = Math.round((liabilities + revenue - expenses) * 100) / 100;
    const discrepancy = Math.abs(roundedA - roundedC);
    return {
      isBalanced: discrepancy < 0.01,
      totalAssets: roundedA,
      totalLiabilities: Math.round(liabilities * 100) / 100,
      totalRevenue:     Math.round(revenue      * 100) / 100,
      totalExpenses:    Math.round(expenses      * 100) / 100,
      discrepancy,
    };
  }
}
