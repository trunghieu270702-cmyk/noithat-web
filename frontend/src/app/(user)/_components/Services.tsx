'use client';
import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import ScrollReveal from './ScrollReveal';

const SERVICES = [
  {
    title: 'Architecture Studio',
    img: '/images/services/service-design.jpg',
    icon: '/images/services/icon-design.png',
    text: 'We designs spaces and ambiances to best meet Clients’ functional and reasonable standards.',
    link: '#'
  },
  {
    title: 'Interior Design',
    img: '/images/services/service-interior.jpg',
    icon: '/images/services/icon-interior.png',
    text: 'The interior dynamics of built spaces and reasonable standards to be greeting welcome.',
    link: '#'
  },
  {
    title: 'Engineering works',
    img: '/images/services/service-lighting.jpg',
    icon: '/images/services/icon-lighting.png',
    text: 'To covering and reasonable standards structure, mechanical, electrical and plumbing for (MEP).',
    link: '#'
  },
  {
    title: 'GIS & Planning',
    img: '/images/services/service-landscape.jpg',
    icon: '/images/services/icon-landscape.png',
    text: 'Through the balanced integration of and reasonable standards green spaces and hard escaping.',
    link: '#'
  },
  {
    title: 'Decoration art',
    img: '/images/portfolio/project-cinema.jpg',
    icon: '/images/services/icon-architecture.png',
    text: 'To covering and reasonable standards structure, mechanical, electrical and plumbing for (MEP).',
    link: '#'
  }
];

export default function Services() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsToShow, setItemsToShow] = useState(3);

  // Handle responsive items to show
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setItemsToShow(1);
      } else if (window.innerWidth < 1024) {
        setItemsToShow(2);
      } else {
        setItemsToShow(3);
      }
    };
    
    // Initial check
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const totalItems = SERVICES.length;
  const maxIndex = Math.max(0, totalItems - itemsToShow);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  // Auto play
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 4000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  const goToSlide = (index: number) => {
    setCurrentIndex(Math.min(index, maxIndex));
  };

  return (
    <section id="Services" className="relative py-32 bg-[#131313] overflow-hidden">
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-[url('/images/common/bg-pattern.jpg')] bg-cover bg-center opacity-5" />

      <div className="relative z-10 max-w-[1200px] mx-auto px-6">
        
        {/* Section Header */}
        <ScrollReveal animation="fade-up" delay={100}>
          <div className="text-center mb-16">
            <h6 className="text-[#D3AE3E] text-[13px] font-semibold tracking-[4px] uppercase mb-4 font-['Montserrat',_sans-serif]">
              What We Do
            </h6>
            <h3 className="text-4xl md:text-[40px] font-bold text-white mb-6 font-['Montserrat',_sans-serif] tracking-tight flex justify-center gap-[2px]">
              {'Our Services'.split('').map((char, index) => (
                <span key={index} className={char === ' ' ? 'w-3' : ''}>{char}</span>
              ))}
            </h3>
            <p className="text-[#999] font-['Montserrat',_sans-serif] max-w-3xl mx-auto leading-relaxed text-[14px] md:text-[15px]">
              This including consulting multi disciplinary consulting work with design and engineering, 
              our world branches giving full support for executing professional work.
            </p>
          </div>
        </ScrollReveal>

        {/* Services Carousel */}
        <div className="relative overflow-hidden mt-10 -mx-4">
          <div 
            className="flex transition-transform duration-700 ease-out"
            style={{ 
              transform: `translateX(-${currentIndex * (100 / itemsToShow)}%)` 
            }}
          >
            {SERVICES.map((item, i) => (
              <div 
                key={i} 
                className="flex-shrink-0 px-4"
                style={{ width: `${100 / itemsToShow}%` }}
              >
                <ScrollReveal animation="fade-up" delay={200 + (i % itemsToShow) * 150} className="h-full">
                  <div className="group bg-[#1a1a1a] transition-all hover:bg-[#222] h-full flex flex-col">
                    {/* Image Box */}
                    <Link href={item.link} className="block relative h-[260px] overflow-hidden shrink-0">
                      <div 
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                        style={{ backgroundImage: `url(${item.img})` }}
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-500" />
                    </Link>

                    {/* Content Box */}
                    <div className="p-8 flex flex-col flex-grow">
                      <div className="mb-6">
                        <img src={item.icon} alt="Icon" className="h-12 w-auto object-contain brightness-0 invert opacity-80 group-hover:opacity-100 transition-opacity" />
                      </div>

                      <h3 className="text-[22px] font-bold font-['Montserrat',_sans-serif] text-white mb-4 transition-colors">
                        <Link href={item.link} className="hover:text-[#D3AE3E]">{item.title}</Link>
                      </h3>
                      
                      <p className="text-[#888] font-['Montserrat',_sans-serif] leading-[1.8] text-[14px] mb-8 flex-grow">
                        {item.text}
                      </p>

                      {/* Feature Button */}
                      <Link 
                        href={item.link}
                        className="inline-flex items-center text-[13px] font-bold font-['Montserrat',_sans-serif] tracking-widest uppercase text-[#D3AE3E] hover:text-white transition-colors mt-auto"
                      >
                        Show More
                      </Link>
                    </div>
                  </div>
                </ScrollReveal>
              </div>
            ))}
          </div>
        </div>

        {/* Carousel Dots */}
        <div className="flex justify-center items-center gap-3 mt-12">
          {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
            <button 
              key={idx}
              onClick={() => goToSlide(idx)}
              className={`h-3 rounded-full transition-all duration-300 ${
                currentIndex === idx 
                  ? 'w-8 bg-[#D3AE3E]' 
                  : 'w-3 bg-white/20 hover:bg-[#D3AE3E]/50'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
