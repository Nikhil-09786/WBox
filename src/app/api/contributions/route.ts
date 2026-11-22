import { NextResponse } from 'next/server';
import { addContribution, store } from '@/lib/store';

export async function GET() {
  // Public view: mask non-anonymous emails or details
  const publicList = store.contributions.map(c => ({
    id: c.id,
    donorName: c.isAnonymous ? 'Kind Contributor' : c.donorName,
    amount: c.amount,
    currency: c.currency,
    status: c.status,
    paymentMethod: c.paymentMethod,
    createdAt: c.createdAt,
    isAnonymous: c.isAnonymous
  }));

  return NextResponse.json({
    totalContributions: store.contributions.length,
    contributions: publicList
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { donorName, donorEmail, amount, paymentMethod, isAnonymous } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Valid contribution amount is required' }, { status: 400 });
    }

    if (store.currentCycle.status !== 'OPEN') {
      return NextResponse.json({ error: 'Contributions are only accepted when cycle is OPEN' }, { status: 400 });
    }

    const contribution = addContribution(
      donorName || 'Generous Supporter',
      donorEmail || 'contributor@wb-box.org',
      Number(amount),
      paymentMethod || 'UPI',
      !!isAnonymous
    );

    return NextResponse.json({
      success: true,
      contribution,
      cycle: store.currentCycle
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

