'use client';
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
    return <div className="pt-[120px] pb-20 modern-section min-h-screen text-[#1F1F1F] dark:text-white text-center">Đang tải thông margin đơn vị...</div>;
  }

  if (!unit) {
    return <div className="pt-[120px] pb-20 modern-section min-h-screen text-[#1F1F1F] dark:text-white text-center">Không tìm thấy đơn vị.</div>;
  }

  return (
    <div className="pt-[120px] pb-20 modern-section min-h-screen text-[#1F1F1F] dark:text-white">
      <div className="container mx-auto px-6 max-w-[1400px]">
        {/* Section 1: Tổng quan đơn vị */}
        <div className="mb-16 pb-12 border-b border-[#ECE7DE] dark:border-white/10">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-full md:w-1/3 aspect-square card dark:bg-[#1c1c1c] rounded-[4px] border border-[#ECE7DE] dark:border-white/10 flex items-center justify-center p-8 bg-white overflow-hidden shadow-sm">
              {unit.avatarUrl ? (
                <img src={unit.avatarUrl} alt={unit.name} className="w-full h-full object-contain" />
              ) : (
                <span className="text-6xl text-[#1F1F1F]/20 dark:text-white/20 font-bold uppercase">{unit.name.substring(0, 2)}</span>
              )}
            </div>
            <div className="w-full md:w-2/3">
              <span className="inline-block modern-section text-white text-xs font-bold px-3 py-1 rounded-[2px] uppercase tracking-wider mb-4">
                Phân khúc {unit.category}
              </span>
              <h1 className="font-heading text-4xl font-bold mb-4">{unit.name}</h1>
              <p className="text-[#1F1F1F]/70 dark:text-white/70 text-lg mb-8 leading-relaxed">{unit.description}</p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div>
                  <p className="text-[#1F1F1F]/50 dark:text-white/50 text-sm mb-1">Khu vực hoạt động</p>
                  <p className="font-semibold">{unit.location}</p>
                </div>
                <div>
                  <p className="text-[#1F1F1F]/50 dark:text-white/50 text-sm mb-1">Kinh nghiệm</p>
                  <p className="font-semibold">{unit.experience}</p>
                </div>
                <div>
                  <p className="text-[#1F1F1F]/50 dark:text-white/50 text-sm mb-1">Loại công trình thế mạnh</p>
                  <p className="font-semibold">{unit.strengths}</p>
                </div>
                <div>
                  <p className="text-[#1F1F1F]/50 dark:text-white/50 text-sm mb-1">Phong cách chủ đạo</p>
                  <p className="font-semibold">{unit.style}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <Link href={`/tu-van?unit=${unit.id}`} className="bg-[#1F1F1F] hover:modern-section dark:hover:bg-white dark:hover:text-white text-white font-bold py-3 px-8 rounded-[2px] transition-colors uppercase tracking-wider text-sm">
                  Kết nối với đơn vị này
                </Link>
                <button className="bg-transparent border border-[#ECE7DE] dark:border-white/30 hover:border-[#1F1F1F] dark:hover:border-white text-[#1F1F1F] dark:text-white font-bold py-3 px-8 rounded-[2px] transition-colors uppercase tracking-wider text-sm">
                  Yêu cầu báo giá sơ bộ
                </button>
                {unit.profile && (
                  <a href={unit.profile} target="_blank" rel="noreferrer" className="bg-[#C7A25C] hover:bg-[#b08e4f] text-white font-bold py-3 px-8 rounded-[2px] transition-colors uppercase tracking-wider text-sm flex items-center gap-2">
                    <i className="fa fa-download"></i> Tải Hồ sơ năng lực
                  </a>
                )}
                {unit.fanpage && (
                  <a href={unit.fanpage} target="_blank" rel="noreferrer" className="bg-[#3b5998] hover:bg-[#2d4373] text-white font-bold py-3 px-6 rounded-[2px] transition-colors uppercase tracking-wider text-sm flex items-center gap-2">
                    <i className="fa fa-facebook-f"></i> Fanpage
                  </a>
                )}
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
