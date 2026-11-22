import { NextResponse } from 'next/server';
import { store, submitGrantApplication } from '@/lib/store';

export async function GET() {
  return NextResponse.json({
    applications: store.grantApplications
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { applicantName, applicantEmail, category, requestedAmount, publicSummary, hardshipDetails } = body;

    if (!applicantName || !requestedAmount || !category) {
      return NextResponse.json({ error: 'Missing mandatory fields' }, { status: 400 });
    }

    const application = submitGrantApplication({
      applicantName,
      applicantEmail: applicantEmail || 'applicant@wb-box.org',
      category,
      requestedAmount: Number(requestedAmount),
      publicSummary: publicSummary || 'Assistance requested for verifiable emergency necessity.',
      hardshipDetails: hardshipDetails || 'Private hardship note provided under Black Box encryption.'
    });

    return NextResponse.json({
      success: true,
      application
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

