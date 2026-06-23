'use client';
import SectionStarryMotif from './SectionStarryMotif';
import React, { useState } from 'react';
import Link from 'next/link';
import ScrollReveal from './ScrollReveal';

const PACKAGES = [
  {
    id: 1,
    title: 'Giám sát các hạng mục thiết yếu',
    position: 'Đây là nhóm hạng mục quan trọng, phù hợp với hầu hết công trình. Gói này giúp khách hàng kiểm tra các phần cơ bản nhưng dễ phát sinh lỗi trong quá trình thi công.',
    suitableFor: [
      'Chung cư',
      'Nhà phố',
      'Công trình cải tạo',
      'Khách hàng không có nhiều kinh nghiệm thi công',
      'Khách hàng bận, không thể theo sát công trình thường xuyên'
    ],
    scopeTitle: 'Hạng mục giám sát',
    scope: [
      'Kiểm tra hiện trạng trước thi công',
      'Kiểm tra kích thước, layout và mặt bằng thực tế',
      'Kiểm tra vật liệu đầu vào',
      'Kiểm tra hệ điện, nước cơ bản nếu liên quan đến nội thất',
      'Kiểm tra thi công đồ gỗ nội thất',
      'Kiểm tra độ hoàn thiện bề mặt',
      'Kiểm tra tiến độ theo từng giai đoạn',
      'Hỗ trợ nghiệm thu các hạng mục chính',
      'Ghi nhận lỗi và yêu cầu chỉnh sửa trước bàn giao'
    ],
    value: [
      'Hạn chế lỗi thi công cơ bản',
      'Giúp khách hàng yên tâm hơn',
      'Có thêm bên kiểm tra độc lập',
      'Giảm rủi ro khi nghiệm thu',
      'Phù hợp với công trình vừa và nhỏ'
    ],
    img: '/images/team/member-1.jpg'
  },
  {
    id: 2,
    title: 'Quản lý toàn bộ dự án thi công',
    position: 'Đây là gói cao cấp dành cho khách hàng muốn có một bên đồng hành và quản lý toàn bộ quá trình thi công từ đầu đến cuối.',
    suitableFor: [
      'Villa',
      'Biệt thự',
      'Penthouse',
      'Nhà phố cao cấp',
      'Công trình nhiều hạng mục',
      'Công trình có nhiều nhà thầu phụ',
      'Chủ nhà bận, không có thời gian quản lý dự án'
    ],
    scopeTitle: 'Phạm vi quản lý',
    scope: [
      'Lập kế hoạch triển khai tổng thể',
      'Theo dõi tiến độ thi công',
      'Điều phối giữa các bên liên quan',
      'Kiểm tra vật liệu, thiết bị và hạng mục hoàn thiện',
      'Quản lý các mốc nghiệm thu',
      'Theo dõi phát sinh và khối lượng thi công',
      'Làm việc với đơn vị thiết kế, thi công và nhà cung cấp',
      'Báo cáo định kỳ cho khách hàng',
      'Hỗ trợ nghiệm thu, bàn giao và xử lý lỗi sau bàn giao'
    ],
    value: [
      'Giảm tải việc quản lý công trình cho khách hàng',
      'Kiểm soát tiến độ và chất lượng tốt hơn',
      'Hạn chế phát sinh không rõ ràng',
      'Đảm bảo công trình triển khai đồng bộ',
      'Phù hợp với dự án có ngân sách lớn và yêu cầu hoàn thiện cao'
    ],
    img: '/images/team/member-2.jpg'
  }
];

