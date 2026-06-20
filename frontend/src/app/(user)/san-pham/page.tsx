'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import QuoteModal from '../_components/QuoteModal';

function CustomSelect({ label, options, value, onChange }: { label: string, options: { value: string, label: string }[], value: string, onChange: (val: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedLabel = options.find(o => o.value === value)?.label || options[0]?.label;

  return (
    <div className={`flex-1 min-w-[200px] relative ${isOpen ? 'z-50' : 'z-10'}`} ref={dropdownRef}>
      <label className="block text-sm text-gray-400 dark:text-white/50 mb-2 font-medium">{label}</label>
      <div className="relative">
        <div
          className={`modern-section border ${isOpen ? 'border-[#C7A25C]' : 'border-[#ECE7DE] dark:border-white/20'} text-[#1F1F1F] dark:text-white p-3 rounded-[2px] cursor-pointer flex justify-between items-center transition-colors hover:border-[#C7A25C]/50 h-[46px]`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="text-sm line-clamp-1">{selectedLabel}</span>
          <svg className={`w-4 h-4 ml-2 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180 text-[#C7A25C]' : 'text-[#1F1F1F]/50 dark:text-white/50'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
        </div>

        {isOpen && (
          <div className="absolute z-50 w-full mt-2 bg-white dark:bg-[#1c1c1c] shadow-lg dark:shadow-2xl border border-[#ECE7DE] dark:border-white/10 rounded-[2px] py-2 animate-fadeInDown max-h-[300px] overflow-y-auto">
            {options.map((opt) => (
              <div
                key={opt.value}
                className={`px-4 py-2 text-sm cursor-pointer transition-colors ${value === opt.value ? 'bg-[#C7A25C]/20 text-[#C7A25C]' : 'text-[#1F1F1F]/80 dark:text-white/80 hover:bg-[#F8F6F2] dark:hover:bg-white/5 hover:text-[#1F1F1F] dark:hover:text-white'}`}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
              >
                {opt.label}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function SanPhamPage() {
  const [activeFilters, setActiveFilters] = useState({
    type: '*',
    unit: '*',
    price: '*'
  });
  const [products, setProducts] = useState<any[]>([]);
  const [availableFilters, setAvailableFilters] = useState({
    types: [{ id: '*', label: 'Tất cả các loại' }],
    units: [{ id: '*', label: 'Tất cả đơn vị' }],
    prices: [{ id: '*', label: 'Tất cả mức giá' }]
  });
  const [isLoading, setIsLoading] = useState(true);

  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [selectedProductName, setSelectedProductName] = useState('');
  const [selectedProductImage, setSelectedProductImage] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3001/api/v1';
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
              link: `/san-pham/${p.id}`,
              unitName: p.unitName || 'ArcViet',
              unitLogo: '/images/logo-main.png'
            };
          });

          // Generate dynamic filters
          const uniqueTypes = Array.from(new Set(data.map((p: any) => p.projectType || 'Khác'))) as string[];
          const uniqueUnits = Array.from(new Set(data.map((p: any) => p.unitName || 'ArcViet'))) as string[];
          const uniquePrices = Array.from(new Set(data.map((p: any) => p.budget || 'Liên hệ'))) as string[];

          setAvailableFilters({
            types: [{ id: '*', label: 'Tất cả các loại' }, ...uniqueTypes.map(type => ({ id: type, label: type }))],
            units: [{ id: '*', label: 'Tất cả đơn vị' }, ...uniqueUnits.map(unit => ({ id: unit, label: unit }))],
            prices: [{ id: '*', label: 'Tất cả mức giá' }, ...uniquePrices.map(price => ({ id: price, label: price }))]
          });
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

  const filteredItems = products.filter(item => {
    const matchType = activeFilters.type === '*' || item.categories.includes(activeFilters.type);
    const matchUnit = activeFilters.unit === '*' || item.unitName === activeFilters.unit;
    const matchPrice = activeFilters.price === '*' || item.price === activeFilters.price;
    return matchType && matchUnit && matchPrice;
  });

  return (
    <div className="pt-[120px] pb-20 modern-section min-h-screen text-gray-900 dark:text-white transition-colors duration-300">
      <div className="container mx-auto px-6 max-w-[1400px]">
        <div className="flex flex-col items-center justify-center text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-[2px] bg-gradient-to-r from-[#C7A25C]/20 to-transparent border-l-2 border-[#C7A25C] text-[#A67C00] dark:text-[#FFD700] text-[11px] font-bold uppercase tracking-widest mb-4 luxury-glow mx-auto">
            <span className="w-2 h-2 rounded-[2px] bg-[#C7A25C] animate-pulse"></span>
            Nội Thất Cao Cấp
          </div>
          <h1 className="w-full uppercase font-heading text-4xl md:text-5xl font-bold text-[#1F1F1F] dark:text-white leading-tight mb-4">
            Tất cả <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C7A25C] to-[#E5C98A]">Sản Phẩm</span>
          </h1>
          <p className="text-[#1F1F1F]/60 dark:text-white/60 text-base md:text-lg max-w-3xl mx-auto">
            Khám phá những sản phẩm nội thất cao cấp của chúng tôi, nơi từng đường nét đều được thiết kế và chế tác tinh xảo, mang lại một không gian sống đậm chất nghệ thuật và hoàn mỹ.
          </p>
        </div>

        {/* Filters Scaffold */}
        <div className="bg-white dark:bg-[#1c1c1c] shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-none p-6 rounded-[2px] mb-12 border border-[#ECE7DE] dark:border-white/5 flex flex-wrap gap-4 items-end relative z-[60]">
          <CustomSelect
            label="Loại công trình"
            value={activeFilters.type}
            onChange={(val) => setActiveFilters(prev => ({ ...prev, type: val }))}
            options={availableFilters.types.map(f => ({ value: f.id, label: f.label }))}
          />
          <CustomSelect
            label="Đơn vị thi công"
            value={activeFilters.unit}
            onChange={(val) => setActiveFilters(prev => ({ ...prev, unit: val }))}
            options={availableFilters.units.map(f => ({ value: f.id, label: f.label }))}
          />
          <CustomSelect
            label="Mức giá"
            value={activeFilters.price}
            onChange={(val) => setActiveFilters(prev => ({ ...prev, price: val }))}
            options={availableFilters.prices.map(f => ({ value: f.id, label: f.label }))}
          />
          
          <div className="flex-1 min-w-[200px]">
            <button
              onClick={() => setActiveFilters({ type: '*', unit: '*', price: '*' })}
              className="w-full bg-[#C7A25C] hover:bg-[#1F1F1F] hover:text-white dark:hover:bg-white dark:hover:text-white text-white font-bold py-3 px-6 rounded-[2px] transition-colors uppercase tracking-wider text-sm h-[46px] mt-2"
            >
              Xóa bộ lọc
            </button>
          </div>
        </div>

        {/* Product Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="animate-pulse modern-section rounded-[4px] overflow-hidden border border-gray-100 dark:border-white/5 h-[350px]">
                <div className="bg-gray-200 dark:bg-white/5 w-full h-2/3"></div>
                <div className="p-6 space-y-4">
                  <div className="h-4 bg-gray-200 dark:bg-white/5 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-white/5 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-20 modern-section rounded-[4px] border border-gray-100 dark:border-white/5">
            <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Không tìm thấy sản phẩm nào</h3>
            <p className="text-gray-500">Vui lòng thử chọn danh mục khác.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredItems.map((item) => (
              <Link href={item.link} key={item.id} className="group flex flex-col bg-white dark:bg-[#131313] border border-[#ECE7DE] dark:border-white/5 rounded-[2px] overflow-hidden hover:shadow-xl hover:-translate-y-2 transition-all duration-500 luxury-glow relative">
                <div className="aspect-[4/3] relative overflow-hidden">
                  {/* Luxury Corner Accents */}
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#D3AE3E] opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-30"></div>
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#D3AE3E] opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-30"></div>
                  
                  <div className="w-full h-full relative overflow-hidden">
                    <img src={item.img} alt={item.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
                    {/* Default Inner Border */}
                    <div className="absolute inset-3 border border-[#D3AE3E]/30 z-20 pointer-events-none transition-all duration-500 group-hover:opacity-0 group-hover:scale-105 rounded-[1px]"></div>
                  </div>
                  
                  <div className="absolute top-4 left-4 bg-[#D3AE3E] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 shadow-md z-20">Mới nhất</div>
                  
                  {/* Partner Logo */}
                  <div className="absolute top-4 right-4 z-20 w-11 h-11 bg-white rounded-full p-1.5 shadow-xl flex items-center justify-center group/logo border border-gray-100 hover:scale-110 transition-transform">
                    <img src={item.unitLogo} alt={item.unitName} className="w-full h-full object-contain rounded-full" />
                    <div className="absolute top-full mt-2 right-0 bg-[#1a1a1a] text-[#D3AE3E] text-[11px] px-3 py-1.5 rounded-[2px] opacity-0 invisible group-hover/logo:opacity-100 group-hover/logo:visible whitespace-nowrap transition-all shadow-lg pointer-events-none font-bold tracking-widest uppercase border border-[#D3AE3E]/30">
                      {item.unitName}
                    </div>
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2">{item.categories.join(', ')}</div>
                  <h3 className="font-heading text-lg font-bold text-gray-900 dark:text-white group-hover:text-[#D3AE3E] transition-colors mb-4 line-clamp-2 leading-snug">{item.title}</h3>
                  <div className="mt-auto pt-4 border-t border-gray-100 dark:border-white/5 relative z-20">
                    <span 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setSelectedProductName(item.title);
                        setSelectedProductImage(item.image);
                        setIsQuoteModalOpen(true);
                      }}
                      className="flex items-center justify-center gap-2 w-full bg-[#FAF8F2] dark:bg-[#131313] border border-[#E5C98A]/50 dark:border-[#C7A25C]/30 text-[#C7A25C] font-bold uppercase tracking-wider text-[11px] py-3 rounded-[2px] group-hover:bg-[#C7A25C] group-hover:text-white group-hover:border-[#C7A25C] hover:bg-[#C7A25C] hover:text-white hover:border-[#C7A25C] transition-all duration-300"
                    >
                      Nhận báo giá
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {typeof document !== 'undefined' && (
        <QuoteModal 
          isOpen={isQuoteModalOpen} 
          onClose={() => setIsQuoteModalOpen(false)} 
          productName={selectedProductName} 
          productImage={selectedProductImage}
        />
      )}
    </div>
  );
}
