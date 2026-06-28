"use client";
import { useConfirm } from '@/hooks/useConfirm';
import React, { useState } from 'react';
import { Search, Filter, FileText, Plus, Edit, Trash2, X, CheckCircle2, ChevronLeft, ChevronRight, Image as ImageIcon, SearchCode, LayoutTemplate, Check, ArrowUpDown, ChevronDown, ChevronUp, User, Eye, Tag, Link, PenTool, RotateCcw, Loader2, FolderOpen } from 'lucide-react';
import { useRouter } from 'next/navigation';
import apiClient from '@/admin-lib/apiClient';
import { format } from 'date-fns';
import TiptapEditor from '@/admin-components/ui/TiptapEditor';
import CustomDropdown from '@/admin-components/ui/CustomDropdown';
import { ImageUploader } from '@/admin-components/ui/image-uploader';
import { ActionMenu } from '@/admin-components/ui/ActionMenu';
import ConfirmModal from '@/admin-components/ui/ConfirmModal';
import { toast } from 'sonner';

const STATUS_MAP: Record<string, string> = {
  'PUBLISHED': 'Đã xuất bản',
  'DRAFT': 'Bản nháp'
};

export default function ArticlesPage() {
  const { confirm } = useConfirm();
  const router = useRouter();
  const [data, setData] = useState<any[]>([]);
  const [CATEGORIES, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchArticles = async () => {
    try {
      setIsLoading(true);
      const res = await apiClient.get('/articles');
      setData(Array.isArray(res.data) ? res.data : []);
      const catRes = await apiClient.get('/categories');
      const articleCats = (catRes.data as any[]).filter((c: any) => c.type === 'Bài viết').map((c: any) => c.name);
      setCategories(articleCats);
    } catch (error) {
      console.error('Failed to fetch articles or categories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchArticles();
  }, []);
  const [page, setPage] = useState(0);
  const [itemsPerPage] = useState(25);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Modals
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [activeTab, setActiveTab] = useState('basic');

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(false);
  const [isSummaryCollapsed, setIsSummaryCollapsed] = useState(false);

  const [openCategoryPopover, setOpenCategoryPopover] = useState(false);

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false, title: '', desc: '', onConfirm: () => {}
  });

  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null);

  const activeFiltersCount = (categoryFilter.length > 0 ? 1 : 0);
  const hasActiveFilter = activeFiltersCount > 0;

  const [formData, setFormData] = useState<any>({
    id: '', title: '', slug: '', category: 'Kinh nghiệm chọn đơn vị', author: 'Admin',
    summary: '', content: '', thumbnail: [], views: 0, status: 'DRAFT',
    isFeatured: false, tags: '',
    metaTitle: '', metaDescription: '', keyword: '', faqSchema: false, publishedAt: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const filteredData = data.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter.length === 0 || categoryFilter.includes(article.category);
    return matchesSearch && matchesCategory;
  });

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortConfig) return 0;
    const { key, direction } = sortConfig;
    let aValue: any = a[key as keyof typeof a];
    let bValue: any = b[key as keyof typeof b];
    if (aValue < bValue) return direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return direction === 'asc' ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sortedData.length / itemsPerPage) || 1;
  const currentData = sortedData.slice(page * itemsPerPage, (page + 1) * itemsPerPage);

  const summary = {
    totalItems: data.length,
    publishedCount: data.filter(d => d.status === 'PUBLISHED').length,
    draftCount: data.filter(d => d.status === 'DRAFT').length,
    totalViews: data.reduce((acc, curr) => acc + (curr.views || 0), 0)
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === currentData.length && currentData.length > 0) setSelectedIds([]);
    else setSelectedIds(currentData.map(c => c.id.toString()));
  };

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) setSelectedIds(selectedIds.filter(i => i !== id));
    else setSelectedIds([...selectedIds, id]);
  };

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  const SortIcon = ({ columnKey }: { columnKey: string }) => {
    if (sortConfig?.key !== columnKey) return <ArrowUpDown className="w-3 h-3 ml-1 opacity-50" />;
    return sortConfig.direction === 'asc' ? <ChevronUp className="w-3 h-3 ml-1" /> : <ChevronDown className="w-3 h-3 ml-1" />;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const newErrors: Record<string, string> = {};
    if (!formData.title?.trim()) newErrors.title = 'Tiêu đề bài viết không được để trống';
    const contentText = formData.content?.replace(/<[^>]*>?/gm, '').trim();
    if (!contentText) newErrors.content = 'Nội dung bài viết không được để trống';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }
    setErrors({});

    const dataToSave = {
      ...formData,
      thumbnail: Array.isArray(formData.thumbnail) && formData.thumbnail.length > 0 ? formData.thumbnail[0] : ''
    };

    try {
      if (modalMode === 'add') {
        const { id, ...createData } = dataToSave;
        if (!createData.slug) createData.slug = createData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.floor(Math.random() * 10000);
        await apiClient.post('/articles', createData);
      } else {
        const { id, ...updateData } = dataToSave;
        if (!updateData.slug) updateData.slug = updateData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.floor(Math.random() * 10000);
        await apiClient.patch(`/articles/${id}`, updateData);
      }
      setIsDrawerOpen(false);
      fetchArticles();
    } catch (error) {
      console.error('Failed to save article:', error);
    }
  };

  const handleDelete = (id: number) => {
    setConfirmModal({
      isOpen: true,
      title: 'Xóa bài viết',
      desc: 'Bạn có chắc chắn muốn xóa bài viết này? Hành động này không thể hoàn tác.',
      onConfirm: async () => {
        try {
          await apiClient.delete(`/articles/${id}`);
          toast.success('Xóa bài viết thành công');
          fetchArticles();
        } catch (error) {
          console.error('Failed to delete article:', error);
          toast.error('Có lỗi xảy ra khi xóa bài viết');
        } finally {
          setConfirmModal(prev => ({ ...prev, isOpen: false }));
        }
      }
    });
  };

  const handleBulkDelete = async () => {
    confirm({
      title: 'Xác nhận xóa hàng loạt',
      description: `Bạn có chắc chắn muốn xóa ${selectedIds.length} bài viết đã chọn?`,
      variant: 'danger',
      onConfirm: async () => {
        try {
      await Promise.all(selectedIds.map(id => apiClient.delete(`/articles/${id}`)));
      setSelectedIds([]);
      fetchArticles();
      toast.success('Đã xóa thành công!');
    } catch (error) {
      console.error('Failed to delete articles:', error);
      toast.error('Lỗi khi xóa bài viết');
    }
      }
    });
  };

  const handleQuickPublish = async (article: any) => {
    try {
      const newStatus = article.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
      await apiClient.patch(`/articles/${article.id}`, { status: newStatus });
      fetchArticles();
    } catch (error) {
      console.error('Failed to update article status:', error);
    }
  };

  const tabs = [
    { id: 'basic', label: 'Nội dung bài viết' },
    { id: 'config', label: 'Phân loại & Thuộc tính' },
    { id: 'seo', label: 'Cấu hình SEO' },
  ];

  return (
    <div className="h-full flex flex-col space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Top Header & Filters */}
      <div className="flex flex-col gap-3 flex-shrink-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white dark:bg-[#14151a] p-3 rounded-[4px] border border-gray-200 dark:border-gray-800">
          <div className="flex flex-1 items-center gap-2 max-w-xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setPage(0); }}
                placeholder="Tìm Tên bài viết..."
                className="pl-9 pr-4 py-2 bg-gray-50/50 dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-800 rounded-[4px] text-sm focus:outline-none focus:ring-[3px] focus:ring-[#5865f2]/20 w-full text-gray-900 dark:text-white transition-all"
              />
            </div>

            <button
              onClick={() => setIsFiltersExpanded(!isFiltersExpanded)}
              className={`flex items-center gap-2 px-3 h-[38px] rounded-[4px] text-sm font-medium transition-all border cursor-pointer ${isFiltersExpanded
                ? 'bg-[#5865f2]/10 text-[#5865f2] border-[#5865f2]/50 font-medium'
                : 'bg-white dark:bg-[#14151a] border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#262930] dark:bg-[#1a1b23]'
                }`}
            >
              <Filter className="w-4 h-4" />
              <span>Bộ lọc</span>
              {activeFiltersCount > 0 && <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 bg-[#5865f2] text-white text-[11px] font-medium rounded-full">{activeFiltersCount}</span>}
            </button>
          </div>

          {/* Action Buttons Group */}
          <div className="flex items-center gap-2 justify-end">
            {selectedIds.length > 0 && (
              <button
                onClick={handleBulkDelete}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-[4px] text-sm font-medium transition-colors border-0 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                Xóa ({selectedIds.length})
              </button>
            )}
            <button
              onClick={() => {
                setModalMode('add');
                setFormData({
                  id: '', title: '', slug: '', category: 'Kinh nghiệm chọn đơn vị', author: 'Admin',
                  summary: '', content: '', thumbnail: [], views: 0, status: 'DRAFT',
                  metaTitle: '', metaDescription: '', keyword: '', faqSchema: false, publishedAt: ''
                });
                setErrors({});
                setActiveTab('basic');
                setIsDrawerOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-[#5865f2] hover:bg-[#4752c4] text-white rounded-[4px] text-sm font-medium transition-colors border-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Viết bài mới
            </button>
          </div>
        </div>

        {isFiltersExpanded && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-gray-50/50 dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-800 rounded-[4px] animate-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col gap-1.5 relative">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Chuyên mục</span>
              <button onClick={() => setOpenCategoryPopover(!openCategoryPopover)} className="flex items-center justify-between w-full h-9 px-3 bg-white dark:bg-[#14151a] border border-gray-200 dark:border-gray-800 rounded-[4px] text-sm text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-[#262930] dark:bg-[#1a1b23]">
                <span className="truncate">{categoryFilter.length === 0 ? "Tất cả chuyên mục" : categoryFilter.join(', ')}</span>
                <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400 shrink-0 ml-2" />
              </button>
              {openCategoryPopover && (
                <>
                  <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); setOpenCategoryPopover(false); }} />
                  <div className="absolute top-16 left-0 z-50 w-full p-2 bg-white dark:bg-[#14151a] border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm shadow-black/5 dark:shadow-none">
                    <div className="flex flex-col gap-1">
                      {CATEGORIES.map((val) => (
                        <label key={val} className="flex items-center gap-2.5 p-2 rounded-[4px] hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-800 cursor-pointer text-sm">
                          <input type="checkbox" checked={categoryFilter.includes(val)} onChange={(e) => {
                            if (e.target.checked) setCategoryFilter([...categoryFilter, val]);
                            else setCategoryFilter(categoryFilter.filter(s => s !== val));
                            setPage(0);
                          }} className="w-4 h-4 text-[#5865f2] rounded-[4px] border-gray-300" />
                          <span>{val}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Active tags */}
        <div className="flex flex-wrap items-center gap-2 mt-1">
          {hasActiveFilter && <span className="text-sm text-gray-500 dark:text-gray-400 font-medium mr-1">Đang lọc:</span>}
          {categoryFilter.length > 0 && (
            <div className="flex items-center gap-1.5 pl-2.5 pr-1 py-1 bg-[#5865f2]/10 text-[#5865f2] border border-[#5865f2]/20 rounded-[4px] text-sm font-medium">
              Chuyên mục: {categoryFilter.join(', ')}
              <button onClick={() => setCategoryFilter([])} className="p-0.5 hover:bg-[#5865f2]/20 rounded-[4px] transition-colors ml-1"><X className="w-3.5 h-3.5" /></button>
            </div>
          )}
          {hasActiveFilter && (
            <button onClick={() => { setCategoryFilter([]); setPage(0); }} className="flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] border border-red-500 text-xs font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors ml-2"><RotateCcw strokeWidth={2} className="w-3.5 h-3.5" /> Đặt lại</button>
          )}
        </div>
      </div>

      {/* Summary Card */}
      <div className="rounded-[4px] border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#14151a] flex-shrink-0 transition-all duration-300">
        <div className={`p-4 ${isSummaryCollapsed ? 'pb-4' : 'sm:p-5 sm:pb-5'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h3 className=" font-medium text-gray-900 dark:text-white text-sm">Tổng Quan Cẩm Nang</h3>
              {!isSummaryCollapsed && <span className="text-xs text-gray-500 dark:text-gray-400">{summary.totalItems} bài viết</span>}
            </div>

            {isSummaryCollapsed && (
              <div className="flex-1 flex items-center justify-end px-6 gap-5">
                <div className="flex items-center gap-3 text-sm font-medium">
                  <span className="text-emerald-600">{summary.publishedCount} Đã xuất bản</span>
                  <span className="text-gray-500 dark:text-gray-400">{summary.draftCount} Bản nháp</span>
                </div>
              </div>
            )}

            <button onClick={() => setIsSummaryCollapsed(!isSummaryCollapsed)} className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-800 rounded-[4px] text-xs font-medium cursor-pointer">
              {isSummaryCollapsed ? 'Mở rộng' : 'Thu gọn'}
              {isSummaryCollapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
            </button>
          </div>

          {!isSummaryCollapsed && (
            <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-[4px] border border-blue-100 dark:border-blue-500/20 bg-blue-50/50 dark:bg-blue-500/10">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-2 h-2 bg-blue-500 rounded-[4px]"></div><span className="text-xs font-medium text-gray-700 dark:text-gray-300">Tổng bài viết</span>
                </div>
                <div className="text-2xl font-medium text-blue-700 dark:text-blue-400">{summary.totalItems}</div>
              </div>
              <div className="p-3.5 rounded-[4px] border border-emerald-100 dark:border-emerald-900/30 bg-emerald-50/50 dark:bg-emerald-500/10">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-2 h-2 bg-emerald-50 dark:bg-emerald-500/100 rounded-[4px]"></div><span className="text-xs font-medium text-gray-700 dark:text-gray-300">Đã xuất bản</span>
                </div>
                <div className="text-2xl font-medium text-emerald-700 dark:text-emerald-400">{summary.publishedCount}</div>
              </div>
              <div className="p-3.5 rounded-[4px] border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#1a1b23]">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-2 h-2 bg-gray-50 dark:bg-[#1a1b23]0 rounded-[4px]"></div><span className="text-xs font-medium text-gray-700 dark:text-gray-300">Bản nháp</span>
                </div>
                <div className="text-2xl font-medium text-gray-700 dark:text-gray-300">{summary.draftCount}</div>
              </div>
              <div className="p-3.5 rounded-[4px] border border-purple-100 dark:border-purple-900/30 bg-purple-50/50 dark:bg-purple-500/10">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-2 h-2 bg-purple-500 rounded-[4px]"></div><span className="text-xs font-medium text-gray-700 dark:text-gray-300">Tổng lượt xem</span>
                </div>
                <div className="text-2xl font-medium text-purple-700">{summary.totalViews.toLocaleString('vi-VN')}</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Data Table */}
      <div className="flex-1 flex flex-col min-h-0 rounded-[4px] border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#14151a] overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <table className="w-full text-left border-collapse min-w-max">
            <thead className="sticky top-0 z-10 bg-gray-50 dark:bg-[#1a1b23] border-b border-gray-200 dark:border-gray-800">
              <tr>
                <th className="px-5 py-3.5 font-medium text-gray-500 dark:text-gray-400 text-xs w-[40%]">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-4 h-4 rounded-[4px] border flex items-center justify-center cursor-pointer transition-colors ${selectedIds.length === currentData.length && currentData.length > 0 ? 'bg-[#5865f2] border-[#5865f2]' : 'border-gray-300'
                        }`}
                      onClick={toggleSelectAll}
                    >
                      {selectedIds.length === currentData.length && currentData.length > 0 && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <div className="flex items-center cursor-pointer select-none uppercase tracking-wide" onClick={() => handleSort('title')}>
                      Bài viết <SortIcon columnKey="title" />
                    </div>
                  </div>
                </th>
                <th className="px-5 py-3.5 font-medium text-gray-500 dark:text-gray-400 text-xs border-l border-gray-200 dark:border-gray-800 uppercase" onClick={() => handleSort('category')}>
                  <div className="flex items-center cursor-pointer">Chuyên mục & Tác giả <SortIcon columnKey="category" /></div>
                </th>
                <th className="px-5 py-3.5 font-medium text-gray-500 dark:text-gray-400 text-xs border-l border-gray-200 dark:border-gray-800 uppercase" onClick={() => handleSort('views')}>
                  <div className="flex items-center cursor-pointer">Lượt xem <SortIcon columnKey="views" /></div>
                </th>
                <th className="px-5 py-3.5 font-medium text-gray-500 dark:text-gray-400 text-xs border-l border-gray-200 dark:border-gray-800 uppercase" onClick={() => handleSort('status')}>
                  <div className="flex items-center cursor-pointer">Trạng thái <SortIcon columnKey="status" /></div>
                </th>
                <th className="px-5 py-3.5 font-medium text-gray-500 dark:text-gray-400 text-xs border-l border-gray-200 dark:border-gray-800 text-center w-24">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-5 py-24 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                      <Loader2 className="w-8 h-8 animate-spin text-[#5865f2] mb-4" />
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">Đang tải dữ liệu...</h3>
                    </div>
                  </td>
                </tr>
              ) : currentData.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-24 text-center animate-in fade-in zoom-in-95 duration-500">
                    <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4 border border-gray-200 dark:border-gray-800">
                        <FolderOpen className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-base font-medium text-gray-900 dark:text-white mb-1">Không có dữ liệu</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Chưa có bài viết nào. Hãy tạo bài viết đầu tiên của bạn.</p>
                      <button
                        onClick={() => {
                          setModalMode('add');
                          setFormData({ id: '', title: '', slug: '', category: CATEGORIES.length > 0 ? CATEGORIES[0] : '', author: 'Admin', views: 0, status: 'DRAFT', content: '', thumbnail: [], tags: [], metaTitle: '', metaDescription: '' });
                          setErrors({});
                          setActiveTab('basic');
                          setIsDrawerOpen(true);
                        }}
                        className="flex items-center gap-2 px-5 py-2.5 bg-[#5865f2] hover:bg-[#4752c4] text-white rounded-[4px] text-sm font-medium transition-colors"
                      >
                        <Plus className="w-4 h-4" /> Viết Bài Mới
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                currentData.map((article, index) => (
                  <tr key={article.id} className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50/50 dark:hover:bg-[#262930] dark:bg-[#1a1b23] transition-colors group animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-4 h-4 rounded-[4px] border flex items-center justify-center cursor-pointer transition-colors shrink-0 ${selectedIds.includes(article.id.toString()) ? 'bg-[#5865f2] border-[#5865f2]' : 'border-gray-300'
                            }`}
                          onClick={() => toggleSelect(article.id.toString())}
                        >
                          {selectedIds.includes(article.id.toString()) && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-16 h-12 rounded-[4px] bg-gray-100 dark:bg-gray-800 shrink-0 overflow-hidden border border-gray-200 dark:border-gray-800 flex items-center justify-center">
                            {article.thumbnail ? <img src={article.thumbnail} alt="" className="w-full h-full object-cover" /> : <ImageIcon className="w-5 h-5 text-gray-400" />}
                          </div>
                          <div>
                            <div className="font-medium text-sm text-gray-900 dark:text-white line-clamp-2 leading-tight">{article.title}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{format(new Date(article.createdAt), 'dd/MM/yyyy')}</div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 border-l border-gray-200 dark:border-gray-800">
                      <div className="text-sm text-gray-900 dark:text-white font-medium mb-1">{article.category}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{article.author || 'Admin'}</div>
                    </td>
                    <td className="px-5 py-3.5 border-l border-gray-200 dark:border-gray-800">
                      <span className="text-sm font-medium text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-[4px]">{(article.views || 0).toLocaleString('vi-VN')}</span>
                    </td>
                    <td className="px-5 py-3.5 border-l border-gray-200 dark:border-gray-800">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-[4px] text-xs font-medium ${article.status === 'PUBLISHED' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-800'
                        }`}>
                        {STATUS_MAP[article.status] || article.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 border-l border-gray-200 dark:border-gray-800 text-center">
                      <div className="flex items-center justify-center">
                        <ActionMenu
                          items={[
                            { label: article.status === 'PUBLISHED' ? 'Tắt xuất bản' : 'Xuất bản nhanh', icon: CheckCircle2, onClick: () => handleQuickPublish(article), variant: 'success' },
                            {
                              label: 'Chỉnh sửa', icon: Edit, onClick: () => {
                                setModalMode('edit');
                                setFormData({ ...article, thumbnail: article.thumbnail ? (Array.isArray(article.thumbnail) ? article.thumbnail : [article.thumbnail]) : [] });
                                setErrors({});
                                setActiveTab('basic');
                                setIsDrawerOpen(true);
                              }
                            },
                            { label: 'Xóa', icon: Trash2, onClick: () => handleDelete(article.id), variant: 'danger', separatorBefore: true }
                          ]}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 0 && (
          <div className="px-5 py-3 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-[#1a1b23]">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Hiển thị <span className="font-medium text-gray-900 dark:text-white">{page * itemsPerPage + 1} - {Math.min((page + 1) * itemsPerPage, filteredData.length)}</span> trong <span className="font-medium text-gray-900 dark:text-white">{filteredData.length}</span>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0} className="p-1.5 rounded-[4px] border border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 hover:bg-white dark:bg-[#14151a] disabled:opacity-50 transition-colors bg-white dark:bg-[#14151a]"><ChevronLeft className="w-4 h-4" /></button>
              <div className="px-3 text-sm font-medium text-gray-700 dark:text-gray-300">{page + 1} / {totalPages}</div>
              <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page === totalPages - 1} className="p-1.5 rounded-[4px] border border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 hover:bg-white dark:bg-[#14151a] disabled:opacity-50 transition-colors bg-white dark:bg-[#14151a]"><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>
        )}
      </div>

      {/* Modal / Drawer for Add/Edit Article */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-gray-900/40 dark:bg-black/60 backdrop-blur-sm transition-opacity duration-200 animate-in fade-in" onClick={() => setIsDrawerOpen(false)} />
          <div className="relative bg-white dark:bg-[#14151a] w-full max-w-4xl h-full flex flex-col border-l border-gray-200 dark:border-gray-800 animate-in slide-in-from-right duration-300 shadow-none z-10">
            <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-[#14151a]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-[4px] bg-[#5865f2]/10 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-[#5865f2]" />
                </div>
                <div>
                  <h2 className="text-base font-medium text-gray-900 dark:text-white tracking-tight">
                    {modalMode === 'add' ? 'Viết Bài Mới' : 'Cập Nhật Bài Viết'}
                  </h2>
                </div>
              </div>
              <button onClick={() => setIsDrawerOpen(false)} className="p-1.5 rounded-[4px] hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300 transition-colors cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <form id="article-form" onSubmit={handleSave} className="p-6 space-y-8">

                {/* Section: Nội dung bài viết */}
                <div className="space-y-5">
                  <h3 className="text-xs font-medium text-[#5865f2] dark:text-[#5865f2] uppercase tracking-wider flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#5865f2]"></span>
                    Nội dung bài viết
                  </h3>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Tiêu Đề Bài Viết <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FileText className="h-4 w-4 text-gray-400 dark:text-gray-500 dark:text-gray-400" />
                      </div>
                      <input type="text" value={formData.title} onChange={e => { 
                        const newTitle = e.target.value;
                        const generateSlug = (text: string) => text.toString().toLowerCase()
                          .replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, 'a')
                          .replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, 'e')
                          .replace(/i|í|ì|ỉ|ĩ|ị/gi, 'i')
                          .replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, 'o')
                          .replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, 'u')
                          .replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, 'y')
                          .replace(/đ/gi, 'd')
                          .replace(/\s+/g, '-')
                          .replace(/[^a-z0-9\-]/g, '')
                          .replace(/\-\-+/g, '-')
                          .replace(/^-+/, '')
                          .replace(/-+$/, '');
                        const slug = generateSlug(newTitle);
                        setFormData({ ...formData, title: newTitle, slug: slug }); 
                        if (errors.title) setErrors({ ...errors, title: '' }); 
                      }} className={`pl-9 w-full bg-gray-50/50 dark:bg-[#1a1b23] border ${errors.title ? 'border-red-500 focus:ring-red-500/20' : 'border-gray-200 dark:border-gray-700 focus:ring-[#5865f2]/20'} text-sm h-10 rounded-[4px] text-gray-900 dark:text-white transition-all hover:bg-white dark:bg-[#14151a] dark:hover:bg-[#1a1b23] focus:outline-none focus:ring-[3px] focus:border-[#5865f2]/40`} placeholder="Nhập tiêu đề bài viết..." />
                    </div>
                    {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Tóm tắt ngắn (Summary)</label>
                    <textarea rows={3} value={formData.summary} onChange={e => setFormData({ ...formData, summary: e.target.value })} className="w-full bg-gray-50/50 dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-700 text-sm rounded-[4px] text-gray-900 dark:text-white p-3 transition-all hover:bg-white dark:bg-[#14151a] dark:hover:bg-[#1a1b23] focus:outline-none focus:ring-[3px] focus:ring-[#5865f2]/20 focus:border-[#5865f2]/40 resize-none h-24" placeholder="Tóm tắt nội dung bài viết..." />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Nội dung chi tiết <span className="text-red-500">*</span></label>
                    <div className={`border ${errors.content ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'} rounded-[4px] overflow-hidden bg-white dark:bg-[#14151a]`}>
                      <TiptapEditor value={formData.content} onChange={(content) => { setFormData({ ...formData, content }); if (errors.content) setErrors({ ...errors, content: '' }); }} />
                    </div>
                    {errors.content && <p className="text-red-500 text-xs mt-1">{errors.content}</p>}
                  </div>
                </div>

                <div className="h-px bg-gray-100 dark:bg-gray-800/60 -mx-6"></div>

                {/* Section: Phân loại */}
                <div className="space-y-5">
                  <h3 className="text-xs font-medium text-[#5865f2] dark:text-[#5865f2] uppercase tracking-wider flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#43b581]"></span>
                    Phân loại & Thuộc tính
                  </h3>

                  <div className="grid grid-cols-2 gap-5">
                    <div className="space-y-1.5 relative z-40">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Danh Mục Bài Viết <span className="text-red-500">*</span></label>
                      <CustomDropdown className="w-full" options={CATEGORIES.map(c => ({ value: c, label: c }))} value={formData.category} onChange={v => setFormData({ ...formData, category: v })} onQuickAdd={async (newVal) => {
                        if (newVal) {
                          const prevVal = formData.category;
                          // Optimistic update
                          setFormData({ ...formData, category: newVal });
                          setCategories(prev => prev.includes(newVal) ? prev : [...prev, newVal]);

                          try {
                            const generateSlug = (text: string) => text.toString().toLowerCase()
                              .replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, 'a')
                              .replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, 'e')
                              .replace(/i|í|ì|ỉ|ĩ|ị/gi, 'i')
                              .replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, 'o')
                              .replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, 'u')
                              .replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, 'y')
                              .replace(/đ/gi, 'd')
                              .replace(/\s+/g, '-')
                              .replace(/[^a-z0-9\-]/g, '')
                              .replace(/\-\-+/g, '-')
                              .replace(/^-+/, '')
                              .replace(/-+$/, '');
                              
                            const slug = generateSlug(newVal) + '-' + Math.floor(Math.random() * 1000);
                            await apiClient.post('/categories', { name: newVal, slug, type: 'Bài viết', status: 'ACTIVE' });
                            
                            // Background sync
                            apiClient.get('/categories').then(catRes => {
                              const articleCats = (catRes.data as any[]).filter((c: any) => c.type === 'Bài viết').map((c: any) => c.name);
                              setCategories(articleCats);
                            });
                            
                            toast.success(`Đã thêm danh mục "${newVal}"`);
                          } catch (error) {
                            console.error(error);
                            // Rollback on error
                            setFormData((prev: any) => ({ ...prev, category: prevVal }));
                            setCategories((prev: string[]) => prev.filter(c => c !== newVal));
                            toast.error('Lỗi khi tạo danh mục mới');
                          }
                        } else {
                          router.push('/admin/categories');
                        }
                      }} emptyText="Chưa có Danh mục" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Tác giả</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className="h-4 w-4 text-gray-400 dark:text-gray-500 dark:text-gray-400" />
                        </div>
                        <input type="text" value={formData.author} onChange={e => setFormData({ ...formData, author: e.target.value })} className="pl-9 w-full bg-gray-50/50 dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-700 text-sm h-10 rounded-[4px] text-gray-900 dark:text-white transition-all hover:bg-white dark:bg-[#14151a] dark:hover:bg-[#1a1b23] focus:outline-none focus:ring-[3px] focus:ring-[#5865f2]/20 focus:border-[#5865f2]/40" placeholder="Nhập tên tác giả..." />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Lượt xem ban đầu</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Eye className="h-4 w-4 text-gray-400 dark:text-gray-500 dark:text-gray-400" />
                        </div>
                        <input type="number" min="0" value={formData.views} onChange={e => setFormData({ ...formData, views: parseInt(e.target.value) || 0 })} className="pl-9 w-full bg-gray-50/50 dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-700 text-sm h-10 rounded-[4px] text-gray-900 dark:text-white transition-all hover:bg-white dark:bg-[#14151a] dark:hover:bg-[#1a1b23] focus:outline-none focus:ring-[3px] focus:ring-[#5865f2]/20 focus:border-[#5865f2]/40" placeholder="VD: 100" />
                      </div>
                    </div>
                    <div className="space-y-1.5 relative z-30">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Trạng Thái</label>
                      <CustomDropdown className="w-full" options={[{ value: 'DRAFT', label: 'Bản nháp' }, { value: 'PUBLISHED', label: 'Xuất bản', color: 'green' }]} value={formData.status} onChange={v => setFormData({ ...formData, status: v })} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Thẻ (Tags)</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Tag className="h-4 w-4 text-gray-400 dark:text-gray-500 dark:text-gray-400" />
                        </div>
                        <input type="text" value={formData.tags || ''} onChange={e => setFormData({ ...formData, tags: e.target.value })} className="pl-9 w-full bg-gray-50/50 dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-700 text-sm h-10 rounded-[4px] text-gray-900 dark:text-white transition-all hover:bg-white dark:bg-[#14151a] dark:hover:bg-[#1a1b23] focus:outline-none focus:ring-[3px] focus:ring-[#5865f2]/20 focus:border-[#5865f2]/40" placeholder="Ngăn cách bởi dấu phẩy, VD: nội thất, phong thủy" />
                      </div>
                    </div>
                    <div className="space-y-1.5 flex flex-col justify-center mt-6">
                      <label className="flex items-center gap-2 cursor-pointer group w-max">
                        <div className={`w-10 h-5 rounded-full transition-colors relative ${formData.isFeatured ? 'bg-amber-500' : 'bg-gray-200 dark:bg-gray-700 group-hover:bg-gray-300 dark:group-hover:bg-gray-600'}`}>
                          <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${formData.isFeatured ? 'translate-x-5' : ''}`}></div>
                        </div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 select-none">Đánh dấu Bài viết Nổi bật</span>
                        <input type="checkbox" className="hidden" checked={formData.isFeatured} onChange={e => setFormData({ ...formData, isFeatured: e.target.checked })} />
                      </label>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">Ảnh Đại Diện (Thumbnail)</label>
                    <ImageUploader initialImages={formData.thumbnail} onUploadSuccess={(urls) => setFormData({ ...formData, thumbnail: urls })} onRemoveImage={(url) => setFormData({ ...formData, thumbnail: formData.thumbnail.filter((i: any) => i !== url) })} maxFiles={1} />
                  </div>
                </div>

                <div className="h-px bg-gray-100 dark:bg-gray-800/60 -mx-6"></div>

                {/* Section: SEO */}
                <div className="space-y-5">
                  <h3 className="text-xs font-medium text-[#5865f2] dark:text-[#5865f2] uppercase tracking-wider flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-50 dark:bg-amber-500/100"></span>
                    Cấu hình SEO
                  </h3>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Đường dẫn thân thiện (Slug)</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Link className="h-4 w-4 text-gray-400 dark:text-gray-500 dark:text-gray-400" />
                      </div>
                      <input type="text" value={formData.slug} onChange={e => setFormData({ ...formData, slug: e.target.value })} className="pl-9 w-full bg-gray-50/50 dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-700 text-sm h-10 rounded-[4px] text-gray-900 dark:text-white transition-all hover:bg-white dark:bg-[#14151a] dark:hover:bg-[#1a1b23] focus:outline-none focus:ring-[3px] focus:ring-[#5865f2]/20 focus:border-[#5865f2]/40" placeholder="VD: bai-viet-thiet-ke-noi-that" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Tiêu đề SEO (Meta Title)</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Tag className="h-4 w-4 text-gray-400 dark:text-gray-500 dark:text-gray-400" />
                      </div>
                      <input type="text" value={formData.metaTitle} onChange={e => setFormData({ ...formData, metaTitle: e.target.value })} className="pl-9 w-full bg-gray-50/50 dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-700 text-sm h-10 rounded-[4px] text-gray-900 dark:text-white transition-all hover:bg-white dark:bg-[#14151a] dark:hover:bg-[#1a1b23] focus:outline-none focus:ring-[3px] focus:ring-[#5865f2]/20 focus:border-[#5865f2]/40" placeholder="Tiêu đề hiển thị trên kết quả tìm kiếm Google..." />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Mô tả SEO (Meta Description)</label>
                    <textarea rows={3} value={formData.metaDescription} onChange={e => setFormData({ ...formData, metaDescription: e.target.value })} className="w-full bg-gray-50/50 dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-700 text-sm rounded-[4px] text-gray-900 dark:text-white p-3 transition-all hover:bg-white dark:bg-[#14151a] dark:hover:bg-[#1a1b23] focus:outline-none focus:ring-[3px] focus:ring-[#5865f2]/20 focus:border-[#5865f2]/40 resize-none h-24" placeholder="Mô tả ngắn gọn hiển thị bên dưới tiêu đề trên Google..." />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Từ khóa chính (Focus Keywords)</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <SearchCode className="h-4 w-4 text-gray-400 dark:text-gray-500 dark:text-gray-400" />
                      </div>
                      <input type="text" value={formData.keyword} onChange={e => setFormData({ ...formData, keyword: e.target.value })} className="pl-9 w-full bg-gray-50/50 dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-700 text-sm h-10 rounded-[4px] text-gray-900 dark:text-white transition-all hover:bg-white dark:bg-[#14151a] dark:hover:bg-[#1a1b23] focus:outline-none focus:ring-[3px] focus:ring-[#5865f2]/20 focus:border-[#5865f2]/40" placeholder="VD: thiết kế nội thất, nội thất hiện đại..." />
                    </div>
                  </div>

                  <div className="pt-2">
                    <label className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-[4px] cursor-pointer hover:bg-gray-50 dark:hover:bg-[#262930] dark:bg-[#1a1b23] dark:hover:bg-[#1a1b23] transition-colors">
                      <input type="checkbox" checked={formData.faqSchema} onChange={e => setFormData({ ...formData, faqSchema: e.target.checked })} className="w-4 h-4 text-[#5865f2] rounded-[4px] border-gray-300 focus:ring-[#5865f2]" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Tự động sinh FAQ Schema từ thẻ H2/H3 (Tăng SEO)</span>
                    </label>
                  </div>
                </div>
              </form>
            </div>

            <div className="h-20 flex items-center justify-end gap-3 px-6 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-[#14151a] shrink-0">
              <button type="button" onClick={() => setIsDrawerOpen(false)} className="flex items-center gap-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1b23] hover:bg-gray-50 dark:hover:bg-[#262930] dark:bg-[#1a1b23] dark:hover:bg-[#262930] text-gray-700 dark:text-gray-200 rounded-[4px] text-sm h-10 px-5 cursor-pointer font-medium transition-colors">
                <X className="w-4 h-4" /> Hủy bỏ
              </button>
              <button type="submit" form="article-form" className="flex items-center gap-2 bg-[#5865f2] hover:bg-[#4752c4] text-white rounded-[4px] font-medium text-sm h-10 px-6 border-0 cursor-pointer transition-colors">
                <Check className="w-4 h-4" /> {modalMode === 'add' ? 'Thêm bài viết' : 'Lưu thay đổi'}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        description={confirmModal.desc}
      />
    </div>
  );
}
