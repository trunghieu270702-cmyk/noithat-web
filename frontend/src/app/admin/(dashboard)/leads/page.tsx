"use client";
import React, { useState } from 'react';
import { Search, Filter, MessageSquare, CheckCircle2, Plus, Edit, Trash2, X, ChevronLeft, ChevronRight, Phone, MapPin, Calendar, User, FileText, ArrowRightCircle, Check, ArrowUpDown, ChevronDown, ChevronUp, Activity, Tags, RotateCcw, Eye, Link2 } from 'lucide-react';
import apiClient from '@/admin-lib/apiClient';
import { format } from 'date-fns';
import CustomDropdown from '@/admin-components/ui/CustomDropdown';
import { ActionMenu } from '@/admin-components/ui/ActionMenu';
import { toast } from 'sonner';

const STATUS_MAP: Record<string, string> = {
  'NEW': 'Mới tạo',
  'CONTACTED': 'Đã liên hệ',
  'CONSULTING': 'Đang tư vấn',
  'WON': 'Chốt thành công',
  'LOST': 'Không phù hợp',
};

const CLASS_MAP: Record<string, string> = {
  'HOT': 'Nóng',
  'WARM': 'Ấm',
  'COLD': 'Lạnh',
};

export default function LeadsPage() {
  const [data, setData] = useState<any[]>([]);
  const [units, setUnits] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLeads = async () => {
    try {
      setIsLoading(true);
      const [leadsRes, unitsRes] = await Promise.all([
        apiClient.get('/leads'),
        apiClient.get('/units')
      ]);
      setData(Array.isArray(leadsRes.data) ? leadsRes.data : []);
      setUnits(Array.isArray(unitsRes.data) ? unitsRes.data : []);
    } catch (error) {
      console.error('Failed to fetch leads:', error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchLeads();
  }, []);
  const [page, setPage] = useState(0);
  const [itemsPerPage] = useState(25);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Modals
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [classFilter, setClassFilter] = useState<string[]>([]);
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(false);
  const [isSummaryCollapsed, setIsSummaryCollapsed] = useState(false);

  const [openStatusPopover, setOpenStatusPopover] = useState(false);
  const [openClassPopover, setOpenClassPopover] = useState(false);

  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null);

  const activeFiltersCount = (statusFilter.length > 0 ? 1 : 0) + (classFilter.length > 0 ? 1 : 0);
  const hasActiveFilter = activeFiltersCount > 0;

  const [formData, setFormData] = useState<any>({
    id: '', customerName: '', phone: '', email: '', location: '', source: 'Tự nhập', assignee: '',
    projectType: 'Chung cư', area: 0, projectLocation: '', currentStatus: '', budget: '200-500',
    timeline: '1-thang', style: 'Hiện đại', priority: 'MEDIUM', needs: 'Thiết kế & Thi công trọn gói',
    needSupervision: false, needProjectManagement: false, notes: '', status: 'NEW',
    leadClassification: 'WARM', proposedUnits: '', connectedUnit: '', callNotes: '', chatNotes: '', followUpDate: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const filteredData = Array.isArray(data) ? data.filter(lead => {
    const matchesSearch = lead.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.phone?.includes(searchQuery) ||
      lead.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter.length === 0 || statusFilter.includes(lead.status);
    const matchesClass = classFilter.length === 0 || classFilter.includes(lead.leadClassification);

    return matchesSearch && matchesStatus && matchesClass;
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
    newCount: filteredData.filter(d => d.status === 'NEW').length,
    consultingCount: filteredData.filter(d => d.status === 'CONSULTING' || d.status === 'CONTACTED').length,
    wonCount: filteredData.filter(d => d.status === 'WON').length,
    lostCount: filteredData.filter(d => d.status === 'LOST').length,
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
    if (!formData.customerName?.trim()) newErrors.customerName = 'Họ tên không được để trống';
    if (!formData.phone?.trim()) newErrors.phone = 'Số điện thoại không được để trống';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }
    setErrors({});

    const dataToSave = {
      ...formData,
      proposedUnits: typeof formData.proposedUnits === 'string' ? formData.proposedUnits.split(',').map((u: string) => u.trim()).filter(Boolean) : formData.proposedUnits
    };

    try {
      if (modalMode === 'add') {
        const { id, ...createData } = dataToSave;
        await apiClient.post('/leads', createData);
      } else {
        const { id, ...updateData } = dataToSave;
        await apiClient.patch(`/leads/${id}`, updateData);
      }
      setIsDrawerOpen(false);
      fetchLeads();
    } catch (error) {
      console.error('Failed to save lead:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa yêu cầu này?')) return;
    try {
      await apiClient.delete(`/leads/${id}`);
      fetchLeads();
    } catch (error) {
      console.error('Failed to delete lead:', error);
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
                placeholder="Tìm Tên, SĐT Khách hàng..."
                className="pl-9 pr-4 py-2 bg-gray-50/50 dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-700 rounded-[4px] text-sm focus:outline-none focus:ring-[3px] focus:ring-[#5865f2]/20 w-full text-gray-900 dark:text-gray-100 transition-all"
              />
            </div>

            <button
              onClick={() => setIsFiltersExpanded(!isFiltersExpanded)}
              className={`flex items-center gap-2 px-3 h-[38px] rounded-[4px] text-sm font-medium transition-all border cursor-pointer ${isFiltersExpanded
                ? 'bg-[#5865f2]/10 text-[#5865f2] border-[#5865f2]/50 font-medium'
                : 'bg-white dark:bg-[#1a1b23] border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#262930] dark:bg-[#1a1b23]'
                }`}
            >
              <Filter className="w-4 h-4" />
              <span>Bộ lọc</span>
              {activeFiltersCount > 0 && <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 bg-[#5865f2] text-white text-[11px] font-medium rounded-full">{activeFiltersCount}</span>}
            </button>
          </div>

          <div className="flex items-center gap-2 justify-end">
            <button
              onClick={() => {
                setModalMode('add');
                setFormData({
                  id: '', customerName: '', phone: '', email: '', location: '', source: 'Tự nhập', assignee: '',
                  projectType: 'Chung cư', area: 0, projectLocation: '', currentStatus: '', budget: '200-500',
                  timeline: '1-thang', style: 'Hiện đại', priority: 'MEDIUM', needs: 'Thiết kế & Thi công trọn gói',
                  needSupervision: false, needProjectManagement: false, notes: '', status: 'NEW',
                  leadClassification: 'WARM', proposedUnits: '', connectedUnit: '', callNotes: '', chatNotes: '', followUpDate: '',
                });
                setErrors({});
                setIsDrawerOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-[#5865f2] hover:bg-[#4752c4] text-white rounded-[4px] text-sm font-medium transition-colors border-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Tạo Yêu Cầu
            </button>
          </div>
        </div>

        {isFiltersExpanded && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-gray-50/50 dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-800 rounded-[4px] animate-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col gap-1.5 relative">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Trạng thái</span>
              <button onClick={() => setOpenStatusPopover(!openStatusPopover)} className="flex items-center justify-between w-full h-9 px-3 bg-white dark:bg-[#14151a] border border-gray-200 dark:border-gray-800 rounded-[4px] text-sm text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-[#262930] dark:bg-[#1a1b23]">
                <span className="truncate">{statusFilter.length === 0 ? "Tất cả trạng thái" : statusFilter.map(s => STATUS_MAP[s]).join(', ')}</span>
                <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400 shrink-0 ml-2" />
              </button>
              {openStatusPopover && (
                <>
                  <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); setOpenStatusPopover(false); }} />
                  <div className="absolute top-16 left-0 z-50 w-full p-2 bg-white dark:bg-[#14151a] border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm shadow-black/5 dark:shadow-none">
                    <div className="flex flex-col gap-1">
                      {Object.entries(STATUS_MAP).map(([val, label]) => (
                        <label key={val} className="flex items-center gap-2.5 p-2 rounded-[4px] hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-800 cursor-pointer text-sm">
                          <input type="checkbox" checked={statusFilter.includes(val)} onChange={(e) => {
                            if (e.target.checked) setStatusFilter([...statusFilter, val]);
                            else setStatusFilter(statusFilter.filter(s => s !== val));
                            setPage(0);
                          }} className="w-4 h-4 text-[#5865f2] rounded-[4px] border-gray-300" />
                          <span>{label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="flex flex-col gap-1.5 relative">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Tiềm năng</span>
              <button onClick={() => setOpenClassPopover(!openClassPopover)} className="flex items-center justify-between w-full h-9 px-3 bg-white dark:bg-[#14151a] border border-gray-200 dark:border-gray-800 rounded-[4px] text-sm text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-[#262930] dark:bg-[#1a1b23]">
                <span className="truncate">{classFilter.length === 0 ? "Tất cả mức độ" : classFilter.map(s => CLASS_MAP[s]).join(', ')}</span>
                <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400 shrink-0 ml-2" />
              </button>
              {openClassPopover && (
                <>
                  <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); setOpenClassPopover(false); }} />
                  <div className="absolute top-16 left-0 z-50 w-full p-2 bg-white dark:bg-[#14151a] border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm shadow-black/5 dark:shadow-none">
                    <div className="flex flex-col gap-1">
                      {Object.entries(CLASS_MAP).map(([val, label]) => (
                        <label key={val} className="flex items-center gap-2.5 p-2 rounded-[4px] hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-800 cursor-pointer text-sm">
                          <input type="checkbox" checked={classFilter.includes(val)} onChange={(e) => {
                            if (e.target.checked) setClassFilter([...classFilter, val]);
                            else setClassFilter(classFilter.filter(s => s !== val));
                            setPage(0);
                          }} className="w-4 h-4 text-[#5865f2] rounded-[4px] border-gray-300" />
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

        {/* Active tags */}
        <div className="flex flex-wrap items-center gap-2 mt-1">
          {hasActiveFilter && <span className="text-sm text-gray-500 dark:text-gray-400 font-medium mr-1">Đang lọc:</span>}
          {statusFilter.length > 0 && (
            <div className="flex items-center gap-1.5 pl-2.5 pr-1 py-1 bg-[#5865f2]/10 text-[#5865f2] border border-[#5865f2]/20 rounded-[4px] text-sm font-medium">
              Trạng thái: {statusFilter.map(s => STATUS_MAP[s]).join(', ')}
              <button onClick={() => setStatusFilter([])} className="p-0.5 hover:bg-[#5865f2]/20 rounded-[4px] transition-colors ml-1"><X className="w-3.5 h-3.5" /></button>
            </div>
          )}
          {classFilter.length > 0 && (
            <div className="flex items-center gap-1.5 pl-2.5 pr-1 py-1 bg-amber-50 dark:bg-amber-500/100/10 text-amber-600 border border-amber-500/20 rounded-[4px] text-sm font-medium">
              Tiềm năng: {classFilter.map(c => CLASS_MAP[c]).join(', ')}
              <button onClick={() => setClassFilter([])} className="p-0.5 hover:bg-amber-50 dark:bg-amber-500/100/20 rounded-[4px] transition-colors ml-1"><X className="w-3.5 h-3.5" /></button>
            </div>
          )}
          {hasActiveFilter && (
            <button onClick={() => { setStatusFilter([]); setClassFilter([]); setPage(0); }} className="flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] border border-red-500 text-xs font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors ml-2"><RotateCcw strokeWidth={2} className="w-3.5 h-3.5" /> Đặt lại</button>
          )}
        </div>
      </div>

      {/* Summary Card */}
      <div className="rounded-[4px] border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#14151a] flex-shrink-0 transition-all duration-300">
        <div className={`p-4 ${isSummaryCollapsed ? 'pb-4' : 'sm:p-5 sm:pb-5'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h3 className=" font-medium text-gray-900 dark:text-white text-sm">Tổng Quan Lead</h3>
              {!isSummaryCollapsed && <span className="text-xs text-gray-500 dark:text-gray-400">{summary.totalItems} lead</span>}
            </div>

            {isSummaryCollapsed && (
              <div className="flex-1 flex items-center justify-end px-6 gap-5">
                <div className="flex items-center gap-3 text-sm font-medium">
                  <span className="text-blue-600 dark:text-blue-400">{summary.newCount} Mới</span>
                  <span className="text-purple-600">{summary.consultingCount} Đang tư vấn</span>
                  <span className="text-emerald-600">{summary.wonCount} Chốt</span>
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
                  <div className="w-2 h-2 bg-blue-500 rounded-[4px]"></div><span className="text-xs font-medium text-gray-700 dark:text-gray-300">Mới tạo</span>
                </div>
                <div className="text-2xl font-medium text-blue-700 dark:text-blue-400">{summary.newCount}</div>
              </div>
              <div className="p-3.5 rounded-[4px] border border-purple-100 dark:border-purple-900/30 bg-purple-50/50 dark:bg-purple-500/10">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-2 h-2 bg-purple-500 rounded-[4px]"></div><span className="text-xs font-medium text-gray-700 dark:text-gray-300">Đang tư vấn</span>
                </div>
                <div className="text-2xl font-medium text-purple-700">{summary.consultingCount}</div>
              </div>
              <div className="p-3.5 rounded-[4px] border border-emerald-100 dark:border-emerald-900/30 bg-emerald-50/50 dark:bg-emerald-500/10">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-2 h-2 bg-emerald-50 dark:bg-emerald-500/100 rounded-[4px]"></div><span className="text-xs font-medium text-gray-700 dark:text-gray-300">Chốt thành công</span>
                </div>
                <div className="text-2xl font-medium text-emerald-700 dark:text-emerald-400">{summary.wonCount}</div>
              </div>
              <div className="p-3.5 rounded-[4px] border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#1a1b23]">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-2 h-2 bg-gray-50 dark:bg-[#1a1b23]0 rounded-[4px]"></div><span className="text-xs font-medium text-gray-700 dark:text-gray-300">Không phù hợp</span>
                </div>
                <div className="text-2xl font-medium text-gray-700 dark:text-gray-300">{summary.lostCount}</div>
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
                    <div className="flex items-center cursor-pointer select-none uppercase tracking-wide" onClick={() => handleSort('customerName')}>
                      Khách Hàng <SortIcon columnKey="customerName" />
                    </div>
                  </div>
                </th>
                <th className="px-5 py-3.5 font-medium text-gray-500 dark:text-gray-400 text-xs border-l border-gray-200 dark:border-gray-800 uppercase" onClick={() => handleSort('projectType')}>
                  <div className="flex items-center cursor-pointer">Thông tin dự án <SortIcon columnKey="projectType" /></div>
                </th>
                <th className="px-5 py-3.5 font-medium text-gray-500 dark:text-gray-400 text-xs border-l border-gray-200 dark:border-gray-800 uppercase" onClick={() => handleSort('status')}>
                  <div className="flex items-center cursor-pointer">Trạng thái xử lý <SortIcon columnKey="status" /></div>
                </th>
                <th className="px-5 py-3.5 font-medium text-gray-500 dark:text-gray-400 text-xs border-l border-gray-200 dark:border-gray-800 uppercase">Đơn vị tiếp nhận</th>
                <th className="px-5 py-3.5 font-medium text-gray-500 dark:text-gray-400 text-xs border-l border-gray-200 dark:border-gray-800 text-center w-24">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {currentData.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-16 text-center animate-in fade-in zoom-in-95 duration-500">
                    <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4 border border-gray-200 dark:border-gray-800">
                        <MessageSquare className="w-8 h-8 text-gray-500" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Không tìm thấy yêu cầu</h3>
                    </div>
                  </td>
                </tr>
              ) : (
                currentData.map((lead, index) => (
                  <tr key={lead.id} className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50/50 dark:hover:bg-[#262930] dark:bg-[#1a1b23] transition-colors group animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-4 h-4 rounded-[4px] border flex items-center justify-center cursor-pointer transition-colors shrink-0 ${selectedIds.includes(lead.id.toString()) ? 'bg-[#5865f2] border-[#5865f2]' : 'border-gray-300'
                            }`}
                          onClick={() => toggleSelect(lead.id.toString())}
                        >
                          {selectedIds.includes(lead.id.toString()) && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5 mb-1">
                            <span className="text-sm font-medium text-gray-900 dark:text-white">{lead.customerName}</span>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-[4px] font-medium ${lead.leadClassification === 'HOT' ? 'bg-red-100 text-red-700' :
                              lead.leadClassification === 'WARM' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400'
                              }`}>{CLASS_MAP[lead.leadClassification]}</span>
                          </div>
                          <div className="flex flex-col gap-0.5 text-xs text-gray-500 dark:text-gray-400">
                            <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {lead.phone}</span>
                            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {format(new Date(lead.createdAt), 'dd/MM/yyyy HH:mm')}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 border-l border-gray-200 dark:border-gray-800">
                      <div className="text-sm text-gray-900 dark:text-white font-medium mb-1">{lead.projectType} • {lead.area}m²</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 max-w-[250px]">{lead.location} • NS: {lead.budget}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 max-w-[250px] mt-0.5">Nhu cầu: {lead.needs}</div>
                    </td>
                    <td className="px-5 py-3.5 border-l border-gray-200 dark:border-gray-800">
                      <div className="flex flex-col items-start gap-1.5">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-[4px] text-xs font-medium ${lead.status === 'NEW' ? 'bg-blue-50 text-blue-700 dark:text-blue-400 border border-blue-200' :
                          lead.status === 'WON' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20' :
                            lead.status === 'LOST' ? 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-800' :
                              'bg-yellow-50 text-yellow-700 border border-yellow-200'
                          }`}>
                          {STATUS_MAP[lead.status] || lead.status}
                        </span>
                        <span className="text-[11px] text-gray-500 dark:text-gray-400 flex items-center gap-1"><User className="w-3 h-3" /> {lead.assignee || 'Chưa gán'}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 border-l border-gray-200 dark:border-gray-800">
                      {lead.connectedUnit ? (
                        <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[4px] bg-green-50 text-green-700 text-xs border border-green-200"><CheckCircle2 className="w-3 h-3" /> {lead.connectedUnit}</div>
                      ) : lead.proposedUnits && lead.proposedUnits.length > 0 ? (
                        <div className="text-xs text-gray-600 dark:text-gray-400"><span className="block mb-0.5 text-gray-400 text-[10px] uppercase">Đề xuất</span><span className="line-clamp-2">{Array.isArray(lead.proposedUnits) ? lead.proposedUnits.join(', ') : lead.proposedUnits}</span></div>
                      ) : <span className="text-xs text-gray-400 italic">Chưa kết nối</span>}
                    </td>
                    <td className="px-5 py-3.5 border-l border-gray-200 dark:border-gray-800 text-center">
                      <div className="flex items-center justify-center">
                        <ActionMenu
                          items={[
                            {
                              label: 'Chi tiết Yêu cầu', icon: Eye, onClick: () => {
                                setModalMode('edit');
                                setFormData({ ...lead, proposedUnits: Array.isArray(lead.proposedUnits) ? lead.proposedUnits.join(', ') : (lead.proposedUnits || '') });
                                setErrors({});
                                setIsDrawerOpen(true);
                              }
                            },
                            {
                              label: 'Cập nhật Xử lý & Kết nối', icon: Link2, onClick: () => {
                                setModalMode('edit');
                                setFormData({ ...lead, proposedUnits: Array.isArray(lead.proposedUnits) ? lead.proposedUnits.join(', ') : (lead.proposedUnits || '') });
                                setErrors({});
                                setIsStatusModalOpen(true);
                              }
                            },
                            {
                              label: 'Lịch sử & Ghi chú', icon: FileText, onClick: () => {
                                setModalMode('edit');
                                setFormData({ ...lead, proposedUnits: Array.isArray(lead.proposedUnits) ? lead.proposedUnits.join(', ') : (lead.proposedUnits || '') });
                                setErrors({});
                                setIsNotesModalOpen(true);
                              }
                            },
                            { label: 'Xóa', icon: Trash2, onClick: () => handleDelete(lead.id), variant: 'danger', separatorBefore: true }
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
            <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-[#14151a] shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-[4px] bg-[#5865f2]/10 flex items-center justify-center">
                  <Eye className="w-4 h-4 text-[#5865f2]" />
                </div>
                <div>
                  <h2 className="text-base font-medium text-gray-900 dark:text-white tracking-tight">
                    Chi Tiết Yêu Cầu
                  </h2>
                </div>
              </div>
              <button onClick={() => setIsDrawerOpen(false)} className="p-1.5 rounded-[4px] hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300 transition-colors cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <form id="lead-form" onSubmit={handleSave} className="p-6 space-y-8">
                {/* Section: Basic */}
                <div className="space-y-5">
                  <h3 className="text-xs font-medium text-[#5865f2] uppercase tracking-wider flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#5865f2]"></span>
                    Thông tin chung
                  </h3>
                  <div className="grid grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Họ Tên <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><User className="h-4 w-4 text-gray-400" /></div>
                        <input type="text" value={formData.customerName} onChange={e => { setFormData({ ...formData, customerName: e.target.value }); if (errors.customerName) setErrors({ ...errors, customerName: '' }); }} className={`pl-9 w-full bg-gray-50/50 dark:bg-[#1a1b23] border ${errors.customerName ? 'border-red-500 focus:ring-red-500/20' : 'border-gray-200 dark:border-gray-700 focus:ring-[#5865f2]/20'} text-sm h-10 rounded-[4px] text-gray-900 dark:text-white focus:outline-none focus:ring-[3px] focus:border-[#5865f2]/40 transition-all hover:bg-white dark:hover:bg-[#14151a]`} placeholder="Nguyễn Văn A..." />
                      </div>
                      {errors.customerName && <p className="text-red-500 text-xs mt-1">{errors.customerName}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Số điện thoại <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Phone className="h-4 w-4 text-gray-400" /></div>
                        <input type="text" value={formData.phone} onChange={e => { setFormData({ ...formData, phone: e.target.value }); if (errors.phone) setErrors({ ...errors, phone: '' }); }} className={`pl-9 w-full bg-gray-50/50 dark:bg-[#1a1b23] border ${errors.phone ? 'border-red-500 focus:ring-red-500/20' : 'border-gray-200 dark:border-gray-700 focus:ring-[#5865f2]/20'} text-sm h-10 rounded-[4px] text-gray-900 dark:text-white focus:outline-none focus:ring-[3px] focus:border-[#5865f2]/40 transition-all hover:bg-white dark:hover:bg-[#14151a]`} placeholder="0901..." />
                      </div>
                      {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                      <input type="email" value={formData.email || ''} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full px-3 bg-gray-50/50 dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-700 text-sm h-10 rounded-[4px] text-gray-900 dark:text-white focus:outline-none focus:ring-[3px] focus:ring-[#5865f2]/20 focus:border-[#5865f2]/40 transition-all hover:bg-white dark:hover:bg-[#14151a]" placeholder="email@example.com" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Khu vực công trình</label>
                      <input type="text" value={formData.location || ''} onChange={e => setFormData({ ...formData, location: e.target.value })} className="w-full px-3 bg-gray-50/50 dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-700 text-sm h-10 rounded-[4px] text-gray-900 dark:text-white focus:outline-none focus:ring-[3px] focus:ring-[#5865f2]/20 focus:border-[#5865f2]/40 transition-all hover:bg-white dark:hover:bg-[#14151a]" placeholder="Hà Nội, TP.HCM..." />
                    </div>
                  </div>
                </div>

                <div className="h-px bg-gray-100 dark:bg-gray-800/60 -mx-6"></div>

                {/* Section: Project */}
                <div className="space-y-5">
                  <h3 className="text-xs font-medium text-emerald-500 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    Thông tin Dự án
                  </h3>
                  <div className="grid grid-cols-2 gap-5">
                    <div className="space-y-1.5 relative z-40">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Loại hình</label>
                      <input type="text" value={formData.projectType || ''} onChange={e => setFormData({ ...formData, projectType: e.target.value })} className="w-full px-3 bg-gray-50/50 dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-700 text-sm h-10 rounded-[4px] text-gray-900 dark:text-white focus:outline-none focus:ring-[3px] focus:ring-[#5865f2]/20 focus:border-[#5865f2]/40 transition-all hover:bg-white dark:hover:bg-[#14151a]" placeholder="Chung cư, Biệt thự..." />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Diện tích (m²)</label>
                      <input type="number" value={formData.area || ''} onChange={e => setFormData({ ...formData, area: Number(e.target.value) })} className="w-full px-3 bg-gray-50/50 dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-700 text-sm h-10 rounded-[4px] text-gray-900 dark:text-white focus:outline-none focus:ring-[3px] focus:ring-[#5865f2]/20 focus:border-[#5865f2]/40 transition-all hover:bg-white dark:hover:bg-[#14151a]" />
                    </div>
                    <div className="space-y-1.5 relative z-30">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Ngân sách dự kiến</label>
                      <input type="text" value={formData.budget || ''} onChange={e => setFormData({ ...formData, budget: e.target.value })} className="w-full px-3 bg-gray-50/50 dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-700 text-sm h-10 rounded-[4px] text-gray-900 dark:text-white focus:outline-none focus:ring-[3px] focus:ring-[#5865f2]/20 focus:border-[#5865f2]/40 transition-all hover:bg-white dark:hover:bg-[#14151a]" placeholder="Dưới 200 triệu, 500-1 tỷ..." />
                    </div>
                    <div className="space-y-1.5 relative z-20">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Tiến độ mong muốn</label>
                      <input type="text" value={formData.timeline || ''} onChange={e => setFormData({ ...formData, timeline: e.target.value })} className="w-full px-3 bg-gray-50/50 dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-700 text-sm h-10 rounded-[4px] text-gray-900 dark:text-white focus:outline-none focus:ring-[3px] focus:ring-[#5865f2]/20 focus:border-[#5865f2]/40 transition-all hover:bg-white dark:hover:bg-[#14151a]" placeholder="Ngay lập tức, 1 tháng tới..." />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Phong cách thiết kế</label>
                      <input type="text" value={formData.style || ''} onChange={e => setFormData({ ...formData, style: e.target.value })} className="w-full px-3 bg-gray-50/50 dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-700 text-sm h-10 rounded-[4px] text-gray-900 dark:text-white focus:outline-none focus:ring-[3px] focus:ring-[#5865f2]/20 focus:border-[#5865f2]/40 transition-all hover:bg-white dark:hover:bg-[#14151a]" placeholder="Hiện đại, Tối giản..." />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Nhu cầu chi tiết</label>
                      <input type="text" value={formData.needs || ''} onChange={e => setFormData({ ...formData, needs: e.target.value })} className="w-full px-3 bg-gray-50/50 dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-700 text-sm h-10 rounded-[4px] text-gray-900 dark:text-white focus:outline-none focus:ring-[3px] focus:ring-[#5865f2]/20 focus:border-[#5865f2]/40 transition-all hover:bg-white dark:hover:bg-[#14151a]" placeholder="Thiết kế, Thi công, Trọn gói..." />
                    </div>
                    <div className="col-span-2 flex items-center gap-8 mt-2 p-3 border border-gray-200 dark:border-gray-800 rounded-[4px] bg-gray-50/50 dark:bg-[#1a1b23]">
                      <label className="flex items-center gap-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                        <input type="checkbox" checked={formData.needSupervision || false} onChange={e => setFormData({ ...formData, needSupervision: e.target.checked })} className="w-4 h-4 rounded text-[#5865f2] focus:ring-[#5865f2]/20 border-gray-300" /> Cần giám sát độc lập
                      </label>
                      <label className="flex items-center gap-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                        <input type="checkbox" checked={formData.needProjectManagement || false} onChange={e => setFormData({ ...formData, needProjectManagement: e.target.checked })} className="w-4 h-4 rounded text-[#5865f2] focus:ring-[#5865f2]/20 border-gray-300" /> Cần quản lý dự án thi công
                      </label>
                    </div>
                    <div className="col-span-2 space-y-1.5">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Khách hàng ghi chú thêm (Từ Form Web)</label>
                      <textarea value={formData.notes || ''} onChange={e => setFormData({ ...formData, notes: e.target.value })} className="w-full bg-gray-50/50 dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-700 text-sm rounded-[4px] text-gray-900 dark:text-white p-3 focus:outline-none focus:ring-[3px] focus:ring-[#5865f2]/20 focus:border-[#5865f2]/40 resize-none h-20 transition-all hover:bg-white dark:hover:bg-[#14151a]" placeholder="Ghi chú thêm của khách khi điền form..." />
                    </div>
                  </div>
                </div>
              </form>
            </div>

            <div className="h-20 flex items-center justify-end gap-3 px-6 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-[#14151a] shrink-0">
              <button type="button" onClick={() => setIsDrawerOpen(false)} className="flex items-center gap-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1b23] hover:bg-gray-50 dark:hover:bg-[#262930] dark:bg-[#1a1b23] dark:hover:bg-[#262930] text-gray-700 dark:text-gray-200 rounded-[4px] text-sm h-10 px-5 cursor-pointer font-medium transition-colors">
                <X className="w-4 h-4" /> Đóng
              </button>
              <button type="submit" form="lead-form" className="flex items-center gap-2 bg-[#5865f2] hover:bg-[#4752c4] text-white rounded-[4px] font-medium text-sm h-10 px-6 border-0 cursor-pointer transition-colors shadow-[0_2px_10px_rgba(88,101,242,0.3)]">
                <Check className="w-4 h-4" /> {modalMode === 'add' ? 'Thêm mới' : 'Lưu cập nhật'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Status Modal */}
      {isStatusModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className="absolute inset-0 bg-gray-900/40 dark:bg-black/60 backdrop-blur-sm transition-opacity duration-200 animate-in fade-in" onClick={() => setIsStatusModalOpen(false)} />
          <div className="relative bg-white dark:bg-[#14151a] w-full max-w-lg rounded-[8px] flex flex-col border border-gray-200 dark:border-gray-800 animate-in zoom-in-95 duration-200 shadow-xl z-10">
            <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-[#14151a] rounded-t-[8px]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-[4px] bg-amber-500/10 flex items-center justify-center">
                  <Link2 className="w-4 h-4 text-amber-500" />
                </div>
                <div>
                  <h2 className="text-base font-medium text-gray-900 dark:text-white tracking-tight">
                    Cập nhật Xử lý & Kết nối
                  </h2>
                </div>
              </div>
              <button onClick={() => setIsStatusModalOpen(false)} className="p-1.5 rounded-[4px] hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300 transition-colors cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <form id="status-form" onSubmit={(e) => { handleSave(e); setIsStatusModalOpen(false); }} className="space-y-5">
                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-1.5 relative z-40">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Trạng thái xử lý</label>
                    <CustomDropdown className="w-full" options={Object.entries(STATUS_MAP).map(([v, l]) => ({ value: v, label: l }))} value={formData.status} onChange={v => setFormData({ ...formData, status: v })} />
                  </div>
                  <div className="space-y-1.5 relative z-30">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Phân loại (Độ nóng)</label>
                    <CustomDropdown className="w-full" options={Object.entries(CLASS_MAP).map(([v, l]) => ({ value: v, label: l }))} value={formData.leadClassification || 'WARM'} onChange={v => setFormData({ ...formData, leadClassification: v })} />
                  </div>
                  <div className="col-span-2 space-y-1.5">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Người phụ trách (Sales)</label>
                    <input type="text" value={formData.assignee || ''} onChange={e => setFormData({ ...formData, assignee: e.target.value })} className="w-full px-3 bg-gray-50/50 dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-700 text-sm h-10 rounded-[4px] text-gray-900 dark:text-white focus:outline-none focus:ring-[3px] focus:ring-[#5865f2]/20 focus:border-[#5865f2]/40 transition-all hover:bg-white dark:hover:bg-[#14151a]" placeholder="Tên nhân viên tiếp nhận..." />
                  </div>
                  <div className="col-span-2 space-y-1.5">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Đơn vị nhận triển khai (Kết nối chốt)</label>
                    <CustomDropdown 
                      className="w-full" 
                      options={[
                        { value: '', label: 'Chưa chọn đơn vị' },
                        ...units.map(u => ({ value: u.name, label: u.name }))
                      ]} 
                      value={formData.connectedUnit || ''} 
                      onChange={v => setFormData({ ...formData, connectedUnit: v })} 
                    />
                  </div>
                  <div className="col-span-2 space-y-1.5">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Đề xuất các đơn vị phù hợp (Gợi ý lúc đầu)</label>
                    <input type="text" value={formData.proposedUnits || ''} onChange={e => setFormData({ ...formData, proposedUnits: e.target.value })} className="w-full px-3 bg-gray-50/50 dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-700 text-sm h-10 rounded-[4px] text-gray-900 dark:text-white focus:outline-none focus:ring-[3px] focus:ring-[#5865f2]/20 focus:border-[#5865f2]/40 transition-all hover:bg-white dark:hover:bg-[#14151a]" placeholder="Đơn vị A, Đơn vị B (Ngăn cách bằng dấu phẩy)..." />
                  </div>
                </div>
              </form>
            </div>

            <div className="h-20 flex items-center justify-end gap-3 px-6 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-[#14151a] shrink-0 rounded-b-[8px]">
              <button type="button" onClick={() => setIsStatusModalOpen(false)} className="flex items-center gap-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1b23] hover:bg-gray-50 dark:hover:bg-[#262930] dark:bg-[#1a1b23] dark:hover:bg-[#262930] text-gray-700 dark:text-gray-200 rounded-[4px] text-sm h-10 px-5 cursor-pointer font-medium transition-colors">
                Hủy bỏ
              </button>
              <button type="submit" form="status-form" className="flex items-center gap-2 bg-[#5865f2] hover:bg-[#4752c4] text-white rounded-[4px] font-medium text-sm h-10 px-6 border-0 cursor-pointer transition-colors shadow-[0_2px_10px_rgba(88,101,242,0.3)]">
                Lưu Xử Lý
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notes Modal */}
      {isNotesModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className="absolute inset-0 bg-gray-900/40 dark:bg-black/60 backdrop-blur-sm transition-opacity duration-200 animate-in fade-in" onClick={() => setIsNotesModalOpen(false)} />
          <div className="relative bg-white dark:bg-[#14151a] w-full max-w-lg rounded-[8px] flex flex-col border border-gray-200 dark:border-gray-800 animate-in zoom-in-95 duration-200 shadow-xl z-10">
            <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-[#14151a] rounded-t-[8px]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-[4px] bg-purple-500/10 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-purple-500" />
                </div>
                <div>
                  <h2 className="text-base font-medium text-gray-900 dark:text-white tracking-tight">
                    Lịch sử & Ghi chú
                  </h2>
                </div>
              </div>
              <button onClick={() => setIsNotesModalOpen(false)} className="p-1.5 rounded-[4px] hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300 transition-colors cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <form id="notes-form" onSubmit={(e) => { handleSave(e); setIsNotesModalOpen(false); }} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Ghi chú Gọi điện (Telesale)</label>
                  <textarea value={formData.callNotes || ''} onChange={e => setFormData({ ...formData, callNotes: e.target.value })} className="w-full bg-blue-50/30 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800/50 text-sm rounded-[4px] text-gray-900 dark:text-white p-3 focus:outline-none focus:ring-[3px] focus:ring-blue-500/20 focus:border-blue-500/40 resize-none h-24 transition-all hover:bg-blue-50/50 dark:hover:bg-blue-900/20" placeholder="Nội dung tư vấn qua điện thoại..." />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Ghi chú Chat (Zalo/Facebook)</label>
                  <textarea value={formData.chatNotes || ''} onChange={e => setFormData({ ...formData, chatNotes: e.target.value })} className="w-full bg-purple-50/30 dark:bg-purple-900/10 border border-purple-200 dark:border-purple-800/50 text-sm rounded-[4px] text-gray-900 dark:text-white p-3 focus:outline-none focus:ring-[3px] focus:ring-purple-500/20 focus:border-purple-500/40 resize-none h-24 transition-all hover:bg-purple-50/50 dark:hover:bg-purple-900/20" placeholder="Nội dung tư vấn qua tin nhắn..." />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Ngày hẹn Follow-up tiếp theo</label>
                  <input type="date" value={formData.followUpDate || ''} onChange={e => setFormData({ ...formData, followUpDate: e.target.value })} className="w-full px-3 bg-gray-50/50 dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-700 text-sm h-10 rounded-[4px] text-gray-900 dark:text-white focus:outline-none focus:ring-[3px] focus:ring-[#5865f2]/20 focus:border-[#5865f2]/40 transition-all hover:bg-white dark:hover:bg-[#14151a]" />
                </div>
              </form>
            </div>

            <div className="h-20 flex items-center justify-end gap-3 px-6 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-[#14151a] shrink-0 rounded-b-[8px]">
              <button type="button" onClick={() => setIsNotesModalOpen(false)} className="flex items-center gap-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1b23] hover:bg-gray-50 dark:hover:bg-[#262930] dark:bg-[#1a1b23] dark:hover:bg-[#262930] text-gray-700 dark:text-gray-200 rounded-[4px] text-sm h-10 px-5 cursor-pointer font-medium transition-colors">
                Hủy bỏ
              </button>
              <button type="submit" form="notes-form" className="flex items-center gap-2 bg-[#5865f2] hover:bg-[#4752c4] text-white rounded-[4px] font-medium text-sm h-10 px-6 border-0 cursor-pointer transition-colors shadow-[0_2px_10px_rgba(88,101,242,0.3)]">
                Lưu Ghi Chú
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
