import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Lock, CheckCircle2, FileText, Scale } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-800/80 bg-slate-950 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          
          {/* Brand & Mission */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-7 h-7 rounded border border-slate-700 bg-slate-900 overflow-hidden">
                <span className="w-1/2 h-full bg-white text-black font-black flex items-center justify-center text-[9px]">W</span>
                <span className="w-1/2 h-full bg-black text-white font-black flex items-center justify-center text-[9px]">B</span>
              </div>
              <span className="text-white font-bold tracking-tight text-sm">WBox</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              WBox is an open, auditable digital community philanthropy platform where small contributions combine to generate transparent social impact.
            </p>
            <div className="text-[11px] text-emerald-400 font-semibold flex items-center space-x-1 pt-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Immutable Double-Entry Ledger</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-3 uppercase tracking-wider text-[11px]">Platform</h4>
            <ul className="space-y-2">
              <li><Link href="/contribute" className="hover:text-emerald-400 transition">Contribute to Cycle #1</Link></li>
              <li><Link href="/transparency" className="hover:text-emerald-400 transition">Public Ledger Explorer</Link></li>
              <li><Link href="/charities" className="hover:text-emerald-400 transition">Verified Charity Partners</Link></li>
              <li><Link href="/apply" className="hover:text-emerald-400 transition">Beneficiary Grant Application</Link></li>
              <li><Link href="/admin" className="hover:text-emerald-400 transition">Maker-Checker Payout Console</Link></li>
            </ul>
          </div>

          {/* Transparency & Rules */}
          <div>
            <h4 className="text-white font-semibold mb-3 uppercase tracking-wider text-[11px]">Allocation Policy</h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
                <span className="text-emerald-400 font-medium">30% Charity Fund</span>
                <span className="text-slate-400">Registered NGOs</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
                <span className="text-blue-400 font-medium">60% Beneficiary Grants</span>
                <span className="text-slate-400">Verified Hardships</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-purple-400 font-medium">10% Platform Operations</span>
                <span className="text-slate-400">Tech & Compliance</span>
              </div>
            </div>
          </div>

          {/* Legal & Compliance Notice */}
          <div className="space-y-2">
            <h4 className="text-white font-semibold mb-3 uppercase tracking-wider text-[11px] flex items-center space-x-1.5">
              <Scale className="w-3.5 h-3.5 text-amber-400" />
              <span>Statutory Compliance</span>
            </h4>
            <p className="text-[11px] text-slate-500 leading-normal">
              WBox operates strictly as a voluntary digital philanthropy mechanism. All contributions are gratuitous donations. It is not an investment, lottery, prize draw, or deposit scheme.
            </p>
            <p className="text-[11px] text-slate-500 leading-normal">
              Beneficiary grants are awarded purely on verified humanitarian need and are 100% independent of whether an applicant has contributed.
            </p>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800/60 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} WBox Technologies. All financial records independently auditable.
          </div>
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1 text-slate-400">
              <Lock className="w-3 h-3 text-emerald-400" />
              <span>AES-256 Vault Protected PII</span>
            </span>
            <span className="flex items-center space-x-1 text-slate-400">
              <ShieldCheck className="w-3 h-3 text-blue-400" />
              <span>RBI / MDR Transparent Fee Accounting</span>
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}

