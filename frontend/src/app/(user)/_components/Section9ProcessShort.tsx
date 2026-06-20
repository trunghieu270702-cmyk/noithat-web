'use client';
import React from 'react';
import ScrollReveal from './ScrollReveal';
import ArchitecturalAccent from './ArchitecturalAccent';

const PROCESS_STEPS = [
  'Gửi nhu cầu công trình',
  'ARCVIET tư vấn & phân loại',
  'Đề xuất đối tác phù hợp',
  'Kết nối nhận báo giá',
  'Triển khai thiết kế/thi công',
  'Theo dõi tiến độ',
  'Giám sát/nghiệm thu'
];

export default function Section9ProcessShort() {
  return (
    <section className="relative py-24 bg-transparent dark:bg-transparent modern-section overflow-hidden">
      <ArchitecturalAccent variant="overlapping-rectangles" className="top-10 right-10 w-64 h-64 opacity-20" />
      
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] rounded-full bg-[#C7A25C]/5 blur-[150px] pointer-events-none" />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6">

        {/* Section Header */}
        <ScrollReveal animation="fade-up" delay={100}>
          <div className="text-center mb-20">
            <h6 className="font-label text-[#C7A25C] text-[13px] font-semibold tracking-[4px] uppercase mb-4">
              Quy Trình Làm Việc
            </h6>
            <h2 className="font-heading text-3xl md:text-5xl font-bold text-[#1F1F1F] dark:text-white mb-6 uppercase">
              Quy trình kết nối <span className="text-[#C7A25C]">rõ ràng</span><br className="hidden md:block" /> từ nhu cầu đến triển khai
            </h2>
            <div className="w-16 h-[2px] bg-[#C7A25C] mx-auto mb-6" />
          </div>
        </ScrollReveal>

        {/* Luxury Horizontal Timeline */}
        <ScrollReveal animation="fade-up" delay={200}>
          {/* Desktop View: Horizontal Timeline */}
          <div className="hidden lg:block w-full relative py-10">
            <div className="w-full flex justify-between relative">
               {/* Connecting Line */}
               <div className="absolute top-[28px] left-[60px] right-[60px] h-[1px] bg-gradient-to-r from-transparent via-[#C7A25C]/50 to-transparent z-0"></div>
               
               {PROCESS_STEPS.map((step, idx) => (
                 <div key={idx} className="relative flex flex-col items-center w-[140px] group cursor-default z-10">
                   <div className="w-14 h-14 rounded-full bg-[#FAF8F2] dark:bg-[#131313] border border-[#C7A25C]/50 flex items-center justify-center text-[#C7A25C] font-heading font-bold text-xl shadow-[0_0_15px_rgba(199,162,92,0.15)] group-hover:scale-110 group-hover:bg-[#C7A25C] group-hover:text-white transition-all duration-500 mb-6 luxury-glow relative overflow-hidden">
                     <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full"></div>
                     {idx + 1}
                   </div>
                   <h3 className="text-center font-heading text-[13px] font-bold text-[#1F1F1F] dark:text-white uppercase tracking-widest leading-snug group-hover:text-[#C7A25C] transition-colors px-2">
                     {step}
                   </h3>
                   <div className="w-1.5 h-1.5 rounded-full bg-[#C7A25C] mt-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0"></div>
                 </div>
               ))}
            </div>
          </div>

          {/* Mobile & Tablet View: Vertical List */}
          <div className="block lg:hidden relative mt-8">
            <div className="absolute left-[24px] top-0 bottom-0 w-[1px] bg-gradient-to-b from-[#C7A25C]/50 via-[#C7A25C]/20 to-transparent z-0"></div>
            <div className="flex flex-col gap-10">
               {PROCESS_STEPS.map((step, idx) => (
                 <div key={idx} className="relative flex items-center gap-6 group">
                   <div className="w-12 h-12 shrink-0 rounded-full bg-[#FAF8F2] dark:bg-[#131313] border border-[#C7A25C]/50 flex items-center justify-center text-[#C7A25C] font-heading font-bold text-lg shadow-[0_0_15px_rgba(199,162,92,0.15)] group-hover:bg-[#C7A25C] group-hover:text-white transition-all duration-500 z-10 relative overflow-hidden">
                     <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full"></div>
                     {idx + 1}
                   </div>
                   <div className="flex-1 bg-white/40 dark:bg-white/5 backdrop-blur-sm p-4 rounded-[2px] border border-[#ECE7DE] dark:border-white/10 group-hover:border-[#C7A25C]/50 transition-colors shadow-sm relative">
                     <h3 className="font-heading text-[14px] font-bold text-[#1F1F1F] dark:text-white uppercase tracking-widest leading-snug group-hover:text-[#C7A25C] transition-colors">
                       {step}
                     </h3>
                     <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-[#FAF8F2] dark:bg-[#131313] border-t border-l border-[#ECE7DE] dark:border-white/10 group-hover:border-[#C7A25C]/50 rotate-[-45deg] transition-colors"></div>
                   </div>
                 </div>
               ))}
            </div>
          </div>
        </ScrollReveal>

      </div>
    </section>
  );
}
