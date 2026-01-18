import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTask } from '../context/TaskContext';
import { authService, taskService, userService, categoryService } from '../services/api';
import { LoginData, CreateTaskData, UpdateTaskData, CreateCategoryData, UpdateCategoryData, Task, TaskFilters } from '../types';

// Custom hook for authentication
export const useAuthActions = () => {
  const { state, dispatch, login, logout } = useAuth();

  const handleLogin = async (credentials: LoginData) => {
    try {
      dispatch({ type: 'LOGIN_START' });
      const { user, token } = await authService.login(credentials);
      login(user, token);
      return { success: true };
    } catch (error: any) {
      dispatch({ type: 'LOGIN_FAILURE', payload: error.message });
      return { success: false, error: error.message };
    }
  };

  const handleLogout = async () => {
    try {
      if (authService.logout) {
        await authService.logout();
      }
      logout();
    } catch (error) {
      // Even if logout fails on server, we still logout locally
      logout();
    }
  };

  return {
    ...state,
    login: handleLogin,
    logout: handleLogout,
  };
};

// Custom hook for task operations
export const useTaskActions = () => {
  const { state, dispatch } = useTask();
  const { state: authState } = useAuth();

  const fetchTasks = async (filters?: TaskFilters) => {
    try {
      dispatch({ type: 'FETCH_TASKS_START' });
      const { tasks } = await taskService.getTasks(filters);
      dispatch({ type: 'FETCH_TASKS_SUCCESS', payload: tasks });
      return { success: true };
    } catch (error: any) {
      dispatch({ type: 'FETCH_TASKS_FAILURE', payload: error.message });
      return { success: false, error: error.message };
    }
  };

  const fetchUsers = async () => {
    try {
      const users = await userService.getUsers();
      dispatch({ type: 'FETCH_USERS_SUCCESS', payload: users });
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const fetchCategories = async () => {
    try {
      const categories = await categoryService.getCategories();
      dispatch({ type: 'FETCH_CATEGORIES_SUCCESS', payload: categories });
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const createTask = async (taskData: CreateTaskData) => {
    try {
      const newTask = await taskService.createTask(taskData);
      dispatch({ type: 'ADD_TASK', payload: newTask });
      return { success: true, task: newTask };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const updateTask = async (id: string, taskData: UpdateTaskData) => {
    try {
      const updatedTask = await taskService.updateTask(id, taskData);
      dispatch({ type: 'UPDATE_TASK', payload: updatedTask });
      return { success: true, task: updatedTask };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await taskService.deleteTask(id);
      dispatch({ type: 'DELETE_TASK', payload: id });
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const toggleTaskComplete = async (id: string) => {
    try {
      const updatedTask = await taskService.toggleTaskComplete(id);
      dispatch({ type: 'UPDATE_TASK', payload: updatedTask });
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const createCategory = async (categoryData: CreateCategoryData) => {
    try {
      const newCategory = await categoryService.createCategory(categoryData);
      dispatch({ type: 'ADD_CATEGORY', payload: newCategory });
      return { success: true, category: newCategory };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const updateCategory = async (id: string, categoryData: UpdateCategoryData) => {
    try {
      const updatedCategory = await categoryService.updateCategory(id, categoryData);
      dispatch({ type: 'UPDATE_CATEGORY', payload: updatedCategory });
      return { success: true, category: updatedCategory };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      await categoryService.deleteCategory(id);
      dispatch({ type: 'DELETE_CATEGORY', payload: id });
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  return {
    ...state,
    fetchTasks,
    fetchUsers,
    fetchCategories,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskComplete,
    createCategory,
    updateCategory,
    deleteCategory,
  };
};

// Custom hook for local storage
export const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue] as const;
};

// Custom hook for debounced values
export const useDebounce = <T>(value: T, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Custom hook for previous value
export const usePrevious = <T>(value: T): T | undefined => {
  const ref = useState<T>();
  useEffect(() => {
    ref[1](value);
  });
  return ref[0];
};

// Custom hook for media query
export const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    media.addListener(listener);
    return () => media.removeListener(listener);
  }, [matches, query]);

  return matches;
};