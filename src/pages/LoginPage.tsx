import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff, Login as LoginIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuthActions } from '../hooks';

const LoginPage: React.FC = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { login, isAuthenticated, isLoading } = useAuthActions();

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!credentials.username || !credentials.password) {
      setError('Please fill in all fields');
      return;
    }

    const result = await login(credentials);
    if (!result.success) {
      setError(result.error || 'Login failed');
    }
  };

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials(prev => ({
      ...prev,
      [field]: e.target.value,
    }));
    setError(null);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: 2,
      }}
    >
      <Container maxWidth="sm">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Paper
            elevation={8}
            sx={{
              p: 4,
              borderRadius: 3,
              backdropFilter: 'blur(10px)',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
            }}
          >
            <Box textAlign="center" mb={3}>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              >
                <LoginIcon sx={{ fontSize: 64, color: 'primary.main', mb: 1 }} />
              </motion.div>
              <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
                TaskFlow
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Smart Task Management System
              </Typography>
            </Box>

            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              </motion.div>
            )}

            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Username"
                value={credentials.username}
                onChange={handleInputChange('username')}
                margin="normal"
                required
                autoComplete="username"
                autoFocus
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={credentials.password}
                onChange={handleInputChange('password')}
                margin="normal"
                required
                autoComplete="current-password"
                sx={{ mb: 3 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={isLoading}
                sx={{
                  py: 1.5,
                  mb: 2,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: '1.1rem',
                }}
              >
                {isLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Sign In'
                )}
              </Button>
            </Box>

            <Box mt={2} p={2} bgcolor="grey.50" borderRadius={2}>
              <Typography variant="body2" gutterBottom fontWeight="500">
                Demo Credentials:
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Admin: <strong>admin / admin123</strong>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                User: <strong>user / user123</strong>
              </Typography>
            </Box>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default LoginPage;