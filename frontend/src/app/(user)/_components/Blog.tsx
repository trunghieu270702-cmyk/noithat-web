'use client';
import SectionStarryMotif from './SectionStarryMotif';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import ScrollReveal from './ScrollReveal';
import { format } from 'date-fns';

export default function Blog() {
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3001/api/v1';
        const res = await fetch(`${apiUrl}/articles`);
        if (!res.ok) {
          console.error('API error status:', res.status, res.statusText);
          const errorText = await res.text();
          console.error('API error text:', errorText);
          throw new Error('API error');
        }

        const text = await res.text();
        if (!text || text.startsWith('<')) {
          throw new Error('Invalid JSON response');
        }

        const data = JSON.parse(text);
        if (Array.isArray(data)) {
          // Map backend data to UI format
          const mappedPosts = data.slice(0, 2).map((article: any, index: number) => ({
            id: article.id,
            img: `/images/blog/post-${(index % 2) + 1}.jpg`, // Use placeholder images
            date: format(new Date(article.createdAt), 'MMMM dd, yyyy'),
            tags: [article.category],
            title: article.title,
            excerpt: article.content ? article.content.replace(/<[^>]*>?/gm, '').substring(0, 150) + '...' : 'Nội dung bài viết đang được cập nhật...',
            author: 'Chuyên gia HỆ SINH THÁI',
            categories: [article.category],
            comments: `${article.views} Lượt xem`,
            link: '#',
            imageLeft: index % 2 === 0
          }));
          setPosts(mappedPosts);
        }
      } catch (error) {
        console.error("Failed to fetch articles", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, []);

  return (
    <section id="Blog" className="relative py-32 bg-transparent dark:bg-transparent modern-section overflow-hidden">
      <SectionStarryMotif />
      <div className="max-w-[1400px] mx-auto px-6">

        {/* Section Header */}
        <ScrollReveal animation="fade-up" delay={100}>
          <div className="text-center mb-16">
            <h6 className="font-label text-[#D3AE3E] text-[13px] font-semibold tracking-[4px] uppercase mb-4">
              Blog & Cẩm Nang
            </h6>
            <h3 className="uppercase font-heading text-4xl md:text-[40px] font-bold text-gray-900 dark:text-white mb-6 tracking-tight flex justify-center gap-[2px]">
              {'Tin tức mới nhất'.split('').map((char, index) => (
                <span key={index} className={char === ' ' ? 'w-3' : ''}>{char}</span>
              ))}
            </h3>
          </div>
        </ScrollReveal>

        {/* Blog Posts */}
        <div className="flex flex-col gap-12 md:gap-0">
          {isLoading ? (
            <div className="text-center text-gray-500 dark:text-[#888] py-10">Đang tải bài viết...</div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-[#1a1a1a] shadow-sm dark:shadow-none border border-gray-100 dark:border-white/10 border border-gray-200 dark:border-white/20 rounded-[4px] mx-auto max-w-2xl w-full">
              <svg className="w-16 h-16 text-[#D3AE3E]/50 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l6 6v10a2 2 0 01-2 2z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 11v6"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 17h.01"></path></svg>
              <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3 tracking-wide">CHƯA CÓ BÀI VIẾT NÀO</h4>
              <p className="text-gray-500 dark:text-[#888] text-[15px] max-w-sm mx-auto">Nội dung cẩm nang đang được hệ sinh thái cập nhật. Bạn vui lòng quay lại sau nhé!</p>
            </div>
          ) : posts.map((post) => (
            <div key={post.id} className="grid grid-cols-1 md:grid-cols-2">

              {/* Image Box */}
              <ScrollReveal
                animation={post.imageLeft ? 'fade-right' : 'fade-left'}
                delay={200}
                className={`relative overflow-hidden aspect-[4/3] md:aspect-auto group ${post.imageLeft ? 'order-1 md:order-1' : 'order-1 md:order-2'
                  }`}
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url(${post.img})` }}
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors duration-500" />

                {/* Date Overlay */}
                <div className={`absolute top-6 ${post.imageLeft ? 'right-6' : 'left-6'} bg-[#D3AE3E] text-gray-900 dark:text-white px-4 py-2  font-bold text-[13px] uppercase tracking-wider`}>
                  {post.date}
                </div>
              </ScrollReveal>

              {/* Content Box */}
              <ScrollReveal
                animation={post.imageLeft ? 'fade-left' : 'fade-right'}
                delay={300}
                className={`flex flex-col justify-center p-8 md:p-16 lg:p-20 bg-white dark:bg-[#1a1a1a] shadow-sm dark:shadow-none border border-gray-100 dark:border-white/10 ${post.imageLeft ? 'order-2 md:order-2' : 'order-2 md:order-1'
                  }`}
              >
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {post.tags.map((tag: string, i: number) => (
                    <Link key={i} href="#" className="bg-gradient-to-r from-[#D3AE3E] to-[#E5C98A] text-[#131313] px-3 py-1 rounded-[2px] font-bold uppercase tracking-widest text-[10px] shadow-[0_0_10px_rgba(211,174,62,0.3)] luxury-glow hover:-translate-y-0.5 transition-transform">
                      {tag}
                    </Link>
                  ))}
                </div>

                {/* Title */}
                <h3 className="font-heading text-2xl lg:text-[28px] font-bold text-gray-900 dark:text-white mb-6 leading-snug">
                  <Link href={post.link} className="hover:text-[#D3AE3E] transition-colors">
                    {post.title}
                  </Link>
                </h3>

                {/* Excerpt */}
                <p className="text-gray-500 dark:text-[#888] leading-[1.8] text-[14px] md:text-[15px] mb-8">
                  {post.excerpt}
                </p>

                {/* Post Meta Bottom */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-gray-200 dark:border-white/20">
                  <ul className="flex flex-wrap gap-4 text-gray-500 dark:text-[#888] text-[13px]">
                    <li className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                      {post.author}
                    </li>
                    <li className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"></path></svg>
                      {post.categories.join(' | ')}
                    </li>
                    <li className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                      {post.comments}
                    </li>
                  </ul>

                  <Link
                    href={post.link}
                    className="flex items-center gap-2 text-[13px] font-bold tracking-widest uppercase text-[#D3AE3E] hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"></path></svg>
                    Đọc tiếp
                  </Link>
                </div>

              </ScrollReveal>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
