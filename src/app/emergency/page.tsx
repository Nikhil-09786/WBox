'use client';
import React from 'react';

const BOARD_ROLES = [
  { role: 'Independent Chairperson',       desc: 'Leads board proceedings and ensures quorum.' },
  { role: 'Finance & Audit Specialist',    desc: 'Reviews reserve financial controls and audit findings.' },
  { role: 'Legal & Compliance Specialist', desc: 'Assesses legality of emergency requests and policy adherence.' },
  { role: 'Humanitarian Sector Specialist',desc: 'Evaluates humanitarian merit and urgency of requests.' },
  { role: 'Technology & Risk Specialist',  desc: 'Oversees platform integrity and security risk assessment.' },
];

const ELIGIBLE_PURPOSES = [
  'Natural disasters — flood, earthquake, cyclone, fire',
  'Large-scale humanitarian emergencies',
  'Urgent emergency medical assistance not covered otherwise',
  'Emergency shelter and essential supplies',
  'Other extraordinary humanitarian situations within published policy',
];

const PROHIBITED = [
  'Ordinary personal living expenses',
  'Platform operating costs or marketing',
  'Recipient award payments from any event',
  'Business expansion or salaries',
  'Any purpose not approved by the independent board',
];

export default function EmergencyPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">

      <div className="pb-6" style={{ borderBottom: '1px solid #262626' }}>
        <span className="label block mb-1">10% Permanent Reserve</span>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Emergency Vault Policy</h1>
        <p className="text-xs mt-1 max-w-2xl" style={{ color: '#71717a' }}>
          10% of every event's net distributable amount enters a permanent, board-governed Emergency Vault. The principal accumulates indefinitely and cannot be used for ordinary platform operations.
        </p>
      </div>

      {/* Current Vault Balances */}
      <div>
        <h2 className="text-sm font-bold text-white mb-4">Current Reserve Balances</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {['District', 'State', 'Country', 'World'].map(scope => (
            <div key={scope} className="card p-5">
              <div className="label mb-2">{scope} WBox Vault</div>
              <div className="text-2xl font-black text-white mono">₹0</div>
              <div className="text-xs mt-1" style={{ color: '#52525b' }}>Accrued returns: ₹0</div>
              <div className="text-[11px] mt-3 p-2 rounded" style={{ background: '#080808', border: '1px solid #1a1a1a', color: '#52525b' }}>
                No events run. Vault unfunded.
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Vault Rules */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div className="card p-6">
          <h3 className="text-sm font-bold text-white mb-4">Eligible Emergency Purposes</h3>
          <ul className="space-y-2">
            {ELIGIBLE_PURPOSES.map((p, i) => (
              <li key={i} className="flex gap-2 text-xs" style={{ color: '#a1a1aa' }}>
                <span className="shrink-0">✓</span> {p}
              </li>
            ))}
          </ul>
        </div>

        <div className="card p-6">
          <h3 className="text-sm font-bold text-white mb-4">Prohibited Uses</h3>
          <ul className="space-y-2">
            {PROHIBITED.map((p, i) => (
              <li key={i} className="flex gap-2 text-xs" style={{ color: '#71717a' }}>
                <span className="shrink-0">✗</span> {p}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Withdrawal Process */}
      <div className="card p-6">
        <h3 className="text-sm font-bold text-white mb-5">Emergency Withdrawal Process (10 Steps)</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            'Verified applicant submits an emergency request with identity, purpose, evidence and amount.',
            'Independent verification team checks all documentation.',
            'Board receives the verified evidence and conflict-of-interest declarations.',
            'Minimum quorum of 4 of 5 board members must be present.',
            '4 affirmative votes required for approval (conflicted members recuse).',
            'Board issues a digitally signed approval record.',
            'Finance team prepares the payment instruction.',
            'Independent payment authorizers (not the board) approve the transfer.',
            'Custodian executes the transfer to the verified recipient.',
            'Transaction is fully reconciled and a public audit report is published.',
          ].map((step, i) => (
            <div key={i} className="flex gap-3 text-xs p-3 rounded-lg" style={{ background: '#080808', border: '1px solid #1a1a1a' }}>
              <span className="shrink-0 font-black mono text-white">{i + 1}.</span>
              <span style={{ color: '#a1a1aa' }}>{step}</span>
            </div>
          ))}
        </div>
        <div className="mt-5 p-4 rounded-lg text-xs" style={{ background: '#111', border: '1px solid #262626', color: '#71717a' }}>
          <strong className="text-white">Founder authority:</strong> The platform founder cannot unilaterally approve or execute an emergency withdrawal. Board approval and independent payment authorization are both required.
        </div>
      </div>

      {/* Independent Board */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-sm font-bold text-white">Independent Board Structure</h3>
          <span className="badge">5 MEMBERS · PENDING APPOINTMENT</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {BOARD_ROLES.map((m, i) => (
            <div key={i} className="p-4 rounded-xl text-center" style={{ background: '#080808', border: '1px solid #1a1a1a' }}>
              <div className="w-10 h-10 rounded-full border flex items-center justify-center mx-auto mb-3 font-black text-sm" style={{ borderColor: '#3f3f3f', color: '#52525b' }}>
                {i + 1}
              </div>
              <div className="text-xs font-bold text-white leading-tight mb-1">{m.role}</div>
              <div className="text-[10px]" style={{ color: '#52525b' }}>{m.desc}</div>
              <div className="mt-3 text-[9px] font-bold tracking-widest uppercase" style={{ color: '#3f3f3f' }}>Not Appointed</div>
            </div>
          ))}
        </div>
        <div className="mt-5 p-4 rounded-lg text-xs" style={{ background: '#111', border: '1px solid #1a1a1a', color: '#71717a' }}>
          Board members are appointed through an independent nominations process established in the WBox governing charter. The founder cannot unilaterally appoint, remove or veto board members.
        </div>
      </div>

      {/* Investment Policy */}
      <div className="card p-6">
        <h3 className="text-sm font-bold text-white mb-4">Reserve Investment Policy — Preservation First</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs" style={{ color: '#a1a1aa' }}>
          <div>
            <div className="font-bold text-white mb-2">Permitted</div>
            <ul className="space-y-1">
              {['Preservation-first cash management', 'Permitted fixed deposits per local law', 'Board-approved instruments only'].map((x, i) => <li key={i}>✓ {x}</li>)}
            </ul>
          </div>
          <div>
            <div className="font-bold text-white mb-2">Strictly Prohibited</div>
            <ul className="space-y-1">
              {['Speculative investments', 'Cryptocurrency speculation', 'Lending to founders, directors or employees', 'Use as collateral for platform borrowing', 'Any instrument not board-approved'].map((x, i) => <li key={i}>✗ {x}</li>)}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
