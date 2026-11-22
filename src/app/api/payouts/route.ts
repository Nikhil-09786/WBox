import { NextResponse } from 'next/server';
import { approveGrantByMaker, releasePayoutByChecker, store } from '@/lib/store';

export async function GET() {
  return NextResponse.json({
    payouts: store.payoutAuthorizations
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, payoutId, applicationId, amount, adminName, notes } = body;

    if (action === 'MAKER_APPROVE') {
      const result = approveGrantByMaker(applicationId, Number(amount), adminName, notes);
      return NextResponse.json({ success: true, result });
    }

    if (action === 'CHECKER_RELEASE') {
      const result = releasePayoutByChecker(payoutId, adminName, notes);
      return NextResponse.json({ success: true, result });
    }

    return NextResponse.json({ error: 'Unknown payout action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

