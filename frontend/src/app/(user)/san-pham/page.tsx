'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function SanPhamPage() {
  const [activeFilter, setActiveFilter] = useState('*');
  const [products, setProducts] = useState<any[]>([]);
  const [filters, setFilters] = useState<any[]>([{ id: '*', label: 'Tất cả' }]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
        const res = await fetch(`${apiUrl}/projects`);
        if (!res.ok) throw new Error('API error');
        
        const data = await res.json();
        
        if (Array.isArray(data)) {
          const availableImages = ['3.jpg', '4.jpg', '6.jpg', '7.jpg', '9.jpg', '10.jpg', '12.jpg', '13.jpg', '14.jpg', '15.jpg', '16.jpg', '17.jpg', '18.jpg', '19.jpg', '20.jpg'];
          const fetchedProducts = data.map((p: any, idx: number) => {
            let img = `/images/main/${availableImages[idx % availableImages.length]}`;
            if (p.mainImage) {
              if (typeof p.mainImage === 'string') img = p.mainImage;
              else if (Array.isArray(p.mainImage) && p.mainImage.length > 0) img = p.mainImage[0];
            }
            return {
              id: p.id,
              title: p.name,
              img,
              categories: [p.projectType || 'Khác'],
              price: p.budget || 'Liên hệ',
              link: `/san-pham/${p.id}`
            };
          });

          // Generate dynamic filters
          const uniqueTypes = Array.from(new Set(data.map((p: any) => p.projectType || 'Khác'))) as string[];
          const dynamicFilters = [
            { id: '*', label: 'Tất cả' },
            ...uniqueTypes.map(type => ({ id: type, label: type }))
          ];

          setFilters(dynamicFilters);
          setProducts(fetchedProducts);
        }
      } catch (error) {
        console.error("Failed to fetch products", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredItems = products.filter(item =>
    activeFilter === '*' || item.categories.includes(activeFilter)
  );

  return (
    <div className="pt-[120px] pb-20 bg-[#F9F8F6] dark:bg-[#0a0a0a] min-h-screen text-gray-900 dark:text-white transition-colors duration-300">
      <div className="container mx-auto px-6 max-w-[1400px]">
        <div className="text-center mb-16">
          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-6">Tất cả sản phẩm</h1>
          <p className="text-gray-600 dark:text-white/70 text-lg max-w-3xl mx-auto">
            Khám phá bộ sưu tập nội thất cao cấp của chúng tôi, được thiết kế và chế tác tinh xảo, mang lại không gian sống đẳng cấp và tiện nghi.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-12">
          {filters.map(filter => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-6 py-2 rounded-full text-[13px] font-bold uppercase tracking-wider transition-all duration-300 border ${
                activeFilter === filter.id
                  ? 'bg-[#D3AE3E] text-white border-[#D3AE3E] shadow-md shadow-[#D3AE3E]/20'
                  : 'bg-white dark:bg-[#131313] text-gray-600 dark:text-gray-300 border-gray-200 dark:border-white/10 hover:border-[#D3AE3E] hover:text-[#D3AE3E]'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="animate-pulse bg-white dark:bg-[#131313] rounded-[8px] overflow-hidden border border-gray-100 dark:border-white/5 h-[350px]">
                <div className="bg-gray-200 dark:bg-white/5 w-full h-2/3"></div>
                <div className="p-6 space-y-4">
                  <div className="h-4 bg-gray-200 dark:bg-white/5 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-white/5 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-[#131313] rounded-[8px] border border-gray-100 dark:border-white/5">
            <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Không tìm thấy sản phẩm nào</h3>
            <p className="text-gray-500">Vui lòng thử chọn danh mục khác.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredItems.map((item) => (
              <Link href={item.link} key={item.id} className="group flex flex-col bg-white dark:bg-[#131313] border border-gray-100 dark:border-white/5 rounded-[8px] overflow-hidden hover:shadow-lg hover:-translate-y-2 transition-all duration-300 luxury-glow">
                <div className="aspect-[4/3] bg-gray-100 dark:bg-white/5 relative overflow-hidden">
                  <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-4 left-4 bg-[#D3AE3E] text-white text-[10px] font-bold uppercase tracking-widest px-2 py-1 shadow-sm">Mới nhất</div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2">{item.categories.join(', ')}</div>
                  <h3 className="font-heading text-lg font-bold text-gray-900 dark:text-white group-hover:text-[#D3AE3E] transition-colors mb-4 line-clamp-2 leading-snug">{item.title}</h3>
                  <div className="mt-auto flex items-center justify-between">
                    <span className="text-[#D3AE3E] font-bold text-lg">{item.price}</span>
                    <div className="w-8 h-8 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center group-hover:bg-[#D3AE3E] group-hover:text-white text-gray-400 transition-colors">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
