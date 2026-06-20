'use client';
import React from 'react';
import ScrollReveal from './ScrollReveal';

const VALUES = [
  'Có sẵn hệ sinh thái đơn vị đã được tuyển chọn',
  'Phân loại rõ theo cơ bản, trung cấp, cao cấp',
  'Tư vấn theo nhu cầu thực tế của từng công trình',
  'Hỗ trợ khách hàng so sánh và lựa chọn đơn vị phù hợp',
  'Có chiết khấu 5% khi kết nối qua hệ sinh thái',
  'Có thêm dịch vụ giám sát thi công khi cần'
];

export default function Section3Solution() {
  return (
    <section className="relative py-32 bg-transparent dark:bg-transparent overflow-hidden border-y border-[#ECE7DE] dark:border-white/5">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Image Side */}
          <div className="relative order-2 lg:order-1">
            <ScrollReveal animation="fade-right" delay={100} className="relative z-10">
              <div className="relative aspect-[4/5] md:aspect-[3/4] lg:aspect-[4/5] w-full overflow-hidden">
                <div 
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: 'url(/images/blog/post-1.jpg)' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#F8F6F2] dark:from-black/80 via-[#F8F6F2]/20 dark:via-black/20 to-transparent" />
                
                {/* Overlay Badge */}
                <div className="absolute bottom-10 left-10 right-10 bg-[#C7A25C] p-6 text-white transform translate-y-4 hover:translate-y-0 transition-transform duration-500">
                  <h4 className="font-bold text-2xl mb-2">30+ Đối Tác</h4>
                  <p className="text-[14px]">Đã được kiểm định khắt khe về năng lực và chất lượng thi công.</p>
                </div>
              </div>
            </ScrollReveal>
            
            {/* Decorative Background Element */}
            <div className="absolute -top-10 -left-10 w-full h-full border-2 border-[#C7A25C]/20 z-0" />
          </div>

          {/* Content Side */}
          <div className="order-1 lg:order-2">
            <ScrollReveal animation="fade-left" delay={200}>
              <h6 className="font-label text-[#C7A25C] text-[13px] font-semibold tracking-[4px] uppercase mb-4">
                Giải Pháp Của Website
              </h6>
              <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-[#1F1F1F] dark:text-white mb-6 leading-tight">
                Chúng tôi giúp khách hàng chọn <span className="text-[#C7A25C]">đúng đơn vị</span> ngay từ đầu
              </h2>
              <div className="w-16 h-[2px] bg-[#C7A25C] mb-8" />
              
              <p className="text-gray-600 dark:text-[#999] text-[15px] md:text-[17px] leading-relaxed mb-10">
                Website sở hữu hệ sinh thái hơn 30 đơn vị thiết kế – thi công nội thất đã được phân loại theo năng lực, phân khúc, loại công trình và thế mạnh triển khai. Thay vì khách hàng phải tự tìm kiếm ngoài thị trường, chúng tôi giúp khách hàng được tư vấn, so sánh và kết nối với nhóm đơn vị phù hợp hơn.
              </p>

              <div className="card dark:bg-[#1a1a1a] p-8 border border-[#ECE7DE] dark:border-white/5">
                <h3 className="font-heading text-[#1F1F1F] dark:text-white font-bold text-xl mb-6">Giá trị nhận được:</h3>
                <ul className="flex flex-col gap-4">
                  {VALUES.map((value, index) => (
                    <li key={index} className="flex items-start gap-4 group">
                      <div className="mt-1 bg-white/5 p-1 rounded-full group-hover:bg-[#C7A25C] transition-colors shrink-0">
                        <svg className="w-4 h-4 text-[#C7A25C] group-hover:text-[#1F1F1F] dark:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                      </div>
                      <span className="text-gray-600 dark:text-[#cccccc] text-[15px] leading-relaxed group-hover:text-[#1F1F1F] dark:text-white transition-colors">
                        {value}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
          </div>

        </div>
      </div>
    </section>
  );
}
