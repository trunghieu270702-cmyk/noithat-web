"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Loader2, UploadCloud, X } from "lucide-react";

interface ImageUploaderProps {
  onUploadSuccess: (urls: string[]) => void;
  onRemoveImage?: (url: string) => void;
  maxFiles?: number;
  initialImages?: string[];
}

export function ImageUploader({ onUploadSuccess, onRemoveImage, maxFiles = 5, initialImages = [] }: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const [previewUrls, setPreviewUrls] = useState<string[]>(initialImages);

  // Sync initialImages when they change (useful for edit mode)
  useEffect(() => {
    setPreviewUrls(initialImages);
  }, [initialImages]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (files.length > maxFiles) {
      setError(`Chỉ được tải lên tối đa ${maxFiles} ảnh`);
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
    }
  };

  const removeImage = (indexToRemove: number) => {
    const urlToRemove = previewUrls[indexToRemove];
    setPreviewUrls((prev) => prev.filter((_, idx) => idx !== indexToRemove));
    if (onRemoveImage) onRemoveImage(urlToRemove);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center w-full">
        <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-200 dark:border-gray-700 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-[#1a1b23] hover:bg-gray-100 dark:hover:bg-[#262930] transition-colors">
          <div className="flex flex-col items-center justify-center pt-5 pb-6 text-gray-500 dark:text-gray-400">
            {isUploading ? (
              <Loader2 className="w-8 h-8 mb-3 animate-spin text-blue-500" />
            ) : (
              <div className="p-3 bg-white dark:bg-[#2a2d36] rounded-full mb-3 border border-gray-100 dark:border-gray-800">
                <UploadCloud className="w-6 h-6 text-blue-500 dark:text-blue-400" />
              </div>
            )}
            <p className="mb-2 text-sm text-gray-700 dark:text-gray-300"><span className="font-medium text-blue-600 dark:text-blue-400">Nhấn để tải lên</span> hoặc kéo thả vào đây</p>
            <p className="text-xs text-gray-500 dark:text-gray-500">Hỗ trợ PNG, JPG, WEBP (Tối đa {maxFiles} file)</p>
          </div>
          <input id="dropzone-file" type="file" className="hidden" multiple accept="image/*" onChange={handleFileChange} disabled={isUploading} />
        </label>
      </div>
      
      {error && <p className="text-sm text-red-500 font-medium">{error}</p>}

      {previewUrls.length > 0 && (
        <div className="flex flex-wrap gap-4 mt-4">
          {previewUrls.map((url, idx) => (
            <div key={idx} className="relative w-24 h-24 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden bg-white dark:bg-[#1a1b23] group">
              <img src={url} alt="Preview" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(idx)}
                className="absolute top-1 right-1 p-1.5 bg-red-500/90 hover:bg-red-600 rounded-md text-white opacity-0 group-hover:opacity-100 transition-all transform scale-90 group-hover:scale-100"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
