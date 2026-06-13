'use client';
import React from 'react';
import ScrollReveal from './ScrollReveal';

// Reusing some high quality images for the categories
const CATEGORIES = [
  { name: 'Chung cư', img: '/images/main/bed1.jpg', size: 'md:col-span-2 md:row-span-2 aspect-square md:aspect-auto' },
  { name: 'Nhà phố', img: '/images/main/pen1.jpg', size: 'aspect-square' },
  { name: 'Nhà đất', img: '/images/main/villa3.jpg', size: 'aspect-square' },
  { name: 'Villa', img: '/images/main/villa1.jpg', size: 'md:col-span-2 aspect-[2/1] md:aspect-auto' },
  { name: 'Biệt thự', img: '/images/main/villa2.jpg', size: 'aspect-square' },
  { name: 'Penthouse', img: '/images/main/pen3.jpg', size: 'md:col-span-2 aspect-[2/1] md:aspect-auto' },
  { name: 'Văn phòng', img: '/images/main/office.jpg', size: 'aspect-square' },
  { name: 'Showroom', img: '/images/main/spa2.jpg', size: 'aspect-square' },
  { name: 'Cửa hàng bán lẻ', img: '/images/main/store.jpg', size: 'aspect-square' },
  { name: 'Spa, salon, phòng khám', img: '/images/main/spa1.jpg', size: 'md:col-span-2 aspect-[2/1] md:aspect-auto' },
  { name: 'Nhà hàng, quán cafe', img: '/images/main/cafe.jpg', size: 'aspect-square' },
  { name: 'Công trình nghỉ dưỡng nhỏ', img: '/images/main/rancho-cp-weber-arquitectos_25.jpg', size: 'md:col-span-2 aspect-[2/1] md:aspect-auto' },
  { name: 'Khách sạn', img: '/images/main/sofa.jpg', size: 'aspect-square' }
];

export default function Section7Categories() {
  return (
    <section id="Categories" className="relative py-32 modern-section overflow-hidden border-t border-[#ECE7DE] dark:border-white/20">
      {/* Grid Pattern Background */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
          backgroundSize: "30px 30px"
        }}
      />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6">

        {/* Section Header */}
        <ScrollReveal animation="fade-up" delay={100}>
          <div className="text-center mb-16">
            <h6 className="font-label text-[#C7A25C] text-[13px] font-semibold tracking-[4px] uppercase mb-4">
              Các Loại Công Trình Hỗ Trợ
            </h6>
            <h2 className="font-heading text-3xl md:text-5xl font-bold text-[#1F1F1F] dark:text-white mb-6 uppercase">
              Phù hợp với <span className="text-[#C7A25C]">nhiều loại công trình</span> khác nhau
            </h2>
            <div className="w-16 h-[2px] bg-[#C7A25C] mx-auto mb-6" />
            <p className="text-[#999] max-w-4xl mx-auto leading-relaxed text-[15px] md:text-[17px]">
              Dù khách hàng cần hoàn thiện một căn hộ nhỏ, cải tạo nhà phố, thiết kế villa hay triển khai công trình thương mại, hệ sinh thái đều có nhóm đơn vị phù hợp theo ngân sách, phong cách và mức độ phức tạp của dự án.
            </p>
          </div>
        </ScrollReveal>

        {/* Masonry-like Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[200px] md:auto-rows-[250px] gap-2">
          {CATEGORIES.map((cat, index) => (
            <ScrollReveal
              key={index}
              animation="fade-up"
              delay={100 + (index % 4) * 100}
              className={`${cat.size} h-full w-full`}
            >
              <div className="group relative w-full h-full overflow-hidden bg-[#FFFFFF] dark:bg-[#1a1a1a] shadow-sm dark:shadow-none border border-[#ECE7DE] dark:border-white/10 rounded-[2px] cursor-pointer">
                {/* Background Image */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-all duration-1000 group-hover:scale-110 luxury-image-filter"
                  style={{ backgroundImage: `url(${cat.img})` }}
                />
                {/* Luxury Inner Border Accent */}
                <div className="absolute inset-3 border border-[#D3AE3E]/30 z-20 pointer-events-none transition-all duration-500 group-hover:inset-4 group-hover:border-[#D3AE3E]/60 rounded-[2px]"></div>

                {/* Luxury Cream Overlay for Light Mode */}
                <div
                  className="absolute inset-0 pointer-events-none dark:hidden z-10"
                  style={{
                    background: 'linear-gradient(to right, rgba(248, 246, 242, 0.15), rgba(248, 246, 242, 0.05))'
                  }}
                />

                {/* Dark Overlays for Text Readability */}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500 z-10" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10 opacity-80 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Text Content */}
                <div className="absolute inset-0 p-8 flex flex-col justify-end z-20">
                  <h3 className="font-heading text-[16px] md:text-[18px] font-medium text-white uppercase tracking-[4px] translate-y-4 group-hover:translate-y-0 transition-transform duration-500 drop-shadow-sm">
                    {cat.name}
                  </h3>
                  <div className="h-[1px] w-12 bg-[#C7A25C] mt-4 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100 transform -translate-x-4 group-hover:translate-x-0" />
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

      </div>
    </section>
  );
}
