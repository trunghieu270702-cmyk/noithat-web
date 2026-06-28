"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X, Menu, Sparkles } from 'lucide-react';

import { ThemeToggle } from './ThemeToggle';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    if (path === '/he-sinh-thai') return pathname?.startsWith('/he-sinh-thai') || pathname?.startsWith('/don-vi-thiet-ke');
    if (path === '/dich-vu') return pathname?.startsWith('/giam-sat') || pathname?.startsWith('/lien-ket-doi-tac');
    return pathname?.startsWith(path);
  };

  return (
    <>
      {/* --- TOP BAR (Hidden on Mobile/Tablet) --- */}
      <div className="font-display hidden lg:flex border-b border-gray-200 dark:border-white/20 py-3 modern-section">
        <div className="max-w-[1400px] mx-auto px-6 w-full flex items-center justify-start gap-12">
          {/* Email */}
          <div className="flex items-center gap-3">
            <svg className="w-4 h-4 text-[#D3AE3E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
            <span className="text-[13px] font-medium text-gray-500 dark:text-[#888]">arcvietlivingnexus@gmail.com</span>
          </div>
          {/* Phone */}
          <div className="flex items-center gap-3">
            <svg className="w-4 h-4 text-[#D3AE3E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
            </svg>
            <span className="text-[13px] font-medium text-gray-500 dark:text-[#888]">096 574 39 49</span>
          </div>
          {/* Clock */}
          <div className="flex items-center gap-3">
            <svg className="w-4 h-4 text-[#D3AE3E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span className="text-[13px] font-medium text-gray-500 dark:text-[#888]">Thời gian làm việc: T2-T6 9:00 - 18:00</span>
          </div>
        </div>
      </div>

      {/* --- MAIN HEADER --- */}
      <div className="w-full sticky top-0 z-50 bg-[#FAF8F2]/80 dark:bg-black/50 backdrop-blur-xl border-b border-[#D3AE3E]/10 dark:border-white/5 transition-all duration-500 shadow-[0_4px_30px_rgba(211,174,62,0.05)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.6)] supports-[backdrop-filter]:bg-[#FAF8F2]/60 dark:supports-[backdrop-filter]:bg-[#0a0a0a]/40">
        <div className="max-w-[1400px] mx-auto px-6 w-full flex items-center justify-between h-[80px]">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center group">
              <img
                src="/images/logo-header.png"
                alt="logo"
                className="h-[55px] w-auto transition-transform group-hover:scale-105"
              />
              <div className="hidden sm:flex flex-col justify-center ml-2">
                <span className="font-heading text-[14px] font-bold tracking-[0.12em] uppercase text-transparent bg-clip-text bg-gradient-to-r from-[#c7a25c] via-[#f1be6d] to-[#D3AE3E]">
                  Arcviet Living Nexus
                </span>
                <span className="font-heading text-[9px] font-medium tracking-[0.25em] text-[#c7a25c] dark:text-[#d3ae3e] uppercase mt-1 opacity-80">
                  Một kết nối - Vạn giá trị
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Menu (Hidden on Mobile) */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link href="/" className={`font-menu text-[13px] font-semibold uppercase tracking-widest transition-colors ${isActive('/') ? 'text-[#D3AE3E]' : 'text-gray-900 dark:text-white hover:text-[#D3AE3E]'}`}>Trang chủ</Link>

            <div className="relative group cursor-pointer">
              <Link href="/he-sinh-thai" className={`font-menu flex items-center gap-1 text-[13px] font-semibold uppercase tracking-widest transition-colors ${isActive('/he-sinh-thai') ? 'text-[#D3AE3E]' : 'text-gray-900 dark:text-white hover:text-[#D3AE3E]'}`}>
                Hệ sinh thái
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </Link>
              {/* Dropdown Menu */}
              <div className="absolute top-full left-0 mt-6 w-64 bg-white dark:bg-[#131313] border-t-2 border-[#D3AE3E] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 flex flex-col py-2 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)]">
                <Link href="/he-sinh-thai#gioi-thieu" className="font-menu px-5 py-2.5 text-[12px] text-gray-600 dark:text-[#ccc] hover:text-[#D3AE3E] hover:bg-gray-50 dark:hover:bg-white/5 uppercase tracking-wide transition-colors">Giới thiệu hệ sinh thái</Link>
                <Link href="/don-vi-thiet-ke" className="font-menu px-5 py-2.5 text-[12px] text-gray-600 dark:text-[#ccc] hover:text-[#D3AE3E] hover:bg-gray-50 dark:hover:bg-white/5 uppercase tracking-wide transition-colors">Đơn vị thiết kế</Link>
                <Link href="/don-vi-thi-cong" className="font-menu px-5 py-2.5 text-[12px] text-gray-600 dark:text-[#ccc] hover:text-[#D3AE3E] hover:bg-gray-50 dark:hover:bg-white/5 uppercase tracking-wide transition-colors">Đơn vị thi công</Link>
                <Link href="/he-sinh-thai#phan-khuc" className="font-menu px-5 py-2.5 text-[12px] text-gray-600 dark:text-[#ccc] hover:text-[#D3AE3E] hover:bg-gray-50 dark:hover:bg-white/5 uppercase tracking-wide transition-colors">Phân khúc dịch vụ</Link>
                <Link href="/he-sinh-thai#loi-ich" className="font-menu px-5 py-2.5 text-[12px] text-gray-600 dark:text-[#ccc] hover:text-[#D3AE3E] hover:bg-gray-50 dark:hover:bg-white/5 uppercase tracking-wide transition-colors">Lợi ích khách hàng</Link>
                <Link href="/he-sinh-thai#so-sanh" className="font-menu px-5 py-2.5 text-[12px] text-gray-600 dark:text-[#ccc] hover:text-[#D3AE3E] hover:bg-gray-50 dark:hover:bg-white/5 uppercase tracking-wide transition-colors">So sánh phương án tự triển khai</Link>
              </div>
            </div>

            <div className="relative group cursor-pointer">
              <Link href="/san-pham" className={`font-menu flex items-center gap-1 text-[13px] font-semibold uppercase tracking-widest transition-colors ${isActive('/san-pham') ? 'text-[#D3AE3E]' : 'text-gray-900 dark:text-white hover:text-[#D3AE3E]'}`}>
                Đối tác/Hạng mục
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </Link>
              {/* Dropdown Menu */}
              <div className="absolute top-full left-0 mt-6 w-56 bg-white dark:bg-[#131313] border-t-2 border-[#D3AE3E] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 flex flex-col py-2 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)]">
                <Link href="/san-pham" className="font-menu px-5 py-2.5 text-[12px] text-gray-600 dark:text-[#ccc] hover:text-[#D3AE3E] hover:bg-gray-50 dark:hover:bg-white/5 uppercase tracking-wide transition-colors">Tất cả sản phẩm</Link>
                <Link href="/san-pham?filter=noi-bat" className="font-menu px-5 py-2.5 text-[12px] text-gray-600 dark:text-[#ccc] hover:text-[#D3AE3E] hover:bg-gray-50 dark:hover:bg-white/5 uppercase tracking-wide transition-colors">Sản phẩm nổi bật</Link>
                <Link href="/don-vi-thiet-ke" className="font-menu px-5 py-2.5 text-[12px] text-gray-600 dark:text-[#ccc] hover:text-[#D3AE3E] hover:bg-gray-50 dark:hover:bg-white/5 uppercase tracking-wide transition-colors">Các đối tác chính</Link>
                <Link href="/#danh-muc-san-pham" className="font-menu px-5 py-2.5 text-[12px] text-gray-600 dark:text-[#ccc] hover:text-[#D3AE3E] hover:bg-gray-50 dark:hover:bg-white/5 uppercase tracking-wide transition-colors">Danh mục sản phẩm</Link>
              </div>
            </div>

            <div className="relative group cursor-pointer">
              <Link href="/dich-vu" className={`font-menu flex items-center gap-1 text-[13px] font-semibold uppercase tracking-widest transition-colors ${isActive('/dich-vu') ? 'text-[#D3AE3E]' : 'text-gray-900 dark:text-white hover:text-[#D3AE3E]'}`}>
                Dịch vụ
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </Link>
              {/* Dropdown Menu */}
              <div className="absolute top-full left-0 mt-6 w-56 bg-white dark:bg-[#131313] border-t-2 border-[#D3AE3E] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 flex flex-col py-2 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)]">
                <Link href="/lien-ket-doi-tac" className="font-menu px-5 py-2.5 text-[12px] text-gray-600 dark:text-[#ccc] hover:text-[#D3AE3E] hover:bg-gray-50 dark:hover:bg-white/5 uppercase tracking-wide transition-colors">Liên kết đối tác</Link>
                <Link href="/giam-sat" className="font-menu px-5 py-2.5 text-[12px] text-gray-600 dark:text-[#ccc] hover:text-[#D3AE3E] hover:bg-gray-50 dark:hover:bg-white/5 uppercase tracking-wide transition-colors">Giám sát thi công</Link>
              </div>
            </div>

            <div className="relative group cursor-pointer">
              <Link href="/cam-nang" className={`font-menu flex items-center gap-1 text-[13px] font-semibold uppercase tracking-widest transition-colors ${isActive('/cam-nang') ? 'text-[#D3AE3E]' : 'text-gray-900 dark:text-white hover:text-[#D3AE3E]'}`}>
                Cẩm nang
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </Link>
              {/* Dropdown Menu */}
              <div className="absolute top-full left-0 mt-6 w-56 bg-white dark:bg-[#131313] border-t-2 border-[#D3AE3E] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 flex flex-col py-2 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)]">
                <Link href="/cam-nang" className="font-menu px-5 py-2.5 text-[12px] text-gray-900 dark:text-white font-bold hover:text-[#D3AE3E] hover:bg-gray-50 dark:hover:bg-white/5 uppercase tracking-wide transition-colors">Toàn bộ bài viết</Link>
                <Link href="/cam-nang/danh-muc/kinh-nghiem-xay-nha" className="font-menu px-5 py-2.5 text-[12px] text-gray-600 dark:text-[#ccc] hover:text-[#D3AE3E] hover:bg-gray-50 dark:hover:bg-white/5 uppercase tracking-wide transition-colors">Kinh nghiệm xây nhà</Link>
                <Link href="/cam-nang/danh-muc/thiet-ke-noi-that" className="font-menu px-5 py-2.5 text-[12px] text-gray-600 dark:text-[#ccc] hover:text-[#D3AE3E] hover:bg-gray-50 dark:hover:bg-white/5 uppercase tracking-wide transition-colors">Thiết kế nội thất</Link>
                <Link href="/cam-nang/danh-muc/bao-gia-chi-phi" className="font-menu px-5 py-2.5 text-[12px] text-gray-600 dark:text-[#ccc] hover:text-[#D3AE3E] hover:bg-gray-50 dark:hover:bg-white/5 uppercase tracking-wide transition-colors">Báo giá & chi phí</Link>
              </div>
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-4 lg:gap-6">

            <ThemeToggle />

            <Link
              href="/tu-van"
              className="font-menu hidden lg:inline-flex items-center gap-2 bg-[#D3AE3E] text-white px-6 py-3 text-[12px] font-semibold uppercase tracking-widest hover:bg-[#b88c45] hover:text-white transition-colors rounded-[2px]"
            >
              Gửi nhu cầu tư vấn
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"></path>
              </svg>
            </Link>

            {/* Mobile Hamburger Menu */}
            <button
              className="lg:hidden text-gray-900 dark:text-white hover:text-[#D3AE3E] transition-colors focus:outline-none"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-7 h-7" />
            </button>
          </div>
        </div>
      </div>

      {/* --- MOBILE MENU (Full Screen Glassmorphism) --- */}
      <div
        className={`fixed inset-0 bg-white/95 dark:bg-black/95 backdrop-blur-xl z-[100] transition-all duration-300 flex flex-col justify-center items-center ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
          }`}
      >
        <button
          onClick={() => setIsMobileMenuOpen(false)}
          className="absolute top-6 right-6 w-12 h-12 flex items-center justify-center border border-gray-200 dark:border-white/20 rounded-full text-gray-900 dark:text-white hover:bg-gray-100 dark:bg-[#1a1a1a] dark:hover:bg-white/10 transition-all"
        >
          <X className="w-6 h-6" />
        </button>

        <nav className="flex flex-col items-center gap-8 w-full px-6 h-full overflow-y-auto py-20">
          <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className={`font-menu text-2xl font-semibold uppercase tracking-widest transition-all ${isActive('/') ? 'text-[#D3AE3E]' : 'text-gray-900 dark:text-white hover:text-[#D3AE3E]'}`}>Trang Chủ</Link>
          <Link href="/he-sinh-thai" onClick={() => setIsMobileMenuOpen(false)} className={`font-menu text-2xl font-semibold uppercase tracking-widest transition-all ${isActive('/he-sinh-thai') ? 'text-[#D3AE3E]' : 'text-gray-900 dark:text-white hover:text-[#D3AE3E]'}`}>Hệ Sinh Thái</Link>
          <Link href="/san-pham" onClick={() => setIsMobileMenuOpen(false)} className={`font-menu text-2xl font-semibold uppercase tracking-widest transition-all ${isActive('/san-pham') ? 'text-[#D3AE3E]' : 'text-gray-900 dark:text-white hover:text-[#D3AE3E]'}`}>Đối tác/Hạng mục</Link>
          <Link href="/giam-sat" onClick={() => setIsMobileMenuOpen(false)} className={`font-menu text-2xl font-semibold uppercase tracking-widest transition-all ${isActive('/dich-vu') ? 'text-[#D3AE3E]' : 'text-gray-900 dark:text-white hover:text-[#D3AE3E]'}`}>Dịch Vụ</Link>
          <Link href="/cam-nang" onClick={() => setIsMobileMenuOpen(false)} className={`font-menu text-2xl font-semibold uppercase tracking-widest transition-all ${isActive('/cam-nang') ? 'text-[#D3AE3E]' : 'text-gray-900 dark:text-white hover:text-[#D3AE3E]'}`}>Cẩm Nang</Link>
          <Link href="/tu-van" onClick={() => setIsMobileMenuOpen(false)} className="font-menu mt-8 bg-[#D3AE3E] text-white px-8 py-3.5 text-sm font-bold uppercase tracking-widest w-full text-center hover:bg-[#b88c45] transition-colors rounded-[2px]">
            Gửi Nhu Cầu Tư Vấn
          </Link>
        </nav>
      </div>
    </>
  );
}
