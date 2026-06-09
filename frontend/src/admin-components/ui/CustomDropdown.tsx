"use client";

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

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
  placeholder?: string;
  className?: string;
}

export default function CustomDropdown({ options, value, onChange, placeholder = 'Select option...', className = '' }: CustomDropdownProps) {
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

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2 bg-gray-50 dark:bg-[#0b0c10] border border-gray-200 dark:border-gray-800 rounded-lg text-sm text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-[#14151a] focus:outline-none focus:ring-2 focus:ring-[#5865f2]/50 transition-all font-medium"
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
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-[#1a1b23] border border-gray-100 dark:border-gray-800 rounded-lg shadow-xl shadow-gray-200/20 dark:shadow-none overflow-hidden animate-in fade-in zoom-in-95 duration-100">
          <ul className="max-h-60 overflow-y-auto py-1 custom-scrollbar">
            {options.map((option) => (
              <li key={option.value}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left flex items-center justify-between px-3 py-2 text-sm transition-colors ${
                    value === option.value
                      ? 'bg-[#5865f2]/10 text-[#5865f2] font-medium dark:bg-[#5865f2]/20 dark:text-blue-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#14151a]'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    {option.color && (
                      <span className={`w-2 h-2 rounded-full ${colorMap[option.color]}`}></span>
                    )}
                    <span className="truncate">{option.label}</span>
                  </div>
                  {value === option.value && <Check className="w-4 h-4 shrink-0" />}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
