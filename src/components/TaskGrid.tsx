import React from 'react';
import { Grid, Box } from '@mui/material';
import { Task as TaskIcon } from '@mui/icons-material';
import TaskCard from './TaskCard';
import EmptyState from './EmptyState';
import { Task, User, Category } from '../types';

interface TaskGridProps {
  tasks: Task[];
  users: User[];
  categories: Category[];
  activeFiltersCount: number;
  canEdit: (task: Task) => boolean;
  canDelete: (task: Task) => boolean;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onToggleComplete: (taskId: string) => void;
  onCreateNew: () => void;
}

const TaskGrid: React.FC<TaskGridProps> = ({
  tasks,
  users,
  categories,
  activeFiltersCount,
  canEdit,
  canDelete,
  onEdit,
  onDelete,
  onToggleComplete,
  onCreateNew,
}) => {
  if (tasks.length === 0) {
    return (
      <EmptyState
        title="No tasks found"
        description={activeFiltersCount > 0 
          ? 'Try adjusting your filters to see more tasks.'
          : 'Create your first task to get started!'
        }
        actionLabel={activeFiltersCount === 0 ? 'Create Task' : undefined}
        onAction={activeFiltersCount === 0 ? onCreateNew : undefined}
        icon={<TaskIcon />}
      />
    );
  }

  return (
    <Grid container spacing={3}>
      {tasks.map((task, index) => (
        <Grid item xs={12} sm={6} md={4} key={task.id}>
          <TaskCard
            task={task}
            users={users}
            categories={categories}
            canEdit={canEdit}
            canDelete={canDelete}
            onEdit={onEdit}
            onDelete={onDelete}
            onToggleComplete={onToggleComplete}
            index={index}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default TaskGrid;