"use client";
import React, { useState } from 'react';
import { Search, Plus, Filter, Edit, Trash2, FolderKanban, X, ChevronLeft, ChevronRight, Check, ArrowUpDown, ChevronDown, ChevronUp, CheckCircle2, Building2, Banknote, Maximize, Tag, Image as ImageIcon, RotateCcw } from 'lucide-react';
import apiClient from '@/admin-lib/apiClient';
import { format } from 'date-fns';
import CustomDropdown from '@/admin-components/ui/CustomDropdown';
import { ActionMenu } from '@/admin-components/ui/ActionMenu';
import { ImageUploader } from '@/admin-components/ui/image-uploader';
import { toast } from 'sonner';

const STATUS_MAP: Record<string, string> = {
  'IN_PROGRESS': 'Đang thi công',
  'COMPLETED': 'Hoàn thành'
};

const PROJECT_TYPE_MAP: Record<string, string> = {
  'Chung cư': 'Chung cư',
  'Nhà phố': 'Nhà phố',
  'Biệt thự': 'Biệt thự',
  'Văn phòng': 'Văn phòng'
};

export default function ProjectsPage() {
  const [data, setData] = useState<any[]>([]);
  const [unitOptions, setUnitOptions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProjectsData = async () => {
    try {
      setIsLoading(true);
      const [resProj, resUnits] = await Promise.all([
        apiClient.get('/projects'),
        apiClient.get('/units')
      ]);
      setData(Array.isArray(resProj.data) ? resProj.data : []);
      setUnitOptions(Array.isArray(resUnits.data) ? resUnits.data.map((u: any) => ({ value: u.id.toString(), label: u.name })) : []);
    } catch (error) {
      console.error('Failed to fetch projects data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchProjectsData();
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
  const [typeFilter, setTypeFilter] = useState<string[]>([]);
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(false);
  const [isSummaryCollapsed, setIsSummaryCollapsed] = useState(false);

  const [openStatusPopover, setOpenStatusPopover] = useState(false);
  const [openTypePopover, setOpenTypePopover] = useState(false);

  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null);

  const activeFiltersCount = (statusFilter.length > 0 ? 1 : 0) + (typeFilter.length > 0 ? 1 : 0);
  const hasActiveFilter = activeFiltersCount > 0;

  const [formData, setFormData] = useState({
    id: '',
    name: '',
    unitId: '',
    projectType: 'Chung cư',
    budget: '',
    area: 0,
    status: 'IN_PROGRESS' as 'IN_PROGRESS' | 'COMPLETED',
    startDate: new Date().toISOString().split('T')[0],
    images: [] as string[],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const filteredData = Array.isArray(data) ? data.filter(project => {
    const matchesSearch = project.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.unitName?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter.length === 0 || statusFilter.includes(project.status);
    const matchesType = typeFilter.length === 0 || typeFilter.includes(project.projectType);
    return matchesSearch && matchesStatus && matchesType;
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

  const summary = {
    totalItems: filteredData.length,
    inProgressCount: filteredData.filter(d => d.status === 'IN_PROGRESS').length,
    completedCount: filteredData.filter(d => d.status === 'COMPLETED').length,
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === currentData.length && currentData.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(currentData.map(c => c.id.toString()));
    }
  };

  const toggleSelect = (id: string) => {
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

  const SortIcon = ({ columnKey }: { columnKey: string }) => {
    if (sortConfig?.key !== columnKey) return <ArrowUpDown className="w-3 h-3 ml-1 opacity-50" />;
    return sortConfig.direction === 'asc' ? <ChevronUp className="w-3 h-3 ml-1" /> : <ChevronDown className="w-3 h-3 ml-1" />;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const newErrors: Record<string, string> = {};
    if (!formData.name?.trim()) newErrors.name = 'Tên dự án không được để trống';
    if (!formData.unitId) newErrors.unitId = 'Vui lòng chọn đơn vị phụ trách';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }
    setErrors({});

    const unitName = unitOptions.find(u => u.value === formData.unitId)?.label || '';

    try {
      if (modalMode === 'add') {
        const { id, images, ...createData } = formData;
        await apiClient.post('/projects', {
          ...createData,
          unitId: formData.unitId,
          gallery: images,
          unitName
        });
      } else {
        const { id, images, ...updateData } = formData;
        await apiClient.patch(`/projects/${id}`, {
          ...updateData,
          unitId: formData.unitId,
          gallery: images,
          unitName
        });
      }
      setIsDrawerOpen(false);
      fetchProjectsData();
    } catch (error) {
      console.error('Failed to save project:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa dự án này?')) return;
    try {
      await apiClient.delete(`/projects/${id}`);
      fetchProjectsData();
    } catch (error) {
      console.error('Failed to delete project:', error);
    }
  };

  const handleToggleStatus = async (project: any) => {
    try {
      const newStatus = project.status === 'IN_PROGRESS' ? 'COMPLETED' : 'IN_PROGRESS';
      await apiClient.patch(`/projects/${project.id}`, { status: newStatus });
      fetchProjectsData();
    } catch (error) {
      console.error('Failed to update status:', error);
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
                placeholder="Tìm Tên Dự án, Đơn vị phụ trách..."
                className="pl-9 pr-4 py-2 bg-gray-50/50 dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-700 rounded-[4px] text-sm focus:outline-none focus:ring-[3px] focus:ring-[#5865f2]/20 w-full text-gray-900 dark:text-gray-100 placeholder-gray-500 transition-all"
              />
            </div>

            <button
              onClick={() => setIsFiltersExpanded(!isFiltersExpanded)}
              className={`flex items-center gap-2 px-3 h-[38px] rounded-[4px] text-sm font-medium transition-all border cursor-pointer ${isFiltersExpanded
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

          <div className="flex items-center gap-2 justify-end">
            <button
              onClick={() => {
                setModalMode('add');
                setFormData({
                  id: '', name: '', unitId: unitOptions.length > 0 ? unitOptions[0].value : '',
                  projectType: 'Chung cư', budget: '', area: 0, status: 'IN_PROGRESS',
                  startDate: new Date().toISOString().split('T')[0], images: [],
                });
                setErrors({});
                setIsDrawerOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-[#5865f2] hover:bg-[#4752c4] text-white rounded-[4px] text-sm font-medium transition-colors border-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Tạo Dự Án
            </button>
          </div>
        </div>

        {isFiltersExpanded && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-gray-50/50 dark:bg-[#14151a]/50 border border-gray-200 dark:border-gray-800 rounded-[4px] animate-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col gap-1.5 relative">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Trạng thái</span>
              <button onClick={() => setOpenStatusPopover(!openStatusPopover)} className="flex items-center justify-between w-full h-9 px-3 bg-white dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-700 rounded-[4px] text-sm text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-[#262930] dark:bg-[#1a1b23] transition-colors">
                <span className="truncate">{statusFilter.length === 0 ? "Tất cả trạng thái" : statusFilter.map(s => STATUS_MAP[s]).join(', ')}</span>
                <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400 shrink-0 ml-2" />
              </button>
              {openStatusPopover && (
                <div className="absolute top-16 left-0 z-50 w-full p-2 bg-white dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-800 rounded-[4px] shadow-sm">
                  <div className="flex flex-col gap-1">
                    {Object.entries(STATUS_MAP).map(([val, label]) => (
                      <label key={val} className="flex items-center gap-2.5 p-2 rounded-[4px] hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-800 cursor-pointer text-sm">
                        <input
                          type="checkbox" checked={statusFilter.includes(val)}
                          onChange={(e) => {
                            if (e.target.checked) setStatusFilter([...statusFilter, val]);
                            else setStatusFilter(statusFilter.filter(s => s !== val));
                            setPage(0);
                          }}
                          className="w-4 h-4 text-[#5865f2] rounded-[4px] border-gray-300"
                        />
                        <span>{label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-1.5 relative">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Loại công trình</span>
              <button onClick={() => setOpenTypePopover(!openTypePopover)} className="flex items-center justify-between w-full h-9 px-3 bg-white dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-700 rounded-[4px] text-sm text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-[#262930] dark:bg-[#1a1b23] transition-colors">
                <span className="truncate">{typeFilter.length === 0 ? "Tất cả loại hình" : typeFilter.map(s => PROJECT_TYPE_MAP[s]).join(', ')}</span>
                <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400 shrink-0 ml-2" />
              </button>
              {openTypePopover && (
                <div className="absolute top-16 left-0 z-50 w-full p-2 bg-white dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-800 rounded-[4px] shadow-sm">
                  <div className="flex flex-col gap-1">
                    {Object.entries(PROJECT_TYPE_MAP).map(([val, label]) => (
                      <label key={val} className="flex items-center gap-2.5 p-2 rounded-[4px] hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-800 cursor-pointer text-sm">
                        <input
                          type="checkbox" checked={typeFilter.includes(val)}
                          onChange={(e) => {
                            if (e.target.checked) setTypeFilter([...typeFilter, val]);
                            else setTypeFilter(typeFilter.filter(s => s !== val));
                            setPage(0);
                          }}
                          className="w-4 h-4 text-[#5865f2] rounded-[4px] border-gray-300"
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

        {/* Active tags */}
        <div className="flex flex-wrap items-center gap-2 mt-1">
          {hasActiveFilter && <span className="text-sm text-gray-500 dark:text-gray-400 font-medium mr-1">Đang lọc:</span>}
          {statusFilter.length > 0 && (
            <div className="flex items-center gap-1.5 pl-2.5 pr-1 py-1 bg-[#5865f2]/10 text-[#5865f2] border border-[#5865f2]/20 rounded-[4px] text-sm font-medium">
              Trạng thái: {statusFilter.map(s => STATUS_MAP[s]).join(', ')}
              <button onClick={() => setStatusFilter([])} className="p-0.5 hover:bg-[#5865f2]/20 rounded-[4px] transition-colors ml-1"><X className="w-3.5 h-3.5" /></button>
            </div>
          )}
          {typeFilter.length > 0 && (
            <div className="flex items-center gap-1.5 pl-2.5 pr-1 py-1 bg-amber-50 dark:bg-amber-500/100/10 text-amber-600 dark:text-amber-500 border border-amber-500/20 rounded-[4px] text-sm font-medium">
              Loại: {typeFilter.map(c => PROJECT_TYPE_MAP[c]).join(', ')}
              <button onClick={() => setTypeFilter([])} className="p-0.5 hover:bg-amber-50 dark:bg-amber-500/100/20 rounded-[4px] transition-colors ml-1"><X className="w-3.5 h-3.5" /></button>
            </div>
          )}
          {hasActiveFilter && (
            <button onClick={() => { setStatusFilter([]); setTypeFilter([]); setPage(0); }} className="flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] border border-red-500 text-xs font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors ml-2"><RotateCcw strokeWidth={2} className="w-3.5 h-3.5" /> Đặt lại</button>
          )}
        </div>
      </div>

      {/* Summary Card */}
      <div className="rounded-[4px] border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#14151a] flex-shrink-0 transition-all duration-300">
        <div className={`p-4 ${isSummaryCollapsed ? 'pb-4' : 'sm:p-5 sm:pb-5'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h3 className="font-heading font-medium text-gray-900 dark:text-white text-sm">Tổng Quan Dự Án</h3>
              {!isSummaryCollapsed && <span className="text-xs text-gray-500 dark:text-gray-400">{summary.totalItems} dự án</span>}
            </div>

            {isSummaryCollapsed && (
              <div className="flex-1 flex items-center justify-end px-6 gap-5">
                <div className="flex items-center gap-3 text-sm font-medium">
                  <span className="text-blue-600 dark:text-blue-400">{summary.inProgressCount} Đang thi công</span>
                  <span className="text-emerald-600">{summary.completedCount} Hoàn thành</span>
                </div>
              </div>
            )}

            <button onClick={() => setIsSummaryCollapsed(!isSummaryCollapsed)} className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-800 rounded-[4px] text-xs font-medium cursor-pointer">
              {isSummaryCollapsed ? 'Mở rộng' : 'Thu gọn'}
              {isSummaryCollapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
            </button>
          </div>

          {!isSummaryCollapsed && (
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-[4px] border border-blue-100 dark:border-blue-500/20 bg-blue-50/50 dark:bg-blue-500/10">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-2 h-2 bg-blue-500 rounded-[4px]"></div>
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Đang Thi Công</span>
                </div>
                <div className="text-2xl font-medium text-blue-700 dark:text-blue-400">{summary.inProgressCount}</div>
              </div>

              <div className="p-3.5 rounded-[4px] border border-emerald-100 dark:border-emerald-900/30 bg-emerald-50/50 dark:bg-emerald-500/10">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-2 h-2 bg-emerald-50 dark:bg-emerald-500/100 rounded-[4px]"></div>
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Hoàn Thành</span>
                </div>
                <div className="text-2xl font-medium text-emerald-700 dark:text-emerald-400">{summary.completedCount}</div>
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
                      className={`w-4 h-4 rounded-[4px] border flex items-center justify-center cursor-pointer transition-colors ${selectedIds.length === currentData.length && currentData.length > 0 ? 'bg-[#5865f2] border-[#5865f2]' : 'border-gray-300'
                        }`}
                      onClick={toggleSelectAll}
                    >
                      {selectedIds.length === currentData.length && currentData.length > 0 && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <div className="flex items-center cursor-pointer select-none uppercase tracking-wide" onClick={() => handleSort('name')}>
                      Tên Dự Án <SortIcon columnKey="name" />
                    </div>
                  </div>
                </th>
                <th className="px-5 py-3.5 font-medium text-gray-500 dark:text-gray-400 text-xs border-l border-gray-200 dark:border-gray-800 uppercase" onClick={() => handleSort('unitName')}>
                  <div className="flex items-center cursor-pointer">Đơn vị phụ trách <SortIcon columnKey="unitName" /></div>
                </th>
                <th className="px-5 py-3.5 font-medium text-gray-500 dark:text-gray-400 text-xs border-l border-gray-200 dark:border-gray-800 uppercase" onClick={() => handleSort('projectType')}>
                  <div className="flex items-center cursor-pointer">Loại công trình <SortIcon columnKey="projectType" /></div>
                </th>
                <th className="px-5 py-3.5 font-medium text-gray-500 dark:text-gray-400 text-xs border-l border-gray-200 dark:border-gray-800 uppercase">Ngân sách</th>
                <th className="px-5 py-3.5 font-medium text-gray-500 dark:text-gray-400 text-xs border-l border-gray-200 dark:border-gray-800 uppercase" onClick={() => handleSort('status')}>
                  <div className="flex items-center cursor-pointer">Trạng Thái <SortIcon columnKey="status" /></div>
                </th>
                <th className="px-5 py-3.5 font-medium text-gray-500 dark:text-gray-400 text-xs border-l border-gray-200 dark:border-gray-800 text-center w-24">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {currentData.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-16 text-center animate-in fade-in zoom-in-95 duration-500">
                    <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4 border border-gray-200 dark:border-gray-800">
                        <FolderKanban className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="font-heading text-lg font-medium text-gray-900 dark:text-white mb-2">Không tìm thấy dự án</h3>
                      <button onClick={() => {
                        setModalMode('add');
                        setFormData({
                          id: '', name: '', unitId: unitOptions.length > 0 ? unitOptions[0].value : '',
                          projectType: 'Chung cư', budget: '', area: 0, status: 'IN_PROGRESS',
                          startDate: new Date().toISOString().split('T')[0], images: [],
                        });
                        setErrors({});
                        setIsDrawerOpen(true);
                      }} className="mt-4 px-5 py-2.5 bg-[#5865f2] text-white rounded-[4px] text-sm font-medium">
                        Tạo Dự Án Ngay
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                currentData.map((project, index) => (
                  <tr key={project.id} className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50/50 dark:hover:bg-[#262930] dark:bg-[#1a1b23] transition-colors group animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-4 h-4 rounded-[4px] border flex items-center justify-center cursor-pointer transition-colors shrink-0 ${selectedIds.includes(project.id.toString()) ? 'bg-[#5865f2] border-[#5865f2]' : 'border-gray-300'
                            }`}
                          onClick={() => toggleSelect(project.id.toString())}
                        >
                          {selectedIds.includes(project.id.toString()) && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{project.name}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Khởi công: {format(new Date(project.startDate), 'dd/MM/yyyy')}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 border-l border-gray-200 dark:border-gray-800">
                      <div className="text-sm font-medium text-[#5865f2] truncate max-w-[180px]">{project.unitName}</div>
                    </td>
                    <td className="px-5 py-3.5 border-l border-gray-200 dark:border-gray-800">
                      <div className="text-sm text-gray-900 dark:text-white">{project.projectType}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{project.area}m²</div>
                    </td>
                    <td className="px-5 py-3.5 border-l border-gray-200 dark:border-gray-800">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{project.budget}</span>
                    </td>
                    <td className="px-5 py-3.5 border-l border-gray-200 dark:border-gray-800">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-[4px] text-xs font-medium ${project.status === 'COMPLETED' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20' : 'bg-blue-50 text-blue-700 dark:text-blue-400 border border-blue-200'
                        }`}>
                        {STATUS_MAP[project.status] || project.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 border-l border-gray-200 dark:border-gray-800 text-center">
                      <div className="flex items-center justify-center">
                        <ActionMenu
                          items={[
                            { label: 'Hoàn thành', icon: CheckCircle2, onClick: () => handleToggleStatus(project), variant: 'success' },
                            {
                              label: 'Chỉnh sửa', icon: Edit, onClick: () => {
                                setModalMode('edit');
                                setFormData({
                                  ...project,
                                  unitId: project.unitId.toString(),
                                  startDate: new Date(project.startDate).toISOString().split('T')[0],
                                  images: Array.isArray(project.gallery) ? project.gallery : (typeof project.gallery === 'string' ? JSON.parse(project.gallery) : []),
                                });
                                setErrors({});
                                setIsDrawerOpen(true);
                              }
                            },
                            { label: 'Xóa', icon: Trash2, onClick: () => handleDelete(project.id), variant: 'danger', separatorBefore: true }
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

      {/* Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-gray-900/40 dark:bg-black/60 backdrop-blur-sm transition-opacity duration-200 animate-in fade-in" onClick={() => setIsDrawerOpen(false)} />
          <div className="relative bg-white dark:bg-[#14151a] w-full max-w-4xl h-full flex flex-col border-l border-gray-200 dark:border-gray-800 animate-in slide-in-from-right duration-300 shadow-none z-10">
            <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-[#14151a]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-[4px] bg-[#5865f2]/10 flex items-center justify-center">
                  <FolderKanban className="w-4 h-4 text-[#5865f2]" />
                </div>
                <div>
                  <h2 className="font-heading text-base font-medium text-gray-900 dark:text-white tracking-tight">
                    {modalMode === 'add' ? 'Thêm Dự Án Mới' : 'Cập Nhật Dự Án'}
                  </h2>
                </div>
              </div>
              <button onClick={() => setIsDrawerOpen(false)} className="p-1.5 rounded-[4px] hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300 transition-colors cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <form id="project-form" onSubmit={handleSave} className="p-6 space-y-8">

                {/* Section: Thông tin dự án */}
                <div className="space-y-5">
                  <h3 className="font-heading text-xs font-medium text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#5865f2]"></span>
                    Thông tin dự án
                  </h3>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Tên Dự Án <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FolderKanban className="h-4 w-4 text-gray-400 dark:text-gray-500 dark:text-gray-400" />
                      </div>
                      <input type="text" value={formData.name} onChange={e => { setFormData({ ...formData, name: e.target.value }); if (errors.name) setErrors({ ...errors, name: '' }); }} className={`pl-9 w-full bg-gray-50/50 dark:bg-[#1a1b23] border ${errors.name ? 'border-red-500 focus:ring-red-500/20' : 'border-gray-200 dark:border-gray-700 focus:ring-[#5865f2]/20'} text-sm h-10 rounded-[4px] text-gray-900 dark:text-white transition-all hover:bg-white dark:bg-[#14151a] dark:hover:bg-[#1a1b23] focus:outline-none focus:ring-[3px] focus:border-[#5865f2]/40`} placeholder="Nhập tên dự án..." />
                    </div>
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                  </div>
                  <div className="space-y-1.5 relative z-40">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Đơn Vị Phụ Trách <span className="text-red-500">*</span></label>
                    <div className={errors.unitId ? 'rounded-[4px] border border-red-500' : ''}>
                      <CustomDropdown className="w-full" options={unitOptions} value={formData.unitId} onChange={val => { setFormData({ ...formData, unitId: val }); if (errors.unitId) setErrors({ ...errors, unitId: '' }); }} />
                    </div>
                    {errors.unitId && <p className="text-red-500 text-xs mt-1">{errors.unitId}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-5">
                    <div className="space-y-1.5 relative z-30">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Loại Công Trình</label>
                      <CustomDropdown className="w-full" options={[{ value: 'Chung cư', label: 'Chung cư' }, { value: 'Nhà phố', label: 'Nhà phố' }, { value: 'Biệt thự', label: 'Biệt thự' }, { value: 'Văn phòng', label: 'Văn phòng' }]} value={formData.projectType} onChange={val => setFormData({ ...formData, projectType: val })} />
                    </div>
                    <div className="space-y-1.5 relative z-30">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Trạng Thái</label>
                      <CustomDropdown className="w-full" options={[{ value: 'IN_PROGRESS', label: 'Đang thi công', color: 'blue' }, { value: 'COMPLETED', label: 'Hoàn thành', color: 'green' }]} value={formData.status} onChange={val => setFormData({ ...formData, status: val as any })} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Ngân Sách</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Banknote className="h-4 w-4 text-gray-400 dark:text-gray-500 dark:text-gray-400" />
                        </div>
                        <input type="text" required value={formData.budget} onChange={e => setFormData({ ...formData, budget: e.target.value })} className="pl-9 w-full bg-gray-50/50 dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-700 text-sm h-10 rounded-[4px] text-gray-900 dark:text-white transition-all hover:bg-white dark:bg-[#14151a] dark:hover:bg-[#1a1b23] focus:outline-none focus:ring-[3px] focus:ring-[#5865f2]/20 focus:border-[#5865f2]/40" placeholder="VD: 500 triệu..." />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Diện Tích (m²)</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Maximize className="h-4 w-4 text-gray-400 dark:text-gray-500 dark:text-gray-400" />
                        </div>
                        <input type="number" required value={formData.area} onChange={e => setFormData({ ...formData, area: parseInt(e.target.value) || 0 })} className="pl-9 w-full bg-gray-50/50 dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-700 text-sm h-10 rounded-[4px] text-gray-900 dark:text-white transition-all hover:bg-white dark:bg-[#14151a] dark:hover:bg-[#1a1b23] focus:outline-none focus:ring-[3px] focus:ring-[#5865f2]/20 focus:border-[#5865f2]/40" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="h-px bg-gray-100 dark:bg-gray-800/60 -mx-6"></div>

                {/* Section: Hình ảnh */}
                <div className="space-y-5">
                  <h3 className="font-heading text-xs font-medium text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#43b581]"></span>
                    Hình Ảnh Dự Án
                  </h3>
                  <div className="space-y-1.5">
                    <ImageUploader
                      initialImages={formData.images}
                      onUploadSuccess={(urls) => setFormData({ ...formData, images: [...formData.images, ...urls] })}
                      onRemoveImage={(url) => setFormData({ ...formData, images: formData.images.filter((i: any) => i !== url) })}
                      maxFiles={10}
                    />
                  </div>
                </div>
              </form>
            </div>

            <div className="h-20 flex items-center justify-end gap-3 px-6 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-[#14151a] shrink-0">
              <button type="button" onClick={() => setIsDrawerOpen(false)} className="flex items-center gap-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1b23] hover:bg-gray-50 dark:hover:bg-[#262930] dark:bg-[#1a1b23] dark:hover:bg-[#262930] text-gray-700 dark:text-gray-200 rounded-[4px] text-sm h-10 px-5 cursor-pointer font-medium transition-colors">
                <X className="w-4 h-4" /> Hủy bỏ
              </button>
              <button type="submit" form="project-form" className="flex items-center gap-2 bg-[#5865f2] hover:bg-[#4752c4] text-white rounded-[4px] font-medium text-sm h-10 px-6 border-0 cursor-pointer transition-colors">
                <Check className="w-4 h-4" /> {modalMode === 'add' ? 'Thêm mới' : 'Lưu thay đổi'}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
