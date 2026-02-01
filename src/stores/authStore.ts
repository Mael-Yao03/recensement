import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import { AuthUser, LoginResponse } from '../services/adminService';

interface AuthState {
  // État
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  setAuth: (response: LoginResponse) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  updateUser: (user: AuthUser) => void;

  // Vérifications des permissions
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  isSuperAdmin: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        // État initial
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,

        // Actions
        setAuth: (response: LoginResponse) => {
          set({
            user: response.user,
            token: response.access_token,
            isAuthenticated: true,
            isLoading: false,
          });
          // Stocker le token dans localStorage pour les requêtes API
          localStorage.setItem('auth_token', response.access_token);
        },

        logout: () => {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          });
          localStorage.removeItem('auth_token');
        },

        setLoading: (loading: boolean) => {
          set({ isLoading: loading });
        },

        updateUser: (user: AuthUser) => {
          set({ user });
        },

        // Vérifications des permissions
        hasPermission: (permission: string) => {
          const { user } = get();
          if (!user) return false;
          if (user.role.name === 'super_admin') return true;
          return user.role.permissions.includes(permission);
        },

        hasAnyPermission: (permissions: string[]) => {
          const { user } = get();
          if (!user) return false;
          if (user.role.name === 'super_admin') return true;
          return permissions.some((p) => user.role.permissions.includes(p));
        },

        isSuperAdmin: () => {
          const { user } = get();
          return user?.role.name === 'super_admin';
        },
      }),
      {
        name: 'auth-storage',
        partialize: (state) => ({
          user: state.user,
          token: state.token,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    ),
    { name: 'AuthStore' }
  )
);
