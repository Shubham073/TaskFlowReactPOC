import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { ErrorOutline } from '@mui/icons-material';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <Container maxWidth="md">
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            minHeight="100vh"
            textAlign="center"
            gap={3}
          >
            <ErrorOutline color="error" sx={{ fontSize: 64 }} />
            <Typography variant="h4" component="h1" gutterBottom>
              Oops! Something went wrong
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              We're sorry, but something unexpected happened. Our team has been notified.
            </Typography>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <Box
                component="pre"
                sx={{
                  backgroundColor: 'grey.100',
                  p: 2,
                  borderRadius: 1,
                  fontSize: '0.75rem',
                  overflow: 'auto',
                  maxWidth: '100%',
                  maxHeight: '200px',
                }}
              >
                {this.state.error.toString()}
                {this.state.errorInfo && this.state.errorInfo.componentStack}
              </Box>
            )}

            <Box display="flex" gap={2}>
              <Button variant="contained" onClick={this.handleReload}>
                Reload Page
              </Button>
              <Button variant="outlined" onClick={this.handleGoHome}>
                Go Home
              </Button>
            </Box>
          </Box>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;