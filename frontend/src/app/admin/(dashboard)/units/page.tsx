"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Search, Plus, Filter, Edit, Trash2, Building2, X, ChevronLeft, ChevronRight, Check, ArrowUpDown, ChevronDown, ChevronUp, MapPin, Phone } from 'lucide-react';
import { format } from 'date-fns';
import CustomDropdown from '@/admin-components/ui/CustomDropdown';
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

export default function UnitsPage() {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUnits = async () => {
    try {
      setIsLoading(true);
      const res = await apiClient.get('/units');
      setData(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error('Failed to fetch units:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUnits();
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
    unitId: '',
    name: '',
    slug: '',
    segment: 'trung-cap',
    location: '',
    projectType: '',
    style: '',
    experience: 0,
    status: 'ACTIVE',
    phone: '',
    email: '',
    shortDescription: '',
    description: '',
    avatar: [] as string[],
    isVisible: true,
    isPinned: false
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const activeFiltersCount = (statusFilter.length > 0 ? 1 : 0) + (segmentFilter.length > 0 ? 1 : 0);
  const hasActiveFilter = activeFiltersCount > 0;

  // Filter Data
  const filteredData = Array.isArray(data) ? data.filter(unit => {
    const matchesSearch = unit.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      unit.phone?.includes(searchQuery) ||
      unit.unitId?.toLowerCase().includes(searchQuery.toLowerCase());
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
        if (!createData.unitId) createData.unitId = `UN${Math.floor(Math.random() * 1000)}`;
        if (!createData.slug) createData.slug = createData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.floor(Math.random() * 10000);
        await apiClient.post('/units', createData);
      } else {
        const { id, ...updateData } = formData;
        if (!updateData.slug) updateData.slug = updateData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.floor(Math.random() * 10000);
        await apiClient.patch(`/units/${id}`, updateData);
      }
      setIsDrawerOpen(false);
      fetchUnits();
    } catch (error) {
      console.error('Failed to save unit:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa đơn vị này?')) return;
    try {
      await apiClient.delete(`/units/${id}`);
      fetchUnits();
    } catch (error) {
      console.error('Failed to delete unit:', error);
    }
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
                placeholder="Tìm Mã HĐ, Tên Đơn vị, SĐT..."
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
            <button
              onClick={() => {
                setModalMode('add');
                setFormData({
                  id: 0, unitId: '', name: '', slug: '', segment: 'trung-cap', location: '', projectType: '', style: '', experience: 0, status: 'ACTIVE', phone: '', email: '', shortDescription: '', description: '', avatar: [], isVisible: true, isPinned: false
                });
                setErrors({});
                setActiveTab('basic');
                setIsDrawerOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-[#5865f2] hover:bg-[#4752c4] text-white rounded-[4px] text-sm font-medium transition-colors border-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Tạo Đơn Vị
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
                <div className="absolute top-16 left-0 z-50 w-full p-2 bg-white dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-800 rounded-[4px] shadow-sm">
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
                <div className="absolute top-16 left-0 z-50 w-full p-2 bg-white dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-800 rounded-[4px] shadow-sm">
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
              <h3 className="font-heading font-medium text-gray-900 dark:text-white text-sm">Tổng Quan Đơn Vị</h3>
              {!isSummaryCollapsed && (
                <span className="text-xs text-gray-500 dark:text-gray-400">{summary.totalItems} đơn vị trong bộ lọc</span>
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
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-200">Ngừng Hợp Tác</span>
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
                    <div className="flex items-center cursor-pointer hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-300 select-none uppercase tracking-wide" onClick={() => handleSort('unitId')}>
                      Mã ĐV <SortIcon columnKey="unitId" />
                    </div>
                  </div>
                </th>
                <th className="px-5 py-3.5 font-medium text-gray-500 dark:text-gray-400 text-xs border-l border-gray-200 dark:border-gray-800 cursor-pointer hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-300 select-none uppercase tracking-wide" onClick={() => handleSort('name')}>
                  <div className="flex items-center">Tên Đơn Vị <SortIcon columnKey="name" /></div>
                </th>
                <th className="px-5 py-3.5 font-medium text-gray-500 dark:text-gray-400 text-xs border-l border-gray-200 dark:border-gray-800 cursor-pointer hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-300 select-none uppercase tracking-wide" onClick={() => handleSort('segment')}>
                  <div className="flex items-center">Phân Khúc / Thế Mạnh <SortIcon columnKey="segment" /></div>
                </th>
                <th className="px-5 py-3.5 font-medium text-gray-500 dark:text-gray-400 text-xs border-l border-gray-200 dark:border-gray-800 cursor-pointer hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-300 select-none uppercase tracking-wide">
                  <div className="flex items-center">Liên hệ</div>
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
              {currentData.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-16 text-center animate-in fade-in zoom-in-95 duration-500">
                    <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800/50 rounded-full flex items-center justify-center mb-4 border border-gray-200 dark:border-gray-700/50">
                        <Building2 className="w-8 h-8 text-gray-400 dark:text-gray-500 dark:text-gray-400" strokeWidth={1.5} />
                      </div>
                      <h3 className="font-heading text-lg font-medium text-gray-900 dark:text-white mb-2">Không tìm thấy đơn vị nào</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-sm">
                        Hãy thử thay đổi bộ lọc hoặc thêm mới đơn vị đối tác.
                      </p>
                      <button
                        onClick={() => {
                          setModalMode('add');
                          setFormData({
                            id: 0, unitId: '', name: '', slug: '', segment: 'trung-cap', location: '', projectType: '', style: '', experience: 0, status: 'ACTIVE', phone: '', email: '', shortDescription: '', description: '', avatar: [], isVisible: true, isPinned: false
                          });
                          setErrors({});
                          setActiveTab('basic');
                          setIsDrawerOpen(true);
                        }}
                        className="flex items-center gap-2 px-5 py-2.5 bg-[#5865f2] hover:bg-[#4752c4] text-white rounded-[4px] text-sm font-medium transition-colors cursor-pointer"
                      >
                        <Plus className="w-4 h-4" /> Tạo Đơn Vị Ngay
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
                          {unit.unitId}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 border-l border-gray-200 dark:border-gray-800">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{unit.name}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{unit.shortDescription}</div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 border-l border-gray-200 dark:border-gray-800">
                      <div>
                        <span className={`inline-block px-1.5 py-0.5 rounded-[4px] text-xs font-medium mb-1 ${unit.segment === 'cao-cap' ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 dark:bg-amber-900/20 dark:text-amber-400' :
                            unit.segment === 'trung-cap' ? 'bg-blue-50 text-blue-700 dark:text-blue-400 dark:bg-blue-900/20 dark:text-blue-400' :
                              'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 dark:bg-gray-800 dark:text-gray-300'
                          }`}>
                          {SEGMENT_MAP[unit.segment] || unit.segment}
                        </span>
                        <div className="text-xs text-gray-700 dark:text-gray-300 truncate max-w-[200px]">{unit.projectType}</div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 border-l border-gray-200 dark:border-gray-800">
                      <div className="flex flex-col gap-1 text-xs text-gray-600 dark:text-gray-300">
                        <div className="flex items-center gap-1.5"><Phone className="w-3 h-3 text-gray-400" /> {unit.phone}</div>
                        <div className="flex items-center gap-1.5"><MapPin className="w-3 h-3 text-gray-400" /> {unit.location}</div>
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
                                  avatar: (unit as any).avatar ? (Array.isArray((unit as any).avatar) ? (unit as any).avatar : [(unit as any).avatar]) : [],
                                  description: (unit as any).description || ''
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
                  <h2 className="font-heading text-base font-medium text-gray-900 dark:text-white tracking-tight">
                    {modalMode === 'add' ? 'Thêm Đơn Vị Đối Tác Mới' : 'Cập Nhật Đơn Vị'}
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
                  <h3 className="font-heading text-xs font-medium text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#5865f2]"></span>
                    Thông tin chung
                  </h3>

                  <div className="grid grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Tên Đơn Vị <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Building2 className="h-4 w-4 text-gray-400 dark:text-gray-500 dark:text-gray-400" />
                        </div>
                        <input type="text" value={formData.name} onChange={e => { setFormData({ ...formData, name: e.target.value }); if (errors.name) setErrors({ ...errors, name: '' }) }} className={`pl-9 w-full bg-gray-50/50 dark:bg-[#1a1b23] border ${errors.name ? 'border-red-500 focus:ring-red-500/20' : 'border-gray-200 dark:border-gray-700 focus:ring-[#5865f2]/20'} text-sm h-10 rounded-[4px] text-gray-900 dark:text-white transition-all hover:bg-white dark:bg-[#14151a] dark:hover:bg-[#1a1b23] focus:outline-none focus:ring-[3px] focus:border-[#5865f2]/40`} placeholder="VD: Công ty Kiến trúc Xanh..." />
                      </div>
                      {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Đường dẫn thân thiện (Slug)</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Search className="h-4 w-4 text-gray-400 dark:text-gray-500 dark:text-gray-400" />
                        </div>
                        <input type="text" value={formData.slug} onChange={e => setFormData({ ...formData, slug: e.target.value })} className="pl-9 w-full bg-gray-50/50 dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-700 text-sm h-10 rounded-[4px] text-gray-900 dark:text-white transition-all hover:bg-white dark:bg-[#14151a] dark:hover:bg-[#1a1b23] focus:outline-none focus:ring-[3px] focus:ring-[#5865f2]/20 focus:border-[#5865f2]/40" placeholder="cong-ty-kien-truc-xanh" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Số điện thoại</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Phone className="h-4 w-4 text-gray-400 dark:text-gray-500 dark:text-gray-400" />
                        </div>
                        <input type="text" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="pl-9 w-full bg-gray-50/50 dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-700 text-sm h-10 rounded-[4px] text-gray-900 dark:text-white transition-all hover:bg-white dark:bg-[#14151a] dark:hover:bg-[#1a1b23] focus:outline-none focus:ring-[3px] focus:ring-[#5865f2]/20 focus:border-[#5865f2]/40" placeholder="0901..." />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Search className="h-4 w-4 text-gray-400 dark:text-gray-500 dark:text-gray-400" />
                        </div>
                        <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="pl-9 w-full bg-gray-50/50 dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-700 text-sm h-10 rounded-[4px] text-gray-900 dark:text-white transition-all hover:bg-white dark:bg-[#14151a] dark:hover:bg-[#1a1b23] focus:outline-none focus:ring-[3px] focus:ring-[#5865f2]/20 focus:border-[#5865f2]/40" placeholder="contact@email.com" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Mô tả ngắn</label>
                    <textarea rows={2} value={formData.shortDescription} onChange={e => setFormData({ ...formData, shortDescription: e.target.value })} className="w-full bg-gray-50/50 dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-700 text-sm rounded-[4px] text-gray-900 dark:text-white p-3 transition-all hover:bg-white dark:bg-[#14151a] dark:hover:bg-[#1a1b23] focus:outline-none focus:ring-[3px] focus:ring-[#5865f2]/20 focus:border-[#5865f2]/40 resize-none h-20" placeholder="Giới thiệu nhanh về đơn vị..." />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">Ảnh Đại Diện/Logo Đơn Vị</label>
                    <ImageUploader initialImages={formData.avatar} onUploadSuccess={(urls) => setFormData({ ...formData, avatar: urls })} onRemoveImage={(url) => setFormData({ ...formData, avatar: formData.avatar.filter(i => i !== url) })} maxFiles={1} />
                  </div>
                </div>

                <div className="h-px bg-gray-100 dark:bg-gray-800/60 -mx-6"></div>

                {/* Section: Năng lực */}
                <div className="space-y-5">
                  <h3 className="font-heading text-xs font-medium text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#43b581]"></span>
                    Năng lực & Thế mạnh
                  </h3>

                  <div className="grid grid-cols-2 gap-5">
                    <div className="space-y-1.5 relative z-40">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Phân Khúc</label>
                      <CustomDropdown className="w-full" options={Object.entries(SEGMENT_MAP).map(([v, l]) => ({ value: v, label: l }))} value={formData.segment} onChange={v => setFormData({ ...formData, segment: v })} />
                    </div>
                    <div className="space-y-1.5 relative z-40">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Trạng Thái</label>
                      <CustomDropdown className="w-full" options={Object.entries(STATUS_MAP).map(([v, l]) => ({ value: v, label: l }))} value={formData.status} onChange={v => setFormData({ ...formData, status: v })} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Khu Vực Hoạt Động</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <MapPin className="h-4 w-4 text-gray-400 dark:text-gray-500 dark:text-gray-400" />
                        </div>
                        <input type="text" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} className="pl-9 w-full bg-gray-50/50 dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-700 text-sm h-10 rounded-[4px] text-gray-900 dark:text-white transition-all hover:bg-white dark:bg-[#14151a] dark:hover:bg-[#1a1b23] focus:outline-none focus:ring-[3px] focus:ring-[#5865f2]/20 focus:border-[#5865f2]/40" placeholder="Hà Nội, Miền Bắc..." />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Số năm kinh nghiệm</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Search className="h-4 w-4 text-gray-400 dark:text-gray-500 dark:text-gray-400" />
                        </div>
                        <input type="number" min="0" value={formData.experience} onChange={e => setFormData({ ...formData, experience: parseInt(e.target.value) || 0 })} className="pl-9 w-full bg-gray-50/50 dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-700 text-sm h-10 rounded-[4px] text-gray-900 dark:text-white transition-all hover:bg-white dark:bg-[#14151a] dark:hover:bg-[#1a1b23] focus:outline-none focus:ring-[3px] focus:ring-[#5865f2]/20 focus:border-[#5865f2]/40" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Loại Công Trình Thế Mạnh</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Search className="h-4 w-4 text-gray-400 dark:text-gray-500 dark:text-gray-400" />
                        </div>
                        <input type="text" value={formData.projectType} onChange={e => setFormData({ ...formData, projectType: e.target.value })} className="pl-9 w-full bg-gray-50/50 dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-700 text-sm h-10 rounded-[4px] text-gray-900 dark:text-white transition-all hover:bg-white dark:bg-[#14151a] dark:hover:bg-[#1a1b23] focus:outline-none focus:ring-[3px] focus:ring-[#5865f2]/20 focus:border-[#5865f2]/40" placeholder="Chung cư, Nhà phố..." />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Phong Cách Thiết Kế</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Search className="h-4 w-4 text-gray-400 dark:text-gray-500 dark:text-gray-400" />
                        </div>
                        <input type="text" value={formData.style} onChange={e => setFormData({ ...formData, style: e.target.value })} className="pl-9 w-full bg-gray-50/50 dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-700 text-sm h-10 rounded-[4px] text-gray-900 dark:text-white transition-all hover:bg-white dark:bg-[#14151a] dark:hover:bg-[#1a1b23] focus:outline-none focus:ring-[3px] focus:ring-[#5865f2]/20 focus:border-[#5865f2]/40" placeholder="Hiện đại, Luxury..." />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="h-px bg-gray-100 dark:bg-gray-800/60 -mx-6"></div>

                <div className="space-y-5">
                  <h3 className="font-heading text-xs font-medium text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
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
