import React from 'react';
import HeroSlider from './_components/HeroSlider';
import Section7Categories from './_components/Section7Categories';
import SectionHotProducts from './_components/SectionHotProducts';
import SectionBestSellers from './_components/SectionBestSellers';
import SectionPartners from './_components/SectionPartners';
import SectionPolicies from './_components/SectionPolicies';
import Section9ProcessShort from './_components/Section9ProcessShort';
import Portfolio from './_components/Portfolio';
import Blog from './_components/Blog';
import Section10CTA from './_components/Section10CTA';
import BackgroundVisuals from './_components/BackgroundVisuals';

export default function UserHomePage() {
  return (
    <div className="w-full relative overflow-hidden modern-section">
      {/* Ambient Light Blobs for WOW Effect */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Existing Blurs */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#D3AE3E]/15 blur-[120px]" />
        <div className="absolute top-[40%] right-[-10%] w-[30%] h-[50%] rounded-full bg-[#D3AE3E]/10 blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[40%] rounded-full bg-[#D3AE3E]/10 blur-[150px]" />
      </div>

      <div className="relative z-10">
        {/* Section 1: Hero Banner */}
        <HeroSlider />
      
        {/* Section 2: Danh mục sản phẩm */}
        <div id="danh-muc-san-pham">
          <Section7Categories />
        </div>
        
        {/* Section 3: Sản phẩm nổi bật */}
        <SectionHotProducts />
        
        {/* Section 4: Sản phẩm bán chạy (Removed) */}
        {/* <SectionBestSellers /> */}
        
        {/* Section 5: Thương hiệu / Đối tác hợp tác */}
        <SectionPartners />
        
        {/* Section 6: Chính sách & Cam kết */}
        <SectionPolicies />
        
        {/* Section 7: Quy trình làm việc (Rút gọn) */}
        <Section9ProcessShort />

        {/* Section 8: Bài viết nổi bật */}
        <Blog />
        
        {/* Section 9: Form nhận tư vấn */}
        <Section10CTA />
      </div>
    </div>
  );
}
