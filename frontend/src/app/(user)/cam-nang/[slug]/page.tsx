'use client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, Eye, User, Tag, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';

export default function ArticleDetail() {
  const params = useParams();
  const slug = params.slug as string;

  const [article, setArticle] = useState<any>(null);
  const [relatedArticles, setRelatedArticles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    const fetchArticle = async () => {
      setIsLoading(true);
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

        // The backend doesn't have a /slug endpoint, so we fetch all and find
        const res = await fetch(`${apiUrl}/articles`);
        if (!res.ok) {
          throw new Error('Không thể tải bài viết');
        }

        const allArticles = await res.json();

        // Find the article by slug or id
        const foundArticle = allArticles.find((a: any) => a.slug === slug || a.id.toString() === slug);

        if (!foundArticle) {
          throw new Error('Không tìm thấy bài viết');
        }

        setArticle(foundArticle);

        // Filter out current, match category if possible
        let related = allArticles.filter((a: any) => a.id !== foundArticle.id);
        const sameCat = related.filter((a: any) => a.category === foundArticle.category);
        if (sameCat.length > 0) {
          related = sameCat;
        }
        setRelatedArticles(related.slice(0, 3));

      } catch (err: any) {
        console.error("Failed to fetch article:", err);
        setError(err.message || 'Có lỗi xảy ra');
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticle();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="pt-32 pb-24 bg-[#FAF9F8] dark:bg-[#0a0a0a] min-h-screen flex justify-center">
        <div className="w-12 h-12 border-4 border-[#D3AE3E]/30 border-t-[#D3AE3E] rounded-full animate-spin mt-20"></div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="pt-32 pb-24 bg-[#FAF9F8] dark:bg-[#0a0a0a] min-h-screen">
        <div className="max-w-[1400px] mx-auto px-6 text-center pt-20">
          <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">Không tìm thấy bài viết</h1>
          <p className="text-gray-500 mb-8">{error || 'Bài viết có thể đã bị xóa hoặc đường dẫn không hợp lệ.'}</p>
          <Link href="/cam-nang" className="bg-[#D3AE3E] text-white px-8 py-3 rounded-[4px] font-bold uppercase tracking-wider inline-flex items-center gap-2">
            <ArrowLeft className="w-5 h-5" /> Về Cẩm Nang
          </Link>
        </div>
      </div>
    );
  }

  const formattedDate = article.createdAt
    ? format(new Date(article.createdAt), 'dd/MM/yyyy')
    : 'Đang cập nhật';

  return (
    <div className="pt-32 pb-24 bg-[#FAF9F8] dark:bg-[#0a0a0a] min-h-screen">
      <div className="max-w-[1400px] mx-auto px-6">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[13px] text-gray-500 dark:text-[#888] uppercase tracking-wider font-semibold mb-8">
          <Link href="/" className="hover:text-[#D3AE3E] transition-colors">Trang chủ</Link>
          <span className="text-gray-300 dark:text-gray-700">/</span>
          <Link href="/cam-nang" className="hover:text-[#D3AE3E] transition-colors">Cẩm nang</Link>
          <span className="text-gray-300 dark:text-gray-700">/</span>
          <span className="text-gray-900 dark:text-white truncate">{article.title}</span>
        </div>

        {/* Article Header */}
        <header className="mb-12">
          <span className="inline-block px-3 py-1 bg-[#D3AE3E]/10 text-[#D3AE3E] text-[12px] font-bold uppercase tracking-wider mb-6 rounded-sm text-[#131313]">
            {article.category || 'Tin tức'}
          </span>

          <h1 className="font-heading text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 dark:text-[#888] pb-8 border-b border-gray-200 dark:border-white/10">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-[#D3AE3E]" />
              {article.author || 'Admin'}
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#D3AE3E]" />
              {formattedDate}
            </div>
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-[#D3AE3E]" />
              {article.views || 0} lượt xem
            </div>
          </div>
        </header>

        {/* Thumbnail */}
        <div className="mb-12 aspect-[21/9] rounded-[8px] overflow-hidden bg-gray-100 dark:bg-[#131313] shadow-sm">
          <img
            src={article.thumbnail || '/images/blog/post-1.jpg'}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Summary */}
        {article.summary && (
          <div className="mb-10 text-xl text-gray-700 dark:text-[#ccc] font-medium leading-relaxed border-l-4 border-[#D3AE3E] pl-6 py-2 italic">
            {article.summary}
          </div>
        )}

        {/* Main Content */}
        <article
          className="prose prose-lg dark:prose-invert max-w-none text-gray-600 dark:text-[#bbb] 
                     prose-headings:font-heading prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white 
                     prose-a:text-[#D3AE3E] prose-img:rounded-[8px] prose-img:shadow-sm"
          dangerouslySetInnerHTML={{ __html: article.content || '<p>Nội dung đang được cập nhật...</p>' }}
        />

        {/* Tags */}
        <div className="mt-16 pt-8 border-t border-gray-200 dark:border-white/10 flex items-center gap-4">
          <Tag className="w-5 h-5 text-gray-400" />
          <div className="flex gap-2">
            <span className="px-3 py-1 bg-white dark:bg-[#131313] border border-gray-200 dark:border-white/10 text-gray-600 dark:text-[#ccc] text-sm rounded-sm">
              Nội thất
            </span>
            <span className="px-3 py-1 bg-white dark:bg-[#131313] border border-gray-200 dark:border-white/10 text-gray-600 dark:text-[#ccc] text-sm rounded-sm">
              {article.category || 'Xu hướng'}
            </span>
          </div>
        </div>

      </div>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <div className="mt-24 pt-20 bg-white dark:bg-[#131313] border-t border-gray-200 dark:border-white/5">
          <div className="max-w-[1400px] mx-auto px-6">
            <h3 className="font-heading text-3xl font-bold text-gray-900 dark:text-white mb-10 uppercase tracking-wider text-center">
              Bài viết <span className="text-[#D3AE3E]">Liên quan</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedArticles.map((rel) => (
                <Link href={`/cam-nang/${rel.slug || rel.id}`} key={rel.id} className="group bg-[#FAF9F8] dark:bg-[#0a0a0a] rounded-[8px] overflow-hidden border border-gray-100 dark:border-white/5 hover:-translate-y-2 transition-transform duration-300 shadow-sm">
                  <div className="aspect-[16/9] overflow-hidden relative">
                    <img src={rel.thumbnail || '/images/blog/post-2.jpg'} alt={rel.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute top-4 left-4 bg-[#D3AE3E] text-white text-[10px] font-bold uppercase tracking-widest px-2 py-1">
                      {rel.category}
                    </div>
                  </div>
                  <div className="p-6">
                    <h4 className="font-heading text-xl font-bold text-gray-900 dark:text-white group-hover:text-[#D3AE3E] transition-colors mb-3 line-clamp-2">
                      {rel.title}
                    </h4>
                    <p className="text-gray-500 dark:text-[#888] text-sm line-clamp-2 mb-4">
                      {rel.summary || rel.content?.replace(/<[^>]*>?/gm, '') || 'Đang cập nhật...'}
                    </p>
                    <span className="text-[#D3AE3E] text-[13px] font-bold uppercase tracking-wider flex items-center gap-2">
                      Đọc tiếp <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
