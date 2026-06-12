import React from 'react';
import Link from 'next/link';
import ScrollReveal from './ScrollReveal';

const RECENT_POSTS = [
  {
    id: 1,
    title: 'In Good Taste: Mark Finlay Architects and Interiors',
    date: 'February 26, 2020',
    img: '/images/blog/post-1.jpg',
    link: '#'
  },
  {
    id: 2,
    title: 'Five Things You Should Know About Modern Furniture.',
    date: 'August 28, 2019',
    img: '/images/blog/post-2.jpg',
    link: '#'
  }
];

const SERVICES = [
  { name: 'Interior Design', link: '#' },
  { name: 'Architecture Modeling', link: '#' },
  { name: 'Rendering Buildings', link: '#' },
  { name: 'Landscape works', link: '#' }
];

const GALLERY = [
  '/images/gallery/thumb-1.jpg',
  '/images/gallery/thumb-2.jpg',
  '/images/gallery/thumb-3.jpg',
  '/images/gallery/thumb-4.jpg',
  '/images/gallery/thumb-5.jpg',
  '/images/gallery/thumb-6.jpg'
];

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-[#131313] pt-24 pb-8 border-t border-gray-200 dark:border-white/20">
      <div className="max-w-[1200px] mx-auto px-6">
        
        {/* Top Section: 4 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Column 1: Let's Connect */}
          <ScrollReveal animation="fade-up" delay={100}>
            <h3 className="font-heading text-xl font-bold text-gray-900 dark:text-white mb-6 relative pb-4 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-12 after:h-[2px] after:bg-[#D3AE3E]">
              Let's Connect
            </h3>
            <p className="text-gray-600 dark:text-[#ccc] text-[15px] mb-6">
              Luctus nec ullamcorper mattis:
            </p>
            <ul className="space-y-4 text-gray-500 dark:text-[#888] text-[14px]">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-[#D3AE3E] mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                <span>2659 Autostrad St, London, UK</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-[#D3AE3E] mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                <span>+12 3 1462 2249, 2248</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-[#D3AE3E] mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                <span>Support@company.com</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-[#D3AE3E] mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <span>Mon - Fri / 9:00 AM - 6:00 PM</span>
              </li>
            </ul>
          </ScrollReveal>

          {/* Column 2: Recent Posts */}
          <ScrollReveal animation="fade-up" delay={200}>
            <h3 className="font-heading text-xl font-bold text-gray-900 dark:text-white mb-6 relative pb-4 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-12 after:h-[2px] after:bg-[#D3AE3E]">
              Recent Posts
            </h3>
            <div className="space-y-6">
              {RECENT_POSTS.map(post => (
                <div key={post.id} className="flex gap-4 group cursor-pointer">
                  <div className="w-20 h-20 shrink-0 overflow-hidden bg-gray-100 dark:bg-[#1a1a1a]">
                    <img src={post.img} alt="Post Thumbnail" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div>
                    <h4 className="text-[14px] font-bold text-gray-900 dark:text-white leading-snug mb-2 group-hover:text-[#D3AE3E] transition-colors line-clamp-2">
                      <Link href={post.link}>{post.title}</Link>
                    </h4>
                    <p className="font-label text-gray-500 dark:text-[#888] text-[12px] uppercase tracking-wider">
                      {post.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>

          {/* Column 3: Our Services */}
          <ScrollReveal animation="fade-up" delay={300}>
            <h3 className="font-heading text-xl font-bold text-gray-900 dark:text-white mb-6 relative pb-4 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-12 after:h-[2px] after:bg-[#D3AE3E]">
              Our Services
            </h3>
            <ul className="space-y-3">
              {SERVICES.map((srv, index) => (
                <li key={index}>
                  <Link href={srv.link} className="flex items-center gap-3 text-gray-500 dark:text-[#888] hover:text-[#D3AE3E] text-[14px] transition-colors group">
                    <svg className="w-4 h-4 text-[#D3AE3E] opacity-70 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    {srv.name}
                  </Link>
                </li>
              ))}
            </ul>
          </ScrollReveal>

          {/* Column 4: Our Gallery */}
          <ScrollReveal animation="fade-up" delay={400}>
            <h3 className="font-heading text-xl font-bold text-gray-900 dark:text-white mb-6 relative pb-4 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-12 after:h-[2px] after:bg-[#D3AE3E]">
              Our Gallery
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {GALLERY.map((imgUrl, idx) => (
                <div key={idx} className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-[#1a1a1a] cursor-pointer group">
                  <img src={imgUrl} alt="Gallery item" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-80 group-hover:opacity-100" />
                  <div className="absolute inset-0 bg-[#D3AE3E]/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"></path></svg>
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>

        </div>

        {/* Bottom Section */}
        <ScrollReveal animation="fade-up" delay={500}>
          <div className="pt-8 border-t border-gray-200 dark:border-white/20 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="w-48 opacity-90 hover:opacity-100 transition-opacity cursor-pointer">
              <img 
                src="/images/logo-main2.png" 
                alt="Logo" 
                className="w-full h-auto transition-transform hover:scale-105" 
              />
            </div>
            <div className="text-[13px] text-gray-500 dark:text-[#888] hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer text-center md:text-right">
              Terms of use | Privacy Environmental Policy
            </div>
          </div>
        </ScrollReveal>

      </div>
    </footer>
  );
}
