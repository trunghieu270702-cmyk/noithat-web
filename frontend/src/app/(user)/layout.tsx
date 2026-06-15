import React from 'react';
import Header from './_components/Header';
import Footer from './_components/Footer';
import PromoPopup from './_components/PromoPopup';
import FloatingContact from './_components/FloatingContact';

import { ThemeProvider } from './_components/ThemeProvider';

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className={`min-h-screen modern-section flex flex-col`}>
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
        <PromoPopup />
        <FloatingContact />
      </div>
    </ThemeProvider>
  );
}
