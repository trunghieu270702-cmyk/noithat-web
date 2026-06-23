'use client';
import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import BackgroundVisuals from './BackgroundVisuals';

/* ── Slide data ── */
const SLIDES = [
  {
    videoUrl: '', // TODO: Điền link video mp4 nội thất sang trọng vào đây (VD: '/videos/luxury-interior.mp4')
    bgLight: '/images/main/banner-l1.jpg',
    bgDark: '/images/main/banner_d1.jpg',
    subtitle: 'ARCViet Living Nexus',
    titleNormal: 'Một kết nối -',
    titleBold: 'Vạn giá trị',
    titleLine2: 'Hệ sinh thái nội thất toàn diện',
    text: 'ArcViet Living Nexus mang đến giải pháp kết nối hoàn hảo giữa khách hàng và các đối tác thiết kế thi công hàng đầu.',
    btn1: { label: 'Khám phá hệ sinh thái', href: '/he-sinh-thai' },
    btn2: { label: 'Đặt lịch tư vấn riêng', href: '/tu-van' },
  },
  {
    bgLight: '/images/main/banner-l2.jpg',
    bgDark: '/images/main/banner_d2.jpg',
    subtitle: 'ĐƯỢC TUYỂN CHỌN & PHÂN LOẠI',
    titleNormal: 'Chọn đúng',
    titleBold: 'Đơn vị nội thất',
    titleLine2: 'Trước khi bắt đầu công trình',
    text: 'Hệ sinh thái hơn 30 đơn vị thiết kế – thi công đã được phân loại, giúp khách hàng kết nối đúng bên phù hợp, tiết kiệm 5% và có thêm giải pháp giám sát thi công khi cần.',
    btn1: { label: 'Khám phá hệ sinh thái', href: '/he-sinh-thai' },
    btn2: { label: 'Đặt lịch tư vấn riêng', href: '/tu-van' },
  },
  {
    bgLight: '/images/main/banner-l3.jpg',
    bgDark: '/images/main/banner-d3.jpg',
    subtitle: 'HỖ TRỢ TRONG SUỐT QUÁ TRÌNH',
    titleNormal: 'Kiểm soát',
    titleBold: 'Chất lượng',
    titleLine2: 'Tiến độ & Rủi ro',
    text: 'Dành cho khách hàng muốn có thêm một bên độc lập hỗ trợ kiểm tra quá trình thi công, hạn chế lỗi phát sinh và đảm bảo công trình được triển khai đúng theo kế hoạch.',
    btn1: { label: 'Khám phá hệ sinh thái', href: '/he-sinh-thai' },
    btn2: { label: 'Đặt lịch tư vấn riêng', href: '/tu-van' },
  },
  {
    bgLight: '/images/main/banner-l4.jpg',
    bgDark: '/images/main/banner-d4.jpg',
    subtitle: 'GIẢI PHÁP TỐI ƯU',
    titleNormal: 'Kiến tạo',
    titleBold: 'Không gian',
    titleLine2: 'Đẳng cấp & Sang trọng',
    text: 'Mang đến những trải nghiệm sống đỉnh cao với sự tinh tế trong từng đường nét thiết kế, đáp ứng hoàn hảo mọi nhu cầu của khách hàng.',
    btn1: { label: 'Khám phá hệ sinh thái', href: '/he-sinh-thai' },
    btn2: { label: 'Đặt lịch tư vấn riêng', href: '/tu-van' },
  }
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const rafRef = React.useRef<number | null>(null);
  const total = SLIDES.length;

  const next = useCallback(() => setCurrent((prev) => (prev + 1) % total), [total]);

  useEffect(() => {
    const id = setInterval(next, 8000);
    return () => clearInterval(id);
  }, [next]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }
    const clientX = e.clientX;
    const clientY = e.clientY;
    
    rafRef.current = requestAnimationFrame(() => {
      const x = (clientX / window.innerWidth - 0.5) * 2;
      const y = (clientY / window.innerHeight - 0.5) * 2;
      setMousePos({ x, y });
    });
  }, []);

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
    <section 
      className="relative w-full h-screen min-h-[620px] bg-[#050505] overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      
      {/* ── Subtle Luxury Architectural Background ── */}
      <div className="absolute inset-0 z-[5] pointer-events-none">
        <BackgroundVisuals mouseX={mousePos.x} mouseY={mousePos.y} />
      </div>

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
          {/* Light Mode Banner */}
          <div className="absolute inset-0 dark:hidden">
            {SLIDES[current].videoUrl ? (
              <video
                src={SLIDES[current].videoUrl}
                autoPlay loop muted playsInline
                poster={SLIDES[current].bgLight}
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <img
                src={SLIDES[current].bgLight}
                alt="Banner"
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/50 mix-blend-multiply" />
          </div>
          {/* Dark Mode Banner */}
          <div className="absolute inset-0 hidden dark:block">
            {SLIDES[current].videoUrl ? (
              <video
                src={SLIDES[current].videoUrl}
                autoPlay loop muted playsInline
                poster={SLIDES[current].bgDark}
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <img
                src={SLIDES[current].bgDark}
                alt="Banner Dark"
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/80 mix-blend-multiply" />
          </div>
        </motion.div>
      </AnimatePresence>

      {/* ── Caption Content (Centered) ── */}
      <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
        <div className="container mx-auto px-6 md:px-20 max-w-[1400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              variants={containerVariants}
              initial="hidden"
              animate="show"
              exit="exit"
              className="max-w-[1400px] mx-auto text-center flex flex-col items-center justify-center pointer-events-auto"
            >

              <motion.p variants={itemVariants} className="text-[#D3AE3E] text-[12px] md:text-[14px] font-bold tracking-[0.3em] uppercase mb-6 drop-shadow-md">
                {SLIDES[current].subtitle}
              </motion.p>

              <motion.div variants={itemVariants} className="w-full flex flex-col items-center justify-center mb-8">
                <h3 className="font-heading uppercase text-4xl md:text-5xl lg:text-[72px] leading-[1.25] md:leading-[1.15] tracking-tight drop-shadow-xl">
                  <span className="font-bold text-white mr-4">
                    {SLIDES[current].titleNormal}
                  </span>
                  <span className="font-black text-gold-shimmer drop-shadow-2xl">
                    {SLIDES[current].titleBold}
                  </span>
                  <br />
                  <span className="font-medium text-white/90 mt-3 inline-block">
                    {SLIDES[current].titleLine2}
                  </span>
                </h3>
              </motion.div>

              <motion.div variants={itemVariants} className="w-24 h-[2px] bg-gradient-to-r from-transparent via-[#D3AE3E] to-transparent mb-8" />

              <motion.p variants={itemVariants} className="text-white/90 text-[16px] md:text-[18px] leading-[1.8] max-w-3xl mb-12 drop-shadow-md">
                {SLIDES[current].text}
              </motion.p>

              <motion.div variants={itemVariants} className="flex flex-wrap justify-center items-center gap-6">
                <Link
                  href={SLIDES[current].btn1.href}
                  className="btn-luxury-primary font-bold text-[13px] uppercase tracking-[2px] py-4 px-8 rounded-[2px]"
                >
                  {SLIDES[current].btn1.label}
                </Link>

                <Link
                  href={SLIDES[current].btn2.href}
                  className="btn-luxury-secondary font-bold text-[13px] uppercase tracking-[2px] py-4 px-8 rounded-[2px]"
                >
                  {SLIDES[current].btn2.label}
                </Link>
              </motion.div>

            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ── Social Icons ── */}
      <div className="hidden lg:flex absolute left-8 top-1/2 -translate-y-1/2 z-[35] flex-col items-center gap-5">
        <div className="w-[1px] h-[60px] bg-gradient-to-b from-transparent to-white/30 mb-2"></div>
        <a href="#" className="flex items-center justify-center w-10 h-10 rounded-full border border-white/20 text-white hover:text-[#D3AE3E] hover:border-[#D3AE3E] bg-white/5 backdrop-blur-sm transition-all duration-500 hover:scale-110">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
        </a>
        <a href="#" className="flex items-center justify-center w-10 h-10 rounded-full border border-white/20 text-white hover:text-[#D3AE3E] hover:border-[#D3AE3E] bg-white/5 backdrop-blur-sm transition-all duration-500 hover:scale-110">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
        </a>
        <a href="#" className="flex items-center justify-center w-10 h-10 rounded-full border border-white/20 text-white hover:text-[#D3AE3E] hover:border-[#D3AE3E] bg-white/5 backdrop-blur-sm transition-all duration-500 hover:scale-110">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
        </a>
        <div className="w-[1px] h-[60px] bg-gradient-to-t from-transparent to-white/30 mt-2"></div>
      </div>

    </section>
  );
}
