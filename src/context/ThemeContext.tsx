import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { ThemeProvider as MuiThemeProvider, Theme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { getTheme } from '../utils/theme';
import { ThemeAction } from '../types';


interface ThemeState {
  mode: 'light' | 'dark';
  theme: Theme;
}


const initialState: ThemeState = {
  mode: 'light',
  theme: getTheme('light'),
};


const themeReducer = (state: ThemeState, action: ThemeAction): ThemeState => {
  switch (action.type) {
    case 'TOGGLE_THEME':
      const newMode = state.mode === 'light' ? 'dark' : 'light';
      return {
        mode: newMode,
        theme: getTheme(newMode),
      };
    case 'SET_THEME':
      return {
        mode: action.payload,
        theme: getTheme(action.payload),
      };
    default:
      return state;
  }
};


interface ThemeContextType {
  state: ThemeState;
  dispatch: React.Dispatch<ThemeAction>;
  toggleTheme: () => void;
  setTheme: (mode: 'light' | 'dark') => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);


interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(themeReducer, initialState);

  const toggleTheme = () => {
    dispatch({ type: 'TOGGLE_THEME' });
  };

  const setTheme = (mode: 'light' | 'dark') => {
    dispatch({ type: 'SET_THEME', payload: mode });
  };

  
  React.useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  
  React.useEffect(() => {
    localStorage.setItem('theme', state.mode);
  }, [state.mode]);

  return (
    <ThemeContext.Provider value={{ state, dispatch, toggleTheme, setTheme }}>
      <MuiThemeProvider theme={state.theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};


export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};