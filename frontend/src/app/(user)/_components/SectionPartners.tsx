'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import ArchitecturalAccent from './ArchitecturalAccent';
import SectionStarryMotif from './SectionStarryMotif';

export default function SectionPartners() {
  const [partners, setPartners] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const getAvatarUrl = (avatar: any) => {
    if (Array.isArray(avatar) && avatar.length > 0) return avatar[0].url;
    if (typeof avatar === 'string') {
      try {
        const parsed = JSON.parse(avatar);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed[0].url;
      } catch (e) { return avatar; }
    }
    return avatar?.url || null;
  };

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3001/api/v1'}/units`);
        const data = await res.json();
        if (Array.isArray(data)) {
          // Lấy 6 đơn vị đầu tiên để hiển thị trang chủ
          setPartners(data.slice(0, 6));
        }
      } catch (error) {
        console.error('Failed to fetch partners:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPartners();
  }, []);

  return (
    <section className="py-20 relative bg-[#f9f9f9] dark:bg-[#111111] border-t border-[#ECE7DE] dark:border-white/5 overflow-hidden">
      <div className="absolute inset-0 bg-[url('/images/common/noise.png')] opacity-[0.03] mix-blend-overlay pointer-events-none z-0"></div>
      <SectionStarryMotif />
      <div className="container mx-auto px-6 max-w-[1400px] relative z-10">
        <div className="text-center mb-12">
          <h2 className="font-heading text-sm md:text-base font-semibold text-[#D3AE3E] uppercase tracking-[0.2em] mb-2">
            Các đối tác chính
          </h2>
          <p className="text-gray-400 dark:text-white/40 text-sm">Hệ sinh thái hơn 30 đối tác chuyên nghiệp hàng đầu</p>
        </div>

        {/* Grid for logos */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8">
          {isLoading ? (
             [1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-[140px] animate-pulse bg-gray-200 dark:bg-white/5 rounded-[4px] border border-gray-100 dark:border-white/10"></div>)
          ) : partners.map((partner) => (
            <Link href={`/don-vi-thiet-ke/${partner.id}`} key={partner.id} className="flex flex-col items-center justify-center p-6 card dark:bg-[#1a1a1a] dark:hover:bg-white/10 border border-[#ECE7DE] dark:border-white/20 hover:border-[#C7A25C]/50 transition-all duration-300 group cursor-pointer hover:-translate-y-1 hover:shadow-lg luxury-glow rounded-[4px]">
              <div className="w-20 h-20 mb-4 text-gray-400 dark:text-white/40 group-hover:text-[#C7A25C] transition-all rounded-full overflow-hidden border border-[#ECE7DE] dark:border-white/10 flex items-center justify-center bg-white shadow-sm p-2 shadow-[0_5px_15px_rgba(0,0,0,0.05)] dark:shadow-[0_5px_15px_rgba(0,0,0,0.3)]">
                {getAvatarUrl(partner.avatar) ? (
                  <img src={getAvatarUrl(partner.avatar)} alt={partner.name} className="w-full h-full object-contain" />
                ) : (
                  <span className="text-xl font-heading font-bold text-[#D3AE3E]">{partner.name.substring(0, 2).toUpperCase()}</span>
                )}
              </div>
              <h3 className="font-heading font-bold text-[#1F1F1F] dark:text-white tracking-wider text-center line-clamp-1">{partner.name}</h3>
              <p className="text-[10px] text-gray-400 dark:text-white/40 uppercase tracking-widest mt-1 text-center line-clamp-1" title={partner.shortDescription || partner.segment || 'Đối tác'}>{partner.shortDescription || partner.segment || 'Đối tác'}</p>
            </Link>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Link href="/don-vi-thiet-ke" className="inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-widest text-[#1F1F1F] dark:text-white hover:text-[#C7A25C] dark:hover:text-[#C7A25C] transition-colors group px-6 py-3 border border-gray-200 dark:border-white/20 hover:border-[#C7A25C] rounded-[2px]">
            Xem tất cả đối tác
            <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
