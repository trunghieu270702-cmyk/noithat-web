"use client";
import { useConfirm } from '@/hooks/useConfirm';
import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Plus, Filter, Edit, Trash2, Building2, X, ChevronLeft, ChevronRight, Check, ArrowUpDown, ChevronDown, ChevronUp, MapPin, Phone, Loader2, FolderOpen } from 'lucide-react';
import { format } from 'date-fns';
import CustomDropdown from '@/admin-components/ui/CustomDropdown';
import CustomMultiSelect from '@/admin-components/ui/CustomMultiSelect';
import { ImageUploader } from '@/admin-components/ui/image-uploader';
import TiptapEditor from '@/admin-components/ui/TiptapEditor';
import { ActionMenu } from '@/admin-components/ui/ActionMenu';
import { toast } from 'sonner';

import apiClient from '@/admin-lib/apiClient';
const SEGMENT_MAP: Record<string, string> = {
  'co-ban': 'Cơ bản',
  'trung-cap': 'Trung cấp',
  'cao-cap': 'Cao cấp'
};

const STATUS_MAP: Record<string, string> = {
  'ACTIVE': 'Hoạt động',
  'PENDING': 'Chờ duyệt',
  'HIDDEN': 'Đã ẩn',
  'STOPPED': 'Ngừng hợp tác'
};

const PARTNER_TYPES = [
  { value: 'Đối tác thiết kế', label: 'Đối tác thiết kế' },
  { value: 'Đối tác thi công', label: 'Đối tác thi công' },
  { value: 'Hạng mục phụ', label: 'Hạng mục phụ' }
];

const PARTNER_CATEGORIES: Record<string, { value: string, label: string }[]> = {
  'Đối tác thiết kế': [
    { value: 'Nội thất', label: 'Nội thất' },
    { value: 'Ngoại thất', label: 'Ngoại thất' },
    { value: 'Cả 2', label: 'Cả 2' }
  ],
  'Đối tác thi công': [
    { value: 'Nội thất', label: 'Nội thất' },
    { value: 'Ngoại thất', label: 'Ngoại thất' },
    { value: 'Cả 2', label: 'Cả 2' }
  ],
  'Hạng mục phụ': [] // handled by free text input
};

