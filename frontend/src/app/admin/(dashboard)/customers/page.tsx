"use client";
import React, { useState } from 'react';
import {  Search, Filter, Users, Edit, Trash2, Plus, X, ChevronLeft, ChevronRight, Check, ArrowUpDown, ChevronDown, ChevronUp, User, Phone, Mail, MapPin, ClipboardList , RotateCcw } from 'lucide-react';
import apiClient from '@/admin-lib/apiClient';
import { format } from 'date-fns';
import CustomDropdown from '@/admin-components/ui/CustomDropdown';
import { ImageUploader } from '@/admin-components/ui/image-uploader';
import { ActionMenu } from '@/admin-components/ui/ActionMenu';

const LOCATION_MAP: Record<string, string> = {
  'Hà Nội': 'Hà Nội',
  'TP.HCM': 'TP.HCM',
  'Đà Nẵng': 'Đà Nẵng',
  'Bình Dương': 'Bình Dương'
};

export default function CustomersPage() {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCustomers = async () => {
    try {
      setIsLoading(true);
      const res = await apiClient.get('/customers');
      setData(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error('Failed to fetch customers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchCustomers();
  }, []);
  const [page, setPage] = useState(0);
  const [itemsPerPage] = useState(25);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  // Modals
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState<string[]>([]);
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(false);
  const [isSummaryCollapsed, setIsSummaryCollapsed] = useState(false);
  
  const [openLocationPopover, setOpenLocationPopover] = useState(false);
  
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null);

  const activeFiltersCount = (locationFilter.length > 0 ? 1 : 0);
  const hasActiveFilter = activeFiltersCount > 0;

  const [formData, setFormData] = useState({
    id: '', fullName: '', phoneNumber: '', email: '', address: 'Hà Nội', totalLeads: 0, images: [] as string[],
  });

  const filteredData = Array.isArray(data) ? data.filter(customer => {
    const matchesSearch = customer.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || customer.phoneNumber.includes(searchQuery);
    const matchesLocation = locationFilter.length === 0 || locationFilter.includes(customer.address);
    return matchesSearch && matchesLocation;
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
    totalLeads: filteredData.reduce((acc, curr) => acc + curr.totalLeads, 0),
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
    try {
      if (modalMode === 'add') {
        const { id, ...createData } = formData;
        await apiClient.post('/customers', createData);
      } else {
        const { id, ...updateData } = formData;
        await apiClient.patch(`/customers/${id}`, updateData);
      }
      setIsDrawerOpen(false);
      fetchCustomers();
    } catch (error) {
      console.error('Failed to save customer:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa khách hàng này?')) return;
    try {
      await apiClient.delete(`/customers/${id}`);
      fetchCustomers();
    } catch (error) {
      console.error('Failed to delete customer:', error);
    }
  };

  return (
    <div className="h-full flex flex-col space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Top Header & Filters */}
      <div className="flex flex-col gap-3 flex-shrink-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white dark:bg-[#14151a] p-3 rounded-lg border border-gray-200 dark:border-gray-800">
          <div className="flex flex-1 items-center gap-2 max-w-xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setPage(0); }}
                placeholder="Tìm Tên khách hàng, Số điện thoại..." 
                className="pl-9 pr-4 py-2 bg-gray-50/50 dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-800 rounded-lg text-sm focus:outline-none focus:ring-[3px] focus:ring-[#5865f2]/20 w-full text-gray-900 dark:text-white transition-all"
              />
            </div>
            
            <button 
              onClick={() => setIsFiltersExpanded(!isFiltersExpanded)}
              className={`flex items-center gap-2 px-3 h-[38px] rounded-lg text-sm font-medium transition-all border cursor-pointer ${
                isFiltersExpanded 
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
            <button 
              onClick={() => { 
                setModalMode('add'); 
                setFormData({ id: '', fullName: '', phoneNumber: '', email: '', address: 'Hà Nội', totalLeads: 0, images: [] });
                setIsDrawerOpen(true); 
              }}
              className="flex items-center gap-2 px-4 py-2 bg-[#5865f2] hover:bg-[#4752c4] text-white rounded-lg text-sm font-medium transition-colors border-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Thêm Khách Hàng
            </button>
          </div>
        </div>

        {isFiltersExpanded && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-gray-50/50 dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-800 rounded-lg animate-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col gap-1.5 relative">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Khu vực</span>
              <button onClick={() => setOpenLocationPopover(!openLocationPopover)} className="flex items-center justify-between w-full h-9 px-3 bg-white dark:bg-[#14151a] border border-gray-200 dark:border-gray-800 rounded-lg text-sm text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-[#262930] dark:bg-[#1a1b23]">
                <span className="truncate">{locationFilter.length === 0 ? "Tất cả khu vực" : locationFilter.map(s => LOCATION_MAP[s]).join(', ')}</span>
                <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400 shrink-0 ml-2" />
              </button>
              {openLocationPopover && (
                <div className="absolute top-16 left-0 z-50 w-full p-2 bg-white dark:bg-[#14151a] border border-gray-200 dark:border-gray-800 rounded-md shadow-lg">
                  <div className="flex flex-col gap-1">
                    {Object.entries(LOCATION_MAP).map(([val, label]) => (
                      <label key={val} className="flex items-center gap-2.5 p-2 rounded-md hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-800 cursor-pointer text-sm">
                        <input type="checkbox" checked={locationFilter.includes(val)} onChange={(e) => {
                          if (e.target.checked) setLocationFilter([...locationFilter, val]);
                          else setLocationFilter(locationFilter.filter(s => s !== val));
                          setPage(0);
                        }} className="w-4 h-4 text-[#5865f2] rounded border-gray-300" />
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
          {locationFilter.length > 0 && (
            <div className="flex items-center gap-1.5 pl-2.5 pr-1 py-1 bg-[#5865f2]/10 text-[#5865f2] border border-[#5865f2]/20 rounded-md text-sm font-medium">
              Khu vực: {locationFilter.map(s => LOCATION_MAP[s]).join(', ')}
              <button onClick={() => setLocationFilter([])} className="p-0.5 hover:bg-[#5865f2]/20 rounded transition-colors ml-1"><X className="w-3.5 h-3.5" /></button>
            </div>
          )}
          {hasActiveFilter && (
            <button onClick={() => { setLocationFilter([]); setPage(0); }} className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-red-500 text-xs font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors ml-2"><RotateCcw strokeWidth={2} className="w-3.5 h-3.5" /> Đặt lại</button>
          )}
        </div>
      </div>

      {/* Summary Card */}
      <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#14151a] flex-shrink-0 transition-all duration-300">
        <div className={`p-4 ${isSummaryCollapsed ? 'pb-4' : 'sm:p-5 sm:pb-5'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h3 className="font-medium text-gray-900 dark:text-white text-sm">Tổng Quan Khách Hàng</h3>
              {!isSummaryCollapsed && <span className="text-xs text-gray-500 dark:text-gray-400">{summary.totalItems} khách hàng</span>}
            </div>
            
            {isSummaryCollapsed && (
              <div className="flex-1 flex items-center justify-end px-6 gap-5">
                <div className="flex items-center gap-3 text-sm font-medium">
                  <span className="text-blue-600 dark:text-blue-400">{summary.totalItems} Khách hàng</span>
                  <span className="text-emerald-600">{summary.totalLeads} Yêu cầu</span>
                </div>
              </div>
            )}

            <button onClick={() => setIsSummaryCollapsed(!isSummaryCollapsed)} className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-800 rounded-md text-xs font-medium cursor-pointer">
              {isSummaryCollapsed ? 'Mở rộng' : 'Thu gọn'}
              {isSummaryCollapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
            </button>
          </div>

          {!isSummaryCollapsed && (
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-lg border border-blue-100 dark:border-blue-500/20 bg-blue-50/50 dark:bg-blue-500/10">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-2 h-2 bg-blue-500 rounded-sm"></div><span className="text-xs font-medium text-gray-700 dark:text-gray-300">Tổng Khách hàng</span>
                </div>
                <div className="text-2xl font-medium text-blue-700 dark:text-blue-400">{summary.totalItems}</div>
              </div>
              <div className="p-3.5 rounded-lg border border-emerald-100 dark:border-emerald-900/30 bg-emerald-50/50 dark:bg-emerald-500/10">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-2 h-2 bg-emerald-50 dark:bg-emerald-500/100 rounded-sm"></div><span className="text-xs font-medium text-gray-700 dark:text-gray-300">Tổng Yêu cầu</span>
                </div>
                <div className="text-2xl font-medium text-emerald-700 dark:text-emerald-400">{summary.totalLeads}</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Data Table */}
      <div className="flex-1 flex flex-col min-h-0 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#14151a] overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <table className="w-full text-left border-collapse min-w-max">
            <thead className="sticky top-0 z-10 bg-gray-50 dark:bg-[#1a1b23] border-b border-gray-200 dark:border-gray-800">
              <tr>
                <th className="px-5 py-3.5 font-medium text-gray-500 dark:text-gray-400 text-xs">
                  <div className="flex items-center gap-4">
                    <div 
                      className={`w-4 h-4 rounded border flex items-center justify-center cursor-pointer transition-colors ${
                        selectedIds.length === currentData.length && currentData.length > 0 ? 'bg-[#5865f2] border-[#5865f2]' : 'border-gray-300'
                      }`}
                      onClick={toggleSelectAll}
                    >
                      {selectedIds.length === currentData.length && currentData.length > 0 && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <div className="flex items-center cursor-pointer select-none uppercase tracking-wide" onClick={() => handleSort('fullName')}>
                      Thông tin khách hàng <SortIcon columnKey="fullName" />
                    </div>
                  </div>
                </th>
                <th className="px-5 py-3.5 font-medium text-gray-500 dark:text-gray-400 text-xs border-l border-gray-200 dark:border-gray-800 uppercase" onClick={() => handleSort('phoneNumber')}>
                  <div className="flex items-center cursor-pointer">Liên hệ <SortIcon columnKey="phoneNumber" /></div>
                </th>
                <th className="px-5 py-3.5 font-medium text-gray-500 dark:text-gray-400 text-xs border-l border-gray-200 dark:border-gray-800 uppercase" onClick={() => handleSort('address')}>
                  <div className="flex items-center cursor-pointer">Khu vực <SortIcon columnKey="address" /></div>
                </th>
                <th className="px-5 py-3.5 font-medium text-gray-500 dark:text-gray-400 text-xs border-l border-gray-200 dark:border-gray-800 uppercase" onClick={() => handleSort('totalLeads')}>
                  <div className="flex items-center cursor-pointer">Tổng yêu cầu <SortIcon columnKey="totalLeads" /></div>
                </th>
                <th className="px-5 py-3.5 font-medium text-gray-500 dark:text-gray-400 text-xs border-l border-gray-200 dark:border-gray-800 uppercase">Ngày tham gia</th>
                <th className="px-5 py-3.5 font-medium text-gray-500 dark:text-gray-400 text-xs border-l border-gray-200 dark:border-gray-800 text-center w-24">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {currentData.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-16 text-center animate-in fade-in zoom-in-95 duration-500">
                    <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4 border border-gray-200 dark:border-gray-800">
                        <Users className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Không tìm thấy khách hàng</h3>
                    </div>
                  </td>
                </tr>
              ) : (
                currentData.map((customer, index) => (
                  <tr key={customer.id} className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50/50 dark:hover:bg-[#262930] dark:bg-[#1a1b23] transition-colors group animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div 
                          className={`w-4 h-4 rounded border flex items-center justify-center cursor-pointer transition-colors shrink-0 ${
                            selectedIds.includes(customer.id.toString()) ? 'bg-[#5865f2] border-[#5865f2]' : 'border-gray-300'
                          }`}
                          onClick={() => toggleSelect(customer.id.toString())}
                        >
                          {selectedIds.includes(customer.id.toString()) && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center font-medium text-sm">
                            {customer.fullName.charAt(0).toUpperCase()}
                          </div>
                          <div className="font-medium text-sm text-gray-900 dark:text-white">{customer.fullName}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 border-l border-gray-200 dark:border-gray-800">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{customer.phoneNumber}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{customer.email}</div>
                    </td>
                    <td className="px-5 py-3.5 border-l border-gray-200 dark:border-gray-800">
                      <span className="text-sm text-gray-600 dark:text-gray-400">{customer.address}</span>
                    </td>
                    <td className="px-5 py-3.5 border-l border-gray-200 dark:border-gray-800">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-800">{customer.totalLeads} yêu cầu</span>
                    </td>
                    <td className="px-5 py-3.5 border-l border-gray-200 dark:border-gray-800">
                      <span className="text-sm text-gray-600 dark:text-gray-400">{format(new Date(customer.createdAt), 'dd/MM/yyyy')}</span>
                    </td>
                    <td className="px-5 py-3.5 border-l border-gray-200 dark:border-gray-800 text-center">
                      <div className="flex items-center justify-center">
                        <ActionMenu 
                          items={[
                            { label: 'Chỉnh sửa', icon: Edit, onClick: () => { 
                              setModalMode('edit'); 
                              setFormData({ ...customer, images: customer.images || [] });
                              setIsDrawerOpen(true); 
                            } },
                            { label: 'Xóa', icon: Trash2, onClick: () => handleDelete(customer.id), variant: 'danger', separatorBefore: true }
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
              <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0} className="p-1.5 rounded-md border border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 hover:bg-white dark:bg-[#14151a] disabled:opacity-50 transition-colors bg-white dark:bg-[#14151a]"><ChevronLeft className="w-4 h-4" /></button>
              <div className="px-3 text-sm font-medium text-gray-700 dark:text-gray-300">{page + 1} / {totalPages}</div>
              <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page === totalPages - 1} className="p-1.5 rounded-md border border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 hover:bg-white dark:bg-[#14151a] disabled:opacity-50 transition-colors bg-white dark:bg-[#14151a]"><ChevronRight className="w-4 h-4" /></button>
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
                <div className="w-8 h-8 rounded-lg bg-[#5865f2]/10 flex items-center justify-center">
                  <Users className="w-4 h-4 text-[#5865f2]" />
                </div>
                <div>
                  <h2 className="text-base font-medium text-gray-900 dark:text-white tracking-tight">
                    {modalMode === 'add' ? 'Thêm Khách Hàng' : 'Cập Nhật Hồ Sơ'}
                  </h2>
                </div>
              </div>
              <button onClick={() => setIsDrawerOpen(false)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300 transition-colors cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
               <form id="customer-form" onSubmit={handleSave} className="p-6 space-y-8">
                
                {/* Section: Thông tin khách hàng */}
                <div className="space-y-5">
                  <h3 className="text-xs font-medium text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#5865f2]"></span>
                      Thông tin khách hàng
                  </h3>

                  <div className="grid grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Họ và Tên <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className="h-4 w-4 text-gray-400 dark:text-gray-500 dark:text-gray-400" />
                        </div>
                        <input type="text" required value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} className="pl-9 w-full bg-gray-50/50 dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-700 text-sm h-10 rounded-lg text-gray-900 dark:text-white transition-all hover:bg-white dark:bg-[#14151a] dark:hover:bg-[#1a1b23] focus:outline-none focus:ring-[3px] focus:ring-[#5865f2]/20 focus:border-[#5865f2]/40" placeholder="VD: Nguyễn Văn A..." />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Số điện thoại <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Phone className="h-4 w-4 text-gray-400 dark:text-gray-500 dark:text-gray-400" />
                        </div>
                        <input type="text" required value={formData.phoneNumber} onChange={e => setFormData({...formData, phoneNumber: e.target.value})} className="pl-9 w-full bg-gray-50/50 dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-700 text-sm h-10 rounded-lg text-gray-900 dark:text-white transition-all hover:bg-white dark:bg-[#14151a] dark:hover:bg-[#1a1b23] focus:outline-none focus:ring-[3px] focus:ring-[#5865f2]/20 focus:border-[#5865f2]/40" placeholder="0901..." />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail className="h-4 w-4 text-gray-400 dark:text-gray-500 dark:text-gray-400" />
                        </div>
                        <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="pl-9 w-full bg-gray-50/50 dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-700 text-sm h-10 rounded-lg text-gray-900 dark:text-white transition-all hover:bg-white dark:bg-[#14151a] dark:hover:bg-[#1a1b23] focus:outline-none focus:ring-[3px] focus:ring-[#5865f2]/20 focus:border-[#5865f2]/40" placeholder="contact@email.com" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Khu vực</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <MapPin className="h-4 w-4 text-gray-400 dark:text-gray-500 dark:text-gray-400" />
                        </div>
                        <input type="text" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="pl-9 w-full bg-gray-50/50 dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-700 text-sm h-10 rounded-lg text-gray-900 dark:text-white transition-all hover:bg-white dark:bg-[#14151a] dark:hover:bg-[#1a1b23] focus:outline-none focus:ring-[3px] focus:ring-[#5865f2]/20 focus:border-[#5865f2]/40" placeholder="Hà Nội..." />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="h-px bg-gray-100 dark:bg-gray-800/60 -mx-6"></div>

                {/* Section: Hoạt động & Tài liệu */}
                <div className="space-y-5">
                  <h3 className="text-xs font-medium text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#43b581]"></span>
                      Hoạt động & Tài liệu
                  </h3>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Tổng số Yêu cầu</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <ClipboardList className="h-4 w-4 text-gray-400 dark:text-gray-500 dark:text-gray-400" />
                      </div>
                      <input type="number" value={formData.totalLeads} onChange={e => setFormData({...formData, totalLeads: parseInt(e.target.value) || 0})} className="pl-9 w-full bg-gray-50/50 dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-700 text-sm h-10 rounded-lg text-gray-900 dark:text-white transition-all hover:bg-white dark:bg-[#14151a] dark:hover:bg-[#1a1b23] focus:outline-none focus:ring-[3px] focus:ring-[#5865f2]/20 focus:border-[#5865f2]/40" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">Tài liệu / Hợp đồng (Hình ảnh)</label>
                    <ImageUploader initialImages={formData.images} onUploadSuccess={(urls) => setFormData(prev => ({ ...prev, images: [...prev.images, ...urls] }))} onRemoveImage={(url) => setFormData(prev => ({ ...prev, images: prev.images.filter(img => img !== url) }))} maxFiles={5} />
                  </div>
                </div>
              </form>
            </div>

            <div className="h-20 flex items-center justify-end gap-3 px-6 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-[#14151a] shrink-0">
              <button type="button" onClick={() => setIsDrawerOpen(false)} className="flex items-center gap-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1b23] hover:bg-gray-50 dark:hover:bg-[#262930] dark:bg-[#1a1b23] dark:hover:bg-[#262930] text-gray-700 dark:text-gray-200 rounded-lg text-sm h-10 px-5 cursor-pointer font-medium transition-colors">
                <X className="w-4 h-4" /> Hủy bỏ
              </button>
              <button type="submit" form="customer-form" className="flex items-center gap-2 bg-[#5865f2] hover:bg-[#4752c4] text-white rounded-lg font-medium text-sm h-10 px-6 border-0 cursor-pointer transition-colors">
                <Check className="w-4 h-4" /> {modalMode === 'add' ? 'Thêm mới' : 'Lưu thay đổi'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
