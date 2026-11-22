'use client';

import React from 'react';
import { Eye, Lock, CheckCircle2, ShieldCheck, FileSpreadsheet, KeyRound, Database, UserX } from 'lucide-react';

export default function WhiteBlackExplainer() {
  return (
    <div className="w-full py-12">
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700 mb-3">
          <span>The Hybrid Transparency Philosophy</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Why White Box? Why Black Box?
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          True trust requires radical financial transparency, but humanitarian respect requires absolute privacy for vulnerable recipients. WBox uniquely isolates both.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        
        {/* WHITE BOX */}
        <div className="rounded-2xl border border-white/20 bg-gradient-to-br from-slate-900 to-slate-950 p-6 sm:p-8 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-white text-black font-black flex items-center justify-center text-base shadow-lg shadow-white/10">
                W
              </div>
              <div>
                <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                  <span>White Box</span>
                  <Eye className="w-4 h-4 text-emerald-400" />
                </h3>
                <p className="text-xs text-slate-400">The Public Explainable System</p>
              </div>
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              100% AUDITABLE
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed mb-6">
            Every single rupee contributed, allocated, or disbursed is permanently recorded in a public, immutable double-entry ledger. No secret pools, no hidden deductions.
          </p>

          <ul className="space-y-3 text-xs text-slate-300">
            <li className="flex items-start space-x-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Live Collection & Contributor Metrics:</strong> Total settled funds, contributor counts, and progress updated in real time.</span>
            </li>
            <li className="flex items-start space-x-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Formulaic 30/60/10 Allocation:</strong> Guaranteed 30% Charity, 60% Beneficiary Grants, 10% Operations published before contributions start.</span>
            </li>
            <li className="flex items-start space-x-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Double-Entry Ledger Proofs:</strong> Independent auditors can download and balance every journal posting mathematically.</span>
            </li>
            <li className="flex items-start space-x-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Verified Charity Utilization:</strong> Public documentation proving registered NGOs spent allocations on target causes.</span>
            </li>
          </ul>
        </div>

        {/* BLACK BOX */}
        <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-black via-slate-950 to-slate-900 p-6 sm:p-8 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-white border border-slate-700 font-black flex items-center justify-center text-base shadow-lg">
                B
              </div>
              <div>
                <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                  <span>Black Box</span>
                  <Lock className="w-4 h-4 text-blue-400" />
                </h3>
                <p className="text-xs text-slate-400">The Protected Privacy Vault</p>
              </div>
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
              ZERO-LEAK PRIVACY
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed mb-6">
            Sensitive identity documents, personal medical records, bank accounts, and donor identities are safeguarded with hardware-level envelope encryption.
          </p>

          <ul className="space-y-3 text-xs text-slate-300">
            <li className="flex items-start space-x-2.5">
              <KeyRound className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <span><strong>Encrypted Hardship Narratives:</strong> Medical distress and family hardship files are never publicly displayed without consent.</span>
            </li>
            <li className="flex items-start space-x-2.5">
              <UserX className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <span><strong>Zero Donor Bias Air-Gap:</strong> Grant reviewers have no access to contribution records, eliminating any conflict of interest or pay-to-win.</span>
            </li>
            <li className="flex items-start space-x-2.5">
              <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <span><strong>Maker-Checker Dual Sign-off:</strong> High-value payouts require two separate authenticated administrators before release.</span>
            </li>
            <li className="flex items-start space-x-2.5">
              <Database className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <span><strong>Anti-Fraud Screening:</strong> Background detection flags duplicate grant filings while protecting the dignity of genuine applicants.</span>
            </li>
          </ul>
        </div>

      </div>
    </div>
  );
}

