"use client";

import React from "react";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "./dropdown-menu";

export interface ActionMenuItem {
  label: string;
  icon?: React.ElementType;
  onClick: () => void;
  variant?: "default" | "danger" | "warning" | "success";
  separatorBefore?: boolean;
}

interface ActionMenuProps {
  items: ActionMenuItem[];
}

export function ActionMenu({ items }: ActionMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-white/10 rounded-[6px] transition-all cursor-pointer data-[state=open]:bg-gray-100 dark:data-[state=open]:bg-white/10 data-[state=open]:text-gray-900 dark:data-[state=open]:text-gray-100 focus:outline-none">
        <MoreHorizontal className="w-4 h-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[220px] w-auto p-1 rounded-[10px] bg-white dark:bg-[#1c1c1f] border border-[#e5e7eb] dark:border-[#2b2b30] shadow-[0px_4px_16px_rgba(17,17,26,0.05),_0px_8px_24px_rgba(17,17,26,0.05)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.5)] animate-in fade-in-80 zoom-in-95 duration-100 font-asana">
        {items.map((item, idx) => {
          const colorClass =
            item.variant === "danger" ? "!text-[#dc2626] focus:!bg-[#fef2f2] focus:!ring-1 focus:!ring-[#fecaca] focus:!text-[#dc2626]" :
              item.variant === "warning" ? "!text-[#d97706] focus:!bg-[#fffbeb] focus:!ring-1 focus:!ring-[#fde68a] focus:!text-[#d97706]" :
                item.variant === "success" ? "!text-[#059669] focus:!bg-[#ecfdf5] focus:!ring-1 focus:!ring-[#a7f3d0] focus:!text-[#059669]" :
                  "!text-[#1f2937] dark:!text-[#e5e7eb] focus:!bg-[#f4f4fe] dark:focus:!bg-[#2b2b36] focus:!ring-1 focus:!ring-[#e0e0fc] dark:focus:!ring-[#3f3f4e] focus:!text-[#4f39f6] dark:focus:!text-[#a59ffd]";

          const iconColorClass = item.variant ? "" : "!text-[#4b5563] dark:!text-[#9ca3af] group-focus:!text-[#4f39f6] dark:group-focus:!text-[#a59ffd]";

          return (
            <React.Fragment key={idx}>
              {item.separatorBefore && <DropdownMenuSeparator className="!my-1 !bg-gray-100 dark:!bg-[#2b2b30]" />}
              <DropdownMenuItem
                onClick={item.onClick}
                className={`group flex items-center !gap-2.5 !px-2.5 !py-1.5 !text-[13px] !font-medium !rounded-[6px] cursor-pointer outline-none transition-none ${colorClass}`}
              >
                {item.icon && <item.icon className={`!w-4 !h-4 ${iconColorClass}`} strokeWidth={1.75} />}
                {item.label}
              </DropdownMenuItem>
            </React.Fragment>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
