"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import 'overlayscrollbars/overlayscrollbars.css';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import {
  LayoutGrid,
  Users,
  FileText,
  Settings,
  Bell,
  Search,
  Moon,
  Sun,
  LogOut,
  Command,
  PanelLeftClose,
  MessageSquare,
  Building2,
  ShieldCheck,
  FolderKanban,
  Image as ImageIcon,
  Tags,
  Home,
  Star,
  Briefcase,
  FileSearch
} from 'lucide-react';
import { useTheme } from '../ThemeProvider';
import { useAuthStore } from '@/admin-features/auth/stores/useAuthStore';

const navigation = [
  { name: 'Tổng quan', href: '/admin', icon: LayoutGrid },
  { name: 'Đơn vị đối tác', href: '/admin/units', icon: Building2 },
  { name: 'Dự án', href: '/admin/projects', icon: FolderKanban },
  { name: 'Yêu cầu tư vấn (Lead)', href: '/admin/leads', icon: MessageSquare },
  { name: 'Giám sát thi công', href: '/admin/supervisions', icon: ShieldCheck },
  { name: 'Cẩm nang nội thất', href: '/admin/articles', icon: FileText },
  { name: 'Trang SEO tĩnh', href: '/admin/seo', icon: FileSearch },
  { name: 'Thư viện Media', href: '/admin/media', icon: ImageIcon },
  { name: 'Danh mục & Bộ lọc', href: '/admin/categories', icon: Tags },
  { name: 'Quản lý Homepage', href: '/admin/homepage', icon: Home },
  { name: 'Đánh giá & Review', href: '/admin/testimonials', icon: Star },
  { name: 'Khách hàng', href: '/admin/customers', icon: Users },
  { name: 'Vận hành nội bộ', href: '/admin/operations', icon: Briefcase },
];

const systemNav = [
  { name: 'Cài đặt hệ thống', href: '/admin/settings', icon: Settings },
];

export default function AppLayout({ children }: { children?: React.ReactNode }) {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const location = { pathname: usePathname() };
  const { logout, user } = useAuthStore();

  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const allNav = [...navigation, ...systemNav];
  const currentPage = allNav.find(
    (n) => location.pathname === n.href || location.pathname.startsWith(`${n.href}/`)
  );

  return (
    <div className="flex h-screen bg-[#f4f5f7] dark:bg-[#0b0c10] text-[#111827] dark:text-[#f3f4f6] overflow-hidden admin-wrapper">
      <aside className="w-[260px] flex-shrink-0 bg-white dark:bg-[#1e1f24] border-r border-gray-200 dark:border-gray-800 flex flex-col transition-colors duration-300">

        {/* Header / Logo */}
        <div className="h-[72px] flex items-center justify-between px-5 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#5865f2] text-white flex items-center justify-center">
              <Command strokeWidth={2} className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-base leading-tight text-gray-900 dark:text-white">Hệ Sinh Thái</span>
              <span className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">Quản lý hệ thống</span>
            </div>
          </div>
          <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer">
            <PanelLeftClose className="w-[18px] h-[18px]" />
          </button>
        </div>

        {/* Scrollable Navigation */}
        <OverlayScrollbarsComponent element="nav" defer className="flex-1 px-3 py-4 space-y-0.5">

          <div className="px-3 pb-2">
            <span className="text-[11px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">Nghiệp vụ chính</span>
          </div>

          {navigation.map((item) => {
            const isActive =
              (item.href === '/admin' && location.pathname === '/admin') ||
              (item.href !== '/admin' && (location.pathname === item.href || location.pathname.startsWith(`${item.href}/`)));
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] transition-all duration-150 ${isActive
                    ? 'bg-[#5865f2]/10 dark:bg-[#5865f2]/10 text-[#5865f2] dark:text-[#5865f2] font-medium'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#2a2d36] hover:text-gray-900 dark:hover:text-white font-medium'
                  }`}
              >
                <item.icon strokeWidth={2} className={`w-[18px] h-[18px] flex-shrink-0 ${isActive ? 'text-[#5865f2]' : 'text-gray-400 dark:text-gray-500'}`} />
                {item.name}
                {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#5865f2]"></div>}
              </Link>
            );
          })}

          <div className="px-3 pb-2 pt-5">
            <span className="text-[11px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">Hệ thống</span>
          </div>

          {systemNav.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] transition-all duration-150 ${isActive
                    ? 'bg-[#5865f2]/10 dark:bg-[#5865f2]/10 text-[#5865f2] dark:text-[#5865f2] font-medium'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#2a2d36] hover:text-gray-900 dark:hover:text-white font-medium'
                  }`}
              >
                <item.icon strokeWidth={2} className={`w-[18px] h-[18px] flex-shrink-0 ${isActive ? 'text-[#5865f2]' : 'text-gray-400 dark:text-gray-500'}`} />
                {item.name}
              </Link>
            );
          })}
        </OverlayScrollbarsComponent>

        {/* User Profile */}
        <div className="px-4 py-4 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#5865f2]/10 border border-[#5865f2]/30 flex items-center justify-center font-bold text-[#5865f2] text-sm">
                {user?.username?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[13px] font-medium text-gray-900 dark:text-white truncate">
                  {user ? user.username : 'Loading...'}
                </span>
                <span className="text-[11px] text-gray-500 truncate">Administrator</span>
              </div>
            </div>
            <button
              onClick={() => logout()}
              className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors cursor-pointer"
              title="Đăng xuất"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#fbfbfa] dark:bg-[#0b0c10]">
        {/* Header */}
        <header className="h-[72px] flex items-center justify-between px-8 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#14151a] transition-colors duration-300">
          <h1 className="text-[20px] font-medium text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
            {currentPage && <currentPage.icon strokeWidth={2} className="w-5 h-5 text-[#5865f2]" />}
            {currentPage?.name || 'Tổng quan'}
          </h1>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm nhanh..."
                className="pl-9 pr-4 py-2 w-[220px] rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#1a1b23] text-sm focus:outline-none focus:ring-[3px] focus:ring-[#5865f2]/20 focus:border-[#5865f2]/40 transition-all text-gray-900 dark:text-white placeholder:text-gray-400"
              />
            </div>

            <button className="w-9 h-9 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors relative cursor-pointer">
              <Bell className="w-[18px] h-[18px]" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            <div className="w-px h-6 bg-gray-200 dark:bg-gray-800"></div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-full bg-white/50 dark:bg-black/30 border border-gray-200 dark:border-white/10 hover:bg-white dark:hover:bg-black/50 transition-colors backdrop-blur-md cursor-pointer flex items-center justify-center"
              title={mounted ? (theme === 'light' ? 'Chuyển sang chế độ tối' : 'Chuyển sang chế độ sáng') : 'Chuyển chế độ'}
            >
              {mounted ? (
                theme === 'light' ? (
                  <Sun className="w-[18px] h-[18px] text-amber-500" />
                ) : (
                  <Moon className="w-[18px] h-[18px] text-blue-300" />
                )
              ) : (
                <div className="w-[18px] h-[18px]" />
              )}
            </button>
          </div>
        </header>

        {/* Main Area */}
        <div className="flex-1 flex flex-col relative overflow-y-auto bg-[#fbfbfa] dark:bg-[#0b0c10]">
          <div className="h-full flex flex-col p-4 md:p-6 lg:p-8 w-full min-h-min">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
