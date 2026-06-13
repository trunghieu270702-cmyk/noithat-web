"use client";
import { useState, useEffect } from 'react';
import { Save, Loader2, ShieldAlert, Trash2, Settings, Code, Globe, Search, CheckCircle2 } from 'lucide-react';
import apiClient from '@/admin-lib/apiClient';
import React from 'react';
import { Button } from '@/admin-components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/admin-components/ui/dialog';
import { toast } from 'sonner';

export default function SettingsPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [activeTab, setActiveTab] = useState('general');

  // Reset Data state
  const [isResetOpen, setIsResetOpen] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [isSubmittingReset, setIsSubmittingReset] = useState(false);
  const [resetError, setResetError] = useState('');
  const [resetSuccess, setResetSuccess] = useState('');
  const canSubmitReset = confirmText.trim().toUpperCase() === 'CONFIRM';

  const [formData, setFormData] = useState<any>({
    siteName: 'NoiThat - Nền tảng Nội thất',
    siteUrl: 'https://noithat.com.vn',
    contactEmail: 'contact@noithat.com.vn',
    hotline: '0988.888.888',
    zalo: '0988888888',
    facebook: 'https://facebook.com/bim',
    globalMetaTitle: 'NoiThat - Nền tảng kết nối Hệ sinh thái Thiết kế Thi công Nội thất',
    globalMetaDesc: 'Hệ sinh thái kết nối gia chủ với các đơn vị thiết kế thi công uy tín nhất Việt Nam.',
    googleAnalytics: 'G-XXXXXXX',
    facebookPixel: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [settingId, setSettingId] = useState<number | null>(null);

  const fetchSettings = async () => {
    try {
      const res = await apiClient.get('/settings');
      const globalSetting = res.data.find((s: any) => s.key === 'GLOBAL_SETTINGS');
      if (globalSetting) {
        setSettingId(globalSetting.id);
        if (globalSetting.value) {
          setFormData({ ...formData, ...JSON.parse(globalSetting.value) });
        }
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const onSubmit = async () => {
    setIsSaving(true);
    setSuccessMessage('');

    // Validation
    const newErrors: Record<string, string> = {};
    if (!formData.siteName?.trim()) newErrors.siteName = 'Tên website không được để trống';
    if (!formData.siteUrl?.trim()) newErrors.siteUrl = 'URL trang chủ không được để trống';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSaving(false);
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }
    setErrors({});

    try {
      const payload = {
        key: 'GLOBAL_SETTINGS',
        value: JSON.stringify(formData)
      };

      if (settingId) {
        await apiClient.patch(`/settings/${settingId}`, payload);
      } else {
        const res = await apiClient.post('/settings', payload);
        setSettingId(res.data.id);
      }
      setSuccessMessage('Lưu cấu hình hệ thống thành công!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Failed to save settings', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetData = async () => {
    if (!canSubmitReset || isSubmittingReset) return;
    setIsSubmittingReset(true);
    setResetError('');
    setResetSuccess('');
    try {
      await new Promise(r => setTimeout(r, 1000));
      setResetSuccess('Đã xóa toàn bộ cache và reset dữ liệu thành công.');
      setConfirmText('');
      setIsResetOpen(false);
    } catch (err: any) {
      setResetError(err?.response?.data?.message || 'Không thể xóa dữ liệu.');
    } finally {
      setIsSubmittingReset(false);
    }
  };

  const tabs = [
    { id: 'general', label: 'Thông tin chung', icon: <Globe className="w-4 h-4" /> },
    { id: 'seo', label: 'Cấu hình SEO', icon: <Search className="w-4 h-4" /> },
    { id: 'tracking', label: 'Mã theo dõi', icon: <Code className="w-4 h-4" /> },
    { id: 'danger', label: 'Khu vực nguy hiểm', icon: <ShieldAlert className="w-4 h-4" /> }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-xl font-medium tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-[#5865f2]" />
            Cài đặt Hệ thống
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Cấu hình Global SEO, liên hệ và các đoạn mã nhúng theo dõi (Tracking).</p>
        </div>
        <button
          onClick={onSubmit}
          disabled={isSaving}
          className="bg-[#5865f2] hover:bg-[#4752c4] text-white px-5 py-2.5 rounded-[4px] text-sm font-medium transition-colors flex items-center gap-2 border-0 disabled:opacity-70 h-auto shadow-none cursor-pointer"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {isSaving ? 'Đang lưu...' : 'Lưu cài đặt'}
        </button>
      </div>

      {successMessage && (
        <div className="bg-emerald-50 text-emerald-600 p-4 rounded-[4px] text-sm font-medium border border-emerald-200 flex items-center shadow-none animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-5 h-5 mr-3" />
          {successMessage}
        </div>
      )}

      {resetSuccess && (
        <div className="bg-emerald-50 text-emerald-600 p-4 rounded-[4px] text-sm font-medium border border-emerald-200 shadow-none animate-in fade-in slide-in-from-top-2">
          {resetSuccess}
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar Tabs */}
        <div className="w-full md:w-64 shrink-0 space-y-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-[4px] text-sm font-medium transition-all cursor-pointer border ${activeTab === tab.id
                  ? 'bg-[#5865f2] text-white border-[#5865f2] shadow-sm'
                  : 'bg-white dark:bg-[#1a1b23] text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-[#262930] hover:text-gray-900 dark:hover:text-white shadow-sm'
                }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1">

          {activeTab === 'general' && (
            <div className="bg-white dark:bg-[#14151a] rounded-[4px] border border-gray-200 dark:border-gray-800 p-6 md:p-8 animate-in fade-in slide-in-from-right-4 duration-300 shadow-none">
              <div className="space-y-6">
                <h3 className="font-heading text-xs font-medium text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#5865f2]"></span>
                  Thông tin chung
                </h3>

                <div className="space-y-6 max-w-3xl">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Tên Website <span className="text-red-500">*</span></label>
                    <input
                      type="text" value={formData.siteName} onChange={e => { setFormData({ ...formData, siteName: e.target.value }); if (errors.siteName) setErrors({ ...errors, siteName: '' }); }}
                      className={`w-full px-3 py-2 bg-white dark:bg-[#1a1b23] text-gray-900 dark:text-white border ${errors.siteName ? 'border-red-500 focus:ring-red-500/20' : 'border-gray-200 dark:border-gray-800 focus:ring-[#5865f2]/10'} rounded-[4px] text-sm font-medium focus:outline-none focus:border-[#5865f2]/50 focus:ring-[3px]`}
                    />
                    {errors.siteName && <p className="text-red-500 text-xs mt-1">{errors.siteName}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">URL Trang chủ <span className="text-red-500">*</span></label>
                    <input
                      type="text" value={formData.siteUrl} onChange={e => { setFormData({ ...formData, siteUrl: e.target.value }); if (errors.siteUrl) setErrors({ ...errors, siteUrl: '' }); }}
                      className={`w-full px-3 py-2 bg-white dark:bg-[#1a1b23] text-gray-900 dark:text-white border ${errors.siteUrl ? 'border-red-500 focus:ring-red-500/20' : 'border-gray-200 dark:border-gray-800 focus:ring-[#5865f2]/10'} rounded-[4px] text-sm font-medium focus:outline-none focus:border-[#5865f2]/50 focus:ring-[3px]`}
                    />
                    {errors.siteUrl && <p className="text-red-500 text-xs mt-1">{errors.siteUrl}</p>}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email liên hệ</label>
                      <input
                        type="email" value={formData.contactEmail} onChange={e => setFormData({ ...formData, contactEmail: e.target.value })}
                        className="w-full px-3 py-2 bg-white dark:bg-[#1a1b23] text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded-[4px] text-sm font-medium focus:outline-none focus:border-[#5865f2]/50 focus:ring-[3px] focus:ring-[#5865f2]/10"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Hotline</label>
                      <input
                        type="text" value={formData.hotline} onChange={e => setFormData({ ...formData, hotline: e.target.value })}
                        className="w-full px-3 py-2 bg-white dark:bg-[#1a1b23] text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded-[4px] text-sm font-medium focus:outline-none focus:border-[#5865f2]/50 focus:ring-[3px] focus:ring-[#5865f2]/10"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Số Zalo</label>
                      <input
                        type="text" value={formData.zalo} onChange={e => setFormData({ ...formData, zalo: e.target.value })}
                        className="w-full px-3 py-2 bg-white dark:bg-[#1a1b23] text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded-[4px] text-sm font-medium focus:outline-none focus:border-[#5865f2]/50 focus:ring-[3px] focus:ring-[#5865f2]/10"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Fanpage Facebook</label>
                      <input
                        type="text" value={formData.facebook} onChange={e => setFormData({ ...formData, facebook: e.target.value })}
                        className="w-full px-3 py-2 bg-white dark:bg-[#1a1b23] text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded-[4px] text-sm font-medium focus:outline-none focus:border-[#5865f2]/50 focus:ring-[3px] focus:ring-[#5865f2]/10"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'seo' && (
            <div className="bg-white dark:bg-[#14151a] rounded-[4px] border border-gray-200 dark:border-gray-800 p-6 md:p-8 animate-in fade-in slide-in-from-right-4 duration-300 shadow-none">
              <div className="space-y-6">
                <h3 className="font-heading text-xs font-medium text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                  Cấu hình Global SEO
                </h3>

                <div className="space-y-6 max-w-3xl">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Global Meta Title</label>
                    <input
                      type="text" value={formData.globalMetaTitle} onChange={e => setFormData({ ...formData, globalMetaTitle: e.target.value })}
                      className="w-full px-3 py-2 bg-white dark:bg-[#1a1b23] text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded-[4px] text-sm font-medium focus:outline-none focus:border-[#5865f2]/50 focus:ring-[3px] focus:ring-[#5865f2]/10"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Global Meta Description</label>
                    <textarea
                      rows={4} value={formData.globalMetaDesc} onChange={e => setFormData({ ...formData, globalMetaDesc: e.target.value })}
                      className="w-full px-3 py-2 bg-white dark:bg-[#1a1b23] text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded-[4px] text-sm font-medium resize-none focus:outline-none focus:border-[#5865f2]/50 focus:ring-[3px] focus:ring-[#5865f2]/10"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tracking' && (
            <div className="bg-white dark:bg-[#14151a] rounded-[4px] border border-gray-200 dark:border-gray-800 p-6 md:p-8 animate-in fade-in slide-in-from-right-4 duration-300 shadow-none">
              <div className="space-y-6">
                <h3 className="font-heading text-xs font-medium text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#43b581]"></span>
                  Mã nhúng theo dõi (Tracking Scripts)
                </h3>

                <div className="space-y-6 max-w-3xl">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Google Analytics (G-Tag)</label>
                    <input
                      type="text" value={formData.googleAnalytics} onChange={e => setFormData({ ...formData, googleAnalytics: e.target.value })}
                      placeholder="VD: G-XXXXXXXXXX"
                      className="w-full px-3 py-2 bg-white dark:bg-[#1a1b23] text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded-[4px] text-sm font-medium focus:outline-none focus:border-[#5865f2]/50 focus:ring-[3px] focus:ring-[#5865f2]/10"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Facebook Pixel ID</label>
                    <input
                      type="text" value={formData.facebookPixel} onChange={e => setFormData({ ...formData, facebookPixel: e.target.value })}
                      placeholder="Nhập ID Pixel..."
                      className="w-full px-3 py-2 bg-white dark:bg-[#1a1b23] text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded-[4px] text-sm font-medium focus:outline-none focus:border-[#5865f2]/50 focus:ring-[3px] focus:ring-[#5865f2]/10"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'danger' && (
            <div className="bg-red-50 dark:bg-red-900/10 rounded-[4px] border border-red-200 dark:border-red-900/30 p-6 md:p-8 animate-in fade-in slide-in-from-right-4 duration-300 shadow-none">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-heading text-red-800 dark:text-red-400 font-medium flex items-center gap-2 mb-1 text-base">
                    <ShieldAlert className="w-5 h-5" /> Khu vực nguy hiểm
                  </h3>
                  <p className="text-red-600 dark:text-red-500/80 text-sm">Xóa toàn bộ bộ nhớ Cache và System Data trên hệ thống. Không thể hoàn tác sau khi thực hiện.</p>
                </div>
                <button
                  onClick={() => setIsResetOpen(true)}
                  className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-[4px] text-sm font-medium transition-colors shadow-none border-0 cursor-pointer shrink-0"
                >
                  Reset Hệ thống
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      <Dialog open={isResetOpen} onOpenChange={setIsResetOpen}>
        <DialogContent className="max-w-md p-6 bg-white dark:bg-[#14151a] border border-gray-200 dark:border-gray-800 rounded-[4px] shadow-sm">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-500 rounded-full flex items-center justify-center mb-2">
              <Trash2 className="w-6 h-6" />
            </div>
            <DialogTitle className="text-xl font-medium text-gray-900 dark:text-white m-0">Xóa toàn bộ dữ liệu?</DialogTitle>
            <DialogDescription className="text-sm text-gray-500 dark:text-gray-400 m-0">
              Hành động này sẽ xóa toàn bộ cache và làm mới hệ thống. Nhập <span className="font-medium text-gray-900 dark:text-white">CONFIRM</span> để xác nhận.
            </DialogDescription>

            <input
              type="text"
              value={confirmText}
              onChange={e => setConfirmText(e.target.value)}
              placeholder="CONFIRM"
              className="w-full px-3 py-2 text-center bg-gray-50 dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-800 rounded-[4px] text-sm font-medium text-gray-900 dark:text-white outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-900/40 transition-all mt-4"
            />

            {resetError && <p className="text-red-500 text-sm">{resetError}</p>}

            <div className="flex items-center gap-3 w-full mt-6">
              <Button
                variant="outline"
                onClick={() => setIsResetOpen(false)}
                className="flex-1 h-10 border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-[#262930] text-gray-700 dark:text-gray-300 shadow-none cursor-pointer"
              >
                Hủy bỏ
              </Button>
              <Button
                onClick={handleResetData}
                disabled={!canSubmitReset || isSubmittingReset}
                className="flex-1 h-10 bg-red-600 hover:bg-red-700 text-white border-0 shadow-none disabled:opacity-50 cursor-pointer"
              >
                {isSubmittingReset ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Tiếp tục xóa
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
