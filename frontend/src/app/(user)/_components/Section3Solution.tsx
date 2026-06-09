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
    <section className="relative py-32 bg-[#131313] overflow-hidden border-y border-white/5">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Image Side */}
          <div className="relative order-2 lg:order-1">
            <ScrollReveal animation="fade-right" delay={100} className="relative z-10">
              <div className="relative aspect-[4/5] md:aspect-[3/4] lg:aspect-[4/5] w-full overflow-hidden">
                <div 
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: 'url(/images/blog/post-1.jpg)' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                {/* Overlay Badge */}
                <div className="absolute bottom-10 left-10 right-10 bg-[#D3AE3E] p-6 text-white transform translate-y-4 hover:translate-y-0 transition-transform duration-500">
                  <h4 className="font-['Montserrat',_sans-serif] font-bold text-2xl mb-2">30+ Đối Tác</h4>
                  <p className="font-['Montserrat',_sans-serif] text-[14px]">Đã được kiểm định khắt khe về năng lực và chất lượng thi công.</p>
                </div>
              </div>
            </ScrollReveal>
            
            {/* Decorative Background Element */}
            <div className="absolute -top-10 -left-10 w-full h-full border-2 border-[#D3AE3E]/20 z-0" />
          </div>

          {/* Content Side */}
          <div className="order-1 lg:order-2">
            <ScrollReveal animation="fade-left" delay={200}>
              <h6 className="text-[#D3AE3E] text-[13px] font-semibold tracking-[4px] uppercase mb-4 font-['Montserrat',_sans-serif]">
                Giải Pháp Của Website
              </h6>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 font-['Montserrat',_sans-serif] leading-tight">
                Chúng tôi giúp khách hàng chọn <span className="text-[#D3AE3E]">đúng đơn vị</span> ngay từ đầu
              </h2>
              <div className="w-16 h-[2px] bg-[#D3AE3E] mb-8" />
              
              <p className="text-[#999] text-[15px] md:text-[17px] font-['Montserrat',_sans-serif] leading-relaxed mb-10">
                Website sở hữu hệ sinh thái hơn 30 đơn vị thiết kế – thi công nội thất đã được phân loại theo năng lực, phân khúc, loại công trình và thế mạnh triển khai. Thay vì khách hàng phải tự tìm kiếm ngoài thị trường, chúng tôi giúp khách hàng được tư vấn, so sánh và kết nối với nhóm đơn vị phù hợp hơn.
              </p>

              <div className="bg-[#1a1a1a] p-8 border border-white/5">
                <h3 className="text-white font-['Montserrat',_sans-serif] font-bold text-xl mb-6">Giá trị nhận được:</h3>
                <ul className="flex flex-col gap-4">
                  {VALUES.map((value, index) => (
                    <li key={index} className="flex items-start gap-4 group">
                      <div className="mt-1 bg-white/5 p-1 rounded-full group-hover:bg-[#D3AE3E] transition-colors shrink-0">
                        <svg className="w-4 h-4 text-[#D3AE3E] group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                      </div>
                      <span className="text-[#cccccc] font-['Montserrat',_sans-serif] text-[15px] leading-relaxed group-hover:text-white transition-colors">
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
