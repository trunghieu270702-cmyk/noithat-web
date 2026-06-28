import React from 'react';
import Header from './_components/Header';
import Footer from './_components/Footer';
import PromoPopup from './_components/PromoPopup';
import FloatingContact from './_components/FloatingContact';

import ClientToaster from './_components/ClientToaster';

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`min-h-screen modern-section flex flex-col relative`}>
      <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
        <PromoPopup />
        <FloatingContact />
        <ClientToaster />
    </div>
  );
}
