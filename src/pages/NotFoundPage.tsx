import React from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import { Home, Search } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        textAlign="center"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Typography
            variant="h1"
            component="h1"
            sx={{
              fontSize: { xs: '8rem', md: '12rem' },
              fontWeight: 'bold',
              background: 'linear-gradient(45deg, #ff1e00, #667eea)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2,
            }}
          >
            404
          </Typography>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Typography variant="h4" component="h2" gutterBottom fontWeight="bold">
            Page Not Found
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            The page you're looking for doesn't exist. It might have been moved, 
            deleted, or you entered the wrong URL.
          </Typography>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Box display="flex" gap={2} mt={4}>
            <Button
              variant="contained"
              size="large"
              startIcon={<Home />}
              onClick={() => navigate('/')}
              sx={{ borderRadius: 2 }}
            >
              Go Home
            </Button>
            <Button
              variant="outlined"
              size="large"
              startIcon={<Search />}
              onClick={() => navigate('/tasks')}
              sx={{ borderRadius: 2 }}
            >
              View Tasks
            </Button>
          </Box>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <Box mt={6}>
            <Typography variant="body2" color="text.secondary">
              If you believe this is an error, please contact support.
            </Typography>
          </Box>
        </motion.div>
      </Box>
    </Container>
  );
};

export default NotFoundPage;