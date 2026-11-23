import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full border-t mt-20" style={{ borderColor: '#262626', background: '#080808' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-10 border-b" style={{ borderColor: '#1a1a1a' }}>

          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded border overflow-hidden flex shrink-0" style={{ borderColor: '#3f3f3f' }}>
                <span className="w-1/2 h-full bg-white flex items-center justify-center text-[8px] font-black text-black">W</span>
                <span className="w-1/2 h-full bg-black flex items-center justify-center text-[8px] font-black text-white">B</span>
              </div>
              <span className="text-white font-bold text-sm tracking-tight">WBox</span>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: '#71717a' }}>
              A genuine, auditable community contribution platform. Every rupee accounted for. No fake numbers. No hidden fees. No surprises.
            </p>
            <p className="text-[11px] font-semibold" style={{ color: '#a1a1aa' }}>
              Built on double-entry accounting · Independent board governance
            </p>
          </div>

          {/* Programs */}
          <div>
            <p className="label mb-3">Programs</p>
            <ul className="space-y-2 text-xs" style={{ color: '#71717a' }}>
              <li><Link href="/programs" className="hover:text-white transition">District WBox (Daily)</Link></li>
              <li><Link href="/programs" className="hover:text-white transition">State WBox (Weekly)</Link></li>
              <li><Link href="/programs" className="hover:text-white transition">Country WBox (Monthly)</Link></li>
              <li><Link href="/programs" className="hover:text-white transition">World WBox (Annual)</Link></li>
            </ul>
          </div>

          {/* Allocation */}
          <div>
            <p className="label mb-3">Allocation Policy</p>
            <div className="space-y-1.5 text-xs font-mono">
              <div className="flex justify-between py-1" style={{ borderBottom: '1px solid #1a1a1a' }}>
                <span style={{ color: '#a1a1aa' }}>50% First Recipient</span>
              </div>
              <div className="flex justify-between py-1" style={{ borderBottom: '1px solid #1a1a1a' }}>
                <span style={{ color: '#a1a1aa' }}>10% Second Recipient</span>
              </div>
              <div className="flex justify-between py-1" style={{ borderBottom: '1px solid #1a1a1a' }}>
                <span style={{ color: '#a1a1aa' }}>20% Direct Charity</span>
              </div>
              <div className="flex justify-between py-1" style={{ borderBottom: '1px solid #1a1a1a' }}>
                <span style={{ color: '#a1a1aa' }}>10% Emergency Vault</span>
              </div>
              <div className="flex justify-between py-1">
                <span style={{ color: '#a1a1aa' }}>10% Platform Ops</span>
              </div>
            </div>
          </div>

          {/* Legal */}
          <div>
            <p className="label mb-3">Legal Compliance</p>
            <p className="text-[11px] leading-relaxed" style={{ color: '#52525b' }}>
              WBox events may only launch with jurisdiction-specific legal approval. No event activates the chance-based award mechanism without confirmed legal clearance per applicable law.
            </p>
            <p className="text-[11px] mt-3" style={{ color: '#52525b' }}>
              India: Subject to review under the Prize Chits and Money Circulation Schemes (Banning) Act, 1978; Online Gaming Act, 2025; and other applicable law.
            </p>
          </div>

        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px]" style={{ color: '#52525b' }}>
          <span>© {new Date().getFullYear()} WBox Technologies. Independent financial audit required before live operations.</span>
          <span>All amounts shown are genuine. No demo data. No inflated figures.</span>
        </div>
      </div>
    </footer>
  );
}
