import React from 'react';

const POLICIES = [
  {
    id: 1,
    icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    title: 'Tuyển Chọn Khắt Khe',
    desc: 'Chỉ hợp tác với các đơn vị, nhà cung cấp uy tín, có năng lực thực thi và chứng nhận chất lượng rõ ràng.'
  },
  {
    id: 2,
    icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
    title: 'Bảo Hành Dài Hạn',
    desc: 'Chính sách bảo hành sản phẩm lên đến 5 năm, bảo trì trọn đời giúp khách hàng an tâm tuyệt đối.'
  },
  {
    id: 3,
    icon: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z',
    title: 'Giám Sát Chặt Chẽ',
    desc: 'Quy trình kiểm tra chất lượng 3 lớp độc lập trước khi bàn giao sản phẩm tới tay khách hàng.'
  },
  {
    id: 4,
    icon: 'M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z',
    title: 'Hỗ Trợ 24/7',
    desc: 'Đội ngũ chuyên gia luôn sẵn sàng tư vấn, giải đáp thắc mắc và hỗ trợ xử lý vấn đề nhanh chóng.'
  }
];

export default function SectionPolicies() {
  return (
    <section className="py-24 bg-[#F8F6F2] dark:bg-[#0a0a0a] relative border-t border-[#ECE7DE] dark:border-white/20">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[4px] bg-[#C7A25C]/10 border border-[#C7A25C]/20 text-[#C7A25C] text-xs font-bold uppercase tracking-wider mb-4 text-white">
            Cam kết chất lượng
          </div>
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-[#1F1F1F] dark:text-white mb-6">
            Lý Do <span className="text-[#C7A25C]">Khách Hàng</span> Lựa Chọn
          </h2>
          <p className="text-gray-500 dark:text-[#888] max-w-2xl mx-auto text-lg">
            Chúng tôi không chỉ cung cấp sản phẩm nội thất, chúng tôi trao gửi sự an tâm và cam kết gắn bó dài lâu.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {POLICIES.map((policy) => (
            <div key={policy.id} className="card dark:bg-[#1a1a1a] border border-[#ECE7DE] dark:border-white/20 p-8 hover:border-[#C7A25C]/50 hover:-translate-y-2 transition-all duration-300 luxury-glow group">
              <div className="w-16 h-16 bg-[#C7A25C]/10 rounded-[8px] flex items-center justify-center mb-6 text-[#C7A25C] group-hover:bg-[#C7A25C] group-hover:text-white transition-colors rotate-3 group-hover:-rotate-3 duration-300">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d={policy.icon} />
                </svg>
              </div>
              <h3 className="font-heading text-xl font-bold text-[#1F1F1F] dark:text-white mb-4 group-hover:text-[#C7A25C] transition-colors">{policy.title}</h3>
              <p className="text-gray-500 dark:text-[#888] leading-relaxed text-sm">
                {policy.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
