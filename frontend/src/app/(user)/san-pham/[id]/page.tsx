import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default async function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;

  // Mock data based on ID or just a generic product
  const product = {
    id: resolvedParams.id,
    name: 'Sofa Văng Minimalist Cao Cấp',
    price: '15.500.000 VNĐ',
    originalPrice: '18.000.000 VNĐ',
    description: 'Sofa văng với thiết kế tối giản, chất liệu vải nỉ nhập khẩu cao cấp, khung gỗ sồi Nga chắc chắn. Mang đến không gian sang trọng và hiện đại cho phòng khách của bạn.',
    images: [
      '/images/main/9.jpg',
      '/images/main/10.jpg',
      '/images/main/12.jpg',
    ],
    features: [
      'Chất liệu: Vải nỉ cao cấp, thoáng mát, dễ vệ sinh',
      'Khung: Gỗ sồi tự nhiên, chống mối mọt cong vênh',
      'Kích thước: 2200 x 900 x 850 mm',
      'Bảo hành: 5 năm cho khung gỗ, 2 năm cho nệm mút',
      'Hỗ trợ giao hàng và lắp đặt tận nơi'
    ]
  };

  return (
    <div className="pt-32 pb-24 bg-[#FAF9F8] dark:bg-[#0a0a0a] min-h-screen">
      <div className="max-w-[1400px] mx-auto px-6">

        {/* Breadcrumb & Back */}
        <div className="flex items-center justify-between mb-10 border-b border-gray-200 dark:border-white/10 pb-6">
          <div className="flex items-center gap-2 text-[13px] text-gray-500 dark:text-[#888] uppercase tracking-wider font-semibold">
            <Link href="/" className="hover:text-[#D3AE3E] transition-colors">Trang chủ</Link>
            <span className="text-gray-300 dark:text-gray-700">/</span>
            <Link href="/san-pham" className="hover:text-[#D3AE3E] transition-colors">Sản phẩm</Link>
            <span className="text-gray-300 dark:text-gray-700">/</span>
            <span className="text-gray-900 dark:text-white">{product.name}</span>
          </div>

          <Link href="/" className="hidden md:flex items-center gap-2 text-sm text-gray-500 hover:text-[#D3AE3E] transition-colors font-medium">
            <ArrowLeft className="w-4 h-4" />
            Quay lại
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Product Images (Left Side) */}
          <div className="lg:col-span-7 space-y-2">
            <div className="aspect-[4/3] rounded-[8px] overflow-hidden bg-white dark:bg-[#131313] shadow-sm shadow-black/5 border border-gray-100 dark:border-white/5 relative group cursor-crosshair">
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute top-6 left-6 flex flex-col gap-2">
                <span className="bg-[#D3AE3E] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 shadow-sm">Mới nhất</span>
                <span className="bg-gray-900 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 shadow-sm">-15%</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="aspect-[4/3] rounded-[8px] overflow-hidden bg-white dark:bg-[#131313] shadow-sm border border-gray-100 dark:border-white/5 relative group">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10" />
                <img src={product.images[1]} alt={`${product.name} - góc khác`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="aspect-[4/3] rounded-[8px] overflow-hidden bg-white dark:bg-[#131313] shadow-sm border border-gray-100 dark:border-white/5 relative group">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10" />
                <img src={product.images[2]} alt={`${product.name} - chi tiết`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
            </div>
          </div>

          {/* Product Info (Right Side) */}
          <div className="lg:col-span-5 flex flex-col">
            <span className="inline-block px-3 py-1 bg-[#D3AE3E]/10 border border-[#D3AE3E]/20 text-[#D3AE3E] text-[11px] font-bold uppercase tracking-wider w-max mb-6 rounded-[4px] text-[#131313]">
              Best Seller
            </span>

            <h1 className="font-heading text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              {product.name}
            </h1>

            <div className="flex items-baseline gap-4 mb-8 pb-8 border-b border-gray-200 dark:border-white/10">
              <span className="text-3xl lg:text-4xl font-bold text-[#D3AE3E]">{product.price}</span>
              <span className="text-xl text-gray-400 line-through font-medium">{product.originalPrice}</span>
            </div>

            <p className="text-gray-600 dark:text-[#ccc] text-base leading-relaxed mb-10">
              {product.description}
            </p>

            <div className="mb-10 bg-white dark:bg-[#131313] p-6 lg:p-8 rounded-[8px] border border-gray-100 dark:border-white/5 shadow-sm">
              <h3 className="font-heading font-bold text-gray-900 dark:text-white mb-6 uppercase tracking-wider text-sm flex items-center gap-3">
                <svg className="w-5 h-5 text-[#D3AE3E]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                Thông tin kỹ thuật
              </h3>
              <ul className="space-y-4">
                {product.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-gray-600 dark:text-[#ccc]">
                    <svg className="w-5 h-5 text-[#D3AE3E] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    <span className="leading-relaxed">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mt-auto">
              <button className="flex-[2] bg-[#D3AE3E] text-white hover:bg-[#b88c45] py-5 px-6 rounded-[4px] font-bold uppercase tracking-widest text-[13px] transition-all duration-300 flex items-center justify-center gap-3 shadow-sm shadow-[#D3AE3E]/20 hover:shadow-sm hover:-translate-y-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                Thêm vào giỏ
              </button>
              <Link href="/tu-van" className="flex-1 bg-transparent border-2 border-[#D3AE3E] text-[#D3AE3E] hover:bg-[#D3AE3E] hover:text-white py-5 px-6 rounded-[4px] font-bold uppercase tracking-widest text-[13px] text-center transition-all duration-300 flex items-center justify-center gap-2">
                Tư vấn
              </Link>
            </div>

            <div className="mt-8 flex items-center justify-center gap-6 text-sm text-gray-500 font-medium">
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                Bảo hành chính hãng
              </span>
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
                Đổi trả trong 7 ngày
              </span>
            </div>
          </div>
        </div>

        {/* --- Thêm Tabs Thông tin chi tiết & Đánh giá --- */}
        <div className="mt-24 pt-16 border-t border-gray-200 dark:border-white/10">
          <div className="flex items-center gap-8 border-b border-gray-200 dark:border-white/10 mb-10 pb-4">
            <button className="text-xl font-bold text-[#D3AE3E] border-b-2 border-[#D3AE3E] pb-4 -mb-[18px]">Mô tả chi tiết</button>
            <button className="text-xl font-bold text-gray-400 dark:text-[#888] hover:text-gray-900 dark:hover:text-white transition-colors pb-4 -mb-[18px]">Bảo hành & Lắp đặt</button>
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none text-gray-600 dark:text-[#ccc]">
            <p>
              Sofa Văng Minimalist là biểu tượng của sự tinh tế và sang trọng trong không gian phòng khách hiện đại. Được thiết kế với triết lý "Less is more", sản phẩm lược bỏ tối đa các chi tiết rườm rà, giữ lại đường nét thanh thoát, vuông vức nhưng không kém phần mềm mại nhờ chất liệu bọc nỉ cao cấp.
            </p>
            <div className="mt-6">
              <strong className="text-gray-900 dark:text-white">Đặc điểm nổi bật:</strong>
              <ul className="list-disc pl-5 mt-3 space-y-2">
                <li>Khung gỗ sồi Nga nguyên khối đã qua xử lý chống mối mọt, cong vênh, đảm bảo tuổi thọ lên tới 15 năm.</li>
                <li>Hệ thống đệm mút Inoac Nhật Bản đa tầng, chống xẹp lún, độ đàn hồi cực cao, mang lại cảm giác ngồi êm ái tuyệt đối.</li>
                <li>Chất liệu nỉ dệt kim nhập khẩu Hàn Quốc cao cấp, thoáng khí, an toàn cho làn da nhạy cảm và dễ dàng vệ sinh.</li>
                <li>Thiết kế văng dài 2m2 phù hợp với đa số chung cư, nhà phố hiện nay, tạo không gian mở tối ưu cho phòng khách.</li>
              </ul>
            </div>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
              <img src="/images/main/10.jpg" alt="Chi tiết sofa 1" className="w-full h-[400px] object-cover rounded-[8px] shadow-sm border border-gray-100 dark:border-white/5" />
              <img src="/images/main/12.jpg" alt="Chi tiết sofa 2" className="w-full h-[400px] object-cover rounded-[8px] shadow-sm border border-gray-100 dark:border-white/5" />
            </div>
          </div>
        </div>

        {/* --- Sản phẩm liên quan --- */}
        <div className="mt-24 pt-16 border-t border-gray-200 dark:border-white/10">
          <div className="flex items-center justify-between mb-10">
            <h2 className="font-heading text-3xl font-bold text-gray-900 dark:text-white uppercase tracking-wider">
              Sản phẩm <span className="text-[#D3AE3E]">Liên quan</span>
            </h2>
            <Link href="/san-pham" className="text-sm font-bold uppercase tracking-widest text-gray-500 hover:text-[#D3AE3E] transition-colors flex items-center gap-2">
              Xem tất cả <ArrowLeft className="w-4 h-4 rotate-180" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((item) => (
              <Link href={`/san-pham/${item}`} key={item} className="group flex flex-col bg-white dark:bg-[#131313] border border-gray-100 dark:border-white/5 rounded-[8px] overflow-hidden hover:shadow-sm hover:-translate-y-2 transition-all duration-300">
                <div className="aspect-[4/3] bg-gray-100 dark:bg-white/5 relative overflow-hidden">
                  <img src={`/images/main/${item + 3}.jpg`} alt="Product" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-4 left-4 bg-[#D3AE3E] text-white text-[10px] font-bold uppercase tracking-widest px-2 py-1 shadow-sm">Best Seller</div>
                </div>
                <div className="p-6">
                  <h3 className="font-heading text-lg font-bold text-gray-900 dark:text-white group-hover:text-[#D3AE3E] transition-colors mb-2 line-clamp-2">Bàn Trà Sofa Mặt Đá Ceramic Nhập Khẩu</h3>
                  <div className="flex items-center gap-3">
                    <span className="text-[#D3AE3E] font-bold text-lg">4.200.000đ</span>
                    <span className="text-gray-400 text-sm line-through">5.000.000đ</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
