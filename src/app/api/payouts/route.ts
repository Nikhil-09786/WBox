import { NextResponse } from 'next/server';
import { releasePayout, store } from '@/lib/store';

export async function GET() {
  return NextResponse.json({
    payouts: store.payoutAuthorizations
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, payoutId, adminName, notes } = body;

    if (action === 'CHECKER_RELEASE') {
      const result = releasePayout(payoutId, adminName || 'Admin.B', notes || 'Authorized.');
      return NextResponse.json({ success: true, result });
    }

    return NextResponse.json({ error: 'Unknown payout action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
