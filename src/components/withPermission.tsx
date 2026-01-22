import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User } from '../types';
import LoadingSpinner from './LoadingSpinner';
import EmptyState from './EmptyState';
import { Lock as LockIcon } from '@mui/icons-material';

interface WithPermissionProps {
  requiredRole?: 'admin' | 'user';
  requiredPermissions?: string[];
  fallback?: React.ReactNode;
  checkOwnership?: (user: User, resourceOwnerId?: string) => boolean;
  resourceOwnerId?: string;
  showForbidden?: boolean;
}

function withPermission<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: WithPermissionProps = {}
) {
  const {
    requiredRole,
    requiredPermissions = [],
    fallback,
    checkOwnership,
    resourceOwnerId,
    showForbidden = true,
  } = options;

  return React.forwardRef<any, P>((props, ref) => {
    const { state, checkSessionValidity } = useAuth();
    const [isValidating, setIsValidating] = useState(true);
    const [hasPermission, setHasPermission] = useState(false);

    useEffect(() => {
      const validateAccess = () => {
        setIsValidating(true);

        
        if (!state.isAuthenticated || !checkSessionValidity()) {
          setHasPermission(false);
          setIsValidating(false);
          return;
        }

        const { user } = state;
        if (!user) {
          setHasPermission(false);
          setIsValidating(false);
          return;
        }

        let hasAccess = true;

        
        if (requiredRole) {
          if (requiredRole === 'admin' && user.role !== 'admin') {
            hasAccess = false;
          }
        }

        
        if (checkOwnership && resourceOwnerId) {
          if (!checkOwnership(user, resourceOwnerId)) {
            
            if (user.role !== 'admin') {
              hasAccess = false;
            }
          }
        }

        
        if (requiredPermissions.length > 0) {
          
          
          const userPermissions = user.role === 'admin' ? ['*'] : [];
          const hasRequiredPermissions = requiredPermissions.every(
            permission => userPermissions.includes('*') || userPermissions.includes(permission)
          );
          
          if (!hasRequiredPermissions) {
            hasAccess = false;
          }
        }

        setHasPermission(hasAccess);
        setIsValidating(false);
      };

      validateAccess();
    }, [state.isAuthenticated, state.user, resourceOwnerId, checkSessionValidity]);

    
    if (isValidating) {
      return <LoadingSpinner message="Checking permissions..." />;
    }

    
    if (!hasPermission && fallback) {
      return <>{fallback}</>;
    }

    
    if (!hasPermission && showForbidden) {
      const forbiddenMessage = requiredRole === 'admin' 
        ? 'Administrator access required for this feature.'
        : 'You do not have permission to access this feature.';

      return (
        <EmptyState
          title="Access Denied"
          description={forbiddenMessage}
          icon={<LockIcon />}
        />
      );
    }

    if (hasPermission) {
      return <WrappedComponent {...(props as P)} ref={ref} />;
    }

    return null;
  });
}


export const AdminOnly: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({
  children,
  fallback,
}) => {
  const { state } = useAuth();
  
  if (state.user?.role === 'admin') {
    return <>{children}</>;
  }
  
  return fallback ? <>{fallback}</> : null;
};

export const UserOrAdmin: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { state } = useAuth();
  
  if (state.isAuthenticated) {
    return <>{children}</>;
  }
  
  return null;
};

export const OwnerOnly: React.FC<{ 
  children: React.ReactNode; 
  ownerId: string;
  fallback?: React.ReactNode;
}> = ({ children, ownerId, fallback }) => {
  const { state } = useAuth();
  
  if (state.user?.id === ownerId || state.user?.role === 'admin') {
    return <>{children}</>;
  }
  
  return fallback ? <>{fallback}</> : null;
};

export default withPermission;