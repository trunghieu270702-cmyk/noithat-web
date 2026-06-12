'use client';
import React from 'react';
import Link from 'next/link';
import ScrollReveal from './ScrollReveal';

export default function Section10CTA() {
  return (
    <section className="relative py-32 bg-white dark:bg-[#1a1a1a] shadow-sm dark:shadow-none border border-gray-100 dark:border-white/10 flex items-center justify-center overflow-hidden border-y border-gray-200 dark:border-white/20">
      {/* Background Image & Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed opacity-15 dark:opacity-30 luxury-image-filter"
        style={{ backgroundImage: 'url(/images/main/banner_d1.jpg)' }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#F8F6F2] via-[#F8F6F2]/90 dark:from-[#0a0a0a] dark:via-[#1a1a1a]/80 to-transparent" />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 text-center">
        <ScrollReveal animation="fade-up" delay={100}>
          <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-8 leading-[1.2]">
            Bắt đầu với một tư vấn <span className="text-[#D3AE3E]">đúng</span> ngay từ đầu
          </h2>
        </ScrollReveal>

        <ScrollReveal animation="fade-up" delay={300}>
          <p className="text-gray-600 dark:text-[#e2e2e2] text-[16px] md:text-[18px] mb-6 leading-relaxed">
            Một đơn vị phù hợp không chỉ giúp công trình đẹp hơn, mà còn giúp khách hàng tiết kiệm thời gian, tối ưu ngân sách và giảm rủi ro trong quá trình thi công.
          </p>
          <p className="text-gray-500 dark:text-[#999] text-[15px] md:text-[17px] mb-12 leading-relaxed">
            Hãy gửi nhu cầu công trình của bạn để được tư vấn nhóm đơn vị phù hợp trong hệ sinh thái hơn 30 đối tác thiết kế – thi công nội thất.
          </p>
        </ScrollReveal>

        <ScrollReveal animation="fade-up" delay={500}>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="#Form"
              className="inline-flex items-center justify-center px-10 py-5 bg-[#D3AE3E] text-white uppercase tracking-wider text-[14px] font-bold hover:bg-[#b88c45] hover:text-white transition-colors duration-300 rounded-[4px]"
            >
              Gửi nhu cầu công trình
            </Link>
            <Link
              href="#Contact"
              className="inline-flex items-center justify-center px-10 py-5 border-2 border-gray-300 dark:border-white/20 bg-transparent text-gray-900 dark:text-white uppercase tracking-wider text-[14px] font-bold hover:border-[#D3AE3E] hover:text-[#D3AE3E] transition-colors duration-300 rounded-[4px]"
            >
              Nhận tư vấn đơn vị phù hợp
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
