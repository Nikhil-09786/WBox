import { CHART_OF_ACCOUNTS } from './accounts';
import { JournalEntry, LedgerAccount, Posting } from '../types';

export class DoubleEntryLedgerEngine {
  private accounts: Map<string, LedgerAccount>;
  private journal: JournalEntry[];
  private nextEntryNumber: number;

  constructor(initialAccounts?: LedgerAccount[], initialJournal?: JournalEntry[]) {
    this.accounts = new Map();
    this.journal = initialJournal ? [...initialJournal] : [];
    this.nextEntryNumber = this.journal.length + 1;

    // Initialize accounts with default COA if not provided
    if (initialAccounts && initialAccounts.length > 0) {
      initialAccounts.forEach(acc => this.accounts.set(acc.code, { ...acc }));
    } else {
      Object.values(CHART_OF_ACCOUNTS).forEach(coa => {
        this.accounts.set(coa.code, {
          ...coa,
          balance: 0
        });
      });
    }
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

  /**
   * Post a balanced journal entry.
   * Enforces fundamental accounting equation: SUM(Debits) === SUM(Credits)
   */
  public postJournalEntry(params: {
    description: string;
    referenceType: 'CONTRIBUTION' | 'CYCLE_ALLOCATION' | 'GRANT_PAYOUT' | 'CHARITY_PAYOUT' | 'REFUND';
    referenceId: string;
    postings: Posting[];
    isReversal?: boolean;
    timestamp?: string;
  }): JournalEntry {
    const { description, referenceType, referenceId, postings, isReversal, timestamp } = params;

    // 1. Validate postings existence
    if (!postings || postings.length < 2) {
      throw new Error('A journal entry must contain at least two postings.');
    }

    // 2. Compute debit and credit sums
    let totalDebit = 0;
    let totalCredit = 0;

    for (const posting of postings) {
      if (posting.debit < 0 || posting.credit < 0) {
        throw new Error(`Negative amounts are prohibited. Account: ${posting.accountCode}`);
      }
      if (posting.debit > 0 && posting.credit > 0) {
        throw new Error(`A single posting line cannot contain both debit and credit. Account: ${posting.accountCode}`);
      }
      if (!this.accounts.has(posting.accountCode)) {
        throw new Error(`Unknown ledger account code: ${posting.accountCode}`);
      }

      totalDebit += posting.debit;
      totalCredit += posting.credit;
    }

    // Fix floating point epsilon (rounded to 2 decimal places)
    const roundedDebit = Math.round(totalDebit * 100) / 100;
    const roundedCredit = Math.round(totalCredit * 100) / 100;

    if (Math.abs(roundedDebit - roundedCredit) > 0.001) {
      throw new Error(
        `Journal entry out of balance! Total Debits: ₹${roundedDebit.toFixed(2)} != Total Credits: ₹${roundedCredit.toFixed(2)}`
      );
    }

    // 3. Update account balances based on account classification rules:
    // ASSET & EXPENSE: Debit increases (+), Credit decreases (-)
    // LIABILITY, EQUITY & REVENUE: Credit increases (+), Debit decreases (-)
    for (const posting of postings) {
      const account = this.accounts.get(posting.accountCode)!;
      let balanceDelta = 0;

      if (account.classification === 'ASSET' || account.classification === 'EXPENSE') {
        balanceDelta = posting.debit - posting.credit;
      } else {
        // LIABILITY, REVENUE, EQUITY
        balanceDelta = posting.credit - posting.debit;
      }

      account.balance = Math.round((account.balance + balanceDelta) * 100) / 100;
    }

    // 4. Record immutable entry
    const entry: JournalEntry = {
      id: `je_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      entryNumber: this.nextEntryNumber++,
      timestamp: timestamp || new Date().toISOString(),
      description,
      referenceType,
      referenceId,
      postings,
      isReversal: !!isReversal
    };

    this.journal.push(entry);
    return entry;
  }

  /**
   * Helper: Record an incoming contribution
   */
  public recordContribution(params: {
    contributionId: string;
    donorName: string;
    grossAmount: number;
    feeAmount: number;
    netAmount: number;
  }): JournalEntry {
    const { contributionId, donorName, grossAmount, feeAmount, netAmount } = params;

    return this.postJournalEntry({
      description: `Contribution received from ${donorName} (Gross: ₹${grossAmount}, Fee: ₹${feeAmount})`,
      referenceType: 'CONTRIBUTION',
      referenceId: contributionId,
      postings: [
        { accountCode: '1000', debit: grossAmount, credit: 0 }, // Asset: Gateway Escrow (+Gross)
        { accountCode: '2000', debit: 0, credit: netAmount },   // Liability: Unallocated Pool (+Net)
        { accountCode: '5000', debit: 0, credit: feeAmount }    // Expense: Gateway Fee
      ]
    });
  }

  /**
   * Helper: Execute the 30% Charity / 60% Beneficiary / 10% Platform allocation for a closing cycle
   */
  public recordCycleAllocation(params: {
    cycleId: string;
    cycleNumber: number;
    netDistributable: number;
    charityPct?: number;     // 30
    beneficiaryPct?: number; // 60
    platformPct?: number;    // 10
  }): { entry: JournalEntry; charityAmount: number; beneficiaryAmount: number; platformAmount: number } {
    const { cycleId, cycleNumber, netDistributable } = params;
    const cPct = params.charityPct ?? 30;
    const bPct = params.beneficiaryPct ?? 60;
    const pPct = params.platformPct ?? 10;

    if (cPct + bPct + pPct !== 100) {
      throw new Error('Allocation percentages must sum to 100%');
    }

    const charityAmount = Math.round(netDistributable * (cPct / 100) * 100) / 100;
    const beneficiaryAmount = Math.round(netDistributable * (bPct / 100) * 100) / 100;
    // Platform absorbs any tiny 1-paise rounding discrepancy
    const platformAmount = Math.round((netDistributable - charityAmount - beneficiaryAmount) * 100) / 100;

    const entry = this.postJournalEntry({
      description: `Funding Cycle #${cycleNumber} Locked Allocation: 30% Charity, 60% Beneficiary Grants, 10% Platform Ops`,
      referenceType: 'CYCLE_ALLOCATION',
      referenceId: cycleId,
      postings: [
        { accountCode: '2000', debit: netDistributable, credit: 0 },   // Unallocated Pool cleared (-Net)
        { accountCode: '2010', debit: 0, credit: charityAmount },      // Charity Fund (+30%)
        { accountCode: '2020', debit: 0, credit: beneficiaryAmount },  // Beneficiary Grant Fund (+60%)
        { accountCode: '4000', debit: 0, credit: platformAmount }      // Platform Operating Revenue (+10%)
      ]
    });

    return { entry, charityAmount, beneficiaryAmount, platformAmount };
  }

