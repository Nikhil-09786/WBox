'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Heart, 
  ShieldCheck, 
  Building2, 
  Users, 
  Receipt, 
  CheckCircle2, 
  ArrowRight, 
  Lock, 
  CreditCard, 
  Smartphone, 
  Sparkles,
  Download,
  Printer
} from 'lucide-react';

export default function ContributePage() {
  const [selectedAmount, setSelectedAmount] = useState<number>(500);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [donorName, setDonorName] = useState<string>('');
  const [donorEmail, setDonorEmail] = useState<string>('');
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<string>('UPI');
  const [upiVpa, setUpiVpa] = useState<string>('user@okhdfcbank');

  const [processing, setProcessing] = useState<boolean>(false);
  const [completedReceipt, setCompletedReceipt] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const amountPresets = [100, 250, 500, 1000, 2500, 5000];

  const effectiveAmount = customAmount ? parseFloat(customAmount) || 0 : selectedAmount;
  const processingFee = Math.round(effectiveAmount * 0.02 * 100) / 100; // 2% MDR fee
  const netAmount = Math.max(0, Math.round((effectiveAmount - processingFee) * 100) / 100);

  // 30 / 60 / 10 math
  const charityAmount = Math.round(netAmount * 0.30 * 100) / 100;
  const beneficiaryAmount = Math.round(netAmount * 0.60 * 100) / 100;
  const platformAmount = Math.round((netAmount - charityAmount - beneficiaryAmount) * 100) / 100;

  const handlePresetClick = (amt: number) => {
    setSelectedAmount(amt);
    setCustomAmount('');
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomAmount(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (effectiveAmount < 10) {
      setErrorMsg('Minimum voluntary contribution is ₹10.');
      return;
    }
    setErrorMsg(null);
    setProcessing(true);

    try {
      const res = await fetch('/api/contributions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          donorName: isAnonymous ? 'Kind Contributor' : (donorName || 'Generous Donor'),
          donorEmail: donorEmail || 'contributor@wb-box.org',
          amount: effectiveAmount,
          paymentMethod,
          isAnonymous
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Payment failed');

      setCompletedReceipt(data.contribution);
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setProcessing(false);
    }
  };

  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(val);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-3">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Formulaic & Non-Custodial Allocation</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Make a Voluntary Contribution
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Every contribution is immediately logged into the double-entry accounting ledger. See the exact distribution of your money before you pay.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Contribution Form */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Amount Presets */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Select Contribution Amount (INR)
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {amountPresets.map((amt) => {
                  const isSelected = selectedAmount === amt && !customAmount;
                  return (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => handlePresetClick(amt)}
                      className={`py-2.5 rounded-xl font-bold text-sm transition border ${
                        isSelected
                          ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/20'
                          : 'bg-slate-950 text-slate-200 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      ₹{amt}
                    </button>
                  );
                })}
              </div>

              {/* Custom Amount Input */}
              <div className="mt-3 relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 font-bold text-sm pointer-events-none">
                  ₹
                </span>
                <input
                  type="number"
                  placeholder="Or enter custom amount (e.g. 2000)"
                  value={customAmount}
                  onChange={handleCustomChange}
                  min="10"
                  step="10"
                  className="w-full pl-8 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm font-semibold text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
                />
              </div>
            </div>

            {/* Donor Information */}
            <div className="pt-4 border-t border-slate-800/80 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Donor Details</span>
                <label className="flex items-center space-x-2 cursor-pointer text-xs text-slate-400 select-none">
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="rounded border-slate-700 text-emerald-500 focus:ring-0 bg-slate-950 w-3.5 h-3.5"
                  />
                  <span>Contribute Anonymously</span>
                </label>
              </div>

              {!isAnonymous && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">Your Full Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Rahul Sharma"
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                      className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">Email (For Digital Tax Receipt)</label>
                    <input
                      type="email"
                      placeholder="rahul@example.com"
                      value={donorEmail}
                      onChange={(e) => setDonorEmail(e.target.value)}
                      className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Payment Method Selector */}
            <div className="pt-4 border-t border-slate-800/80">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Digital Payment Method
              </label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('UPI')}
                  className={`p-3 rounded-xl border text-left flex flex-col justify-between transition ${
                    paymentMethod === 'UPI'
                      ? 'border-emerald-500 bg-emerald-500/10 text-white'
                      : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <Smartphone className="w-4 h-4 mb-2 text-emerald-400" />
                  <div>
                    <div className="text-xs font-bold text-white">UPI (Instant)</div>
                    <div className="text-[10px] text-slate-400">GPay, PhonePe, Paytm</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('CARD')}
                  className={`p-3 rounded-xl border text-left flex flex-col justify-between transition ${
                    paymentMethod === 'CARD'
                      ? 'border-emerald-500 bg-emerald-500/10 text-white'
                      : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <CreditCard className="w-4 h-4 mb-2 text-blue-400" />
                  <div>
                    <div className="text-xs font-bold text-white">Debit / Credit</div>
                    <div className="text-[10px] text-slate-400">Visa, Mastercard, RuPay</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('NETBANKING')}
                  className={`p-3 rounded-xl border text-left flex flex-col justify-between transition ${
                    paymentMethod === 'NETBANKING'
                      ? 'border-emerald-500 bg-emerald-500/10 text-white'
                      : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <Building2 className="w-4 h-4 mb-2 text-purple-400" />
                  <div>
                    <div className="text-xs font-bold text-white">Net Banking</div>
                    <div className="text-[10px] text-slate-400">HDFC, ICICI, SBI</div>
                  </div>
                </button>
              </div>

              {paymentMethod === 'UPI' && (
                <div className="mt-3">
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">UPI ID / VPA</label>
                  <input
                    type="text"
                    value={upiVpa}
                    onChange={(e) => setUpiVpa(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-emerald-400 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              )}
            </div>

            {errorMsg && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
                {errorMsg}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={processing || effectiveAmount < 10}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm shadow-xl shadow-emerald-500/20 transition flex items-center justify-center space-x-2 disabled:opacity-50 active:scale-[0.99]"
            >
              {processing ? (
                <span>Settling via Payment Gateway...</span>
              ) : (
                <>
                  <Heart className="w-4 h-4 fill-slate-950" />
                  <span>Confirm & Contribute {formatINR(effectiveAmount)}</span>
                </>
              )}
            </button>

            <p className="text-[11px] text-slate-500 text-center leading-relaxed">
              By contributing, you acknowledge that contributions are voluntary donations accounted for under the published 30/60/10 funding policy. Not eligible for lottery or prize returns.
            </p>

          </form>
        </div>

        {/* Right Column: Real-Time Transparent Allocation Breakdown */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center space-x-1.5">
                <Receipt className="w-4 h-4 text-emerald-400" />
                <span>Transparent Allocation Summary</span>
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                100% DISCLOSED
              </span>
            </div>

            {/* Breakdown List */}
            <div className="mt-4 space-y-3.5 text-xs">
              
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Total Contribution (Gross)</span>
                <span className="font-extrabold text-white text-base">{formatINR(effectiveAmount)}</span>
              </div>

              <div className="flex justify-between items-center text-slate-400 py-1.5 border-y border-slate-800/60">
                <span className="flex items-center space-x-1">
                  <span>Payment Gateway Processing Fee (MDR ~2%)</span>
                </span>
                <span className="font-mono text-slate-300">-{formatINR(processingFee)}</span>
              </div>

              <div className="flex justify-between items-center bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <span className="font-bold text-white">Net Distributable Pool</span>
                <span className="font-extrabold text-emerald-400">{formatINR(netAmount)}</span>
              </div>

              {/* The 3 Pillars */}
              <div className="space-y-2 pt-2">
                
                <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                  <div className="flex justify-between items-center font-bold">
                    <span className="text-emerald-400">30% Charity Fund</span>
                    <span className="text-white font-mono">{formatINR(charityAmount)}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Distributed to verified registered NGOs for broad social programs (healthcare, child literacy, meal relief).
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-blue-500/5 border border-blue-500/20">
                  <div className="flex justify-between items-center font-bold">
                    <span className="text-blue-400">60% Beneficiary Grants</span>
                    <span className="text-white font-mono">{formatINR(beneficiaryAmount)}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Direct lifeline grants to verified applicants in acute medical or emergency distress (strictly need-based).
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-purple-500/5 border border-purple-500/20">
                  <div className="flex justify-between items-center font-bold">
                    <span className="text-purple-400">10% Platform Operations</span>
                    <span className="text-white font-mono">{formatINR(platformAmount)}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Infrastructure hosting, verification team, continuous audit logs, and security engineering.
                  </p>
                </div>

              </div>

            </div>

            {/* Invariant guarantee */}
            <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Sum: ₹{charityAmount + beneficiaryAmount + platformAmount} === Net Pool</span>
              </span>
              <span className="font-mono text-emerald-400 font-bold">0.00 Error</span>
            </div>

          </div>

          {/* Trust box */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs space-y-2">
            <div className="flex items-center space-x-2 text-white font-bold">
              <Lock className="w-4 h-4 text-emerald-400" />
              <span>Independent Accounting Guarantee</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Every confirmed payment triggers an automated journal entry inside our append-only accounting ledger. You can inspect all ledger postings publicly on the <Link href="/transparency" className="text-emerald-400 underline font-medium">Transparency Dashboard</Link>.
            </p>
          </div>

        </div>

      </div>

      {/* COMPLETED DIGITAL RECEIPT MODAL */}
      {completedReceipt && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-750 rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative">
            
            <div className="text-center pb-4 border-b border-slate-800">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-black text-white">Contribution Successful!</h3>
              <p className="text-xs text-slate-400 mt-1">
                Your payment has been settled and verified on the public ledger.
              </p>
            </div>

            {/* Receipt Details */}
            <div className="py-4 space-y-2.5 text-xs font-mono">
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Receipt ID:</span>
                <span className="text-white font-bold">{completedReceipt.id}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Contributor:</span>
                <span className="text-white">{completedReceipt.donorName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Gross Amount:</span>
                <span className="text-emerald-400 font-bold text-sm">₹{completedReceipt.amount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Gateway Ref:</span>
                <span className="text-slate-300">{completedReceipt.paymentGatewayRef}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Allocation:</span>
                <span className="text-slate-300">30% Charity | 60% Grants | 10% Ops</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Timestamp:</span>
                <span className="text-slate-300">{new Date(completedReceipt.createdAt).toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row gap-3">
              <Link
                href="/transparency"
                className="flex-1 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs text-center transition flex items-center justify-center space-x-1.5"
              >
                <span>View on Public Ledger</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <button
                onClick={() => setCompletedReceipt(null)}
                className="py-2.5 px-5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition"
              >
                Done
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

