'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ArrowRight } from 'lucide-react';

const links = [
  { name: 'Home',         href: '/'             },
  { name: 'Programs',     href: '/programs'     },
  { name: 'Contribute',   href: '/contribute'   },
  { name: 'Transparency', href: '/transparency' },
  { name: 'Charities',    href: '/charities'    },
  { name: 'Emergency',    href: '/emergency'    },
  { name: 'Admin',        href: '/admin'        },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-[#080808]/90 backdrop-blur-md" style={{ borderColor: '#262626' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-14">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-md border overflow-hidden flex shrink-0" style={{ borderColor: '#3f3f3f' }}>
            <span className="w-1/2 h-full bg-white flex items-center justify-center text-[9px] font-black text-black">W</span>
            <span className="w-1/2 h-full bg-black flex items-center justify-center text-[9px] font-black text-white border-l" style={{ borderColor: '#3f3f3f' }}>B</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-white text-sm tracking-tight group-hover:text-[#a1a1aa] transition">WBox</span>
              <span className="badge">50·10·20·10·10</span>
            </div>
            <p className="text-[9px] text-[#52525b] leading-none hidden sm:block">White-Black Hybrid · Genuine · Auditable</p>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-0.5">
          {links.map(l => (
            <Link
              key={l.href}
              href={l.href}
              className={`px-3 py-1.5 rounded text-xs font-medium transition ${
                pathname === l.href
                  ? 'bg-white text-black'
                  : 'text-[#a1a1aa] hover:text-white hover:bg-[#1a1a1a]'
              }`}
            >
              {l.name}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/contribute" className="btn-primary text-xs">
            Contribute <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 rounded text-[#a1a1aa] hover:text-white hover:bg-[#1a1a1a] transition"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t px-4 py-4 space-y-1 bg-[#080808]" style={{ borderColor: '#262626' }}>
          {links.map(l => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`block px-3 py-2 rounded text-sm font-medium transition ${
                pathname === l.href ? 'bg-white text-black' : 'text-[#a1a1aa] hover:bg-[#1a1a1a] hover:text-white'
              }`}
            >
              {l.name}
            </Link>
          ))}
          <div className="pt-2">
            <Link href="/contribute" onClick={() => setOpen(false)} className="btn-primary w-full justify-center">
              Contribute Now
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
