"use client";
import React, { useState, useEffect } from 'react';
import { Search, CheckCircle2, XCircle, Trash2, Check, Eye } from 'lucide-react';
import apiClient from '@/admin-lib/apiClient';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { ActionMenu } from '@/admin-components/ui/ActionMenu';
import { useConfirm } from '@/hooks/useConfirm';

export default function PartnerRequestsPage() {
  const { confirm } = useConfirm();
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const itemsPerPage = 25;

  const fetchRequests = async () => {
    try {
      setIsLoading(true);
      const res = await apiClient.get('/partnership-requests');
      setData(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error('Failed to fetch requests:', error);
      toast.error('Lỗi khi lấy dữ liệu');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApprove = async (id: number) => {
    confirm({
      title: 'Phê duyệt yêu cầu',
      description: 'Phê duyệt yêu cầu này? Hệ thống sẽ tự động tạo một Đơn vị đối tác mới.',
      variant: 'primary',
      onConfirm: async () => {
        try {
          await apiClient.patch(`/partnership-requests/${id}/approve`);
          toast.success('Đã phê duyệt và tạo Đối tác thành công!');
          fetchRequests();
        } catch (error: any) {
          toast.error(error?.response?.data?.message || 'Có lỗi xảy ra khi phê duyệt');
        }
      }
    });
  };

  const handleReject = async (id: number) => {
    confirm({
      title: 'Từ chối yêu cầu',
      description: 'Từ chối yêu cầu này?',
      variant: 'warning',
      onConfirm: async () => {
        try {
          await apiClient.patch(`/partnership-requests/${id}/reject`);
          toast.success('Đã từ chối yêu cầu');
          fetchRequests();
        } catch (error: any) {
          toast.error(error?.response?.data?.message || 'Có lỗi xảy ra');
        }
      }
    });
  };

  const handleDelete = async (id: number) => {
    confirm({
      title: 'Xóa yêu cầu',
      description: 'Xóa vĩnh viễn yêu cầu này?',
      variant: 'danger',
      onConfirm: async () => {
        try {
          await apiClient.delete(`/partnership-requests/${id}`);
          toast.success('Đã xóa yêu cầu');
          fetchRequests();
        } catch (error: any) {
          toast.error('Lỗi khi xóa');
        }
      }
    });
  };

  const filteredData = data.filter(req => 
    req.companyName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    req.contactName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    req.phone?.includes(searchQuery)
  );

  const currentData = filteredData.slice(page * itemsPerPage, (page + 1) * itemsPerPage);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;

  return (
    <div className="h-full flex flex-col space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white dark:bg-[#14151a] p-3 rounded-[4px] border border-gray-200 dark:border-gray-800 shrink-0">
        <div className="relative flex-1 max-w-xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setPage(0); }}
            placeholder="Tìm tên công ty, người liên hệ, SĐT..."
            className="pl-9 pr-4 py-2 bg-gray-50/50 dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-700 rounded-[4px] text-sm focus:outline-none focus:ring-[3px] focus:ring-[#5865f2]/20 w-full text-gray-900 dark:text-gray-100 transition-all"
          />
        </div>
      </div>

      <div className="flex-1 flex flex-col min-h-0 rounded-[4px] border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#14151a] overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <table className="w-full text-left border-collapse min-w-max">
            <thead className="sticky top-0 z-10 bg-gray-50 dark:bg-[#1a1b23] border-b border-gray-200 dark:border-gray-800">
              <tr>
                <th className="px-5 py-3.5 font-medium text-gray-500 dark:text-gray-400 text-xs uppercase">Công ty / Người liên hệ</th>
                <th className="px-5 py-3.5 font-medium text-gray-500 dark:text-gray-400 text-xs border-l border-gray-200 dark:border-gray-800 uppercase">Thông tin liên lạc</th>
                <th className="px-5 py-3.5 font-medium text-gray-500 dark:text-gray-400 text-xs border-l border-gray-200 dark:border-gray-800 uppercase">Hồ sơ & Ghi chú</th>
                <th className="px-5 py-3.5 font-medium text-gray-500 dark:text-gray-400 text-xs border-l border-gray-200 dark:border-gray-800 uppercase">Trạng thái</th>
                <th className="px-5 py-3.5 font-medium text-gray-500 dark:text-gray-400 text-xs border-l border-gray-200 dark:border-gray-800 text-center w-32 uppercase">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {currentData.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-16 text-center text-gray-500">
                    Không có dữ liệu
                  </td>
                </tr>
              ) : (
                currentData.map(req => (
                  <tr key={req.id} className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50/50 dark:hover:bg-[#262930] transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="font-medium text-gray-900 dark:text-white text-sm">{req.companyName}</div>
                      <div className="text-xs text-gray-500 mt-1">{req.contactName}</div>
                      <div className="text-[10px] text-gray-400 mt-1">{format(new Date(req.createdAt), 'dd/MM/yyyy HH:mm')}</div>
                    </td>
                    <td className="px-5 py-3.5 border-l border-gray-200 dark:border-gray-800 text-sm">
                      <div>SĐT: <span className="font-medium">{req.phone}</span></div>
                      <div className="mt-1">Email: <span className="text-gray-500">{req.email}</span></div>
                      <div className="mt-1">Khu vực: <span className="text-gray-500">{req.location}</span></div>
                    </td>
                    <td className="px-5 py-3.5 border-l border-gray-200 dark:border-gray-800 text-sm max-w-[250px]">
                      <div className="line-clamp-1">KN: {req.experience}</div>
                      <div className="mt-1 line-clamp-1">
                        Portfolio: <a href={req.portfolioUrl} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">{req.portfolioUrl}</a>
                      </div>
                      {req.notes && <div className="mt-1 text-xs text-gray-500 line-clamp-2 italic">"{req.notes}"</div>}
                    </td>
                    <td className="px-5 py-3.5 border-l border-gray-200 dark:border-gray-800">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-[4px] text-xs font-medium ${
                        req.status === 'APPROVED' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/30' :
                        req.status === 'PENDING' ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/30' :
                        'bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800/30'
                      }`}>
                        {req.status === 'PENDING' ? 'Đang chờ' :
                         req.status === 'APPROVED' ? 'Đã duyệt' : 'Từ chối'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 border-l border-gray-200 dark:border-gray-800 text-center">
                      <div className="flex items-center justify-center">
                        <ActionMenu
                          items={[
                            ...(req.status === 'PENDING' ? [
                              { label: 'Phê duyệt', icon: CheckCircle2, variant: 'success' as const, onClick: () => handleApprove(req.id) },
                              { label: 'Từ chối', icon: XCircle, variant: 'warning' as const, onClick: () => handleReject(req.id) }
                            ] : []),
                            { label: 'Xóa', icon: Trash2, variant: 'danger' as const, separatorBefore: req.status === 'PENDING', onClick: () => handleDelete(req.id) }
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
      </div>
    </div>
  );
}
