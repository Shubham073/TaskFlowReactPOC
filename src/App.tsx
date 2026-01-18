import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { AuthProvider } from './context/AuthContext';
import { TaskProvider } from './context/TaskContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';

// Lazy load pages for code splitting
const LoginPage = lazy(() => import('./pages/LoginPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const TasksPage = lazy(() => import('./pages/TasksPage'));
const CategoriesPage = lazy(() => import('./pages/CategoriesPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

// Loading component
const LoadingSpinner: React.FC = () => (
  <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    minHeight="100vh"
  >
    <CircularProgress size={60} />
  </Box>
);

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <TaskProvider>
            <Router>
              <Routes>
                <Route
                  path="/login"
                  element={
                    <Suspense fallback={<LoadingSpinner />}>
                      <LoginPage />
                    </Suspense>
                  }
                />
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <Layout />
                    </ProtectedRoute>
                  }
                >
                  <Route
                    index
                    element={
                      <Suspense fallback={<LoadingSpinner />}>
                        <DashboardPage />
                      </Suspense>
                    }
                  />
                  <Route
                    path="dashboard"
                    element={
                      <Suspense fallback={<LoadingSpinner />}>
                        <DashboardPage />
                      </Suspense>
                    }
                  />
                  <Route
                    path="tasks"
                    element={
                      <Suspense fallback={<LoadingSpinner />}>
                        <TasksPage />
                      </Suspense>
                    }
                  />
                  <Route
                    path="categories"
                    element={
                      <Suspense fallback={<LoadingSpinner />}>
                        <CategoriesPage />
                      </Suspense>
                    }
                  />
                  <Route
                    path="profile"
                    element={
                      <Suspense fallback={<LoadingSpinner />}>
                        <ProfilePage />
                      </Suspense>
                    }
                  />
                </Route>
                <Route
                  path="/404"
                  element={
                    <Suspense fallback={<LoadingSpinner />}>
                      <NotFoundPage />
                    </Suspense>
                  }
                />
                <Route path="*" element={<Navigate to="/404" replace />} />
              </Routes>
            </Router>
          </TaskProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;