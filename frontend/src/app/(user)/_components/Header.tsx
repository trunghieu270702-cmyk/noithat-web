import React from 'react';
import Link from 'next/link';

export default function Header() {
  return (
    <>
      {/* --- TOP BAR (Hidden on Mobile/Tablet) --- */}
      <div className="hidden lg:flex border-b border-white/5 py-3 bg-black">
        <div className="max-w-[1200px] mx-auto px-6 w-full flex items-center justify-start gap-12">
          {/* Email */}
          <div className="flex items-center gap-3">
            <svg className="w-4 h-4 text-[#D3AE3E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
            <span className="text-[13px] font-medium font-['Montserrat',_sans-serif] text-[#888]">support@noithat.com</span>
          </div>
          {/* Phone */}
          <div className="flex items-center gap-3">
            <svg className="w-4 h-4 text-[#D3AE3E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
            </svg>
            <span className="text-[13px] font-medium font-['Montserrat',_sans-serif] text-[#888]">009462 2238, 2248</span>
          </div>
          {/* Clock */}
          <div className="flex items-center gap-3">
            <svg className="w-4 h-4 text-[#D3AE3E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span className="text-[13px] font-medium font-['Montserrat',_sans-serif] text-[#888]">Opening time: Mon-Fri 9:00 AM - 18:00 PM</span>
          </div>
        </div>
      </div>

      {/* --- MAIN HEADER --- */}
      <div className="w-full sticky top-0 z-50 bg-[#131313]/95 backdrop-blur-sm border-b border-white/10 transition-all duration-300">
        <div className="max-w-[1200px] mx-auto px-6 w-full flex items-center justify-between h-[80px]">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/">
              <img 
                src="/images/logo-main.png" 
                alt="logo" 
                className="h-[55px] w-auto transition-transform hover:scale-105"
              />
            </Link>
          </div>

          {/* Navigation Menu (Hidden on Mobile) */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link href="/" className="text-[13px] font-semibold uppercase tracking-widest text-[#D3AE3E] hover:text-[#D3AE3E] font-['Montserrat',_sans-serif] transition-colors">Trang chủ</Link>
            
            <div className="relative group cursor-pointer">
              <span className="flex items-center gap-1 text-[13px] font-semibold uppercase tracking-widest text-white hover:text-[#D3AE3E] font-['Montserrat',_sans-serif] transition-colors">
                Hệ sinh thái
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </span>
              {/* Dropdown Menu */}
              <div className="absolute top-full left-0 mt-6 w-56 bg-[#1a1a1a] border-t-2 border-[#D3AE3E] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 flex flex-col py-2 shadow-xl">
                <Link href="/he-sinh-thai" className="px-5 py-2.5 text-[12px] text-[#ccc] hover:text-[#D3AE3E] hover:bg-white/5 uppercase tracking-wide font-['Montserrat',_sans-serif] transition-colors">Đơn vị thiết kế</Link>
                <Link href="/he-sinh-thai?filter=phan-khuc" className="px-5 py-2.5 text-[12px] text-[#ccc] hover:text-[#D3AE3E] hover:bg-white/5 uppercase tracking-wide font-['Montserrat',_sans-serif] transition-colors">Phân khúc dịch vụ</Link>
              </div>
            </div>

            <div className="relative group cursor-pointer">
              <span className="flex items-center gap-1 text-[13px] font-semibold uppercase tracking-widest text-white hover:text-[#D3AE3E] font-['Montserrat',_sans-serif] transition-colors">
                Dịch vụ
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </span>
              {/* Dropdown Menu */}
              <div className="absolute top-full left-0 mt-6 w-56 bg-[#1a1a1a] border-t-2 border-[#D3AE3E] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 flex flex-col py-2 shadow-xl">
                <Link href="/giam-sat" className="px-5 py-2.5 text-[12px] text-[#ccc] hover:text-[#D3AE3E] hover:bg-white/5 uppercase tracking-wide font-['Montserrat',_sans-serif] transition-colors">Giám sát thi công</Link>
                <Link href="/quy-trinh" className="px-5 py-2.5 text-[12px] text-[#ccc] hover:text-[#D3AE3E] hover:bg-white/5 uppercase tracking-wide font-['Montserrat',_sans-serif] transition-colors">Quy trình</Link>
              </div>
            </div>

            <Link href="/cam-nang" className="text-[13px] font-semibold uppercase tracking-widest text-white hover:text-[#D3AE3E] font-['Montserrat',_sans-serif] transition-colors">Cẩm nang</Link>
            <Link href="/tu-van" className="text-[13px] font-semibold uppercase tracking-widest text-white hover:text-[#D3AE3E] font-['Montserrat',_sans-serif] transition-colors">Liên hệ</Link>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-6">
            
            {/* CTA Button */}
            <Link 
              href="/tu-van" 
              className="hidden lg:inline-flex items-center gap-2 bg-[#D3AE3E] text-white px-6 py-3 text-[12px] font-semibold uppercase tracking-widest hover:bg-white hover:text-[#131313] transition-colors font-['Montserrat',_sans-serif]"
            >
              Gửi nhu cầu tư vấn
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"></path>
              </svg>
            </Link>

            {/* Mobile Hamburger Menu */}
            <button className="lg:hidden text-white hover:text-[#D3AE3E] transition-colors focus:outline-none">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
