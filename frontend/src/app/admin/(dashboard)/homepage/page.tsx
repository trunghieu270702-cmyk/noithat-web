"use client";
import React, { useState } from 'react';
import { Home, Save, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import apiClient from '@/admin-lib/apiClient';

export default function HomepageManager() {
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');

  // Accordion state
  const [expandedSection, setExpandedSection] = useState('hero');

  const [config, setConfig] = useState<any>({
    hero: { title: 'Nền tảng kết nối Hệ sinh thái Nội thất uy tín nhất', subtitle: 'Hàng trăm Đơn vị thiết kế - thi công đã được xác thực năng lực', ctaText: 'Tìm Đơn vị ngay', ctaLink: '/units' },
    problem: { title: 'Những vấn đề thường gặp khi xây sửa nhà', description: 'Gia chủ thường đau đầu vì phát sinh chi phí, chậm tiến độ...' },
    solution: { title: 'Giải pháp từ nền tảng của chúng tôi', description: 'Kết nối trực tiếp với các đơn vị uy tín nhất.' },
    benefits: { title: 'Lợi ích khi tham gia nền tảng', description: 'Minh bạch, an tâm, tiết kiệm.' },
    comparison: { title: 'Sự khác biệt', description: 'So sánh giữa tự làm và qua nền tảng.' },
    ecosystem: { title: 'Hệ sinh thái toàn diện', description: 'Tích hợp mọi dịch vụ cần thiết.' },
    categories: { title: 'Loại hình công trình', description: 'Chung cư, Biệt thự, Nhà phố...' },
    supervision: { title: 'Giám sát thi công độc lập', description: 'Đảm bảo chất lượng từng hạng mục.' },
    process: { title: 'Quy trình làm việc minh bạch', description: 'Rõ ràng từng bước.' },
    stats: { title: 'Con số biết nói', description: '1000+ dự án thành công.' },
    cta: { title: 'Bắt đầu dự án của bạn ngay hôm nay', ctaText: 'Đăng ký tư vấn' },
    seo: { metaTitle: 'NoiThat - Nền tảng kết nối', metaDescription: 'Tìm kiếm đơn vị thiết kế thi công.', keywords: 'nội thất, thi công' },
  });

  const fetchConfig = async () => {
    try {
      setIsLoading(true);
      const res = await apiClient.get('/settings');
      const settingsList = Array.isArray(res.data) ? res.data : (res.data?.data || []);
      const homepageSetting = settingsList.find((s: any) => s.key === 'HOMEPAGE_CONFIG');
      if (homepageSetting && homepageSetting.value) {
        setConfig(JSON.parse(homepageSetting.value));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchConfig();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setSuccessMessage('');
    try {
      // Find if exists
      const res = await apiClient.get('/settings');
      const settingsList = Array.isArray(res.data) ? res.data : (res.data?.data || []);
      const homepageSetting = settingsList.find((s: any) => s.key === 'HOMEPAGE_CONFIG');

      const payload = {
        key: 'HOMEPAGE_CONFIG',
        value: JSON.stringify(config)
      };

      if (homepageSetting) {
        await apiClient.patch(`/settings/${homepageSetting.id}`, payload);
      } else {
        await apiClient.post('/settings', payload);
      }

      setSuccessMessage('Đã lưu cấu hình Trang chủ thành công!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const sections = [
    { id: 'hero', label: 'Khối Hero Banner' },
    { id: 'problem', label: 'Khối Vấn đề (Problem)' },
    { id: 'solution', label: 'Khối Giải pháp (Solution)' },
    { id: 'benefits', label: 'Khối Lợi ích (Benefits)' },
    { id: 'comparison', label: 'Khối So sánh (Comparison)' },
    { id: 'ecosystem', label: 'Khối Hệ sinh thái (Ecosystem)' },
    { id: 'categories', label: 'Khối Loại hình công trình' },
    { id: 'supervision', label: 'Khối Giám sát thi công' },
    { id: 'process', label: 'Khối Quy trình làm việc' },
    { id: 'stats', label: 'Khối Thống kê (Stats)' },
    { id: 'cta', label: 'Khối Kêu gọi hành động (CTA)' },
    { id: 'seo', label: 'Cấu hình SEO' },
  ];

  const updateSection = (section: string, field: string, value: string) => {
    setConfig({
      ...config,
      [section]: {
        ...(config[section] || {}),
        [field]: value
      }
    });
  };

  if (isLoading) return <div className="p-10 text-center text-gray-500 dark:text-gray-400">Đang tải...</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-medium tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
            <Home className="w-5 h-5 text-[#5865f2]" />
            Quản lý Trang chủ (Homepage)
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Tuỳ chỉnh nội dung hiển thị trên trang chủ (Đồng bộ theo luồng người dùng).</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-[#5865f2] hover:bg-[#4752c4] text-white px-5 py-2.5 rounded-[4px] text-sm font-medium transition-colors flex items-center gap-2 shadow-sm border-0 disabled:opacity-70 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          {isSaving ? 'Đang lưu...' : 'Lưu cấu hình'}
        </button>
      </div>

      {successMessage && (
        <div className="bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 p-4 rounded-[4px] text-sm font-medium border border-emerald-200 dark:border-emerald-500/20 flex items-center shadow-sm">
          <CheckCircle2 className="w-5 h-5 mr-3" />
          {successMessage}
        </div>
      )}

      <div className="space-y-4">
        {sections.map(sec => (
          <div key={sec.id} className="bg-white dark:bg-[#14151a] rounded-[4px] border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
            <div
              className="px-6 py-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-[#262930] dark:bg-[#1a1b23] dark:hover:bg-[#1a1b23] transition-colors"
              onClick={() => setExpandedSection(expandedSection === sec.id ? '' : sec.id)}
            >
              <h3 className="text-base font-medium text-gray-900 dark:text-white">{sec.label}</h3>
              {expandedSection === sec.id ? <ChevronUp className="w-5 h-5 text-gray-500 dark:text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400" />}
            </div>

            {expandedSection === sec.id && (
              <div className="p-6 border-t border-gray-200 dark:border-gray-800 space-y-5 bg-gray-50 dark:bg-[#1a1b23]/30 dark:bg-transparent">
                {sec.id === 'seo' ? (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Meta Title</label>
                      <input type="text" value={config[sec.id]?.metaTitle || ''} onChange={e => updateSection(sec.id, 'metaTitle', e.target.value)} className="w-full px-3 py-2 bg-white dark:bg-[#14151a] border border-gray-200 dark:border-gray-800 rounded-[4px] text-sm focus:outline-none focus:border-[#5865f2]/50" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Meta Description</label>
                      <textarea rows={2} value={config[sec.id]?.metaDescription || ''} onChange={e => updateSection(sec.id, 'metaDescription', e.target.value)} className="w-full px-3 py-2 bg-white dark:bg-[#14151a] border border-gray-200 dark:border-gray-800 rounded-[4px] text-sm focus:outline-none focus:border-[#5865f2]/50" />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Tiêu đề chính</label>
                      <input type="text" value={config[sec.id]?.title || ''} onChange={e => updateSection(sec.id, 'title', e.target.value)} className="w-full px-3 py-2 bg-white dark:bg-[#14151a] border border-gray-200 dark:border-gray-800 rounded-[4px] text-sm focus:outline-none focus:border-[#5865f2]/50" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Nội dung / Mô tả</label>
                      <textarea rows={2} value={config[sec.id]?.description || config[sec.id]?.subtitle || ''} onChange={e => updateSection(sec.id, config[sec.id]?.subtitle !== undefined ? 'subtitle' : 'description', e.target.value)} className="w-full px-3 py-2 bg-white dark:bg-[#14151a] border border-gray-200 dark:border-gray-800 rounded-[4px] text-sm focus:outline-none focus:border-[#5865f2]/50" />
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
