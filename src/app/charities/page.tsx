'use client';
import React, { useState } from 'react';
import { ExternalLink } from 'lucide-react';

export default function CharitiesPage() {
  const [applying, setApplying] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6" style={{ borderBottom: '1px solid #262626' }}>
        <div>
          <span className="label block mb-1">20% Direct Charity Allocation</span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Verified Charity Organizations</h1>
          <p className="text-xs mt-1" style={{ color: '#71717a' }}>
            Only verified registered charities receive disbursements. Zero charities have been verified yet — this directory is empty until the platform completes its legal setup.
          </p>
        </div>
        <button onClick={() => setApplying(true)} className="btn-ghost self-start md:self-center">
          Apply as Partner Organization
        </button>
      </div>

      {/* Verification requirements */}
      <div className="card p-6">
        <h2 className="text-sm font-bold text-white mb-4">Partner Verification Requirements</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            'Legal registration and current operating status',
            'Authorized charitable purpose documentation',
            'Verification of responsible officers and directors',
            'Verified bank account ownership proof',
            'Required tax exemption (80G / equivalent)',
            'Fundraising and regulatory permissions',
            'Conflict-of-interest screening clearance',
            'Sanctions and fraud screening (legally required)',
          ].map((req, i) => (
            <div key={i} className="flex items-start gap-2 text-xs" style={{ color: '#a1a1aa' }}>
              <span className="shrink-0 mt-0.5 w-3.5 h-3.5 rounded border flex items-center justify-center text-[9px] font-black" style={{ borderColor: '#3f3f3f' }}>□</span>
              {req}
            </div>
          ))}
        </div>
        <div className="mt-5 p-4 rounded-lg text-xs" style={{ background: '#080808', border: '1px solid #1a1a1a', color: '#71717a' }}>
          <strong className="text-white">Transfer policy:</strong> Charity funds are transferred only after the event settles and the organization passes full verification. Charity money cannot be reclassified as platform revenue if a recipient is not ready — it remains a charity liability until a permitted resolution is approved.
        </div>
      </div>

      {/* Empty state */}
      <div className="p-16 rounded-2xl text-center card">
        <div className="w-16 h-16 rounded-full border flex items-center justify-center mx-auto mb-4 text-2xl" style={{ borderColor: '#262626', color: '#3f3f3f' }}>
          ○
        </div>
        <h3 className="text-base font-bold text-white mb-2">No Verified Partners Yet</h3>
        <p className="text-xs max-w-sm mx-auto" style={{ color: '#71717a' }}>
          This directory will populate once organizations complete verification and an event has run. This is the genuine zero state — not a placeholder.
        </p>
        <button onClick={() => setApplying(true)} className="btn-ghost mt-6">
          Apply as Partner Organization
        </button>
      </div>

      {/* Application Modal */}
      {applying && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.9)' }}>
          <div className="card max-w-lg w-full p-7">
            {submitted ? (
              <div className="text-center py-6">
                <div className="text-3xl mb-3">✓</div>
                <h3 className="text-lg font-black text-white">Application Received</h3>
                <p className="text-xs mt-2" style={{ color: '#71717a' }}>The compliance team will review your documentation and contact you within 5 business days.</p>
                <button onClick={() => { setSubmitted(false); setApplying(false); }} className="btn-primary mt-6">Close</button>
              </div>
            ) : (
              <>
                <h3 className="text-base font-black text-white mb-1">Partner Organization Application</h3>
                <p className="text-xs mb-6" style={{ color: '#71717a' }}>Submit credentials for compliance review. No funds are disbursed before full verification is complete.</p>
                <form onSubmit={e => { e.preventDefault(); setSubmitted(true); }} className="space-y-4 text-xs">
                  {[
                    ['Legal Name', 'e.g. Hope Foundation India'],
                    ['Government Registration Number', 'e.g. TRUST-DEL-2021-0098'],
                    ['80G / Tax Exemption Reference', 'e.g. 80G/AAACT9921B'],
                    ['Authorized Contact Email', 'compliance@organization.org'],
                  ].map(([label, placeholder]) => (
                    <div key={String(label)}>
                      <label className="label block mb-1">{label}</label>
                      <input required type="text" placeholder={placeholder} className="input" />
                    </div>
                  ))}
                  <div>
                    <label className="label block mb-1">Charitable Purpose & Geographic Coverage</label>
                    <textarea rows={3} className="input resize-none" placeholder="Describe programs and coverage area…" />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button type="button" onClick={() => setApplying(false)} className="btn-ghost flex-1 justify-center">Cancel</button>
                    <button type="submit" className="btn-primary flex-1 justify-center">Submit for Review</button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
