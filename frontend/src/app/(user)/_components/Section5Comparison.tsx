'use client';
import SectionStarryMotif from './SectionStarryMotif';
import React from 'react';
import ScrollReveal from './ScrollReveal';
import SpotlightCard from './SpotlightCard';

const COMPARISON_DATA = [
  {
    feature: 'Tìm đơn vị',
    outside: 'Tự tìm, tự hỏi từng bên',
    ecosystem: 'Có sẵn hơn 30 đơn vị đã phân loại'
  },
  {
    feature: 'Chọn đơn vị',
    outside: 'Dựa vào cảm tính, giới thiệu hoặc quảng cáo',
    ecosystem: 'Được tư vấn theo công trình, ngân sách và nhu cầu'
  },
  {
    feature: 'So sánh năng lực',
    outside: 'Khó so sánh vì mỗi bên trình bày khác nhau',
    ecosystem: 'Có hồ sơ đơn vị rõ ràng'
  },
  {
    feature: 'Chi phí',
    outside: 'Tự thương lượng, dễ phát sinh',
    ecosystem: 'Có chiết khấu 5% và định hướng đúng phân khúc'
  },
  {
    feature: 'Kiểm soát thi công',
    outside: 'Chủ nhà tự theo dõi',
    ecosystem: 'Có thể dùng thêm giám sát thi công'
  },
  {
    feature: 'Quản lý dự án',
    outside: 'Chủ nhà tự xử lý phát sinh',
    ecosystem: 'Có gói quản lý toàn bộ dự án'
  },
  {
    feature: 'Rủi ro chọn sai bên',
    outside: 'Cao hơn nếu thiếu kinh nghiệm',
    ecosystem: 'Giảm rủi ro nhờ hệ sinh thái đã phân loại'
  },
  {
    feature: 'Thời gian làm việc',
    outside: 'Mất nhiều thời gian liên hệ, so sánh',
    ecosystem: 'Rút ngắn quá trình lựa chọn và kết nối'
  }
];

export default function Section5Comparison() {
  return (
    <section className="relative py-32 bg-transparent dark:bg-transparent overflow-hidden border-y border-[#ECE7DE] dark:border-white/5">
      <SectionStarryMotif />
      <div className="relative z-10 max-w-[1400px] mx-auto px-6">
        {/* Section Header */}
        <ScrollReveal animation="fade-up" delay={100}>
          <div className="text-center mb-16">
            <h6 className="font-label text-[#C7A25C] text-[13px] font-semibold tracking-[4px] uppercase mb-4">
              Tạo Sự Khác Biệt
            </h6>
            <h2 className="font-heading text-3xl md:text-5xl font-bold text-[#1F1F1F] dark:text-white mb-6 uppercase max-w-4xl mx-auto">
              Làm qua hệ sinh thái <span className="text-[#C7A25C]">khác gì</span> so với tự thuê ngoài?
            </h2>
            <div className="w-16 h-[2px] bg-[#C7A25C] mx-auto mb-6" />
          </div>
        </ScrollReveal>

        {/* Comparison UI */}
        <ScrollReveal animation="fade-up" delay={300}>
          {/* MOBILE VIEW (Cards) */}
          <div className="md:hidden flex flex-col gap-6">
            {COMPARISON_DATA.map((row, index) => (
              <SpotlightCard key={index} className="p-5">
                {/* Decorative glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#C7A25C]/5 blur-3xl rounded-full pointer-events-none" />

                <h3 className="font-heading text-[#1F1F1F] dark:text-white font-bold text-[16px] border-b border-[#ECE7DE] dark:border-white/10 pb-3 mb-4 relative z-10">
                  {row.feature}
                </h3>

                <div className="space-y-5 relative z-10">
                  <div className="bg-[#FFFFFF] dark:bg-[#0a0a0a]/50 p-4 rounded-[4px] border border-[#ECE7DE] dark:border-white/5">
                    <span className="text-gray-500 dark:text-[#888] text-[11px] font-bold uppercase tracking-widest mb-2 block">Tự thuê ngoài</span>
                    <div className="flex items-start gap-2 text-gray-500 dark:text-[#888] text-[14px] leading-relaxed">
                      <svg className="w-4 h-4 text-red-500/70 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                      <span>{row.outside}</span>
                    </div>
                  </div>

                  <div className="bg-[#C7A25C]/10 p-4 rounded-[4px] border border-[#C7A25C]/20">
                    <span className="text-[#C7A25C] text-[11px] font-bold uppercase tracking-widest mb-2 block">Qua hệ sinh thái</span>
                    <div className="flex items-start gap-2 text-[#1F1F1F] dark:text-white text-[14px] font-medium leading-relaxed">
                      <svg className="w-5 h-5 text-[#C7A25C] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                      <span>{row.ecosystem}</span>
                    </div>
                  </div>
                </div>
              </SpotlightCard>
            ))}
          </div>

          {/* DESKTOP VIEW (Table) */}
          <div className="hidden md:block overflow-hidden pb-6">
            <table className="w-full border-collapse bg-[#FFFFFF] dark:bg-[#131313] border border-[#ECE7DE] dark:border-white/10 rounded-[4px] overflow-hidden shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] dark:shadow-none">
              <thead>
                <tr>
                  <th className="w-[20%] p-6 text-left text-[#1F1F1F] dark:text-white font-bold text-[16px] border-b border-[#ECE7DE] dark:border-white/10 modern-section">
                    Tiêu chí
                  </th>
                  <th className="w-[40%] p-6 text-center text-gray-500 dark:text-[#888] font-bold text-[16px] border-b border-[#ECE7DE] dark:border-white/10 bg-[#FFFFFF] dark:bg-[#0a0a0a]/50">
                    Tự thuê ngoài
                  </th>
                  <th className="w-[40%] p-6 text-center text-[#C7A25C] font-bold text-[18px] border-b-2 border-[#C7A25C] bg-[#C7A25C]/10">
                    Qua hệ sinh thái của chúng tôi
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON_DATA.map((row, index) => (
                  <tr key={index} className="group transition-colors">
                    <td className="p-6 text-[#1F1F1F]/90 dark:text-white/90 text-[15px] font-semibold border-b border-[#ECE7DE] dark:border-white/5 bg-[#FFFFFF] dark:bg-[#0a0a0a] group-hover:bg-[#F8F6F2] dark:group-hover:bg-[#1a1a1a]">
                      {row.feature}
                    </td>
                    <td className="p-6 text-center text-gray-500 dark:text-[#888] text-[15px] border-b border-[#ECE7DE] dark:border-white/5 bg-[#FFFFFF] dark:bg-[#0a0a0a]/50 group-hover:bg-[#F8F6F2] dark:group-hover:bg-[#131313] leading-relaxed">
                      <div className="flex items-center justify-center gap-2">
                        <svg className="w-4 h-4 text-red-500/70 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        <span>{row.outside}</span>
                      </div>
                    </td>
                    <td className="p-6 text-center text-[#1F1F1F] dark:text-white text-[16px] border-b border-[#ECE7DE] dark:border-white/5 bg-[#C7A25C]/5 group-hover:bg-[#C7A25C]/20 transition-colors leading-relaxed font-medium">
                      <div className="flex items-center justify-center gap-2">
                        <svg className="w-5 h-5 text-[#C7A25C] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                        <span>{row.ecosystem}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
