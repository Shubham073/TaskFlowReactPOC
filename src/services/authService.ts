import { AuthAction } from '../types';

let globalAuthDispatch: React.Dispatch<AuthAction> | null = null;

export const setGlobalAuthDispatch = (dispatch: React.Dispatch<AuthAction>) => {
  globalAuthDispatch = dispatch;
};

export const clearGlobalAuthDispatch = () => {
  globalAuthDispatch = null;
};

export const handleUnauthorized = (message?: string) => {
  if (globalAuthDispatch) {
    globalAuthDispatch({ type: 'UNAUTHORIZED_ACCESS', payload: message });
  }
};

export const handleSessionExpired = () => {
  if (globalAuthDispatch) {
    globalAuthDispatch({ type: 'SESSION_EXPIRED' });
  }
};

export const clearAuthData = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  sessionStorage.removeItem('sessionStartTime');
};

export const isTokenExpired = (): boolean => {
  const token = localStorage.getItem('token');
  if (!token) return true;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  } catch (error) {
    console.error('Error decoding token:', error);
    return true;
  }
};

export const getSessionDuration = (): number => {
  const startTime = sessionStorage.getItem('sessionStartTime');
  if (!startTime) return 0;
  
  const start = parseInt(startTime, 10);
  return Math.floor((Date.now() - start) / 1000 / 60); 
};

export const startSession = () => {
  sessionStorage.setItem('sessionStartTime', Date.now().toString());
};

export const endSession = () => {
  sessionStorage.removeItem('sessionStartTime');
};