// Login Page - Beautiful split-screen design matching reference
import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Alert,
  CircularProgress,
  Link,
  Paper,
} from '@mui/material';
import {
  Security as SecurityIcon,
  FlashOn as FlashOnIcon,
  Public as PublicIcon,
} from '@mui/icons-material';
import { loginRequest, clearError } from '../redux/slices/authSlice';
import type { RootState } from '../../../store/store';

interface Feature {
  icon: React.ReactElement;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: <SecurityIcon sx={{ fontSize: 32, color: 'rgba(255, 255, 255, 0.9)' }} />,
    title: 'Enterprise Security',
    description: 'Bank-level encryption and multi-factor authentication protect your sensitive documents',
  },
  {
    icon: <FlashOnIcon sx={{ fontSize: 32, color: 'rgba(255, 255, 255, 0.9)' }} />,
    title: 'Workflow Automation',
    description: 'Automate repetitive tasks and streamline approval processes',
  },
  {
    icon: <PublicIcon sx={{ fontSize: 32, color: 'rgba(255, 255, 255, 0.9)' }} />,
    title: 'Global Access',
    description: 'Access documents from any device, anywhere in the world',
  },
];

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, error } = useSelector((state: RootState) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/organizations');
    }
  }, [isAuthenticated, navigate]);

  // Clear errors on unmount
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!email || !password) {
      return;
    }

    dispatch(loginRequest({ email, password }));
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Left Panel - Branding & Features */}
      <Box
        sx={{
          width: { xs: '0%', md: '60%' },
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          background: 'linear-gradient(135deg, #2B2947 0%, #3d3a5c 100%)',
          color: 'white',
          p: 6,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '-10%',
            right: '-10%',
            width: '60%',
            height: '60%',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.03)',
          },
        }}
      >
        {/* Logo & Brand */}
        <Box sx={{ mb: 8, zIndex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 2,
              }}
            >
              <Box
                sx={{
                  width: 8,
                  height: 32,
                  background: 'white',
                  borderRadius: 0.5,
                  mr: 0.5,
                }}
              />
              <Box
                sx={{
                  width: 8,
                  height: 32,
                  background: 'white',
                  borderRadius: 0.5,
                }}
              />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 600, letterSpacing: 1 }}>
              inShare
            </Typography>
          </Box>

          <Typography variant="h3" sx={{ fontWeight: 700, mb: 2, lineHeight: 1.3 }}>
            Secure Document Management Platform
          </Typography>
          <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 400 }}>
            Access your documents securely, automate workflows,
            <br />
            and collaborate seamlessly with your team from
            <br />
            anywhere.
          </Typography>
        </Box>

        {/* Features */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3, zIndex: 1 }}>
          {features.map((feature, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                gap: 2,
                p: 2,
                borderRadius: 2,
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: 2,
                  background: 'rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {feature.icon}
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                  {feature.title}
                </Typography>
                <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.95rem' }}>
                  {feature.description}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>

        {/* Footer */}
        <Typography sx={{ mt: 4, color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.875rem', zIndex: 1 }}>
          © 2024 inShare. All rights reserved.
        </Typography>
      </Box>

      {/* Right Panel - Login Form */}
      <Box
        sx={{
          width: { xs: '100%', md: '40%' },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#fafafa',
          p: 3,
        }}
      >
        <Container maxWidth="sm">
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, sm: 5 },
              borderRadius: 3,
              background: 'white',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            }}
          >
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: '#1a1a1a' }}>
              Welcome back
            </Typography>
            <Typography sx={{ mb: 4, color: '#666', fontSize: '1rem' }}>
              Sign in to continue to your account
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} noValidate>
              <Typography sx={{ mb: 1, fontWeight: 600, color: '#333', fontSize: '0.9rem' }}>
                Email Address
              </Typography>
              <TextField
                fullWidth
                placeholder="you@company.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
                sx={{
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    background: '#f8f8f8',
                    '&:hover': {
                      background: '#f0f0f0',
                    },
                    '&.Mui-focused': {
                      background: 'white',
                    },
                  },
                }}
              />

              <Typography sx={{ mb: 1, fontWeight: 600, color: '#333', fontSize: '0.9rem' }}>
                Password
              </Typography>
              <TextField
                fullWidth
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
                sx={{
                  mb: 4,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    background: '#f8f8f8',
                    '&:hover': {
                      background: '#f0f0f0',
                    },
                    '&.Mui-focused': {
                      background: 'white',
                    },
                  },
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={isLoading || !email || !password}
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 600,
                  background: '#2B2947',
                  boxShadow: '0 4px 12px rgba(43, 41, 71, 0.3)',
                  '&:hover': {
                    background: '#3d3a5c',
                    boxShadow: '0 6px 16px rgba(43, 41, 71, 0.4)',
                  },
                  '&:disabled': {
                    background: '#e0e0e0',
                  },
                }}
              >
                {isLoading ? (
                  <CircularProgress size={24} sx={{ color: 'white' }} />
                ) : (
                  'Sign in to your account'
                )}
              </Button>
            </Box>

            {/* Footer Links */}
            <Box
              sx={{
                mt: 4,
                pt: 3,
                borderTop: '1px solid #eee',
                display: 'flex',
                justifyContent: 'center',
                gap: 2,
                flexWrap: 'wrap',
              }}
            >
              <Link href="#" underline="none" sx={{ color: '#666', fontSize: '0.875rem' }}>
                Privacy Policy
              </Link>
              <Typography sx={{ color: '#ddd' }}>•</Typography>
              <Link href="#" underline="none" sx={{ color: '#666', fontSize: '0.875rem' }}>
                Terms of Service
              </Link>
              <Typography sx={{ color: '#ddd' }}>•</Typography>
              <Link href="#" underline="none" sx={{ color: '#666', fontSize: '0.875rem' }}>
                Support
              </Link>
            </Box>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
}
