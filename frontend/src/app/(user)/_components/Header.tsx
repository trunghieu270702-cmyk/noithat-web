"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { X, Menu } from 'lucide-react';

import { ThemeToggle } from './ThemeToggle';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* --- TOP BAR (Hidden on Mobile/Tablet) --- */}
      <div className="hidden lg:flex border-b border-gray-200 dark:border-white/20 py-3 bg-[#FAF9F8] dark:bg-[#0a0a0a]">
        <div className="max-w-[1400px] mx-auto px-6 w-full flex items-center justify-start gap-12">
          {/* Email */}
          <div className="flex items-center gap-3">
            <svg className="w-4 h-4 text-[#D3AE3E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
            <span className="text-[13px] font-medium text-gray-500 dark:text-[#888]">support@noithat.com</span>
          </div>
          {/* Phone */}
          <div className="flex items-center gap-3">
            <svg className="w-4 h-4 text-[#D3AE3E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
            </svg>
            <span className="text-[13px] font-medium text-gray-500 dark:text-[#888]">009462 2238, 2248</span>
          </div>
          {/* Clock */}
          <div className="flex items-center gap-3">
            <svg className="w-4 h-4 text-[#D3AE3E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span className="text-[13px] font-medium text-gray-500 dark:text-[#888]">Opening time: Mon-Fri 9:00 AM - 18:00 PM</span>
          </div>
        </div>
      </div>

      {/* --- MAIN HEADER --- */}
      <div className="w-full sticky top-0 z-50 bg-white/95 dark:bg-[#131313]/95 backdrop-blur-sm border-b border-gray-100 dark:border-white/10 transition-all duration-300">
        <div className="max-w-[1400px] mx-auto px-6 w-full flex items-center justify-between h-[80px]">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/">
              <img 
                src="/images/logo-header.png" 
                alt="logo" 
                className="h-[55px] w-auto transition-transform hover:scale-105"
              />
            </Link>
          </div>

          {/* Navigation Menu (Hidden on Mobile) */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link href="/" className="font-menu text-[13px] font-semibold uppercase tracking-widest text-[#D3AE3E] hover:text-[#D3AE3E] transition-colors">Trang chủ</Link>
            
            <div className="relative group cursor-pointer">
              <span className="font-menu flex items-center gap-1 text-[13px] font-semibold uppercase tracking-widest text-gray-900 dark:text-white hover:text-[#D3AE3E] transition-colors">
                Sản phẩm
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </span>
              {/* Dropdown Menu */}
              <div className="absolute top-full left-0 mt-6 w-56 bg-white dark:bg-[#131313] border-t-2 border-[#D3AE3E] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 flex flex-col py-2 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)]">
                <Link href="/san-pham" className="font-menu px-5 py-2.5 text-[12px] text-gray-600 dark:text-[#ccc] hover:text-[#D3AE3E] hover:bg-gray-50 dark:hover:bg-white/5 uppercase tracking-wide transition-colors">Tất cả sản phẩm</Link>
                <Link href="/san-pham?filter=noi-bat" className="font-menu px-5 py-2.5 text-[12px] text-gray-600 dark:text-[#ccc] hover:text-[#D3AE3E] hover:bg-gray-50 dark:hover:bg-white/5 uppercase tracking-wide transition-colors">Sản phẩm nổi bật</Link>
                <Link href="/san-pham?filter=ban-chay" className="font-menu px-5 py-2.5 text-[12px] text-gray-600 dark:text-[#ccc] hover:text-[#D3AE3E] hover:bg-gray-50 dark:hover:bg-white/5 uppercase tracking-wide transition-colors">Sản phẩm bán chạy</Link>
                <Link href="/#danh-muc-san-pham" className="font-menu px-5 py-2.5 text-[12px] text-gray-600 dark:text-[#ccc] hover:text-[#D3AE3E] hover:bg-gray-50 dark:hover:bg-white/5 uppercase tracking-wide transition-colors">Danh mục sản phẩm</Link>
              </div>
            </div>

            <div className="relative group cursor-pointer">
              <span className="font-menu flex items-center gap-1 text-[13px] font-semibold uppercase tracking-widest text-gray-900 dark:text-white hover:text-[#D3AE3E] transition-colors">
                Hệ sinh thái
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </span>
              {/* Dropdown Menu */}
              <div className="absolute top-full left-0 mt-6 w-64 bg-white dark:bg-[#131313] border-t-2 border-[#D3AE3E] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 flex flex-col py-2 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)]">
                <Link href="/he-sinh-thai#gioi-thieu" className="font-menu px-5 py-2.5 text-[12px] text-gray-600 dark:text-[#ccc] hover:text-[#D3AE3E] hover:bg-gray-50 dark:hover:bg-white/5 uppercase tracking-wide transition-colors">Giới thiệu hệ sinh thái</Link>
                <Link href="/don-vi-thiet-ke" className="font-menu px-5 py-2.5 text-[12px] text-gray-600 dark:text-[#ccc] hover:text-[#D3AE3E] hover:bg-gray-50 dark:hover:bg-white/5 uppercase tracking-wide transition-colors">Đơn vị thiết kế</Link>
                <Link href="/he-sinh-thai#phan-khuc" className="font-menu px-5 py-2.5 text-[12px] text-gray-600 dark:text-[#ccc] hover:text-[#D3AE3E] hover:bg-gray-50 dark:hover:bg-white/5 uppercase tracking-wide transition-colors">Phân khúc dịch vụ</Link>
                <Link href="/he-sinh-thai#loi-ich" className="font-menu px-5 py-2.5 text-[12px] text-gray-600 dark:text-[#ccc] hover:text-[#D3AE3E] hover:bg-gray-50 dark:hover:bg-white/5 uppercase tracking-wide transition-colors">Lợi ích khách hàng</Link>
                <Link href="/he-sinh-thai#so-sanh" className="font-menu px-5 py-2.5 text-[12px] text-gray-600 dark:text-[#ccc] hover:text-[#D3AE3E] hover:bg-gray-50 dark:hover:bg-white/5 uppercase tracking-wide transition-colors">So sánh phương án tự triển khai</Link>
              </div>
            </div>

            <div className="relative group cursor-pointer">
              <span className="font-menu flex items-center gap-1 text-[13px] font-semibold uppercase tracking-widest text-gray-900 dark:text-white hover:text-[#D3AE3E] transition-colors">
                Dịch vụ
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </span>
              {/* Dropdown Menu */}
              <div className="absolute top-full left-0 mt-6 w-56 bg-white dark:bg-[#131313] border-t-2 border-[#D3AE3E] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 flex flex-col py-2 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)]">
                <Link href="/giam-sat" className="font-menu px-5 py-2.5 text-[12px] text-gray-600 dark:text-[#ccc] hover:text-[#D3AE3E] hover:bg-gray-50 dark:hover:bg-white/5 uppercase tracking-wide transition-colors">Giám sát thi công</Link>
                <Link href="/quy-trinh" className="font-menu px-5 py-2.5 text-[12px] text-gray-600 dark:text-[#ccc] hover:text-[#D3AE3E] hover:bg-gray-50 dark:hover:bg-white/5 uppercase tracking-wide transition-colors">Quy trình triển khai</Link>
              </div>
            </div>

            <div className="relative group cursor-pointer">
              <span className="font-menu flex items-center gap-1 text-[13px] font-semibold uppercase tracking-widest text-gray-900 dark:text-white hover:text-[#D3AE3E] transition-colors">
                Cẩm nang
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </span>
              {/* Dropdown Menu */}
              <div className="absolute top-full left-0 mt-6 w-56 bg-white dark:bg-[#131313] border-t-2 border-[#D3AE3E] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 flex flex-col py-2 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)]">
                <Link href="/cam-nang?category=kien-thuc" className="font-menu px-5 py-2.5 text-[12px] text-gray-600 dark:text-[#ccc] hover:text-[#D3AE3E] hover:bg-gray-50 dark:hover:bg-white/5 uppercase tracking-wide transition-colors">Kiến thức nội thất</Link>
                <Link href="/cam-nang?category=kinh-nghiem" className="font-menu px-5 py-2.5 text-[12px] text-gray-600 dark:text-[#ccc] hover:text-[#D3AE3E] hover:bg-gray-50 dark:hover:bg-white/5 uppercase tracking-wide transition-colors">Kinh nghiệm thi công</Link>
                <Link href="/cam-nang?category=du-an" className="font-menu px-5 py-2.5 text-[12px] text-gray-600 dark:text-[#ccc] hover:text-[#D3AE3E] hover:bg-gray-50 dark:hover:bg-white/5 uppercase tracking-wide transition-colors">Dự án thực tế</Link>
              </div>
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-4 lg:gap-6">
            
            <ThemeToggle />

            <Link 
              href="/tu-van" 
              className="font-menu hidden lg:inline-flex items-center gap-2 bg-[#D3AE3E] text-white px-6 py-3 text-[12px] font-semibold uppercase tracking-widest hover:bg-[#b88c45] hover:text-white transition-colors rounded-[4px]"
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
        className={`fixed inset-0 bg-white/95 dark:bg-black/95 backdrop-blur-xl z-[100] transition-all duration-300 flex flex-col justify-center items-center ${
          isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        <button 
          onClick={() => setIsMobileMenuOpen(false)}
          className="absolute top-6 right-6 w-12 h-12 flex items-center justify-center border border-gray-200 dark:border-white/20 rounded-full text-gray-900 dark:text-white hover:bg-gray-100 dark:bg-[#1a1a1a] dark:hover:bg-white/10 transition-all"
        >
          <X className="w-6 h-6" />
        </button>

        <nav className="flex flex-col items-center gap-8 w-full px-6 h-full overflow-y-auto py-20">
          <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="font-menu text-2xl font-semibold uppercase tracking-widest text-[#D3AE3E] hover:text-gray-900 dark:hover:text-white transition-all">Trang Chủ</Link>
          <Link href="/san-pham" onClick={() => setIsMobileMenuOpen(false)} className="font-menu text-2xl font-semibold uppercase tracking-widest text-gray-900 dark:text-white hover:text-[#D3AE3E] transition-all">Sản Phẩm</Link>
          <Link href="/he-sinh-thai" onClick={() => setIsMobileMenuOpen(false)} className="font-menu text-2xl font-semibold uppercase tracking-widest text-gray-900 dark:text-white hover:text-[#D3AE3E] transition-all">Hệ Sinh Thái</Link>
          <Link href="/giam-sat" onClick={() => setIsMobileMenuOpen(false)} className="font-menu text-2xl font-semibold uppercase tracking-widest text-gray-900 dark:text-white hover:text-[#D3AE3E] transition-all">Dịch Vụ</Link>
          <Link href="/cam-nang" onClick={() => setIsMobileMenuOpen(false)} className="font-menu text-2xl font-semibold uppercase tracking-widest text-gray-900 dark:text-white hover:text-[#D3AE3E] transition-all">Cẩm Nang</Link>
          <Link href="/tu-van" onClick={() => setIsMobileMenuOpen(false)} className="font-menu mt-8 bg-[#D3AE3E] text-white px-8 py-3.5 text-sm font-bold uppercase tracking-widest w-full text-center hover:bg-[#b88c45] transition-colors rounded-[4px]">
            Gửi Nhu Cầu Tư Vấn
          </Link>
        </nav>
      </div>
    </>
  );
}
