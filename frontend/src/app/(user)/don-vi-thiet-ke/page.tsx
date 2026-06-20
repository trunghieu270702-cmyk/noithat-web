'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

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

  const selectedLabel = options.find(o => o.value === value)?.label || options[0].label;

  return (
    <div className={`flex-1 min-w-[200px] relative ${isOpen ? 'z-50' : 'z-10'}`} ref={dropdownRef}>
      <label className="block text-sm text-gray-400 dark:text-white/50 mb-2 font-medium">{label}</label>
      <div className="relative">
        <div
          className={`modern-section border ${isOpen ? 'border-[#C7A25C]' : 'border-[#ECE7DE] dark:border-white/20'} text-[#1F1F1F] dark:text-white p-3 rounded-[2px] cursor-pointer flex justify-between items-center transition-colors hover:border-[#C7A25C]/50`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="text-sm">{selectedLabel}</span>
          <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180 text-[#C7A25C]' : 'text-[#1F1F1F]/50 dark:text-white/50'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
        </div>

        {isOpen && (
          <div className="absolute z-50 w-full mt-2 modern-section shadow-sm dark:shadow-none border border-gray-200 dark:border-white/10 rounded-[2px] py-2 animate-fadeInDown">
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

export default function DonViThietKePage() {
  const [segment, setSegment] = useState('');
  const [type, setType] = useState('');
  const [style, setStyle] = useState('');

  const getCategoryStyles = (category: string) => {
    const lower = category?.toLowerCase() || '';
    if (lower.includes('cao cấp')) {
      return 'bg-gradient-to-r from-[#D3AE3E] to-[#E5C98A] text-[#131313] shadow-[0_0_15px_rgba(211,174,62,0.4)] luxury-glow';
    }
    if (lower.includes('trung cấp')) {
      return 'bg-[#1F1F1F] dark:bg-white/20 text-white border border-[#ECE7DE] dark:border-white/30 backdrop-blur-sm';
    }
    return 'bg-white/90 dark:bg-black/80 backdrop-blur-md text-[#1F1F1F] dark:text-white border border-gray-200 dark:border-white/10';
  };

  const [units, setUnits] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3001/api/v1'}/units`);
        const data = await res.json();
        if (Array.isArray(data)) {
          // Map API data to the fields required by the UI
          const mappedUnits = data.map((u: any, idx: number) => ({
            id: u.id,
            name: u.name,
            category: u.segment,
            strengths: u.projectType || 'Đa dạng',
            style: u.style || 'Hiện đại',
            location: u.location || 'Toàn quốc',
            description: u.shortDescription || u.description || 'Đơn vị thiết kế thi công nội thất chuyên nghiệp.',
            image: u.avatar || `/images/common/bg-hero-${(idx % 2) + 1}.jpg`,
            fanpage: u.fanpage || null,
            services: u.services || []
          }));
          setUnits(mappedUnits);
        }
      } catch (error) {
        console.error('Failed to fetch units:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUnits();
  }, []);

  return (
    <div className="modern-section min-h-screen pt-[120px] pb-20">
      <div className="container mx-auto px-6 max-w-[1400px]">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-[2px] bg-gradient-to-r from-[#C7A25C]/20 to-transparent border-l-2 border-[#C7A25C] text-[#A67C00] dark:text-[#FFD700] text-[11px] font-bold uppercase tracking-widest mb-4 luxury-glow">
            Đơn vị thiết kế
          </div>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-[#1F1F1F] dark:text-white mb-6 uppercase">Hệ sinh thái 30 đơn vị thiết kế – thi công</h1>
          <p className="text-gray-600 dark:text-white/70 max-w-3xl mx-auto text-lg">Các đơn vị được phân loại theo phân khúc, loại công trình, khu vực hoạt động, phong cách thiết kế và năng lực thi công. Khách hàng có thể tham khảo hồ sơ từng đơn vị hoặc gửi nhu cầu để được tư vấn đơn vị phù hợp nhất.</p>
        </div>

        {/* Filters Scaffold */}
        <div id="phan-khuc" className="card dark:bg-[#1c1c1c] shadow-sm dark:shadow-none p-6 rounded-[4px] mb-12 border border-[#ECE7DE] dark:border-white/10 flex flex-wrap gap-4 items-end relative z-[60]">
          <CustomSelect
            label="Phân khúc"
            value={segment}
            onChange={setSegment}
            options={[
              { value: '', label: 'Tất cả phân khúc' },
              { value: 'co-ban', label: 'Cơ bản' },
              { value: 'trung-cap', label: 'Trung cấp' },
              { value: 'cao-cap', label: 'Cao cấp' },
            ]}
          />
          <CustomSelect
            label="Loại công trình"
            value={type}
            onChange={setType}
            options={[
              { value: '', label: 'Tất cả loại hình' },
              { value: 'chung-cu', label: 'Chung cư' },
              { value: 'nha-pho', label: 'Nhà phố' },
              { value: 'villa', label: 'Villa / Biệt thự' },
              { value: 'van-phong', label: 'Văn phòng / Showroom' },
            ]}
          />
          <CustomSelect
            label="Phong cách"
            value={style}
            onChange={setStyle}
            options={[
              { value: '', label: 'Tất cả phong cách' },
              { value: 'hien-dai', label: 'Hiện đại' },
              { value: 'toi-gian', label: 'Tối giản' },
              { value: 'luxury', label: 'Luxury' },
              { value: 'indochine', label: 'Indochine' },
            ]}
          />
          <div className="flex-1 min-w-[200px]">
            <button className="w-full bg-[#C7A25C] hover:bg-[#1F1F1F] hover:text-white dark:hover:bg-white dark:hover:text-white text-white dark:text-white font-bold py-3 px-6 rounded-[2px] transition-colors uppercase tracking-wider text-sm h-[46px] mt-2">
              Lọc kết quả
            </button>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            <div className="col-span-3 text-center text-gray-400 dark:text-white/50 py-10">Đang tải danh sách đơn vị...</div>
          ) : units.length === 0 ? (
            <div className="col-span-1 md:col-span-2 lg:col-span-3 card dark:bg-[#1c1c1c] shadow-sm dark:shadow-none border border-[#ECE7DE] dark:border-white/5 rounded-[4px] p-16 text-center flex flex-col items-center justify-center min-h-[400px]">
              <div className="w-24 h-24 bg-[#C7A25C]/10 text-[#C7A25C] rounded-full flex items-center justify-center text-4xl mb-6 shadow-[0_0_30px_rgba(206,158,81,0.15)]">
                <i className="fa fa-building"></i>
              </div>
              <h3 className="font-heading text-2xl font-bold text-[#1F1F1F] dark:text-white mb-4">Chưa có đối tác nào</h3>
              <p className="text-gray-500 dark:text-white/60 max-w-md mx-auto text-lg">Hệ thống hiện đang cập nhật danh sách các đơn vị thiết kế và thi công nội thất chuyên nghiệp. Vui lòng quay lại sau!</p>
            </div>
          ) : units.map((unit) => (
            <div key={unit.id} className="card dark:bg-[#1c1c1c] shadow-sm dark:shadow-none rounded-[4px] overflow-hidden group border border-[#ECE7DE] dark:border-white/5 hover:border-[#C7A25C]/50 hover:-translate-y-1 transition-all luxury-glow relative">
              <Link href={`/don-vi-thiet-ke/${unit.id}`} className="absolute inset-0 z-40" aria-label={`Xem chi tiết hồ sơ ${unit.name}`}></Link>
              <div className="h-[240px] relative overflow-hidden">
                {/* Luxury Corner Accents */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#D3AE3E] opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-30"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#D3AE3E] opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-30"></div>
                
                <div className="w-full h-full relative overflow-hidden">
                  <div
                    className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-1000"
                    style={{ backgroundImage: `url(${unit.image})` }}
                  ></div>
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
                  {/* Default Inner Border */}
                  <div className="absolute inset-3 border border-[#D3AE3E]/30 z-20 pointer-events-none transition-all duration-500 group-hover:opacity-0 group-hover:scale-105 rounded-[1px]"></div>
                </div>
                <div className={`absolute top-4 left-4 text-[10px] font-bold px-3 py-1.5 rounded-[2px] uppercase tracking-widest z-20 shadow-md ${getCategoryStyles(unit.category)}`}>
                  {unit.category}
                </div>
              </div>
              <div className="p-6">
                <div className="mb-2">
                  <h3 className="font-heading text-2xl font-bold text-[#1F1F1F] dark:text-white mb-2">{unit.name}</h3>
                </div>
                <p className="text-sm text-gray-500 dark:text-white/60 mb-4 line-clamp-2">{unit.description}</p>

                <div className="space-y-2 mb-6 text-sm text-gray-700 dark:text-white/80">
                  <div className="flex items-start">
                    <i className="fa fa-building mt-1 w-5 text-[#C7A25C]"></i>
                    <span><strong>Thế mạnh:</strong> {unit.strengths}</span>
                  </div>
                  <div className="flex items-start">
                    <i className="fa fa-paint-brush mt-1 w-5 text-[#C7A25C]"></i>
                    <span><strong>Phong cách:</strong> {unit.style}</span>
                  </div>
                  <div className="flex items-start">
                    <i className="fa fa-map-marker-alt mt-1 w-5 text-[#C7A25C]"></i>
                    <span><strong>Khu vực:</strong> {unit.location}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-3 relative z-50">
                  <div className="flex gap-2">
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        router.push(`/don-vi-thiet-ke/so-sanh?ids=${unit.id}`);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 bg-transparent border border-[#E5C98A] dark:border-white/30 hover:bg-[#C7A25C] hover:border-[#C7A25C] text-[#C7A25C] hover:text-white font-bold py-3 px-4 rounded-[2px] transition-all duration-300 uppercase tracking-wider text-xs group/cb shadow-[0_4px_15px_rgba(199,162,92,0.05)] hover:shadow-[0_4px_15px_rgba(199,162,92,0.3)]"
                    >
                      <svg className="w-4 h-4 text-[#C7A25C] group-hover/cb:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
                      So sánh
                    </button>
                    {unit.fanpage && (
                      <a href={unit.fanpage} target="_blank" rel="noreferrer" className="flex items-center justify-center bg-[#3b5998] hover:bg-[#2d4373] text-white px-4 rounded-[2px] transition-colors" title="Facebook Fanpage">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                      </a>
                    )}
                  </div>
                  <Link href={`/tu-van?unit=${unit.id}`} className="text-center block w-full bg-[#1F1F1F] text-white dark:bg-white/10 dark:hover:bg-[#C7A25C] dark:text-white font-bold py-3 px-4 rounded-[2px] transition-colors uppercase tracking-wider text-xs hover:bg-[#C7A25C]">
                    Nhận tư vấn
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>


    </div>
  );
}
