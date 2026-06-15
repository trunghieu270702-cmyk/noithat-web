import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NoiThat – Kiến Trúc & Nội Thất Cao Cấp",
  description: "Hệ sinh thái thiết kế kiến trúc và nội thất cao cấp.",
  icons: {
    icon: "/images/logo-main.png",
  },
};

/**
 * Root layout: chỉ cung cấp <html><body> shell.
 * – Trang user (/) dùng layout trong app/(user)/layout.tsx
 * – Trang admin (/admin) dùng layout trong app/admin/layout.tsx (hoặc app/(admin)/layout.tsx)
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" integrity="sha512-1ycn6IcaQQ40/MKBW2W4Rhis/DbILU74C1vSrLJxCq57o941Ym01SwNsOMqvEBFlcgUa6xLiPY/NS5R+E6ztJQ==" crossOrigin="anonymous" referrerPolicy="no-referrer" />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}

