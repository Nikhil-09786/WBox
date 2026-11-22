'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  HelpCircle, 
  Lock, 
  ShieldCheck, 
  Heart, 
  Search, 
  CheckCircle2, 
  Clock, 
  FileCheck, 
  AlertCircle,
  Upload,
  ArrowRight
} from 'lucide-react';
import { GrantApplication } from '@/lib/types';

export default function ApplyPage() {
  // New application form states
  const [applicantName, setApplicantName] = useState('');
  const [applicantEmail, setApplicantEmail] = useState('');
  const [category, setCategory] = useState<GrantApplication['category']>('HEALTHCARE');
  const [requestedAmount, setRequestedAmount] = useState('');
  const [publicSummary, setPublicSummary] = useState('');
  const [hardshipDetails, setHardshipDetails] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submittedApp, setSubmittedApp] = useState<any>(null);

  // Status lookup state
  const [searchAppId, setSearchAppId] = useState('');
  const [trackedApp, setTrackedApp] = useState<any>(null);
  const [trackError, setTrackError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch('/api/grant-applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicantName,
          applicantEmail,
          category,
          requestedAmount: parseFloat(requestedAmount),
          publicSummary,
          hardshipDetails
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit application');

      setSubmittedApp(data.application);
      setApplicantName('');
      setRequestedAmount('');
      setPublicSummary('');
      setHardshipDetails('');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchAppId.trim()) return;
    setTrackError(null);
    setTrackAppLoading(true);

    try {
      const res = await fetch('/api/grant-applications');
      const data = await res.json();
      const found = data.applications.find((a: any) => 
        a.id.toLowerCase() === searchAppId.trim().toLowerCase()
      );

      if (found) {
        setTrackedApp(found);
      } else {
        setTrackError(`Application with ID "${searchAppId}" was not found. Try grant-app-001 or grant-app-002.`);
        setTrackedApp(null);
      }
    } catch (err) {
      setTrackError('Failed to fetch status.');
    } finally {
      setTrackAppLoading(false);
    }
  };

  const [trackAppLoading, setTrackAppLoading] = useState(false);

  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-2">
            <Lock className="w-3.5 h-3.5" />
            <span>Black Box Protected Beneficiary Assistance</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Apply for Beneficiary Grant
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            60% of all funds collected in WBox are allocated directly to individuals and families facing severe crisis. Zero donation is required to qualify.
          </p>
        </div>

        <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-500/30 text-xs text-blue-300 flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" />
          <span>Grants are non-repayable philanthropic assistance.</span>
        </div>
      </div>

      {/* Main Grid: Application Form vs Status Lookup */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Grant Application Wizard */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
          
          {submittedApp ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-black text-white">Application Successfully Submitted</h2>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Your application has been received under AES-256 Black Box encryption. A verified compliance officer will review your situation without any bias.
              </p>
              
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs max-w-sm mx-auto text-left space-y-1.5">
                <div className="text-slate-400">Application Reference ID:</div>
                <div className="text-emerald-400 font-bold text-base">{submittedApp.id}</div>
                <div className="text-slate-500 text-[11px] pt-1">
                  Save this tracking ID to check verification progress anytime.
                </div>
              </div>

              <button
                onClick={() => setSubmittedApp(null)}
                className="mt-4 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
              >
                Submit Another Request
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5 text-xs">
              <h2 className="text-base font-bold text-white flex items-center space-x-2">
                <span>Assistance Request Details</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Applicant / Patient Full Name</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Rameshwar Sharma"
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Contact Email / Phone</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. rameshwar@example.com"
                    value={applicantEmail}
                    onChange={(e) => setApplicantEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Assistance Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="HEALTHCARE">Healthcare & Emergency Surgeries</option>
                    <option value="EDUCATION">Education & Tuition Distress</option>
                    <option value="EMERGENCY">Disaster & Calamity Relief</option>
                    <option value="LIVELIHOOD">Livelihood & Basic Necessities</option>
                    <option value="DISABILITY">Disability & Assistive Devices</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Requested Amount (INR)</label>
                  <input
                    required
                    type="number"
                    min="1000"
                    placeholder="e.g. 75000"
                    value={requestedAmount}
                    onChange={(e) => setRequestedAmount(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Public Story Summary (Safe for Public Impact Page)
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Critical hospital estimate for pediatric bone marrow surgery."
                  value={publicSummary}
                  onChange={(e) => setPublicSummary(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  Keep this summary free of private addresses or bank accounts.
                </p>
              </div>

              {/* Private Hardship Details (Black Box Vault) */}
              <div className="p-4 rounded-xl bg-slate-950 border border-blue-500/20 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-blue-400 font-bold flex items-center space-x-1.5">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Private Hardship & Banking Details (Encrypted)</span>
                  </label>
                  <span className="text-[10px] font-mono text-slate-400">AES-256 Encrypted</span>
                </div>
                <textarea
                  required
                  rows={4}
                  placeholder="Provide family economic background, hospital/institution details, and reason for urgency. This information is strictly confidential and protected in the Black Box vault."
                  value={hardshipDetails}
                  onChange={(e) => setHardshipDetails(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 space-y-1">
                <div className="font-semibold text-slate-300">Mandatory Grant Policy:</div>
                <div>• Contributions to WBox do NOT increase grant approval probability.</div>
                <div>• Review decisions are based strictly on urgency, financial hardship, and verifiable documentation.</div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-sm shadow-xl shadow-blue-500/20 transition flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {submitting ? (
                  <span>Encrypting & Submitting...</span>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Submit Encrypted Grant Application</span>
                  </>
                )}
              </button>
            </form>
          )}

        </div>

        {/* Right Column: Track Application Status */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2 flex items-center space-x-2">
              <Search className="w-4 h-4 text-blue-400" />
              <span>Track Application Progress</span>
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Enter your Application ID to inspect verification status and approved amounts.
            </p>

            <form onSubmit={handleTrack} className="flex gap-2 mb-4">
              <input
                type="text"
                placeholder="e.g. grant-app-001"
                value={searchAppId}
                onChange={(e) => setSearchAppId(e.target.value)}
                className="flex-1 px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                disabled={trackAppLoading}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs"
              >
                Track
              </button>
            </form>

            {trackError && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                {trackError}
              </div>
            )}

            {trackedApp && (
              <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-3 font-mono">
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <span className="text-slate-400 font-sans">Status</span>
                  <span className={`px-2 py-0.5 rounded font-bold ${
                    trackedApp.status === 'DISBURSED' ? 'bg-emerald-500/20 text-emerald-400' :
                    trackedApp.status === 'APPROVED' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-amber-500/20 text-amber-400'
                  }`}>
                    {trackedApp.status}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-400 font-sans">Applicant</span>
                  <span className="text-white font-sans">{trackedApp.applicantName}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-400 font-sans">Category</span>
                  <span className="text-slate-300">{trackedApp.category}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-400 font-sans">Requested</span>
                  <span className="text-white">{formatINR(trackedApp.requestedAmount)}</span>
                </div>

                {trackedApp.approvedAmount > 0 && (
                  <div className="flex justify-between border-t border-slate-800 pt-2 font-bold">
                    <span className="text-emerald-400 font-sans">Approved Grant</span>
                    <span className="text-emerald-400 text-sm">{formatINR(trackedApp.approvedAmount)}</span>
                  </div>
                )}

                <div className="pt-2 text-[11px] text-slate-500 font-sans">
                  Summary: {trackedApp.publicSummary}
                </div>
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-slate-800 text-xs text-slate-400">
              <span className="font-semibold text-slate-300">Try these sample tracking IDs:</span>
              <div className="mt-2 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setSearchAppId('grant-app-001')}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-[11px]"
                >
                  grant-app-001 (Disbursed)
                </button>
                <button
                  type="button"
                  onClick={() => setSearchAppId('grant-app-002')}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-[11px]"
                >
                  grant-app-002 (Approved)
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

