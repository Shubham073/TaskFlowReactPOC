import React from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Chip, 
  Stack,
  useTheme,
  useMediaQuery 
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  createButtonLabel?: string;
  onCreateClick?: () => void;
  stats?: Array<{
    label: string;
    value: string | number;
    color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  }>;
  showCreateButton?: boolean;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  createButtonLabel = 'Create',
  onCreateClick,
  stats = [],
  showCreateButton = true,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box sx={{ mb: 4 }}>
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: isMobile ? 'flex-start' : 'center',
          justifyContent: 'space-between',
          mb: 2,
          gap: 2
        }}
      >
        <Box>
          <Typography 
            variant="h4" 
            component="h1" 
            gutterBottom={!!subtitle}
            sx={{ 
              fontWeight: 600,
              color: 'text.primary',
              mb: subtitle ? 1 : 0
            }}
          >
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body1" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>

        {showCreateButton && onCreateClick && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={onCreateClick}
            size={isMobile ? 'medium' : 'large'}
            sx={{ 
              minWidth: isMobile ? 'auto' : 140,
              alignSelf: isMobile ? 'stretch' : 'auto'
            }}
          >
            {createButtonLabel}
          </Button>
        )}
      </Box>

      {stats.length > 0 && (
        <Stack 
          direction={isMobile ? 'column' : 'row'} 
          spacing={1.5}
          sx={{ 
            flexWrap: 'wrap',
            gap: 1
          }}
        >
          {stats.map((stat, index) => (
            <Chip
              key={index}
              label={`${stat.label}: ${stat.value}`}
              color={stat.color || 'default'}
              variant="outlined"
              size="medium"
            />
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default PageHeader;