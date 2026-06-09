'use client';
import React from 'react';
import Link from 'next/link';
import ScrollReveal from './ScrollReveal';

export default function Section10CTA() {
  return (
    <section className="relative py-32 bg-[#1a1a1a] flex items-center justify-center overflow-hidden border-y border-white/5">
      {/* Background Image & Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed opacity-30"
        style={{ backgroundImage: 'url(/images/common/bg-hero-2.jpg)' }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#1a1a1a]/80 to-transparent" />

      <div className="relative z-10 max-w-[900px] mx-auto px-6 text-center">
        <ScrollReveal animation="fade-up" delay={100}>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 font-['Montserrat',_sans-serif] leading-[1.2]">
            Bắt đầu với một tư vấn <span className="text-[#D3AE3E]">đúng</span> ngay từ đầu
          </h2>
        </ScrollReveal>

        <ScrollReveal animation="fade-up" delay={300}>
          <p className="text-[#e2e2e2] text-[16px] md:text-[18px] mb-6 font-['Montserrat',_sans-serif] leading-relaxed">
            Một đơn vị phù hợp không chỉ giúp công trình đẹp hơn, mà còn giúp khách hàng tiết kiệm thời gian, tối ưu ngân sách và giảm rủi ro trong quá trình thi công.
          </p>
          <p className="text-[#999] text-[15px] md:text-[17px] mb-12 font-['Montserrat',_sans-serif] leading-relaxed">
            Hãy gửi nhu cầu công trình của bạn để được tư vấn nhóm đơn vị phù hợp trong hệ sinh thái hơn 30 đối tác thiết kế – thi công nội thất.
          </p>
        </ScrollReveal>

        <ScrollReveal animation="fade-up" delay={500}>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="#Form"
              className="inline-flex items-center justify-center px-10 py-5 bg-[#D3AE3E] text-white uppercase tracking-wider text-[14px] font-bold font-['Montserrat',_sans-serif] hover:bg-white hover:text-black transition-colors duration-300"
            >
              Gửi nhu cầu công trình
            </Link>
            <Link
              href="#Contact"
              className="inline-flex items-center justify-center px-10 py-5 border-2 border-white/20 bg-transparent text-white uppercase tracking-wider text-[14px] font-bold font-['Montserrat',_sans-serif] hover:border-[#D3AE3E] hover:text-[#D3AE3E] transition-colors duration-300"
            >
              Nhận tư vấn đơn vị phù hợp
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
