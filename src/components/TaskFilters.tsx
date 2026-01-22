import React from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Collapse,
  Autocomplete,
} from '@mui/material';
import {
  FilterList,
  ExpandMore,
  ExpandLess,
} from '@mui/icons-material';
import { TaskFilters as TaskFiltersType, User, Category } from '../types';

interface TaskFiltersProps {
  filters: TaskFiltersType;
  users: User[];
  categories: Category[];
  showFilters: boolean;
  onToggleFilters: () => void;
  onFilterChange: (filterName: keyof TaskFiltersType, value: any) => void;
  onClearFilters: () => void;
}

const TaskFilters: React.FC<TaskFiltersProps> = ({
  filters,
  users,
  categories,
  showFilters,
  onToggleFilters,
  onFilterChange,
  onClearFilters,
}) => {
  const activeFiltersCount = Object.values(filters).filter(value => 
    value !== undefined && value !== ''
  ).length;

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Tasks
        </Typography>
        <Button
          variant="outlined"
          startIcon={<FilterList />}
          onClick={onToggleFilters}
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
                  onChange={(e) => onFilterChange('completed', e.target.value === '' ? undefined : e.target.value === 'true')}
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
                  onChange={(e) => onFilterChange('priority', e.target.value)}
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
                onChange={(_, value) => onFilterChange('assignedTo', value?.id)}
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
                onChange={(_, value) => onFilterChange('category', value?.id)}
                renderInput={(params) => (
                  <TextField {...params} label="Category" />
                )}
              />
            </Grid>
          </Grid>
          
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={onClearFilters} disabled={activeFiltersCount === 0}>
              Clear Filters
            </Button>
          </Box>
        </Paper>
      </Collapse>
    </>
  );
};

export default TaskFilters;