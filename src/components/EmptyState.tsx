import React from 'react';
import { Box, Typography, Button, SvgIcon, SxProps, Theme } from '@mui/material';
import { Add as AddIcon, Inbox as InboxIcon } from '@mui/icons-material';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
  sx?: SxProps<Theme>;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionLabel,
  onAction,
  icon,
  sx,
}) => {
  return (
    <Box
      sx={{
        textAlign: 'center',
        py: 8,
        px: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        ...sx,
      }}
    >
      {icon && (
        <Box sx={{ mb: 2, color: 'text.disabled' }}>
          {React.isValidElement(icon) ? (
            React.cloneElement(icon as React.ReactElement, {
              sx: { fontSize: 64, ...((icon as any).props?.sx || {}) }
            })
          ) : (
            <SvgIcon sx={{ fontSize: 64 }}>
              {icon}
            </SvgIcon>
          )}
        </Box>
      )}
      
      {!icon && (
        <InboxIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
      )}

      <Typography variant="h6" color="text.secondary" gutterBottom>
        {title}
      </Typography>
      
      <Typography 
        variant="body2" 
        color="text.secondary" 
        sx={{ mb: 3, maxWidth: 400 }}
      >
        {description}
      </Typography>
      
      {actionLabel && onAction && (
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          onClick={onAction}
          size="large"
        >
          {actionLabel}
        </Button>
      )}
    </Box>
  );
};

export default EmptyState;