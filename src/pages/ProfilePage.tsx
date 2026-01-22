import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Grid,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Switch,
  FormControlLabel,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Person,
  Email,
  Work,
  Security,
  Notifications,
  Settings,
  Edit,
  Save,
  Cancel,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const ProfilePage: React.FC = () => {
  const { state: authState } = useAuth();
  const { state: themeState, toggleTheme } = useTheme();
  const [editOpen, setEditOpen] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(false);

  const user = authState.user;

  const handleEditOpen = () => setEditOpen(true);
  const handleEditClose = () => setEditOpen(false);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <Box>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Profile & Settings
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={4}>
          Manage your account settings and preferences
        </Typography>
      </motion.div>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.1 }}
          >
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
                  <Typography variant="h6" fontWeight="bold">
                    Profile Information
                  </Typography>
                  <Button
                    startIcon={<Edit />}
                    onClick={handleEditOpen}
                    variant="outlined"
                    size="small"
                  >
                    Edit
                  </Button>
                </Box>

                <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
                  <Avatar
                    sx={{
                      width: 100,
                      height: 100,
                      fontSize: '2rem',
                      bgcolor: 'primary.main',
                      mb: 2,
                    }}
                  >
                    {user?.username?.charAt(0).toUpperCase()}
                  </Avatar>
                  <Typography variant="h5" fontWeight="bold">
                    {user?.username}
                  </Typography>
                  <Chip
                    label={user?.role === 'admin' ? 'Administrator' : 'User'}
                    color={user?.role === 'admin' ? 'primary' : 'default'}
                    sx={{ mt: 1 }}
                  />
                </Box>

                <List>
                  <ListItem>
                    <ListItemIcon>
                      <Person />
                    </ListItemIcon>
                    <ListItemText
                      primary="Username"
                      secondary={user?.username}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Email />
                    </ListItemIcon>
                    <ListItemText
                      primary="Email"
                      secondary={`${user?.username}@taskflow.com`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Work />
                    </ListItemIcon>
                    <ListItemText
                      primary="Role"
                      secondary={user?.role === 'admin' ? 'Administrator' : 'User'}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Security />
                    </ListItemIcon>
                    <ListItemText
                      primary="Account Status"
                      secondary="Active"
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        <Grid item xs={12} md={6}>
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
          >
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box display="flex" alignItems="center" mb={3}>
                  <Settings sx={{ mr: 1 }} />
                  <Typography variant="h6" fontWeight="bold">
                    Application Settings
                  </Typography>
                </Box>

                <Box mb={3}>
                  <Typography variant="subtitle1" fontWeight="500" mb={2}>
                    Appearance
                  </Typography>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={themeState.mode === 'dark'}
                        onChange={toggleTheme}
                      />
                    }
                    label="Dark Mode"
                  />
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box mb={3}>
                  <Typography variant="subtitle1" fontWeight="500" mb={2}>
                    Notifications
                  </Typography>
                  <Box display="flex" flexDirection="column" gap={1}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={notifications}
                          onChange={(e) => setNotifications(e.target.checked)}
                        />
                      }
                      label="Push Notifications"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={emailAlerts}
                          onChange={(e) => setEmailAlerts(e.target.checked)}
                        />
                      }
                      label="Email Alerts"
                    />
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box>
                  <Typography variant="subtitle1" fontWeight="500" mb={2}>
                    Account Actions
                  </Typography>
                  <Box display="flex" flexDirection="column" gap={2}>
                    <Button variant="outlined" fullWidth>
                      Change Password
                    </Button>
                    <Button variant="outlined" color="error" fullWidth>
                      Delete Account
                    </Button>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        <Grid item xs={12}>
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" mb={3}>
                  Account Statistics
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={4}>
                    <Box textAlign="center">
                      <Typography variant="h3" color="primary" fontWeight="bold">
                        12
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Tasks Created
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Box textAlign="center">
                      <Typography variant="h3" color="success.main" fontWeight="bold">
                        8
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Tasks Completed
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Box textAlign="center">
                      <Typography variant="h3" color="warning.main" fontWeight="bold">
                        67%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Success Rate
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>

      <Dialog open={editOpen} onClose={handleEditClose} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Username"
            fullWidth
            variant="outlined"
            defaultValue={user?.username}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            variant="outlined"
            defaultValue={`${user?.username}@taskflow.com`}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Display Name"
            fullWidth
            variant="outlined"
            defaultValue={user?.username}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose} startIcon={<Cancel />}>
            Cancel
          </Button>
          <Button onClick={handleEditClose} variant="contained" startIcon={<Save />}>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProfilePage;