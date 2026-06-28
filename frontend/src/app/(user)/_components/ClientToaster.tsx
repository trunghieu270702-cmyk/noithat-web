"use client";

import { Toaster } from 'sonner';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function ClientToaster() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Toaster 
      position="bottom-left" 
      theme={theme as 'light' | 'dark' | 'system'}
      style={{ zIndex: 999999 }}
      icons={{
        success: <div className="w-5 h-5 rounded-full bg-[#ce9e51] flex items-center justify-center text-white mr-2"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg></div>
      }}
      toastOptions={{
        className: 'font-sans rounded-[4px] border border-[#ce9e51]/30 bg-white dark:bg-[#111] text-gray-900 dark:text-white shadow-[0_4px_30px_rgba(0,0,0,0.1)] !z-[999999]',
        style: { padding: '16px 20px', fontSize: '15px' },
        classNames: {
          success: 'border-[#ce9e51] bg-[#faf8f5] dark:bg-[#1a1a1a] text-[#b88c45] dark:text-[#ce9e51]',
          error: 'border-red-500 bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400'
        }
      }}
    />
  );
}
