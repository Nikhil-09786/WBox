import React from 'react';

export default function WhiteBlackExplainer() {
  return (
    <section className="py-16 max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <span className="badge mb-3 inline-block">The Core Identity</span>
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">White Box + Black Box</h2>
        <p className="mt-3 text-sm max-w-xl mx-auto" style={{ color: '#71717a' }}>
          WBox is designed around two non-negotiable principles that cannot coexist in ordinary platforms — but must here.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* WHITE BOX */}
        <div className="rounded-2xl p-7 relative overflow-hidden" style={{ background: '#ffffff', color: '#080808' }}>
          <div className="absolute top-0 right-0 w-24 h-24 opacity-5 rounded-full blur-2xl" style={{ background: '#000' }} />
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center font-black text-sm" style={{ background: '#080808', color: '#fff' }}>W</div>
              <div>
                <h3 className="font-black text-base">White Box</h3>
                <p className="text-xs" style={{ color: '#52525b' }}>The Public Explainable System</p>
              </div>
            </div>
            <span className="text-[9px] font-black px-2 py-0.5 rounded border tracking-widest uppercase" style={{ borderColor: '#d4d4d8', color: '#52525b' }}>PUBLIC</span>
          </div>

          <ul className="space-y-3 text-xs" style={{ color: '#3f3f46' }}>
            {[
              'Total settled contributions — exact and unrounded',
              'Percentage allocation per bucket — locked before event opens',
              'Every journal debit and credit entry in the public ledger',
              'Charity transfer amounts and payment references',
              'Emergency Vault opening and closing balances per program',
              'Platform operations expenditure per period',
              'Independent audit reports upon completion',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center shrink-0 text-[9px] font-black" style={{ borderColor: '#d4d4d8', color: '#080808' }}>✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* BLACK BOX */}
        <div className="rounded-2xl p-7 relative overflow-hidden" style={{ background: '#111111', border: '1px solid #262626' }}>
          <div className="absolute top-0 right-0 w-24 h-24 opacity-5 rounded-full blur-2xl" style={{ background: '#fff' }} />
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center font-black text-sm border" style={{ background: '#080808', color: '#fff', borderColor: '#3f3f3f' }}>B</div>
              <div>
                <h3 className="font-black text-base text-white">Black Box</h3>
                <p className="text-xs" style={{ color: '#71717a' }}>The Protected Privacy Vault</p>
              </div>
            </div>
            <span className="text-[9px] font-black px-2 py-0.5 rounded border tracking-widest uppercase" style={{ borderColor: '#3f3f3f', color: '#71717a' }}>PRIVATE</span>
          </div>

          <ul className="space-y-3 text-xs" style={{ color: '#a1a1aa' }}>
            {[
              'Contributor identity and payment credentials — never exposed',
              'Recipient personal details, bank accounts, identity documents',
              'Emergency request hardship evidence and medical records',
              'Charity officer and banking verification data',
              'Internal fraud detection signals and screening results',
              'Board member conflict-of-interest declarations',
              'Security architecture and intrusion detection config',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center shrink-0 text-[9px] font-black" style={{ borderColor: '#3f3f3f', color: '#a1a1aa' }}>■</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Key principle */}
      <div className="mt-6 p-5 rounded-xl text-center text-xs" style={{ background: '#111111', border: '1px solid #262626', color: '#a1a1aa' }}>
        <span className="font-bold text-white">Core principle:</span>{"  "}
        The system can protect private information without hiding financial accountability. White Box = financial truth. Black Box = human dignity.
      </div>
    </section>
  );
}
