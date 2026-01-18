export interface User {
  id: string;
  username: string;
  role: 'admin' | 'user';
  token?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  completed: boolean;
  categories: string[];
  priority: 'low' | 'medium' | 'high' | 'critical';
  deadline: string;
  createdAt: string;
  updatedAt: string;
  lastUpdated: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface TaskStats {
  total: number;
  completed: number;
  pending: number;
  overdue?: number;
  byPriority: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
  byCategory: { [key: string]: number };
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface TaskState {
  tasks: Task[];
  users: User[];
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  stats: TaskStats;
}

export interface AppState {
  auth: AuthState;
  tasks: TaskState;
  theme: 'light' | 'dark';
}

export type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' };

export type TaskAction =
  | { type: 'FETCH_TASKS_START' }
  | { type: 'FETCH_TASKS_SUCCESS'; payload: Task[] }
  | { type: 'FETCH_TASKS_FAILURE'; payload: string }
  | { type: 'FETCH_USERS_SUCCESS'; payload: User[] }
  | { type: 'FETCH_CATEGORIES_SUCCESS'; payload: Category[] }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'TOGGLE_TASK'; payload: string }
  | { type: 'ADD_CATEGORY'; payload: Category }
  | { type: 'UPDATE_CATEGORY'; payload: Category }
  | { type: 'DELETE_CATEGORY'; payload: string };

export type ThemeAction =
  | { type: 'TOGGLE_THEME' }
  | { type: 'SET_THEME'; payload: 'light' | 'dark' };

export interface CreateTaskData {
  title: string;
  description: string;
  assignedTo: string;
  categories: string[];
  priority: 'low' | 'medium' | 'high' | 'critical';
  deadline: string;
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  assignedTo?: string;
  categories?: string[];
  priority?: 'low' | 'medium' | 'high' | 'critical';
  deadline?: string;
  completed?: boolean;
}

export interface CreateCategoryData {
  name: string;
}

export interface UpdateCategoryData {
  name?: string;
}

export interface TaskFilters {
  assignedTo?: string;
  category?: string;
  priority?: 'low' | 'medium' | 'high' | 'critical';
  completed?: boolean;
  page?: number;
  limit?: number;
}

export interface LoginData {
  username: string;
  password: string;
}

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}