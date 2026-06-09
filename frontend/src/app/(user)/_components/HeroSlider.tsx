'use client';
import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, Variants } from 'framer-motion';

/* ── Slide data ── */
const SLIDES = [
  {
    bg: '/images/common/bg-hero-1.jpg',
    subtitle: 'ĐƯỢC TUYỂN CHỌN & PHÂN LOẠI',
    titleNormal: 'Chọn đúng',
    titleBold: 'Đơn vị nội thất',
    titleLine2: 'Trước khi bắt đầu công trình',
    text: 'Hệ sinh thái hơn 30 đơn vị thiết kế – thi công đã được phân loại, giúp khách hàng kết nối đúng bên phù hợp, tiết kiệm 5% và có thêm giải pháp giám sát thi công khi cần.',
    btn1: { label: 'Nhận tư vấn phù hợp', href: '/tu-van' },
    btn2: { label: 'Xem hệ sinh thái', href: '/he-sinh-thai' },
  },
  {
    bg: '/images/common/bg-hero-2.jpg',
    subtitle: 'HỖ TRỢ TRONG SUỐT QUÁ TRÌNH',
    titleNormal: 'Kiểm soát',
    titleBold: 'Chất lượng',
    titleLine2: 'Tiến độ & Rủi ro',
    text: 'Dành cho khách hàng muốn có thêm một bên độc lập hỗ trợ kiểm tra quá trình thi công, hạn chế lỗi phát sinh và đảm bảo công trình được triển khai đúng theo kế hoạch.',
    btn1: { label: 'Dịch vụ giám sát', href: '/giam-sat' },
    btn2: { label: 'Quy trình làm việc', href: '/quy-trinh' },
  }
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const total = SLIDES.length;

  const next = useCallback(() => setCurrent((prev) => (prev + 1) % total), [total]);
  const prev = useCallback(() => setCurrent((prev) => (prev - 1 + total) % total), [total]);

  useEffect(() => {
    const id = setInterval(next, 8000);
    return () => clearInterval(id);
  }, [next]);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      }
    },
    exit: { opacity: 0, transition: { duration: 0.5 } }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
  };

  return (
    <section className="relative w-full h-screen min-h-[620px] bg-[#050505] overflow-hidden">
      
      {/* ── Slider Track ── */}
      <AnimatePresence initial={false}>
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute inset-0 z-0"
        >
          <div 
            className="absolute inset-0 bg-cover bg-center after:absolute after:inset-0 after:bg-gradient-to-b after:from-black/60 after:via-black/40 after:to-[#0a0a0a]" 
            style={{ backgroundImage: `url(${SLIDES[current].bg})` }} 
          />
        </motion.div>
      </AnimatePresence>

      {/* ── Caption Content (Centered) ── */}
      <div className="absolute inset-0 z-20 flex items-center justify-center">
        <div className="container mx-auto px-6 md:px-20 max-w-[1200px]">
          <AnimatePresence mode="wait">
            <motion.div 
              key={current}
              variants={containerVariants}
              initial="hidden"
              animate="show"
              exit="exit"
              className="max-w-[1000px] mx-auto text-center flex flex-col items-center justify-center"
            >
              
              <motion.p variants={itemVariants} className="text-[#D3AE3E] text-[12px] md:text-[14px] font-bold tracking-[0.3em] uppercase mb-6 font-['Montserrat',_sans-serif]">
                {SLIDES[current].subtitle}
              </motion.p>
              
              <motion.div variants={itemVariants} className="w-full flex flex-col items-center justify-center mb-8">
                <h3 className="text-4xl md:text-5xl lg:text-[72px] font-['Montserrat',_sans-serif] leading-[1.25] md:leading-[1.15] tracking-tight">
                  <span className="font-bold text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] mr-4">
                    {SLIDES[current].titleNormal}
                  </span>
                  <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-[#D3AE3E] via-[#FFF0B9] to-[#AD8517] drop-shadow-[0_0_30px_rgba(211,174,62,0.3)]">
                    {SLIDES[current].titleBold}
                  </span>
                  <br />
                  <span className="font-medium text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] mt-3 inline-block">
                    {SLIDES[current].titleLine2}
                  </span>
                </h3>
              </motion.div>
              
              <motion.div variants={itemVariants} className="w-24 h-[2px] bg-gradient-to-r from-transparent via-[#D3AE3E] to-transparent mb-8" />
              
              <motion.p variants={itemVariants} className="text-[#bbb] font-['Montserrat',_sans-serif] text-[16px] md:text-[18px] leading-[1.8] max-w-3xl mb-12">
                {SLIDES[current].text}
              </motion.p>
              
              <motion.div variants={itemVariants} className="flex flex-wrap justify-center items-center gap-6">
                <Link 
                  href={SLIDES[current].btn1.href} 
                  className="relative overflow-hidden group bg-[#D3AE3E] text-[#131313] font-bold font-['Montserrat',_sans-serif] text-[13px] uppercase tracking-[2px] py-4 px-8 rounded-sm hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(211,174,62,0.4)]"
                >
                  <span className="relative z-10">{SLIDES[current].btn1.label}</span>
                  <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover:animate-shimmer" />
                </Link>
                
                <Link 
                  href={SLIDES[current].btn2.href} 
                  className="relative overflow-hidden group bg-transparent text-white border border-white/30 font-bold font-['Montserrat',_sans-serif] text-[13px] uppercase tracking-[2px] py-4 px-8 rounded-sm hover:bg-white hover:text-[#131313] transition-all duration-300"
                >
                  <span className="relative z-10">{SLIDES[current].btn2.label}</span>
                </Link>
              </motion.div>
              
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ── Navigation Arrows ── */}
      <div className="absolute bottom-0 right-0 z-[35] flex">
        <button 
          onClick={prev} 
          aria-label="Previous slide"
          className="w-[60px] h-[60px] flex items-center justify-center bg-black/40 backdrop-blur-md text-white hover:bg-[#D3AE3E] transition-colors cursor-pointer border-none outline-none text-[20px]"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
        </button>
        <button 
          onClick={next} 
          aria-label="Next slide"
          className="w-[60px] h-[60px] flex items-center justify-center bg-black/40 backdrop-blur-md text-white hover:bg-[#D3AE3E] transition-colors cursor-pointer border-none outline-none text-[20px] border-l border-white/10"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
        </button>
      </div>

      {/* ── Social Icons ── */}
      <div className="hidden lg:flex absolute left-8 top-1/2 -translate-y-1/2 z-[35] flex-col items-center gap-6 mix-blend-difference">
        <div className="w-[1px] h-[80px] bg-white/30 mb-2"></div>
        <a href="#" className="text-white hover:text-[#D3AE3E] transition-colors">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
        </a>
        <a href="#" className="text-white hover:text-[#D3AE3E] transition-colors">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
        </a>
        <a href="#" className="text-white hover:text-[#D3AE3E] transition-colors">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
        </a>
        <div className="w-[1px] h-[80px] bg-white/30 mt-2"></div>
      </div>
      
    </section>
  );
}
