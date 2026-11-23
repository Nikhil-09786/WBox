'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function ApplyPage() {
  const [applicantRef, setApplicantRef] = useState('');
  const [purpose, setPurpose] = useState('');
  const [amount, setAmount] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [requestId, setRequestId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `emg_${Date.now().toString().slice(-6)}`;
    setRequestId(id);
    setSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="pb-6" style={{ borderBottom: '1px solid #262626' }}>
        <span className="label block mb-1">Section 4.5 Emergency Vault Protocol</span>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Emergency Assistance Request
        </h1>
        <p className="text-xs mt-1" style={{ color: '#71717a' }}>
          Permanent Emergency Vault funds are restricted to verified natural disasters, large-scale humanitarian crises, and acute emergency medical assistance. Governed by a 5-member independent board.
        </p>
      </div>

      <div className="card p-6 sm:p-8">
        {submitted ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-14 h-14 rounded-full border flex items-center justify-center mx-auto text-xl font-black" style={{ borderColor: '#3f3f3f', color: '#fff' }}>
              ✓
            </div>
            <h2 className="text-lg font-black text-white">Emergency Request Submitted</h2>
            <p className="text-xs max-w-md mx-auto" style={{ color: '#71717a' }}>
              Your application has been logged under reference ID <strong className="text-white mono">{requestId}</strong>. It will undergo formal verification before submission to the independent board for quorum and voting.
            </p>
            <div className="pt-4 flex justify-center gap-3">
              <Link href="/emergency" className="btn-primary text-xs">
                View Vault Policy <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 text-xs">
            <div>
              <label className="label block mb-1">Applicant Name / Community Representative</label>
              <input
                required
                type="text"
                placeholder="e.g. District Relief Nodal Lead"
                value={applicantRef}
                onChange={e => setApplicantRef(e.target.value)}
                className="input"
              />
            </div>

            <div>
              <label className="label block mb-1">Requested Amount (INR)</label>
              <input
                required
                type="number"
                min="1000"
                placeholder="e.g. 500000"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                className="input mono"
              />
            </div>

            <div>
              <label className="label block mb-1">Emergency Category & Factual Evidence Summary</label>
              <textarea
                required
                rows={4}
                placeholder="Describe the natural disaster, humanitarian crisis, or acute emergency circumstance, including supporting hospital/panchayat documentation references."
                value={purpose}
                onChange={e => setPurpose(e.target.value)}
                className="input resize-none"
              />
            </div>

            <div className="p-4 rounded-lg text-[11px]" style={{ background: '#080808', border: '1px solid #1a1a1a', color: '#71717a' }}>
              <strong className="text-white">Statutory Governance:</strong> The founder cannot unilaterally approve withdrawals. A minimum quorum of 4 of 5 independent board members with 4 affirmative votes is legally required for any emergency vault disbursement.
            </div>

            <button type="submit" className="btn-primary w-full justify-center py-3">
              Submit for Verification & Board Review
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
