"use client";

import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Moon, Menu, X, ChevronDown, Circle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);

  // Handle scroll for sticky header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* 1. TOP BAR */}
      <div className="hidden md:block bg-[#1c1918] py-2 w-full z-50 relative">
        <div className="max-w-[1200px] mx-auto px-4 flex items-center justify-start gap-8">
          <div className="flex items-center gap-2 cursor-pointer group">
            <Mail className="text-[#D3AE3E] w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
            <span className="text-white text-[13px] font-light">hieunt270702@gmail.com</span>
          </div>
          <div className="flex items-center gap-2 cursor-pointer group">
            <Phone className="text-[#D3AE3E] w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
            <span className="text-white text-[13px] font-light">0334 689 521</span>
          </div>
          <div className="flex items-center gap-2 cursor-pointer group">
            <MapPin className="text-[#D3AE3E] w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
            <span className="text-white text-[13px] font-light">Hà Nội, Việt Nam</span>
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER (Sticky) */}
      <header
        className={`w-full z-40 transition-all duration-300 ${isScrolled
          ? 'fixed top-0 bg-white/95 backdrop-blur-md shadow-sm py-3'
          : 'absolute top-auto bg-transparent py-5'
          }`}
      >
        <div className="max-w-[1200px] mx-auto px-4 flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center gap-1.5 group">
            <img
              src="/images/logo-header2.png"
              alt="Logo"
              className="h-[55px] object-contain transition-all duration-300 group-hover:scale-105"
            />
            <span className="font-heading text-[14px] lg:text-[16px] font-bold tracking-[0.12em] hidden sm:block uppercase text-transparent bg-clip-text bg-gradient-to-r from-[#c7a25c] via-[#f1be6d] to-[#D3AE3E]">
              Arcviet Living Nexus
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link href="/" className={`font-semibold text-sm uppercase tracking-wide transition-colors ${isScrolled ? 'text-gray-800 hover:text-[#D3AE3E]' : 'text-white hover:text-[#D3AE3E]'}`}>
              Trang Chủ
            </Link>

            <div className="relative group">
              <button className={`flex items-center gap-1 font-semibold text-sm uppercase tracking-wide transition-colors ${isScrolled ? 'text-gray-800 hover:text-[#D3AE3E]' : 'text-white hover:text-[#D3AE3E]'}`}>
                Đơn Vị <ChevronDown className="w-4 h-4" />
              </button>
              {/* Dropdown */}
              <div className="absolute top-full left-0 mt-4 w-48 bg-white shadow-sm opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 flex flex-col py-2 border-t-2 border-[#D3AE3E]">
                <Link href="/he-sinh-thai" className="px-4 py-2 text-sm text-gray-700 hover:text-[#D3AE3E] hover:bg-gray-50">
                  Hệ Sinh Thái Đơn Vị
                </Link>
                <Link href="/he-sinh-thai" className="px-4 py-2 text-sm text-gray-700 hover:text-[#D3AE3E] hover:bg-gray-50">
                  Phân Khúc Dịch Vụ
                </Link>
              </div>
            </div>

            <Link href="/giam-sat" className={`font-semibold text-sm uppercase tracking-wide transition-colors ${isScrolled ? 'text-gray-800 hover:text-[#D3AE3E]' : 'text-white hover:text-[#D3AE3E]'}`}>
              Giám Sát
            </Link>
            <Link href="/quy-trinh" className={`font-semibold text-sm uppercase tracking-wide transition-colors ${isScrolled ? 'text-gray-800 hover:text-[#D3AE3E]' : 'text-white hover:text-[#D3AE3E]'}`}>
              Quy Trình
            </Link>
            <Link href="/cam-nang" className={`font-semibold text-sm uppercase tracking-wide transition-colors ${isScrolled ? 'text-gray-800 hover:text-[#D3AE3E]' : 'text-white hover:text-[#D3AE3E]'}`}>
              Cẩm Nang
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="hidden lg:flex items-center gap-6">
            <button className={`transition-colors hover:text-[#D3AE3E] ${isScrolled ? 'text-gray-800' : 'text-white'}`}>
              <Moon className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsSidePanelOpen(true)}
              className={`transition-colors hover:text-[#D3AE3E] ${isScrolled ? 'text-gray-800' : 'text-white'}`}
            >
              <Circle className="w-5 h-5" />
            </button>
            <Link
              href="/tu-van"
              className="flex items-center gap-2 bg-[#D3AE3E] text-white px-6 py-2.5 rounded-[4px] hover:bg-[#b88c45] transition-colors font-medium text-sm"
            >
              <Circle className="w-4 h-4" />
              Liên hệ cho tôi
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className={`lg:hidden p-2 ${isScrolled ? 'text-gray-800' : 'text-white'}`}
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="w-7 h-7" />
          </button>
        </div>
      </header>

      {/* 3. MOBILE MENU (Full Screen Glassmorphism) */}
      <div
        className={`fixed inset-0 bg-black/80 backdrop-blur-md z-[100] transition-all duration-500 flex flex-col items-center justify-center ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
          }`}
      >
        <button
          onClick={() => setIsMobileMenuOpen(false)}
          className="absolute top-6 right-6 w-12 h-12 flex items-center justify-center border border-white/20 rounded-full text-white hover:bg-white hover:text-black transition-all"
        >
          <X className="w-6 h-6" />
        </button>

        <nav className="flex flex-col items-center gap-6">
          <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="text-3xl font-light text-white hover:text-[#D3AE3E] hover:scale-105 transition-all">Trang Chủ</Link>
          <Link href="/he-sinh-thai" onClick={() => setIsMobileMenuOpen(false)} className="text-3xl font-light text-white hover:text-[#D3AE3E] hover:scale-105 transition-all">Hệ Sinh Thái</Link>
          <Link href="/giam-sat" onClick={() => setIsMobileMenuOpen(false)} className="text-3xl font-light text-white hover:text-[#D3AE3E] hover:scale-105 transition-all">Giám Sát</Link>
          <Link href="/quy-trinh" onClick={() => setIsMobileMenuOpen(false)} className="text-3xl font-light text-white hover:text-[#D3AE3E] hover:scale-105 transition-all">Quy Trình</Link>
          <Link href="/cam-nang" onClick={() => setIsMobileMenuOpen(false)} className="text-3xl font-light text-white hover:text-[#D3AE3E] hover:scale-105 transition-all">Cẩm Nang</Link>
        </nav>
      </div>

      {/* 4. SIDE PANEL (Offcanvas) */}
      <div className={`fixed inset-y-0 right-0 w-full sm:w-[400px] bg-[#1a1a1a] z-[100] transform transition-transform duration-500 ease-in-out ${isSidePanelOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
        <div className="h-full overflow-y-auto p-10 relative">
          {/* Close button */}
          <button
            onClick={() => setIsSidePanelOpen(false)}
            className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <img src="/images/logo-main2.png" alt="Logo" className="w-[150px] mb-10" />

          <h2 className="font-heading text-2xl font-bold text-white mb-4">Về Chúng Tôi</h2>
          <p className="text-gray-400 text-[15px] leading-relaxed mb-8">
            Hệ sinh thái hơn 30 đơn vị thiết kế – thi công nội thất đã được phân loại theo phân khúc. Chúng tôi giúp bạn kết nối đúng đơn vị, tiết kiệm thời gian và tối ưu chi phí.
          </p>

          <button className="border border-[#D3AE3E] text-[#D3AE3E] px-6 py-2.5 font-medium hover:bg-[#D3AE3E] hover:text-white transition-colors mb-12">
            Tìm Hiểu Thêm
          </button>

          <h2 className="font-heading text-2xl font-bold text-white mb-6">Thư Viện</h2>
          <div className="grid grid-cols-3 gap-2 mb-12">
            <img src="/images/main/13.jpg" alt="Gallery" className="w-full aspect-square object-cover opacity-70 hover:opacity-100 transition-opacity cursor-pointer" />
            <img src="/images/main/14.jpg" alt="Gallery" className="w-full aspect-square object-cover opacity-70 hover:opacity-100 transition-opacity cursor-pointer" />
            <img src="/images/main/15.jpg" alt="Gallery" className="w-full aspect-square object-cover opacity-70 hover:opacity-100 transition-opacity cursor-pointer" />
            <img src="/images/main/16.jpg" alt="Gallery" className="w-full aspect-square object-cover opacity-70 hover:opacity-100 transition-opacity cursor-pointer" />
            <img src="/images/main/17.jpg" alt="Gallery" className="w-full aspect-square object-cover opacity-70 hover:opacity-100 transition-opacity cursor-pointer" />
            <img src="/images/main/18.jpg" alt="Gallery" className="w-full aspect-square object-cover opacity-70 hover:opacity-100 transition-opacity cursor-pointer" />
          </div>
        </div>
      </div>

      {/* Side Panel Overlay Backdrop */}
      {isSidePanelOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          onClick={() => setIsSidePanelOpen(false)}
        />
      )}
    </>
  );
}