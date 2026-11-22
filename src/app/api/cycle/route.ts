import { NextResponse } from 'next/server';
import { closeAndAllocateCycle, store } from '@/lib/store';

export async function GET() {
  const ledgerVerification = store.ledgerEngine.verifyLedgerBalance();

  return NextResponse.json({
    cycle: store.currentCycle,
    ledgerVerification,
    breakdown: {
      charityFund: Math.round(store.currentCycle.netDistributable * (store.currentCycle.charityPct / 100)),
      beneficiaryFund: Math.round(store.currentCycle.netDistributable * (store.currentCycle.beneficiaryPct / 100)),
      platformRevenue: Math.round(store.currentCycle.netDistributable * (store.currentCycle.platformPct / 100))
    }
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, cycleId } = body;

    if (action === 'CLOSE_AND_ALLOCATE') {
      const result = closeAndAllocateCycle(cycleId);
      return NextResponse.json({ success: true, result });
    }

    if (action === 'REOPEN') {
      store.currentCycle.status = 'OPEN';
      return NextResponse.json({ success: true, cycle: store.currentCycle });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

