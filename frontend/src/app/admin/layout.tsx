/**
 * Admin Layout
 * Bao gồm Header và Footer dành cho admin dashboard.
 * Admin pages bên trong dùng 'use client' riêng.
 */


import { ThemeProvider } from '@/admin-components/ThemeProvider';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="system" storageKey="admin-theme">
      <div 
        className={`min-h-screen h-full w-full antialiased tracking-tight text-gray-900 dark:text-gray-100 admin-wrapper`}
        style={{ fontFamily: '"Geist", Arial, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"' }}
      >
        {children}
      </div>
    </ThemeProvider>
  );
}
