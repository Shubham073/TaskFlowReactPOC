import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  Chip,
} from '@mui/material';
import { Save as SaveIcon, Cancel as CancelIcon } from '@mui/icons-material';
import { Task, User, Category, CreateTaskData, UpdateTaskData } from '../types';

interface TaskFormProps {
  open: boolean;
  editingTask: Task | null;
  users: User[];
  categories: Category[];
  onClose: () => void;
  onSubmit: (data: CreateTaskData | UpdateTaskData) => void;
}

interface FormData {
  title: string;
  description: string;
  assignedTo: string;
  categories: string[];
  priority: 'low' | 'medium' | 'high' | 'critical';
  deadline: string;
}

const TaskForm: React.FC<TaskFormProps> = ({
  open,
  editingTask,
  users,
  categories,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    assignedTo: '',
    categories: [],
    priority: 'medium',
    deadline: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editingTask) {
      setFormData({
        title: editingTask.title,
        description: editingTask.description,
        assignedTo: editingTask.assignedTo,
        categories: editingTask.categories,
        priority: editingTask.priority,
        deadline: editingTask.deadline,
      });
    } else {
      setFormData({
        title: '',
        description: '',
        assignedTo: '',
        categories: [],
        priority: 'medium',
        deadline: '',
      });
    }
    setErrors({});
  }, [editingTask, open]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.assignedTo.trim()) {
      newErrors.assignedTo = 'Assigned user is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    const data = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      assignedTo: formData.assignedTo,
      categories: formData.categories,
      priority: formData.priority,
      deadline: formData.deadline,
    };

    onSubmit(data);
  };

  const handleInputChange = (field: keyof FormData) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
    
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
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
              onChange={handleInputChange('title')}
              error={!!errors.title}
              helperText={errors.title}
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
              onChange={handleInputChange('description')}
              error={!!errors.description}
              helperText={errors.description}
              required
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Autocomplete
              options={users}
              getOptionLabel={(option) => option.username}
              value={users.find(user => user.id === formData.assignedTo) || null}
              onChange={(_, value) => {
                setFormData(prev => ({ ...prev, assignedTo: value?.id || '' }));
                if (errors.assignedTo) {
                  setErrors(prev => ({ ...prev, assignedTo: '' }));
                }
              }}
              renderInput={(params) => (
                <TextField 
                  {...params} 
                  label="Assigned To" 
                  required 
                  error={!!errors.assignedTo}
                  helperText={errors.assignedTo}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth required>
              <InputLabel>Priority</InputLabel>
              <Select
                value={formData.priority}
                label="Priority"
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  priority: e.target.value as FormData['priority']
                }))}
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
              onChange={(_, value) => setFormData(prev => ({ 
                ...prev, 
                categories: value.map(v => String(v.id)) 
              }))}
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
              onChange={handleInputChange('deadline')}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} startIcon={<CancelIcon />}>
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          startIcon={<SaveIcon />}
        >
          {editingTask ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TaskForm;