function DetailList({ title, items }: { title: string, items: string[] }) {
  return (
    <div className="mb-8">
      <h4 className="text-[#1F1F1F] dark:text-white font-bold text-[16px] mb-4 flex items-center gap-2">
        <div className="w-1.5 h-4 bg-[#C7A25C]"></div>
        {title}
      </h4>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
        {items.map((item, index) => (
          <li key={index} className="flex items-start gap-2">
            <svg className="w-4 h-4 text-[#C7A25C] shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            <span className="text-gray-600 dark:text-[#999] text-[14px] leading-relaxed">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Section8Supervision() {
  const [activeTab, setActiveTab] = useState(PACKAGES[0]);

  return (
    <section id="Supervision" className="relative py-32 bg-transparent dark:bg-transparent overflow-hidden border-t border-[#ECE7DE] dark:border-white/5">
      <SectionStarryMotif />
      <div className="max-w-[1400px] mx-auto px-6">
        
        {/* Section Header */}
        <ScrollReveal animation="fade-up" delay={100}>
          <div className="text-center mb-16">
            <h6 className="font-label text-[#C7A25C] text-[13px] font-semibold tracking-[4px] uppercase mb-4">
              Dịch Vụ Bổ Sung
            </h6>
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-[#1F1F1F] dark:text-white mb-6 leading-tight max-w-4xl mx-auto">
              Có thêm dịch vụ <span className="text-[#C7A25C]">giám sát thi công</span> để kiểm soát chất lượng và tiến độ
            </h2>
            <div className="w-16 h-[2px] bg-[#C7A25C] mx-auto mb-6" />
            <p className="text-gray-600 dark:text-[#999] max-w-3xl mx-auto leading-relaxed text-[15px] md:text-[16px]">
              Thi công nội thất là giai đoạn dễ phát sinh sai lệch giữa thiết kế và thực tế. Nếu khách hàng không có chuyên môn hoặc không có thời gian theo sát công trình, dịch vụ giám sát thi công sẽ giúp kiểm tra các hạng mục quan trọng, hạn chế lỗi và hỗ trợ nghiệm thu rõ ràng hơn.
            </p>
          </div>
        </ScrollReveal>

        {/* Custom Tabs */}
        <ScrollReveal animation="fade-up" delay={200}>
          <div className="flex flex-col md:flex-row justify-center gap-4 mb-10">
            {PACKAGES.map(pkg => (
              <button
                key={pkg.id}
                onClick={() => setActiveTab(pkg)}
                className={`px-8 py-4  font-bold text-[14px] uppercase tracking-wider transition-all duration-300 border-b-2 md:border-b-0 md:border-l-2 ${
                  activeTab.id === pkg.id 
                    ? 'border-[#C7A25C] bg-[#C7A25C]/10 text-[#C7A25C]' 
                    : 'border-[#ECE7DE] dark:border-white/10 text-[#1F1F1F]/50 dark:text-white/50 hover:text-[#1F1F1F] dark:text-white hover:bg-white/5'
                }`}
              >
                {pkg.title}
              </button>
            ))}
          </div>
        </ScrollReveal>

        {/* Tab Content */}
        <ScrollReveal animation="fade-up" delay={300}>
          <div className="card dark:bg-[#1a1a1a] border border-[#ECE7DE] dark:border-white/5 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-3">
              
              {/* Image Column */}
              <div className="lg:col-span-1 relative h-64 lg:h-auto">
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
                  style={{ backgroundImage: `url(${activeTab.img})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#FFFFFF]/50 dark:from-black/50 to-transparent" />
              </div>

              {/* Info Column */}
              <div className="lg:col-span-2 p-8 md:p-12">
                <h3 className="font-heading text-2xl md:text-3xl font-bold text-[#C7A25C] mb-4">
                  {activeTab.title}
                </h3>
                <p className="text-gray-600 dark:text-[#e2e2e2] text-[15px] leading-relaxed mb-8 border-b border-[#ECE7DE] dark:border-white/10 pb-8">
                  {activeTab.position}
                </p>

                <DetailList title="Phù hợp với" items={activeTab.suitableFor} />
                <DetailList title={activeTab.scopeTitle} items={activeTab.scope} />
                <DetailList title="Giá trị mang lại" items={activeTab.value} />

                <div className="mt-10 pt-8 border-t border-[#ECE7DE] dark:border-white/10">
                  <Link 
                    href="#Form" 
                    className="inline-flex items-center justify-center px-8 py-4 border-2 border-[#C7A25C] bg-transparent text-[#1F1F1F] dark:text-white uppercase tracking-wider text-[13px] font-bold hover:bg-[#C7A25C] transition-colors"
                  >
                    Đăng ký tư vấn gói này
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </ScrollReveal>

      </div>
    </section>
  );
}
