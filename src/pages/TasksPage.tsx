import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Box,
  Button,
  Alert,
  Snackbar,
  Fab,
} from '@mui/material';
import {
  Add as AddIcon,
  FilterList,
  ExpandMore,
  ExpandLess,
} from '@mui/icons-material';
import { useTaskActions } from '../hooks';
import { useAuth } from '../context/AuthContext';
import { Task, CreateTaskData, UpdateTaskData, TaskFilters as TaskFiltersType } from '../types';
import PageHeader from '../components/PageHeader';
import TaskFilters from '../components/TaskFilters';
import TaskGrid from '../components/TaskGrid';
import TaskForm from '../components/TaskForm';

const TasksPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [open, setOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<TaskFiltersType>({});

  const { 
    tasks, 
    users, 
    categories, 
    createTask, 
    updateTask, 
    deleteTask, 
    toggleTaskComplete, 
    fetchTasks, 
    fetchUsers, 
    fetchCategories 
  } = useTaskActions();
  const { state: authState } = useAuth();

  useEffect(() => {
    fetchCategories().then((result) => {
      console.log('fetchCategories result:', result);
      if (!result.success) {
        console.error('Failed to fetch categories:', result.error);
      }
    });
    fetchUsers(); 
    fetchTasks();
  }, []);

  useEffect(() => {
    console.log('Current categories state:', categories);
    console.log('Current tasks state (first 2):', tasks.slice(0, 2));
    if (categories.length > 0 && tasks.length > 0) {
      console.log('Categories loaded:', categories);
      console.log('Sample task with categories:', tasks.find(t => t.categories.length > 0));
    }
  }, [categories, tasks]);

  useEffect(() => {
    const initialFilters: TaskFiltersType = {};
    
    const completed = searchParams.get('completed');
    if (completed !== null) {
      initialFilters.completed = completed === 'true';
    }
    
    const priority = searchParams.get('priority');
    if (priority) {
      initialFilters.priority = priority as any;
    }
    
    const category = searchParams.get('category');
    if (category) {
      initialFilters.category = category;
    }
    
    const assignedTo = searchParams.get('assignedTo');
    if (assignedTo) {
      initialFilters.assignedTo = assignedTo;
    }

    if (Object.keys(initialFilters).length > 0) {
      setFilters(initialFilters);
      setShowFilters(true);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchTasks(filters);
  }, [filters]);

  const handleFilterChange = (filterName: keyof TaskFiltersType, value: any) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value || undefined,
    }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  const handleOpen = () => {
    setOpen(true);
    setEditingTask(null);
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingTask(null);
  };

  const handleSubmit = async (formData: CreateTaskData | UpdateTaskData) => {
    try {
      let result;
      if (editingTask) {
        result = await updateTask(editingTask.id, formData as UpdateTaskData);
      } else {
        result = await createTask(formData as CreateTaskData);
      }

      if (result.success) {
        handleClose();
        showSnackbar(
          editingTask ? 'Task updated successfully' : 'Task created successfully',
          'success'
        );
      } else {
        showSnackbar(result.error || 'Operation failed', 'error');
      }
    } catch (error: any) {
      
      if (error.response?.status === 403) {
        showSnackbar('You do not have permission to perform this action', 'error');
      } else if (error.response?.status === 401) {
        
        console.log('Unauthorized - redirecting to login');
      } else {
        showSnackbar('An error occurred while saving the task', 'error');
      }
    }
  };

  const handleDelete = async (taskId: string) => {
    try {
      const result = await deleteTask(taskId);
      if (result.success) {
        setSnackbar({ open: true, message: 'Task deleted successfully', severity: 'success' });
      } else {
        setSnackbar({ open: true, message: result.error || 'Delete failed', severity: 'error' });
      }
    } catch (error: any) {
      
      if (error.response?.status === 403) {
        setSnackbar({ 
          open: true, 
          message: 'You do not have permission to delete this task', 
          severity: 'error' 
        });
      } else if (error.response?.status === 401) {
        
        console.log('Unauthorized - redirecting to login');
      } else {
        setSnackbar({ 
          open: true, 
          message: 'An error occurred while deleting the task', 
          severity: 'error' 
        });
      }
    }
  };

  const handleToggleComplete = async (taskId: string) => {
    try {
      const result = await toggleTaskComplete(taskId);
      if (result.success) {
        setSnackbar({ open: true, message: 'Task status updated', severity: 'success' });
      } else {
        setSnackbar({ open: true, message: result.error || 'Update failed', severity: 'error' });
      }
    } catch (error: any) {
      
      if (error.response?.status === 403) {
        setSnackbar({ 
          open: true, 
          message: 'You do not have permission to modify this task', 
          severity: 'error' 
        });
      } else if (error.response?.status === 401) {
        
        console.log('Unauthorized - redirecting to login');
      } else {
        setSnackbar({ 
          open: true, 
          message: 'An error occurred while updating the task', 
          severity: 'error' 
        });
      }
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return '#f44336';
      case 'high': return '#ff9800';
      case 'medium': return '#2196f3';
      case 'low': return '#4caf50';
      default: return '#757575';
    }
  };

  const formatDeadline = (deadline: string) => {
    if (!deadline) return '';
    const date = new Date(deadline);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return `Overdue by ${Math.abs(diffDays)} days`;
    } else if (diffDays === 0) {
      return 'Due today';
    } else if (diffDays === 1) {
      return 'Due tomorrow';
    } else {
      return `Due in ${diffDays} days`;
    }
  };

  const canEdit = (task: Task) => { 
    console.log('Checking canEdit for task:', task, 'with user:', authState.user, 'id:', authState.user?.id);
    
    
    if (!authState.isAuthenticated || !authState.user) {
      return false;
    }
    
    
    if (authState.user.role === 'admin') {
      return true;
    }
    
    
    return task.assignedTo === authState.user.id;
  };

  const canDelete = (task: Task) => {
    
    if (!authState.isAuthenticated || !authState.user) {
      return false;
    }
    
    
    if (authState.user.role === 'admin') {
      return true;
    }
    
    
    return task.assignedTo === authState.user.id;
  };

  const activeFiltersCount = Object.values(filters).filter(value => value !== undefined && value !== '').length;
  const stats = [
    { label: 'Total Tasks', value: tasks.length },
    { label: 'Completed', value: tasks.filter((t: Task) => t.completed).length, color: 'success' as const },
    { label: 'Pending', value: tasks.filter((t: Task) => !t.completed).length, color: 'warning' as const },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <PageHeader
        title="Tasks"
        subtitle="Manage and track your tasks efficiently"
        stats={stats}
        createButtonLabel="Create Task"
        onCreateClick={handleOpen}
      />

      <TaskFilters
        filters={filters}
        users={users}
        categories={categories}
        onFilterChange={handleFilterChange}
        onClearFilters={clearFilters}
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters(!showFilters)}
      />

      <TaskGrid
        tasks={tasks}
        users={users}
        categories={categories}
        activeFiltersCount={activeFiltersCount}
        canEdit={canEdit}
        canDelete={canDelete}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleComplete={handleToggleComplete}
        onCreateNew={handleOpen}
      />

      <Fab
        color="primary"
        aria-label="add"
        onClick={handleOpen}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          borderRadius: 2,
        }}
      >
        <AddIcon />
      </Fab>

      <TaskForm
        open={open}
        editingTask={editingTask}
        users={users}
        categories={categories}
        onClose={handleClose}
        onSubmit={handleSubmit}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default TasksPage;