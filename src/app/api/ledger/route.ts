import { NextResponse } from 'next/server';
import { store } from '@/lib/store';

export async function GET() {
  const accounts = store.ledgerEngine.getAccounts();
  const journal = store.ledgerEngine.getJournal();
  const verification = store.ledgerEngine.verifyLedgerBalance();

  return NextResponse.json({
    accounts,
    journal: journal.slice().reverse(), // newest first
    verification,
    timestamp: new Date().toISOString()
  });
}

