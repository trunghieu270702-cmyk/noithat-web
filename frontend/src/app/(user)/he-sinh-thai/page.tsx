'use client';

import React from 'react';
import Link from 'next/link';
import Section6Ecosystem from '../_components/Section6Ecosystem';
import Section2Problem from '../_components/Section2Problem';
import Section3Solution from '../_components/Section3Solution';
import Section4Benefits from '../_components/Section4Benefits';
import Section5Comparison from '../_components/Section5Comparison';
import Section9Process from '../_components/Section9Process';

export default function HeSinhThaiPage() {
  return (
    <div className="bg-[#F8F6F2] dark:bg-[#131313] min-h-screen">
      {/* Các nội dung giới thiệu hệ sinh thái */}
      <div id="gioi-thieu"><Section6Ecosystem /></div>
      <Section2Problem />
      <Section3Solution />
      <div id="loi-ich"><Section4Benefits /></div>
      <div id="so-sanh"><Section5Comparison /></div>
      <Section9Process />

      {/* CTA Chuyển sang trang Đơn vị thiết kế */}
      <section className="relative py-32 bg-[#F8F6F2] dark:bg-[#131313] overflow-hidden border-t border-[#ECE7DE] dark:border-white/5">
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 text-center">
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-[#1F1F1F] dark:text-white mb-6">
            Khám phá Hệ sinh thái <span className="text-[#C7A25C]">30+ Đơn vị</span>
          </h2>
          <p className="text-gray-600 dark:text-[#999] text-lg mb-10 max-w-2xl mx-auto">
            Xem hồ sơ chi tiết, so sánh năng lực và tìm kiếm đơn vị thiết kế thi công nội thất phù hợp nhất với nhu cầu của bạn.
          </p>
          <Link 
            href="/don-vi-thiet-ke"
            className="inline-flex items-center gap-2 bg-[#C7A25C] text-white px-8 py-4 font-bold uppercase tracking-wider hover:bg-[#1F1F1F] dark:hover:bg-white dark:hover:text-[#131313] transition-colors rounded-[4px]"
          >
            Xem danh sách đơn vị thiết kế
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
}
