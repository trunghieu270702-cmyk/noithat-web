"use client";
import { ReactNode } from "react";

export function Timeline({ children }: { children: ReactNode }) {
  return <div className="space-y-4 border-l border-zinc-800 ml-3 pl-4">{children}</div>;
}

export function TimelineItem({ 
  date, 
  title, 
  description, 
  icon 
}: { 
  date: string, 
  title: string, 
  description?: string, 
  icon?: ReactNode 
}) {
  return (
    <div className="relative">
      <div className="absolute -left-[25px] flex h-6 w-6 items-center justify-center rounded-full bg-zinc-900 border border-zinc-700 text-zinc-400 ring-4 ring-zinc-950">
        {icon ? icon : <div className="h-2 w-2 rounded-full bg-zinc-500" />}
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-medium text-zinc-200">{title}</span>
        <span className="text-xs text-zinc-500 mb-1">{date}</span>
        {description && <span className="text-sm text-zinc-400">{description}</span>}
      </div>
    </div>
  );
}
