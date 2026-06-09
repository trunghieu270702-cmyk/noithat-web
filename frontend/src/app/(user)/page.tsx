import React from 'react';
import HeroSlider from './_components/HeroSlider';
import Section2Problem from './_components/Section2Problem';
import Section3Solution from './_components/Section3Solution';
import Section4Benefits from './_components/Section4Benefits';
import Section5Comparison from './_components/Section5Comparison';
import Section6Ecosystem from './_components/Section6Ecosystem';
import Section7Categories from './_components/Section7Categories';
import Section8Supervision from './_components/Section8Supervision';
import Section9Process from './_components/Section9Process';
import Section10CTA from './_components/Section10CTA';
import Stats from './_components/Stats';
import Blog from './_components/Blog';

export default function UserHomePage() {
  return (
    <div className="w-full">
      {/* Section 1: Hero Banner */}
      <HeroSlider />
      
      {/* Section 2: Vấn đề */}
      <Section2Problem />
      
      {/* Section 3: Giải pháp */}
      <Section3Solution />
      
      {/* Section 4: Lợi ích */}
      <Section4Benefits />
      
      {/* Section 5: So sánh */}
      <Section5Comparison />
      
      {/* Section 6: Hệ sinh thái */}
      <Section6Ecosystem />
      
      {/* Section 7: Loại hình công trình */}
      <Section7Categories />
      
      {/* Section 8: Giám sát thi công */}
      <Section8Supervision />
      
      {/* Section 9: Quy trình làm việc */}
      <Section9Process />
      
      {/* Stats - Giữ nguyên phong cách */}
      <Stats />
      
      {/* Blog - Cẩm nang */}
      <Blog />
      
      {/* Section 10: CTA */}
      <Section10CTA />
    </div>
  );
}
