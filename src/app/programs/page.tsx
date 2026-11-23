'use client';
import React from 'react';

const PROGRAMS = [
  { type: 'DISTRICT', label: 'District WBox', freq: 'Daily',    scope: 'District-level residents' },
  { type: 'STATE',    label: 'State WBox',    freq: 'Weekly',   scope: 'State-level residents' },
  { type: 'COUNTRY',  label: 'Country WBox',  freq: 'Monthly',  scope: 'Country-level residents' },
  { type: 'WORLD',    label: 'World WBox',    freq: 'Annually', scope: 'Permitted international' },
];

export default function ProgramsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="pb-6" style={{ borderBottom: '1px solid #262626' }}>
        <span className="label block mb-1">Independent Programs</span>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">The Four WBox Programs</h1>
        <p className="text-xs mt-1 max-w-2xl" style={{ color: '#71717a' }}>
          Each program is completely independent. No money transfers between programs. No shared pool. No shared Emergency Vault. Each requires separate legal clearance per jurisdiction before it can open.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {PROGRAMS.map(p => (
          <div key={p.type} className="card p-7">
            <div className="flex items-center justify-between mb-5">
              <div>
                <span className="label block mb-1">{p.freq}</span>
                <h2 className="text-xl font-black text-white">{p.label}</h2>
                <p className="text-xs mt-0.5" style={{ color: '#71717a' }}>Eligible: {p.scope}</p>
              </div>
              <span className="badge">DRAFT</span>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-5">
              {[
                ['Events run', '0'],
                ['Total collected', '₹0'],
                ['Vault balance', '₹0'],
              ].map(([k, v]) => (
                <div key={String(k)} className="p-3 rounded-lg" style={{ background: '#080808', border: '1px solid #1a1a1a' }}>
                  <div className="text-[10px]" style={{ color: '#52525b' }}>{k}</div>
                  <div className="text-sm font-black text-white mono mt-0.5">{v}</div>
                </div>
              ))}
            </div>

            {/* Allocation reminder */}
            <div className="p-4 rounded-lg text-xs mono" style={{ background: '#080808', border: '1px solid #1a1a1a' }}>
              <div className="grid grid-cols-5 gap-1 text-center">
                {[['50%', '1st'], ['10%', '2nd'], ['20%', 'Charity'], ['10%', 'Vault'], ['10%', 'Ops']].map(([pct, lbl]) => (
                  <div key={lbl}>
                    <div className="font-black text-white">{pct}</div>
                    <div style={{ color: '#52525b' }}>{lbl}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 p-3 rounded-lg text-[11px]" style={{ background: '#111', border: '1px solid #1a1a1a', color: '#52525b' }}>
              <strong className="text-[#71717a]">Legal status:</strong> This program requires a written jurisdiction-specific legal opinion confirming the permissibility of the event structure before any event can open for contributions.
            </div>
          </div>
        ))}
      </div>

      {/* Independence rules */}
      <div className="card p-6">
        <h3 className="text-sm font-bold text-white mb-4">Program Independence Requirements</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            'No shared winner or recipient pool between programs',
            'No transfer of recipient allocations between events',
            'No automatic progression from district to state to country to world',
            'No shared Emergency Vault — each program has its own segregated reserve',
            "No use of another program's money to cover a shortfall",
            'Separate financial reporting for every event in every program',
            'Separate eligibility rules per program and jurisdiction',
            'Separate reserve identifiers and balances maintained independently',
          ].map((r, i) => (
            <div key={i} className="flex items-start gap-2 text-xs p-3 rounded-lg" style={{ background: '#080808', border: '1px solid #1a1a1a', color: '#a1a1aa' }}>
              <span className="shrink-0 font-bold text-white">—</span> {r}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
