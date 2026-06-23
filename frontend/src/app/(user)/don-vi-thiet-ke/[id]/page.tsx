'use client';
import SectionStarryMotif from '../../_components/SectionStarryMotif';
import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';

export default function UnitDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [unit, setUnit] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUnit = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'}/units`);
        const data = await res.json();
        if (Array.isArray(data)) {
          const found = data.find((u: any) => u.id.toString() === resolvedParams.id.toString());
          if (found) {
            
            const getAvatarUrl = (avatar: any) => {
              if (Array.isArray(avatar) && avatar.length > 0) return avatar[0].url;
              if (typeof avatar === 'string') {
                try {
                  const parsed = JSON.parse(avatar);
                  if (Array.isArray(parsed) && parsed.length > 0) return parsed[0].url;
                } catch(e) { return avatar; }
              }
              return avatar?.url || null;
            };

            setUnit({
              id: found.id,
              name: found.name,
              avatarUrl: getAvatarUrl(found.avatar),
              category: found.segment || 'Cơ bản',
              strengths: found.projectType || 'Chung cư, Nhà phố',
              style: found.style || 'Hiện đại',
              location: found.location || 'Toàn quốc',
              experience: found.experience ? found.experience + ' năm' : '5 năm',
              description: found.description || found.shortDescription || 'Chuyên thiết kế và thi công nội thất chuyên nghiệp.',
              profile: found.profile || null,
              fanpage: found.fanpage || null,
              services: (found.services && found.services.length > 0) ? found.services : [
                found.shortDescription || 'Sản phẩm nội thất',
                'Tư vấn lắp đặt',
                'Bảo hành chính hãng'
              ],
              projects: (found.products && found.products.length > 0) ? found.products.map((p: string) => ({ name: p, type: 'Sản phẩm', area: '-', style: found.style || 'Hiện đại', time: '-' })) : [
                { name: `Sản phẩm tiêu biểu của ${found.name}`, type: found.segment, area: '-', style: 'Hiện đại', time: 'Có sẵn' },
                { name: 'Dự án đã triển khai', type: 'Dự án', area: '100m2', style: 'Sang trọng', time: '30 ngày' }
              ],
              advantages: found.projectType ? found.projectType.split(',') : ['Mạnh về tối ưu chi phí'],
              workflow: [
                'Tiếp nhận nhu cầu',
                'Khảo sát hiện trạng',
                'Lên phương án thiết kế',
                'Báo giá sơ bộ',
                'Ký hợp đồng',
                'Thi công',
                'Nghiệm thu'
              ],
              budget: {
                range: 'Theo thực tế',
                min: 'Liên hệ'
              }
            });
          }
        }
      } catch (error) {
        console.error('Failed to fetch unit detail:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUnit();
  }, [resolvedParams.id]);

  if (isLoading) {
    return <div className="overflow-hidden relative pt-[120px] pb-20 modern-section min-h-screen text-[#1F1F1F] dark:text-white text-center">
      <SectionStarryMotif position="random-corner" />Đang tải thông margin đơn vị...</div>;
  }

  if (!unit) {
    return <div className="pt-[120px] pb-20 modern-section min-h-screen text-[#1F1F1F] dark:text-white text-center">Không tìm thấy đơn vị.</div>;
  }

  return (
    <div className="pt-[120px] pb-20 modern-section min-h-screen text-[#1F1F1F] dark:text-white">
      {/* Local Background wrapper to fix flatness without touching global CSS */}
      <div className="absolute top-0 left-0 right-0 h-[600px] bg-[radial-gradient(circle_at_top_right,rgba(199,162,92,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_top_right,rgba(199,162,92,0.05),transparent_50%)] pointer-events-none z-0"></div>
      
      <div className="container mx-auto px-6 max-w-[1400px] relative z-10">
        {/* Section 1: Hero Section - Premium Visual Identity */}
        <div className="mb-16 pb-16 relative">
          
          <div className="flex flex-col md:flex-row gap-12 items-center md:items-start relative z-20">
            {/* Logo Glass Card */}
            <div className="w-full md:w-1/3 max-w-[320px] aspect-square rounded-2xl border border-[#C7A25C]/20 flex items-center justify-center p-10 bg-white/60 dark:bg-[#1A1C21]/60 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.4)] group overflow-hidden relative">
              {/* Subtle inner glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#C7A25C]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              {unit.avatarUrl ? (
                <img src={unit.avatarUrl} alt={unit.name} className="w-full h-full object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.05)] dark:drop-shadow-[0_10px_20px_rgba(255,255,255,0.05)] group-hover:scale-105 transition-transform duration-700 relative z-10" />
              ) : (
                <span className="text-7xl font-heading font-bold text-[#C7A25C] tracking-widest relative z-10">{unit.name.substring(0, 2).toUpperCase()}</span>
              )}
            </div>

            {/* Brand Content */}
            <div className="w-full md:w-2/3 pt-4 text-center md:text-left">
              <span className="inline-block border border-[#C7A25C]/40 bg-[#C7A25C]/10 text-[#C7A25C] text-[11px] font-bold px-4 py-1.5 rounded-[2px] uppercase tracking-widest mb-6 shadow-sm">
                Phân khúc {unit.category}
              </span>
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-[#1F1F1F] dark:text-white leading-tight tracking-tight drop-shadow-sm">{unit.name}</h1>
              
              {/* Premium Stats - Replacing the basic text grid */}
              <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-8">
                <div className="bg-white/50 dark:bg-[#1A1C21]/50 backdrop-blur-sm border border-[#ECE7DE] dark:border-white/10 px-5 py-3 rounded-[4px] flex items-center gap-3 shadow-sm">
                  <div className="w-8 h-8 rounded-full bg-[#C7A25C]/10 flex items-center justify-center text-[#C7A25C]"><i className="fa fa-star text-sm"></i></div>
                  <div>
                    <div className="text-sm font-bold text-[#1F1F1F] dark:text-white leading-none">4.9/5</div>
                    <div className="text-[#1F1F1F]/50 dark:text-white/50 text-[10px] uppercase tracking-widest mt-1">Đánh giá</div>
                  </div>
                </div>
                <div className="bg-white/50 dark:bg-[#1A1C21]/50 backdrop-blur-sm border border-[#ECE7DE] dark:border-white/10 px-5 py-3 rounded-[4px] flex items-center gap-3 shadow-sm">
                  <div className="w-8 h-8 rounded-full bg-[#C7A25C]/10 flex items-center justify-center text-[#C7A25C]"><i className="fa fa-briefcase text-sm"></i></div>
                  <div>
                    <div className="text-sm font-bold text-[#1F1F1F] dark:text-white leading-none">{unit.experience}</div>
                    <div className="text-[#1F1F1F]/50 dark:text-white/50 text-[10px] uppercase tracking-widest mt-1">Kinh nghiệm</div>
                  </div>
                </div>
                <div className="bg-white/50 dark:bg-[#1A1C21]/50 backdrop-blur-sm border border-[#ECE7DE] dark:border-white/10 px-5 py-3 rounded-[4px] flex items-center gap-3 shadow-sm">
                  <div className="w-8 h-8 rounded-full bg-[#C7A25C]/10 flex items-center justify-center text-[#C7A25C]"><i className="fa fa-map-marker-alt text-sm"></i></div>
                  <div>
                    <div className="text-sm font-bold text-[#1F1F1F] dark:text-white leading-none">{unit.location}</div>
                    <div className="text-[#1F1F1F]/50 dark:text-white/50 text-[10px] uppercase tracking-widest mt-1">Khu vực</div>
                  </div>
                </div>
              </div>

              <p className="text-[#1F1F1F]/70 dark:text-white/70 text-lg mb-10 leading-relaxed max-w-2xl font-medium">{unit.description}</p>

              {/* CTA Hierarchy */}
              <div className="flex flex-wrap justify-center md:justify-start items-center gap-4">
                {/* Primary Button */}
                <Link href={`/tu-van?unit=${unit.id}`} className="bg-gradient-to-r from-[#C7A25C] to-[#E5C98A] hover:from-[#b5924f] hover:to-[#d4ba7b] text-white font-bold py-4 px-10 rounded-[2px] transition-all uppercase tracking-wider text-sm flex items-center gap-3 shadow-[0_10px_20px_rgba(199,162,92,0.25)] hover:shadow-[0_10px_25px_rgba(199,162,92,0.4)] hover:-translate-y-1">
                  Kết nối với đơn vị này <i className="fa fa-arrow-right"></i>
                </Link>
                
                {/* Secondary Button */}
                <button className="bg-transparent border border-[#C7A25C] text-[#C7A25C] hover:bg-[#C7A25C] hover:text-white font-bold py-4 px-8 rounded-[2px] transition-all uppercase tracking-wider text-sm shadow-sm hover:shadow-md hover:-translate-y-1">
                  Yêu cầu báo giá
                </button>
                
                {/* Tertiary Links */}
                <div className="flex gap-4 ml-2">
                  {unit.profile && (
                    <a href={unit.profile.startsWith('http') ? unit.profile : `https://${unit.profile}`} target="_blank" rel="noreferrer" className="text-[#1F1F1F]/60 dark:text-white/60 hover:text-[#C7A25C] dark:hover:text-[#C7A25C] font-semibold transition-colors flex items-center gap-2 text-sm uppercase tracking-wide group">
                      <i className="fa fa-globe group-hover:rotate-12 transition-transform"></i>
                      <span className="border-b border-transparent group-hover:border-[#C7A25C]">Website</span>
                    </a>
                  )}
                  {unit.fanpage && (
                    <a href={unit.fanpage} target="_blank" rel="noreferrer" className="text-[#1F1F1F]/60 dark:text-white/60 hover:text-[#C7A25C] dark:hover:text-[#C7A25C] font-semibold transition-colors flex items-center gap-2 text-sm uppercase tracking-wide group">
                      <i className="fa fa-facebook-f group-hover:rotate-12 transition-transform"></i>
                      <span className="border-b border-transparent group-hover:border-[#C7A25C]">Fanpage</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Dịch vụ cung cấp */}
        <div className="mb-16">
          <h2 className="font-heading text-2xl font-bold mb-6 flex items-center gap-3">
            <span className="w-8 h-1 bg-[#C7A25C] inline-block"></span> Dịch vụ cung cấp
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {unit.services.map((svc: string, i: number) => (
              <div key={i} className="card dark:bg-[#1c1c1c] p-4 rounded-[4px] border border-[#ECE7DE] dark:border-white/5 flex items-center gap-3">
                <i className="fa fa-check-circle text-[#C7A25C]"></i>
                <span>{svc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Sản phẩm tiêu biểu */}
        <div className="mb-16">
          <h2 className="font-heading text-2xl font-bold mb-6 flex items-center gap-3">
            <span className="w-8 h-1 bg-[#C7A25C] inline-block"></span> Sản phẩm tiêu biểu
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {unit.projects.map((proj: any, i: number) => (
              <div key={i} className="card dark:bg-[#1c1c1c] rounded-[4px] overflow-hidden border border-[#ECE7DE] dark:border-white/5">
                <div className="h-48 bg-gray-200 dark:bg-white/5 luxury-image-filter"></div>
                <div className="p-6">
                  <h3 className="font-heading text-xl font-bold mb-4">{proj.name}</h3>
                  <div className="space-y-2 text-sm text-[#1F1F1F]/70 dark:text-white/70">
                    <p><strong className="text-[#1F1F1F] dark:text-white">Loại công trình:</strong> {proj.type}</p>
                    <p><strong className="text-[#1F1F1F] dark:text-white">Diện tích:</strong> {proj.area}</p>
                    <p><strong className="text-[#1F1F1F] dark:text-white">Phong cách:</strong> {proj.style}</p>
                    <p><strong className="text-[#1F1F1F] dark:text-white">Thời gian hoàn thiện:</strong> {proj.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4 & 5 & 6 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="card dark:bg-[#1c1c1c] p-6 rounded-[4px] border border-[#ECE7DE] dark:border-white/5">
            <h3 className="font-heading text-lg font-bold mb-4 text-[#C7A25C]">Điểm mạnh</h3>
            <ul className="space-y-3">
              {unit.advantages.map((adv: string, i: number) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <i className="fa fa-star mt-1 text-[#1F1F1F]/30 dark:text-white/30"></i> {adv}
                </li>
              ))}
            </ul>
          </div>
          <div className="card dark:bg-[#1c1c1c] p-6 rounded-[4px] border border-[#ECE7DE] dark:border-white/5">
            <h3 className="font-heading text-lg font-bold mb-4 text-[#C7A25C]">Mức ngân sách</h3>
            <div className="space-y-3 text-sm">
              <p><strong>Phù hợp với ngân sách:</strong><br />{unit.budget.range}</p>
              <p><strong>Dự án tối thiểu nhận triển khai:</strong><br />{unit.budget.min}</p>
              <p className="mt-4 pt-4 border-t border-[#ECE7DE] dark:border-white/10 text-[#1F1F1F]/50 dark:text-white/50 italic">* Điều kiện áp dụng chiết khấu 5% khi kết nối qua hệ sinh thái.</p>
            </div>
          </div>
          <div className="card dark:bg-[#1c1c1c] p-6 rounded-[4px] border border-[#ECE7DE] dark:border-white/5">
            <h3 className="font-heading text-lg font-bold mb-4 text-[#C7A25C]">Quy trình</h3>
            <ul className="space-y-2">
              {unit.workflow.map((step: string, i: number) => (
                <li key={i} className="flex items-center gap-3 text-sm">
                  <span className="w-5 h-5 rounded-full bg-[#1F1F1F]/10 dark:bg-white/10 flex items-center justify-center text-xs text-[#1F1F1F]/50 dark:text-white/50">{i + 1}</span> {step}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Section 7: CTA */}
        <div className="bg-gradient-to-r from-[#C7A25C]/10 to-transparent p-8 md:p-12 rounded-[4px] border border-[#C7A25C]/30 text-center">
          <h2 className="font-heading text-2xl md:text-3xl font-bold mb-4">Bạn muốn được tư vấn xem đơn vị này có phù hợp với công trình của mình không?</h2>
          <p className="text-[#1F1F1F]/70 dark:text-white/70 mb-8">Chúng tôi sẽ giúp bạn đánh giá và so sánh khách quan hoàn toàn miễn phí.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href={`/tu-van?unit=${unit.id}`} className="bg-[#1F1F1F] hover:modern-section dark:hover:bg-white dark:hover:text-white text-white font-bold py-3 px-8 rounded-[2px] transition-colors uppercase tracking-wider text-sm">
              Nhận tư vấn đơn vị này
            </Link>
            <Link href="/don-vi-thiet-ke" className="bg-transparent border border-[#ECE7DE] dark:border-white/30 hover:border-[#1F1F1F] dark:hover:border-white text-[#1F1F1F] dark:text-white font-bold py-3 px-8 rounded-[2px] transition-colors uppercase tracking-wider text-sm">
              So sánh với đơn vị khác
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
