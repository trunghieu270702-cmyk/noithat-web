'use client';
import SectionStarryMotif from '../_components/SectionStarryMotif';
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
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const take = 12;

  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [selectedProductName, setSelectedProductName] = useState('');
  const [selectedProductImage, setSelectedProductImage] = useState('');

  const loaderRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);

  // Fetch Meta data for filters
  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3001/api/v1';
        const res = await fetch(`${apiUrl}/projects/meta`);
        if (!res.ok) throw new Error('API error fetching meta');
        const data = await res.json();
        
        setAvailableFilters({
          types: [{ id: '*', label: 'Tất cả các loại' }, ...(data.types || []).map((t: string) => ({ id: t, label: t }))],
          units: [{ id: '*', label: 'Tất cả đơn vị' }, ...(data.units || []).map((u: string) => ({ id: u, label: u }))],
          prices: [{ id: '*', label: 'Tất cả mức giá' }, ...(data.budgets || []).map((p: string) => ({ id: p, label: p }))]
        });
      } catch (error) {
        console.error("Failed to fetch meta", error);
      }
    };
    fetchMeta();
  }, []);

  // Fetch Products
  useEffect(() => {
    const fetchProducts = async () => {
      if (!hasMore && page !== 0) return;
      
      try {
        if (page === 0) setIsLoading(true);
        else setIsLoadingMore(true);

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3001/api/v1';
        const params = new URLSearchParams({
          skip: (page * take).toString(),
          take: take.toString()
        });
        
        if (activeFilters.type !== '*') params.append('projectType', activeFilters.type);
        if (activeFilters.unit !== '*') params.append('unitName', activeFilters.unit);
        if (activeFilters.price !== '*') params.append('budget', activeFilters.price);

        const res = await fetch(`${apiUrl}/products?${params.toString()}`, { cache: 'no-store' });
        if (!res.ok) throw new Error('API error');

        const data = await res.json();

        if (Array.isArray(data)) {
          const fetchedProducts = data.map((p: any) => {
            return {
              id: p.id,
              title: p.name || p.title,
              img: p.images && p.images.length > 0 ? p.images[0] : '', 
              categories: p.categories ? p.categories.map((c:any) => c.name) : ['Khác'],
              price: p.price || p.promotionalPrice || 'Liên hệ',
              link: `/san-pham/${p.id}`,
              unitName: p.unit?.name || 'ArcViet',
              unitLogo: p.unit?.avatar ? (Array.isArray(p.unit.avatar) ? p.unit.avatar[0] : p.unit.avatar) : '/images/logo-main.png'
            };
          });

          if (fetchedProducts.length < take) {
            setHasMore(false);
          }

          if (page === 0) {
            setProducts(fetchedProducts);
          } else {
            setProducts(prev => {
              const newProducts = [...prev];
              fetchedProducts.forEach((p: any) => {
                if (!newProducts.find(existing => existing.id === p.id)) {
                  newProducts.push(p);
                }
              });
              return newProducts;
            });
          }
        }
      } catch (error) {
        console.error("Failed to fetch products", error);
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    };

    fetchProducts();
  }, [page, activeFilters]);

  // Reset page when filters change
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setPage(0);
    setHasMore(true);
    setProducts([]);
  }, [activeFilters.type, activeFilters.unit, activeFilters.price]);

  // Intersection Observer for Infinite Scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && hasMore && !isLoading && !isLoadingMore) {
          setPage(prev => prev + 1);
        }
      },
      { threshold: 0.1 }
    );

    const currentLoader = loaderRef.current;
    if (currentLoader) {
      observer.observe(currentLoader);
    }

    return () => {
      if (currentLoader) {
        observer.unobserve(currentLoader);
      }
    };
  }, [hasMore, isLoading, isLoadingMore]);

  return (
    <div className="overflow-hidden relative pt-[120px] pb-20 modern-section min-h-screen text-gray-900 dark:text-white transition-colors duration-300">
      <SectionStarryMotif position="random-corner" />
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
        {isLoading && page === 0 ? (
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
        ) : products.length === 0 ? (
          <div className="text-center py-20 modern-section rounded-[4px] border border-gray-100 dark:border-white/5">
            <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Không tìm thấy sản phẩm nào</h3>
            <p className="text-gray-500">Vui lòng thử chọn danh mục khác.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {products.map((item, index) => (
                <Link href={item.link} key={`${item.id}-${index}`} className="group flex flex-col bg-white dark:bg-[#131313] border border-[#ECE7DE] dark:border-white/5 rounded-[2px] overflow-hidden hover:shadow-xl hover:-translate-y-2 transition-all duration-500 luxury-glow relative">
                  <div className="aspect-[4/3] relative overflow-hidden bg-gray-50 dark:bg-white/5">
                    {item.img ? (
                      <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300 dark:text-gray-600">
                         <svg className="w-12 h-12 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                      </div>
                    )}
                    
                    <div className="absolute top-4 left-4 bg-[#D3AE3E] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 shadow-md z-20">Mới nhất</div>
                    
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
                          setSelectedProductImage(item.img);
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
            
            {/* Infinite Scroll Loader */}
            <div ref={loaderRef} className="py-12 flex justify-center items-center w-full">
              {isLoadingMore && (
                <div className="flex gap-2 items-center text-[#C7A25C]">
                  <span className="w-2 h-2 rounded-full bg-[#C7A25C] animate-bounce"></span>
                  <span className="w-2 h-2 rounded-full bg-[#C7A25C] animate-bounce delay-100"></span>
                  <span className="w-2 h-2 rounded-full bg-[#C7A25C] animate-bounce delay-200"></span>
                </div>
              )}
            </div>
          </>
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
