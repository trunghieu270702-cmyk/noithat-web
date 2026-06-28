'use client';
import SectionStarryMotif from '../../_components/SectionStarryMotif';
import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import QuoteModal from '../../_components/QuoteModal';

export default function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [selectedProductName, setSelectedProductName] = useState('');
  const [selectedProductImage, setSelectedProductImage] = useState('');
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  
  const [product, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3001/api/v1';
        const res = await fetch(`${apiUrl}/products/${resolvedParams.id}`);
        if (res.ok) {
          const data = await res.json();
          setProduct({
            id: data.id,
            name: data.name,
            price: data.price ? `${data.price.toLocaleString('vi-VN')} VNĐ` : 'Liên hệ',
            originalPrice: data.promotionalPrice ? `${data.promotionalPrice.toLocaleString('vi-VN')} VNĐ` : null,
            description: data.shortDescription || '',
            images: data.images && data.images.length > 0 ? data.images : [],
            content: data.description || '',
            categories: data.categories ? data.categories.map((c:any) => c.name) : [],
            categoryId: data.categories && data.categories.length > 0 ? data.categories[0].id : undefined,
            unitName: data.unit?.name,
            unitLogo: data.unit?.avatar ? (Array.isArray(data.unit.avatar) ? data.unit.avatar[0] : data.unit.avatar) : '/images/logo-main.png',
            attributes: data.attributes || []
          });
        }
      } catch (err) {
        console.error("Failed to fetch product", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [resolvedParams.id]);

  useEffect(() => {
    if (!product) return;

    const fetchRelated = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3001/api/v1';
        let url = `${apiUrl}/products?take=8`;
        if (product.categoryId) {
          url += `&categoryId=${product.categoryId}`;
        }
        let res = await fetch(url);
        let products = [];
        if (res.ok) {
          let data = await res.json();
          if (Array.isArray(data)) {
            products = data.filter((p: any) => p.id !== product.id);
          }
        }
        
        // Nếu không đủ 4 sản phẩm, fetch thêm
        if (products.length < 4) {
          const resMore = await fetch(`${apiUrl}/products?take=8`);
          if (resMore.ok) {
            const dataMore = await resMore.json();
            if (Array.isArray(dataMore)) {
              const moreProducts = dataMore.filter((p: any) => p.id !== product.id && !products.find((existing: any) => existing.id === p.id));
              products = [...products, ...moreProducts];
            }
          }
        }

        products = products.slice(0, 4);

        if (products.length > 0) {
          setRelatedProducts(products.map((p: any) => ({
            id: p.id,
            title: p.name,
            img: p.images && p.images.length > 0 ? p.images[0] : '',
            categories: p.categories ? p.categories.map((c:any) => c.name) : ['Khác'],
            price: p.price || p.promotionalPrice || 'Liên hệ',
            link: `/san-pham/${p.id}`,
            unitName: p.unit?.name || 'ArcViet',
            unitLogo: p.unit?.avatar ? (Array.isArray(p.unit.avatar) ? p.unit.avatar[0] : p.unit.avatar) : '/images/logo-main.png'
          })));
        }
      } catch (err) {
        console.error("Failed to fetch related products", err);
      }
    };
    fetchRelated();
  }, [product]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24 bg-white dark:bg-[#131313]">
        <div className="w-8 h-8 rounded-full border-2 border-[#D3AE3E] border-t-transparent animate-spin"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24 text-gray-900 dark:text-white">
        Không tìm thấy sản phẩm.
      </div>
    );
  }

  return (
    <div className="overflow-hidden relative pt-24 pb-12 md:pt-28 md:pb-16 lg:pt-32 lg:pb-24 modern-section min-h-screen text-gray-900 dark:text-white transition-colors duration-300">
      <SectionStarryMotif position="random-corner" />
      <div className="max-w-[1400px] mx-auto px-6">

        {/* Breadcrumb & Back */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 border-b border-gray-200 dark:border-white/10 pb-6">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-2 text-[13px] text-gray-500 dark:text-[#888] uppercase tracking-wider font-semibold">
            <Link href="/" className="hover:text-[#D3AE3E] transition-colors whitespace-nowrap">Trang chủ</Link>
            <span className="text-gray-300 dark:text-gray-700">/</span>
            <Link href="/san-pham" className="hover:text-[#D3AE3E] transition-colors whitespace-nowrap">Sản phẩm</Link>
            <span className="text-gray-300 dark:text-gray-700">/</span>
            <span className="text-gray-900 dark:text-white line-clamp-1">{product.name}</span>
          </div>

          <Link href="/san-pham" className="hidden md:flex items-center gap-2 text-sm text-gray-500 hover:text-[#D3AE3E] transition-colors font-medium shrink-0">
            <ArrowLeft className="w-4 h-4" />
            Quay lại
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Product Images (Left Side) */}
          <div className="lg:col-span-7 space-y-2">
            <div className="aspect-[4/3] rounded-[4px] overflow-hidden modern-section shadow-sm shadow-black/5 border border-gray-100 dark:border-white/5 relative group cursor-crosshair">
              {product.images[0] ? (
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-50 dark:bg-white/5 text-gray-300 dark:text-gray-600">
                   <svg className="w-12 h-12 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                </div>
              )}
              <div className="absolute top-6 left-6 flex flex-col gap-2 z-20">
                <span className="bg-[#D3AE3E] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 shadow-sm">Mới nhất</span>
                {product.originalPrice && <span className="bg-gray-900 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 shadow-sm">Sale</span>}
              </div>

              {/* Partner Logo inside the image */}
              {product.unitName && (
                <div className="absolute top-6 right-6 z-20 flex items-center gap-3 bg-white/95 dark:bg-[#131313]/95 backdrop-blur-md p-2 pr-6 rounded-full shadow-2xl border border-gray-200 dark:border-white/10 luxury-glow hover:scale-105 transition-transform duration-300">
                  <div className="w-14 h-14 bg-white rounded-full p-1.5 shadow-inner flex items-center justify-center shrink-0 border border-gray-100">
                    <img src={product.unitLogo} alt={product.unitName} className="w-full h-full object-contain rounded-full" />
                  </div>
                  <span className="text-sm font-bold text-gray-900 dark:text-white tracking-widest uppercase whitespace-nowrap">{product.unitName}</span>
                </div>
              )}
            </div>

            {(product.images[1] || product.images[2]) && (
              <div className="grid grid-cols-2 gap-2">
                {product.images[1] && (
                  <div className="aspect-[4/3] rounded-[4px] overflow-hidden modern-section shadow-sm border border-gray-100 dark:border-white/5 relative group">
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10" />
                    <img src={product.images[1]} alt={`${product.name} - góc khác`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                )}
                {product.images[2] && (
                  <div className="aspect-[4/3] rounded-[4px] overflow-hidden modern-section shadow-sm border border-gray-100 dark:border-white/5 relative group">
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10" />
                    <img src={product.images[2]} alt={`${product.name} - chi tiết`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Product Info (Right Side) */}
          <div className="lg:col-span-5 flex flex-col">
            {product.categories && product.categories.length > 0 && (
              <span className="inline-block px-3 py-1.5 bg-black/80 backdrop-blur-md border border-[#D3AE3E]/20 text-[#D3AE3E] text-[11px] font-bold uppercase tracking-widest w-max mb-6 rounded-[2px] luxury-glow">
                {product.categories[0]}
              </span>
            )}

            <h1 className="font-heading text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              {product.name}
            </h1>

            <div className="mb-8 flex items-end gap-4">
              <span className="text-3xl font-bold text-[#D3AE3E]">{product.price}</span>
              {product.originalPrice && (
                <span className="text-lg text-gray-400 line-through mb-1">{product.originalPrice}</span>
              )}
            </div>

            <p className="text-gray-600 dark:text-[#ccc] text-base leading-relaxed mb-8">
              {product.description}
            </p>

            {/* Thông số kỹ thuật (Attributes) */}
            {product.attributes && product.attributes.length > 0 && (
              <div className="mb-10">
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-6 h-[2px] bg-[#D3AE3E]"></span>
                  <h3 className="text-[11px] font-bold text-[#D3AE3E] uppercase tracking-[0.2em]">
                    Thông số kỹ thuật
                  </h3>
                </div>
                <div className="rounded-[4px] border border-gray-200 dark:border-white/8 overflow-hidden">
                  {product.attributes.map((attr: any, index: number) => (
                    <div
                      key={index}
                      className={`flex items-start gap-4 px-5 py-3.5 text-sm transition-colors ${
                        index % 2 === 0
                          ? 'bg-gray-50/80 dark:bg-white/[0.02]'
                          : 'bg-white dark:bg-transparent'
                      } ${index !== product.attributes.length - 1 ? 'border-b border-gray-100 dark:border-white/5' : ''}`}
                    >
                      <span className="w-[2px] h-4 bg-[#D3AE3E]/50 rounded-full mt-0.5 shrink-0"></span>
                      <span className="w-2/5 font-semibold text-gray-700 dark:text-gray-300 shrink-0 leading-snug">
                        {attr.name}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400 leading-snug whitespace-pre-wrap">
                        {attr.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-8 border-t border-gray-200 dark:border-white/10">
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedProductName(product.name);
                  setSelectedProductImage(product.images[0] || '');
                  setIsQuoteModalOpen(true);
                }}
                className="flex-[2] bg-[#D3AE3E] text-white hover:bg-[#b88c45] py-3.5 px-6 rounded-[2px] font-bold uppercase tracking-widest text-[12px] transition-all duration-300 flex items-center justify-center gap-3 shadow-sm shadow-[#D3AE3E]/20 hover:shadow-sm hover:-translate-y-1"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                Nhận báo giá
              </button>
              <Link href={`/tu-van?product=${product.id}`} className="flex-1 bg-transparent border-2 border-[#D3AE3E] text-[#D3AE3E] hover:bg-[#D3AE3E] hover:text-white py-3.5 px-6 rounded-[2px] font-bold uppercase tracking-widest text-[12px] text-center transition-all duration-300 flex items-center justify-center gap-2">
                Tư vấn
              </Link>
            </div>

            <div className="mt-8 flex items-center justify-center gap-6 text-sm text-gray-500 font-medium">
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                Bảo hành chính hãng
              </span>
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
                Đổi trả trong 7 ngày
              </span>
            </div>
          </div>
        </div>

        {/* --- Thông tin chi tiết --- */}
        <div className="mt-24 pt-16 border-t border-gray-200 dark:border-white/10">
          <div className="flex flex-col items-center justify-center text-center mb-16">
            <span className="text-[#D3AE3E] text-[10px] font-bold tracking-[0.2em] uppercase mb-3 flex items-center gap-2">
              <span className="w-8 h-[1px] bg-[#D3AE3E]"></span>
              Thông tin
              <span className="w-8 h-[1px] bg-[#D3AE3E]"></span>
            </span>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-gray-900 dark:text-white uppercase tracking-widest">
              Mô tả chi tiết
            </h2>
          </div>

          {product.content ? (
            <div className="prose prose-lg dark:prose-invert max-w-none text-gray-600 dark:text-[#ccc]" dangerouslySetInnerHTML={{ __html: product.content }} />
          ) : (
            <div className="flex flex-col items-center justify-center text-gray-400 py-12 bg-gray-50 dark:bg-[#1a1a1a] rounded-[4px] border border-gray-100 dark:border-white/5">
              <svg className="w-16 h-16 mb-4 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              <p className="text-sm uppercase tracking-widest font-bold">Chưa có bài viết mô tả chi tiết</p>
            </div>
          )}
        </div>

        {/* --- Sản phẩm liên quan --- */}
        <div className="mt-24 pt-16 border-t border-gray-200 dark:border-white/10">
          <div className="flex items-end justify-between gap-4 mb-10">
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-gray-900 dark:text-white uppercase tracking-wider leading-tight">
              Sản phẩm <br className="md:hidden" />
              <span className="text-[#D3AE3E]">Liên quan</span>
            </h2>
            <Link href="/san-pham" className="shrink-0 whitespace-nowrap text-xs md:text-sm font-bold uppercase tracking-widest text-gray-500 hover:text-[#D3AE3E] transition-colors flex items-center gap-2 pb-1 md:pb-0">
              Xem tất cả <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {relatedProducts.map((item, index) => (
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
                        setSelectedProductImage(item.img || '');
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
    </div>
  );
}
