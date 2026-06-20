'use client';
import React, { useState } from 'react';
import ScrollReveal from './ScrollReveal';
import SpotlightCard from './SpotlightCard';
import ArchitecturalAccent from './ArchitecturalAccent';

const BENEFITS = [
  {
    id: 1,
    tabLabel: '1. Không phải tự mò đơn vị',
    title: 'Không phải tự mò giữa quá nhiều đơn vị ngoài thị trường',
    desc: 'Khách hàng không cần tự tìm từng đơn vị, tự hỏi từng bên và tự đánh giá chất lượng. Hệ sinh thái đã có sẵn hơn 30 đơn vị được phân loại rõ ràng.',
    values: [
      'Tiết kiệm thời gian tìm kiếm',
      'Không bị rối giữa quá nhiều lựa chọn',
      'Có nhóm đơn vị phù hợp ngay từ đầu',
      'Giảm rủi ro chọn nhầm đơn vị'
    ]
  },
  {
    id: 2,
    tabLabel: '2. Chọn đúng đơn vị',
    title: 'Chọn đúng đơn vị theo loại công trình',
    desc: 'Mỗi loại công trình cần một năng lực khác nhau. Chung cư, nhà phố, villa, biệt thự, penthouse hay showroom đều có tiêu chuẩn thiết kế và thi công riêng.',
    values: [
      'Chọn đúng đơn vị theo loại công trình',
      'Không chọn theo cảm tính',
      'Không chọn đơn vị vượt quá hoặc thấp hơn nhu cầu',
      'Tăng khả năng công trình đạt đúng kỳ vọng'
    ]
  },
  {
    id: 3,
    tabLabel: '3. Dễ so sánh năng lực',
    title: 'Dễ so sánh năng lực giữa các đơn vị',
    desc: 'Mỗi đơn vị trong hệ sinh thái có hồ sơ rõ ràng về phân khúc, dịch vụ, dự án đã làm, thế mạnh và phong cách thiết kế.',
    values: [
      'Xem thông tin minh bạch hơn',
      'Dễ so sánh giữa các đơn vị cùng phân khúc',
      'Hiểu rõ đơn vị nào mạnh về thiết kế, đơn vị nào mạnh về thi công',
      'Hạn chế quyết định chỉ dựa trên hình ảnh đẹp hoặc lời tư vấn ban đầu'
    ]
  },
  {
    id: 4,
    tabLabel: '4. Tối ưu tổng chi phí',
    title: 'Tối ưu tổng chi phí, không chỉ giảm giá',
    desc: 'Khách hàng không chỉ được chiết khấu 5%, mà còn được định hướng chọn đơn vị phù hợp với ngân sách. Điều này giúp hạn chế phát sinh do chọn sai đơn vị, sai vật liệu hoặc sai phạm vi thi công.',
    values: [
      'Được chiết khấu 5% so với làm trực tiếp',
      'Tránh chọn sai đơn vị gây phát sinh chi phí',
      'Được định hướng phân khúc phù hợp với ngân sách',
      'Hạn chế lãng phí vào hạng mục không cần thiết',
      'Tối ưu tổng chi phí triển khai'
    ]
  },
  {
    id: 5,
    tabLabel: '5. Kiểm soát chất lượng',
    title: 'Có thêm lớp kiểm soát chất lượng',
    desc: 'Nếu khách hàng cần, website cung cấp thêm dịch vụ giám sát thi công để kiểm tra vật liệu, tiến độ, chất lượng và các hạng mục nghiệm thu.',
    values: [
      'Có thêm bên kiểm tra độc lập',
      'Giảm rủi ro thi công sai thiết kế',
      'Kiểm soát vật liệu và chất lượng tốt hơn',
      'Hỗ trợ nghiệm thu từng giai đoạn',
      'Phù hợp với khách hàng bận hoặc không có kinh nghiệm thi công'
    ]
  },
  {
    id: 6,
    tabLabel: '6. Giảm tải cho chủ nhà',
    title: 'Giảm tải cho chủ nhà',
    desc: 'Khách hàng không phải tự xử lý tất cả mọi việc. Từ bước định hướng đơn vị phù hợp đến giám sát thi công, khách hàng có thêm một bên đồng hành để quá trình triển khai rõ ràng và an toàn hơn.',
    values: [
      'Quy trình làm việc rõ ràng hơn',
      'Giảm thời gian làm việc với nhiều bên',
      'Có người hỗ trợ khi phát sinh vấn đề',
      'Giảm áp lực trong quá trình thi công',
      'Phù hợp với chủ nhà bận rộn hoặc công trình lớn'
    ]
  }
];

