'use client';
import React from 'react';
import ScrollReveal from './ScrollReveal';

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
    <section className="relative py-32 bg-[#1a1a1a] overflow-hidden border-y border-white/5">
      <div className="relative z-10 max-w-[1200px] mx-auto px-6">
        {/* Section Header */}
        <ScrollReveal animation="fade-up" delay={100}>
          <div className="text-center mb-16">
            <h6 className="text-[#D3AE3E] text-[13px] font-semibold tracking-[4px] uppercase mb-4 font-['Montserrat',_sans-serif]">
              Tạo Sự Khác Biệt
            </h6>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 font-['Montserrat',_sans-serif] max-w-4xl mx-auto">
              Làm qua hệ sinh thái <span className="text-[#D3AE3E]">khác gì</span> so với tự thuê ngoài?
            </h2>
            <div className="w-16 h-[2px] bg-[#D3AE3E] mx-auto mb-6" />
          </div>
        </ScrollReveal>

        {/* Comparison Table */}
        <ScrollReveal animation="fade-up" delay={300}>
          <div className="overflow-x-auto pb-6">
            <table className="w-full min-w-[900px] border-collapse bg-[#131313] border border-white/10 rounded-lg overflow-hidden shadow-2xl">
              <thead>
                <tr>
                  <th className="w-[20%] p-6 text-left text-white font-['Montserrat',_sans-serif] font-bold text-[16px] border-b border-white/10 bg-[#0a0a0a]">
                    Tiêu chí
                  </th>
                  <th className="w-[40%] p-6 text-center text-[#888] font-['Montserrat',_sans-serif] font-bold text-[16px] border-b border-white/10 bg-[#0a0a0a]/50">
                    Tự thuê ngoài
                  </th>
                  <th className="w-[40%] p-6 text-center text-[#D3AE3E] font-['Montserrat',_sans-serif] font-bold text-[18px] border-b-2 border-[#D3AE3E] bg-[#D3AE3E]/10">
                    Qua hệ sinh thái của chúng tôi
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON_DATA.map((row, index) => (
                  <tr key={index} className="group transition-colors">
                    <td className="p-6 text-white/90 font-['Montserrat',_sans-serif] text-[15px] font-semibold border-b border-white/5 bg-[#0a0a0a] group-hover:bg-[#1a1a1a]">
                      {row.feature}
                    </td>
                    <td className="p-6 text-center text-[#888] font-['Montserrat',_sans-serif] text-[15px] border-b border-white/5 bg-[#0a0a0a]/50 group-hover:bg-[#131313] leading-relaxed">
                      <div className="flex items-center justify-center gap-2">
                        <svg className="w-4 h-4 text-red-500/70 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        <span>{row.outside}</span>
                      </div>
                    </td>
                    <td className="p-6 text-center text-white font-['Montserrat',_sans-serif] text-[16px] border-b border-white/5 bg-[#D3AE3E]/5 group-hover:bg-[#D3AE3E]/20 transition-colors leading-relaxed font-medium">
                      <div className="flex items-center justify-center gap-2">
                        <svg className="w-5 h-5 text-[#D3AE3E] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
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
