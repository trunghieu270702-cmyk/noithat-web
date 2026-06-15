'use client';
import React from 'react';
import Link from 'next/link';

export default function FloatingContact() {
  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-4">
      {/* Zalo Button */}
      <Link
        href="https://zalo.me/0999999999"
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
        href="https://m.me/yourpage"
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
