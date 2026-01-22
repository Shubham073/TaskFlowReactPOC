import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Alert,
  Snackbar,
  Box,
  LinearProgress,
} from '@mui/material';
import {
  Warning as WarningIcon,
  Lock as LockIcon,
  ExitToApp as LogoutIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { getSessionDuration } from '../services/authService';

interface SessionManagerProps {
  children: React.ReactNode;
}

const SessionManager: React.FC<SessionManagerProps> = ({ children }) => {
  const { state, logout, checkSessionValidity } = useAuth();
  const [sessionExpiredDialog, setSessionExpiredDialog] = useState(false);
  const [unauthorizedSnackbar, setUnauthorizedSnackbar] = useState(false);
  const [unauthorizedMessage, setUnauthorizedMessage] = useState('');
  const [sessionWarning, setSessionWarning] = useState(false);
  const [warningCountdown, setWarningCountdown] = useState(0);

  
  useEffect(() => {
    
    if (state.isAuthenticated === false && sessionExpiredDialog === false) {
      
      const token = localStorage.getItem('token');
      if (!token && window.location.pathname !== '/login') {
        setSessionExpiredDialog(true);
      }
    }
  }, [state.isAuthenticated, sessionExpiredDialog]);

  
  useEffect(() => {
    if (!state.isAuthenticated) return;

    const checkSessionWarning = () => {
      const sessionDuration = getSessionDuration();
      
      if (sessionDuration >= 55 && sessionDuration < 60) {
        setSessionWarning(true);
        setWarningCountdown(60 - sessionDuration);
      }
    };

    const intervalId = setInterval(checkSessionWarning, 60 * 1000); 
    return () => clearInterval(intervalId);
  }, [state.isAuthenticated]);

  
  useEffect(() => {
    if (!sessionWarning || warningCountdown <= 0) return;

    const countdownId = setInterval(() => {
      setWarningCountdown(prev => {
        if (prev <= 1) {
          setSessionWarning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 60 * 1000); 

    return () => clearInterval(countdownId);
  }, [sessionWarning, warningCountdown]);

  
  useEffect(() => {
    const handleUnauthorized = (event: CustomEvent) => {
      const message = event.detail?.message || 'You do not have permission to perform this action';
      setUnauthorizedMessage(message);
      setUnauthorizedSnackbar(true);
    };

    
    window.addEventListener('unauthorized' as any, handleUnauthorized);
    return () => window.removeEventListener('unauthorized' as any, handleUnauthorized);
  }, []);

  const handleSessionExpiredClose = () => {
    setSessionExpiredDialog(false);
    window.location.href = '/login';
  };

  const handleExtendSession = () => {
    
    if (checkSessionValidity()) {
      setSessionWarning(false);
      setWarningCountdown(0);
    } else {
      
      setSessionWarning(false);
      setSessionExpiredDialog(true);
    }
  };

  const handleLogoutFromWarning = () => {
    setSessionWarning(false);
    logout('manual');
  };

  return (
    <>
      {children}

      <Dialog
        open={sessionExpiredDialog}
        disableEscapeKeyDown
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LockIcon color="warning" />
            <Typography variant="h6">Session Expired</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            Your session has expired for security reasons.
          </Alert>
          <Typography variant="body1">
            Please log in again to continue using the application.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleSessionExpiredClose}
            variant="contained"
            startIcon={<LogoutIcon />}
            fullWidth
          >
            Go to Login
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={sessionWarning}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <WarningIcon color="warning" />
            <Typography variant="h6">Session Expiring Soon</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            Your session will expire in approximately {warningCountdown} minute{warningCountdown !== 1 ? 's' : ''}.
          </Alert>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Would you like to extend your session or log out?
          </Typography>
          <Box sx={{ mt: 2 }}>
            <LinearProgress 
              variant="determinate" 
              value={(warningCountdown / 5) * 100} 
              color="warning"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleLogoutFromWarning}
            color="inherit"
            startIcon={<LogoutIcon />}
          >
            Logout
          </Button>
          <Button
            onClick={handleExtendSession}
            variant="contained"
            color="primary"
          >
            Extend Session
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={unauthorizedSnackbar}
        autoHideDuration={6000}
        onClose={() => setUnauthorizedSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setUnauthorizedSnackbar(false)} 
          severity="error"
          variant="filled"
        >
          <Typography variant="body2">
            <strong>Access Denied:</strong> {unauthorizedMessage}
          </Typography>
        </Alert>
      </Snackbar>
    </>
  );
};

export default SessionManager;