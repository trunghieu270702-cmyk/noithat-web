import React from 'react';
import Header from './_components/Header';
import Footer from './_components/Footer';
import PromoPopup from './_components/PromoPopup';
import FloatingContact from './_components/FloatingContact';

import { ThemeProvider } from './_components/ThemeProvider';
import { Toaster } from 'sonner';

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className={`min-h-screen modern-section flex flex-col relative`}>
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
        <PromoPopup />
        <FloatingContact />
        <Toaster 
          position="bottom-right" 
          icons={{
            success: <div className="w-5 h-5 rounded-full bg-[#ce9e51] flex items-center justify-center text-white mr-2"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg></div>
          }}
          toastOptions={{
            className: 'font-heading rounded-[4px] border border-[#ce9e51]/30 bg-white dark:bg-[#111] text-gray-900 dark:text-white shadow-lg',
            style: { padding: '16px 20px', fontSize: '15px' },
            classNames: {
              success: 'border-[#ce9e51] bg-[#faf8f5] dark:bg-[#1a1a1a] text-[#b88c45] dark:text-[#ce9e51]',
              error: 'border-red-500 bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400'
            }
          }}
        />
      </div>
    </ThemeProvider>
  );
}
