'use client';
import React, { useState, useEffect } from 'react';
import { RefreshCw, Send } from 'lucide-react';

export default function AdminPage() {
  const [events, setEvents]   = useState<any[]>([]);
  const [payouts, setPayouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg]         = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const [checker, setChecker] = useState('Admin.B (Finance Director)');

  // Webhook simulator
  const [simAmt, setSimAmt]           = useState('1000');
  const [simProgram, setSimProgram]   = useState('DISTRICT');
  const [simSending, setSimSending]   = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const [eRes, pRes] = await Promise.all([fetch('/api/events'), fetch('/api/payouts')]);
      const eData = await eRes.json();
      const pData = await pRes.json();
      setEvents(eData.events || []);
      setPayouts(pData.payouts || []);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const cycleAction = async (action: string, eventId: string) => {
    setMsg(null);
    try {
      const res = await fetch('/api/cycle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, eventId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMsg({ type: 'ok', text: `${action} complete${data.result?.event?.stateHash ? ' · Seal: ' + data.result.event.stateHash : ''}` });
      load();
    } catch (err: any) { setMsg({ type: 'err', text: err.message }); }
  };

  const releasePayout = async (payoutId: string) => {
    setMsg(null);
    try {
      const res = await fetch('/api/payouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'CHECKER_RELEASE', payoutId, adminName: checker, notes: 'Verified and authorized.' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMsg({ type: 'ok', text: `Payout released · UTR: ${data.result.bankRef}` });
      load();
    } catch (err: any) { setMsg({ type: 'err', text: err.message }); }
  };

  const simulateWebhook = async (e: React.FormEvent) => {
    e.preventDefault(); setSimSending(true); setMsg(null);
    const event = events.find(ev => ev.programType === simProgram && ev.status === 'OPEN');
    if (!event) { setMsg({ type: 'err', text: `No OPEN event for ${simProgram}. Open one first.` }); setSimSending(false); return; }
    try {
      const res = await fetch('/api/contributions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId: event.id, amount: parseFloat(simAmt), paymentMethod: 'SIM_WEBHOOK', isAnonymous: true }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMsg({ type: 'ok', text: `Webhook ingested · ₹${simAmt} → Event ${event.id} · Ref: ${data.contribution.paymentRef}` });
      load();
    } catch (err: any) { setMsg({ type: 'err', text: err.message }); }
    finally { setSimSending(false); }
  };

  const fmt = (v: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(v);

  const STATUS_COLOR: Record<string, string> = {
    DRAFT: '#52525b', LEGAL_APPROVAL: '#71717a', SCHEDULED: '#a1a1aa',
    OPEN: '#ffffff', CLOSED: '#3f3f3f', ALLOCATED: '#a1a1aa', COMPLETED: '#71717a',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6" style={{ borderBottom: '1px solid #262626' }}>
        <div>
          <span className="label block mb-1">Black Box Governance Console</span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Platform Administration</h1>
          <p className="text-xs mt-1" style={{ color: '#71717a' }}>
            Maker-Checker dual-authorization. No single admin can approve and release a payment.
          </p>
        </div>
        <button onClick={load} className="btn-ghost self-start md:self-center">
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>

      {msg && (
        <div className="p-4 rounded-xl text-xs" style={{ background: '#111', border: `1px solid ${msg.type === 'ok' ? '#3f3f3f' : '#3f3f3f'}`, color: msg.type === 'ok' ? '#e4e4e7' : '#a1a1aa' }}>
          {msg.text}
        </div>
      )}

      {/* Event Controllers */}
      <div>
        <h2 className="text-sm font-bold text-white mb-4">Event Lifecycle Controller</h2>
        <div className="space-y-3">
          {events.map(ev => (
            <div key={ev.id} className="card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="badge">{ev.programType}</span>
                  <span className="text-xs font-bold" style={{ color: STATUS_COLOR[ev.status] || '#71717a' }}>● {ev.status}</span>
                </div>
                <div className="text-sm font-bold text-white">Event #{ev.eventNumber} · {ev.geographicScope}</div>
                <div className="text-xs mt-0.5 mono" style={{ color: '#52525b' }}>
                  Gross: {fmt(ev.grossCollected)} · Net: {fmt(ev.netDistributable)} · Contributors: {ev.contributorCount}
                </div>
                {ev.stateHash && <div className="text-[10px] mono mt-1" style={{ color: '#3f3f3f' }}>Seal: {ev.stateHash}</div>}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {ev.status === 'DRAFT' && (
                  <button onClick={() => cycleAction('OPEN', ev.id)} className="btn-primary text-xs">Open Event</button>
                )}
                {ev.status === 'OPEN' && (
                  <button onClick={() => cycleAction('CLOSE_AND_ALLOCATE', ev.id)} className="btn-primary text-xs">Lock & Allocate</button>
                )}
                {ev.status === 'ALLOCATED' && (
                  <span className="badge-white">Awaiting payouts</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Maker-Checker Queue */}
      <div>
        <h2 className="text-sm font-bold text-white mb-2">Maker-Checker Payout Authorization Queue</h2>
        <p className="text-xs mb-4" style={{ color: '#71717a' }}>
          High-value transfers require two independent admins. Checker cannot be the same person as Maker.
        </p>

        <div className="card p-5 mb-4 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="label block mb-1">Active Checker Identity</label>
            <select value={checker} onChange={e => setChecker(e.target.value)} className="input text-xs">
              <option value="Admin.B (Finance Director)">Admin.B (Finance Director)</option>
              <option value="Admin.C (Compliance Officer)">Admin.C (Compliance Officer)</option>
              <option value="Admin.D (External Auditor)">Admin.D (External Auditor)</option>
            </select>
          </div>
        </div>

        {payouts.length === 0 ? (
          <div className="p-10 rounded-xl text-center text-xs card" style={{ color: '#52525b' }}>
            No payouts pending. Payouts are created after an event is locked and allocations are verified.
          </div>
        ) : (
          <div className="divide-y card overflow-hidden" style={{ borderColor: '#1a1a1a' }}>
            {payouts.map(p => (
              <div key={p.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="badge mono">{p.id}</span>
                    <span className="badge">{p.status}</span>
                  </div>
                  <div className="text-sm font-bold text-white">{p.recipientRef}</div>
                  <div className="text-xs mt-0.5" style={{ color: '#71717a' }}>
                    Maker: {p.makerAdmin || '—'}
                  </div>
                  {p.bankRef && <div className="text-[11px] mono mt-1" style={{ color: '#3f3f3f' }}>UTR: {p.bankRef}</div>}
                </div>
                <div className="flex items-center gap-4 self-start sm:self-center">
                  <div className="text-right">
                    <div className="text-xs" style={{ color: '#52525b' }}>Amount</div>
                    <div className="text-base font-black text-white mono">{fmt(p.amount)}</div>
                  </div>
                  {p.status === 'PENDING_CHECKER' && (
                    <button onClick={() => releasePayout(p.id)} className="btn-primary text-xs">
                      Authorize Release
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Webhook Simulator */}
      <div className="card p-6">
        <h2 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
          <Send className="w-4 h-4" /> Gateway Webhook Simulator
        </h2>
        <p className="text-xs mb-5" style={{ color: '#71717a' }}>
          Simulates an inbound <code className="mono">payment.captured</code> event. Posts automatically to the double-entry ledger.
          An OPEN event must exist for the selected program.
        </p>
        <form onSubmit={simulateWebhook} className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <label className="label block mb-1">Program</label>
            <select value={simProgram} onChange={e => setSimProgram(e.target.value)} className="input text-xs">
              {['DISTRICT', 'STATE', 'COUNTRY', 'WORLD'].map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div className="flex-1">
            <label className="label block mb-1">Amount (₹)</label>
            <input type="number" min="10" value={simAmt} onChange={e => setSimAmt(e.target.value)} className="input mono" />
          </div>
          <div className="flex items-end">
            <button type="submit" disabled={simSending} className="btn-primary w-full sm:w-auto">
              {simSending ? 'Sending…' : 'Fire Webhook'}
            </button>
          </div>
        </form>
      </div>

    </div>
  );
}
