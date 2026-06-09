"use client";
import React, { ReactNode } from "react";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import "overlayscrollbars/overlayscrollbars.css";

interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function ScrollArea({ children, className, ...props }: ScrollAreaProps) {
  return (
    <OverlayScrollbarsComponent
      className={className}
      options={{
        scrollbars: {
          autoHide: "leave",
          autoHideDelay: 2000,
          theme: "os-theme-dark",
        },
      }}
      defer
      {...props}
    >
      {children}
    </OverlayScrollbarsComponent>
  );
}