export default function Section4Benefits() {
  const [activeTab, setActiveTab] = useState(BENEFITS[0]);

  return (
    <section className="relative py-32 bg-transparent dark:bg-transparent modern-section overflow-hidden">
      <ArchitecturalAccent variant="overlapping-rectangles" className="top-10 left-10 w-56 h-56 opacity-50" />
      
      <div className="relative z-10 max-w-[1400px] mx-auto px-6">
        
        {/* Section Header */}
        <ScrollReveal animation="fade-up" delay={100}>
          <div className="text-center mb-16">
            <h6 className="font-label text-[#C7A25C] text-[13px] font-semibold tracking-[4px] uppercase mb-4">
              Lợi Ích Nổi Bật
            </h6>
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-[#1F1F1F] dark:text-white mb-6 leading-tight max-w-4xl mx-auto">
              Không chỉ tiết kiệm 5% — quan trọng hơn là <span className="text-[#C7A25C]">chọn đúng đơn vị</span> và kiểm soát được rủi ro thi công
            </h2>
            <div className="w-16 h-[2px] bg-[#C7A25C] mx-auto mb-6" />
            <p className="text-gray-600 dark:text-[#999] max-w-3xl mx-auto leading-relaxed text-[15px] md:text-[16px]">
              Chiết khấu 5% chỉ là một phần lợi ích. Giá trị lớn hơn là khách hàng được hỗ trợ trong toàn bộ quá trình lựa chọn đơn vị, định hướng ngân sách, kiểm soát rủi ro và giám sát quá trình triển khai.
            </p>
          </div>
        </ScrollReveal>

        {/* Vertical Tabs Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 mt-16">
          
          {/* Tabs Menu */}
          <div className="md:col-span-4 lg:col-span-4 flex flex-col gap-2">
            <ScrollReveal animation="fade-right" delay={200}>
              {BENEFITS.map((benefit) => {
                const isActive = activeTab.id === benefit.id;
                return (
                  <button
                    key={benefit.id}
                    onClick={() => setActiveTab(benefit)}
                    className={`w-full text-left px-6 py-5  font-bold text-[14px] uppercase tracking-wider transition-all duration-300 border-l-4 ${
                      isActive 
                        ? 'border-[#C7A25C] bg-white dark:bg-[#1a1a1a] text-[#C7A25C]' 
                        : 'border-transparent text-gray-500 dark:text-[#888] hover:bg-white dark:hover:bg-[#131313] hover:text-[#1F1F1F] dark:hover:text-white hover:border-[#ECE7DE] dark:hover:border-white/20'
                    }`}
                  >
                    {benefit.tabLabel}
                  </button>
                );
              })}
            </ScrollReveal>
          </div>

          {/* Tab Content */}
          <div className="md:col-span-8 lg:col-span-8">
            <ScrollReveal animation="fade-left" delay={300} className="h-full">
              <SpotlightCard className="p-8 lg:p-12 h-full">
                
                {/* Decorative BG Icon */}
                <div className="absolute -right-10 -bottom-10 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all duration-700 pointer-events-none">
                  <div className="text-[200px] font-bold text-[#1F1F1F] dark:text-white leading-none">{activeTab.id}</div>
                </div>

                <div className="relative z-10">
                  <h3 className="font-heading text-2xl lg:text-3xl font-bold text-[#1F1F1F] dark:text-white mb-4 leading-snug">
                    {activeTab.title}
                  </h3>
                  <p className="text-gray-600 dark:text-[#999] leading-[1.8] text-[15px] mb-8 pb-8 border-b border-[#ECE7DE] dark:border-white/10">
                    {activeTab.desc}
                  </p>

                  <h4 className="text-[#C7A25C] font-bold text-lg mb-6 uppercase tracking-wider">
                    Giá trị nhận được
                  </h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                    {activeTab.values.map((value, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-[#C7A25C] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        <span className="text-[#1F1F1F]/80 dark:text-white/80 text-[15px] leading-relaxed">
                          {value}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </SpotlightCard>
            </ScrollReveal>
          </div>

        </div>

      </div>
    </section>
  );
}
