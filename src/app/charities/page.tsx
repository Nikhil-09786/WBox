'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Building2, 
  ShieldCheck, 
  CheckCircle2, 
  ExternalLink, 
  FileText, 
  Sparkles, 
  MapPin, 
  HeartHandshake,
  Search,
  Check
} from 'lucide-react';
import { Charity } from '@/lib/types';

export default function CharitiesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applySubmitted, setApplySubmitted] = useState(false);

  const initialCharities: Charity[] = [
    {
      id: 'charity-01',
      name: 'Aarogya Seva Medical Relief',
      regNumber: 'NGO-DEL-2018-9942',
      taxExemptCode: '80G / AACTA1234F',
      category: 'Healthcare & Emergency Care',
      verified: true,
      allocatedAmount: 150000,
      disbursedAmount: 150000,
      impactSummary: 'Deployed 12 mobile clinical ambulances in rural districts serving 4,200 emergency patients.',
      mission: 'Delivering trauma care, primary medicine, and emergency surgical supplies to remote rural families.',
      website: 'https://aarogyaseva.org',
      location: 'New Delhi & Rural Uttar Pradesh'
    },
    {
      id: 'charity-02',
      name: 'Vidya Jyoti Rural Literacy Initiative',
      regNumber: 'TRUST-MAH-2016-4412',
      taxExemptCode: '80G / BBCTS5678K',
      category: 'Child Education & STEM',
      verified: true,
      allocatedAmount: 120000,
      disbursedAmount: 120000,
      impactSummary: 'Funded digital learning kits, uniforms, and annual tuition for 320 girls in marginalized tribal clusters.',
      mission: 'Preventing school dropout and empowering girl children through quality STEM literacy.',
      website: 'https://vidyajyoti.org',
      location: 'Maharashtra & Madhya Pradesh'
    },
    {
      id: 'charity-03',
      name: 'Annapurna Community Kitchens',
      regNumber: 'SEC8-KA-2020-0081',
      taxExemptCode: '80G / CCDTM9012L',
      category: 'Food Security & Disaster Aid',
      verified: true,
      allocatedAmount: 90000,
      disbursedAmount: 90000,
      impactSummary: 'Distributed 45,000 freshly cooked nutritious meals during major flood distress relief operations.',
      mission: 'Eradicating childhood hunger through hygienic, centralized community kitchens.',
      website: 'https://annapurnakitchens.org',
      location: 'Karnataka & Bihar'
    }
  ];

  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
  };

  const filtered = initialCharities.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-2">
            <Building2 className="w-3.5 h-3.5" />
            <span>30% Charitable Allocation Partners</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Verified Charity Organizations
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Only registered Section 8 companies, registered public trusts, and verified 80G tax-exempt NGOs receive disbursements from the 30% Charity Pool.
          </p>
        </div>

        <button
          onClick={() => setShowApplyModal(true)}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-emerald-500/50 text-white font-bold text-xs transition self-start md:self-center"
        >
          <HeartHandshake className="w-4 h-4 text-emerald-400" />
          <span>Apply as Charity Partner</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search by name, category, or location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
        />
      </div>

      {/* Charity Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filtered.map((charity) => (
          <div
            key={charity.id}
            className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 flex flex-col justify-between shadow-xl hover:border-slate-700 transition"
          >
            <div>
              <div className="flex justify-between items-start gap-2 mb-3">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center space-x-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>80G VERIFIED</span>
                </span>
                <span className="font-mono text-[11px] text-slate-400">{charity.regNumber}</span>
              </div>

              <h2 className="text-lg font-bold text-white">{charity.name}</h2>
              <div className="flex items-center space-x-1.5 text-xs text-slate-400 mt-1">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                <span>{charity.location}</span>
              </div>

              <div className="mt-4 p-3 rounded-xl bg-slate-950 border border-slate-850 text-xs">
                <div className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1">
                  Cause Mission
                </div>
                <p className="text-slate-300 leading-relaxed text-xs">
                  {charity.mission}
                </p>
              </div>

              <div className="mt-4 space-y-1.5 text-xs">
                <div className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                  Verified Impact & Utilization
                </div>
                <p className="text-emerald-400/90 font-medium text-xs leading-relaxed">
                  {charity.impactSummary}
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800/80 flex justify-between items-center text-xs">
              <div>
                <div className="text-[10px] text-slate-500">Cumulative Distributed</div>
                <div className="text-base font-extrabold text-white font-mono">
                  {formatINR(charity.disbursedAmount)}
                </div>
              </div>

              <a
                href={charity.website}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-1 text-emerald-400 hover:text-emerald-300 font-semibold"
              >
                <span>Audit Site</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Charity Verification Application Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-750 rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative">
            
            {applySubmitted ? (
              <div className="text-center py-6">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto mb-3">
                  <Check className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">Application Received</h3>
                <p className="text-xs text-slate-400 mt-2">
                  Our compliance team will review your NGO certificate and 80G documentation within 3 business days.
                </p>
                <button
                  onClick={() => {
                    setApplySubmitted(false);
                    setShowApplyModal(false);
                  }}
                  className="mt-6 px-5 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs"
                >
                  Close
                </button>
              </div>
            ) : (
              <div>
                <h3 className="text-lg font-bold text-white mb-1">Partner Organization Registration</h3>
                <p className="text-xs text-slate-400 mb-6">
                  Submit your institution credentials to qualify for the 30% Charity Pool disbursements.
                </p>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setApplySubmitted(true);
                  }}
                  className="space-y-4 text-xs"
                >
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">NGO / Trust Legal Name</label>
                    <input required type="text" placeholder="e.g. Hope Foundation India" className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white" />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Government Registration Number</label>
                    <input required type="text" placeholder="e.g. TRUST-DEL-2021-0098" className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white" />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">80G / 12A Tax Exemption Number</label>
                    <input required type="text" placeholder="e.g. 80G/AAACT9921B" className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white" />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Cause Domain & Impact Description</label>
                    <textarea rows={3} placeholder="Describe primary programs and geographic coverage..." className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white" />
                  </div>

                  <div className="pt-4 border-t border-slate-800 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowApplyModal(false)}
                      className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 font-semibold hover:bg-slate-700"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-lg bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400"
                    >
                      Submit for Compliance Review
                    </button>
                  </div>
                </form>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}