export default function ProductsPage() {
  const { confirm } = useConfirm();
  const router = useRouter();
  const [data, setData] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [units, setUnits] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProductsAndCategories = async () => {
    try {
      setIsLoading(true);
      const [resProducts, resCategories, resUnits] = await Promise.all([
        apiClient.get('/products'),
        apiClient.get('/categories'),
        apiClient.get('/units')
      ]);
      setData(Array.isArray(resProducts.data) ? resProducts.data : []);
      // Only keep Unit categories
      setCategories(Array.isArray(resCategories.data) ? resCategories.data.filter(c => c.type === 'Đơn vị' || c.type === 'Lĩnh vực công trình') : []);
      setUnits(Array.isArray(resUnits.data) ? resUnits.data.filter(u => u.projectType === 'Đối tác thiết kế' || u.projectType === 'Cả 2') : []);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProductsAndCategories();
  }, []);
  const [isFirstLoad, setIsFirstLoad] = useState(false);
  const [page, setPage] = useState(0);
  const [itemsPerPage] = useState(25);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // Modals
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [activeTab, setActiveTab] = useState('basic');

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [segmentFilter, setSegmentFilter] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(false);
  const [isSummaryCollapsed, setIsSummaryCollapsed] = useState(false);

  // Popovers State (Custom implementation since we don't have Radix UI)
  const [openStatusPopover, setOpenStatusPopover] = useState(false);
  const [openSegmentPopover, setOpenSegmentPopover] = useState(false);

  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null);

  const [formData, setFormData] = useState({
    id: 0,
    productId: '',
    name: '',
    slug: '',
    unitId: null as number | null,
    price: 0,
    promotionalPrice: 0,
    status: 'ACTIVE',
    shortDescription: '',
    description: '',
    images: [] as string[],
    categoryIds: [] as number[],
    attributes: [] as { name: string, value: string }[],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const activeFiltersCount = (statusFilter.length > 0 ? 1 : 0) + (segmentFilter.length > 0 ? 1 : 0);
  const hasActiveFilter = activeFiltersCount > 0;

  // Filter Data
  const filteredData = Array.isArray(data) ? data.filter(unit => {
    const matchesSearch = unit.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      unit.phone?.includes(searchQuery) ||
      unit.productId?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSegment = segmentFilter.length === 0 || segmentFilter.includes(unit.segment);
    const matchesStatus = statusFilter.length === 0 || statusFilter.includes(unit.status);
    return matchesSearch && matchesSegment && matchesStatus;
  }) : [];

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

  // Summary logic
  const summary = {
    totalItems: filteredData.length,
    activeCount: filteredData.filter(d => d.status === 'ACTIVE').length,
    pendingCount: filteredData.filter(d => d.status === 'PENDING').length,
    hiddenCount: filteredData.filter(d => d.status === 'HIDDEN').length,
    stoppedCount: filteredData.filter(d => d.status === 'STOPPED').length,
  };

  const buildTree = (items: any[]) => {
    const rootItems: any[] = [];
    const lookup: any = {};
    items.forEach(item => {
      lookup[item.id] = { ...item, children: [] };
    });
    items.forEach(item => {
      if (item.parentId && lookup[item.parentId]) {
        lookup[item.parentId].children.push(lookup[item.id]);
      } else {
        rootItems.push(lookup[item.id]);
      }
    });
    return rootItems;
  };
  const categoryTree = buildTree(categories);

  const toggleCategory = (catId: number) => {
    const current = formData.categoryIds || [];
    if (current.includes(catId)) {
      setFormData({ ...formData, categoryIds: current.filter(id => id !== catId) });
    } else {
      setFormData({ ...formData, categoryIds: [...current, catId] });
    }
  };

  const flattenTree = (nodes: any[], level = 0, parentPrefix = ''): any[] => {
    let result: any[] = [];
    nodes.forEach(node => {
      const fullPath = parentPrefix ? `${parentPrefix} > ${node.name}` : node.name;
      result.push({ 
        value: node.id.toString(), 
        label: `${'\u00A0\u00A0\u00A0'.repeat(level)}${level > 0 ? '↳ ' : ''}${node.name}`,
        badgeLabel: fullPath
      });
      if (node.children && node.children.length > 0) {
        result = result.concat(flattenTree(node.children, level + 1, fullPath));
      }
    });
    return result;
  };

  const categoryOptions = flattenTree(categoryTree);

  const handleCategoryChange = (newIdsStr: string[]) => {
    const newIds = newIdsStr.map(v => parseInt(v));
    const oldIds = formData.categoryIds || [];
    
    const addedIds = newIds.filter(id => !oldIds.includes(id));
    const removedIds = oldIds.filter(id => !newIds.includes(id));

    let result = new Set<number>(newIds);

    const getDescendants = (parentId: number): number[] => {
      const children = categories.filter((c: any) => c.parentId === parentId).map((c: any) => c.id);
      let descendants = [...children];
      children.forEach(childId => {
        descendants = descendants.concat(getDescendants(childId));
      });
      return descendants;
    };

    if (addedIds.length > 0) {
      addedIds.forEach(id => {
        const descendants = getDescendants(id);
        descendants.forEach(d => result.add(d));
      });
    }

    if (removedIds.length > 0) {
      removedIds.forEach(id => {
        const descendants = getDescendants(id);
        descendants.forEach(d => result.delete(d));
      });
    }

    setFormData({ ...formData, categoryIds: Array.from(result) });
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === currentData.length && currentData.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(currentData.map(c => c.id));
    }
  };

  const toggleSelect = (id: number) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Tên đơn vị không được để trống';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }
    setErrors({});

    try {
      if (modalMode === 'add') {
        const { id, ...createData } = formData;
        if (!createData.productId) createData.productId = `UN${Math.floor(Math.random() * 1000)}`;
        if (!createData.slug) createData.slug = createData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.floor(Math.random() * 10000);
        await apiClient.post('/products', createData);
        toast.success('Thêm sản phẩm thành công!');
      } else {
        const { id, ...updateData } = formData;
        if (!updateData.slug) updateData.slug = updateData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.floor(Math.random() * 10000);
        await apiClient.patch(`/products/${id}`, updateData);
        toast.success('Lưu thay đổi thành công!');
      }
      setIsDrawerOpen(false);
      fetchProductsAndCategories();
    } catch (error) {
      console.error('Failed to save unit:', error);
      toast.error('Lỗi khi lưu sản phẩm');
    }
  };

  const handleDelete = async (id: number) => {
    confirm({
      title: 'Xác nhận xóa',
      description: 'Bạn có chắc chắn muốn xóa đơn vị này?',
      variant: 'danger',
      onConfirm: async () => {
        try {
      await apiClient.delete(`/products/${id}`);
      fetchProductsAndCategories();
    } catch (error) {
      console.error('Failed to delete unit:', error);
    }
      }
    });
  };

  const handleBulkDelete = async () => {
    confirm({
      title: 'Xác nhận xóa hàng loạt',
      description: `Bạn có chắc chắn muốn xóa ${selectedIds.length} sản phẩm đã chọn?`,
      variant: 'danger',
      onConfirm: async () => {
        try {
      await Promise.all(selectedIds.map(id => apiClient.delete(`/products/${id}`)));
      setSelectedIds([]);
      fetchProductsAndCategories();
      toast.success('Đã xóa thành công!');
    } catch (error) {
      console.error('Failed to delete products:', error);
      toast.error('Lỗi khi xóa sản phẩm');
    }
      }
    });
  };

  const SortIcon = ({ columnKey }: { columnKey: string }) => {
    if (sortConfig?.key !== columnKey) return <ArrowUpDown className="w-3 h-3 ml-1 opacity-50" />;
    return sortConfig.direction === 'asc' ? <ChevronUp className="w-3 h-3 ml-1" /> : <ChevronDown className="w-3 h-3 ml-1" />;
  };

  return (
    <div className="h-full flex flex-col space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Top Header & Filters */}
      <div className="flex flex-col gap-3 flex-shrink-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white dark:bg-[#14151a] p-3 rounded-[4px] border border-gray-200 dark:border-gray-800">
          <div className="flex flex-1 items-center gap-2 max-w-xl">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setPage(0); }}
                placeholder="Tìm Tên sản phẩm, Mã SP..."
                className="pl-9 pr-4 py-2 bg-gray-50/50 dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-700 rounded-[4px] text-sm focus:outline-none focus:ring-[3px] focus:ring-[#5865f2]/20 dark:focus:ring-[#5865f2]/30 focus:border-[#5865f2]/40 dark:focus:border-[#5865f2]/50 w-full text-gray-900 dark:text-gray-100 placeholder-gray-500 transition-all"
              />
            </div>

            {/* Toggle Filters Button */}
            <button
              onClick={() => setIsFiltersExpanded(!isFiltersExpanded)}
              className={`flex items-center gap-2 px-3 h-[38px] rounded-[4px] text-sm font-medium transition-all focus:outline-none focus:ring-[3px] focus:ring-[#5865f2]/20 border cursor-pointer ${isFiltersExpanded
                ? 'bg-[#5865f2]/10 text-[#5865f2] border-[#5865f2]/50 font-medium'
                : 'bg-white dark:bg-[#1a1b23] border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#262930] dark:bg-[#1a1b23] dark:hover:bg-[#262930]'
                }`}
            >
              <Filter className="w-4 h-4" />
              <span>Bộ lọc</span>
              {activeFiltersCount > 0 && (
                <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 bg-[#5865f2] text-white text-[11px] font-medium rounded-full">
                  {activeFiltersCount}
                </span>
              )}
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
                  id: 0, productId: '', name: '', slug: '', unitId: null, price: 0, promotionalPrice: 0, status: 'ACTIVE', shortDescription: '', description: '', images: [], categoryIds: [], attributes: []
                });
                setErrors({});
                setActiveTab('basic');
                setIsDrawerOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-[#5865f2] hover:bg-[#4752c4] text-white rounded-[4px] text-sm font-medium transition-colors border-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Tạo Sản Phẩm
            </button>
          </div>
        </div>

        {/* Expandable filters block */}
        {isFiltersExpanded && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-gray-50/50 dark:bg-[#14151a]/50 border border-gray-200 dark:border-gray-800 rounded-[4px] animate-in slide-in-from-top-2 duration-200">

            {/* Status Filter */}
            <div className="flex flex-col gap-1.5 relative">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Trạng thái</span>
              <button
                onClick={() => setOpenStatusPopover(!openStatusPopover)}
                className="flex items-center justify-between w-full h-9 px-3 bg-white dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-700 rounded-[4px] text-sm text-gray-900 dark:text-gray-100 font-normal hover:bg-gray-50 dark:hover:bg-[#262930] dark:bg-[#1a1b23] dark:hover:bg-[#262930] transition-colors focus:outline-none focus:ring-[3px] focus:ring-[#5865f2]/20"
              >
                <span className="truncate">
                  {statusFilter.length === 0 ? "Tất cả trạng thái" : statusFilter.map(s => STATUS_MAP[s]).join(', ')}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400 shrink-0 ml-2" />
              </button>
              {openStatusPopover && (
                <>
                  <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); setOpenStatusPopover(false); }} />
                  <div className="absolute top-16 left-0 z-50 w-full p-2 bg-white dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm shadow-black/5 dark:shadow-none">
                    <div className="flex flex-col gap-1">
                      {Object.entries(STATUS_MAP).map(([val, label]) => (
                        <label key={val} className="flex items-center gap-2.5 p-2 rounded-[4px] hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-800 cursor-pointer text-sm text-gray-700 dark:text-gray-200">
                          <input
                            type="checkbox"
                            checked={statusFilter.includes(val)}
                            onChange={(e) => {
                              if (e.target.checked) setStatusFilter([...statusFilter, val]);
                              else setStatusFilter(statusFilter.filter(s => s !== val));
                              setPage(0);
                            }}
                            className="w-4 h-4 text-[#5865f2] rounded-[4px] border-gray-300 focus:ring-[#5865f2]"
                          />
                          <span>{label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Segment Filter */}
            <div className="flex flex-col gap-1.5 relative">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Phân khúc</span>
              <button
                onClick={() => setOpenSegmentPopover(!openSegmentPopover)}
                className="flex items-center justify-between w-full h-9 px-3 bg-white dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-700 rounded-[4px] text-sm text-gray-900 dark:text-gray-100 font-normal hover:bg-gray-50 dark:hover:bg-[#262930] dark:bg-[#1a1b23] dark:hover:bg-[#262930] transition-colors focus:outline-none focus:ring-[3px] focus:ring-[#5865f2]/20"
              >
                <span className="truncate">
                  {segmentFilter.length === 0 ? "Tất cả phân khúc" : segmentFilter.map(s => SEGMENT_MAP[s]).join(', ')}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400 shrink-0 ml-2" />
              </button>
              {openSegmentPopover && (
                <>
                  <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); setOpenSegmentPopover(false); }} />
                  <div className="absolute top-16 left-0 z-50 w-full p-2 bg-white dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm shadow-black/5 dark:shadow-none">
                    <div className="flex flex-col gap-1">
                      {Object.entries(SEGMENT_MAP).map(([val, label]) => (
                        <label key={val} className="flex items-center gap-2.5 p-2 rounded-[4px] hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-800 cursor-pointer text-sm text-gray-700 dark:text-gray-200">
                          <input
                            type="checkbox"
                            checked={segmentFilter.includes(val)}
                            onChange={(e) => {
                              if (e.target.checked) setSegmentFilter([...segmentFilter, val]);
                              else setSegmentFilter(segmentFilter.filter(s => s !== val));
                              setPage(0);
                            }}
                            className="w-4 h-4 text-[#5865f2] rounded-[4px] border-gray-300 focus:ring-[#5865f2]"
                          />
                          <span>{label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

          </div>
        )}

        {/* Active tags row */}
        <div className="flex flex-wrap items-center gap-2 mt-1">
          {hasActiveFilter && (
            <span className="text-sm text-gray-500 dark:text-gray-400 font-medium mr-1">Đang lọc:</span>
          )}

          {statusFilter.length > 0 && (
            <div className="flex items-center gap-1.5 pl-2.5 pr-1 py-1 bg-[#5865f2]/10 text-[#5865f2] border border-[#5865f2]/20 rounded-[4px] text-sm font-medium">
              Trạng thái: {statusFilter.map(s => STATUS_MAP[s]).join(', ')}
              <button onClick={() => setStatusFilter([])} className="p-0.5 hover:bg-[#5865f2]/20 rounded-[4px] transition-colors ml-1">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {segmentFilter.length > 0 && (
            <div className="flex items-center gap-1.5 pl-2.5 pr-1 py-1 bg-amber-50 dark:bg-amber-500/100/10 text-amber-600 dark:text-amber-500 border border-amber-500/20 rounded-[4px] text-sm font-medium">
              Phân khúc: {segmentFilter.map(c => SEGMENT_MAP[c]).join(', ')}
              <button onClick={() => setSegmentFilter([])} className="p-0.5 hover:bg-amber-50 dark:bg-amber-500/100/20 rounded-[4px] transition-colors ml-1">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {hasActiveFilter && (
            <button
              onClick={() => { setStatusFilter([]); setSegmentFilter([]); setPage(0); }}
              className="flex items-center gap-1.5 text-xs font-medium text-red-500 hover:text-red-600 dark:hover:text-red-400 transition-colors uppercase tracking-wider ml-2 px-2 py-1 rounded-[4px] hover:bg-red-50 dark:hover:bg-red-500/10"
            >
              Đặt lại
            </button>
          )}
        </div>
      </div>

      {/* Summary Card */}
      <div className="rounded-[4px] border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#14151a] flex-shrink-0 transition-all duration-300">
        <div className={`p-4 ${isSummaryCollapsed ? 'pb-4' : 'sm:p-5 sm:pb-5'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h3 className=" font-medium text-gray-900 dark:text-white text-sm">Tổng Quan Sản Phẩm</h3>
              {!isSummaryCollapsed && (
                <span className="text-xs text-gray-500 dark:text-gray-400">{summary.totalItems} sản phẩm trong bộ lọc</span>
              )}
            </div>

            {isSummaryCollapsed && (
              <div className="flex-1 flex items-center justify-end px-6 gap-5 animate-in fade-in zoom-in duration-300">
                <div className="flex items-center gap-3 text-sm font-medium">
                  <span className="text-emerald-600 dark:text-emerald-400">{summary.activeCount} Hoạt động</span>
                  <span className="text-orange-500">{summary.pendingCount} Chờ duyệt</span>
                  <span className="text-gray-500 dark:text-gray-400">{summary.hiddenCount} Đã ẩn</span>
                </div>
              </div>
            )}

            <button
              onClick={() => setIsSummaryCollapsed(!isSummaryCollapsed)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-800 rounded-[4px] text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-800 transition-colors cursor-pointer ml-4"
            >
              {isSummaryCollapsed ? 'Mở rộng' : 'Thu gọn'}
              {isSummaryCollapsed ? <ChevronDown className="w-3.5 h-3.5 text-gray-400" /> : <ChevronUp className="w-3.5 h-3.5 text-gray-400" />}
            </button>
          </div>

          {!isSummaryCollapsed && (
            <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-[4px] border border-emerald-100 dark:border-emerald-900/30 bg-emerald-50/50 dark:bg-[#1a1b23]/50">
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="w-2 h-2 bg-emerald-50 dark:bg-emerald-500/100 rounded-[4px]"></div>
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-200">Hoạt Động</span>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-medium text-emerald-700 dark:text-emerald-400">{summary.activeCount}</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-[4px] border border-orange-100 dark:border-orange-900/30 bg-orange-50/50 dark:bg-[#1a1b23]/50">
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="w-2 h-2 bg-orange-500 rounded-[4px]"></div>
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-200">Chờ Duyệt</span>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-medium text-orange-600 dark:text-orange-400">{summary.pendingCount}</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-[4px] border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#1a1b23]/50">
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="w-2 h-2 bg-gray-50 dark:bg-[#1a1b23]0 rounded-[4px]"></div>
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-200">Đã Ẩn</span>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-medium text-gray-700 dark:text-gray-300">{summary.hiddenCount}</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-[4px] border border-red-100 dark:border-red-900/30 bg-red-50/50 dark:bg-[#1a1b23]/50">
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="w-2 h-2 bg-red-500 rounded-[4px]"></div>
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-200">Hết Hàng</span>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-medium text-red-600 dark:text-red-400">{summary.stoppedCount}</span>
                  </div>
                </div>
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
                <th className="px-5 py-3.5 font-medium text-gray-500 dark:text-gray-400 text-xs">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-4 h-4 rounded-[4px] border flex items-center justify-center cursor-pointer transition-colors ${selectedIds.length === currentData.length && currentData.length > 0
                        ? 'bg-[#5865f2] border-[#5865f2]'
                        : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-transparent'
                        }`}
                      onClick={toggleSelectAll}
                    >
                      {selectedIds.length === currentData.length && currentData.length > 0 && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <div className="flex items-center cursor-pointer hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-300 select-none uppercase tracking-wide" onClick={() => handleSort('productId')}>
                      Mã SP <SortIcon columnKey="productId" />
                    </div>
                  </div>
                </th>
                <th className="px-5 py-3.5 font-medium text-gray-500 dark:text-gray-400 text-xs border-l border-gray-200 dark:border-gray-800 cursor-pointer hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-300 select-none uppercase tracking-wide min-w-[300px] max-w-[400px]" onClick={() => handleSort('name')}>
                  <div className="flex items-center">Tên Sản Phẩm <SortIcon columnKey="name" /></div>
                </th>
                <th className="px-5 py-3.5 font-medium text-gray-500 dark:text-gray-400 text-xs border-l border-gray-200 dark:border-gray-800 cursor-pointer hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-300 select-none uppercase tracking-wide">
                  <div className="flex items-center">Đơn Vị & Danh Mục</div>
                </th>
                <th className="px-5 py-3.5 font-medium text-gray-500 dark:text-gray-400 text-xs border-l border-gray-200 dark:border-gray-800 cursor-pointer hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-300 select-none uppercase tracking-wide" onClick={() => handleSort('price')}>
                  <div className="flex items-center">Giá Bán <SortIcon columnKey="price" /></div>
                </th>
                <th className="px-5 py-3.5 font-medium text-gray-500 dark:text-gray-400 text-xs border-l border-gray-200 dark:border-gray-800 cursor-pointer hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-300 select-none uppercase tracking-wide" onClick={() => handleSort('status')}>
                  <div className="flex items-center">Trạng Thái <SortIcon columnKey="status" /></div>
                </th>
                <th className="px-5 py-3.5 font-medium text-gray-500 dark:text-gray-400 text-xs border-l border-gray-200 dark:border-gray-800 text-center w-16">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-24 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                      <Loader2 className="w-8 h-8 animate-spin text-[#5865f2] mb-4" />
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">Đang tải dữ liệu...</h3>
                    </div>
                  </td>
                </tr>
              ) : currentData.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-24 text-center animate-in fade-in zoom-in-95 duration-500">
                    <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4 border border-gray-200 dark:border-gray-800">
                        <FolderOpen className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-base font-medium text-gray-900 dark:text-white mb-1">Không có dữ liệu</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Chưa có sản phẩm nào. Hãy thêm sản phẩm đầu tiên.</p>
                      <button
                        onClick={() => {
                          setModalMode('add');
                          setFormData({
                            id: 0, productId: '', name: '', slug: '', unitId: null, price: 0, promotionalPrice: 0, status: 'ACTIVE', shortDescription: '', description: '', images: [], categoryIds: [], attributes: []
                          });
                          setErrors({});
                          setActiveTab('basic');
                          setIsDrawerOpen(true);
                        }}
                        className="flex items-center gap-2 px-5 py-2.5 bg-[#5865f2] hover:bg-[#4752c4] text-white rounded-[4px] text-sm font-medium transition-colors cursor-pointer"
                      >
                        <Plus className="w-4 h-4" /> Thêm Sản Phẩm Mới
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                currentData.map((unit, index) => (
                  <tr key={unit.id} className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50/50 dark:hover:bg-[#262930] dark:bg-[#1a1b23] dark:hover:bg-[#1a1b23]/60 transition-colors group animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-4 h-4 rounded-[4px] border flex items-center justify-center cursor-pointer transition-colors shrink-0 ${selectedIds.includes(unit.id)
                            ? 'bg-[#5865f2] border-[#5865f2]'
                            : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-transparent'
                            }`}
                          onClick={() => toggleSelect(unit.id)}
                        >
                          {selectedIds.includes(unit.id) && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <span className="font-medium text-[#5865f2] hover:underline text-sm cursor-pointer">
                          {unit.productId}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 border-l border-gray-200 dark:border-gray-800 min-w-[300px] max-w-[400px] whitespace-normal">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{unit.name}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{unit.shortDescription}</div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 border-l border-gray-200 dark:border-gray-800">
                      <div>
                        {unit.unit && (
                          <div className="flex items-center gap-1.5 mb-1 text-sm font-medium text-[#5865f2]">
                            <Building2 className="w-3.5 h-3.5" /> {unit.unit.name}
                          </div>
                        )}
                        {unit.categories && unit.categories.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1.5 max-w-[200px]">
                            {unit.categories.map((c: any) => (
                              <span key={c.id} className="inline-block px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 rounded-[2px] text-[10px] whitespace-nowrap">{c.name}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 border-l border-gray-200 dark:border-gray-800">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                          {unit.promotionalPrice > 0 ? unit.promotionalPrice.toLocaleString() : unit.price?.toLocaleString()} đ
                        </span>
                        {unit.promotionalPrice > 0 && unit.price > 0 && (
                          <span className="text-xs text-gray-400 line-through">
                            {unit.price.toLocaleString()} đ
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 border-l border-gray-200 dark:border-gray-800">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-[4px] text-xs font-medium ${unit.status === 'ACTIVE' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 dark:bg-emerald-900/20 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/30' :
                        unit.status === 'PENDING' ? 'bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400 border border-orange-200 dark:border-orange-800/30' :
                          'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 dark:bg-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
                        }`}>
                        {STATUS_MAP[unit.status] || unit.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 border-l border-gray-200 dark:border-gray-800 text-center">
                      <div className="flex items-center justify-center">
                        <ActionMenu
                          items={[
                            {
                              label: 'Chỉnh sửa', icon: Edit, onClick: () => {
                                setModalMode('edit');
                                setFormData({
                                  ...unit,
                                  slug: (unit as any).slug || '',
                                  shortDescription: (unit as any).shortDescription || '',
                                  description: (unit as any).description || '',
                                  price: (unit as any).price || 0,
                                  promotionalPrice: (unit as any).promotionalPrice || 0,
                                  unitId: (unit as any).unitId || null,
                                  images: (unit as any).images || [],
                                  categoryIds: (unit as any).categories?.map((c: any) => c.id) || [],
                                  attributes: Array.isArray((unit as any).attributes) ? (unit as any).attributes : []
                                });
                                setErrors({});
                                setActiveTab('basic');
                                setIsDrawerOpen(true);
                              }
                            },
                            { label: 'Xóa', icon: Trash2, onClick: () => handleDelete(unit.id), variant: 'danger', separatorBefore: true }
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

        {/* Pagination Header (Matches Demo) */}
        {totalPages > 0 && (
          <div className="sticky bottom-0 z-20 px-5 py-3 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-[#1a1b23] backdrop-blur-md">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Hiển thị <span className="font-medium text-gray-900 dark:text-white">{page * itemsPerPage + 1} - {Math.min((page + 1) * itemsPerPage, filteredData.length)}</span> trong <span className="font-medium text-gray-900 dark:text-white">{filteredData.length}</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
                className="p-1.5 rounded-[4px] border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-white dark:bg-[#14151a] dark:hover:bg-gray-800 disabled:opacity-50 transition-colors bg-white dark:bg-[#14151a]"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="px-3 text-sm font-medium text-gray-700 dark:text-gray-300">{page + 1} / {totalPages}</div>
              <button
                onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page === totalPages - 1}
                className="p-1.5 rounded-[4px] border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-white dark:bg-[#14151a] dark:hover:bg-gray-800 disabled:opacity-50 transition-colors bg-white dark:bg-[#14151a]"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* SlideOver Drawer for Add/Edit */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-gray-900/40 dark:bg-black/60 backdrop-blur-sm transition-opacity duration-200 animate-in fade-in" onClick={() => setIsDrawerOpen(false)} />
          <div className="relative bg-white dark:bg-[#14151a] w-full max-w-3xl h-full flex flex-col border-l border-gray-200 dark:border-gray-800 animate-in slide-in-from-right duration-300 shadow-none z-10">

            {/* Drawer Header */}
            <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-[#14151a]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-[4px] bg-[#5865f2]/10 flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-[#5865f2]" />
                </div>
                <div>
                  <h2 className="text-base font-medium text-gray-900 dark:text-white tracking-tight">
                    {modalMode === 'add' ? 'Thêm Sản Phẩm Mới' : 'Cập Nhật Sản Phẩm'}
                  </h2>
                </div>
              </div>
              <button onClick={() => setIsDrawerOpen(false)} className="p-1.5 rounded-[4px] hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300 transition-colors cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <form id="unit-form" onSubmit={handleSave} className="p-6 space-y-8">

                {/* Section: Thông tin chung */}
                <div className="space-y-5">
                  <h3 className="text-xs font-medium text-[#5865f2] dark:text-[#5865f2] uppercase tracking-wider flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#5865f2]"></span>
                    Thông tin cơ bản
                  </h3>

                  <div className="grid grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Tên Sản Phẩm <span className="text-red-500">*</span></label>
                      <input type="text" value={formData.name} onChange={e => { setFormData({ ...formData, name: e.target.value }); if (errors.name) setErrors({ ...errors, name: '' }) }} className={`w-full px-3 bg-gray-50/50 dark:bg-[#1a1b23] border ${errors.name ? 'border-red-500 focus:ring-red-500/20' : 'border-gray-200 dark:border-gray-700 focus:ring-[#5865f2]/20'} text-sm h-10 rounded-[4px] text-gray-900 dark:text-white transition-all hover:bg-white dark:hover:bg-[#262930] focus:outline-none focus:ring-[3px] focus:border-[#5865f2]/40`} placeholder="VD: Sofa Băng Da Bò..." />
                      {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Đường dẫn thân thiện (Slug)</label>
                      <input type="text" value={formData.slug} onChange={e => setFormData({ ...formData, slug: e.target.value })} className="w-full px-3 bg-gray-50/50 dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-700 text-sm h-10 rounded-[4px] text-gray-900 dark:text-white transition-all hover:bg-white dark:hover:bg-[#262930] focus:outline-none focus:ring-[3px] focus:ring-[#5865f2]/20 focus:border-[#5865f2]/40" placeholder="sofa-bang-da-bo" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-5">
                    <div className="space-y-1.5 relative z-50">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Đơn vị chính</label>
                      <CustomDropdown
                        className="w-full"
                        options={[{ value: '', label: '-- Không chọn --' }, ...units.map(u => ({ value: u.id.toString(), label: u.name }))]}
                        value={formData.unitId ? formData.unitId.toString() : ''}
                        onChange={val => {
                          const unitId = val ? parseInt(val) : null;
                          const unit = units.find(u => u.id === unitId);
                          setFormData({
                            ...formData,
                            unitId,
                            categoryIds: unit?.categories && unit.categories.length > 0 ? unit.categories.map((c: any) => c.id) : formData.categoryIds
                          });
                        }}
                      />
                    </div>
                    <div className="space-y-1.5 relative z-40">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Trạng Thái</label>
                      <CustomDropdown className="w-full" options={Object.entries(STATUS_MAP).map(([v, l]) => ({ value: v, label: l }))} value={formData.status} onChange={v => setFormData({ ...formData, status: v })} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Giá bán (VNĐ)</label>
                      <input type="number" value={formData.price} onChange={e => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })} className="w-full px-3 bg-gray-50/50 dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-700 text-sm h-10 rounded-[4px] text-gray-900 dark:text-white transition-all hover:bg-white dark:hover:bg-[#262930] focus:outline-none focus:ring-[3px] focus:ring-[#5865f2]/20" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Giá khuyến mãi (VNĐ)</label>
                      <input type="number" value={formData.promotionalPrice} onChange={e => setFormData({ ...formData, promotionalPrice: parseInt(e.target.value) || 0 })} className="w-full px-3 bg-gray-50/50 dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-700 text-sm h-10 rounded-[4px] text-gray-900 dark:text-white transition-all hover:bg-white dark:hover:bg-[#262930] focus:outline-none focus:ring-[3px] focus:ring-[#5865f2]/20" />
                    </div>
                  </div>

                  <div className="space-y-1.5 relative z-30">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      Danh mục
                      <span className="text-xs text-gray-400 font-normal italic">(Sẽ tự động tick nếu bạn chọn Đơn vị chính ở trên)</span>
                    </label>
                    <CustomMultiSelect 
                      className="w-full"
                      options={categoryOptions}
                      value={(formData.categoryIds || []).map(id => id.toString())}
                      onChange={handleCategoryChange}
                      placeholder="Chọn danh mục..."
                    />
                  </div>

                  <div className="space-y-5 pt-6 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-medium text-[#5865f2] dark:text-[#5865f2] uppercase tracking-wider flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#5865f2]"></span>
                        Thông số kỹ thuật
                      </h3>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, attributes: [...(formData.attributes || []), { name: '', value: '' }] })}
                        className="text-xs text-[#5865f2] font-medium hover:underline flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" /> Thêm thuộc tính
                      </button>
                    </div>
                    
                    {formData.attributes && formData.attributes.length > 0 ? (
                      <div className="space-y-3">
                        {formData.attributes.map((attr, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <input
                              type="text"
                              value={attr.name}
                              onChange={(e) => {
                                const newAttr = [...formData.attributes];
                                newAttr[index].name = e.target.value;
                                setFormData({ ...formData, attributes: newAttr });
                              }}
                              className="w-1/3 px-3 bg-gray-50/50 dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-700 text-sm h-10 rounded-[4px] text-gray-900 dark:text-white transition-all hover:bg-white dark:hover:bg-[#262930] focus:outline-none focus:ring-[3px] focus:border-[#5865f2]/40"
                              placeholder="Tên (VD: Màu sắc)"
                            />
                            <input
                              type="text"
                              value={attr.value}
                              onChange={(e) => {
                                const newAttr = [...formData.attributes];
                                newAttr[index].value = e.target.value;
                                setFormData({ ...formData, attributes: newAttr });
                              }}
                              className="w-full px-3 bg-gray-50/50 dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-700 text-sm h-10 rounded-[4px] text-gray-900 dark:text-white transition-all hover:bg-white dark:hover:bg-[#262930] focus:outline-none focus:ring-[3px] focus:border-[#5865f2]/40"
                              placeholder="Giá trị (VD: Nâu đen)"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const newAttr = formData.attributes.filter((_, i) => i !== index);
                                setFormData({ ...formData, attributes: newAttr });
                              }}
                              className="p-2.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-[4px] transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500 dark:text-gray-400 italic">Chưa có thuộc tính nào. Bấm "Thêm thuộc tính" để tạo các thông số kỹ thuật cho sản phẩm.</div>
                    )}
                  </div>

                  <div className="space-y-1.5 pt-6 border-t border-gray-100 dark:border-gray-800">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Mô tả ngắn</label>
                    <textarea rows={2} value={formData.shortDescription} onChange={e => setFormData({ ...formData, shortDescription: e.target.value })} className="w-full bg-gray-50/50 dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-700 text-sm rounded-[4px] text-gray-900 dark:text-white p-3 transition-all hover:bg-white dark:hover:bg-[#262930] focus:outline-none focus:ring-[3px] focus:ring-[#5865f2]/20 resize-none h-20" placeholder="Mô tả nhanh gọn..." />
                  </div>

                  <div className="space-y-1.5 pt-6 border-t border-gray-100 dark:border-gray-800">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">Thư viện ảnh Sản phẩm</label>
                    <ImageUploader initialImages={formData.images} onUploadSuccess={(urls) => setFormData({ ...formData, images: [...formData.images, ...urls] })} onRemoveImage={(url) => setFormData({ ...formData, images: formData.images.filter(i => i !== url) })} maxFiles={10} />
                  </div>
                </div>

                <div className="h-px bg-gray-100 dark:bg-gray-800/60 -mx-6"></div>

                <div className="space-y-5">
                  <h3 className="text-xs font-medium text-[#5865f2] dark:text-[#5865f2] uppercase tracking-wider flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-50 dark:bg-amber-500/100"></span>
                    Bài viết giới thiệu chi tiết
                  </h3>
                  <div className="space-y-1.5">
                    <div className="border border-gray-200 dark:border-gray-700 rounded-[4px] overflow-hidden bg-white dark:bg-[#14151a]">
                      <TiptapEditor value={formData.description} onChange={(content) => setFormData({ ...formData, description: content })} />
                    </div>
                  </div>
                </div>

              </form>
            </div>

            {/* Drawer Footer */}
            <div className="h-20 flex items-center justify-end gap-3 px-6 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-[#14151a] shrink-0">
              <button type="button" onClick={() => setIsDrawerOpen(false)} className="flex items-center gap-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1b23] hover:bg-gray-50 dark:hover:bg-[#262930] dark:bg-[#1a1b23] dark:hover:bg-[#262930] text-gray-700 dark:text-gray-200 rounded-[4px] text-sm h-10 px-5 cursor-pointer font-medium transition-colors">
                <X className="w-4 h-4" /> Hủy bỏ
              </button>
              <button type="submit" form="unit-form" className="flex items-center gap-2 bg-[#5865f2] hover:bg-[#4752c4] text-white rounded-[4px] font-medium text-sm h-10 px-6 border-0 cursor-pointer transition-colors">
                <Check className="w-4 h-4" /> {modalMode === 'add' ? 'Thêm mới' : 'Lưu thay đổi'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
