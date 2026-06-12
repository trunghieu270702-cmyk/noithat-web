'use client';
import React, { useCallback } from 'react';
import Link from 'next/link';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

const HOT_PRODUCTS = [
  { id: 1, name: 'Sofa Da Thật Nhập Khẩu Italia', category: 'Sofa Cao Cấp', image: '/images/main/3.jpg', price: 'Liên hệ' },
  { id: 2, name: 'Bàn Ăn Mặt Đá Cẩm Thạch', category: 'Bàn Ghế Ăn', image: '/images/main/4.jpg', price: 'Liên hệ' },
  { id: 3, name: 'Tủ Bếp Gỗ Óc Chó Hiện Đại', category: 'Tủ Bếp', image: '/images/main/6.jpg', price: 'Liên hệ' },
  { id: 4, name: 'Giường Ngủ Bọc Da Hạng Sang', category: 'Phòng Ngủ', image: '/images/main/7.jpg', price: 'Liên hệ' },
  { id: 5, name: 'Sofa Góc Chữ L Vải Nỉ Cao Cấp', category: 'Sofa Góc', image: '/images/main/10.jpg', price: 'Liên hệ' },
  { id: 6, name: 'Bàn Trà Sofa Mặt Đá Ceramic', category: 'Bàn Trà', image: '/images/main/12.jpg', price: 'Liên hệ' },
  { id: 7, name: 'Tủ Rượu Tân Cổ Điển', category: 'Tủ Rượu', image: '/images/main/16.jpg', price: 'Liên hệ' },
  { id: 8, name: 'Bộ Ghế Thư Giãn Đọc Sách', category: 'Ghế Thư Giãn', image: '/images/main/18.jpg', price: 'Liên hệ' },
];

export default function SectionHotProducts() {
  const [emblaRef] = useEmblaCarousel(
    { loop: true, align: 'start', skipSnaps: false },
    [Autoplay({ delay: 4000, stopOnInteraction: true })]
  );

  return (
    <section className="py-24 bg-[#F8F6F2] dark:bg-[#0a0a0a] relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] rounded-full bg-[#C7A25C]/5 blur-[150px] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[4px] bg-[#C7A25C]/10 text-[#C7A25C] text-xs font-bold uppercase tracking-wider mb-4 luxury-glow">
              <span className="w-2 h-2 rounded-[4px] bg-[#C7A25C] animate-pulse"></span>
              Sản phẩm nổi bật
            </div>
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-[#1F1F1F] dark:text-white leading-tight mb-4">
              Không gian sống{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C7A25C] to-[#E5C98A]">đẳng cấp vượt thời gian</span>
            </h2>
            <p className="text-[#1F1F1F]/60 dark:text-white/60 text-base md:text-lg">
              Tuyển tập những món đồ nội thất mang tính biểu tượng, kiến tạo nên giá trị độc bản cho ngôi nhà của bạn.
            </p>
          </div>
          
          <Link href="/san-pham?filter=noi-bat" 
            className="group hidden md:flex items-center gap-2 text-sm font-semibold text-[#1F1F1F] dark:text-white hover:text-[#C7A25C] uppercase tracking-widest transition-colors"
          >
            Xem toàn bộ bộ sưu tập
            <span className="w-8 h-[1px] bg-current group-hover:w-12 transition-all"></span>
          </Link>
        </div>

        {/* Embla Carousel */}
        <div className="overflow-hidden -mx-6 px-6" ref={emblaRef}>
          <div className="flex -ml-6">
            {HOT_PRODUCTS.map((product) => (
              <div key={product.id} className="flex-[0_0_85%] sm:flex-[0_0_45%] lg:flex-[0_0_28%] xl:flex-[0_0_24%] pl-6">
                <Link href={`/san-pham/${product.id}`} className="group block relative w-full overflow-hidden rounded-[4px] bg-gray-100 dark:bg-[#131313] luxury-glow">
                  {/* Image */}
                  <div className="relative w-full aspect-[3/4] overflow-hidden">
                    <div className="absolute inset-0 bg-black/5 dark:bg-transparent z-10 group-hover:bg-black/0 transition-colors duration-500"></div>
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                    {/* Luxury Inner Border Accent */}
                    <div className="absolute inset-3 border border-[#D3AE3E]/30 z-20 pointer-events-none transition-all duration-500 group-hover:inset-4 group-hover:border-[#D3AE3E]/60 rounded-[2px]"></div>
                    
                    {/* Gradient Overlay for Text Visibility */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                    
                    {/* Category Tag */}
                    <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md text-[#D3AE3E] px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-[4px] luxury-glow z-20">
                      {product.category}
                    </div>

                    {/* Content at Bottom */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 z-20">
                      <div className="w-8 h-[2px] bg-[#C7A25C] mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100" />
                      <h3 className="font-heading text-xl md:text-2xl font-bold text-white mb-2 leading-snug drop-shadow-md">
                        {product.name}
                      </h3>
                      <div className="flex items-center justify-between mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200">
                        <p className="text-[#E2C792] font-semibold tracking-wider">{product.price}</p>
                        <span className="text-white/70 text-sm flex items-center gap-1 group/btn hover:text-white">
                          Chi tiết
                          <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile View All */}
        <div className="mt-8 flex justify-center md:hidden">
          <Link 
            href="/san-pham?filter=noi-bat" 
            className="group flex items-center gap-2 text-sm font-semibold text-[#1F1F1F] dark:text-white hover:text-[#C7A25C] uppercase tracking-widest transition-colors"
          >
            Xem tất cả
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
