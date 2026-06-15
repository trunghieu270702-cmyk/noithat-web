"use client";

import React, { useState, useEffect } from 'react';
import { Search, Loader2, CheckCircle2, Images, FolderOpen, Check, X } from 'lucide-react';
import apiClient from '@/admin-lib/apiClient';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/admin-components/ui/dialog';
import { Button } from '@/admin-components/ui/button';

export interface MediaFile {
  id: number;
  url: string;
  name: string;
  type: string;
  size: number;
  createdAt: string;
}

interface MediaPickerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (urls: string[]) => void;
  maxFiles?: number;
}

export function MediaPickerModal({ open, onOpenChange, onSelect, maxFiles = 10 }: MediaPickerModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [selectedUrls, setSelectedUrls] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchMedia = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get('/media');
      setMediaFiles(response.data);
    } catch (error) {
      console.error('Failed to fetch media:', error);
      toast.error('Lỗi khi tải thư viện Media');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchMedia();
      setSelectedUrls([]);
      setSearchTerm('');
    }
  }, [open]);

  const filteredMedia = mediaFiles.filter(file =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleSelect = (url: string) => {
    setSelectedUrls(prev => {
      if (prev.includes(url)) {
        return prev.filter(u => u !== url);
      }
      if (prev.length >= maxFiles) {
        toast.warning(`Chỉ được chọn tối đa ${maxFiles} ảnh`);
        return prev;
      }
      return [...prev, url];
    });
  };

  const handleConfirm = () => {
    if (selectedUrls.length > 0) {
      onSelect(selectedUrls);
      onOpenChange(false);
    } else {
      toast.warning('Vui lòng chọn ít nhất một ảnh');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent style={{ fontFamily: 'Roboto, sans-serif' }} className="sm:max-w-[1000px] w-[95vw] h-[85vh] !p-0 flex flex-col bg-white dark:bg-[#1e1e20] border border-gray-200 dark:border-gray-800 rounded-[8px] overflow-hidden shadow-xl">
        <DialogHeader className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 shrink-0 bg-white dark:bg-[#1e1e20] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 w-full">
            <DialogTitle className="text-base font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap">
              Chọn ảnh từ thư viện
            </DialogTitle>
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm tên file..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-white dark:bg-[#252628] border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 rounded-[6px] text-sm focus:outline-none focus:ring-1 focus:ring-gray-300 dark:focus:ring-gray-600 text-gray-900 dark:text-gray-200 transition-colors shadow-none"
              />
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-[#f9f9fa] dark:bg-[#161618]">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
            </div>
          ) : filteredMedia.length > 0 ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
              {filteredMedia.map((file) => {
                const isSelected = selectedUrls.includes(file.url);
                return (
                  <div
                    key={file.id}
                    onClick={() => toggleSelect(file.url)}
                    className={`relative aspect-square rounded-[6px] overflow-hidden cursor-pointer border transition-all group ${
                      isSelected ? 'border-[#5865f2] ring-1 ring-[#5865f2]' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-[#1e1e20]'
                    }`}
                  >
                    <img
                      src={file.url}
                      alt={file.name}
                      className="w-full h-full object-cover"
                    />
                    {isSelected && (
                      <div className="absolute top-1.5 right-1.5 bg-white rounded-full shadow-sm">
                        <CheckCircle2 className="w-5 h-5 text-[#5865f2]" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
              <FolderOpen className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-3" strokeWidth={1} />
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Thư viện trống</p>
              <p className="text-xs mt-1 text-gray-500">Không tìm thấy hình ảnh nào phù hợp.</p>
            </div>
          )}
        </div>

        <DialogFooter className="m-0 px-6 py-4 border-t border-gray-200 dark:border-gray-800 shrink-0 bg-white dark:bg-[#1e1e20] flex flex-row items-center justify-between">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Đã chọn: <strong className="font-medium text-gray-900 dark:text-gray-100">{selectedUrls.length}</strong>/{maxFiles}
          </span>
          <div className="flex items-center gap-3">
            <DialogClose render={
              <Button variant="outline" className="h-10 px-5 text-sm font-medium rounded-[6px] border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white shadow-none transition-colors flex items-center gap-2">
                <X className="w-4 h-4" /> Hủy
              </Button>
            } />
            <Button
              onClick={handleConfirm}
              disabled={selectedUrls.length === 0}
              className="h-10 px-5 text-sm font-medium rounded-[6px] bg-[#5865f2] hover:bg-[#4752c4] text-white disabled:opacity-50 shadow-none transition-colors flex items-center gap-2"
            >
              <Check className="w-4 h-4" /> Chèn ảnh
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
