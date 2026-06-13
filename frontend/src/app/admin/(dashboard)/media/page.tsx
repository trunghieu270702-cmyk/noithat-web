"use client";
import React, { useState } from 'react';
import { Search, Image as ImageIcon, UploadCloud, Trash2, Link as LinkIcon, CheckCircle2 } from 'lucide-react';
import { ImageUploader } from '@/admin-components/ui/image-uploader';

export default function MediaLibraryPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const [mediaFiles, setMediaFiles] = useState<{ id: string, url: string, name: string, size: string, date: string }[]>([]);

  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredMedia = mediaFiles.filter(file =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCopyLink = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa file này khỏi hệ thống?')) {
      setMediaFiles(mediaFiles.filter(f => f.id !== id));
    }
  };

  const handleUploadSuccess = (urls: string[]) => {
    const newFiles = urls.map((url, index) => ({
      id: `new_${Date.now()}_${index}`,
      url: url,
      name: url.split('/').pop() || `uploaded_image_${index}.jpg`,
      size: 'Unknown',
      date: new Date().toLocaleDateString('vi-VN')
    }));
    setMediaFiles([...newFiles, ...mediaFiles]);
  };

  return (
    <div className="h-full flex flex-col space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 flex-shrink-0">
        <div>
          <h2 className="font-heading text-xl font-medium tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-[#5865f2]" />
            Thư viện Media
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Quản lý tập trung toàn bộ hình ảnh được lưu trữ trên Cloudinary.</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-h-0 bg-white dark:bg-[#14151a] rounded-[4px] border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#14151a] flex-shrink-0">
          <h3 className="font-heading text-sm font-medium text-gray-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
            <UploadCloud className="w-4 h-4 text-[#5865f2]" />
            Upload hình ảnh mới
          </h3>
          <div className="max-w-xl">
            <ImageUploader
              initialImages={[]}
              onUploadSuccess={handleUploadSuccess}
              onRemoveImage={() => { }}
              maxFiles={10}
            />
          </div>
        </div>

        <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-[#1a1b23] flex-shrink-0">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên file..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-[#14151a] border border-gray-200 dark:border-gray-800 rounded-[4px] text-sm focus:outline-none focus:ring-[3px] focus:ring-[#5865f2]/20 text-gray-900 dark:text-white transition-all"
            />
          </div>
        </div>

        <div className="flex-1 p-6 overflow-y-auto">
          {filteredMedia.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {filteredMedia.map((file) => (
                <div key={file.id} className="group flex flex-col rounded-[4px] overflow-hidden border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#14151a] hover:border-[#5865f2]/50 transition-all">
                  <div className="aspect-square relative overflow-hidden bg-gray-50 dark:bg-[#1a1b23] border-b border-gray-200 dark:border-gray-800">
                    <img
                      src={file.url}
                      alt={file.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <button
                        onClick={() => handleCopyLink(file.url, file.id)}
                        className="w-8 h-8 rounded-full bg-white dark:bg-[#14151a]/20 hover:bg-[#5865f2] text-white flex items-center justify-center backdrop-blur-sm transition-colors cursor-pointer"
                        title="Copy Link"
                      >
                        {copiedId === file.id ? <CheckCircle2 className="w-4 h-4" /> : <LinkIcon className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => handleDelete(file.id)}
                        className="w-8 h-8 rounded-full bg-white dark:bg-[#14151a]/20 hover:bg-red-500 text-white flex items-center justify-center backdrop-blur-sm transition-colors cursor-pointer"
                        title="Xóa ảnh"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="text-xs font-medium text-gray-900 dark:text-white truncate" title={file.name}>{file.name}</p>
                    <div className="flex items-center justify-between mt-1.5 text-[11px] font-medium text-gray-500 dark:text-gray-400">
                      <span>{file.size}</span>
                      <span>{file.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-gray-500 dark:text-gray-400">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-200 dark:border-gray-800">
                <ImageIcon className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-base font-medium text-gray-900 dark:text-white">Không tìm thấy file media</p>
              <p className="text-sm mt-1">Vui lòng thử từ khóa tìm kiếm khác hoặc upload ảnh mới.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
