"use client";
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import apiClient from '@/admin-lib/apiClient';
import { useAuthStore } from '@/admin-features/auth/stores/useAuthStore';
import { Card, CardContent } from '@/admin-components/ui/card';
import { Input } from '@/admin-components/ui/input';
import { Button } from '@/admin-components/ui/button';
import { Lock, User, AlertTriangle, Sun, Moon } from 'lucide-react';
import { useTheme } from '@/admin-components/ThemeProvider';

const loginSchema = z.object({
  username: z.string().min(1, 'Vui lòng nhập tài khoản'),
  password: z.string().min(1, 'Vui lòng nhập mật khẩu'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    if (token) {
      router.push('/admin');
    }
  }, [token, router]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setIsLoading(true);
      setError('');
      const response = await apiClient.post(`/api/v1/auth/login`, data);
      login(response.data.user, response.data.accessToken);
      router.push('/admin');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-[#09090b] transition-colors duration-300 relative overflow-hidden">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-[#5865f2]/20 dark:bg-[#5865f2]/10 blur-[120px]" />
        <div className="absolute top-[60%] -right-[10%] w-[40%] h-[50%] rounded-full bg-emerald-500/20 dark:bg-emerald-500/10 blur-[120px]" />
      </div>

      {/* Theme Toggle Button */}
      <div className="absolute top-6 right-6 z-20">
        <button
          onClick={toggleTheme}
          title={mounted ? (theme === 'light' ? 'Chuyển sang chế độ tối' : 'Chuyển sang chế độ sáng') : 'Chuyển chế độ'}
          className="p-2 rounded-full bg-white/50 dark:bg-black/30 border border-gray-200 dark:border-white/10 hover:bg-white dark:hover:bg-black/50 text-gray-600 dark:text-gray-300 transition-colors backdrop-blur-md cursor-pointer"
        >
          {mounted ? (
            theme === 'light' ? (
              <Sun className="w-5 h-5 text-amber-500" />
            ) : (
              <Moon className="w-5 h-5 text-blue-300" />
            )
          ) : (
            <div className="w-5 h-5" />
          )}
        </button>
      </div>

      <div className="w-full max-w-md animate-in fade-in zoom-in-95 duration-700 relative z-10">
        
        {/* Minimalist Card */}
        <Card className="border border-white/60 dark:border-white/10 bg-white/70 dark:bg-[#181b22]/70 backdrop-blur-xl text-gray-900 dark:text-gray-100 rounded-xl shadow-none overflow-hidden">
          <CardContent className="p-8">
            <div className="flex flex-col items-center justify-center mb-8">
              <div className="w-12 h-12 bg-white dark:bg-[#181b22] border border-gray-100 dark:border-gray-800 rounded-xl flex items-center justify-center mb-4">
                <Lock className="w-6 h-6 text-[#5865f2]" />
              </div>
              <h2 className="text-2xl font-medium tracking-tight text-gray-900 dark:text-white">
                ARCVIET LIVING <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ce9e51] to-[#e4c27a]">NEXUS</span>
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 uppercase tracking-widest font-medium">Login to Dashboard</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              
              {/* Username field */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-widest ml-1">Tài khoản</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500 transition-colors group-focus-within:text-[#5865f2]" />
                  <Input
                    {...register('username')}
                    placeholder="Nhập tên đăng nhập"
                    className="pl-11 h-11 bg-white/50 dark:bg-black/20 border-gray-200/60 dark:border-white/10 text-sm rounded-xl focus:border-[#5865f2] focus:ring-1 focus:ring-[#5865f2]/20 placeholder:text-gray-400 dark:placeholder:text-gray-600 text-gray-900 dark:text-gray-100 transition-all hover:bg-white/80 dark:hover:bg-black/30 shadow-none"
                  />
                </div>
                {errors.username && <p className="text-xs text-red-500 dark:text-red-400 font-normal ml-1">{errors.username.message}</p>}
              </div>

              {/* Password field */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-widest ml-1">Mật khẩu</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500 transition-colors group-focus-within:text-[#5865f2]" />
                  <Input
                    {...register('password')}
                    type="password"
                    placeholder="Nhập mật khẩu"
                    className="pl-11 h-11 bg-white/50 dark:bg-black/20 border-gray-200/60 dark:border-white/10 text-sm rounded-xl focus:border-[#5865f2] focus:ring-1 focus:ring-[#5865f2]/20 placeholder:text-gray-400 dark:placeholder:text-gray-600 text-gray-900 dark:text-gray-100 transition-all hover:bg-white/80 dark:hover:bg-black/30 shadow-none"
                  />
                </div>
                {errors.password && <p className="text-xs text-red-500 dark:text-red-400 font-normal ml-1">{errors.password.message}</p>}
              </div>

              {error && (
                <div className="text-sm text-red-600 dark:text-red-400 p-3 bg-red-50/80 dark:bg-red-500/10 rounded-xl border border-red-100 dark:border-red-500/20 flex items-center gap-2 backdrop-blur-md">
                  <AlertTriangle className="w-5 h-5 shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full h-11 bg-gradient-to-r from-[#5865f2] to-indigo-600 hover:from-indigo-600 hover:to-[#5865f2] text-white font-medium rounded-xl transition-all border-0 mt-4 text-sm shadow-none" 
                disabled={isLoading}
              >
                {isLoading ? 'Đang xác thực...' : 'Đăng nhập'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
