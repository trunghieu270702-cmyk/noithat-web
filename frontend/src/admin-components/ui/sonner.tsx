"use client"
import { useTheme } from "next-themes"

import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "light" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="bottom-left"
      richColors
      toastOptions={{
        classNames: {
          toast: "group toast group-[.toaster]:bg-white group-[.toaster]:text-gray-900 dark:group-[.toaster]:bg-[#1e1e20] dark:group-[.toaster]:text-white group-[.toaster]:border-gray-200 dark:group-[.toaster]:border-gray-800 group-[.toaster]:shadow-xl group-[.toaster]:rounded-[8px] group-[.toaster]:font-medium",
          description: "group-[.toast]:text-gray-500 dark:group-[.toast]:text-gray-400",
          actionButton: "group-[.toast]:bg-[#5865f2] group-[.toast]:text-white",
          cancelButton: "group-[.toast]:bg-gray-100 group-[.toast]:text-gray-500 dark:group-[.toast]:bg-gray-800 dark:group-[.toast]:text-gray-400",
          success: "group-[.toaster]:!bg-emerald-50 dark:group-[.toaster]:!bg-emerald-500/10 group-[.toaster]:!text-emerald-700 dark:group-[.toaster]:!text-emerald-400 group-[.toaster]:!border-emerald-200 dark:group-[.toaster]:!border-emerald-500/20",
          error: "group-[.toaster]:!bg-red-50 dark:group-[.toaster]:!bg-red-500/10 group-[.toaster]:!text-red-700 dark:group-[.toaster]:!text-red-400 group-[.toaster]:!border-red-200 dark:group-[.toaster]:!border-red-500/20",
          info: "group-[.toaster]:!bg-blue-50 dark:group-[.toaster]:!bg-blue-500/10 group-[.toaster]:!text-blue-700 dark:group-[.toaster]:!text-blue-400 group-[.toaster]:!border-blue-200 dark:group-[.toaster]:!border-blue-500/20",
          warning: "group-[.toaster]:!bg-amber-50 dark:group-[.toaster]:!bg-amber-500/10 group-[.toaster]:!text-amber-700 dark:group-[.toaster]:!text-amber-400 group-[.toaster]:!border-amber-200 dark:group-[.toaster]:!border-amber-500/20",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
