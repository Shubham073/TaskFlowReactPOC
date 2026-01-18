import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Fab,
  Chip,
  IconButton,
  MenuItem,
  Alert,
  Snackbar,
  FormControl,
  InputLabel,
  Select,
  Autocomplete,
  Paper,
  Collapse,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle,
  Schedule,
  FilterList,
  ExpandMore,
  ExpandLess,
  PriorityHigh as PriorityIcon,
  Category as CategoryIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useTaskActions } from '../hooks';
import { useAuth } from '../context/AuthContext';
import { Task, CreateTaskData, UpdateTaskData, TaskFilters } from '../types';

const TasksPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [open, setOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<TaskFilters>({});
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignedTo: '',
    categories: [] as string[],
    priority: 'medium' as 'low' | 'medium' | 'high' | 'critical',
    deadline: '',
  });

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

  // Debug effect to check data
  useEffect(() => {
    console.log('Current categories state:', categories);
    console.log('Current tasks state (first 2):', tasks.slice(0, 2));
    if (categories.length > 0 && tasks.length > 0) {
      console.log('Categories loaded:', categories);
      console.log('Sample task with categories:', tasks.find(t => t.categories.length > 0));
    }
  }, [categories, tasks]);

  useEffect(() => {
    const initialFilters: TaskFilters = {};
    
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

  const handleFilterChange = (filterName: keyof TaskFilters, value: any) => {
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
    setFormData({ 
      title: '', 
      description: '', 
      assignedTo: '', 
      categories: [], 
      priority: 'medium',
      deadline: '' 
    });
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description,
      assignedTo: task.assignedTo,
      categories: task.categories,
      priority: task.priority,
      deadline: task.deadline,
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingTask(null);
    setFormData({ 
      title: '', 
      description: '', 
      assignedTo: '', 
      categories: [], 
      priority: 'medium',
      deadline: '' 
    });
  };

  const handleSubmit = async () => {
    if (!formData.title.trim() || !formData.description.trim() || !formData.assignedTo.trim()) {
      showSnackbar('Please fill in all required fields', 'error');
      return;
    }

    let result;
    if (editingTask) {
      const updateData: UpdateTaskData = {
        title: formData.title,
        description: formData.description,
        assignedTo: formData.assignedTo,
        categories: formData.categories,
        priority: formData.priority,
        deadline: formData.deadline,
      };
      result = await updateTask(editingTask.id, updateData);
    } else {
      const createData: CreateTaskData = {
        title: formData.title,
        description: formData.description,
        assignedTo: formData.assignedTo,
        categories: formData.categories,
        priority: formData.priority,
        deadline: formData.deadline,
      };
      result = await createTask(createData);
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
  };

  const handleDelete = async (taskId: string) => {
    const result = await deleteTask(taskId);
    if (result.success) {
      setSnackbar({ open: true, message: 'Task deleted successfully', severity: 'success' });
    } else {
      setSnackbar({ open: true, message: result.error || 'Delete failed', severity: 'error' });
    }
  };

  const handleToggleComplete = async (taskId: string) => {
    const result = await toggleTaskComplete(taskId);
    if (result.success) {
      setSnackbar({ open: true, message: 'Task status updated', severity: 'success' });
    } else {
      setSnackbar({ open: true, message: result.error || 'Update failed', severity: 'error' });
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
    // return authState.user?.role === 'admin' || task.assignedTo === authState.user?.id;
    return true;
  };

  const canDelete = (task: Task) => {
    // return authState.user?.role === 'admin' || task.assignedTo === authState.user?.id;
    return true;
  };

  const activeFiltersCount = Object.values(filters).filter(value => value !== undefined && value !== '').length;

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Tasks
        </Typography>
        <Button
          variant="outlined"
          startIcon={<FilterList />}
          onClick={() => setShowFilters(!showFilters)}
          sx={{ 
            borderRadius: 2,
            color: activeFiltersCount > 0 ? 'primary.main' : 'text.primary',
            borderColor: activeFiltersCount > 0 ? 'primary.main' : 'divider',
          }}
        >
          Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
          {showFilters ? <ExpandLess /> : <ExpandMore />}
        </Button>
      </Box>

      <Collapse in={showFilters}>
        <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            Filter Tasks
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={filters.completed || ''}
                  label="Status"
                  onChange={(e) => handleFilterChange('completed', e.target.value === '' ? undefined : e.target.value === 'true')}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="false">Incomplete</MenuItem>
                  <MenuItem value="true">Complete</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={filters.priority || ''}
                  label="Priority"
                  onChange={(e) => handleFilterChange('priority', e.target.value)}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="critical">Critical</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="low">Low</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Autocomplete
                options={users}
                getOptionLabel={(option) => option.username}
                value={users.find(user => user.id === filters.assignedTo) || null}
                onChange={(_, value) => handleFilterChange('assignedTo', value?.id)}
                renderInput={(params) => (
                  <TextField {...params} label="Assigned To" />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Autocomplete
                options={categories}
                getOptionLabel={(option) => option.name}
                value={categories.find(cat => cat.id === filters.category) || null}
                onChange={(_, value) => handleFilterChange('category', value?.id)}
                renderInput={(params) => (
                  <TextField {...params} label="Category" />
                )}
              />
            </Grid>
          </Grid>
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={clearFilters} disabled={activeFiltersCount === 0}>
              Clear Filters
            </Button>
          </Box>
        </Paper>
      </Collapse>

      <Grid container spacing={3}>
        {tasks.map((task, index) => (
          <Grid item xs={12} sm={6} md={4} key={task.id}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 2,
                  border: task.completed ? '2px solid' : '1px solid',
                  borderColor: task.completed ? 'success.main' : 'divider',
                  opacity: task.completed ? 0.7 : 1,
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: 4,
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography 
                      variant="h6" 
                      component="h2" 
                      sx={{ 
                        textDecoration: task.completed ? 'line-through' : 'none',
                        wordBreak: 'break-word',
                        flexGrow: 1,
                        mr: 1,
                      }}
                    >
                      {task.title}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 0.5, flexShrink: 0 }}>
                      {canEdit(task) && (
                        <IconButton
                          size="small"
                          onClick={() => handleEdit(task)}
                          sx={{ bgcolor: 'action.hover' }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      )}
                      {canDelete(task) && (
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(task.id)}
                          sx={{ bgcolor: 'action.hover', color: 'error.main' }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      )}
                    </Box>
                  </Box>
                  
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ mb: 2, wordBreak: 'break-word' }}
                  >
                    {task.description}
                  </Typography>

                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <PriorityIcon sx={{ fontSize: 16, mr: 1 }} />
                      <Chip
                        label={task.priority}
                        size="small"
                        sx={{
                          backgroundColor: getPriorityColor(task.priority),
                          color: 'white',
                          fontSize: '0.75rem',
                          textTransform: 'capitalize',
                        }}
                      />
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <PersonIcon sx={{ fontSize: 16, mr: 1 }} />
                      <Typography variant="caption" color="text.secondary">
                        {users.find(user => user.id === task.assignedTo)?.username || 'Unassigned'}
                      </Typography>
                    </Box>

                    {task.categories.length > 0 && (
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <CategoryIcon sx={{ fontSize: 16, mr: 1 }} />
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {categories.length === 0 ? (
                            <Chip
                              label="Categories not loaded"
                              size="small"
                              variant="outlined"
                              color="error"
                              sx={{ fontSize: '0.7rem' }}
                            />
                          ) : (
                            task.categories.map((categoryId) => {
                              const category = categories.find(cat => String(cat.id) === String(categoryId));
                              // Debug logging for category matching
                              if (!category) {
                                console.log('Category not found for ID:', categoryId, 'Type:', typeof categoryId);
                                console.log('Available categories:', categories.map(c => ({ id: c.id, name: c.name, type: typeof c.id })));
                              }
                              return (
                                <Chip
                                  key={categoryId}
                                  label={category?.name || `Unknown (${categoryId})`}
                                  size="small"
                                  variant="outlined"
                                  sx={{ fontSize: '0.7rem' }}
                                />
                              );
                            })
                          )}
                        </Box>
                      </Box>
                    )}

                    {task.deadline && (
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Schedule sx={{ fontSize: 16, mr: 1 }} />
                        <Typography
                          variant="caption"
                          color={formatDeadline(task.deadline).includes('Overdue') ? 'error' : 'text.secondary'}
                        >
                          {formatDeadline(task.deadline)}
                        </Typography>
                      </Box>
                    )}
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Button
                      variant={task.completed ? 'outlined' : 'contained'}
                      size="small"
                      startIcon={<CheckCircle />}
                      onClick={() => handleToggleComplete(task.id)}
                      color={task.completed ? 'inherit' : 'success'}
                      sx={{ borderRadius: 2 }}
                    >
                      {task.completed ? 'Mark Incomplete' : 'Complete'}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {tasks.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No tasks found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {activeFiltersCount > 0 
              ? 'Try adjusting your filters to see more tasks.'
              : 'Create your first task to get started!'
            }
          </Typography>
          {activeFiltersCount === 0 && (
            <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpen}>
              Create Task
            </Button>
          )}
        </Box>
      )}

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

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingTask ? 'Edit Task' : 'Create New Task'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                autoFocus
                label="Task Title"
                fullWidth
                variant="outlined"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Description"
                fullWidth
                multiline
                rows={4}
                variant="outlined"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Autocomplete
                options={users}
                getOptionLabel={(option) => option.username}
                value={users.find(user => user.id === formData.assignedTo) || null}
                onChange={(_, value) => setFormData({ ...formData, assignedTo: value?.id || '' })}
                renderInput={(params) => (
                  <TextField {...params} label="Assigned To" required />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={formData.priority}
                  label="Priority"
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                >
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                  <MenuItem value="critical">Critical</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <Autocomplete
                multiple
                options={categories}
                getOptionLabel={(option) => option.name}
                value={categories.filter(cat => formData.categories.includes(String(cat.id)))}
                onChange={(_, value) => setFormData({ 
                  ...formData, 
                  categories: value.map(v => String(v.id)) 
                })}
                renderInput={(params) => (
                  <TextField {...params} label="Categories" />
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      variant="outlined"
                      label={option.name}
                      {...getTagProps({ index })}
                    />
                  ))
                }
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Deadline"
                type="date"
                fullWidth
                variant="outlined"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingTask ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

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