'use client';
import React, { useState, useEffect } from 'react';
import { RefreshCw, Download } from 'lucide-react';

export default function TransparencyPage() {
  const [data, setData]       = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState('ALL');

  const load = async () => {
    setLoading(true);
    try {
      const r = await fetch('/api/ledger');
      setData(await r.json());
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const fmt = (v: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(v);

  const journal = (data?.journal || []).filter((e: any) =>
    filter === 'ALL' ? true : e.postings.some((p: any) => p.accountCode === filter)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6" style={{ borderBottom: '1px solid #262626' }}>
        <div>
          <span className="label block mb-1">White Box — Public Subsystem</span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Financial Ledger Explorer</h1>
          <p className="text-xs mt-1" style={{ color: '#71717a' }}>Every journal entry. Every balance. Every allocation. Publicly verifiable.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={load} disabled={loading} className="btn-ghost">
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </button>
          <button
            onClick={() => {
              const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a'); a.href = url;
              a.download = `wbox-ledger-${Date.now()}.json`; a.click();
            }}
            className="btn-primary"
          >
            <Download className="w-3.5 h-3.5" /> Download Audit JSON
          </button>
        </div>
      </div>

      {/* Balance proof */}
      {data?.verification && (
        <div className="p-5 rounded-xl flex flex-col md:flex-row items-center justify-between gap-5"
          style={{ background: '#111111', border: '1px solid #262626' }}>
          <div>
            <div className="text-sm font-bold text-white flex items-center gap-2">
              Double-Entry Invariant: {data.verification.isBalanced ? '✓ BALANCED' : '✗ OUT OF BALANCE'}
            </div>
            <p className="text-xs mt-0.5" style={{ color: '#71717a' }}>
              Total Assets = Liabilities + Revenue − Expenses. Discrepancy: ₹{data.verification.discrepancy?.toFixed(2) ?? '0.00'}
            </p>
          </div>
          <div className="flex items-center gap-6 text-xs mono">
            {[
              ['Assets',      data.verification.totalAssets],
              ['Liabilities', data.verification.totalLiabilities],
              ['Revenue',     data.verification.totalRevenue],
            ].map(([k, v]) => (
              <div key={String(k)} className="text-center">
                <div style={{ color: '#52525b' }}>{k}</div>
                <div className="font-bold text-white">{fmt(Number(v))}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Chart of Accounts */}
      <div>
        <h2 className="text-sm font-bold text-white mb-4">Chart of Accounts (COA)</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {(data?.accounts || []).map((acc: any) => (
            <button key={acc.code} onClick={() => setFilter(filter === acc.code ? 'ALL' : acc.code)}
              className="text-left p-4 rounded-xl border transition"
              style={{
                background: filter === acc.code ? '#1a1a1a' : '#111',
                borderColor: filter === acc.code ? '#a1a1aa' : '#262626'
              }}>
              <div className="flex justify-between items-center mb-1">
                <span className="mono text-xs font-bold" style={{ color: '#52525b' }}>#{acc.code}</span>
                <span className="badge">{acc.classification}</span>
              </div>
              <div className="text-xs font-semibold text-white leading-tight">{acc.name}</div>
              <div className="text-lg font-black text-white mono mt-2">{fmt(acc.balance)}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Journal */}
      <div className="card overflow-hidden">
        <div className="p-5 flex items-center justify-between" style={{ borderBottom: '1px solid #1a1a1a' }}>
          <div>
            <h3 className="text-sm font-bold text-white">
              Append-Only Journal ({journal.length} {filter !== 'ALL' ? `filtered from ${data?.journal?.length || 0}` : 'total'})
            </h3>
            <p className="text-xs mt-0.5" style={{ color: '#71717a' }}>Immutable. No entry is ever edited. Corrections are new reversing entries.</p>
          </div>
          {filter !== 'ALL' && (
            <button onClick={() => setFilter('ALL')} className="btn-ghost text-xs">Clear Filter</button>
          )}
        </div>

        {journal.length === 0 ? (
          <div className="p-12 text-center text-xs" style={{ color: '#52525b' }}>
            No journal entries yet. Entries appear here once a contribution is recorded.
          </div>
        ) : (
          <div className="divide-y" style={{ borderColor: '#1a1a1a' }}>
            {journal.map((entry: any) => (
              <div key={entry.id} className="p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="badge-white mono">#{entry.entryNumber}</span>
                    <span className="text-xs font-bold text-white">{entry.description}</span>
                  </div>
                  <span className="text-[11px] mono" style={{ color: '#52525b' }}>
                    {new Date(entry.timestamp).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="rounded-lg overflow-hidden" style={{ background: '#080808', border: '1px solid #1a1a1a' }}>
                  <div className="grid grid-cols-12 px-3 py-1.5 text-[10px] font-bold uppercase" style={{ background: '#111', color: '#52525b', borderBottom: '1px solid #1a1a1a' }}>
                    <div className="col-span-7">Account</div>
                    <div className="col-span-2 text-right">Debit</div>
                    <div className="col-span-3 text-right">Credit</div>
                  </div>
                  {entry.postings.map((p: any, i: number) => (
                    <div key={i} className="grid grid-cols-12 px-3 py-2 text-xs mono items-center" style={{ borderBottom: i < entry.postings.length - 1 ? '1px solid #1a1a1a' : 'none' }}>
                      <div className="col-span-7 flex gap-2 items-center">
                        <span className="font-bold" style={{ color: '#52525b' }}>#{p.accountCode}</span>
                        <span style={{ color: '#71717a' }}>{data?.accounts?.find((a: any) => a.code === p.accountCode)?.name || ''}</span>
                      </div>
                      <div className="col-span-2 text-right font-bold text-white">{p.debit > 0 ? fmt(p.debit) : '—'}</div>
                      <div className="col-span-3 text-right font-bold text-white">{p.credit > 0 ? fmt(p.credit) : '—'}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
