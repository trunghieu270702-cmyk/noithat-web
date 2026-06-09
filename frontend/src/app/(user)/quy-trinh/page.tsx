import React from 'react';
import Link from 'next/link';

export default function QuyTrinhPage() {
  const steps = [
    {
      number: '01',
      title: 'Khách hàng gửi nhu cầu',
      desc: 'Khách hàng cung cấp thông tin cơ bản về công trình: loại hình, diện tích, ngân sách, phong cách mong muốn, khu vực và thời gian dự kiến triển khai.'
    },
    {
      number: '02',
      title: 'Tư vấn phân khúc phù hợp',
      desc: 'Dựa trên thông tin khách hàng cung cấp, đội ngũ tư vấn sẽ xác định nhóm đơn vị phù hợp: cơ bản, trung cấp hoặc cao cấp.'
    },
    {
      number: '03',
      title: 'Đề xuất đơn vị trong hệ sinh thái',
      desc: 'Khách hàng được gợi ý một số đơn vị phù hợp nhất trong hệ sinh thái hơn 30 đối tác thiết kế – thi công nội thất.'
    },
    {
      number: '04',
      title: 'Xem hồ sơ và so sánh',
      desc: 'Khách hàng xem thông tin chi tiết của từng đơn vị: dịch vụ, dự án tiêu biểu, phong cách, thế mạnh, quy trình và ngân sách tham khảo.'
    },
    {
      number: '05',
      title: 'Kết nối và nhận báo giá',
      desc: 'Website hỗ trợ kết nối khách hàng với đơn vị phù hợp để trao đổi chi tiết, khảo sát nếu cần và nhận báo giá cụ thể.'
    },
    {
      number: '06',
      title: 'Triển khai thiết kế – thi công',
      desc: 'Sau khi thống nhất phương án, khách hàng làm việc với đơn vị được chọn để triển khai thiết kế, thi công hoặc thi công trọn gói.'
    },
    {
      number: '07',
      title: 'Giám sát thi công (Tùy chọn)',
      desc: 'Khách hàng có thể chọn thêm gói giám sát hạng mục thiết yếu hoặc gói quản lý toàn bộ dự án để kiểm soát quá trình thi công tốt hơn.'
    }
  ];

  return (
    <div className="pt-[120px] pb-20 bg-[#131313] min-h-screen text-white">
      <div className="container mx-auto px-6 max-w-[1000px]">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-['Montserrat',_sans-serif] font-bold text-white mb-6">Quy trình kết nối rõ ràng từ nhu cầu đến triển khai</h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">Chúng tôi đồng hành cùng bạn trong từng bước để tìm ra đơn vị thi công phù hợp nhất và đảm bảo dự án thành công.</p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical Line */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[1px] bg-white/10 -translate-x-1/2"></div>
          
          <div className="space-y-12 relative z-10">
            {steps.map((step, index) => {
              const isEven = index % 2 === 1;
              return (
                <div key={index} className={`flex flex-col md:flex-row items-center gap-8 ${isEven ? 'md:flex-row-reverse' : ''}`}>
                  {/* Content Box */}
                  <div className={`w-full md:w-1/2 ${isEven ? 'md:pl-12' : 'md:pr-12 text-left md:text-right'}`}>
                    <div className="bg-[#1c1c1c] p-8 rounded-2xl border border-white/5 hover:border-[#ce9e51]/50 transition-colors shadow-lg relative group">
                      <div className={`absolute top-1/2 -translate-y-1/2 ${isEven ? '-left-3' : '-right-3'} w-6 h-6 rotate-45 bg-[#1c1c1c] border border-white/5 group-hover:border-[#ce9e51]/50 hidden md:block border-t-0 border-l-0 ${isEven ? 'border-b-0 border-r-0 border-l border-t' : ''}`}></div>
                      <h3 className="text-2xl font-bold font-['Montserrat',_sans-serif] mb-3 text-[#ce9e51]">{step.title}</h3>
                      <p className="text-white/70 leading-relaxed text-sm md:text-base">{step.desc}</p>
                    </div>
                  </div>
                  
                  {/* Number Circle */}
                  <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-14 h-14 bg-[#131313] border-2 border-[#ce9e51] rounded-full items-center justify-center font-bold text-[#ce9e51] text-lg">
                    {step.number}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-20 text-center">
          <Link href="/tu-van" className="inline-block bg-[#ce9e51] hover:bg-white hover:text-[#131313] text-white font-bold py-4 px-10 rounded transition-colors uppercase tracking-wider">
            Gửi nhu cầu công trình ngay
          </Link>
        </div>

      </div>
    </div>
  );
}
