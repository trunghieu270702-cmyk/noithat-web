
"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import AppLayout from "@/admin-components/layout/AppLayout";
import { useAuthStore } from "@/admin-features/auth/stores/useAuthStore";

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    if (!token) {
      router.push("/admin/login");
    }
  }, [token, router]);

  if (!token) {
    return <div className="min-h-screen flex items-center justify-center bg-[#09090b] text-white">Đang chuyển hướng đến trang đăng nhập...</div>;
  }

  return <AppLayout>{children}</AppLayout>;
}
