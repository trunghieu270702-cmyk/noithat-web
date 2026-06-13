import React from 'react';

const PARTNERS = [
  { id: 1, name: 'EuroStyle', type: 'Phân phối nội thất' },
  { id: 2, name: 'An Cường', type: 'Vật liệu gỗ' },
  { id: 3, name: 'Vicostone', type: 'Đá nhân tạo' },
  { id: 4, name: 'Dulux', type: 'Sơn trang trí' },
  { id: 5, name: 'Hafele', type: 'Phụ kiện nội thất' },
  { id: 6, name: 'Boch', type: 'Thiết bị bếp' }
];

export default function SectionPartners() {
  return (
    <section className="py-20 modern-section border-y border-gray-200 dark:border-white/20 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/images/common/noise.png')] opacity-20 mix-blend-overlay pointer-events-none"></div>
      
      <div className="max-w-[1400px] mx-auto px-6 relative z-10">
        <div className="text-center mb-12">
          <h2 className="font-heading text-sm md:text-base font-semibold text-[#D3AE3E] uppercase tracking-[0.2em] mb-2">
            Đối Tác Chiến Lược
          </h2>
          <p className="text-gray-400 dark:text-white/40 text-sm">Hợp tác cùng các thương hiệu hàng đầu thế giới</p>
        </div>

        {/* Ticker / Grid for logos */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8">
          {PARTNERS.map((partner) => (
            <div key={partner.id} className="flex flex-col items-center justify-center p-6 card dark:bg-[#1a1a1a] dark:hover:bg-white/10 border border-[#ECE7DE] dark:border-white/20 hover:border-[#C7A25C]/30 transition-all duration-300 group cursor-pointer grayscale hover:grayscale-0 hover:-translate-y-1">
              <div className="w-12 h-12 mb-3 text-gray-400 dark:text-white/40 group-hover:text-[#C7A25C] transition-colors">
                <svg fill="currentColor" viewBox="0 0 24 24" className="w-full h-full">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <h3 className="font-heading font-bold text-[#1F1F1F] dark:text-white tracking-wider text-center">{partner.name}</h3>
              <p className="text-[10px] text-gray-400 dark:text-white/40 uppercase tracking-widest mt-1 text-center">{partner.type}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
