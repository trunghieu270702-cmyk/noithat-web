'use client';
import React, { useState } from 'react';
import ScrollReveal from './ScrollReveal';
import Link from 'next/link';
import SpotlightCard from './SpotlightCard';

const TIERS = [
  {
    title: 'Phân khúc cơ bản',
    target: [
      'Chung cư phổ thông',
      'Nhà phố ngân sách vừa phải',
      'Công trình cần tối ưu chi phí',
      'Khách hàng cần hoàn thiện nhanh, gọn, đủ công năng'
    ],
    features: [
      'Chi phí hợp lý',
      'Thiết kế thực tế, dễ triển khai',
      'Tập trung vào công năng sử dụng',
      'Phù hợp với nhu cầu hoàn thiện nội thất cơ bản',
      'Dễ kiểm soát ngân sách'
    ],
    services: [
      'Thiết kế mặt bằng công năng',
      'Thiết kế 3D cơ bản',
      'Thi công nội thất gỗ công nghiệp',
      'Hoàn thiện phòng khách, phòng ngủ, bếp, tủ đồ',
      'Tư vấn vật liệu theo ngân sách'
    ],
    highlight: false
  },
  {
    title: 'Phân khúc trung cấp',
    target: [
      'Chung cư cao cấp',
      'Nhà phố cần thiết kế đồng bộ',
      'Văn phòng, Showroom, Cửa hàng',
      'Công trình cần cân bằng giữa thẩm mỹ, công năng và chi phí'
    ],
    features: [
      'Thiết kế có phong cách rõ hơn',
      'Tối ưu công năng, ánh sáng và vật liệu',
      'Thi công trọn gói chỉn chu',
      'Có khả năng cá nhân hóa không gian',
      'Phù hợp với khách hàng muốn không gian đẹp, đồng bộ và thực tế'
    ],
    services: [
      'Thiết kế concept',
      'Thiết kế 3D chi tiết',
      'Thi công nội thất trọn gói',
      'Tư vấn vật liệu hoàn thiện',
      'Tối ưu ánh sáng, màu sắc và layout',
      'Bảo hành, bảo trì sau thi công'
    ],
    highlight: true
  },
  {
    title: 'Phân khúc cao cấp',
    target: [
      'Villa, Biệt thự, Penthouse',
      'Nhà phố cao cấp',
      'Công trình nghỉ dưỡng',
      'Văn phòng điều hành, Showroom cao cấp'
    ],
    features: [
      'Thiết kế cá nhân hóa cao',
      'Xử lý tốt công trình phức tạp',
      'Chú trọng vật liệu, ánh sáng, decor và độ hoàn thiện',
      'Có năng lực quản lý thi công chuyên sâu hơn',
      'Phù hợp với dự án ngân sách lớn và tiêu chuẩn cao'
    ],
    services: [
      'Thiết kế kiến trúc – nội thất đồng bộ',
      'Thiết kế concept cao cấp',
      'Thi công trọn gói theo tiêu chuẩn riêng',
      'Tư vấn vật liệu, ánh sáng, nội thất rời, thiết bị cao cấp',
      'Điều phối các hạng mục hoàn thiện',
      'Bàn giao công trình theo tiêu chuẩn cao'
    ],
    highlight: false
  }
];

function CheckList({ items, title }: { items: string[], title: string }) {
  return (
    <div className="mb-8">
      <h4 className="text-[#C7A25C] font-bold text-[13px] uppercase tracking-wider mb-4 border-b border-[#ECE7DE] dark:border-white/10 pb-2">
        {title}
      </h4>
      <ul className="flex flex-col gap-3">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2">
            <svg className="w-4 h-4 text-[#1F1F1F]/50 dark:text-white/50 shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            <span className="text-gray-600 dark:text-[#999] text-[14px] leading-relaxed">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Section6Ecosystem() {
  return (
    <section id="Ecosystem" className="relative py-32 bg-transparent dark:bg-transparent overflow-hidden">
      <div className="relative z-10 max-w-[1400px] mx-auto px-6">

        {/* Section Header */}
        <ScrollReveal animation="fade-up" delay={100}>
          <div className="text-center mb-16">
            <h6 className="font-label text-[#C7A25C] text-[13px] font-semibold tracking-[4px] uppercase mb-4">
              Hệ Sinh Thái 30 Đơn Vị
            </h6>
            <h2 className="font-heading text-3xl md:text-5xl font-bold text-[#1F1F1F] dark:text-white mb-6 uppercase">
              Chia Theo <span className="text-[#C7A25C]">3 Phân Khúc</span> Rõ Ràng
            </h2>
            <div className="w-16 h-[2px] bg-[#C7A25C] mx-auto mb-6" />
            <p className="text-gray-600 dark:text-[#999] max-w-3xl mx-auto leading-relaxed text-[15px] md:text-[16px]">
              Mỗi đơn vị trong hệ sinh thái có thế mạnh riêng về phong cách thiết kế, loại công trình, năng lực thi công và mức ngân sách phù hợp. Khách hàng sẽ được tư vấn để kết nối với nhóm đơn vị phù hợp nhất.
            </p>
          </div>
        </ScrollReveal>

        {/* Tiers Grid (Pricing Table Style) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TIERS.map((tier, index) => (
            <ScrollReveal key={index} animation="fade-up" delay={200 + index * 150} className="h-full relative mt-4">

              {tier.highlight && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#C7A25C] text-white text-[11px] font-bold px-4 py-1.5 uppercase tracking-wider whitespace-nowrap z-30 shadow-[0_0_20px_rgba(206,158,81,0.5)]">
                  Phổ biến nhất
                </div>
              )}

              <SpotlightCard className={`h-full flex flex-col transition-all duration-500 hover:-translate-y-2 ${tier.highlight ? 'border-2 border-[#C7A25C] shadow-[0_0_30px_rgba(206,158,81,0.1)]' : ''}`}>

                {/* Header */}
                <div className={`p-8 text-center border-b ${tier.highlight ? 'border-[#C7A25C]/20' : 'border-[#ECE7DE] dark:border-white/5'} bg-transparent relative z-10`}>
                  <h3 className="font-heading text-2xl lg:text-3xl font-bold text-[#1F1F1F] dark:text-white">
                    {tier.title}
                  </h3>
                </div>

                {/* Content */}
                <div className="p-8 flex flex-col flex-grow relative z-10">

                  <CheckList title="Phù hợp với" items={tier.target} />
                  <CheckList title="Đặc điểm nổi bật" items={tier.features} />
                  <CheckList title="Dịch vụ thường có" items={tier.services} />

                  <div className="mt-auto pt-6 border-t border-[#ECE7DE] dark:border-white/5 relative z-10">
                    <Link
                      href="#Form"
                      className={`block w-full py-4 text-center font-bold  uppercase tracking-wider text-[13px] transition-colors ${tier.highlight
                          ? 'bg-[#C7A25C] text-white hover:bg-transparent hover:text-[#C7A25C] border-2 border-[#C7A25C]'
                          : 'bg-transparent text-[#1F1F1F] dark:text-white border border-[#ECE7DE] dark:border-white/10 hover:border-[#C7A25C] hover:text-[#C7A25C]'
                        }`}
                    >
                      Nhận tư vấn nhóm này
                    </Link>
                  </div>
                </div>
              </SpotlightCard>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
