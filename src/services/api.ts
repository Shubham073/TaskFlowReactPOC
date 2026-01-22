import axios, { AxiosResponse, AxiosError } from 'axios';
import { Task, User, Category, CreateTaskData, UpdateTaskData, CreateCategoryData, UpdateCategoryData, LoginData, TaskFilters, ApiResponse } from '../types';
import { handleUnauthorized, handleSessionExpired, clearAuthData } from './authService';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error.response?.status;
    const responseData = error.response?.data as any;
    const message = responseData?.message || error.message || 'An error occurred';

    switch (status) {
      case 401:
        console.warn('Session expired - redirecting to login');
        clearAuthData();
        handleSessionExpired();
        setTimeout(() => {
          window.location.href = '/login';
        }, 100);
        break;
        
      case 403:
        console.warn('Access forbidden:', message);
        handleUnauthorized(message);
        break;
        
      case 404:
        console.warn('Resource not found:', error.config?.url);
        break;
        
      case 500:
        console.error('Server error:', message);
        break;
        
      default:
        console.error('API Error:', message);
    }
    
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: async (credentials: LoginData): Promise<{ user: User; token: string }> => {
    try {
      const response: AxiosResponse<{ token: string; role: string }> = await api.post('/auth/login', credentials);
      
      const user: User = {
        id: '1', 
        username: credentials.username, 
        role: response.data.role as 'admin' | 'user',
      };
      
      return {
        user,
        token: response.data.token
      };
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  },

  logout: async (): Promise<void> => {
    try {
      await api.post('/auth/logout');
      localStorage.removeItem('token');
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Logout failed');
    }
  },
};

export const usersAPI = {
  getUsers: async (username?: string, role?: string): Promise<User[]> => {
    try {
      const params = new URLSearchParams();
      if (username) params.append('username', username);
      if (role) params.append('role', role);

      const response: AxiosResponse<User[]> = await api.get(`/users?${params}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch users');
    }
  },
};

export const tasksAPI = {
  getTasks: async (filters: TaskFilters = {}): Promise<{ tasks: Task[]; total: number }> => {
    try {
      const params = new URLSearchParams();
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());
      if (filters.completed !== undefined) params.append('completed', filters.completed.toString());
      if (filters.assignedTo) params.append('assignedTo', filters.assignedTo);
      if (filters.category) params.append('category', filters.category);
      if (filters.priority) params.append('priority', filters.priority);

      const response: AxiosResponse<{ tasks: Task[]; total: number; page: number; limit: number }> = await api.get(`/tasks?${params}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch tasks');
    }
  },

  createTask: async (taskData: CreateTaskData): Promise<Task> => {
    try {
      const response: AxiosResponse<Task> = await api.post('/tasks', taskData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create task');
    }
  },

  updateTask: async (id: string, taskData: UpdateTaskData): Promise<Task> => {
    try {
      const response: AxiosResponse<Task> = await api.put(`/tasks/${id}`, taskData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update task');
    }
  },

  deleteTask: async (id: string): Promise<void> => {
    try {
      await api.delete(`/tasks/${id}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete task');
    }
  },

  toggleTaskComplete: async (id: string): Promise<Task> => {
    try {
      const response: AxiosResponse<Task> = await api.patch(`/tasks/${id}/complete`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to toggle task completion');
    }
  },
};

export const categoriesAPI = {
  getCategories: async (): Promise<Category[]> => {
    try {
      const response: AxiosResponse<Category[]> = await api.get('/categories');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch categories');
    }
  },

  createCategory: async (categoryData: CreateCategoryData): Promise<Category> => {
    try {
      const response: AxiosResponse<Category> = await api.post('/categories', categoryData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create category');
    }
  },

  updateCategory: async (id: string, categoryData: UpdateCategoryData): Promise<Category> => {
    try {
      const response: AxiosResponse<Category> = await api.put(`/categories/${id}`, categoryData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update category');
    }
  },

  deleteCategory: async (id: string): Promise<void> => {
    try {
      await api.delete(`/categories/${id}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete category');
    }
  },
};

export const taskService = tasksAPI;
export const authService = authAPI;
export const userService = usersAPI;
export const categoryService = categoriesAPI;