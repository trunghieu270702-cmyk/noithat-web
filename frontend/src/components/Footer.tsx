import React from 'react';
import { MapPin, Phone, Mail, Clock, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#1a1a1a] text-gray-300 py-16">
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* 1. Kết Nối Với Chúng Tôi */}
          <div>
            <h3 className="font-heading text-white text-xl font-bold mb-6 relative pb-3 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-12 after:h-[2px] after:bg-[#D3AE3E]">
              Kết Nối Với Chúng Tôi
            </h3>
            <p className="text-gray-400 mb-6 text-sm">
              Luôn sẵn sàng hỗ trợ và đồng hành cùng bạn kiến tạo không gian sống mơ ước.
            </p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm">
                <MapPin className="text-[#D3AE3E] w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>Cầu Giấy, Hà Nội, Việt Nam</span>
              </li>
              <li className="flex items-start gap-3 text-sm">
                <Phone className="text-[#D3AE3E] w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>0334 689 521</span>
              </li>
              <li className="flex items-start gap-3 text-sm">
                <Mail className="text-[#D3AE3E] w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>hieunt270702@gmail.com</span>
              </li>
              <li className="flex items-start gap-3 text-sm">
                <Clock className="text-[#D3AE3E] w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>Thứ 2 - Thứ 6 / 9:00 SA - 6:00 CH</span>
              </li>
            </ul>
          </div>

          {/* 2. Bài Viết Gần Đây */}
          <div>
            <h3 className="font-heading text-white text-xl font-bold mb-6 relative pb-3 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-12 after:h-[2px] after:bg-[#D3AE3E]">
              Bài Viết Gần Đây
            </h3>
            <div className="space-y-6">
              <div className="flex gap-4 group">
                <div className="w-[80px] h-[60px] flex-shrink-0 overflow-hidden rounded-[4px]">
                  <img src="/images/main/25.jpg" alt="Post" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div>
                  <Link href="/cam-nang" className="text-sm text-gray-300 hover:text-[#D3AE3E] transition-colors line-clamp-2 leading-snug">
                    Không Gian Sống Đẳng Cấp: Xu Hướng Thiết Kế Mới
                  </Link>
                  <span className="text-xs text-gray-500 mt-1 block">26 Tháng 2, 2024</span>
                </div>
              </div>
              <div className="flex gap-4 group">
                <div className="w-[80px] h-[60px] flex-shrink-0 overflow-hidden rounded-[4px]">
                  <img src="/images/main/26.jpg" alt="Post" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div>
                  <Link href="/cam-nang" className="text-sm text-gray-300 hover:text-[#D3AE3E] transition-colors line-clamp-2 leading-snug">
                    5 Điều Bạn Cần Biết Về Nội Thất Hiện Đại
                  </Link>
                  <span className="text-xs text-gray-500 mt-1 block">28 Tháng 8, 2024</span>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Dịch Vụ Của Chúng Tôi */}
          <div>
            <h3 className="font-heading text-white text-xl font-bold mb-6 relative pb-3 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-12 after:h-[2px] after:bg-[#D3AE3E]">
              Dịch Vụ Của Chúng Tôi
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/he-sinh-thai" className="flex items-center gap-3 text-sm hover:text-[#D3AE3E] transition-colors group">
                  <CheckCircle className="text-[#D3AE3E] w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  Hệ Sinh Thái Đơn Vị
                </Link>
              </li>
              <li>
                <Link href="/giam-sat" className="flex items-center gap-3 text-sm hover:text-[#D3AE3E] transition-colors group">
                  <CheckCircle className="text-[#D3AE3E] w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  Dịch Vụ Giám Sát
                </Link>
              </li>
              <li>
                <Link href="/quy-trinh" className="flex items-center gap-3 text-sm hover:text-[#D3AE3E] transition-colors group">
                  <CheckCircle className="text-[#D3AE3E] w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  Quy Trình Làm Việc
                </Link>
              </li>
              <li>
                <Link href="/cam-nang" className="flex items-center gap-3 text-sm hover:text-[#D3AE3E] transition-colors group">
                  <CheckCircle className="text-[#D3AE3E] w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  Cẩm Nang Nội Thất
                </Link>
              </li>
            </ul>
          </div>

          {/* 4. Thư Viện Ảnh */}
          <div>
            <h3 className="font-heading text-white text-xl font-bold mb-6 relative pb-3 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-12 after:h-[2px] after:bg-[#D3AE3E]">
              Thư Viện Ảnh
            </h3>
            <div className="grid grid-cols-3 gap-2">
              <div className="aspect-square overflow-hidden rounded-[4px] group cursor-pointer relative">
                <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors z-10" />
                <img src="/images/main/19.jpg" alt="Gallery 1" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
              </div>
              <div className="aspect-square overflow-hidden rounded-[4px] group cursor-pointer relative">
                <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors z-10" />
                <img src="/images/main/20.jpg" alt="Gallery 2" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
              </div>
              <div className="aspect-square overflow-hidden rounded-[4px] group cursor-pointer relative">
                <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors z-10" />
                <img src="/images/main/21.jpg" alt="Gallery 3" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
              </div>
              <div className="aspect-square overflow-hidden rounded-[4px] group cursor-pointer relative">
                <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors z-10" />
                <img src="/images/main/22.jpg" alt="Gallery 4" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Footer Area */}
        <div className="mt-16 pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <Link href="/">
            <img src="/images/logo-main2.png" alt="Footer Logo" className="h-10 opacity-90 hover:opacity-100 transition-opacity" />
          </Link>
          <div className="text-sm text-gray-500 font-medium tracking-wide flex flex-wrap justify-center gap-2">
            <Link href="#" className="hover:text-[#D3AE3E] transition-colors">Terms of use</Link>
            <span>|</span>
            <Link href="#" className="hover:text-[#D3AE3E] transition-colors">Privacy Environmental Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}