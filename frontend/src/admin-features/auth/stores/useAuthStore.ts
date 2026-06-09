import { create } from 'zustand';
import Cookies from 'js-cookie';

interface User {
  id: number;
  username: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
}

const getInitialToken = () => Cookies.get('token') || null;

export const useAuthStore = create<AuthState>((set) => ({
  user: null, // Ideally decode from JWT or fetch on mount if token exists
  token: getInitialToken(),
  isAuthenticated: !!getInitialToken(),
  login: (user, token) => {
    Cookies.set('token', token, { expires: 1 }); // 1 day
    set({ user, token, isAuthenticated: true });
  },
  logout: () => {
    Cookies.remove('token');
    set({ user: null, token: null, isAuthenticated: false });
  },
}));
