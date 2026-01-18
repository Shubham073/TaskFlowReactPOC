import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Fab,
  Chip,
  Alert,
  Snackbar,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Category as CategoryIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useTaskActions } from '../hooks';
import { useAuth } from '../context/AuthContext';
import { Category, CreateCategoryData, UpdateCategoryData } from '../types';

const CategoriesPage: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({ name: '' });
  const [snackbar, setSnackbar] = useState({ 
    open: false, 
    message: '', 
    severity: 'success' as 'success' | 'error' 
  });

  const { 
    categories, 
    stats,
    fetchCategories, 
    createCategory, 
    updateCategory, 
    deleteCategory 
  } = useTaskActions();
  
  const { state: authState } = useAuth();

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpen = () => {
    setOpen(true);
    setEditingCategory(null);
    setFormData({ name: '' });
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({ name: category.name });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingCategory(null);
    setFormData({ name: '' });
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      showSnackbar('Please enter a category name', 'error');
      return;
    }

    let result;
    if (editingCategory) {
      result = await updateCategory(editingCategory.id, { name: formData.name.trim() });
    } else {
      const createData: CreateCategoryData = { name: formData.name.trim() };
      result = await createCategory(createData);
    }

    if (result.success) {
      handleClose();
      showSnackbar(
        editingCategory ? 'Category updated successfully' : 'Category created successfully',
        'success'
      );
    } else {
      showSnackbar(result.error || 'Operation failed', 'error');
    }
  };

  const handleDelete = async (categoryId: string) => {
    if (!window.confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      return;
    }

    const result = await deleteCategory(categoryId);
    if (result.success) {
      showSnackbar('Category deleted successfully', 'success');
    } else {
      showSnackbar(result.error || 'Delete failed', 'error');
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const canManageCategories = authState.user?.role === 'admin';

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
  };

  return (
    <Box sx={{ p: 3 }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h4" component="h1" fontWeight="bold">
              Categories Management
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage task categories and organize your workflow
            </Typography>
          </Box>
          {canManageCategories && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpen}
              sx={{ borderRadius: 2 }}
            >
              Add Category
            </Button>
          )}
        </Box>
      </motion.div>

      {!canManageCategories && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Alert severity="info" sx={{ mb: 3 }}>
            You need administrator privileges to manage categories.
          </Alert>
        </motion.div>
      )}

      {/* Categories Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <motion.div variants={cardVariants} initial="hidden" animate="visible" transition={{ delay: 0.1 }}>
            <Card sx={{ borderRadius: 2, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="white" gutterBottom>
                      Total Categories
                    </Typography>
                    <Typography variant="h4" color="white">
                      {categories.length}
                    </Typography>
                  </Box>
                  <CategoryIcon sx={{ color: 'white', fontSize: 48 }} />
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <motion.div variants={cardVariants} initial="hidden" animate="visible" transition={{ delay: 0.2 }}>
            <Card sx={{ borderRadius: 2, background: 'linear-gradient(135deg, #59ce8f 0%, #4caf50 100%)' }}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="white" gutterBottom>
                      Categories in Use
                    </Typography>
                    <Typography variant="h4" color="white">
                      {Object.keys(stats.byCategory || {}).length}
                    </Typography>
                  </Box>
                  <CategoryIcon sx={{ color: 'white', fontSize: 48 }} />
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>

      {/* Categories List */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card sx={{ borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  All Categories
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                {categories.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <CategoryIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      No categories found
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                      Create your first category to organize tasks.
                    </Typography>
                    {canManageCategories && (
                      <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpen}>
                        Create Category
                      </Button>
                    )}
                  </Box>
                ) : (
                  <List>
                    {categories.map((category, index) => (
                      <motion.div
                        key={category.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <ListItem
                          sx={{
                            borderRadius: 1,
                            mb: 1,
                            '&:hover': {
                              backgroundColor: 'action.hover',
                            },
                          }}
                        >
                          <ListItemText
                            primary={
                              <Box display="flex" alignItems="center" gap={2}>
                                <CategoryIcon color="primary" />
                                <Typography variant="body1" fontWeight="500">
                                  {typeof category.name === 'string' ? category.name : 'Unnamed Category'}
                                </Typography>
                                <Chip
                                  label={`${stats.byCategory?.[category.id] || 0} tasks`}
                                  size="small"
                                  color="primary"
                                  variant="outlined"
                                />
                              </Box>
                            }
                          />
                          {canManageCategories && (
                            <ListItemSecondaryAction>
                              <IconButton
                                edge="end"
                                onClick={() => handleEdit(category)}
                                sx={{ mr: 1 }}
                              >
                                <EditIcon />
                              </IconButton>
                              <IconButton
                                edge="end"
                                onClick={() => handleDelete(category.id)}
                                color="error"
                              >
                                <DeleteIcon />
                              </IconButton>
                            </ListItemSecondaryAction>
                          )}
                        </ListItem>
                        {index < categories.length - 1 && <Divider />}
                      </motion.div>
                    ))}
                  </List>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Category Usage Statistics */}
        <Grid item xs={12} md={4}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card sx={{ borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Category Usage
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                {Object.entries(stats.byCategory || {}).length === 0 ? (
                  <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ py: 2 }}>
                    No categories are currently in use
                  </Typography>
                ) : (
                  <List>
                    {Object.entries(stats.byCategory || {})
                      .sort(([,a], [,b]) => b - a)
                      .slice(0, 10)
                      .map(([categoryId, count]) => {
                        const category = categories.find(cat => String(cat.id) === String(categoryId));
                        return (
                          <ListItem key={categoryId} sx={{ px: 0 }}>
                            <ListItemText
                              primary={typeof category?.name === 'string' ? category.name : 'Unknown Category'}
                              secondary={`${count} task${count !== 1 ? 's' : ''}`}
                            />
                          </ListItem>
                        );
                      })}
                  </List>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>

      {/* Floating Action Button for Mobile */}
      {canManageCategories && (
        <Fab
          color="primary"
          aria-label="add category"
          onClick={handleOpen}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            borderRadius: 2,
            display: { xs: 'flex', md: 'none' },
          }}
        >
          <AddIcon />
        </Fab>
      )}

      {/* Add/Edit Category Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingCategory ? 'Edit Category' : 'Create New Category'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            label="Category Name"
            fullWidth
            variant="outlined"
            value={formData.name}
            onChange={(e) => setFormData({ name: e.target.value })}
            margin="normal"
            required
            helperText="Enter a descriptive name for the category"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} startIcon={<CancelIcon />}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            startIcon={<SaveIcon />}
          >
            {editingCategory ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
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

export default CategoriesPage;