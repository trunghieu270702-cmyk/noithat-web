
"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import AppLayout from "@/admin-components/layout/AppLayout";
import { useAuthStore } from "@/admin-features/auth/stores/useAuthStore";
import { Toaster } from 'sonner';
import { Loader2 } from "lucide-react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const [mounted, setMounted] = React.useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !token) {
      router.push("/admin/login");
    }
  }, [token, router, mounted]);

  if (!mounted) {
    return <div className="min-h-screen bg-[#f4f5f7] dark:bg-[#0b0c10]"></div>; // Empty shell for SSR to match initial client render without flickering
  }

  if (!token) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f4f5f7] dark:bg-[#0b0c10] text-[#111827] dark:text-[#f3f4f6]">
        <div className="flex flex-col items-center gap-4 animate-in fade-in zoom-in-95 duration-500">
          <div className="w-16 h-16 bg-white dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-[#5865f2] animate-spin" />
          </div>
          <div className="flex flex-col items-center">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">Xác thực tài khoản</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Đang chuyển hướng đến trang đăng nhập...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Toaster position="bottom-left" />
      <AppLayout>{children}</AppLayout>
    </>
  );
}
