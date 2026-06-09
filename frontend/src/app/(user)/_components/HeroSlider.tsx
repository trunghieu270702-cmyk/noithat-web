'use client';
import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

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

/* ── Char Splitting Component ── */
function renderExactTitle(titleNormal: string, titleBold: string, titleLine2: string) {
  let wordIdx = 0;
  let charIdx = 0;
  
  const getWordSpan = (word: string) => {
    const chars = word.split('');
    return (
      <span key={`word-${wordIdx}`} className="word" data-word={word} style={{ '--word-index': wordIdx++ } as any}>
        {chars.map((char) => {
          const currentCI = charIdx++;
          return (
            <span key={`char-${currentCI}`} className="char" data-char={char} style={{ '--char-index': currentCI } as any}>
              {char}
            </span>
          );
        })}
      </span>
    );
  };

  const processText = (text: string, isBold = false) => {
    const words = text.split(' ');
    const elements = words.map((w, idx) => (
      <React.Fragment key={`frag-${wordIdx}`}>
        {getWordSpan(w)}
        {idx < words.length - 1 && <span className="whitespace"> </span>}
      </React.Fragment>
    ));
    return isBold ? <strong>{elements}</strong> : elements;
  };

  const totalChars = (titleNormal + titleBold + titleLine2).replace(/\s/g, '').length;
  const totalWords = (titleNormal + ' ' + titleBold + ' ' + titleLine2).trim().split(/\s+/).length;

  return (
    <h3 
      className="slider-title words chars splitting" 
      data-splitting="" 
      style={{ '--word-total': totalWords, '--char-total': totalChars } as any}
    >
      <div className="whitespace-nowrap">
        {processText(titleNormal)}
        <span className="whitespace"> </span>
        {processText(titleBold, true)}
      </div>
      {processText(titleLine2)}
    </h3>
  );
}

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [prevSlide, setPrevSlide] = useState(0);
  const [isChanging, setIsChanging] = useState(false);
  const total = SLIDES.length;

  /* ── Slick transition ── */
  const goTo = useCallback(
    (next: number) => {
      if (isChanging || next === current) return;
      setIsChanging(true);
      setPrevSlide(current);
      
      setCurrent(next);
      
      setTimeout(() => {
        setIsChanging(false);
      }, 1000); 
    },
    [current, isChanging]
  );

  const prev = useCallback(() => goTo((current - 1 + total) % total), [current, goTo, total]);
  const next = useCallback(() => goTo((current + 1) % total), [current, goTo, total]);

  useEffect(() => {
    const id = setInterval(next, 8000);
    return () => clearInterval(id);
  }, [next]);

  return (
    <section className="relative w-full h-screen min-h-[620px] bg-[#131313] overflow-hidden">
      
      {/* ── Slider Track ── */}
      <div className="relative w-full h-full">
        {SLIDES.map((slide, i) => {
          const isCurrent = current === i;
          const isPrev = prevSlide === i;
          const isActive = isCurrent;
          const actClass = isCurrent && !isChanging ? ' p-tick ' : '';
          
          let zIndex = 0;
          let opacityClass = 'opacity-0';
          let transitionClass = 'transition-opacity duration-1000';
          
          if (isCurrent) {
            zIndex = 30;
            opacityClass = 'opacity-100';
          } else if (isPrev && isChanging) {
            zIndex = 29;
            opacityClass = 'opacity-0';
          } else {
            zIndex = 28;
            opacityClass = 'opacity-0';
            transitionClass = '';
          }
          
          return (
            <div 
              key={i} 
              className={`absolute inset-0 ${transitionClass} ${opacityClass} ${isActive ? 'slick-active' : ''}`}
              style={{ zIndex }}
            >
              <div 
                className="absolute inset-0 bg-cover bg-center after:absolute after:inset-0 after:bg-black/40" 
                style={{ backgroundImage: `url(${slide.bg})` }} 
              />
              
              <div className={`absolute inset-0 z-30 flex pointer-events-none overflow-hidden slider-mask ${isChanging && isCurrent ? 'p-tick slideUpReturn' : ''}`} style={{ animationDelay: '0.2s' }}>
                <div className="flex-1 h-full bg-[#131313] translate-y-full line-item" />
                <div className="flex-1 h-full bg-[#131313] translate-y-full line-item" />
                <div className="flex-1 h-full bg-[#131313] translate-y-full line-item" />
                <div className="flex-1 h-full bg-[#131313] translate-y-full line-item" />
              </div>
              
              {/* ── Caption Content (Centered) ── */}
              <div className="absolute inset-0 z-20 flex items-center justify-center">
                <div className="container mx-auto px-6 md:px-20 max-w-[1200px]">
                  <div className="max-w-[1000px] mx-auto text-center flex flex-col items-center justify-center">
                    
                    <p className={`slider-subtitle ${actClass}fadeIn`} data-animation="fadeIn" data-delay="1.5s" style={{ animationDelay: '1.5s' }}>
                      {slide.subtitle}
                    </p>
                    
                    <div className="slider-hidden w-full flex justify-center">
                      {renderExactTitle(slide.titleNormal, slide.titleBold, slide.titleLine2)}
                    </div>
                    
                    <div className={`slider-line ${actClass}swashIn`} data-animation="swashIn" data-delay="0.5s" style={{ animationDelay: '0.5s' }} />
                    
                    <p className={`slider-text ${actClass}fadeInDown`} data-animation="fadeInDown" data-delay="1s" style={{ animationDelay: '1s' }}>
                      {slide.text}
                    </p>
                    
                    <div className="flex flex-wrap justify-center items-center">
                      <div className={`btn-relative ${actClass}swashIn`} data-animation="swashIn" data-delay="1.8s" data-animation-duration="1s" style={{ animationDelay: '1.8s' }}>
                        <Link 
                          href={slide.btn1.href} 
                          tabIndex={isActive ? 0 : -1}
                          className="slider-btn dsc-btn-style1"
                        >
                          {slide.btn1.label}
                        </Link>
                      </div>
                      
                      <div className={`btn-relative ${actClass}swashIn`} data-animation="swashIn" data-delay="1.8s" data-animation-duration="1s" style={{ animationDelay: '1.8s' }}>
                        <Link 
                          href={slide.btn2.href} 
                          tabIndex={isActive ? 0 : -1}
                          className="slider-btn dsc-btn-style2"
                        >
                          {slide.btn2.label}
                        </Link>
                      </div>
                    </div>
                    
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Navigation Arrows (Bottom Right Corner as seen in screenshot) ── */}
      <div className="absolute bottom-0 right-0 z-[35] flex">
        <button 
          onClick={prev} 
          aria-label="Previous slide"
          className="w-[50px] h-[50px] flex items-center justify-center bg-white/20 text-white hover:bg-[#ce9e51] transition-colors cursor-pointer border-none outline-none text-[16px]"
        >
          <i className="fa fa-angle-left" />
        </button>
        <button 
          onClick={next} 
          aria-label="Next slide"
          className="w-[50px] h-[50px] flex items-center justify-center bg-white/20 text-white hover:bg-[#ce9e51] transition-colors cursor-pointer border-none outline-none text-[16px] border-l border-white/10"
        >
          <i className="fa fa-angle-right" />
        </button>
      </div>

      {/* ── Social Icons (Left Side - Assuming they should stay but adjusted based on theme) ── */}
      <div className="hidden lg:flex absolute left-8 top-1/2 -translate-y-1/2 z-[35] flex-col items-center gap-[1.2rem]">
        <div className="w-[1px] h-[60px] bg-white/30 mb-2"></div>
        <a href="#" target="_blank" rel="noreferrer" aria-label="Facebook" className="w-8 h-8 rounded-full border border-transparent flex items-center justify-center text-white/70 hover:border-white hover:text-white transition-colors text-[12px]">
          <i className="fab fa-facebook-f" aria-hidden="true" />
        </a>
        <a href="#" target="_blank" rel="noreferrer" aria-label="Behance" className="w-8 h-8 rounded-full border border-transparent flex items-center justify-center text-white/70 hover:border-white hover:text-white transition-colors text-[12px]">
          <i className="fab fa-behance" aria-hidden="true" />
        </a>
        <a href="#" target="_blank" rel="noreferrer" aria-label="Instagram" className="w-8 h-8 rounded-full border border-transparent flex items-center justify-center text-white/70 hover:border-white hover:text-white transition-colors text-[12px]">
          <i className="fab fa-instagram" aria-hidden="true" />
        </a>
        <a href="#" target="_blank" rel="noreferrer" aria-label="YouTube" className="w-8 h-8 rounded-full border border-transparent flex items-center justify-center text-white/70 hover:border-white hover:text-white transition-colors text-[12px]">
          <i className="fab fa-youtube" aria-hidden="true" />
        </a>
        <div className="w-[1px] h-[60px] bg-white/30 mt-2"></div>
      </div>
      
    </section>
  );
}
