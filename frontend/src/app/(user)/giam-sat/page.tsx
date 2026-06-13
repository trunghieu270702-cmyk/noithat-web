'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export default function GiamSatPage() {
  const [packages, setPackages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSupervisions = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'}/supervisions`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setPackages(data.filter((p: any) => p.status === 'PUBLISHED' || p.status === 'ACTIVE' || !p.status || p.status === 'Hoạt động'));
        }
      } catch (error) {
        console.error('Failed to fetch supervisions:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSupervisions();
  }, []);

  return (
    <div className="pt-[120px] pb-20 modern-section min-h-screen text-gray-900 dark:text-white">
      <div className="container mx-auto px-6 max-w-[1400px]">
        {/* Header */}
        <div className="text-center mb-20 max-w-4xl mx-auto">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">Dịch vụ giám sát thi công nội thất</h1>
          <p className="text-gray-600 dark:text-white/70 text-lg">Giúp khách hàng kiểm soát chất lượng, tiến độ và rủi ro. Dành cho khách hàng muốn có thêm một bên độc lập hỗ trợ kiểm tra quá trình thi công, hạn chế lỗi phát sinh và đảm bảo công trình được triển khai đúng theo kế hoạch.</p>
        </div>

        {/* Dynamic Packages */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {isLoading ? (
            <div className="col-span-2 text-center text-gray-400 dark:text-white/50">Đang tải các gói dịch vụ...</div>
          ) : packages.length > 0 ? packages.map((pkg, idx) => (
            <div key={pkg.id} className={`rounded-[4px] border p-8 flex flex-col relative overflow-hidden transition-colors ${idx % 2 !== 0 ? 'bg-gradient-to-b from-[#ce9e51]/10 to-[#1c1c1c] border-[#ce9e51]/30 hover:border-[#ce9e51]' : 'modern-section shadow-sm dark:shadow-none border-gray-200 dark:border-white/10 hover:border-[#ce9e51]/50'}`}>
              {idx % 2 !== 0 && (
                <div className="absolute top-0 right-0 bg-[#ce9e51] text-gray-900 dark:text-white text-xs font-bold px-4 py-1 rounded-bl-lg uppercase tracking-wider">
                  Khuyên dùng
                </div>
              )}
              <div className="mb-6 pb-6 border-b border-gray-200 dark:border-white/10 mt-2">
                <h2 className="font-heading text-2xl font-bold mb-3 text-[#ce9e51]">{pkg.packageName}</h2>
                <p className="text-gray-600 dark:text-white/70 text-sm">{pkg.shortDescription || 'Mô tả ngắn gọn về dịch vụ.'}</p>
              </div>

              <div className="mb-8 flex-1">
                <h3 className="font-heading font-bold mb-4">Phù hợp với:</h3>
                <ul className="space-y-2 text-sm text-gray-700 dark:text-white/80 mb-8">
                  {(pkg.targetAudience?.split('\n') || ['Khách hàng cá nhân']).map((item: string, i: number) => (
                    <li key={i}><i className="fa fa-check text-[#ce9e51] w-5"></i> {item}</li>
                  ))}
                </ul>

                <h3 className="font-heading font-bold mb-4">Phạm vi công việc:</h3>
                <ul className="space-y-2 text-sm text-gray-700 dark:text-white/80">
                  {(pkg.scopeOfWork?.split('\n') || ['Giám sát thi công nội thất']).map((item: string, i: number) => (
                    <li key={i}><i className="fa fa-arrow-right text-gray-300 dark:text-white/30 w-5"></i> {item}</li>
                  ))}
                </ul>
              </div>

              <Link href={`/tu-van?service=${pkg.packageName}`} className={`text-center block w-full font-bold py-4 px-6 rounded-[4px] transition-colors uppercase tracking-wider text-sm ${idx % 2 !== 0 ? 'bg-[#ce9e51] hover:bg-white hover:text-[#131313] text-gray-900 dark:text-white' : 'bg-gray-100 dark:bg-white/10 hover:bg-[#ce9e51] text-gray-900 dark:text-white'}`}>
                Đăng ký tư vấn
              </Link>
            </div>
          )) : (
            <div className="col-span-2 text-center text-gray-400 dark:text-white/50">Hiện tại chưa có gói dịch vụ nào.</div>
          )}
        </div>


        {/* Values */}
        <div className="modern-section shadow-sm dark:shadow-none rounded-[4px] p-10 border border-gray-200 dark:border-white/5 text-center">
          <h2 className="font-heading text-2xl font-bold mb-10 text-gray-900 dark:text-white">Giá trị mang lại cho khách hàng</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <div className="w-16 h-16 rounded-full bg-[#ce9e51]/10 text-[#ce9e51] flex items-center justify-center text-2xl mx-auto mb-4">
                <i className="fa fa-shield-alt"></i>
              </div>
              <p className="font-semibold text-sm">Hạn chế lỗi thi công<br />& rủi ro nghiệm thu</p>
            </div>
            <div>
              <div className="w-16 h-16 rounded-full bg-[#ce9e51]/10 text-[#ce9e51] flex items-center justify-center text-2xl mx-auto mb-4">
                <i className="fa fa-heart"></i>
              </div>
              <p className="font-semibold text-sm">Yên tâm hơn nhờ<br />bên kiểm tra độc lập</p>
            </div>
            <div>
              <div className="w-16 h-16 rounded-full bg-[#ce9e51]/10 text-[#ce9e51] flex items-center justify-center text-2xl mx-auto mb-4">
                <i className="fa fa-clock"></i>
              </div>
              <p className="font-semibold text-sm">Giảm tải việc quản lý<br />& tối ưu thời gian</p>
            </div>
            <div>
              <div className="w-16 h-16 rounded-full bg-[#ce9e51]/10 text-[#ce9e51] flex items-center justify-center text-2xl mx-auto mb-4">
                <i className="fa fa-cogs"></i>
              </div>
              <p className="font-semibold text-sm">Đảm bảo công trình<br />triển khai đồng bộ</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
