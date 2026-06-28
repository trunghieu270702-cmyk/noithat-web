"use client";
import { useConfirm } from '@/hooks/useConfirm';
import React, { useState } from 'react';
import { Search, FileSearch, Plus, Edit, Trash2, X, Check, CheckCircle2, ChevronLeft, ChevronRight, BarChart2 } from 'lucide-react';
import apiClient from '@/admin-lib/apiClient';
import { format } from 'date-fns';
import TiptapEditor from '@/admin-components/ui/TiptapEditor';
import CustomDropdown from '@/admin-components/ui/CustomDropdown';
import { toast } from 'sonner';

export default function SeoPages() {
  const { confirm } = useConfirm();
  const [pages, setPages] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchSeoPages = async () => {
    try {
      setIsLoading(true);
      const res = await apiClient.get('/seopages');
      setPages(Array.isArray(res.data) ? res.data : (res.data?.data || []));
    } catch (error) {
      console.error('Failed to fetch SEO pages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchSeoPages();
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;

  const [statusFilter, setStatusFilter] = useState('ALL');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [activeTab, setActiveTab] = useState('basic');

  const [formData, setFormData] = useState<any>({
    id: '',
    title: '',
    slug: '',
    keyword: '',
    lsiKeywords: '',
    content: '',
    status: 'DRAFT',
    metaTitle: '',
    metaDescription: '',
    schemaType: 'LocalBusiness',
    views: 0,
    conversionRate: '0%',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const filteredPages = pages.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredPages.length / itemsPerPage) || 1;
  const currentData = filteredPages.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const resetForm = () => {
    setFormData({
      id: '', title: '', slug: '', keyword: '', lsiKeywords: '', content: '',
      status: 'DRAFT', metaTitle: '', metaDescription: '', schemaType: 'LocalBusiness', views: 0, conversionRate: '0%'
    });
  };

  const openAddModal = () => {
    setModalMode('add');
    resetForm();
    setActiveTab('basic');
    setErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = (page: any) => {
    setModalMode('edit');
    setFormData({ ...page });
    setActiveTab('basic');
    setErrors({});
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const newErrors: Record<string, string> = {};
    if (!formData.title?.trim()) newErrors.title = 'Tiêu đề không được để trống';
    if (!formData.slug?.trim()) newErrors.slug = 'Slug không được để trống';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }
    setErrors({});

    try {
      if (modalMode === 'add') {
        const { id, ...createData } = formData;
        await apiClient.post('/seopages', createData);
      } else {
        const { id, ...updateData } = formData;
        await apiClient.patch(`/seopages/${id}`, updateData);
      }
      closeModal();
      fetchSeoPages();
    } catch (error) {
      console.error('Failed to save SEO page:', error);
    }
  };

  const handleDelete = async (id: string | number) => {
    confirm({
      title: 'Xác nhận',
      description: 'Bạn có chắc chắn muốn xóa trang SEO này?',
      variant: 'danger',
      onConfirm: async () => {
        try {
        await apiClient.delete(`/seopages/${id}`);
        if (currentData.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
        fetchSeoPages();
      } catch (error) {
        console.error('Failed to delete SEO page:', error);
      }
      }
    })
  };

  const handleQuickPublish = async (page: any) => {
    try {
      const nextStatus = page.status === 'DRAFT' ? 'PUBLISHED' : 'DRAFT';
      await apiClient.patch(`/seopages/${page.id}`, { status: nextStatus });
      fetchSeoPages();
    } catch (error) {
      console.error('Failed to update SEO status:', error);
    }
  };

  const tabs = [
    { id: 'basic', label: 'Cấu hình URL & SEO' },
    { id: 'content', label: 'Nội dung Landing Page' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-medium tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
            <FileSearch className="w-5 h-5 text-[#5865f2]" />
            Quản lý Trang SEO Tĩnh (Landing Pages)
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Xây dựng các trang đích chuyên biệt cho chiến dịch SEO và Ads.</p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-[#5865f2] hover:bg-[#4752c4] text-white px-4 py-2 rounded-[4px] text-sm font-medium transition-colors flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Tạo Trang SEO mới
        </button>
      </div>

      <div className="bg-white dark:bg-[#14151a] rounded-[4px] border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center gap-4 bg-gray-50/50 dark:bg-gray-800/10">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tiêu đề hoặc từ khóa..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-700 rounded-[4px] text-sm focus:outline-none focus:ring-2 focus:ring-[#5865f2]/20 text-gray-900 dark:text-white"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-48">
            <CustomDropdown
              options={[
                { value: 'ALL', label: 'Tất cả trạng thái' },
                { value: 'PUBLISHED', label: 'Đang hoạt động' },
                { value: 'DRAFT', label: 'Bản nháp' },
              ]}
              value={statusFilter}
              onChange={(val) => { setStatusFilter(val); setCurrentPage(1); }}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-[#1a1b23]">
                <th className="px-5 py-3.5 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-gray-800">Trang SEO đích</th>
                <th className="px-5 py-3.5 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-gray-800">Hiệu suất (Traffic & CR)</th>
                <th className="px-5 py-3.5 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-gray-800">Schema & Cập nhật</th>
                <th className="px-5 py-3.5 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-gray-800">Trạng thái</th>
                <th className="px-5 py-3.5 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-gray-800">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800 bg-white dark:bg-[#14151a]">
              {currentData.length > 0 ? currentData.map((page, index) => (
                <tr key={page.id} className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50/50 dark:hover:bg-[#262930] dark:bg-[#1a1b23] transition-colors group animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}>
                  <td className="px-5 py-4 w-1/3">
                    <div className="font-medium text-sm text-gray-900 dark:text-white line-clamp-1">{page.title}</div>
                    <div className="text-xs text-blue-500 dark:text-blue-400 mt-1 line-clamp-1">/{page.slug}</div>
                    <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 uppercase"><span className="font-medium">KW:</span> {page.keyword}</div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500 dark:text-gray-400">Lượt truy cập</span>
                        <span className="font-medium text-sm text-gray-900 dark:text-white">{page.views?.toLocaleString('vi-VN')}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500 dark:text-gray-400">Chuyển đổi</span>
                        <span className="font-medium text-sm text-emerald-600 dark:text-emerald-400">{page.conversionRate}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="text-sm text-gray-900 dark:text-white mb-1"><span className="text-xs text-gray-500 dark:text-gray-400 mr-1">Schema:</span> {page.schemaType}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{format(new Date(page.updatedAt), 'dd/MM/yyyy HH:mm')}</div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] text-[11px] font-medium ${page.status === 'PUBLISHED'
                      ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/30 dark:bg-emerald-900/20 dark:text-emerald-400'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400'
                      }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${page.status === 'PUBLISHED' ? 'bg-emerald-50 dark:bg-emerald-500/100' : 'bg-gray-50 dark:bg-[#1a1b23]0'}`}></span>
                      {page.status === 'PUBLISHED' ? 'Hoạt động' : 'Bản nháp'}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleQuickPublish(page)}
                        className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 dark:bg-emerald-500/10 dark:hover:bg-emerald-900/20 rounded-[4px] transition-colors" title={page.status === 'PUBLISHED' ? 'Tắt' : 'Bật'}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openEditModal(page)}
                        className="p-2 text-gray-400 hover:text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-[4px] transition-colors" title="Chỉnh sửa"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(page.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-[4px] transition-colors" title="Xóa"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-gray-500 dark:text-gray-400 text-sm bg-gray-50/50 dark:bg-[#1a1b23]/50">
                    <FileSearch className="w-8 h-8 text-gray-300 dark:text-gray-600 dark:text-gray-400 mx-auto mb-3" />
                    Không tìm thấy trang SEO nào phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 0 && (
          <div className="px-5 py-4 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-[#14151a]">
            <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">
              Hiển thị {(currentPage - 1) * itemsPerPage + 1} đến {Math.min(currentPage * itemsPerPage, filteredPages.length)} trong số {filteredPages.length} kết quả
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1} className="p-1.5 rounded-[4px] border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-white dark:bg-[#14151a] dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed bg-white dark:bg-[#1a1b23] shadow-sm"><ChevronLeft className="w-4 h-4" /></button>
              <div className="px-3 text-sm font-medium text-gray-700 dark:text-gray-300">{currentPage} / {totalPages}</div>
              <button onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages} className="p-1.5 rounded-[4px] border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-white dark:bg-[#14151a] dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed bg-white dark:bg-[#1a1b23] shadow-sm"><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-gray-900/40 dark:bg-black/60 backdrop-blur-sm transition-opacity duration-200 animate-in fade-in" onClick={closeModal} />
          <div className="bg-white dark:bg-[#14151a] w-full max-w-3xl h-full flex flex-col border-l border-gray-200 dark:border-gray-800 animate-in slide-in-from-right duration-300 shadow-none z-10 relative">

            <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-[#14151a]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-[4px] bg-[#5865f2]/10 flex items-center justify-center">
                  <FileSearch className="w-4 h-4 text-[#5865f2]" />
                </div>
                <div>
                  <h2 className="text-base font-medium text-gray-900 dark:text-white tracking-tight">
                    {modalMode === 'add' ? 'Tạo Trang SEO Mới' : 'Cập Nhật Trang SEO'}
                  </h2>
                </div>
              </div>
              <button onClick={closeModal} className="p-1.5 rounded-[4px] hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300 transition-colors cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <form id="seo-form" onSubmit={handleSave} className="p-6 space-y-8">

                {/* Section: Cấu hình URL & SEO */}
                <div className="space-y-5">
                  <h3 className="text-xs font-medium text-[#5865f2] dark:text-[#5865f2] uppercase tracking-wider flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#5865f2]"></span>
                    Thông tin URL & Đường dẫn
                  </h3>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Tiêu đề chính trang (Thẻ H1) <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FileSearch className="h-4 w-4 text-gray-400 dark:text-gray-500 dark:text-gray-400" />
                      </div>
                      <input type="text" value={formData.title} onChange={e => { setFormData({ ...formData, title: e.target.value }); if (errors.title) setErrors({ ...errors, title: '' }); }} className={`pl-9 w-full bg-gray-50/50 dark:bg-[#1a1b23] border ${errors.title ? 'border-red-500 focus:ring-red-500/20' : 'border-gray-200 dark:border-gray-700 focus:ring-[#5865f2]/20'} text-sm h-10 rounded-[4px] text-gray-900 dark:text-white transition-all hover:bg-white dark:bg-[#14151a] dark:hover:bg-[#1a1b23] focus:outline-none focus:ring-[3px] focus:border-[#5865f2]/40`} placeholder="VD: Thiết kế nội thất chung cư Hà Nội..." />
                    </div>
                    {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">URL Slug <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Search className="h-4 w-4 text-gray-400 dark:text-gray-500 dark:text-gray-400" />
                        </div>
                        <input type="text" value={formData.slug} onChange={e => { setFormData({ ...formData, slug: e.target.value }); if (errors.slug) setErrors({ ...errors, slug: '' }); }} className={`pl-9 w-full bg-gray-50/50 dark:bg-[#1a1b23] border ${errors.slug ? 'border-red-500 focus:ring-red-500/20' : 'border-gray-200 dark:border-gray-700 focus:ring-[#5865f2]/20'} text-sm h-10 rounded-[4px] text-gray-900 dark:text-white transition-all hover:bg-white dark:bg-[#14151a] dark:hover:bg-[#1a1b23] focus:outline-none focus:ring-[3px] focus:border-[#5865f2]/40`} placeholder="thiet-ke-noi-that-chung-cu-ha-noi" />
                      </div>
                      {errors.slug && <p className="text-red-500 text-xs mt-1">{errors.slug}</p>}
                    </div>
                    <div className="space-y-1.5 relative z-40">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Trạng thái</label>
                      <CustomDropdown options={[{ value: 'DRAFT', label: 'Bản nháp' }, { value: 'PUBLISHED', label: 'Hoạt động' }]} value={formData.status} onChange={val => setFormData({ ...formData, status: val as any })} />
                    </div>
                  </div>
                </div>

                <div className="h-px bg-gray-100 dark:bg-gray-800/60 -mx-6"></div>

                {/* Section: Thẻ Meta & Keyword */}
                <div className="space-y-5">
                  <h3 className="text-xs font-medium text-[#5865f2] dark:text-[#5865f2] uppercase tracking-wider flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#43b581]"></span>
                    Thẻ Meta & Keyword
                  </h3>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Tiêu đề SEO (Meta Title)</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-gray-400 dark:text-gray-500 dark:text-gray-400" />
                      </div>
                      <input type="text" value={formData.metaTitle} onChange={e => setFormData({ ...formData, metaTitle: e.target.value })} className="pl-9 w-full bg-gray-50/50 dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-700 text-sm h-10 rounded-[4px] text-gray-900 dark:text-white transition-all hover:bg-white dark:bg-[#14151a] dark:hover:bg-[#1a1b23] focus:outline-none focus:ring-[3px] focus:ring-[#5865f2]/20 focus:border-[#5865f2]/40" placeholder="VD: Thiết kế nội thất chung cư Hà Nội | Giá tốt..." />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Mô tả SEO (Meta Description)</label>
                    <textarea rows={3} value={formData.metaDescription} onChange={e => setFormData({ ...formData, metaDescription: e.target.value })} className="w-full bg-gray-50/50 dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-700 text-sm rounded-[4px] text-gray-900 dark:text-white p-3 transition-all hover:bg-white dark:bg-[#14151a] dark:hover:bg-[#1a1b23] focus:outline-none focus:ring-[3px] focus:ring-[#5865f2]/20 focus:border-[#5865f2]/40 resize-none" placeholder="Mô tả ngắn gọn về trang này..." />
                  </div>

                  <div className="grid grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Từ khóa chính (Focus Keyword)</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Search className="h-4 w-4 text-gray-400 dark:text-gray-500 dark:text-gray-400" />
                        </div>
                        <input type="text" value={formData.keyword} onChange={e => setFormData({ ...formData, keyword: e.target.value })} className="pl-9 w-full bg-gray-50/50 dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-700 text-sm h-10 rounded-[4px] text-gray-900 dark:text-white transition-all hover:bg-white dark:bg-[#14151a] dark:hover:bg-[#1a1b23] focus:outline-none focus:ring-[3px] focus:ring-[#5865f2]/20 focus:border-[#5865f2]/40" placeholder="thiết kế nội thất chung cư hà nội" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Từ khóa phụ (LSI Keywords)</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Search className="h-4 w-4 text-gray-400 dark:text-gray-500 dark:text-gray-400" />
                        </div>
                        <input type="text" value={formData.lsiKeywords} onChange={e => setFormData({ ...formData, lsiKeywords: e.target.value })} className="pl-9 w-full bg-gray-50/50 dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-700 text-sm h-10 rounded-[4px] text-gray-900 dark:text-white transition-all hover:bg-white dark:bg-[#14151a] dark:hover:bg-[#1a1b23] focus:outline-none focus:ring-[3px] focus:ring-[#5865f2]/20 focus:border-[#5865f2]/40" placeholder="nội thất cao cấp, nội thất phòng khách..." />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5 relative z-30">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Loại Schema Markup</label>
                    <CustomDropdown options={[{ value: 'LocalBusiness', label: 'LocalBusiness (Đơn vị)' }, { value: 'Article', label: 'Article (Bài viết dài)' }, { value: 'FAQPage', label: 'FAQ (Hỏi đáp)' }]} value={formData.schemaType} onChange={val => setFormData({ ...formData, schemaType: val })} />
                  </div>
                </div>

                <div className="h-px bg-gray-100 dark:bg-gray-800/60 -mx-6"></div>

                {/* Section: Nội dung Landing Page */}
                <div className="space-y-5">
                  <h3 className="text-xs font-medium text-[#5865f2] dark:text-[#5865f2] uppercase tracking-wider flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-50 dark:bg-amber-500/100"></span>
                    Nội dung Landing Page
                  </h3>
                  <div className="space-y-1.5">
                    <div className="border border-gray-200 dark:border-gray-700 rounded-[4px] overflow-hidden bg-white dark:bg-[#14151a]">
                      <TiptapEditor value={formData.content} onChange={(content) => setFormData({ ...formData, content })} />
                    </div>
                  </div>
                </div>

              </form>
            </div>

            <div className="h-20 flex items-center justify-end gap-3 px-6 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-[#14151a] shrink-0">
              <button type="button" onClick={closeModal} className="flex items-center gap-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1b23] hover:bg-gray-50 dark:hover:bg-[#262930] dark:bg-[#1a1b23] dark:hover:bg-[#262930] text-gray-700 dark:text-gray-200 rounded-[4px] text-sm h-10 px-5 cursor-pointer font-medium transition-colors">
                <X className="w-4 h-4" /> Hủy bỏ
              </button>
              <button form="seo-form" type="submit" className="flex items-center gap-2 bg-[#5865f2] hover:bg-[#4752c4] text-white rounded-[4px] font-medium text-sm h-10 px-6 border-0 cursor-pointer transition-colors">
                <Check className="w-4 h-4" /> {modalMode === 'add' ? 'Tạo Trang SEO' : 'Lưu thay đổi'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


