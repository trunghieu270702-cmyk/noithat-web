'use client';
import SectionStarryMotif from './SectionStarryMotif';
import React from 'react';
import ScrollReveal from './ScrollReveal';
import ArchitecturalAccent from './ArchitecturalAccent';

const PROBLEMS = [
  {
    num: '01',
    title: 'Quá nhiều đơn vị, khó biết bên nào phù hợp',
    desc: 'Thị trường có rất nhiều đơn vị nội thất, nhưng mỗi bên lại mạnh ở một phân khúc khác nhau. Một đơn vị làm tốt chung cư chưa chắc phù hợp với villa hoặc biệt thự.',
    colSpan: 'md:col-span-2 lg:col-span-2',
    bgImg: '/images/services/service-design.jpg'
  },
  {
    num: '02',
    title: 'Khó so sánh báo giá',
    desc: 'Mỗi đơn vị báo giá theo một cách khác nhau, dùng vật liệu khác nhau, phạm vi thi công khác nhau, khiến khách hàng khó đánh giá đâu là mức giá hợp lý.',
    colSpan: 'md:col-span-1 lg:col-span-1',
    bgImg: ''
  },
  {
    num: '03',
    title: 'Dễ chọn sai phân khúc',
    desc: 'Nếu chọn đơn vị quá thấp so với yêu cầu công trình, chất lượng có thể không đạt kỳ vọng. Nếu chọn đơn vị quá cao, khách hàng dễ bị đội ngân sách không cần thiết.',
    colSpan: 'md:col-span-1 lg:col-span-1',
    bgImg: ''
  },
  {
    num: '04',
    title: 'Thiếu người kiểm soát thi công',
    desc: 'Nhiều khách hàng không có chuyên môn để kiểm tra vật liệu, tiến độ, độ hoàn thiện và các lỗi phát sinh trong quá trình thi công.',
    colSpan: 'md:col-span-2 lg:col-span-1',
    bgImg: ''
  },
  {
    num: '05',
    title: 'Chủ nhà phải tự xử lý quá nhiều việc',
    desc: 'Từ thiết kế, báo giá, hợp đồng, vật liệu, tiến độ, nghiệm thu đến phát sinh, khách hàng phải tự làm việc với nhiều bên nếu không có người hỗ trợ.',
    colSpan: 'md:col-span-3 lg:col-span-1',
    bgImg: '/images/categories/cat-retail.jpg'
  }
];

export default function Section2Problem() {
  return (
    <section className="relative py-32 bg-transparent dark:bg-transparent modern-section overflow-hidden">
      <SectionStarryMotif />
      <ArchitecturalAccent variant="overlapping-squares" className="bottom-10 right-10 w-64 h-64 opacity-50" />

      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#ECE7DE]/50 dark:from-[#1a1a1a] to-transparent opacity-50 pointer-events-none" />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6">
        {/* Section Header */}
        <ScrollReveal animation="fade-up" delay={100}>
          <div className="max-w-4xl mb-20">
            <h6 className="font-label text-[#C7A25C] text-[13px] font-semibold tracking-[4px] uppercase mb-4">
              Vấn đề thường gặp
            </h6>
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-[#1F1F1F] dark:text-white mb-8 leading-[1.2]">
              Tự thuê đơn vị nội thất bên ngoài thường tốn thời gian, khó so sánh và dễ gặp rủi ro
            </h2>
            <div className="w-16 h-[2px] bg-[#C7A25C] mb-8" />
            <p className="text-gray-600 dark:text-[#999] leading-relaxed text-[15px] md:text-[17px]">
              Khi làm nội thất, khách hàng thường phải tự tìm đơn vị, tự hỏi báo giá, tự đánh giá năng lực và tự theo dõi quá trình thi công. Điều này dễ khiến khách hàng mất nhiều thời gian, chọn sai đơn vị hoặc phát sinh chi phí ngoài dự kiến.
            </p>
          </div>
        </ScrollReveal>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-[2px]">
          {PROBLEMS.map((problem, index) => (
            <ScrollReveal
              key={problem.num}
              animation="fade-up"
              delay={200 + index * 100}
              className={`relative group overflow-hidden rounded-[2px] ${problem.colSpan}`}
            >
              <div className="h-full card rounded-[2px] dark:bg-[#131313] border border-[#ECE7DE] dark:border-white/5 hover:border-[#C7A25C]/50 transition-all duration-500 p-8 md:p-10 flex flex-col justify-between min-h-[300px]">

                {/* Optional Background Image for some blocks */}
                {problem.bgImg && (
                  <>
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110 opacity-30 group-hover:opacity-20"
                      style={{ backgroundImage: `url(${problem.bgImg})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#FFFFFF] dark:from-[#131313] via-[#FFFFFF]/90 dark:via-[#131313]/90 to-transparent" />
                  </>
                )}

                <div className="relative z-10">
                  <div
                    className="text-transparent text-6xl md:text-7xl font-bold mb-6 group-hover:-translate-y-2 transition-all duration-500 inline-block drop-shadow-sm"
                    style={{ WebkitTextStroke: '1px #C7A25C' }}
                  >
                    {problem.num}
                  </div>
                  <h3 className="font-heading text-xl md:text-2xl font-bold text-[#1F1F1F] dark:text-white mb-4 group-hover:text-[#C7A25C] transition-colors leading-snug">
                    {problem.title}
                  </h3>
                  <p className="text-gray-500 dark:text-[#888] leading-relaxed text-[15px]">
                    {problem.desc}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
