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
      <DropdownMenuTrigger className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors cursor-pointer data-[state=open]:bg-gray-100 data-[state=open]:text-gray-900 focus:outline-none">
        <MoreHorizontal className="w-5 h-5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 p-1">
        {items.map((item, idx) => {
          const colorClass = 
            item.variant === "danger" ? "text-red-600 focus:bg-red-50 focus:text-red-700" :
            item.variant === "warning" ? "text-amber-600 focus:bg-amber-50 focus:text-amber-700" :
            item.variant === "success" ? "text-emerald-600 focus:bg-emerald-50 focus:text-emerald-700" :
            "text-gray-700 focus:bg-gray-50 focus:text-gray-900";

          return (
            <React.Fragment key={idx}>
              {item.separatorBefore && <DropdownMenuSeparator className="my-1 border-gray-100" />}
              <DropdownMenuItem 
                onClick={item.onClick}
                className={`flex items-center gap-2 px-2.5 py-2 text-sm font-medium rounded-md cursor-pointer outline-none transition-colors ${colorClass}`}
              >
                {item.icon && <item.icon className="w-4 h-4" />}
                {item.label}
              </DropdownMenuItem>
            </React.Fragment>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
