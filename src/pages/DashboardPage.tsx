import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Paper,
  Button,
} from '@mui/material';
import {
  Assignment as TaskIcon,
  CheckCircle as CompletedIcon,
  Schedule as PendingIcon,
  TrendingUp as TrendingUpIcon,
  PriorityHigh,
  Flag,
  Star,
  ArrowUpward,
  Category as CategoryIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useTaskActions } from '../hooks';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { tasks, stats, users, categories, fetchTasks, fetchUsers, fetchCategories } = useTaskActions();

  useEffect(() => {
    fetchTasks();
    fetchUsers();
    fetchCategories();
  }, []);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return '#f44336';
      case 'high': return '#ff9800';
      case 'medium': return '#2196f3';
      case 'low': return '#4caf50';
      default: return '#757575';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'critical': return <PriorityHigh sx={{ color: getPriorityColor(priority) }} />;
      case 'high': return <Flag sx={{ color: getPriorityColor(priority) }} />;
      case 'medium': return <Star sx={{ color: getPriorityColor(priority) }} />;
      case 'low': return <ArrowUpward sx={{ color: getPriorityColor(priority) }} />;
      default: return <Star sx={{ color: getPriorityColor(priority) }} />;
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
  };

  const recentTasks = tasks
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const overdueTasks = tasks.filter(task => {
    if (!task.deadline || task.completed) return false;
    return new Date(task.deadline) < new Date();
  });

  const highPriorityTasks = tasks.filter(task => 
    !task.completed && (task.priority === 'critical' || task.priority === 'high')
  );

  const navigateToTasks = (filters: Record<string, string | boolean> = {}) => {
    const searchParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.set(key, value.toString());
      }
    });
    navigate(`/tasks?${searchParams.toString()}`);
  };

  const navigateToAllTasks = () => navigateToTasks();
  const navigateToCompletedTasks = () => navigateToTasks({ completed: 'true' });
  const navigateToPendingTasks = () => navigateToTasks({ completed: 'false' });
  const navigateToHighPriorityTasks = () => navigateToTasks({ priority: 'critical' });
  const navigateToOverdueTasks = () => {
    navigateToPendingTasks();
  };

  return (
    <Box sx={{ p: 3 }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Overview of your tasks and progress
        </Typography>
      </motion.div>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <motion.div variants={cardVariants} initial="hidden" animate="visible" transition={{ delay: 0.1 }}>
            <Card 
              onClick={navigateToAllTasks}
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 2, 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                cursor: 'pointer',
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 6
                }
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="white" gutterBottom>
                      Total Tasks
                    </Typography>
                    <Typography variant="h4" color="white">
                      {stats.total}
                    </Typography>
                  </Box>
                  <TaskIcon sx={{ color: 'white', fontSize: 48 }} />
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <motion.div variants={cardVariants} initial="hidden" animate="visible" transition={{ delay: 0.2 }}>
            <Card 
              onClick={navigateToCompletedTasks}
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 2, 
                background: 'linear-gradient(135deg, #59ce8f 0%, #4caf50 100%)',
                cursor: 'pointer',
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 6
                }
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="white" gutterBottom>
                      Completed
                    </Typography>
                    <Typography variant="h4" color="white">
                      {stats.completed}
                    </Typography>
                  </Box>
                  <CompletedIcon sx={{ color: 'white', fontSize: 48 }} />
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <motion.div variants={cardVariants} initial="hidden" animate="visible" transition={{ delay: 0.3 }}>
            <Card 
              onClick={navigateToPendingTasks}
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 2, 
                background: 'linear-gradient(135deg, #ff7043 0%, #ff5722 100%)',
                cursor: 'pointer',
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 6
                }
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="white" gutterBottom>
                      Pending
                    </Typography>
                    <Typography variant="h4" color="white">
                      {stats.pending}
                    </Typography>
                  </Box>
                  <PendingIcon sx={{ color: 'white', fontSize: 48 }} />
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <motion.div variants={cardVariants} initial="hidden" animate="visible" transition={{ delay: 0.4 }}>
            <Card 
              onClick={navigateToCompletedTasks}
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 2, 
                background: 'linear-gradient(135deg, #42a5f5 0%, #2196f3 100%)',
                cursor: 'pointer',
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 6
                }
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="white" gutterBottom>
                      Completion Rate
                    </Typography>
                    <Typography variant="h4" color="white">
                      {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%
                    </Typography>
                  </Box>
                  <TrendingUpIcon sx={{ color: 'white', fontSize: 48 }} />
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12}>
          <motion.div variants={cardVariants} initial="hidden" animate="visible" transition={{ delay: 0.5 }}>
            <Card sx={{ borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Overall Progress
                </Typography>
                <Box display="flex" alignItems="center" gap={2}>
                  <LinearProgress
                    variant="determinate"
                    value={stats.total > 0 ? (stats.completed / stats.total) * 100 : 0}
                    sx={{ 
                      flexGrow: 1, 
                      height: 8, 
                      borderRadius: 4,
                      backgroundColor: 'grey.300',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: '#59ce8f',
                      }
                    }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {stats.completed} of {stats.total} completed
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ alignItems: 'stretch' }}>
        <Grid item xs={12} md={4} sx={{ display: 'flex' }}>
          <motion.div variants={cardVariants} initial="hidden" animate="visible" transition={{ delay: 0.6 }} style={{ width: '100%', display: 'flex' }}>
            <Card sx={{ borderRadius: 2, height: '100%', display: 'flex', flexDirection: 'column', width: '100%' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom>
                  Tasks by Priority
                </Typography>
                <List>
                  {Object.entries(stats.byPriority || {}).map(([priority, count]) => (
                    <ListItem 
                      key={priority} 
                      onClick={() => navigateToTasks({ priority })}
                      sx={{ 
                        px: 0,
                        cursor: 'pointer',
                        borderRadius: 1,
                        '&:hover': {
                          backgroundColor: 'action.hover'
                        }
                      }}
                    >
                      <ListItemIcon>
                        {getPriorityIcon(priority)}
                      </ListItemIcon>
                      <ListItemText 
                        primary={
                          <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                              {priority}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {count}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                  {(!stats.byPriority || Object.keys(stats.byPriority).length === 0) && (
                    <ListItem sx={{ px: 0 }}>
                      <Typography variant="body2" color="text.secondary">
                        No tasks found
                      </Typography>
                    </ListItem>
                  )}
                </List>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        <Grid item xs={12} md={4} sx={{ display: 'flex' }}>
          <motion.div variants={cardVariants} initial="hidden" animate="visible" transition={{ delay: 0.7 }} style={{ width: '100%', display: 'flex' }}>
            <Card sx={{ borderRadius: 2, height: '100%', display: 'flex', flexDirection: 'column', width: '100%' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6">
                    Tasks by Category
                  </Typography>
                  <Button
                    size="small"
                    onClick={() => navigate('/categories')}
                    sx={{ textTransform: 'none', minWidth: 'auto' }}
                  >
                    Manage
                  </Button>
                </Box>
                <List>
                  {Object.entries(stats.byCategory || {}).map(([categoryId, count]) => {
                    const category = categories.find(cat => String(cat.id) === String(categoryId));
                    return (
                      <ListItem 
                        key={categoryId} 
                        onClick={() => navigateToTasks({ category: categoryId })}
                        sx={{ 
                          px: 0,
                          cursor: 'pointer',
                          borderRadius: 1,
                          '&:hover': {
                            backgroundColor: 'action.hover'
                          }
                        }}
                      >
                        <ListItemIcon>
                          <CategoryIcon />
                        </ListItemIcon>
                        <ListItemText 
                          primary={
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                              <Typography variant="body2">
                                {category?.name || 'Unknown'}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {count}
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                    );
                  })}
                  {(!stats.byCategory || Object.keys(stats.byCategory).length === 0) && (
                    <ListItem sx={{ px: 0 }}>
                      <Typography variant="body2" color="text.secondary">
                        No categories found
                      </Typography>
                    </ListItem>
                  )}
                </List>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        <Grid item xs={12} md={4} sx={{ display: 'flex' }}>
          <motion.div variants={cardVariants} initial="hidden" animate="visible" transition={{ delay: 0.8 }} style={{ width: '100%', display: 'flex' }}>
            <Card 
              onClick={navigateToAllTasks}
              sx={{ 
                borderRadius: 2, 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                cursor: 'pointer',
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 4
                }
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom>
                  Recent Tasks
                </Typography>
                <List>
                  {recentTasks.map((task) => (
                    <ListItem key={task.id} sx={{ px: 0 }}>
                      <ListItemIcon>
                        {task.completed ? <CompletedIcon color="success" /> : <PendingIcon color="error" />}
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              textDecoration: task.completed ? 'line-through' : 'none',
                              color: task.completed ? 'text.secondary' : 'text.primary'
                            }}
                          >
                            {task.title}
                          </Typography>
                        }
                        secondary={
                          <Typography variant="caption" color="text.secondary">
                            {users.find(user => user.id === task.assignedTo)?.username || 'Unassigned'}
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))}
                  {recentTasks.length === 0 && (
                    <ListItem sx={{ px: 0 }}>
                      <Typography variant="body2" color="text.secondary">
                        No recent tasks
                      </Typography>
                    </ListItem>
                  )}
                </List>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>

      {(overdueTasks.length > 0 || highPriorityTasks.length > 0) && (
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {overdueTasks.length > 0 && (
            <Grid item xs={12} md={6}>
              <motion.div variants={cardVariants} initial="hidden" animate="visible" transition={{ delay: 0.9 }}>
                <Paper 
                  onClick={navigateToOverdueTasks}
                  sx={{ 
                    p: 3, 
                    borderRadius: 2, 
                    bgcolor: 'error.main', 
                    color: 'white',
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: 6
                    }
                  }}
                >
                  <Typography variant="h6" gutterBottom>
                    Overdue Tasks ({overdueTasks.length})
                  </Typography>
                  <List>
                    {overdueTasks.slice(0, 3).map((task) => (
                      <ListItem key={task.id} sx={{ px: 0, color: 'white' }}>
                        <ListItemText
                          primary={task.title}
                          secondary={
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                              Due: {new Date(task.deadline).toLocaleDateString()}
                            </Typography>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              </motion.div>
            </Grid>
          )}

          {highPriorityTasks.length > 0 && (
            <Grid item xs={12} md={6}>
              <motion.div variants={cardVariants} initial="hidden" animate="visible" transition={{ delay: 1.0 }}>
                <Paper 
                  onClick={navigateToHighPriorityTasks}
                  sx={{ 
                    p: 3, 
                    borderRadius: 2, 
                    bgcolor: 'warning.main', 
                    color: 'white',
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: 6
                    }
                  }}
                >
                  <Typography variant="h6" gutterBottom>
                    High Priority Tasks ({highPriorityTasks.length})
                  </Typography>
                  <List>
                    {highPriorityTasks.slice(0, 3).map((task) => (
                      <ListItem key={task.id} sx={{ px: 0, color: 'white' }}>
                        <ListItemText
                          primary={task.title}
                          secondary={
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                              Priority: {task.priority}
                            </Typography>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              </motion.div>
            </Grid>
          )}
        </Grid>
      )}
    </Box>
  );
};

export default DashboardPage;