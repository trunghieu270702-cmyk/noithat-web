"use client";

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, FolderOpen, Plus, Search } from 'lucide-react';

interface Option {
  value: string;
  label: string;
  color?: 'green' | 'red' | 'blue' | 'yellow' | 'gray';
}

const colorMap: Record<string, string> = {
  green: 'bg-emerald-500',
  red: 'bg-red-500',
  blue: 'bg-[#5865f2]',
  yellow: 'bg-amber-500',
  gray: 'bg-gray-400',
};

interface CustomDropdownProps {
  options: Option[];
  value: string;
  onChange: (val: string) => void;
  className?: string;
  onQuickAdd?: (newVal?: string) => void;
  emptyText?: string;
  placeholder?: string;
}

export default function CustomDropdown({ options, value, onChange, placeholder = 'Chọn tùy chọn...', className = '', onQuickAdd, emptyText }: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setSearchTerm('');
    }
  }, [isOpen]);

  const filteredOptions = options.filter(opt => opt.label.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3.5 py-2.5 bg-gray-50/80 dark:bg-[#0b0c10]/80 border border-gray-200 dark:border-gray-800 rounded-lg text-sm text-gray-900 dark:!text-white font-normal hover:bg-gray-100 dark:hover:bg-[#14151a] focus:outline-none focus:ring-[3px] focus:ring-[#5865f2]/20 transition-all font-medium"
      >
        <div className="flex items-center gap-2 truncate">
          {selectedOption?.color && (
            <span className={`w-2 h-2 rounded-full ${colorMap[selectedOption.color]}`}></span>
          )}
          <span className="truncate">{selectedOption ? selectedOption.label : placeholder}</span>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1.5 bg-white dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm shadow-black/5 dark:shadow-none overflow-hidden animate-in fade-in zoom-in-95 duration-100 flex flex-col">
          <div className="p-2 border-b border-gray-100 dark:border-gray-800 shrink-0">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input
                type="text"
                autoFocus
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm kiếm..."
                className="w-full pl-8 pr-3 py-1.5 bg-gray-50 dark:bg-[#14151a] border border-gray-200 dark:border-gray-800 rounded-[4px] text-sm focus:outline-none focus:ring-[2px] focus:ring-[#5865f2]/20 text-gray-900 dark:!text-white font-normal"
              />
            </div>
          </div>
          <ul className="max-h-60 overflow-y-auto p-1 custom-scrollbar">
            {filteredOptions.length === 0 ? (
              searchTerm && onQuickAdd ? (
                <li className="p-1.5">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsOpen(false);
                      onQuickAdd(searchTerm);
                    }}
                    className="w-full text-left flex items-center gap-2 px-3 py-2 bg-[#5865f2]/10 hover:bg-[#5865f2]/20 text-[#5865f2] rounded-[4px] text-sm font-medium transition-colors"
                  >
                    <Plus className="w-4 h-4 shrink-0" />
                    <span className="truncate">Tạo mới "{searchTerm}"</span>
                  </button>
                </li>
              ) : (
                <li className="px-3 py-6 flex flex-col items-center justify-center text-center">
                  <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3">
                    <FolderOpen className="w-5 h-5 text-gray-400" />
                  </div>
                  <p className="text-sm font-medium text-gray-900 dark:!text-white font-normal mb-1">
                    {searchTerm ? 'Không tìm thấy kết quả' : (emptyText || 'Không có dữ liệu')}
                  </p>
                </li>
              )
            ) : (
              filteredOptions.map((option) => (
                <li key={option.value}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(option.value);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left flex items-center justify-between px-3 py-2 text-sm rounded-[4px] transition-colors ${value === option.value
                        ? 'bg-[#5865f2]/10 text-[#5865f2] font-medium dark:bg-[#5865f2]/20 dark:text-blue-400'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#14151a]'
                      }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      {option.color && (
                        <span className={`w-2 h-2 rounded-full shrink-0 ${colorMap[option.color]}`}></span>
                      )}
                      <span className="truncate">{option.label}</span>
                    </div>
                    {value === option.value && <Check className="w-4 h-4 shrink-0" />}
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
