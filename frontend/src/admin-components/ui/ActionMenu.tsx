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
            item.variant === "danger" ? "!text-red-600 dark:!text-red-400 focus:!bg-red-50 dark:focus:!bg-red-500/10 focus:!text-red-700 dark:focus:!text-red-300" :
              item.variant === "warning" ? "!text-amber-600 dark:!text-amber-400 focus:!bg-amber-50 dark:focus:!bg-amber-500/10 focus:!text-amber-700 dark:focus:!text-amber-300" :
                item.variant === "success" ? "!text-emerald-600 dark:!text-emerald-400 focus:!bg-emerald-50 dark:focus:!bg-emerald-500/10 focus:!text-emerald-700 dark:focus:!text-emerald-300" :
                  "!text-gray-700 dark:!text-gray-300 focus:!bg-gray-100 dark:focus:!bg-[#262930] focus:!text-gray-900 dark:focus:!text-white";

          const iconColorClass = "!text-current opacity-70 group-focus:opacity-100";

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
