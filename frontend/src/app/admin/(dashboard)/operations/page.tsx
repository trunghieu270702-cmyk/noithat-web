"use client";
import React, { useState } from 'react';
import { ShieldCheck, Users, Activity, Filter, Search, Plus } from 'lucide-react';
import apiClient from '@/admin-lib/apiClient';
import CustomDropdown from '@/admin-components/ui/CustomDropdown';

export default function OperationsPage() {
  const [activeTab, setActiveTab] = useState('users');
  const [searchTerm, setSearchTerm] = useState('');

  const users = [
    { id: 1, name: 'Admin', email: 'admin@noithat.com.vn', role: 'Super Admin', status: 'ACTIVE', lastLogin: 'Vừa xong' },
    { id: 2, name: 'Telesale 01', email: 'sale1@noithat.com.vn', role: 'CSKH', status: 'ACTIVE', lastLogin: '2 giờ trước' },
    { id: 3, name: 'Content SEO', email: 'content@noithat.com.vn', role: 'Editor', status: 'ACTIVE', lastLogin: '1 ngày trước' },
  ];

  const logs = [
    { id: 1, user: 'Admin', action: 'Cập nhật cấu hình Hệ thống', module: 'Settings', time: 'Vừa xong' },
    { id: 2, user: 'Admin', action: 'Đổi trạng thái Yêu cầu tư vấn #L123', module: 'Leads', time: '10 phút trước' },
    { id: 3, user: 'Content SEO', action: 'Xuất bản bài viết mới', module: 'Articles', time: '1 ngày trước' },
    { id: 4, user: 'Telesale 01', action: 'Thêm ghi chú vào Lead #L120', module: 'Leads', time: '1 ngày trước' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-medium tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#5865f2]" />
            Vận hành Nội bộ
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Quản lý tài khoản nhân viên, phân quyền và lịch sử hoạt động.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-[#14151a] rounded-[4px] border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
        <div className="p-6 md:p-8 space-y-10">

          {/* Tài khoản nhân sự */}
          <div className="space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-gray-800">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Danh sách Tài khoản</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Quản lý nhân viên và quyền truy cập vào hệ thống.</p>
              </div>
              <button className="bg-[#5865f2] hover:bg-[#4752c4] text-white px-4 py-2 rounded-[4px] text-sm font-medium transition-colors shadow-sm flex items-center gap-2 border-0 cursor-pointer">
                <Plus className="w-4 h-4" /> Thêm tài khoản
              </button>
            </div>

            <div className="border border-gray-200 dark:border-gray-800 rounded-[4px] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-[#1a1b23] border-b border-gray-200 dark:border-gray-800">
                      <th className="px-6 py-3.5 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Nhân viên</th>
                      <th className="px-6 py-3.5 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Vai trò (Role)</th>
                      <th className="px-6 py-3.5 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Đăng nhập cuối</th>
                      <th className="px-6 py-3.5 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-800 bg-white dark:bg-[#14151a]">
                    {users.map(u => (
                      <tr key={u.id} className="hover:bg-gray-50/50 dark:hover:bg-[#262930] dark:bg-[#1a1b23] transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-medium text-sm text-gray-900 dark:text-white">{u.name}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{u.email}</div>
                        </td>
                        <td className="px-6 py-4"><span className="text-sm font-medium text-gray-700 dark:text-gray-300">{u.role}</span></td>
                        <td className="px-6 py-4"><span className="text-sm text-gray-500 dark:text-gray-400">{u.lastLogin}</span></td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-[4px] text-[11px] font-medium bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
                            Hoạt động
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="h-px bg-gray-100 dark:bg-gray-800"></div>

          {/* Nhật ký hệ thống */}
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-gray-200 dark:border-gray-800">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Nhật ký Hệ thống (Audit Logs)</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Lịch sử mọi thao tác thay đổi dữ liệu trên hệ thống.</p>
              </div>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" placeholder="Tìm kiếm hành động..." className="w-full pl-9 pr-4 py-2 bg-white dark:bg-[#14151a] border border-gray-200 dark:border-gray-800 rounded-[4px] text-sm focus:outline-none focus:ring-[3px] focus:ring-[#5865f2]/20 transition-all text-gray-900 dark:text-white" />
              </div>
            </div>

            <div className="border border-gray-200 dark:border-gray-800 rounded-[4px] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-[#1a1b23] border-b border-gray-200 dark:border-gray-800">
                      <th className="px-6 py-3.5 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Hành động</th>
                      <th className="px-6 py-3.5 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Module</th>
                      <th className="px-6 py-3.5 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Người thực hiện</th>
                      <th className="px-6 py-3.5 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Thời gian</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-800 bg-white dark:bg-[#14151a]">
                    {logs.map(log => (
                      <tr key={log.id} className="hover:bg-gray-50/50 dark:hover:bg-[#262930] dark:bg-[#1a1b23] transition-colors">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{log.action}</td>
                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{log.module}</td>
                        <td className="px-6 py-4 text-sm font-medium text-[#5865f2]">{log.user}</td>
                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{log.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
