import { NextResponse } from 'next/server';
import { store, openEvent, lockEventAndAllocate } from '@/lib/store';

export async function GET() {
  const verification = store.ledgerEngine.verifyLedgerBalance();
  return NextResponse.json({
    events: store.events,
    programs: store.programs,
    verification,
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, eventId } = body;

    if (action === 'OPEN') {
      const event = openEvent(eventId);
      return NextResponse.json({ success: true, event });
    }

    if (action === 'CLOSE_AND_ALLOCATE') {
      const result = lockEventAndAllocate(eventId);
      return NextResponse.json({ success: true, result });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
