'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function FloatingContact() {
  const [showTopBtn, setShowTopBtn] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowTopBtn(true);
      } else {
        setShowTopBtn(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const goToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };
  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-4">
      {/* Back to top Button */}
      <button
        onClick={goToTop}
        className={`w-[52px] h-[52px] bg-[#1F1F1F] dark:bg-white text-white dark:text-[#1F1F1F] rounded-full flex items-center justify-center shadow-lg hover:bg-[#C7A25C] dark:hover:bg-[#C7A25C] dark:hover:text-white transition-all duration-300 relative group overflow-hidden ${showTopBtn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}
        aria-label="Back to top"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path></svg>
        <span className="absolute right-full mr-4 bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white text-[13px] px-3 py-1.5 rounded-[4px] shadow-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap border border-gray-100 dark:border-white/10 font-medium">
          Lên đầu trang
        </span>
      </button>

      {/* Zalo Button */}
      <Link
        href="https://zalo.me/0965743949"
        target="_blank"
        rel="noopener noreferrer"
        className="w-[52px] h-[52px] bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300 btn-glow-motion relative group overflow-hidden"
        aria-label="Chat on Zalo"
      >
        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Icon_of_Zalo.svg/120px-Icon_of_Zalo.svg.png" alt="Zalo" className="w-[36px] h-[36px] object-contain" />
        <span className="absolute right-full mr-4 bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white text-[13px] px-3 py-1.5 rounded-[4px] shadow-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap border border-gray-100 dark:border-white/10 font-medium">
          Chat qua Zalo
        </span>
      </Link>

      {/* Messenger Button */}
      <Link
        href="https://m.me/61591340093069"
        target="_blank"
        rel="noopener noreferrer"
        className="w-[52px] h-[52px] bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300 btn-glow-motion relative group overflow-hidden"
        aria-label="Chat on Messenger"
      >
        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Facebook_Messenger_logo_2020.svg/120px-Facebook_Messenger_logo_2020.svg.png" alt="Messenger" className="w-[40px] h-[40px] object-contain" />
        <span className="absolute right-full mr-4 bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white text-[13px] px-3 py-1.5 rounded-[4px] shadow-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap border border-gray-100 dark:border-white/10 font-medium">
          Chat qua Messenger
        </span>
      </Link>
    </div>
  );
}
