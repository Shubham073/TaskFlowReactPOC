import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Button,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle,
  Schedule,
  PriorityHigh as PriorityIcon,
  Category as CategoryIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Task, User, Category } from '../types';

interface TaskCardProps {
  task: Task;
  users: User[];
  categories: Category[];
  canEdit: (task: Task) => boolean;
  canDelete: (task: Task) => boolean;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onToggleComplete: (taskId: string) => void;
  index?: number;
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  users,
  categories,
  canEdit,
  canDelete,
  onEdit,
  onDelete,
  onToggleComplete,
  index = 0,
}) => {
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

  return (
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
                  onClick={() => onEdit(task)}
                  sx={{ bgcolor: 'action.hover' }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              )}
              {canDelete(task) && (
                <IconButton
                  size="small"
                  onClick={() => onDelete(task.id)}
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
              onClick={() => onToggleComplete(task.id)}
              color={task.completed ? 'inherit' : 'success'}
              sx={{ borderRadius: 2 }}
            >
              {task.completed ? 'Mark Incomplete' : 'Complete'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TaskCard;