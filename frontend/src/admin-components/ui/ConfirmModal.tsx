import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'primary';
  isLoading?: boolean;
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Xác nhận',
  cancelText = 'Hủy bỏ',
  variant = 'danger',
  isLoading = false
}: ConfirmModalProps) {
  if (!isOpen) return null;

  const Icon = variant === 'danger' ? Trash2 : AlertTriangle;
  const iconColor = variant === 'danger' ? 'text-red-600 dark:text-red-500' : variant === 'warning' ? 'text-amber-600 dark:text-amber-500' : 'text-blue-600 dark:text-blue-500';
  const iconBg = variant === 'danger' ? 'bg-red-100 dark:bg-red-500/20' : variant === 'warning' ? 'bg-amber-100 dark:bg-amber-500/20' : 'bg-blue-100 dark:bg-blue-500/20';
  const buttonBg = variant === 'danger' ? 'bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700' : variant === 'warning' ? 'bg-amber-600 hover:bg-amber-700 dark:bg-amber-600 dark:hover:bg-amber-700' : 'bg-[#5865f2] hover:bg-[#4752c4]';

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-gray-900/40 dark:bg-black/60 backdrop-blur-sm transition-opacity duration-200 animate-in fade-in" 
        onClick={!isLoading ? onClose : undefined} 
      />
      
      {/* Modal Content */}
      <div className="relative bg-white dark:bg-[#1e1e20] w-full max-w-md rounded-[8px] shadow-xl animate-in zoom-in-95 duration-200 overflow-hidden border border-gray-200 dark:border-gray-800">
        <button 
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-[4px] hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${iconBg}`}>
              <Icon className={`w-5 h-5 ${iconColor}`} />
            </div>
            <div className="flex-1 mt-0.5">
              <h3 className="text-base font-medium text-gray-900 dark:text-white leading-tight mb-2">
                {title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                {description}
              </p>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 dark:bg-[#14151a] border-t border-gray-100 dark:border-gray-800 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 bg-white dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#262930] text-gray-700 dark:text-gray-300 rounded-[4px] text-sm font-medium transition-colors disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-4 py-2 text-white rounded-[4px] text-sm font-medium transition-colors disabled:opacity-50 flex items-center justify-center min-w-[100px] ${buttonBg}`}
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
