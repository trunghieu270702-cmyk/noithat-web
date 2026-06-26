"use client";

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Search, X } from 'lucide-react';

interface Option {
  value: string;
  label: string;
  badgeLabel?: string;
}

interface CustomMultiSelectProps {
  options: Option[];
  value: string[]; // array of selected values
  onChange: (val: string[]) => void;
  className?: string;
  placeholder?: string;
}

export default function CustomMultiSelect({ options, value, onChange, placeholder = 'Chọn nhiều tùy chọn...', className = '' }: CustomMultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const toggleOption = (optValue: string) => {
    if (value.includes(optValue)) {
      onChange(value.filter(v => v !== optValue));
    } else {
      onChange([...value, optValue]);
    }
  };

  const removeOption = (e: React.MouseEvent, optValue: string) => {
    e.stopPropagation();
    onChange(value.filter(v => v !== optValue));
  };

  const selectedOptions = options.filter(opt => value.includes(opt.value));

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3.5 py-2.5 bg-gray-50/80 dark:bg-[#0b0c10]/80 border border-gray-200 dark:border-gray-800 rounded-lg text-sm text-gray-900 dark:!text-white font-normal hover:bg-gray-100 dark:hover:bg-[#14151a] focus:outline-none focus:ring-[3px] focus:ring-[#5865f2]/20 transition-all font-medium"
      >
        <div className="flex flex-wrap items-center gap-1.5 overflow-hidden flex-1 mr-2 text-left">
          {value.length === 0 ? (
            <span className="text-gray-500 truncate">{placeholder}</span>
          ) : (
            <>
              {selectedOptions.slice(0, 3).map((opt, idx) => {
                const displayLabel = opt.badgeLabel || opt.label.replace(/[\u00A0↳]/g, '').trim();
                return (
                  <span key={idx} title={displayLabel} className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-[4px] text-xs font-medium truncate max-w-[150px]">
                    <span className="truncate">{displayLabel}</span>
                    <X 
                      className="w-3 h-3 hover:text-red-500 cursor-pointer shrink-0" 
                      onClick={(e) => removeOption(e, opt.value)} 
                    />
                  </span>
                );
              })}
              {selectedOptions.length > 3 && (
                <span className="inline-flex items-center px-2 py-0.5 bg-gray-100 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 rounded-[4px] text-xs font-medium shrink-0">
                  +{selectedOptions.length - 3}
                </span>
              )}
            </>
          )}
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
              <li className="px-3 py-4 text-sm text-center text-gray-500 dark:text-gray-400">
                Không tìm thấy kết quả nào
              </li>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = value.includes(opt.value);
                return (
                  <li key={opt.value}>
                    <button
                      type="button"
                      onClick={() => toggleOption(opt.value)}
                      className={`w-full text-left flex items-center justify-between px-3 py-2 rounded-[4px] text-sm font-normal transition-colors ${
                        isSelected
                          ? 'bg-[#5865f2]/10 text-[#5865f2] font-medium'
                          : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-[#262930]'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="truncate">{opt.label}</span>
                      </div>
                      <div className={`w-4 h-4 rounded-[4px] border flex items-center justify-center shrink-0 ${isSelected ? 'bg-[#5865f2] border-[#5865f2]' : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-transparent'}`}>
                        {isSelected && <Check className="w-3 h-3 text-white" />}
                      </div>
                    </button>
                  </li>
                );
              })
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
