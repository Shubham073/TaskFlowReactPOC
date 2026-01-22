import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { TaskState, TaskAction, Task, TaskStats } from '../types';


const initialState: TaskState = {
  tasks: [],
  users: [],
  categories: [],
  isLoading: false,
  error: null,
  stats: {
    total: 0,
    completed: 0,
    pending: 0,
    byPriority: {
      low: 0,
      medium: 0,
      high: 0,
      critical: 0,
    },
    byCategory: {},
  },
};


const calculateStats = (tasks: Task[]): TaskStats => {
  const total = tasks.length;
  const completed = tasks.filter(task => task.completed).length;
  const pending = total - completed;
  
  const byPriority = {
    low: tasks.filter(task => task.priority === 'low').length,
    medium: tasks.filter(task => task.priority === 'medium').length,
    high: tasks.filter(task => task.priority === 'high').length,
    critical: tasks.filter(task => task.priority === 'critical').length,
  };

  const byCategory: { [key: string]: number } = {};
  tasks.forEach(task => {
    task.categories.forEach(category => {
      byCategory[category] = (byCategory[category] || 0) + 1;
    });
  });
  
  return {
    total,
    completed,
    pending,
    byPriority,
    byCategory,
  };
};


const taskReducer = (state: TaskState, action: TaskAction): TaskState => {
  switch (action.type) {
    case 'FETCH_TASKS_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'FETCH_TASKS_SUCCESS':
      return {
        ...state,
        tasks: action.payload,
        isLoading: false,
        error: null,
        stats: calculateStats(action.payload),
      };
    case 'FETCH_USERS_SUCCESS':
      return {
        ...state,
        users: action.payload,
      };
    case 'FETCH_CATEGORIES_SUCCESS':
      return {
        ...state,
        categories: action.payload,
      };
    case 'FETCH_TASKS_FAILURE':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    case 'ADD_TASK':
      const newTasksList = [...state.tasks, action.payload];
      return {
        ...state,
        tasks: newTasksList,
        stats: calculateStats(newTasksList),
      };
    case 'UPDATE_TASK':
      const updatedTasks = state.tasks.map(task =>
        task.id === action.payload.id ? action.payload : task
      );
      return {
        ...state,
        tasks: updatedTasks,
        stats: calculateStats(updatedTasks),
      };
    case 'DELETE_TASK':
      const filteredTasks = state.tasks.filter(task => task.id !== action.payload);
      return {
        ...state,
        tasks: filteredTasks,
        stats: calculateStats(filteredTasks),
      };
    case 'TOGGLE_TASK':
      const toggledTasks = state.tasks.map(task =>
        task.id === action.payload
          ? { ...task, completed: !task.completed, updatedAt: new Date().toISOString(), lastUpdated: new Date().toISOString() }
          : task
      );
      return {
        ...state,
        tasks: toggledTasks,
        stats: calculateStats(toggledTasks),
      };
    case 'ADD_CATEGORY':
      return {
        ...state,
        categories: [...state.categories, action.payload],
      };
    case 'UPDATE_CATEGORY':
      return {
        ...state,
        categories: state.categories.map(category =>
          category.id === action.payload.id ? action.payload : category
        ),
      };
    case 'DELETE_CATEGORY':
      return {
        ...state,
        categories: state.categories.filter(category => category.id !== action.payload),
      };
    default:
      return state;
  }
};


interface TaskContextType {
  state: TaskState;
  dispatch: React.Dispatch<TaskAction>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);


interface TaskProviderProps {
  children: ReactNode;
}

export const TaskProvider: React.FC<TaskProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(taskReducer, initialState);

  return (
    <TaskContext.Provider value={{ state, dispatch }}>
      {children}
    </TaskContext.Provider>
  );
};


export const useTask = (): TaskContextType => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
};