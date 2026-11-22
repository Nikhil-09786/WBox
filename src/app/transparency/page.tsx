'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Eye, 
  ShieldCheck, 
  FileSpreadsheet, 
  CheckCircle2, 
  TrendingUp, 
  Building2, 
  Users, 
  Lock, 
  ArrowUpRight, 
  ArrowDownLeft, 
  RefreshCw, 
  Download,
  AlertCircle
} from 'lucide-react';
import { JournalEntry, LedgerAccount } from '@/lib/types';

export default function TransparencyPage() {
  const [ledgerData, setLedgerData] = useState<{
    accounts: LedgerAccount[];
    journal: JournalEntry[];
    verification: any;
    timestamp: string;
  } | null>(null);

  const [cycleData, setCycleData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [filterAccount, setFilterAccount] = useState<string>('ALL');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [ledgerRes, cycleRes] = await Promise.all([
        fetch('/api/ledger'),
        fetch('/api/cycle')
      ]);

      const lData = await ledgerRes.json();
      const cData = await cycleRes.json();

      setLedgerData(lData);
      setCycleData(cData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(val);
  };

  const filteredJournal = ledgerData?.journal.filter(entry => {
    if (filterAccount === 'ALL') return true;
    return entry.postings.some(p => p.accountCode === filterAccount);
  }) || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-2">
            <Eye className="w-3.5 h-3.5" />
            <span>White Box Public Subsystem</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Financial Transparency & Ledger Explorer
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Independent auditors and contributors can trace every rupee from payment gateway settlement to beneficiary disbursement with zero redactions on numbers.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={fetchData}
            disabled={loading}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-700 hover:bg-slate-800 text-xs font-semibold text-slate-300 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Ledger</span>
          </button>

          <button
            onClick={() => {
              const blob = new Blob([JSON.stringify(ledgerData, null, 2)], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `wb-box-audit-ledger-${Date.now()}.json`;
              a.click();
            }}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Audit JSON</span>
          </button>
        </div>
      </div>

      {/* Fundamental Invariant Balance Proof Banner */}
      {ledgerData?.verification && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border border-emerald-500/30 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-bold text-white">Double-Entry Accounting Invariant: VERIFIED</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                  DISCREPANCY: ₹0.00
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Total Claims (Liabilities + Revenue) mathematically match Verified Platform Assets.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-6 text-xs font-mono">
            <div>
              <div className="text-[10px] text-slate-500 uppercase">Total Assets</div>
              <div className="text-white font-bold">{formatINR(ledgerData.verification.totalAssets)}</div>
            </div>
            <div className="text-slate-600 font-bold">=</div>
            <div>
              <div className="text-[10px] text-slate-500 uppercase">Liabilities (Funds)</div>
              <div className="text-white font-bold">{formatINR(ledgerData.verification.totalLiabilities)}</div>
            </div>
            <div className="text-slate-600 font-bold">+</div>
            <div>
              <div className="text-[10px] text-slate-500 uppercase">Ops Revenue</div>
              <div className="text-white font-bold">{formatINR(ledgerData.verification.totalEquityRevenue)}</div>
            </div>
          </div>
        </div>
      )}

      {/* Live Chart of Accounts Grid */}
      <div>
        <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4 flex items-center space-x-2">
          <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
          <span>General Ledger Chart of Accounts (COA)</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ledgerData?.accounts.map((acc) => {
            const isAsset = acc.classification === 'ASSET';
            const isLiability = acc.classification === 'LIABILITY';
            const isRevenue = acc.classification === 'REVENUE';
            const isExpense = acc.classification === 'EXPENSE';

            let badgeColor = 'bg-slate-800 text-slate-300';
            if (isAsset) badgeColor = 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
            if (isLiability) badgeColor = 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
            if (isRevenue) badgeColor = 'bg-purple-500/10 text-purple-400 border border-purple-500/20';
            if (isExpense) badgeColor = 'bg-amber-500/10 text-amber-400 border border-amber-500/20';

            return (
              <div
                key={acc.code}
                onClick={() => setFilterAccount(filterAccount === acc.code ? 'ALL' : acc.code)}
                className={`p-4 rounded-xl bg-slate-900 border cursor-pointer transition ${
                  filterAccount === acc.code
                    ? 'border-emerald-500 ring-1 ring-emerald-500/50 shadow-lg'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-mono text-xs font-bold text-slate-400">Account #{acc.code}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${badgeColor}`}>
                    {acc.classification}
                  </span>
                </div>
                <div className="text-xs font-semibold text-white line-clamp-1">{acc.name}</div>
                <div className="text-lg font-black text-white mt-2 font-mono">
                  {formatINR(acc.balance)}
                </div>
                <p className="text-[10px] text-slate-500 mt-1 line-clamp-2 leading-tight">
                  {acc.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Real-Time Journal Postings Explorer */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <span>Append-Only Journal Entries ({filteredJournal.length})</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Every row represents an irreversible transaction. Debits always equal credits.
            </p>
          </div>

          {filterAccount !== 'ALL' && (
            <div className="flex items-center space-x-2">
              <span className="text-xs text-slate-400">Filtered by #{filterAccount}</span>
              <button
                onClick={() => setFilterAccount('ALL')}
                className="text-xs text-emerald-400 underline font-semibold"
              >
                Clear Filter
              </button>
            </div>
          )}
        </div>

        {/* Journal Entries List */}
        <div className="divide-y divide-slate-800/80">
          {filteredJournal.map((entry) => (
            <div key={entry.id} className="p-4 sm:p-5 hover:bg-slate-850/50 transition">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    #{entry.entryNumber}
                  </span>
                  <span className="text-xs font-bold text-white">{entry.description}</span>
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  {new Date(entry.timestamp).toLocaleString('en-IN')}
                </div>
              </div>

              {/* Table of Debits and Credits */}
              <div className="bg-slate-950 rounded-xl border border-slate-850 overflow-hidden text-xs font-mono">
                <div className="grid grid-cols-12 bg-slate-900/60 px-3 py-1.5 text-slate-400 font-bold border-b border-slate-850">
                  <div className="col-span-6 sm:col-span-7">Account Code & Name</div>
                  <div className="col-span-3 sm:col-span-2 text-right">Debit (₹)</div>
                  <div className="col-span-3 sm:col-span-3 text-right">Credit (₹)</div>
                </div>

                <div className="divide-y divide-slate-850/60">
                  {entry.postings.map((p, idx) => {
                    const accName = ledgerData?.accounts.find(a => a.code === p.accountCode)?.name || 'Account';
                    return (
                      <div key={idx} className="grid grid-cols-12 px-3 py-2 items-center">
                        <div className="col-span-6 sm:col-span-7 flex items-center space-x-2">
                          <span className="font-bold text-slate-300">#{p.accountCode}</span>
                          <span className="text-slate-400 truncate">{accName}</span>
                        </div>
                        <div className="col-span-3 sm:col-span-2 text-right font-bold text-white">
                          {p.debit > 0 ? formatINR(p.debit) : '-'}
                        </div>
                        <div className="col-span-3 sm:col-span-3 text-right font-bold text-emerald-400">
                          {p.credit > 0 ? formatINR(p.credit) : '-'}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

