import SectionStarryMotif from './SectionStarryMotif';
import React from 'react';
import Link from 'next/link';

const BEST_SELLERS = [
  {
    id: 1,
    name: 'Sofa Văng Minimalist',
    category: 'Phòng Khách',
    image: '/images/main/9.jpg',
    sold: 120,
    tags: ['Best Seller', 'Sẵn hàng']
  },
  {
    id: 2,
    name: 'Bàn Trà Gỗ Sồi Tự Nhiên',
    category: 'Phòng Khách',
    image: '/images/main/10.jpg',
    sold: 85,
    tags: ['Thịnh hành']
  },
  {
    id: 3,
    name: 'Ghế Thư Giãn Đọc Sách',
    category: 'Decor',
    image: '/images/main/12.jpg',
    sold: 210,
    tags: ['Best Seller']
  },
  {
    id: 4,
    name: 'Tủ Quần Áo Âm Tường',
    category: 'Phòng Ngủ',
    image: '/images/main/13.jpg',
    sold: 150,
    tags: ['Mới']
  },
  {
    id: 5,
    name: 'Giường Ngủ Bọc Nệm Cao Cấp',
    category: 'Phòng Ngủ',
    image: '/images/main/14.jpg',
    sold: 95,
    tags: ['Thịnh hành']
  },
  {
    id: 6,
    name: 'Đèn Chùm Pha Lê Nghệ Thuật',
    category: 'Đèn Trang Trí',
    image: '/images/main/15.jpg',
    sold: 320,
    tags: ['Best Seller']
  }
];

export default function SectionBestSellers() {
  return (
    <section className="overflow-hidden py-24 bg-transparent dark:bg-transparent modern-section relative border-t border-gray-200 dark:border-white/20">
      <SectionStarryMotif />
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 uppercase">
            Sản Phẩm <span className="text-[#D3AE3E]">Bán Chạy</span>
          </h2>
          <p className="text-gray-500 dark:text-[#888] max-w-2xl mx-auto text-lg">
            Khám phá những lựa chọn hàng đầu được hàng ngàn khách hàng tin dùng để kiến tạo không gian sống hoàn mỹ.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {BEST_SELLERS.map((product) => (
            <div key={product.id} className="group flex flex-col bg-white dark:bg-[#1a1a1a] shadow-sm dark:shadow-none border border-gray-100 dark:border-white/10 rounded-[4px] overflow-hidden hover:-translate-y-2 transition-all duration-300 luxury-glow shadow-sm shadow-black/20">
              <div className="relative aspect-[4/3] overflow-hidden">
                {/* Luxury Corner Accents */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#D3AE3E] opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-30"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#D3AE3E] opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-30"></div>
                
                <div className="w-full h-full relative overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 opacity-80 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
                  {/* Default Inner Border */}
                  <div className="absolute inset-3 border border-[#D3AE3E]/30 z-20 pointer-events-none transition-all duration-500 group-hover:opacity-0 group-hover:scale-105 rounded-[1px]"></div>
                </div>

                <div className="absolute top-4 left-4 flex gap-2 z-20">
                  {product.tags.map(tag => (
                    <span key={tag} className="bg-black/80 backdrop-blur-md text-[#D3AE3E] text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-[2px] luxury-glow">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="p-8 flex flex-col flex-grow relative">
                <div className="absolute top-0 right-8 -translate-y-1/2 w-12 h-12 modern-section border border-gray-200 dark:border-white/20 rounded-full flex items-center justify-center text-gray-900 dark:text-white group-hover:bg-[#D3AE3E] group-hover:text-black group-hover:border-[#D3AE3E] transition-colors shadow-sm">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                </div>

                <p className="text-gray-500 dark:text-[#888] text-xs font-semibold uppercase tracking-widest mb-2">{product.category}</p>
                <h3 className="font-heading text-xl font-bold text-gray-900 dark:text-white mb-4">{product.name}</h3>

                <div className="mt-auto pt-4 border-t border-gray-200 dark:border-white/20 flex items-center justify-between">
                  <span className="text-[#D3AE3E] text-sm font-bold">Đã bán {product.sold}+</span>
                  <Link href={`/san-pham/${product.id}`} className="text-sm text-gray-900 dark:text-white hover:text-[#D3AE3E] font-semibold transition-colors flex items-center gap-1">
                    Xem chi tiết
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link href="/san-pham?filter=ban-chay" className="inline-flex items-center justify-center border-2 border-[#D3AE3E] text-[#D3AE3E] hover:bg-[#D3AE3E] hover:text-white px-8 py-4 rounded-[2px] font-bold uppercase tracking-widest transition-all text-sm dark:text-white">
            Khám phá thêm sản phẩm
          </Link>
        </div>
      </div>
    </section>
  );
}
