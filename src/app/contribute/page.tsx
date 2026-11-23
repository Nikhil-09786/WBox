'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const PROGRAMS = ['DISTRICT', 'STATE', 'COUNTRY', 'WORLD'] as const;
const PROGRAM_LABELS: Record<string, string> = {
  DISTRICT: 'District WBox (Daily)',
  STATE:    'State WBox (Weekly)',
  COUNTRY:  'Country WBox (Monthly)',
  WORLD:    'World WBox (Annual)',
};
const PRESETS = [100, 250, 500, 1000, 2500, 5000];

export default function ContributePage() {
  const [events, setEvents]           = useState<any[]>([]);
  const [selectedEvent, setEvent]     = useState<string>('');
  const [amount, setAmount]           = useState<number>(500);
  const [custom, setCustom]           = useState('');
  const [method, setMethod]           = useState('UPI');
  const [anonymous, setAnonymous]     = useState(false);
  const [submitting, setSubmitting]   = useState(false);
  const [receipt, setReceipt]         = useState<any>(null);
  const [error, setError]             = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/events').then(r => r.json()).then(d => {
      setEvents(d.events || []);
    }).catch(() => {});
  }, []);

  const gross   = custom ? parseFloat(custom) || 0 : amount;
  const fee     = Math.round(gross * 0.02 * 100) / 100;
  const net     = Math.max(0, Math.round((gross - fee) * 100) / 100);
  const first   = Math.round(net * 0.50 * 100) / 100;
  const second  = Math.round(net * 0.10 * 100) / 100;
  const charity = Math.round(net * 0.20 * 100) / 100;
  const vault   = Math.round(net * 0.10 * 100) / 100;
  const platform= Math.round((net - first - second - charity - vault) * 100) / 100;

  const openEvents = events.filter(e => e.status === 'OPEN');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (gross < 10) { setError('Minimum contribution is ₹10'); return; }
    if (!selectedEvent) { setError('Select an event to contribute to'); return; }
    setError(null); setSubmitting(true);
    try {
      const res = await fetch('/api/contributions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId: selectedEvent, amount: gross, paymentMethod: method, isAnonymous: anonymous }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setReceipt(data.contribution);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const fmt = (v: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(v);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <span className="label">Voluntary Contribution</span>
        <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">Contribute to an Event</h1>
        <p className="text-xs mt-1" style={{ color: '#71717a' }}>
          Every contribution is immediately recorded in the double-entry ledger. The allocation is shown before you confirm.
        </p>
      </div>

      {openEvents.length === 0 && (
        <div className="p-6 rounded-xl mb-8 text-sm text-center" style={{ background: '#111111', border: '1px solid #262626', color: '#71717a' }}>
          <strong className="text-white block mb-1">No events are currently open for contributions.</strong>
          All programs are in DRAFT or LEGAL_APPROVAL status. Events will only open once legal clearance is confirmed for each jurisdiction.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 card p-6 sm:p-8 space-y-6">

          {/* Event Selector */}
          <div>
            <label className="label block mb-2">Select Event</label>
            <select
              value={selectedEvent}
              onChange={e => setEvent(e.target.value)}
              className="input"
            >
              <option value="">— Choose an open event —</option>
              {openEvents.map(ev => (
                <option key={ev.id} value={ev.id}>
                  {PROGRAM_LABELS[ev.programType]} · Event #{ev.eventNumber} · {ev.geographicScope}
                </option>
              ))}
            </select>
          </div>

          {/* Amount Presets */}
          <div>
            <label className="label block mb-2">Contribution Amount (INR)</label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-3">
              {PRESETS.map(p => (
                <button key={p} type="button"
                  onClick={() => { setAmount(p); setCustom(''); }}
                  className={`py-2.5 rounded-lg text-sm font-bold border transition ${
                    amount === p && !custom
                      ? 'bg-white text-black border-white'
                      : 'border-[#262626] text-[#a1a1aa] hover:border-[#3f3f3f] hover:text-white'
                  }`}
                  style={{ background: amount === p && !custom ? '#fff' : '#111' }}
                >
                  ₹{p}
                </button>
              ))}
            </div>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold" style={{ color: '#52525b' }}>₹</span>
              <input type="number" min="10" step="10" placeholder="Custom amount"
                value={custom} onChange={e => setCustom(e.target.value)}
                className="input pl-7 mono" />
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <label className="label block mb-2">Payment Method</label>
            <div className="grid grid-cols-3 gap-2">
              {['UPI', 'CARD', 'NETBANKING'].map(m => (
                <button key={m} type="button" onClick={() => setMethod(m)}
                  className={`p-3 rounded-lg border text-xs font-bold transition ${
                    method === m
                      ? 'border-white bg-white text-black'
                      : 'border-[#262626] text-[#71717a] hover:border-[#3f3f3f]'
                  }`}
                  style={{ background: method === m ? '#fff' : '#111' }}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Anonymous toggle */}
          <label className="flex items-center gap-2 cursor-pointer select-none text-xs" style={{ color: '#a1a1aa' }}>
            <input type="checkbox" checked={anonymous} onChange={e => setAnonymous(e.target.checked)}
              className="rounded w-3.5 h-3.5" />
            Contribute anonymously (name not shown publicly)
          </label>

          {error && <div className="p-3 rounded-lg text-xs" style={{ background: '#1a1a1a', border: '1px solid #3f3f3f', color: '#a1a1aa' }}>{error}</div>}

          <button type="submit" disabled={submitting || openEvents.length === 0 || gross < 10}
            className="btn-primary w-full justify-center py-3.5 text-sm">
            {submitting ? 'Processing…' : `Confirm ₹${gross.toLocaleString('en-IN')} Contribution`}
          </button>

          <p className="text-[11px] text-center" style={{ color: '#52525b' }}>
            Contributions are voluntary. No returns, profits or prize guarantees. Allocations are fixed per the published event policy.
          </p>
        </form>

        {/* Real-time Allocation Breakdown */}
        <div className="lg:col-span-5 space-y-4">
          <div className="card p-6">
            <div className="flex items-center justify-between pb-4 mb-4" style={{ borderBottom: '1px solid #1a1a1a' }}>
              <h3 className="text-sm font-bold text-white">Transparent Allocation</h3>
              <span className="badge">DISCLOSED</span>
            </div>

            <div className="space-y-3 text-xs mono">
              <div className="flex justify-between">
                <span style={{ color: '#71717a' }}>Gross contribution</span>
                <span className="font-bold text-white">{fmt(gross)}</span>
              </div>
              <div className="flex justify-between py-1.5" style={{ borderTop: '1px solid #1a1a1a', borderBottom: '1px solid #1a1a1a' }}>
                <span style={{ color: '#71717a' }}>Gateway fee (~2% MDR)</span>
                <span style={{ color: '#52525b' }}>−{fmt(fee)}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span style={{ color: '#a1a1aa' }}>Net distributable</span>
                <span className="text-white">{fmt(net)}</span>
              </div>
            </div>

            <div className="mt-5 space-y-2">
              {[
                { pct: '50%', label: 'First Recipient',   val: first   },
                { pct: '10%', label: 'Second Recipient',  val: second  },
                { pct: '20%', label: 'Direct Charity',    val: charity },
                { pct: '10%', label: 'Emergency Vault',   val: vault   },
                { pct: '10%', label: 'Platform Ops',      val: platform},
              ].map((r, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg text-xs mono"
                  style={{ background: '#080808', border: '1px solid #1a1a1a' }}>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-white">{r.pct}</span>
                    <span style={{ color: '#71717a' }}>{r.label}</span>
                  </div>
                  <span className="font-bold text-white">{fmt(r.val)}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 flex justify-between text-[11px] mono" style={{ borderTop: '1px solid #1a1a1a', color: '#52525b' }}>
              <span>Sum check</span>
              <span className="text-white">{fmt(first + second + charity + vault + platform)} ≡ {fmt(net)}</span>
            </div>
          </div>

          <div className="card p-5 text-xs" style={{ color: '#71717a' }}>
            <strong className="text-white block mb-1">Ledger guarantee</strong>
            Every confirmed payment triggers an append-only double-entry journal entry. Visible on the{' '}
            <Link href="/transparency" className="text-white underline">Public Ledger</Link>.
          </div>
        </div>
      </div>

      {/* Receipt Modal */}
      {receipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.9)' }}>
          <div className="card max-w-md w-full p-7">
            <div className="text-center pb-4 mb-4" style={{ borderBottom: '1px solid #1a1a1a' }}>
              <div className="w-12 h-12 rounded-full border flex items-center justify-center mx-auto mb-3 text-xl font-black" style={{ borderColor: '#3f3f3f', color: '#fff', background: '#1a1a1a' }}>✓</div>
              <h3 className="text-lg font-black text-white">Contribution Recorded</h3>
              <p className="text-xs mt-1" style={{ color: '#71717a' }}>Settled and posted to the public ledger.</p>
            </div>
            <div className="space-y-2 text-xs mono py-2">
              {[
                ['Receipt ID', receipt.id],
                ['Amount',     `₹${receipt.amount.toLocaleString('en-IN')}`],
                ['Gateway Ref',receipt.paymentRef],
                ['Timestamp',  new Date(receipt.createdAt).toLocaleString('en-IN')],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between py-1" style={{ borderBottom: '1px solid #1a1a1a' }}>
                  <span style={{ color: '#52525b' }}>{k}</span>
                  <span className="text-white">{v}</span>
                </div>
              ))}
            </div>
            <div className="mt-5 flex gap-3">
              <Link href="/transparency" className="btn-ghost flex-1 justify-center">View on Ledger</Link>
              <button onClick={() => setReceipt(null)} className="btn-primary flex-1 justify-center">Done</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
