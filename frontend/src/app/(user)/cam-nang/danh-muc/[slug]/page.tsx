'use client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { ArrowLeft } from 'lucide-react';

export default function CategoryArchivePage() {
  const params = useParams();
  const slug = params.slug as string;

  const [articles, setArticles] = useState<any[]>([]);
  const [category, setCategory] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

        // Fetch categories to get the category name by slug
        const resCats = await fetch(`${apiUrl}/categories`);
        if (!resCats.ok) throw new Error('Lỗi lấy danh mục');
        const catsData = await resCats.json();
        
        const foundCategory = catsData.find((c: any) => c.slug === slug);
        
        if (!foundCategory) {
          setError('Không tìm thấy danh mục');
          setIsLoading(false);
          return;
        }
        
        setCategory(foundCategory);

        // Fetch articles
        const resArticles = await fetch(`${apiUrl}/articles`);
        if (!resArticles.ok) throw new Error('Lỗi lấy bài viết');
        const articlesData = await resArticles.json();

        // Filter articles by category name and PUBLISHED status
        const categoryArticles = articlesData.filter((a: any) => a.status === 'PUBLISHED' && a.category === foundCategory.name);
        setArticles(categoryArticles);

      } catch (err: any) {
        console.error("Failed to fetch data:", err);
        setError(err.message || 'Có lỗi xảy ra');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  const getThumbnail = (thumbnail: any) => {
    if (!thumbnail) return '/images/blog/post-1.jpg';
    if (typeof thumbnail === 'string') return thumbnail;
    if (Array.isArray(thumbnail) && thumbnail.length > 0) return thumbnail[0];
    return '/images/blog/post-1.jpg';
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      return format(new Date(dateStr), 'dd/MM/yyyy', { locale: vi });
    } catch {
      return '';
    }
  };

  if (isLoading) {
    return (
      <div className="pt-32 pb-20 min-h-screen flex items-center justify-center text-gray-900 dark:text-white">
        <div className="w-10 h-10 border-4 border-[#ce9e51] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="pt-32 pb-20 min-h-screen text-center">
        <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">Danh mục không tồn tại</h1>
        <p className="text-gray-500 mb-8">{error || 'Đường dẫn bạn truy cập có thể đã bị thay đổi.'}</p>
        <Link href="/cam-nang" className="bg-[#ce9e51] text-white px-8 py-3 rounded-[2px] font-bold uppercase tracking-wider inline-flex items-center gap-2">
          <ArrowLeft className="w-5 h-5" /> Về Cẩm Nang
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-[120px] pb-24 bg-transparent dark:bg-transparent min-h-screen text-gray-900 dark:text-white">
      <div className="container mx-auto px-6 max-w-[1200px]">
        
        {/* Breadcrumb & Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 text-[13px] text-gray-500 uppercase tracking-wider font-semibold mb-6">
            <Link href="/" className="hover:text-[#ce9e51] transition-colors">Trang chủ</Link>
            <span>/</span>
            <Link href="/cam-nang" className="hover:text-[#ce9e51] transition-colors">Cẩm nang</Link>
            <span>/</span>
            <span className="text-[#ce9e51]">{category.name}</span>
          </div>
          
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {category.name}
          </h1>
          <div className="w-16 h-1 bg-[#ce9e51] mx-auto rounded-full"></div>
        </div>

        {/* Article Grid */}
        {articles.length === 0 ? (
          <div className="text-center py-20 border border-gray-100 dark:border-white/5 rounded-[4px] bg-gray-50 dark:bg-white/5">
            <div className="w-16 h-16 mx-auto bg-gray-200 dark:bg-white/10 rounded-full flex items-center justify-center mb-4 text-gray-400">
              <i className="fa fa-folder-open text-2xl"></i>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Chưa có bài viết</h3>
            <p className="text-gray-500">Chuyên mục này hiện đang được cập nhật nội dung.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article, idx) => (
              <Link href={`/cam-nang/${article.slug || article.id}`} key={idx} className="group flex flex-col bg-gray-50 dark:bg-[#1a1a1a] rounded-[4px] overflow-hidden border border-gray-100 dark:border-white/5 hover:-translate-y-2 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-[#ce9e51]/10">
                <div className="aspect-[4/3] overflow-hidden relative">
                  <img src={getThumbnail(article.thumbnail)} alt={article.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-4 left-4 bg-gradient-to-r from-[#D3AE3E] to-[#E5C98A] text-[#131313] text-[10px] font-bold uppercase tracking-widest px-3 py-1 shadow-sm">
                    {article.category}
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="font-heading font-bold text-xl text-gray-900 dark:text-white line-clamp-2 mb-3 group-hover:text-[#ce9e51] transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-gray-500 dark:text-white/60 text-sm line-clamp-3 mb-6 leading-relaxed flex-1">
                    {article.summary || article.content?.replace(/<[^>]*>?/gm, '').substring(0, 150)}
                  </p>
                  <div className="flex items-center justify-between text-[11px] font-bold text-gray-400 uppercase tracking-widest pt-4 border-t border-gray-200 dark:border-white/5">
                    <span className="flex items-center gap-1.5"><i className="fa fa-calendar text-[#ce9e51]"></i> {formatDate(article.createdAt)}</span>
                    <span className="text-[#ce9e51] flex items-center gap-1 group-hover:gap-2 transition-all">Đọc tiếp <i className="fa fa-arrow-right"></i></span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
