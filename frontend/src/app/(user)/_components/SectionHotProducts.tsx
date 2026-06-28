'use client';
import SectionStarryMotif from './SectionStarryMotif';
import React, { useCallback, useState } from 'react';
import Link from 'next/link';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import QuoteModal from './QuoteModal';

export default function SectionHotProducts() {
  const [emblaRef] = useEmblaCarousel(
    { loop: true, align: 'start', skipSnaps: false },
    [Autoplay({ delay: 4000, stopOnInteraction: true })]
  );

  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [selectedProductName, setSelectedProductName] = useState('');
  const [selectedProductImage, setSelectedProductImage] = useState('');
  
  const [products, setProducts] = useState<any[]>([]);

  React.useEffect(() => {
    const fetchProducts = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3001/api/v1';
        // Fetch real products, take 8
        const res = await fetch(`${apiUrl}/products?take=8`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setProducts(data.map((p: any) => ({
              id: p.id,
              name: p.name,
              category: p.categories && p.categories.length > 0 ? p.categories[0].name : 'Sản phẩm',
              image: p.images && p.images.length > 0 ? p.images[0] : '',
              price: p.price || p.promotionalPrice || 'Liên hệ'
            })));
          }
        }
      } catch (err) {
        console.error("Failed to fetch hot products", err);
      }
    };
    fetchProducts();
  }, []);

  return (
    <section className="py-24 bg-transparent dark:bg-transparent modern-section relative overflow-hidden">
      <SectionStarryMotif />
      {/* Texture & Lighting Effects */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Spotlight Effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[100%] h-[80%] bg-[radial-gradient(ellipse_at_top,rgba(199,162,92,0.15)_0%,transparent_70%)] dark:bg-[radial-gradient(ellipse_at_top,rgba(199,162,92,0.2)_0%,transparent_70%)]" />
        
        {/* Subtle Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] rounded-full bg-[#C7A25C]/5 blur-[150px]" />
        
        {/* Premium Noise/Material Texture Overlay */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.04] mix-blend-overlay">
          <filter id="noiseFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch"/>
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)"/>
        </svg>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="flex-1 md:mr-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-[2px] bg-gradient-to-r from-[#C7A25C]/20 to-transparent border-l-2 border-[#C7A25C] text-[#A67C00] dark:text-[#FFD700] text-[11px] font-bold uppercase tracking-widest mb-4 luxury-glow">
              <span className="w-2 h-2 rounded-[2px] bg-[#C7A25C] animate-pulse"></span>
              Sản phẩm nổi bật
            </div>
            <h2 className="w-full uppercase font-heading text-4xl md:text-5xl font-bold text-[#1F1F1F] dark:text-white leading-tight mb-4">
              Không gian sống{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C7A25C] to-[#E5C98A]">đẳng cấp vượt thời gian</span>
            </h2>
            <p className="text-[#1F1F1F]/60 dark:text-white/60 text-base md:text-lg max-w-3xl">
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
            {products.map((product) => (
              <div key={product.id} className="flex-[0_0_85%] sm:flex-[0_0_45%] lg:flex-[0_0_28%] xl:flex-[0_0_24%] pl-6">
                <Link href={`/san-pham/${product.id}`} className="group block relative w-full overflow-hidden rounded-[2px] bg-gray-100 dark:bg-[#131313] luxury-glow">
                  {/* Image */}
                  <div className="relative w-full aspect-[3/4] overflow-hidden">
                    <div className="absolute inset-0 bg-black/5 dark:bg-transparent z-10 group-hover:bg-black/0 transition-colors duration-500"></div>
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-200 dark:bg-[#1f1f1f]">
                         <svg className="w-12 h-12 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                      </div>
                    )}
                    {/* Luxury Inner Border Accent */}
                    <div className="absolute inset-3 border border-[#D3AE3E]/30 z-20 pointer-events-none transition-all duration-500 group-hover:inset-4 group-hover:border-[#D3AE3E]/60 rounded-[2px]"></div>

                    {/* Gradient Overlay for Text Visibility */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

                    {/* Category Tag */}
                    <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md text-[#D3AE3E] px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-[2px] luxury-glow z-20">
                      {product.category}
                    </div>

                    {/* Content at Bottom */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 z-20">
                      <div className="w-8 h-[2px] bg-[#C7A25C] mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100" />
                      <h3 className="font-heading text-xl md:text-2xl font-bold text-white mb-2 leading-snug drop-shadow-md line-clamp-2">
                        {product.name}
                      </h3>
                      <div className="mt-4 pt-4 border-t border-white/20 relative z-20">
                        <span 
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setSelectedProductName(product.name);
                            setSelectedProductImage(product.image);
                            setIsQuoteModalOpen(true);
                          }}
                          className="flex items-center justify-center gap-2 w-full bg-white/10 backdrop-blur-sm border border-[#D3AE3E]/50 text-[#D3AE3E] font-bold uppercase tracking-wider text-[11px] py-3 rounded-[2px] hover:bg-[#D3AE3E] hover:text-white transition-all duration-300"
                        >
                          Nhận báo giá
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
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

      {typeof document !== 'undefined' && (
        <QuoteModal 
          isOpen={isQuoteModalOpen} 
          onClose={() => setIsQuoteModalOpen(false)} 
          productName={selectedProductName} 
          productImage={selectedProductImage}
        />
      )}
    </section>
  );
}
