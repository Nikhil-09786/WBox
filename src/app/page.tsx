'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Heart, 
  ShieldCheck, 
  Eye, 
  ArrowRight, 
  Building2, 
  Users, 
  CheckCircle2, 
  TrendingUp, 
  Lock, 
  Sparkles,
  ExternalLink,
  Coins
} from 'lucide-react';
import WhiteBlackExplainer from '@/components/WhiteBlackExplainer';

export default function HomePage() {
  const [cycle, setCycle] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/cycle')
      .then(res => res.json())
      .then(data => {
        setCycle(data.cycle);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
  };

  const progressPct = cycle ? Math.min(100, Math.round((cycle.grossCollected / cycle.targetAmount) * 100)) : 64;

  return (
    <div className="flex flex-col items-center">
      
      {/* 1. HERO SECTION */}
      <section className="w-full relative pt-12 pb-20 overflow-hidden border-b border-slate-850">
        {/* Glow backdrop effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-emerald-500/10 via-blue-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          {/* Trust pill */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-slate-900 border border-slate-700/80 text-slate-300 shadow-md mb-6 hover:border-emerald-500/40 transition">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Cycle #1 Now Active</span>
            <span className="text-slate-500">|</span>
            <span className="text-emerald-400 font-bold">Formulaic 30/60/10 Allocation</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight max-w-4xl mx-auto">
            Small Contributions. Collective Strength. <br />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-blue-400 bg-clip-text text-transparent">
              100% Accountable Distribution.
            </span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            WBox is a digital philanthropy platform combining radical financial transparency with strict personal privacy. No hidden fees. Every single rupee is tracked on an immutable double-entry ledger.
          </p>

          {/* Call to Actions */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contribute"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-extrabold px-6 py-3.5 rounded-xl text-sm shadow-xl shadow-emerald-500/25 transition transform active:scale-95"
            >
              <Heart className="w-4 h-4 fill-slate-950" />
              <span>Contribute to Current Cycle</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>

            <Link
              href="/transparency"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold px-6 py-3.5 rounded-xl text-sm transition"
            >
              <Eye className="w-4 h-4 text-emerald-400" />
              <span>Inspect Public Ledger</span>
            </Link>
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
              <div className="text-xl sm:text-2xl font-black text-white">
                {cycle ? formatINR(cycle.grossCollected) : '₹6,42,500'}
              </div>
              <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold mt-1">
                Settled In Cycle #1
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
              <div className="text-xl sm:text-2xl font-black text-white">
                {cycle ? cycle.contributorCount.toLocaleString('en-IN') : '2,840'}
              </div>
              <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold mt-1">
                Active Contributors
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
              <div className="text-xl sm:text-2xl font-black text-emerald-400">
                3 Registered
              </div>
              <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold mt-1">
                Charity Partners
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
              <div className="text-xl sm:text-2xl font-black text-blue-400">
                100% Balanced
              </div>
              <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold mt-1">
                Double-Entry Ledger
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. LIVE FUNDING CYCLE CARD */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 z-20">
        <div className="rounded-2xl border border-slate-750 bg-slate-900/90 shadow-2xl backdrop-blur-xl p-6 sm:p-8">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-850">
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  CYCLE #1 (ACTIVE)
                </span>
                <span className="text-xs text-slate-400">Closes in 9 Days</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
                {cycle?.title || 'Community Healthcare & Critical Lifeline Fund #1'}
              </h2>
              <p className="text-xs text-slate-400 mt-1 max-w-2xl">
                {cycle?.description || 'Pool dedicated to emergency pediatric surgeries, flood restoration grants, and mobile clinics.'}
              </p>
            </div>

            <Link
              href="/contribute"
              className="inline-flex items-center justify-center space-x-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-5 py-2.5 rounded-lg text-xs shadow-md transition self-start md:self-center"
            >
              <span>Contribute to this Pool</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Progress Bar & Stats */}
          <div className="pt-6">
            <div className="flex justify-between items-end mb-2">
              <div>
                <div className="text-xs text-slate-400">Collected so far</div>
                <div className="text-2xl font-black text-white">
                  {cycle ? formatINR(cycle.grossCollected) : '₹6,42,500'}
                  <span className="text-sm font-normal text-slate-400 ml-2">
                    of {cycle ? formatINR(cycle.targetAmount) : '₹10,00,000'} target
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-lg font-black text-emerald-400">{progressPct}%</span>
                <div className="text-[11px] text-slate-400">Funded</div>
              </div>
            </div>

            {/* Visual Multi-Segment Bar */}
            <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden relative">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-1000"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          {/* Three Allocation Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-6 border-t border-slate-800/80">
            
            <div className="p-4 rounded-xl bg-slate-950/70 border border-emerald-500/20 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">30% Charity Fund</span>
                  <Building2 className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-lg font-extrabold text-white">
                  {cycle ? formatINR(Math.round(cycle.netDistributable * 0.30)) : '₹1,88,895'}
                </div>
                <p className="text-[11px] text-slate-400 mt-1 leading-normal">
                  Earmarked for verified registered NGO partners and audited social causes.
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] text-emerald-400/80 font-medium">
                Audited Section 8 / Trust partners
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/70 border border-blue-500/20 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">60% Beneficiary Grants</span>
                  <Users className="w-4 h-4 text-blue-400" />
                </div>
                <div className="text-lg font-extrabold text-white">
                  {cycle ? formatINR(Math.round(cycle.netDistributable * 0.60)) : '₹3,77,790'}
                </div>
                <p className="text-[11px] text-slate-400 mt-1 leading-normal">
                  Direct financial grants to verified individuals facing urgent hardship.
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] text-blue-400/80 font-medium">
                100% Need-based | Zero bias
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/70 border border-purple-500/20 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">10% Platform Operations</span>
                  <ShieldCheck className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-lg font-extrabold text-white">
                  {cycle ? formatINR(Math.round(cycle.netDistributable * 0.10)) : '₹62,965'}
                </div>
                <p className="text-[11px] text-slate-400 mt-1 leading-normal">
                  Disclosed operating fee for server hosting, verification, and engineering.
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] text-purple-400/80 font-medium">
                Zero hidden deductions
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 3. WHITE-BLACK HYBRID EXPLAINER */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <WhiteBlackExplainer />
      </section>

      {/* 4. VERIFIED CHARITY PARTNERS PREVIEW */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-slate-800/80">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Building2 className="w-3.5 h-3.5" />
              <span>Accountable Organizations</span>
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">Verified Charity Partners</h2>
            <p className="text-xs text-slate-400 mt-1">
              Organizations receiving the 30% charitable allocation undergo rigorous registration and 80G tax status verification.
            </p>
          </div>

          <Link
            href="/charities"
            className="inline-flex items-center space-x-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition"
          >
            <span>View All Partner Details & Utilization</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 hover:border-slate-700 transition">
            <div className="flex justify-between items-start mb-3">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                VERIFIED 80G
              </span>
              <span className="text-xs text-slate-400 font-mono">NGO-DEL-2018</span>
            </div>
            <h3 className="text-base font-bold text-white">Aarogya Seva Medical Relief</h3>
            <p className="text-xs text-slate-400 mt-2 line-clamp-2">
              Deploying emergency medical ambulances and essential trauma supplies in underserved rural districts.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex justify-between items-center text-xs">
              <span className="text-slate-500">Cycle Allocation</span>
              <span className="font-bold text-white">₹1,50,000</span>
            </div>
          </div>

          <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 hover:border-slate-700 transition">
            <div className="flex justify-between items-start mb-3">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                VERIFIED 80G
              </span>
              <span className="text-xs text-slate-400 font-mono">TRUST-MAH-2016</span>
            </div>
            <h3 className="text-base font-bold text-white">Vidya Jyoti Rural Literacy Initiative</h3>
            <p className="text-xs text-slate-400 mt-2 line-clamp-2">
              Funding digital learning kits, books, and scholarship fees for girls in rural tribal clusters.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex justify-between items-center text-xs">
              <span className="text-slate-500">Cycle Allocation</span>
              <span className="font-bold text-white">₹1,20,000</span>
            </div>
          </div>

          <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 hover:border-slate-700 transition">
            <div className="flex justify-between items-start mb-3">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                VERIFIED 80G
              </span>
              <span className="text-xs text-slate-400 font-mono">SEC8-KA-2020</span>
            </div>
            <h3 className="text-base font-bold text-white">Annapurna Community Kitchens</h3>
            <p className="text-xs text-slate-400 mt-2 line-clamp-2">
              Combating childhood malnutrition through clean community kitchens and disaster meal distribution.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex justify-between items-center text-xs">
              <span className="text-slate-500">Cycle Allocation</span>
              <span className="font-bold text-white">₹90,000</span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. BENEFICIARY PRIVACY & HUMANITARIAN INTEGRITY BANNER */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="rounded-2xl border border-blue-500/30 bg-gradient-to-r from-blue-950/40 via-slate-900 to-slate-950 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-1.5 text-blue-400 text-xs font-bold uppercase tracking-wider">
              <Lock className="w-3.5 h-3.5" />
              <span>Beneficiary Rights & Zero-Bias Philanthropy</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">Need financial assistance for an urgent crisis?</h3>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Anyone can apply for assistance in healthcare, education, or disaster recovery. You do <strong>not</strong> need to make a donation to qualify. Your hardship details and banking info are protected under AES-256 Black Box encryption.
            </p>
          </div>

          <Link
            href="/apply"
            className="shrink-0 bg-blue-600 hover:bg-blue-500 text-white font-bold px-5 py-3 rounded-xl text-xs shadow-lg transition flex items-center space-x-2"
          >
            <span>Submit Assistance Request</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

    </div>
  );
}

