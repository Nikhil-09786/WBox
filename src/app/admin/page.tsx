'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  RefreshCw, 
  ArrowRight, 
  Send, 
  Check, 
  X,
  UserCheck,
  Scale,
  Zap
} from 'lucide-react';
import { PayoutAuthorization } from '@/lib/types';

export default function AdminPage() {
  const [cycle, setCycle] = useState<any>(null);
  const [payouts, setPayouts] = useState<PayoutAuthorization[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Checker release form state
  const [checkerAdmin, setCheckerAdmin] = useState('Admin.Vikram_Malhotra (Finance Director)');
  const [checkerNotes, setCheckerNotes] = useState('Verified bank account & hospital cost invoice. Approved.');

  // Webhook simulator state
  const [simDonor, setSimDonor] = useState('Govind Nair');
  const [simAmount, setSimAmount] = useState('10000');
  const [simWebhookSending, setSimWebhookSending] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [cRes, pRes] = await Promise.all([
        fetch('/api/cycle'),
        fetch('/api/payouts')
      ]);

      const cData = await cRes.json();
      const pData = await pRes.json();

      setCycle(cData.cycle);
      setPayouts(pData.payouts || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCycleAction = async (action: 'CLOSE_AND_ALLOCATE' | 'REOPEN') => {
    setActionMsg(null);
    try {
      const res = await fetch('/api/cycle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, cycleId: cycle.id })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setActionMsg({
        type: 'success',
        text: action === 'CLOSE_AND_ALLOCATE'
          ? `Cycle locked & 30/60/10 double-entry allocation journal posted! SHA-256 seal: ${data.result.cycle.stateHash}`
          : 'Cycle reopened for voluntary contributions.'
      });
      fetchData();
    } catch (err: any) {
      setActionMsg({ type: 'error', text: err.message });
    }
  };

  const handleCheckerRelease = async (payoutId: string) => {
    setActionMsg(null);
    try {
      const res = await fetch('/api/payouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'CHECKER_RELEASE',
          payoutId,
          adminName: checkerAdmin,
          notes: checkerNotes
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setActionMsg({
        type: 'success',
        text: `Dual-Authorization Complete! Payout ${payoutId} settled. UTR: ${data.result.bankRef}`
      });
      fetchData();
    } catch (err: any) {
      setActionMsg({ type: 'error', text: err.message });
    }
  };

  const handleSimulateWebhook = async (e: React.FormEvent) => {
    e.preventDefault();
    setSimWebhookSending(true);
    setActionMsg(null);

    try {
      const res = await fetch('/api/contributions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          donorName: simDonor,
          donorEmail: 'sim.donor@example.com',
          amount: parseFloat(simAmount),
          paymentMethod: 'UPI (Gateway Webhook Event)',
          isAnonymous: false
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setActionMsg({
        type: 'success',
        text: `Gateway Webhook Ingested: ₹${simAmount} settled from ${simDonor}. Journal entry posted automatically.`
      });
      fetchData();
    } catch (err: any) {
      setActionMsg({ type: 'error', text: err.message });
    } finally {
      setSimWebhookSending(false);
    }
  };

  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20 mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Black Box Governance & Operations Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Platform Administration & Maker-Checker Dual Control
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Enforces segregation of duties: high-value payouts require independent Maker initiation and Checker authorization.
          </p>
        </div>

        <button
          onClick={fetchData}
          className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-700 hover:bg-slate-800 text-xs font-semibold text-slate-300 transition self-start md:self-center"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh State</span>
        </button>
      </div>

      {actionMsg && (
        <div className={`p-4 rounded-xl text-xs font-medium border flex items-center space-x-2 ${
          actionMsg.type === 'success'
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
            : 'bg-red-500/10 border-red-500/30 text-red-400'
        }`}>
          {actionMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
          <span>{actionMsg.text}</span>
        </div>
      )}

      {/* 1. FUNDING CYCLE CONTROLLER & FORMULAIC ALLOCATION */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${
                cycle?.status === 'OPEN'
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                  : 'bg-purple-500/20 text-purple-400 border-purple-500/30'
              }`}>
                STATUS: {cycle?.status}
              </span>
              <span className="text-xs font-mono text-slate-400">Cycle #{cycle?.cycleNumber}</span>
            </div>
            <h2 className="text-xl font-black text-white mt-1">{cycle?.title}</h2>
          </div>

          {/* Action buttons */}
          <div className="flex items-center space-x-3">
            {cycle?.status === 'OPEN' ? (
              <button
                onClick={() => handleCycleAction('CLOSE_AND_ALLOCATE')}
                className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg transition flex items-center space-x-1.5"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Trigger 30/60/10 Allocation Lock</span>
              </button>
            ) : (
              <button
                onClick={() => handleCycleAction('REOPEN')}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition flex items-center space-x-1.5"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Reopen Contribution Pool</span>
              </button>
            )}
          </div>
        </div>

        {/* Current Pool Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-850">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Gross Collected</div>
            <div className="text-lg font-bold text-white font-mono mt-1">
              {cycle ? formatINR(cycle.grossCollected) : '-'}
            </div>
          </div>
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-850">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">MDR Processing Fees</div>
            <div className="text-lg font-bold text-slate-300 font-mono mt-1">
              {cycle ? formatINR(cycle.processingFees) : '-'}
            </div>
          </div>
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-850">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Net Distributable Pool</div>
            <div className="text-lg font-bold text-emerald-400 font-mono mt-1">
              {cycle ? formatINR(cycle.netDistributable) : '-'}
            </div>
          </div>
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-850">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Contributors</div>
            <div className="text-lg font-bold text-white font-mono mt-1">
              {cycle ? cycle.contributorCount.toLocaleString('en-IN') : '-'}
            </div>
          </div>
        </div>

        {cycle?.stateHash && (
          <div className="mt-6 p-4 rounded-xl bg-purple-950/20 border border-purple-500/30 text-xs font-mono text-purple-300">
            <span className="font-bold">Cryptographic Ledger Seal:</span> {cycle.stateHash}
          </div>
        )}
      </div>

      {/* 2. MAKER-CHECKER DUAL PAYOUT QUEUE */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
        <div>
          <div className="flex items-center space-x-2">
            <UserCheck className="w-4 h-4 text-emerald-400" />
            <h2 className="text-lg font-bold text-white">Maker-Checker Dual Sign-off Payout Queue</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Section 5.4 Compliance: No single administrator can disburse funds. Checker must be distinct from Maker.
          </p>
        </div>

        {/* Checker identity selector */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-slate-400 font-semibold mb-1">Current Logged-in Checker (Second Reviewer)</label>
            <select
              value={checkerAdmin}
              onChange={(e) => setCheckerAdmin(e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-semibold"
            >
              <option value="Admin.Vikram_Malhotra (Finance Director)">Admin.Vikram_Malhotra (Finance Director)</option>
              <option value="Admin.Priya_Verma (Sr. Compliance Officer)">Admin.Priya_Verma (Sr. Compliance Officer)</option>
              <option value="Admin.Sunil_Kapoor (External Trust Auditor)">Admin.Sunil_Kapoor (External Trust Auditor)</option>
            </select>
          </div>
          <div>
            <label className="block text-slate-400 font-semibold mb-1">Checker Sign-off Notes</label>
            <input
              type="text"
              value={checkerNotes}
              onChange={(e) => setCheckerNotes(e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
            />
          </div>
        </div>

        {/* Payouts Table */}
        <div className="divide-y divide-slate-800/80">
          {payouts.map((payout) => (
            <div key={payout.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs font-bold text-white">{payout.id}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    payout.status === 'RELEASED'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    {payout.status}
                  </span>
                </div>
                <div className="text-sm font-bold text-white">{payout.recipientName}</div>
                <div className="text-xs text-slate-400">
                  Maker: <span className="text-slate-300 font-medium">{payout.makerAdmin}</span>
                  {payout.checkerAdmin && (
                    <span className="ml-3">Checker: <span className="text-emerald-400 font-medium">{payout.checkerAdmin}</span></span>
                  )}
                </div>
                {payout.bankRef && (
                  <div className="text-[11px] font-mono text-slate-500">
                    Bank UTR: {payout.bankRef}
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-4 self-start sm:self-center">
                <div className="text-right">
                  <div className="text-xs text-slate-400">Grant Amount</div>
                  <div className="text-base font-black text-white font-mono">{formatINR(payout.amount)}</div>
                </div>

                {payout.status === 'PENDING_CHECKER' && (
                  <button
                    onClick={() => handleCheckerRelease(payout.id)}
                    className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition flex items-center space-x-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>Authorize Release</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. SIMULATED PAYMENT GATEWAY WEBHOOK INGESTER */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-4">
        <div className="flex items-center space-x-2">
          <Zap className="w-4 h-4 text-amber-400" />
          <h2 className="text-lg font-bold text-white">Simulate Payment Gateway Webhook (`payment.captured`)</h2>
        </div>
        <p className="text-xs text-slate-400">
          Test real-time inbound payment events. Simulates HMAC-SHA256 signature validation, event deduplication, and automated journal postings.
        </p>

        <form onSubmit={handleSimulateWebhook} className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="block text-slate-400 font-semibold mb-1">Donor Name</label>
            <input
              type="text"
              value={simDonor}
              onChange={(e) => setSimDonor(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
            />
          </div>
          <div>
            <label className="block text-slate-400 font-semibold mb-1">Settled Amount (₹)</label>
            <input
              type="number"
              value={simAmount}
              onChange={(e) => setSimAmount(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono"
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              disabled={simWebhookSending}
              className="w-full py-2.5 px-4 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition flex items-center justify-center space-x-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{simWebhookSending ? 'Ingesting...' : 'Send Gateway Webhook'}</span>
            </button>
          </div>
        </form>
      </div>

    </div>
  );
}

