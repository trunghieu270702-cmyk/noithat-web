'use client';
import React, { useState, useEffect } from 'react';
import { X, Gift } from 'lucide-react';
import Link from 'next/link';

export default function PromoPopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if popup was already shown in this session
    const hasSeenPopup = sessionStorage.getItem('promo_popup_seen');
    if (!hasSeenPopup) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        sessionStorage.setItem('promo_popup_seen', 'true');
      }, 1500); // delay 1.5s
      return () => clearTimeout(timer);
    }
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md bg-white dark:bg-[#1a1a1a] rounded-[4px] shadow-2xl overflow-hidden border border-[#D3AE3E]/30 animate-reveal">
        <button 
          onClick={() => setIsOpen(false)}
          className="absolute top-3 right-3 z-10 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="p-8 text-center">
          <div className="w-16 h-16 mx-auto bg-[#D3AE3E]/10 rounded-full flex items-center justify-center mb-6">
            <Gift className="w-8 h-8 text-[#D3AE3E]" />
          </div>
          <h3 className="font-heading text-2xl font-bold text-gray-900 dark:text-white mb-4">Ưu đãi đặc biệt</h3>
          <p className="text-gray-600 dark:text-[#e2e2e2] mb-8 leading-relaxed">
            Nhận ngay ưu đãi giảm <span className="text-[#D3AE3E] font-bold text-lg">5%</span> khi kết nối thiết kế và thi công với các đối tác thông qua hệ sinh thái <span className="font-bold text-gray-900 dark:text-white">ArcViet</span>.
          </p>
          <Link
            href="/tu-van"
            onClick={() => setIsOpen(false)}
            className="block w-full bg-[#D3AE3E] text-white py-3 font-bold uppercase tracking-wider hover:bg-[#b88c45] transition-colors rounded-[2px]"
          >
            Nhận ưu đãi ngay
          </Link>
        </div>
      </div>
    </div>
  );
}
