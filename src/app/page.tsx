'use client';
import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import WhiteBlackExplainer from '@/components/WhiteBlackExplainer';

const PROGRAMS = [
  { type: 'DISTRICT', label: 'District WBox', freq: 'Daily', scope: 'District residents' },
  { type: 'STATE',    label: 'State WBox',    freq: 'Weekly',  scope: 'State residents' },
  { type: 'COUNTRY',  label: 'Country WBox',  freq: 'Monthly', scope: 'National residents' },
  { type: 'WORLD',    label: 'World WBox',    freq: 'Annually',scope: 'Permitted countries' },
];

const ALLOCATION = [
  { label: '50%', name: 'First Recipient',    desc: 'Largest single beneficiary of the event pool.' },
  { label: '10%', name: 'Second Recipient',   desc: 'Second awarded participant per event.' },
  { label: '20%', name: 'Direct Charity',     desc: 'Transferred to verified registered charities.' },
  { label: '10%', name: 'Emergency Vault',    desc: 'Permanent reserve. Board-controlled. Never touched for operations.' },
  { label: '10%', name: 'Platform Operations',desc: 'Disclosed fee covering technology, compliance and administration.' },
];

export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

      {/* HERO */}
      <section className="pt-20 pb-16 grid-bg relative">
        <div className="max-w-3xl mx-auto text-center">
          <span className="badge mb-5 inline-block">Pre-Launch · Legal Clearance Pending</span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
            Community Contribution.<br />
            <span style={{ color: '#a1a1aa' }}>Genuinely Transparent.</span>
          </h1>
          <p className="mt-5 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto" style={{ color: '#71717a' }}>
            WBox is a digital platform that collects voluntary contributions and distributes them under a fixed, publicly disclosed five-bucket allocation. Every rupee is tracked on an immutable double-entry ledger. No fake amounts. No demo data.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/contribute" className="btn-primary">
              Contribute to an Event <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link href="/transparency" className="btn-ghost">
              Inspect Public Ledger
            </Link>
          </div>
        </div>
      </section>

      {/* NOTICE BANNER */}
      <div className="mb-12 p-5 rounded-xl text-xs" style={{ background: '#111111', border: '1px solid #262626', color: '#71717a' }}>
        <strong className="text-white">Important legal notice:</strong>{"  "}
        No WBox event is currently open for contributions. All programs are in DRAFT status pending jurisdiction-specific legal clearance. The platform will not activate the recipient award mechanism in any country until a written legal opinion confirms its permissibility under applicable law — including but not limited to the Prize Chits and Money Circulation Schemes (Banning) Act, 1978; the Online Gaming Act, 2025; and all other relevant statutes.
      </div>

      {/* 4 PROGRAMS */}
      <section className="mb-16">
        <div className="mb-8">
          <span className="label">The Four Programs</span>
          <h2 className="text-xl font-black text-white mt-1">Independent. Separate. No Shared Pools.</h2>
          <p className="text-xs mt-1" style={{ color: '#71717a' }}>
            Each program operates independently. No money moves between programs. No shared emergency reserve.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PROGRAMS.map(p => (
            <div key={p.type} className="card p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="badge">{p.freq}</span>
                <span className="text-[9px] font-mono" style={{ color: '#52525b' }}>DRAFT</span>
              </div>
              <h3 className="text-sm font-bold text-white">{p.label}</h3>
              <p className="text-xs mt-1 mb-4" style={{ color: '#71717a' }}>{p.scope}</p>
              <div className="pt-3 border-t" style={{ borderColor: '#1a1a1a' }}>
                <div className="text-xs font-mono" style={{ color: '#52525b' }}>Total collected</div>
                <div className="text-lg font-black text-white mono mt-0.5">₹0</div>
                <div className="text-[10px] mt-1" style={{ color: '#52525b' }}>0 contributors · No active event</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ALLOCATION MODEL */}
      <section className="mb-16">
        <div className="mb-8">
          <span className="label">Fixed Allocation Policy</span>
          <h2 className="text-xl font-black text-white mt-1">Every Rupee Has a Destination</h2>
          <p className="text-xs mt-1" style={{ color: '#71717a' }}>
            Percentages are locked before each event opens. They cannot change after contributions begin.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {ALLOCATION.map((a, i) => (
            <div key={i} className="card p-5">
              <div className="text-3xl font-black text-white mono mb-2">{a.label}</div>
              <div className="text-xs font-bold text-white mb-1">{a.name}</div>
              <p className="text-[11px] leading-relaxed" style={{ color: '#71717a' }}>{a.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 p-4 rounded-xl text-xs text-center mono" style={{ background: '#111111', border: '1px solid #262626', color: '#71717a' }}>
          50 + 10 + 20 + 10 + 10 = 100% · Applied to net settled contributions after disclosed payment processing costs
        </div>
      </section>

      {/* WHITE / BLACK EXPLAINER */}
      <WhiteBlackExplainer />

      {/* EMERGENCY VAULT */}
      <section className="mb-16 p-7 rounded-2xl" style={{ background: '#111111', border: '1px solid #262626' }}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <span className="label mb-2 block">Permanent Emergency Reserve</span>
            <h2 className="text-lg font-black text-white">The Emergency Vault — Never Touched for Operations</h2>
            <p className="text-xs mt-2 leading-relaxed" style={{ color: '#71717a' }}>
              10% of every event's net distributable amount is deposited into a segregated, board-governed Emergency Vault. It accumulates indefinitely. It cannot be used for platform expenses, marketing or recipient awards. Only a verified humanitarian emergency with five-member independent board approval can authorize a withdrawal.
            </p>
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {['District Vault', 'State Vault', 'Country Vault', 'World Vault'].map((v) => (
                <div key={v} className="p-3 rounded-lg" style={{ background: '#080808', border: '1px solid #1a1a1a' }}>
                  <div className="text-[10px] font-semibold mb-1" style={{ color: '#52525b' }}>{v}</div>
                  <div className="text-base font-black text-white mono">₹0</div>
                  <div className="text-[9px] mt-0.5" style={{ color: '#3f3f3f' }}>No events run yet</div>
                </div>
              ))}
            </div>
          </div>
          <Link href="/emergency" className="btn-ghost shrink-0">
            Board & Vault Policy <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

    </div>
  );
}
