'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export default function UnitDetailPage({ params }: { params: { id: string } }) {
  const [unit, setUnit] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUnit = async () => {
      try {
        const res = await fetch('/api/units');
        const data = await res.json();
        if (Array.isArray(data)) {
          const found = data.find((u: any) => u.id.toString() === params.id.toString());
          if (found) {
            setUnit({
              id: found.id,
              name: found.name,
              category: found.segment || 'Cơ bản',
              strengths: found.strengths?.join(', ') || 'Chung cư, Nhà phố',
              style: found.styles?.join(', ') || 'Hiện đại',
              location: found.locations?.join(', ') || 'Toàn quốc',
              experience: '5 năm',
              description: found.description || 'Chuyên thiết kế và thi công nội thất chuyên nghiệp.',
              services: [
                'Thiết kế nội thất',
                'Thi công nội thất',
                'Thiết kế & thi công trọn gói'
              ],
              projects: [
                { name: 'Dự án tiêu biểu 1', type: 'Chung cư', area: '75m2', style: 'Hiện đại', time: '30 ngày' },
                { name: 'Dự án tiêu biểu 2', type: 'Nhà phố', area: '250m2', style: 'Tối giản', time: '45 ngày' }
              ],
              advantages: found.strengths || ['Mạnh về tối ưu chi phí'],
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
                range: '150 triệu - 500 triệu',
                min: '100 triệu'
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
  }, [params.id]);

  if (isLoading) {
    return <div className="pt-[120px] pb-20 bg-[#131313] min-h-screen text-white text-center">Đang tải thông tin đơn vị...</div>;
  }

  if (!unit) {
    return <div className="pt-[120px] pb-20 bg-[#131313] min-h-screen text-white text-center">Không tìm thấy đơn vị.</div>;
  }

  return (
    <div className="pt-[120px] pb-20 bg-[#131313] min-h-screen text-white">
      <div className="container mx-auto px-6 max-w-[1000px]">
        {/* Section 1: Tổng quan đơn vị */}
        <div className="mb-16 pb-12 border-b border-white/10">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-full md:w-1/3 aspect-square bg-[#1c1c1c] rounded-lg border border-white/10 flex items-center justify-center">
              <span className="text-4xl text-white/20 font-bold uppercase">{unit.name.substring(0, 2)}</span>
            </div>
            <div className="w-full md:w-2/3">
              <span className="inline-block bg-[#ce9e51] text-white text-xs font-bold px-3 py-1 rounded uppercase tracking-wider mb-4">
                Phân khúc {unit.category}
              </span>
              <h1 className="text-4xl font-['Montserrat',_sans-serif] font-bold mb-4">{unit.name}</h1>
              <p className="text-white/70 text-lg mb-8 leading-relaxed">{unit.description}</p>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div>
                  <p className="text-white/50 text-sm mb-1">Khu vực hoạt động</p>
                  <p className="font-semibold">{unit.location}</p>
                </div>
                <div>
                  <p className="text-white/50 text-sm mb-1">Kinh nghiệm</p>
                  <p className="font-semibold">{unit.experience}</p>
                </div>
                <div>
                  <p className="text-white/50 text-sm mb-1">Loại công trình thế mạnh</p>
                  <p className="font-semibold">{unit.strengths}</p>
                </div>
                <div>
                  <p className="text-white/50 text-sm mb-1">Phong cách chủ đạo</p>
                  <p className="font-semibold">{unit.style}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <Link href={`/tu-van?unit=${unit.id}`} className="bg-[#ce9e51] hover:bg-white hover:text-[#131313] text-white font-bold py-3 px-8 rounded transition-colors uppercase tracking-wider text-sm">
                  Kết nối với đơn vị này
                </Link>
                <button className="bg-transparent border border-white/30 hover:border-white text-white font-bold py-3 px-8 rounded transition-colors uppercase tracking-wider text-sm">
                  Yêu cầu báo giá sơ bộ
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Dịch vụ cung cấp */}
        <div className="mb-16">
          <h2 className="text-2xl font-['Montserrat',_sans-serif] font-bold mb-6 flex items-center gap-3">
            <span className="w-8 h-1 bg-[#ce9e51] inline-block"></span> Dịch vụ cung cấp
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {unit.services.map((svc: string, i: number) => (
              <div key={i} className="bg-[#1c1c1c] p-4 rounded border border-white/5 flex items-center gap-3">
                <i className="fa fa-check-circle text-[#ce9e51]"></i>
                <span>{svc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Công trình tiêu biểu */}
        <div className="mb-16">
          <h2 className="text-2xl font-['Montserrat',_sans-serif] font-bold mb-6 flex items-center gap-3">
            <span className="w-8 h-1 bg-[#ce9e51] inline-block"></span> Công trình tiêu biểu
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {unit.projects.map((proj: any, i: number) => (
              <div key={i} className="bg-[#1c1c1c] rounded-lg overflow-hidden border border-white/5">
                <div className="h-48 bg-white/5"></div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-4">{proj.name}</h3>
                  <div className="space-y-2 text-sm text-white/70">
                    <p><strong className="text-white">Loại công trình:</strong> {proj.type}</p>
                    <p><strong className="text-white">Diện tích:</strong> {proj.area}</p>
                    <p><strong className="text-white">Phong cách:</strong> {proj.style}</p>
                    <p><strong className="text-white">Thời gian hoàn thiện:</strong> {proj.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4 & 5 & 6 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-[#1c1c1c] p-6 rounded-lg border border-white/5">
            <h3 className="text-lg font-bold mb-4 text-[#ce9e51]">Điểm mạnh</h3>
            <ul className="space-y-3">
              {unit.advantages.map((adv: string, i: number) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <i className="fa fa-star mt-1 text-white/30"></i> {adv}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-[#1c1c1c] p-6 rounded-lg border border-white/5">
            <h3 className="text-lg font-bold mb-4 text-[#ce9e51]">Mức ngân sách</h3>
            <div className="space-y-3 text-sm">
              <p><strong>Phù hợp với ngân sách:</strong><br/>{unit.budget.range}</p>
              <p><strong>Dự án tối thiểu nhận triển khai:</strong><br/>{unit.budget.min}</p>
              <p className="mt-4 pt-4 border-t border-white/10 text-white/50 italic">* Điều kiện áp dụng chiết khấu 5% khi kết nối qua hệ sinh thái.</p>
            </div>
          </div>
          <div className="bg-[#1c1c1c] p-6 rounded-lg border border-white/5">
            <h3 className="text-lg font-bold mb-4 text-[#ce9e51]">Quy trình</h3>
            <ul className="space-y-2">
              {unit.workflow.map((step: string, i: number) => (
                <li key={i} className="flex items-center gap-3 text-sm">
                  <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-xs text-white/50">{i + 1}</span> {step}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Section 7: CTA */}
        <div className="bg-gradient-to-r from-[#ce9e51]/20 to-transparent p-8 md:p-12 rounded-2xl border border-[#ce9e51]/30 text-center">
          <h2 className="text-2xl md:text-3xl font-['Montserrat',_sans-serif] font-bold mb-4">Bạn muốn được tư vấn xem đơn vị này có phù hợp với công trình của mình không?</h2>
          <p className="text-white/70 mb-8">Chúng tôi sẽ giúp bạn đánh giá và so sánh khách quan hoàn toàn miễn phí.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href={`/tu-van?unit=${unit.id}`} className="bg-[#ce9e51] hover:bg-white hover:text-[#131313] text-white font-bold py-3 px-8 rounded transition-colors uppercase tracking-wider text-sm">
              Nhận tư vấn đơn vị này
            </Link>
            <Link href="/he-sinh-thai" className="bg-transparent border border-white/30 hover:border-white text-white font-bold py-3 px-8 rounded transition-colors uppercase tracking-wider text-sm">
              So sánh với đơn vị khác
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
