"use client";
import { useConfirm } from '@/hooks/useConfirm';
import React, { useState } from 'react';
import { Search, Star, Plus, Edit, Trash2, X, CheckCircle2, ChevronLeft, ChevronRight, Image as ImageIcon, Check, Filter, ChevronDown, ChevronUp, User, FolderKanban, RotateCcw } from 'lucide-react';
import apiClient from '@/admin-lib/apiClient';
import CustomDropdown from '@/admin-components/ui/CustomDropdown';
import { ImageUploader } from '@/admin-components/ui/image-uploader';
import { ActionMenu } from '@/admin-components/ui/ActionMenu';
import { toast } from 'sonner';

const STATUS_MAP: Record<string, string> = {
  'VISIBLE': 'Hiển thị',
  'HIDDEN': 'Đang ẩn'
};

export default function TestimonialsPage() {
  const { confirm } = useConfirm();
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTestimonials = async () => {
    try {
      setIsLoading(true);
      const res = await apiClient.get('/testimonials');
      setData(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error('Failed to fetch testimonials:', error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchTestimonials();
  }, []);
  const [page, setPage] = useState(0);
  const [itemsPerPage] = useState(25);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Modals
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(false);
  const [isSummaryCollapsed, setIsSummaryCollapsed] = useState(false);

  const [openStatusPopover, setOpenStatusPopover] = useState(false);

  const activeFiltersCount = (statusFilter.length > 0 ? 1 : 0);
  const hasActiveFilter = activeFiltersCount > 0;

  const [formData, setFormData] = useState<any>({
    id: '',
    customerName: '',
    project: '',
    avatar: [] as string[],
    rating: 5,
    content: '',
    status: 'VISIBLE',
    featured: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const filteredData = data.filter(t => {
    const matchesSearch = t.customerName.toLowerCase().includes(searchQuery.toLowerCase()) || t.project.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter.length === 0 || statusFilter.includes(t.status);
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
  const currentData = filteredData.slice(page * itemsPerPage, (page + 1) * itemsPerPage);

  const summary = {
    totalItems: filteredData.length,
    visibleCount: filteredData.filter(d => d.status === 'VISIBLE').length,
    hiddenCount: filteredData.filter(d => d.status === 'HIDDEN').length,
    featuredCount: filteredData.filter(d => d.featured).length
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === currentData.length && currentData.length > 0) setSelectedIds([]);
    else setSelectedIds(currentData.map(c => c.id.toString()));
  };

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) setSelectedIds(selectedIds.filter(i => i !== id));
    else setSelectedIds([...selectedIds, id]);
  };

  const resetForm = () => {
    setFormData({
      id: '', customerName: '', project: '', avatar: [], rating: 5, content: '', status: 'VISIBLE', featured: false
    });
    setErrors({});
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const newErrors: Record<string, string> = {};
    if (!formData.customerName?.trim()) newErrors.customerName = 'Tên khách hàng không được để trống';
    if (!formData.project?.trim()) newErrors.project = 'Dự án áp dụng không được để trống';
    if (!formData.content?.trim()) newErrors.content = 'Nội dung đánh giá không được để trống';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }
    setErrors({});

    const dataToSave = {
      ...formData,
      avatar: Array.isArray(formData.avatar) && formData.avatar.length > 0 ? formData.avatar[0] : ''
    };

    try {
      if (modalMode === 'add') {
        const { id, ...createData } = dataToSave;
        await apiClient.post('/testimonials', createData);
      } else {
        const { id, ...updateData } = dataToSave;
        await apiClient.patch(`/testimonials/${id}`, updateData);
      }
      setIsDrawerOpen(false);
      fetchTestimonials();
    } catch (error) {
      console.error('Failed to save testimonial:', error);
    }
  };

    const handleBulkDelete = async () => {
    confirm({
      title: 'Xác nhận xóa hàng loạt',
      description: `Bạn có chắc chắn muốn xóa ${selectedIds.length} mục đã chọn?`,
      variant: 'danger',
      onConfirm: async () => {
        try {
      await Promise.all(selectedIds.map(id => apiClient.delete(`/testimonials/${id}`)));
      setSelectedIds([]);
      fetchTestimonials();
      toast.success('Đã xóa thành công!');
    } catch (error) {
      console.error('Failed to bulk delete:', error);
      toast.error('Lỗi khi xóa');
    }
      }
    });
  };

const handleDelete = async (id: number) => {
    confirm({
      title: 'Xác nhận xóa',
      description: 'Bạn có chắc chắn muốn xóa đánh giá này?',
      variant: 'danger',
      onConfirm: async () => {
        try {
      await apiClient.delete(`/testimonials/${id}`);
      fetchTestimonials();
    } catch (error) {
      console.error('Failed to delete testimonial:', error);
    }
      }
    });
  };

  const toggleFeatured = async (testimonial: any) => {
    try {
      await apiClient.patch(`/testimonials/${testimonial.id}`, { featured: !testimonial.featured });
      fetchTestimonials();
    } catch (error) {
      console.error('Failed to update featured status:', error);
    }
  };

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
                placeholder="Tìm Tên hoặc dự án..."
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
                resetForm();
                setIsDrawerOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-[#5865f2] hover:bg-[#4752c4] text-white rounded-[4px] text-sm font-medium transition-colors border-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Thêm Review mới
            </button>
          </div>
        </div>

        {isFiltersExpanded && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-gray-50/50 dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-800 rounded-[4px] animate-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col gap-1.5 relative">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Trạng thái</span>
              <button onClick={() => setOpenStatusPopover(!openStatusPopover)} className="flex items-center justify-between w-full h-9 px-3 bg-white dark:bg-[#14151a] border border-gray-200 dark:border-gray-800 rounded-[4px] text-sm text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-[#262930] dark:bg-[#1a1b23]">
                <span className="truncate">{statusFilter.length === 0 ? "Tất cả trạng thái" : statusFilter.map(s => STATUS_MAP[s] || s).join(', ')}</span>
                <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400 shrink-0 ml-2" />
              </button>
              {openStatusPopover && (
                <>
                  <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); setOpenStatusPopover(false); }} />
                  <div className="absolute top-16 left-0 z-50 w-full p-2 bg-white dark:bg-[#14151a] border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm shadow-black/5 dark:shadow-none">
                    <div className="flex flex-col gap-1">
                      {['VISIBLE', 'HIDDEN'].map((val) => (
                        <label key={val} className="flex items-center gap-2.5 p-2 rounded-[4px] hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-800 cursor-pointer text-sm">
                          <input type="checkbox" checked={statusFilter.includes(val)} onChange={(e) => {
                            if (e.target.checked) setStatusFilter([...statusFilter, val]);
                            else setStatusFilter(statusFilter.filter(s => s !== val));
                            setPage(0);
                          }} className="w-4 h-4 text-[#5865f2] rounded-[4px] border-gray-300" />
                          <span>{STATUS_MAP[val]}</span>
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
          {statusFilter.length > 0 && (
            <div className="flex items-center gap-1.5 pl-2.5 pr-1 py-1 bg-[#5865f2]/10 text-[#5865f2] border border-[#5865f2]/20 rounded-[4px] text-sm font-medium">
              Trạng thái: {statusFilter.map(s => STATUS_MAP[s] || s).join(', ')}
              <button onClick={() => setStatusFilter([])} className="p-0.5 hover:bg-[#5865f2]/20 rounded-[4px] transition-colors ml-1"><X className="w-3.5 h-3.5" /></button>
            </div>
          )}
          {hasActiveFilter && (
            <button onClick={() => { setStatusFilter([]); setPage(0); }} className="flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] border border-red-500 text-xs font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors ml-2"><RotateCcw strokeWidth={2} className="w-3.5 h-3.5" /> Đặt lại</button>
          )}
        </div>
      </div>

      {/* Summary Card */}
      <div className="rounded-[4px] border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#14151a] flex-shrink-0 transition-all duration-300">
        <div className={`p-4 ${isSummaryCollapsed ? 'pb-4' : 'sm:p-5 sm:pb-5'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h3 className=" font-medium text-gray-900 dark:text-white text-sm">Tổng Quan Đánh Giá</h3>
              {!isSummaryCollapsed && <span className="text-xs text-gray-500 dark:text-gray-400">{summary.totalItems} review</span>}
            </div>

            {isSummaryCollapsed && (
              <div className="flex-1 flex items-center justify-end px-6 gap-5">
                <div className="flex items-center gap-3 text-sm font-medium">
                  <span className="text-emerald-600">{summary.visibleCount} Hiển thị</span>
                  <span className="text-amber-600">{summary.featuredCount} Nổi bật</span>
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
                  <div className="w-2 h-2 bg-blue-500 rounded-[4px]"></div><span className="text-xs font-medium text-gray-700 dark:text-gray-300">Tổng review</span>
                </div>
                <div className="text-2xl font-medium text-blue-700 dark:text-blue-400">{summary.totalItems}</div>
              </div>
              <div className="p-3.5 rounded-[4px] border border-emerald-100 dark:border-emerald-900/30 bg-emerald-50/50 dark:bg-emerald-500/10">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-2 h-2 bg-emerald-50 dark:bg-emerald-500/100 rounded-[4px]"></div><span className="text-xs font-medium text-gray-700 dark:text-gray-300">Hiển thị</span>
                </div>
                <div className="text-2xl font-medium text-emerald-700 dark:text-emerald-400">{summary.visibleCount}</div>
              </div>
              <div className="p-3.5 rounded-[4px] border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#1a1b23]">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-2 h-2 bg-gray-50 dark:bg-[#1a1b23]0 rounded-[4px]"></div><span className="text-xs font-medium text-gray-700 dark:text-gray-300">Đang ẩn</span>
                </div>
                <div className="text-2xl font-medium text-gray-700 dark:text-gray-300">{summary.hiddenCount}</div>
              </div>
              <div className="p-3.5 rounded-[4px] border border-amber-100 dark:border-amber-900/30 bg-amber-50/50 dark:bg-amber-500/10">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-2 h-2 bg-amber-50 dark:bg-amber-500/100 rounded-[4px]"></div><span className="text-xs font-medium text-gray-700 dark:text-gray-300">Nổi bật</span>
                </div>
                <div className="text-2xl font-medium text-amber-700 dark:text-amber-400">{summary.featuredCount}</div>
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
                <th className="px-5 py-3.5 font-medium text-gray-500 dark:text-gray-400 text-xs w-[30%]">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-4 h-4 rounded-[4px] border flex items-center justify-center cursor-pointer transition-colors ${selectedIds.length === currentData.length && currentData.length > 0 ? 'bg-[#5865f2] border-[#5865f2]' : 'border-gray-300'
                        }`}
                      onClick={toggleSelectAll}
                    >
                      {selectedIds.length === currentData.length && currentData.length > 0 && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <div className="uppercase tracking-wide">Khách hàng</div>
                  </div>
                </th>
                <th className="px-5 py-3.5 font-medium text-gray-500 dark:text-gray-400 text-xs border-l border-gray-200 dark:border-gray-800 uppercase w-[40%]">Đánh giá</th>
                <th className="px-5 py-3.5 font-medium text-gray-500 dark:text-gray-400 text-xs border-l border-gray-200 dark:border-gray-800 uppercase">Trạng thái</th>
                <th className="px-5 py-3.5 font-medium text-gray-500 dark:text-gray-400 text-xs border-l border-gray-200 dark:border-gray-800 text-center w-28">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {currentData.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-16 text-center animate-in fade-in zoom-in-95 duration-500">
                    <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4 border border-gray-200 dark:border-gray-800">
                        <Star className="w-8 h-8 text-gray-500" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Không tìm thấy review</h3>
                    </div>
                  </td>
                </tr>
              ) : (
                currentData.map((item, index) => (
                  <tr key={item.id} className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50/50 dark:hover:bg-[#262930] dark:bg-[#1a1b23] transition-colors group animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-4 h-4 rounded-[4px] border flex items-center justify-center cursor-pointer transition-colors shrink-0 ${selectedIds.includes(item.id.toString()) ? 'bg-[#5865f2] border-[#5865f2]' : 'border-gray-300'
                            }`}
                          onClick={() => toggleSelect(item.id.toString())}
                        >
                          {selectedIds.includes(item.id.toString()) && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden border border-gray-200 dark:border-gray-800 shrink-0">
                            {item.avatar ? (
                              <img src={item.avatar} alt={item.customerName} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs font-medium">{(item.customerName || 'U').charAt(0)}</div>
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-sm text-gray-900 dark:text-white line-clamp-1">{item.customerName}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">{item.project}</div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 border-l border-gray-200 dark:border-gray-800">
                      <div className="flex items-center gap-1 mb-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`w-3.5 h-3.5 ${i < item.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} />
                        ))}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 italic">"{item.content}"</div>
                    </td>
                    <td className="px-5 py-3.5 border-l border-gray-200 dark:border-gray-800">
                      <div className="flex flex-col gap-2 items-start">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[4px] text-xs font-medium ${item.status === 'VISIBLE'
                          ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-800'
                          }`}>
                          {STATUS_MAP[item.status] || item.status}
                        </span>
                        {item.featured && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[4px] text-xs font-medium bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> Nổi bật
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 border-l border-gray-200 dark:border-gray-800 text-center">
                      <div className="flex items-center justify-center">
                        <ActionMenu
                          items={[
                            { label: item.featured ? 'Bỏ Nổi bật' : 'Đánh dấu Nổi bật', icon: Star, onClick: () => toggleFeatured(item), variant: item.featured ? 'default' : 'success' },
                            {
                              label: 'Chỉnh sửa', icon: Edit, onClick: () => {
                                setModalMode('edit');
                                setFormData({ ...item, avatar: item.avatar ? (Array.isArray(item.avatar) ? item.avatar : [item.avatar]) : [] });
                                setErrors({});
                                setIsDrawerOpen(true);
                              }
                            },
                            { label: 'Xóa', icon: Trash2, onClick: () => handleDelete(item.id), variant: 'danger', separatorBefore: true }
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

      {isDrawerOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-gray-900/40 dark:bg-black/60 backdrop-blur-sm transition-opacity duration-200 animate-in fade-in" onClick={() => setIsDrawerOpen(false)} />
          <div className="relative bg-white dark:bg-[#14151a] w-full max-w-2xl h-full flex flex-col border-l border-gray-200 dark:border-gray-800 animate-in slide-in-from-right duration-300 shadow-none z-10">

            <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-[#14151a]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-[4px] bg-[#5865f2]/10 flex items-center justify-center">
                  <Star className="w-4 h-4 text-[#5865f2]" />
                </div>
                <div>
                  <h2 className="text-base font-medium text-gray-900 dark:text-white tracking-tight">
                    {modalMode === 'add' ? 'Thêm Review Mới' : 'Cập Nhật Review'}
                  </h2>
                </div>
              </div>
              <button onClick={() => setIsDrawerOpen(false)} className="p-1.5 rounded-[4px] hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300 transition-colors cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <form id="testimonial-form" onSubmit={handleSave} className="p-6 space-y-8">

                {/* Section: Thông tin khách hàng */}
                <div className="space-y-5">
                  <h3 className="text-xs font-medium text-[#5865f2] dark:text-[#5865f2] uppercase tracking-wider flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#5865f2]"></span>
                    Thông tin khách hàng
                  </h3>

                  <div className="grid grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Tên Khách Hàng <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className="h-4 w-4 text-gray-400 dark:text-gray-500 dark:text-gray-400" />
                        </div>
                        <input type="text" value={formData.customerName} onChange={e => { setFormData({ ...formData, customerName: e.target.value }); if (errors.customerName) setErrors({ ...errors, customerName: '' }); }} className={`pl-9 w-full bg-gray-50/50 dark:bg-[#1a1b23] border ${errors.customerName ? 'border-red-500 focus:ring-red-500/20' : 'border-gray-200 dark:border-gray-700 focus:ring-[#5865f2]/20'} text-sm h-10 rounded-[4px] text-gray-900 dark:text-white transition-all hover:bg-white dark:bg-[#14151a] dark:hover:bg-[#1a1b23] focus:outline-none focus:ring-[3px] focus:border-[#5865f2]/40`} placeholder="Nguyễn Văn A..." />
                      </div>
                      {errors.customerName && <p className="text-red-500 text-xs mt-1">{errors.customerName}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Dự án áp dụng <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FolderKanban className="h-4 w-4 text-gray-400 dark:text-gray-500 dark:text-gray-400" />
                        </div>
                        <input type="text" value={formData.project} onChange={e => { setFormData({ ...formData, project: e.target.value }); if (errors.project) setErrors({ ...errors, project: '' }); }} placeholder="VD: Chung cư Vinhome Smart City..." className={`pl-9 w-full bg-gray-50/50 dark:bg-[#1a1b23] border ${errors.project ? 'border-red-500 focus:ring-red-500/20' : 'border-gray-200 dark:border-gray-700 focus:ring-[#5865f2]/20'} text-sm h-10 rounded-[4px] text-gray-900 dark:text-white transition-all hover:bg-white dark:bg-[#14151a] dark:hover:bg-[#1a1b23] focus:outline-none focus:ring-[3px] focus:border-[#5865f2]/40`} />
                      </div>
                      {errors.project && <p className="text-red-500 text-xs mt-1">{errors.project}</p>}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">Ảnh đại diện (Avatar)</label>
                    <ImageUploader
                      initialImages={formData.avatar}
                      onUploadSuccess={(urls) => setFormData({ ...formData, avatar: urls })}
                      onRemoveImage={(url) => setFormData({ ...formData, avatar: formData.avatar.filter((i: any) => i !== url) })}
                      maxFiles={1}
                    />
                  </div>
                </div>

                <div className="h-px bg-gray-100 dark:bg-gray-800/60 -mx-6"></div>

                {/* Section: Nội dung đánh giá */}
                <div className="space-y-5">
                  <h3 className="text-xs font-medium text-[#5865f2] dark:text-[#5865f2] uppercase tracking-wider flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#43b581]"></span>
                    Nội dung đánh giá
                  </h3>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Nội dung đánh giá <span className="text-red-500">*</span></label>
                    <textarea rows={4} value={formData.content} onChange={e => { setFormData({ ...formData, content: e.target.value }); if (errors.content) setErrors({ ...errors, content: '' }); }} className={`w-full bg-gray-50/50 dark:bg-[#1a1b23] border ${errors.content ? 'border-red-500 focus:ring-red-500/20' : 'border-gray-200 dark:border-gray-700 focus:ring-[#5865f2]/20'} text-sm rounded-[4px] text-gray-900 dark:text-white p-3 transition-all hover:bg-white dark:bg-[#14151a] dark:hover:bg-[#1a1b23] focus:outline-none focus:ring-[3px] focus:border-[#5865f2]/40 resize-none`} placeholder="Nội dung review của khách hàng..." />
                    {errors.content && <p className="text-red-500 text-xs mt-1">{errors.content}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Điểm đánh giá (1-5 Sao)</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Star className="h-4 w-4 text-amber-400" />
                        </div>
                        <input type="number" min="1" max="5" value={formData.rating} onChange={e => setFormData({ ...formData, rating: parseInt(e.target.value) || 5 })} className="pl-9 w-full bg-gray-50/50 dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-700 text-sm h-10 rounded-[4px] text-gray-900 dark:text-white transition-all hover:bg-white dark:bg-[#14151a] dark:hover:bg-[#1a1b23] focus:outline-none focus:ring-[3px] focus:ring-[#5865f2]/20 focus:border-[#5865f2]/40" />
                      </div>
                    </div>
                    <div className="space-y-1.5 relative z-30">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Trạng thái</label>
                      <CustomDropdown options={[{ value: 'VISIBLE', label: 'Hiển thị' }, { value: 'HIDDEN', label: 'Ẩn' }]} value={formData.status} onChange={val => setFormData({ ...formData, status: val as any })} />
                    </div>
                  </div>

                  <div className="pt-1">
                    <label className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-[4px] cursor-pointer hover:bg-gray-50 dark:hover:bg-[#262930] dark:bg-[#1a1b23] dark:hover:bg-[#1a1b23] transition-colors">
                      <input type="checkbox" checked={formData.featured} onChange={e => setFormData({ ...formData, featured: e.target.checked })} className="w-4 h-4 rounded-[4px] border-gray-300 accent-amber-500" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5"><Star className="w-4 h-4 text-amber-500 fill-amber-500" /> Đánh dấu nổi bật (Featured)</span>
                    </label>
                  </div>
                </div>

              </form>
            </div>

            <div className="h-20 flex items-center justify-end gap-3 px-6 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-[#14151a] shrink-0">
              <button type="button" onClick={() => setIsDrawerOpen(false)} className="flex items-center gap-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1b23] hover:bg-gray-50 dark:hover:bg-[#262930] dark:bg-[#1a1b23] dark:hover:bg-[#262930] text-gray-700 dark:text-gray-200 rounded-[4px] text-sm h-10 px-5 cursor-pointer font-medium transition-colors">
                <X className="w-4 h-4" /> Hủy bỏ
              </button>
              <button type="submit" form="testimonial-form" className="flex items-center gap-2 bg-[#5865f2] hover:bg-[#4752c4] text-white rounded-[4px] font-medium text-sm h-10 px-6 border-0 cursor-pointer transition-colors">
                <Check className="w-4 h-4" /> {modalMode === 'add' ? 'Thêm mới' : 'Lưu thay đổi'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
