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
    <div className="pt-[120px] pb-20 bg-[#FAF9F8] dark:bg-[#131313] min-h-screen text-gray-900 dark:text-white">
      <div className="container mx-auto px-6 max-w-[1400px]">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">Quy trình kết nối rõ ràng từ nhu cầu đến triển khai</h1>
          <p className="text-gray-600 dark:text-white/70 text-lg max-w-2xl mx-auto">Chúng tôi đồng hành cùng bạn trong từng bước để tìm ra đơn vị thi công phù hợp nhất và đảm bảo dự án thành công.</p>
        </div>

        {/* Timeline */}
        <div className="relative mt-12">
          {/* Vertical Line */}
          <div className="absolute left-[24px] md:left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#ce9e51]/50 via-[#ce9e51]/20 to-transparent md:-translate-x-1/2"></div>
          
          <div className="relative z-10 space-y-8 md:space-y-12">
            {steps.map((step, index) => {
              const isEven = index % 2 === 1;
              return (
                <div key={index} className={`relative flex flex-col md:flex-row items-start md:items-center gap-0 md:gap-8 ${isEven ? 'md:flex-row-reverse' : ''}`}>
                  
                  {/* Content Box */}
                  <div className={`w-full md:w-1/2 pl-16 md:pl-0 ${isEven ? 'md:pl-12' : 'md:pr-12 text-left md:text-right'} pt-2 md:pt-0`}>
                    <div className="bg-white dark:bg-[#1c1c1c] shadow-sm dark:shadow-none p-6 md:p-8 rounded-[8px] border border-gray-200 dark:border-white/5 hover:border-[#ce9e51]/50 transition-colors shadow-sm relative group">
                      <div className={`absolute top-1/2 -translate-y-1/2 ${isEven ? '-left-3' : '-right-3'} w-6 h-6 rotate-45 bg-white dark:bg-[#1c1c1c] shadow-sm dark:shadow-none border border-gray-200 dark:border-white/5 group-hover:border-[#ce9e51]/50 hidden md:block border-t-0 border-l-0 ${isEven ? 'border-b-0 border-r-0 border-l border-t' : ''}`}></div>
                      <h3 className="font-heading text-xl md:text-2xl font-bold mb-3 text-[#ce9e51]">{step.title}</h3>
                      <p className="text-gray-600 dark:text-white/70 leading-relaxed text-sm md:text-base">{step.desc}</p>
                    </div>
                  </div>
                  
                  {/* Number Circle */}
                  <div className="absolute left-[24px] md:left-1/2 top-6 md:top-1/2 -translate-x-1/2 md:-translate-y-1/2 w-10 h-10 md:w-14 md:h-14 bg-[#FAF9F8] dark:bg-[#131313] border-2 border-[#ce9e51] rounded-full flex items-center justify-center font-bold text-[#ce9e51] text-sm md:text-lg shadow-[0_0_20px_rgba(206,158,81,0.3)]">
                    {step.number}
                  </div>

                  {/* Empty space for opposite side */}
                  <div className="hidden md:block w-1/2" />
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-20 text-center">
          <Link href="/tu-van" className="inline-block bg-[#ce9e51] hover:bg-white hover:text-[#131313] text-gray-900 dark:text-white font-bold py-4 px-10 rounded-[4px] transition-colors uppercase tracking-wider">
            Gửi nhu cầu công trình ngay
          </Link>
        </div>

      </div>
    </div>
  );
}
