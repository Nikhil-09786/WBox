'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShieldCheck, Heart, Eye, Building2, HelpCircle, UserCheck, Menu, X, ArrowRight } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cycleData, setCycleData] = useState<{ gross: number; target: number; cycleNum: number } | null>(null);

  useEffect(() => {
    fetch('/api/cycle')
      .then(r => r.json())
      .then(d => {
        if (d.cycle) {
          setCycleData({
            gross: d.cycle.grossCollected,
            target: d.cycle.targetAmount,
            cycleNum: d.cycle.cycleNumber
          });
        }
      })
      .catch(() => {});
  }, [pathname]);

  const navLinks = [
    { name: 'Home', href: '/', icon: Heart },
    { name: 'Contribute', href: '/contribute', icon: Heart },
    { name: 'Transparency', href: '/transparency', icon: Eye },
    { name: 'Charities', href: '/charities', icon: Building2 },
    { name: 'Request Assistance', href: '/apply', icon: HelpCircle },
    { name: 'Governance & Admin', href: '/admin', icon: ShieldCheck },
  ];

  const formatLakhs = (val: number) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(2)} Lakh`;
    return `₹${val.toLocaleString('en-IN')}`;
  };

  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Dual-Box Emblem */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg border border-slate-700 bg-slate-900 shadow-inner overflow-hidden">
              <div className="w-1/2 h-full bg-white flex items-center justify-center text-[10px] font-black text-black select-none">
                W
              </div>
              <div className="w-1/2 h-full bg-black flex items-center justify-center text-[10px] font-black text-white select-none">
                B
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold tracking-tight text-lg text-white group-hover:text-emerald-400 transition">
                  WBox
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  30/60/10
                </span>
              </div>
              <p className="text-[10px] text-slate-400 -mt-0.5 hidden sm:block">White-Black Hybrid Philanthropy</p>
            </div>
          </Link>

          {/* Center Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition ${
                    isActive
                      ? 'bg-slate-800 text-white font-semibold shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 opacity-70" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Section: Live Cycle Metric & CTA */}
          <div className="hidden lg:flex items-center space-x-4">
            {cycleData && (
              <div className="text-right border-r border-slate-800 pr-4">
                <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                  Cycle #{cycleData.cycleNum} Live Pool
                </div>
                <div className="text-xs font-bold text-emerald-400">
                  {formatLakhs(cycleData.gross)} <span className="text-slate-500 font-normal">/ {formatLakhs(cycleData.target)}</span>
                </div>
              </div>
            )}

            <Link
              href="/contribute"
              className="inline-flex items-center space-x-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold px-3.5 py-2 rounded-lg text-xs shadow-lg shadow-emerald-500/20 transition transform active:scale-95"
            >
              <span>Contribute</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-950/95 px-4 pt-3 pb-6 space-y-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                  isActive ? 'bg-slate-800 text-emerald-400' : 'text-slate-300 hover:bg-slate-900'
                }`}
              >
                <Icon className="w-4 h-4 opacity-70" />
                <span>{link.name}</span>
              </Link>
            );
          })}
          <div className="pt-3">
            <Link
              href="/contribute"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center w-full py-2.5 rounded-lg bg-emerald-500 text-slate-950 font-bold text-sm shadow-md"
            >
              Contribute Now
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

