import React from 'react';
import Header from './_components/Header';
import Footer from './_components/Footer';
import { Montserrat } from 'next/font/google';

const montserrat = Montserrat({
  subsets: ['latin', 'vietnamese'],
  display: 'swap',
  variable: '--font-montserrat',
});

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`min-h-screen bg-[#131313] flex flex-col ${montserrat.variable}`}>
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}
