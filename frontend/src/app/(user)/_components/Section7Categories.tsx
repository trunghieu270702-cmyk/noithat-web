'use client';
import React from 'react';
import ScrollReveal from './ScrollReveal';

// Reusing some high quality images for the categories
const CATEGORIES = [
  { name: 'Chung cư', img: '/images/portfolio/project-culture.jpg', size: 'md:col-span-2 md:row-span-2 aspect-square md:aspect-auto' },
  { name: 'Nhà phố', img: '/images/portfolio/project-ocean.jpg', size: 'aspect-square' },
  { name: 'Nhà đất', img: '/images/portfolio/project-royal.jpg', size: 'aspect-square' },
  { name: 'Villa', img: '/images/blog/post-1.jpg', size: 'md:col-span-2 aspect-[2/1] md:aspect-auto' },
  { name: 'Biệt thự', img: '/images/blog/post-2.jpg', size: 'aspect-square' },
  { name: 'Penthouse', img: '/images/portfolio/project-cinema.jpg', size: 'md:col-span-2 aspect-[2/1] md:aspect-auto' },
  { name: 'Văn phòng', img: '/images/portfolio/project-ducts.jpg', size: 'aspect-square' },
  { name: 'Showroom', img: '/images/portfolio/project-hotels.jpg', size: 'aspect-square' },
  { name: 'Cửa hàng bán lẻ', img: '/images/categories/cat-retail.jpg', size: 'aspect-square' },
  { name: 'Spa, salon, phòng khám', img: '/images/services/service-design.jpg', size: 'md:col-span-2 aspect-[2/1] md:aspect-auto' },
  { name: 'Nhà hàng, quán cafe', img: '/images/services/service-interior.jpg', size: 'aspect-square' },
  { name: 'Công trình nghỉ dưỡng nhỏ', img: '/images/services/service-landscape.jpg', size: 'md:col-span-2 aspect-[2/1] md:aspect-auto' }
];

export default function Section7Categories() {
  return (
    <section id="Categories" className="relative py-32 bg-[#0a0a0a] overflow-hidden border-t border-white/5">
      {/* Grid Pattern Background */}
      <div
        className="absolute inset-0 z-0 pointer-events-none opacity-100"
        style={{
          backgroundImage: "url('/images/common/pattern-grid.png')",
          backgroundRepeat: 'repeat',
          backgroundPosition: 'center'
        }}
      />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6">

        {/* Section Header */}
        <ScrollReveal animation="fade-up" delay={100}>
          <div className="text-center mb-16">
            <h6 className="text-[#D3AE3E] text-[13px] font-semibold tracking-[4px] uppercase mb-4 font-['Montserrat',_sans-serif]">
              Các Loại Công Trình Hỗ Trợ
            </h6>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 font-['Montserrat',_sans-serif]">
              Phù hợp với <span className="text-[#D3AE3E]">nhiều loại công trình</span> khác nhau
            </h2>
            <div className="w-16 h-[2px] bg-[#D3AE3E] mx-auto mb-6" />
            <p className="text-[#999] font-['Montserrat',_sans-serif] max-w-4xl mx-auto leading-relaxed text-[15px] md:text-[17px]">
              Dù khách hàng cần hoàn thiện một căn hộ nhỏ, cải tạo nhà phố, thiết kế villa hay triển khai công trình thương mại, hệ sinh thái đều có nhóm đơn vị phù hợp theo ngân sách, phong cách và mức độ phức tạp của dự án.
            </p>
          </div>
        </ScrollReveal>

        {/* Masonry-like Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[200px] md:auto-rows-[250px] gap-4">
          {CATEGORIES.map((cat, index) => (
            <ScrollReveal 
              key={index} 
              animation="fade-up" 
              delay={100 + (index % 4) * 100} 
              className={`${cat.size} h-full w-full`}
            >
              <div className="group relative w-full h-full overflow-hidden bg-[#1a1a1a] rounded-sm cursor-pointer">
                {/* Background Image */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110"
                  style={{ backgroundImage: `url(${cat.img})` }}
                />

                {/* Dark Overlays */}
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Text Content */}
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <h3 className="text-xl md:text-2xl font-bold font-['Montserrat',_sans-serif] text-white translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    {cat.name}
                  </h3>
                  <div className="h-1 w-8 bg-[#D3AE3E] mt-4 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100 transform -translate-x-4 group-hover:translate-x-0" />
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

      </div>
    </section>
  );
}