  /**
   * Helper: Record Beneficiary Grant Payout
   */
  public recordBeneficiaryPayout(params: {
    payoutId: string;
    beneficiaryName: string;
    amount: number;
  }): JournalEntry {
    const { payoutId, beneficiaryName, amount } = params;

    return this.postJournalEntry({
      description: `Grant payout settled to verified beneficiary: ${beneficiaryName}`,
      referenceType: 'GRANT_PAYOUT',
      referenceId: payoutId,
      postings: [
        { accountCode: '2020', debit: amount, credit: 0 }, // Liability: Beneficiary Fund decreased (-Amount)
        { accountCode: '1010', debit: 0, credit: amount }  // Asset: Bank Payout Account decreased (-Amount)
      ]
    });
  }

  /**
   * Helper: Record Charity Payout
   */
  public recordCharityPayout(params: {
    payoutId: string;
    charityName: string;
    amount: number;
  }): JournalEntry {
    const { payoutId, charityName, amount } = params;

    return this.postJournalEntry({
      description: `Charitable allocation disbursed to registered NGO: ${charityName}`,
      referenceType: 'CHARITY_PAYOUT',
      referenceId: payoutId,
      postings: [
        { accountCode: '2010', debit: amount, credit: 0 }, // Liability: Charity Fund decreased (-Amount)
        { accountCode: '1010', debit: 0, credit: amount }  // Asset: Bank Payout Account decreased (-Amount)
      ]
    });
  }

  /**
   * Verify fundamental accounting integrity across all accounts.
   */
  public verifyLedgerBalance(): { isBalanced: boolean; totalAssets: number; totalLiabilities: number; totalEquityRevenue: number; discrepancy: number } {
    let assets = 0;
    let liabilities = 0;
    let equityRevenue = 0;
    let expenses = 0;

    for (const acc of Array.from(this.accounts.values())) {
      if (acc.classification === 'ASSET') assets += acc.balance;
      else if (acc.classification === 'LIABILITY') liabilities += acc.balance;
      else if (acc.classification === 'REVENUE' || acc.classification === 'EQUITY') equityRevenue += acc.balance;
      else if (acc.classification === 'EXPENSE') expenses += acc.balance;
    }

    // GAAP Formula: Assets = Liabilities + Equity/Revenue - Expenses
    // or Net Assets = Total Claims
    const roundedAssets = Math.round(assets * 100) / 100;
    const roundedClaims = Math.round((liabilities + equityRevenue - expenses) * 100) / 100;
    const discrepancy = Math.abs(roundedAssets - roundedClaims);

    return {
      isBalanced: discrepancy < 0.01,
      totalAssets: roundedAssets,
      totalLiabilities: Math.round(liabilities * 100) / 100,
      totalEquityRevenue: Math.round(equityRevenue * 100) / 100,
      discrepancy
    };
  }
}

