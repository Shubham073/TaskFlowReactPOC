# 403 Error Handling & Session Management Implementation

## Overview
Implemented comprehensive 403 error handling and session management for the TaskFlow React application to ensure proper authentication, authorization, and user session security.

## Features Implemented

### 1. **Enhanced Authentication Context**
- **Session Validation**: Added `checkSessionValidity()` method to verify token expiration
- **Enhanced Logout**: Support for different logout reasons (manual, session_expired, unauthorized)
- **Token Expiration**: Automatic detection and handling of expired JWT tokens
- **Session Tracking**: Track session start time and duration

### 2. **API Error Handling** (`src/services/api.ts`)
- **401 Unauthorized**: Automatic session cleanup and redirect to login
- **403 Forbidden**: Proper permission denied handling with user feedback
- **404/500 Errors**: Appropriate error logging and handling
- **Error Recovery**: Graceful error recovery with user notifications

### 3. **Session Management Service** (`src/services/authService.ts`)
- **Global Auth Dispatch**: Centralized authentication state management
- **Token Validation**: JWT token expiration checking
- **Session Duration**: Track and monitor user session length
- **Auth Data Cleanup**: Secure cleanup of authentication data

### 4. **Session Manager Component** (`src/components/SessionManager.tsx`)
- **Session Expiration Dialog**: User-friendly session expiration notifications
- **Session Warning**: 5-minute warning before session expires
- **Unauthorized Access Alerts**: Snackbar notifications for 403 errors
- **Auto Session Extension**: Option to extend valid sessions
- **Countdown Timer**: Visual countdown for session warnings

### 5. **Permission System** (`src/components/withPermission.tsx`)
- **Higher-Order Component**: Wrap components with permission checks
- **Role-Based Access**: Admin vs User permission verification
- **Ownership Checks**: Resource-specific ownership validation
- **Convenience Components**: AdminOnly, UserOrAdmin, OwnerOnly wrappers
- **Graceful Fallbacks**: Custom fallback content for unauthorized access

## Usage Examples

### Basic Permission Wrapping
```tsx
// Wrap entire component with admin requirement
const AdminTasksPage = withPermission(TasksPage, { requiredRole: 'admin' });

// Use convenience components
<AdminOnly>
  <Button>Admin Only Feature</Button>
</AdminOnly>

<OwnerOnly ownerId={task.assignedTo}>
  <EditButton />
</OwnerOnly>
```

### Error Handling in API Calls
```tsx
const handleDelete = async (taskId: string) => {
  try {
    const result = await deleteTask(taskId);
    if (result.success) {
      showSnackbar('Task deleted successfully', 'success');
    }
  } catch (error: any) {
    if (error.response?.status === 403) {
      showSnackbar('You do not have permission to delete this task', 'error');
    } else if (error.response?.status === 401) {
      // Handled automatically by API interceptor
      console.log('Session expired - redirecting to login');
    }
  }
};
```

### Session Management Integration
```tsx
// In App.tsx
<AuthProvider>
  <SessionManager>
    <TaskProvider>
      {/* Your app content */}
    </TaskProvider>
  </SessionManager>
</AuthProvider>
```

## Security Features

### 1. **Token Management**
- **Automatic Expiration**: JWT token expiration detection
- **Secure Storage**: Token stored in localStorage with validation
- **Clean Logout**: Complete cleanup of auth data on logout/expiration

### 2. **Session Security**
- **Periodic Validation**: Check session validity every 5 minutes
- **Proactive Warnings**: Warn users 5 minutes before expiration
- **Forced Logout**: Automatic logout on token expiration
- **Session Tracking**: Monitor session duration and activity

### 3. **Permission Validation**
- **Real-time Checks**: Validate permissions on every action
- **Role-based Access**: Admin/User role verification
- **Resource Ownership**: Check ownership for user-specific actions
- **UI Protection**: Hide/disable unauthorized actions

## Error Scenarios Handled

### 1. **401 Unauthorized**
- Token expired or invalid
- Automatic cleanup and redirect to login
- Session expired dialog notification
- Clear authentication state

### 2. **403 Forbidden**
- Insufficient permissions for action
- User-friendly error messages
- Maintain user session
- Snackbar notifications for immediate feedback

### 3. **Session Expiration**
- Proactive 5-minute warning
- Option to extend session
- Graceful logout on expiration
- Redirect to login with explanation

### 4. **Network Errors**
- Connection issues handling
- Retry mechanisms for temporary failures
- Appropriate error logging
- User feedback for network problems

## Implementation Details

### API Interceptors
```typescript
// Request interceptor - adds auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - handles errors
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error.response?.status;
    switch (status) {
      case 401:
        clearAuthData();
        handleSessionExpired();
        break;
      case 403:
        handleUnauthorized(message);
        break;
    }
    return Promise.reject(error);
  }
);
```

### Auth Context Enhancement
```typescript
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SESSION_EXPIRED':
    case 'UNAUTHORIZED_ACCESS':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      };
    // ... other cases
  }
};
```

## Benefits

### 1. **Security**
- Prevents unauthorized access to protected resources
- Automatic session management reduces security risks
- Proper cleanup prevents session hijacking
- Token validation ensures authenticity

### 2. **User Experience**
- Clear feedback for permission issues
- Proactive session warnings prevent data loss
- Graceful error recovery maintains app stability
- Consistent error messaging across the app

### 3. **Developer Experience**
- Easy-to-use permission components
- Centralized error handling
- Consistent patterns for API calls
- Type-safe permission checks

### 4. **Maintainability**
- Centralized session management logic
- Reusable permission components
- Consistent error handling patterns
- Clear separation of concerns

## Testing Scenarios

### 1. **Session Expiration**
- Test automatic logout on token expiration
- Verify session warning appears at correct time
- Confirm redirect to login after expiration
- Validate cleanup of authentication data

### 2. **Permission Checks**
- Test admin-only features as regular user
- Verify ownership-based access controls
- Confirm graceful fallbacks for unauthorized access
- Test role-based UI hiding/showing

### 3. **Error Recovery**
- Test 403 error handling with appropriate messages
- Verify retry mechanisms for network errors
- Confirm app stability after authentication errors
- Test user feedback for different error types

This implementation provides a robust foundation for handling authentication, authorization, and session management in a production React application.