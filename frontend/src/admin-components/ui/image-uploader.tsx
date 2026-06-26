"use client";

import { useState, useEffect, useRef, useId } from "react";
import axios from "axios";
import { Loader2, UploadCloud, X, Image as ImageIcon, MonitorUp } from "lucide-react";
import { MediaPickerModal } from "./media-picker-modal";

interface ImageUploaderProps {
  onUploadSuccess: (urls: string[]) => void;
  onRemoveImage?: (url: string) => void;
  maxFiles?: number;
  initialImages?: string[];
}

export function ImageUploader({ onUploadSuccess, onRemoveImage, maxFiles = 5, initialImages = [] }: ImageUploaderProps) {
  const uploaderId = useId();
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const [previewUrls, setPreviewUrls] = useState<string[]>(initialImages);
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync initialImages when they change (useful for edit mode)
  useEffect(() => {
    setPreviewUrls(initialImages);
  }, [initialImages]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsMenuOpen(false);
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (previewUrls.length + files.length > maxFiles) {
      setError(`Chỉ được tải lên tối đa ${maxFiles} ảnh. Bạn đã chọn ${previewUrls.length} ảnh.`);
      return;
    }

    setIsUploading(true);
    setError("");

    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append("files", file);
    });

    try {
      const response = await axios.post('/api/upload/images', formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const uploadedUrls = response.data as string[];
      if (!Array.isArray(uploadedUrls)) {
        throw new Error('Định dạng ảnh không hợp lệ từ server');
      }
      setPreviewUrls((prev) => [...prev, ...uploadedUrls]);
      onUploadSuccess(uploadedUrls);
    } catch (err: any) {
      setError(err.response?.data?.message || "Tải ảnh thất bại");
    } finally {
      setIsUploading(false);
      // Reset input value to allow selecting same files again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeImage = (indexToRemove: number) => {
    const urlToRemove = previewUrls[indexToRemove];
    setPreviewUrls((prev) => prev.filter((_, idx) => idx !== indexToRemove));
    if (onRemoveImage) onRemoveImage(urlToRemove);
  };

  const remainingFiles = Math.max(0, maxFiles - previewUrls.length);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 w-full relative">
        <button
          type="button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          disabled={isUploading || remainingFiles === 0}
          className={`flex flex-col items-center justify-center w-full h-32 border-2 border-gray-200 dark:border-gray-700 border-dashed rounded-[4px] bg-gray-50 dark:bg-[#1a1b23] hover:bg-gray-100 dark:hover:bg-[#262930] transition-colors focus:outline-none ${remainingFiles === 0 ? 'opacity-50 pointer-events-none' : ''}`}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6 text-gray-500 dark:text-gray-400">
            {isUploading ? (
              <Loader2 className="w-8 h-8 mb-3 animate-spin text-blue-500" />
            ) : (
              <div className="p-3 bg-white dark:bg-[#2a2d36] rounded-full mb-3 border border-gray-100 dark:border-gray-800">
                <UploadCloud className="w-6 h-6 text-blue-500 dark:text-blue-400" />
              </div>
            )}
            <p className="mb-2 text-sm text-gray-700 dark:text-gray-300"><span className="font-medium text-blue-600 dark:text-blue-400">Nhấn để thêm ảnh mới</span></p>
            <p className="text-xs text-gray-500 dark:text-gray-500">Hỗ trợ PNG, JPG, WEBP (Tối đa {maxFiles} file)</p>
          </div>
        </button>

        {isMenuOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); setIsMenuOpen(false); }} />
            <div className="absolute bottom-[135px] left-1/2 -translate-x-1/2 z-50 w-64 bg-white dark:bg-[#14151a] p-1.5 shadow-md shadow-black/5 dark:shadow-none border border-gray-200 dark:border-gray-800 rounded-lg animate-in zoom-in-95 slide-in-from-bottom-2 duration-100">
              <label 
                htmlFor={`dropzone-file-${uploaderId}`} 
                className="flex items-center w-full cursor-pointer py-2.5 px-3 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800/50 rounded-md transition-colors"
                onClick={() => setTimeout(() => setIsMenuOpen(false), 100)}
              >
                <MonitorUp className="w-4 h-4 mr-2.5 text-gray-500 dark:text-gray-400" />
                Tải lên từ máy tính
              </label>
              <button 
                type="button" 
                onClick={(e) => { e.stopPropagation(); setIsMenuOpen(false); setIsMediaPickerOpen(true); }} 
                className="flex items-center w-full cursor-pointer py-2.5 px-3 text-sm font-medium text-[#5865f2] hover:text-[#4752c4] hover:bg-gray-100 dark:hover:bg-gray-800/50 rounded-md transition-colors"
              >
                <ImageIcon className="w-4 h-4 mr-2.5" />
                Chọn từ thư viện hệ thống
              </button>
            </div>
          </>
        )}

        <input id={`dropzone-file-${uploaderId}`} ref={fileInputRef} type="file" className="hidden" multiple accept="image/*" onChange={handleFileChange} disabled={isUploading || remainingFiles === 0} />
      </div>

      {error && <p className="text-sm text-red-500 font-medium">{error}</p>}

      {previewUrls.length > 0 && (
        <div className="flex flex-wrap gap-4 mt-4">
          {previewUrls.map((url, idx) => (
            <div key={idx} className="relative w-24 h-24 rounded-[4px] border border-gray-200 dark:border-gray-700 overflow-hidden bg-white dark:bg-[#1a1b23] group">
              <img src={url} alt="Preview" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(idx)}
                className="absolute top-1 right-1 p-1.5 bg-white/80 dark:bg-black/50 hover:bg-red-500 rounded-[4px] text-gray-700 dark:text-gray-300 hover:text-white transition-all shadow-sm backdrop-blur-sm"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      <MediaPickerModal
        open={isMediaPickerOpen}
        onOpenChange={setIsMediaPickerOpen}
        maxFiles={maxFiles}
        initialSelectedUrls={previewUrls}
        onSelect={(urls) => {
          setPreviewUrls(urls);
          onUploadSuccess(urls);
        }}
      />
    </div>
  );
}
