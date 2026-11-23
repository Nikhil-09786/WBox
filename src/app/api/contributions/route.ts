import { NextResponse } from 'next/server';
import { addContribution, store } from '@/lib/store';
import { ProgramType } from '@/lib/types';

export async function GET() {
  const publicList = store.contributions.map(c => ({
    id: c.id,
    eventId: c.eventId,
    programType: c.programType,
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
    const { eventId, amount, paymentMethod, isAnonymous, programType } = body;

    if (!amount || Number(amount) <= 0) {
      return NextResponse.json({ error: 'Valid contribution amount is required' }, { status: 400 });
    }

    if (!eventId) {
      return NextResponse.json({ error: 'eventId is required' }, { status: 400 });
    }

    const event = store.events.find(e => e.id === eventId);
    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    if (event.status !== 'OPEN') {
      return NextResponse.json({ error: 'This event is not open for contributions' }, { status: 400 });
    }

    const contribution = addContribution({
      eventId,
      programType: (programType || event.programType) as ProgramType,
      amount: Number(amount),
      paymentMethod: paymentMethod || 'UPI',
      isAnonymous: !!isAnonymous
    });

    return NextResponse.json({
      success: true,
      contribution,
      event
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
