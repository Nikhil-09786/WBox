import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'WBox | White-Black Community Contribution Platform',
  description: 'Genuine, auditable community contribution platform. 50% First Recipient · 10% Second · 20% Charity · 10% Emergency Vault · 10% Operations.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col antialiased" style={{ background: '#080808', color: '#e4e4e7' }}>
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
