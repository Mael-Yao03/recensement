import api, { ApiResponse } from './api';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface UserRole {
  id: string;
  name: string;
  permissions: string[];
}

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: UserRole;
}

export interface LoginResponse {
  access_token: string;
  user: AuthUser;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
}

export interface Role {
  id: string;
  name: string;
  description?: string;
  isSystemRole: boolean;
  isActive: boolean;
  permissions: Permission[];
  createdAt: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  isActive: boolean;
  lastLoginAt?: string;
  role: Role;
  createdAt: string;
}

// Auth endpoints
export const authService = {
  login: async (credentials: LoginCredentials): Promise<ApiResponse<LoginResponse>> => {
    return api.post('/api/auth/login', credentials);
  },

  getProfile: async (): Promise<ApiResponse<AuthUser>> => {
    return api.get('/api/auth/profile');
  },

  validateToken: async (): Promise<ApiResponse<{ valid: boolean }>> => {
    return api.post('/api/auth/validate');
  },
};

// Users endpoints
export const userService = {
  getAll: async (): Promise<ApiResponse<User[]>> => {
    return api.get('/api/users');
  },

  getById: async (id: string): Promise<ApiResponse<User>> => {
    return api.get(`/api/users/${id}`);
  },

  create: async (data: {
    username: string;
    email: string;
    password: string;
    fullName: string;
    roleId: string;
  }): Promise<ApiResponse<User>> => {
    return api.post('/api/users', data);
  },

  update: async (id: string, data: Partial<User & { password?: string; roleId?: string }>): Promise<ApiResponse<User>> => {
    return api.put(`/api/users/${id}`, data);
  },

  delete: async (id: string): Promise<ApiResponse<void>> => {
    return api.delete(`/api/users/${id}`);
  },

  toggleActive: async (id: string): Promise<ApiResponse<User>> => {
    return api.put(`/api/users/${id}/toggle-active`);
  },

  changePassword: async (data: {
    currentPassword: string;
    newPassword: string;
  }): Promise<ApiResponse<void>> => {
    return api.put('/api/users/change-password/me', data);
  },
};

// Roles endpoints
export const roleService = {
  getAll: async (): Promise<ApiResponse<Role[]>> => {
    return api.get('/api/roles');
  },

  getById: async (id: string): Promise<ApiResponse<Role>> => {
    return api.get(`/api/roles/${id}`);
  },

  create: async (data: {
    name: string;
    description?: string;
    permissionIds?: string[];
  }): Promise<ApiResponse<Role>> => {
    return api.post('/api/roles', data);
  },

  update: async (id: string, data: {
    name?: string;
    description?: string;
    isActive?: boolean;
    permissionIds?: string[];
  }): Promise<ApiResponse<Role>> => {
    return api.put(`/api/roles/${id}`, data);
  },

  delete: async (id: string): Promise<ApiResponse<void>> => {
    return api.delete(`/api/roles/${id}`);
  },

  getAllPermissions: async (): Promise<ApiResponse<Permission[]>> => {
    return api.get('/api/roles/permissions');
  },

  getPermissionsByCategory: async (): Promise<ApiResponse<Record<string, Permission[]>>> => {
    return api.get('/api/roles/permissions/by-category');
  },
};

// Dashboard endpoints
export interface DashboardStats {
  totalMembers: number;
  totalChildren: number;
  totalUsers: number;
  membersByGender: { homme: number; femme: number };
  childrenByGender: { homme: number; femme: number };
  membersByMaritalStatus: Record<string, number>;
  membersByAge: Record<string, number>;
  newMembersThisMonth: number;
  newChildrenThisMonth: number;
  membersByNationality: Record<string, number>;
  membersByResidence: Record<string, number>;
  membersBySatisfaction: Record<string, number>;
  recentRegistrations: {
    id: string;
    nomPrenoms: string;
    type: string;
    createdAt: string;
  }[];
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  pages: number;
}

export const dashboardService = {
  getStats: async (): Promise<ApiResponse<DashboardStats>> => {
    return api.get('/api/dashboard/stats');
  },

  getMembers: async (page = 1, limit = 10, search?: string): Promise<ApiResponse<PaginatedResponse<any>>> => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (search) params.append('search', search);
    return api.get(`/api/dashboard/members?${params.toString()}`);
  },

  getChildren: async (page = 1, limit = 10, search?: string): Promise<ApiResponse<PaginatedResponse<any>>> => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (search) params.append('search', search);
    return api.get(`/api/dashboard/children?${params.toString()}`);
  },
};
