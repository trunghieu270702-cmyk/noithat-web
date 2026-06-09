import React from 'react';
import ScrollReveal from './ScrollReveal';

export default function InnovationBanner() {
  return (
    <section className="relative py-32 bg-[#131313] flex items-center justify-center overflow-hidden">
      {/* Background Image & Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-fixed opacity-40"
        style={{ backgroundImage: 'url(/images/common/bg-pattern.jpg)' }}
      />
      <div className="absolute inset-0 bg-black/60" />

      <div className="relative z-10 max-w-[1200px] mx-auto px-6 text-center">
        <ScrollReveal animation="fade-up" delay={100}>
          {/* Title */}
          <h6 className="text-[#D3AE3E] text-[13px] font-semibold tracking-[4px] uppercase mb-6 font-['Montserrat',_sans-serif]">
            Innovation Starts Here
          </h6>
        </ScrollReveal>
        
        <ScrollReveal animation="fade-up" delay={300}>
          {/* Main Text */}
          <p className="text-white text-3xl md:text-5xl font-bold leading-tight font-['Montserrat',_sans-serif]">
            NoiThat has been giving best consultation to top USA’s<br className="hidden md:block" />
            Engineering companies since 1975
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
