'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import SectionStarryMotif from '../_components/SectionStarryMotif';

export default function CamNangPage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [displayCount, setDisplayCount] = useState(10);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resArticles, resCats] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3001/api/v1'}/articles`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3001/api/v1'}/categories`)
        ]);

        if (resArticles.ok) {
          const text = await resArticles.text();
          if (text && !text.startsWith('<')) {
            const data = JSON.parse(text);
            if (Array.isArray(data)) setArticles(data);
          }
        }

        if (resCats.ok) {
          const text = await resCats.text();
          if (text && !text.startsWith('<')) {
            const data = JSON.parse(text);
            if (Array.isArray(data)) setCategories(data);
          }
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const publishedArticles = articles.filter(a => a.status === 'PUBLISHED');

  // 1. Featured Articles
  const featuredArticles = publishedArticles.filter(a => a.isFeatured).slice(0, 4);
  const heroArticle = featuredArticles.length > 0 ? featuredArticles[0] : publishedArticles[0];
  const subHeroArticles = featuredArticles.length > 1 ? featuredArticles.slice(1, 4) : publishedArticles.slice(1, 4);

  // 2. Pinned Categories
  const pinnedCategories = categories.filter(c => c.type === 'Bài viết' && c.isPinned).slice(0, 4);
  const categoriesWithArticles = pinnedCategories.map(cat => ({
    ...cat,
    articles: publishedArticles.filter(a => a.category === cat.name).slice(0, 4)
  }));

  // 3. Latest Articles Feed (excluding Hero)
  const heroIds = new Set([heroArticle?.id, ...subHeroArticles.map(a => a?.id)]);
  const allLatestArticles = publishedArticles.filter(a => !heroIds.has(a.id));
  const latestArticles = allLatestArticles.slice(0, displayCount);
  const hasMore = displayCount < allLatestArticles.length;

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    // Synthetic delay to show off the premium skeleton UI
    setTimeout(() => {
      setDisplayCount(prev => prev + 10);
      setIsLoadingMore(false);
    }, 800);
  };

  // Tags
  const allTags = publishedArticles.map(a => a.tags).filter(Boolean).join(',').split(',').map(t => t.trim()).filter(Boolean);
  const uniqueTags = Array.from(new Set(allTags)).slice(0, 15);

  const getThumbnail = (thumbnail: any) => {
    if (!thumbnail) return '/images/blog/post-1.jpg';
    if (typeof thumbnail === 'string') return thumbnail;
    if (Array.isArray(thumbnail) && thumbnail.length > 0) return thumbnail[0];
    return '/images/blog/post-1.jpg';
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      return format(new Date(dateStr), 'dd MMMM, yyyy', { locale: vi });
    } catch {
      return '';
    }
  };

  if (isLoading) {
    return (
      <div className="pt-[120px] pb-20 min-h-screen flex items-center justify-center text-gray-900 dark:text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-[#ce9e51] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500">Đang tải Cẩm nang...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative pt-[120px] pb-20 bg-transparent dark:bg-transparent min-h-screen text-gray-900 dark:text-white">
      {/* Ambient Light Blobs for WOW Effect */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#D3AE3E]/15 blur-[120px]" />
        <div className="absolute top-[40%] right-[-10%] w-[30%] h-[50%] rounded-full bg-[#D3AE3E]/10 blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[40%] rounded-full bg-[#D3AE3E]/10 blur-[150px]" />
      </div>

      <SectionStarryMotif position="random-corner" />

      <div className="relative z-10 container mx-auto px-6 max-w-[1400px]">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">Cẩm Nang Nội Thất</h1>
          <p className="text-gray-600 dark:text-white/70 text-lg max-w-2xl mx-auto">Kiến thức chuyên sâu, mẹo hay và xu hướng mới nhất để kiến tạo không gian sống hoàn hảo.</p>
        </div>

        {/* Khối 1: Hero Featured Grid */}
        {heroArticle && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-16">
            {/* Main Hero */}
            <div className="lg:col-span-8 group relative overflow-hidden rounded-[2px] bg-gray-100 dark:bg-white/5 h-[400px] lg:h-[500px]">
              <Link href={`/cam-nang/${heroArticle.slug || heroArticle.id}`} className="block w-full h-full">
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url(${getThumbnail(heroArticle.thumbnail)})` }} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 p-8 md:p-10 w-full">
                  <span className="inline-block bg-gradient-to-r from-[#D3AE3E] to-[#E5C98A] text-[#131313] text-xs font-bold px-4 py-1.5 uppercase tracking-widest mb-4 rounded-sm shadow-[0_0_15px_rgba(211,174,62,0.4)] luxury-glow">Nổi Bật</span>
                  <h2 className="font-heading text-2xl md:text-4xl font-bold text-white mb-3 line-clamp-2 leading-tight group-hover:text-[#ce9e51] transition-colors">{heroArticle.title}</h2>
                  <p className="text-gray-300 line-clamp-2 text-sm md:text-base max-w-3xl mb-4">{heroArticle.summary || heroArticle.content?.replace(/<[^>]*>?/gm, '').substring(0, 150)}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-400 font-medium">
                    <span><i className="fa fa-user mr-1.5"></i> {heroArticle.author || 'Admin'}</span>
                    <span><i className="fa fa-calendar mr-1.5"></i> {formatDate(heroArticle.createdAt)}</span>
                    <span><i className="fa fa-eye mr-1.5"></i> {heroArticle.views || 0} lượt xem</span>
                  </div>
                </div>
              </Link>
            </div>

            {/* Sub Hero */}
            {subHeroArticles.length > 0 && (
              <div className="lg:col-span-4 flex flex-col gap-4">
                {subHeroArticles.map((article, idx) => (
                  <div key={idx} className="group flex-1 relative overflow-hidden rounded-[2px] bg-gray-100 dark:bg-white/5 min-h-[150px]">
                    <Link href={`/cam-nang/${article.slug || article.id}`} className="block w-full h-full">
                      <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url(${getThumbnail(article.thumbnail)})` }} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                      <div className="absolute bottom-0 left-0 p-5 w-full">
                        <span className="text-[#ce9e51] text-[10px] font-bold uppercase tracking-wider mb-2 block">{article.category}</span>
                        <h3 className="font-heading text-base md:text-lg font-bold text-white line-clamp-2 leading-snug group-hover:text-[#ce9e51] transition-colors mb-2">{article.title}</h3>
                        <div className="flex items-center gap-3 text-[11px] text-gray-400">
                          <span>{formatDate(article.createdAt)}</span>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Khối 2: Pinned Categories */}
        {categoriesWithArticles.length > 0 && (
          <div className="mb-20 space-y-12">
            {categoriesWithArticles.map((cat, idx) => {
              if (cat.articles.length === 0) return null;
              return (
                <div key={idx} className="border-t border-gray-200 dark:border-white/10 pt-10">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="font-heading text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                      <span className="w-1.5 h-6 bg-[#ce9e51] inline-block rounded-full"></span>
                      {cat.name}
                    </h2>
                    <Link href={`/cam-nang/danh-muc/${cat.slug}`} className="text-sm font-medium text-[#ce9e51] hover:underline underline-offset-4 flex items-center gap-2">
                      Xem tất cả <i className="fa fa-arrow-right text-[10px]"></i>
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {cat.articles.map((article: any, i: number) => (
                      <div key={i} className="group">
                        <Link href={`/cam-nang/${article.slug || article.id}`} className="block mb-4 overflow-hidden rounded-[6px] aspect-[4/3]">
                          <img src={getThumbnail(article.thumbnail)} alt={article.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        </Link>
                        <h3 className="font-heading font-bold text-lg text-gray-900 dark:text-white line-clamp-2 mb-2 group-hover:text-[#ce9e51] transition-colors">
                          <Link href={`/cam-nang/${article.slug || article.id}`}>{article.title}</Link>
                        </h3>
                        <p className="text-gray-500 dark:text-white/60 text-sm line-clamp-2 mb-3">{article.summary || article.content?.replace(/<[^>]*>?/gm, '').substring(0, 100)}</p>
                        <div className="text-xs text-gray-400 font-medium">{formatDate(article.createdAt)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Khối 3: Latest Articles & Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Feed */}
          <div className="lg:col-span-8">
            <h2 className="font-heading text-2xl font-bold text-gray-900 dark:text-white mb-8 pb-4 border-b border-gray-200 dark:border-white/10 flex items-center gap-3">
              <span className="w-1.5 h-6 bg-[#ce9e51] inline-block rounded-full"></span>
              Bài viết mới nhất
            </h2>

            <div className="space-y-8">
              {latestArticles.length === 0 && !isLoadingMore ? (
                <div className="text-gray-500 py-10 text-center border border-gray-100 dark:border-white/5 rounded-[8px]">Chưa có bài viết mới.</div>
              ) : (
                <>
                  {latestArticles.map((article, idx) => (
                    <div key={`article-${article.id || idx}`} className="group flex flex-col sm:flex-row gap-4 border-b border-gray-100 dark:border-white/5 pb-8 last:border-0">
                      <Link href={`/cam-nang/${article.slug || article.id}`} className="block sm:w-1/3 overflow-hidden rounded-[2px] aspect-[4/3] shrink-0">
                        <img src={getThumbnail(article.thumbnail)} alt={article.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      </Link>
                      <div className="sm:w-2/3 flex flex-col justify-center">
                        <span className="text-[#ce9e51] text-[11px] font-bold uppercase tracking-wider mb-2 block">{article.category}</span>
                        <h3 className="font-heading font-bold text-xl text-gray-900 dark:text-white line-clamp-2 mb-3 group-hover:text-[#ce9e51] transition-colors">
                          <Link href={`/cam-nang/${article.slug || article.id}`}>{article.title}</Link>
                        </h3>
                        <p className="text-gray-600 dark:text-white/60 text-sm line-clamp-2 mb-4 leading-relaxed">{article.summary || article.content?.replace(/<[^>]*>?/gm, '').substring(0, 150)}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-400 font-medium mt-auto">
                          <span><i className="fa fa-user mr-1.5"></i> {article.author || 'Admin'}</span>
                          <span><i className="fa fa-clock mr-1.5"></i> {formatDate(article.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Skeletons while loading more */}
                  {isLoadingMore && (
                    <>
                      {[1, 2].map((_, i) => (
                        <div key={`skeleton-${i}`} className="flex flex-col sm:flex-row gap-4 border-b border-gray-100 dark:border-white/5 pb-8 last:border-0 animate-pulse">
                          <div className="sm:w-1/3 bg-gray-200 dark:bg-white/5 rounded-[2px] aspect-[4/3] shrink-0"></div>
                          <div className="sm:w-2/3 flex flex-col justify-center py-2">
                            <div className="w-20 h-3 bg-gray-200 dark:bg-white/5 mb-4 rounded-sm"></div>
                            <div className="w-full h-6 bg-gray-200 dark:bg-white/5 mb-3 rounded-sm"></div>
                            <div className="w-3/4 h-6 bg-gray-200 dark:bg-white/5 mb-5 rounded-sm"></div>
                            <div className="w-full h-3 bg-gray-200 dark:bg-white/5 mb-2 rounded-sm"></div>
                            <div className="w-5/6 h-3 bg-gray-200 dark:bg-white/5 mb-6 rounded-sm"></div>
                            <div className="flex gap-4 mt-auto">
                              <div className="w-24 h-3 bg-gray-200 dark:bg-white/5 rounded-sm"></div>
                              <div className="w-32 h-3 bg-gray-200 dark:bg-white/5 rounded-sm"></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                </>
              )}
            </div>
            
            {hasMore && !isLoadingMore && (
              <div className="mt-10 text-center">
                <button 
                  onClick={handleLoadMore}
                  className="px-8 py-3 border-2 border-[#ce9e51] bg-transparent text-[#ce9e51] font-bold uppercase tracking-wider text-sm rounded-[2px] hover:bg-[#ce9e51] hover:text-white transition-all duration-300"
                >
                  Xem thêm bài viết
                </button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4">
            <div className="sticky top-[120px] space-y-10">

              <div className="bg-white dark:bg-[#151515] rounded-[2px] p-6 border border-[#E5E7EB] dark:border-[#333] shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)]">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-1 h-6 bg-[#ce9e51]"></div>
                  <h3 className="font-heading text-lg font-bold text-gray-900 dark:text-white uppercase tracking-wider m-0">Chuyên mục</h3>
                </div>
                <ul className="space-y-0">
                  {categories.filter(c => c.type === 'Bài viết').map((cat, idx, arr) => {
                    const count = publishedArticles.filter(a => a.category === cat.name).length;
                    return (
                      <li key={idx} className={`group ${idx !== arr.length - 1 ? 'border-b border-gray-100 dark:border-white/5' : ''}`}>
                        <Link href={`/cam-nang/danh-muc/${cat.slug}`} className="flex items-center justify-between py-3.5 px-2 text-gray-600 dark:text-gray-400 hover:text-[#ce9e51] dark:hover:text-[#ce9e51] hover:bg-gray-50 dark:hover:bg-white/5 transition-all duration-300 rounded-[2px]">
                          <span className="flex items-center gap-3 font-medium transition-transform duration-300 group-hover:translate-x-1">
                            <i className="fa fa-angle-right text-[12px] text-[#ce9e51]/50 group-hover:text-[#ce9e51]"></i>
                            {cat.name}
                          </span>
                          <span className="flex items-center justify-center min-w-[28px] h-[28px] rounded-full bg-gray-100 dark:bg-[#222] text-xs font-bold text-gray-500 dark:text-gray-400 group-hover:bg-[#ce9e51] group-hover:text-white transition-colors">
                            {count}
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Widget: Tags */}
              {uniqueTags.length > 0 && (
                <div className="bg-gray-50 dark:bg-white/5 rounded-[8px] p-6 border border-gray-100 dark:border-white/5">
                  <h3 className="font-heading text-lg font-bold text-gray-900 dark:text-white mb-5 uppercase tracking-wide">Từ khóa phổ biến</h3>
                  <div className="flex flex-wrap gap-2">
                    {uniqueTags.map((tag, idx) => (
                      <Link key={idx} href={`/cam-nang/tag/${encodeURIComponent(tag)}`} className="px-3 py-1.5 bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-[4px] text-sm text-gray-600 dark:text-white/70 hover:border-[#ce9e51] hover:text-[#ce9e51] transition-all">
                        {tag}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Widget: Banner Promo */}
              <div className="relative overflow-hidden rounded-[4px] bg-[#1a1a1a] border border-[#ce9e51]/30 group cursor-pointer shadow-[0_0_30px_rgba(206,158,81,0.1)] hover:shadow-[0_0_40px_rgba(206,158,81,0.2)] transition-shadow duration-500 p-8 text-center flex flex-col items-center justify-center min-h-[280px]">
                <div className="absolute inset-0 bg-[url('/images/blog/promo-banner.png')] bg-cover bg-center opacity-40 transition-transform duration-700 group-hover:scale-105 group-hover:opacity-50" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-[#111]/80 to-transparent" />
                <div className="relative z-10 w-full flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full border border-[#ce9e51]/50 flex items-center justify-center mb-4 bg-black/50 backdrop-blur-sm group-hover:border-[#ce9e51] transition-colors shadow-[0_0_15px_rgba(206,158,81,0.2)]">
                    <i className="fa fa-gem text-[#ce9e51] text-lg"></i>
                  </div>
                  <h4 className="text-white font-heading font-bold text-xl mb-2 tracking-widest uppercase text-center">Đặc Quyền ArcViet</h4>
                  <div className="text-[#ce9e51] font-bold text-2xl mb-3 drop-shadow-[0_0_10px_rgba(206,158,81,0.5)]">-5% ƯU ĐÃI</div>
                  <p className="text-white/80 text-sm mb-6 leading-relaxed  font-light text-center">
                    Áp dụng khi kết nối thiết kế và thi công với các đối tác thông qua hệ sinh thái <strong>ArcViet</strong>.
                  </p>
                  <button className="relative overflow-hidden bg-transparent border border-[#ce9e51] text-[#ce9e51] px-6 py-2.5 rounded-none text-[13px] font-bold uppercase tracking-widest transition-colors w-full group/btn">
                    <span className="relative z-10 group-hover/btn:text-[#111] transition-colors duration-300">Đăng ký ngay</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-[#D3AE3E] to-[#E5C98A] translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-out z-0"></div>
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
