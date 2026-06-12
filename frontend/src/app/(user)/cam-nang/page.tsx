'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export default function CamNangPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [featuredPost, setFeaturedPost] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'}/articles`);
        if (!res.ok) throw new Error('API error');
        const text = await res.text();
        if (!text || text.startsWith('<')) throw new Error('Invalid JSON response');
        const data = JSON.parse(text);
        if (Array.isArray(data)) {
          const articles = data;
          
          if (articles.length > 0) {
            setFeaturedPost(articles[0]);
          }

          // Group by category
          const grouped = articles.reduce((acc: any, article: any) => {
            const cat = article.category || 'Tin tức chung';
            if (!acc[cat]) {
              acc[cat] = { title: cat, articles: [] };
            }
            acc[cat].articles.push(article);
            return acc;
          }, {});

          setCategories(Object.values(grouped));
        }
      } catch (error) {
        console.error('Failed to fetch articles:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchArticles();
  }, []);

  return (
    <div className="pt-[120px] pb-20 bg-[#FAF9F8] dark:bg-[#131313] min-h-screen text-gray-900 dark:text-white">
      <div className="container mx-auto px-6 max-w-[1200px]">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">Cẩm nang nội thất</h1>
          <p className="text-gray-600 dark:text-white/70 text-lg max-w-3xl mx-auto">Kiến thức hữu ích giúp bạn trang bị thêm kinh nghiệm trước khi quyết định làm nội thất, từ việc chọn đơn vị, quản lý ngân sách đến giám sát thi công.</p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {isLoading ? (
            <div className="col-span-2 text-center text-gray-400 dark:text-white/50 py-10">Đang tải chuyên mục...</div>
          ) : categories.length === 0 ? (
            <div className="col-span-1 md:col-span-2 bg-white dark:bg-[#1c1c1c] shadow-sm dark:shadow-none border border-gray-200 dark:border-white/5 rounded-[8px] p-16 text-center flex flex-col items-center justify-center min-h-[400px]">
              <div className="w-24 h-24 bg-[#ce9e51]/10 text-[#ce9e51] rounded-full flex items-center justify-center text-4xl mb-6 shadow-[0_0_30px_rgba(206,158,81,0.15)]">
                <i className="fa fa-book-open"></i>
              </div>
              <h3 className="font-heading text-2xl font-bold text-gray-900 dark:text-white mb-4">Chưa có bài viết nào</h3>
              <p className="text-gray-500 dark:text-white/60 max-w-md mx-auto text-lg">Hệ thống đang chuẩn bị những kiến thức nội thất hữu ích nhất dành cho bạn. Vui lòng quay lại sau!</p>
            </div>
          ) : categories.map((cat, idx) => (
            <div key={idx} className="bg-white dark:bg-[#1c1c1c] shadow-sm dark:shadow-none p-8 rounded-[8px] border border-gray-200 dark:border-white/5 hover:border-[#ce9e51]/30 transition-colors">
              <h2 className="font-heading text-2xl font-bold mb-6 text-[#ce9e51] flex items-center gap-3">
                <span className="w-8 h-1 bg-[#ce9e51] inline-block"></span>
                {cat.title}
              </h2>
              <ul className="space-y-4">
                {cat.articles.slice(0, 5).map((article: any, i: number) => (
                  <li key={i}>
                    <Link href={`/cam-nang/${article.slug || article.id}`} className="group flex items-start gap-3 text-gray-700 dark:text-white/80 hover:text-gray-900 dark:hover:text-white transition-colors">
                      <i className="fa fa-chevron-right mt-1.5 text-xs text-gray-300 dark:text-white/30 group-hover:text-[#ce9e51] transition-colors"></i>
                      <span className="leading-relaxed group-hover:underline underline-offset-4 decoration-[#ce9e51]/50">{article.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Featured Article Layout */}
        {featuredPost && (
          <div className="bg-gradient-to-r from-white to-[#FAF9F8] dark:from-[#1c1c1c] dark:to-[#131313] shadow-sm dark:shadow-none rounded-[8px] border border-gray-200 dark:border-white/10 overflow-hidden flex flex-col md:flex-row">
            <div className="w-full md:w-1/2 h-[300px] md:h-auto bg-gray-100 dark:bg-white/5 relative">
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${featuredPost.image || '/images/blog/post-1.jpg'})` }}
              />
            </div>
            <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
              <span className="inline-block bg-[#ce9e51]/20 text-[#ce9e51] text-xs font-bold px-3 py-1 rounded-[8px] uppercase tracking-wider mb-4 w-max">
                Bài viết nổi bật
              </span>
              <h3 className="font-heading text-3xl font-bold mb-4">{featuredPost.title}</h3>
              <p className="text-gray-600 dark:text-white/70 mb-8 line-clamp-3">
                {featuredPost.content ? featuredPost.content.replace(/<[^>]*>?/gm, '').substring(0, 150) + '...' : 'Đang cập nhật...'}
              </p>
              <Link href={`/cam-nang/${featuredPost.slug || featuredPost.id}`} className="inline-flex items-center gap-2 text-[#ce9e51] hover:text-gray-900 dark:hover:text-white font-bold uppercase tracking-wider text-sm transition-colors">
                Đọc tiếp <i className="fa fa-arrow-right"></i>
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
