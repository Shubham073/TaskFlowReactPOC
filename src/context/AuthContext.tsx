import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { AuthState, AuthAction, User } from '../types';
import { 
  setGlobalAuthDispatch, 
  clearGlobalAuthDispatch, 
  clearAuthData,
  startSession,
  endSession,
  isTokenExpired 
} from '../services/authService';


const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
};


const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        isLoading: true,
      };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case 'LOGOUT':
    case 'SESSION_EXPIRED':
    case 'UNAUTHORIZED_ACCESS':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      };
    default:
      return state;
  }
};


interface AuthContextType {
  state: AuthState;
  dispatch: React.Dispatch<AuthAction>;
  login: (user: User, token: string) => void;
  logout: (reason?: 'manual' | 'session_expired' | 'unauthorized') => void;
  checkSessionValidity: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);


interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  
  React.useEffect(() => {
    setGlobalAuthDispatch(dispatch);
    return () => clearGlobalAuthDispatch();
  }, [dispatch]);

  const login = (user: User, token: string) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    startSession();
    dispatch({ type: 'LOGIN_SUCCESS', payload: user });
  };

  const logout = (reason: 'manual' | 'session_expired' | 'unauthorized' = 'manual') => {
    clearAuthData();
    endSession();
    
    switch (reason) {
      case 'session_expired':
        dispatch({ type: 'SESSION_EXPIRED' });
        break;
      case 'unauthorized':
        dispatch({ type: 'UNAUTHORIZED_ACCESS' });
        break;
      default:
        dispatch({ type: 'LOGOUT' });
    }
  };

  const checkSessionValidity = (): boolean => {
    const token = localStorage.getItem('token');
    if (!token) return false;

    if (isTokenExpired()) {
      logout('session_expired');
      return false;
    }

    return true;
  };

  
  React.useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        
        if (isTokenExpired()) {
          clearAuthData();
          dispatch({ type: 'SESSION_EXPIRED' });
          return;
        }

        const user = JSON.parse(userData);
        startSession();
        dispatch({ type: 'LOGIN_SUCCESS', payload: user });
      } catch (error) {
        
        clearAuthData();
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  
  React.useEffect(() => {
    if (!state.isAuthenticated) return;

    const intervalId = setInterval(() => {
      checkSessionValidity();
    }, 5 * 60 * 1000); 

    return () => clearInterval(intervalId);
  }, [state.isAuthenticated]);

  return (
    <AuthContext.Provider value={{ state, dispatch, login, logout, checkSessionValidity }}>
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};