// Login Page - With feature slider
import { useState, useEffect, useMemo, useCallback } from 'react';
import type { FormEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  keyframes,
} from '@mui/material';
import {
  Rocket as RocketIcon,
  Chat as ChatIcon,
  BarChart as BarChartIcon,
  ArrowForward as ArrowForwardIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { loginRequest, clearError } from '../redux/slices/authSlice';
import type { RootState } from '../../../store/store';

// Animations
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const sparkle = keyframes`
  0%, 100% {
    opacity: 0;
    transform: scale(0);
  }
  50% {
    opacity: 1;
    transform: scale(1);
  }
`;

const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-15px);
  }
`;

const twinkle = keyframes`
  0%, 100% {
    opacity: 0.3;
  }
  50% {
    opacity: 1;
  }
`;

interface Feature {
  icon: React.ReactElement;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: <RocketIcon sx={{ fontSize: 48, color: 'white' }} />,
    title: 'Full CRM + WhatsApp Automation',
    description: 'AI Email + Dynamic Form Builder in ONE platform. Complete AI marketing automation and AI in digital marketing capabilities.',
  },
  {
    icon: <ChatIcon sx={{ fontSize: 48, color: 'white' }} />,
    title: 'AI Chat-Based Form Assistant',
    description: 'Dynamic Form Builder - Revolutionary form creation & filling. Stop using multiple tools with our 5-in-1 platform.',
  },
  {
    icon: <BarChartIcon sx={{ fontSize: 48, color: 'white' }} />,
    title: 'AI Digital Marketing Platform',
    description: 'AI digital marketing with dynamic forms, content tracker, pipeline management & AI in digital marketing.',
  },
];

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, error } = useSelector((state: RootState) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-advance slider
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % features.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

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

  const handlePrevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + features.length) % features.length);
  }, []);

  const handleNextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % features.length);
  }, []);

  // Memoize the right side slider to prevent re-renders on input changes
  const rightSideSlider = useMemo(() => (
    <Box
      sx={{
        width: { xs: '0%', md: '50%' },
        display: { xs: 'none', md: 'flex' },
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #2B2947 0%, #1a1730 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Animated Grid Background */}
      <Box
        sx={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
          opacity: 0.5,
        }}
      />

      {/* Animated Sparkles */}
      {Array.from({ length: 30 }).map((_, i) => (
        <Box
          key={`sparkle-${i}`}
          sx={{
            position: 'absolute',
            width: i % 3 === 0 ? 4 : i % 2 === 0 ? 3 : 2,
            height: i % 3 === 0 ? 4 : i % 2 === 0 ? 3 : 2,
            background: 'white',
            borderRadius: '50%',
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animation: `${sparkle} ${3 + Math.random() * 4}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 5}s`,
            boxShadow: '0 0 10px rgba(255, 255, 255, 0.8)',
          }}
        />
      ))}

      {/* Floating Stars */}
      {Array.from({ length: 15 }).map((_, i) => (
        <Box
          key={`star-${i}`}
          sx={{
            position: 'absolute',
            width: 0,
            height: 0,
            top: `${10 + Math.random() * 80}%`,
            left: `${10 + Math.random() * 80}%`,
            animation: `${float} ${4 + Math.random() * 3}s ease-in-out infinite, ${twinkle} ${2 + Math.random() * 2}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 3}s`,
            '&::before, &::after': {
              content: '""',
              position: 'absolute',
              background: 'white',
              boxShadow: '0 0 8px rgba(255, 255, 255, 0.6)',
            },
            '&::before': {
              width: 12,
              height: 2,
              left: -6,
              top: -1,
            },
            '&::after': {
              width: 2,
              height: 12,
              left: -1,
              top: -6,
            },
          }}
        />
      ))}

      {/* Glowing Orbs */}
      {Array.from({ length: 8 }).map((_, i) => (
        <Box
          key={`orb-${i}`}
          sx={{
            position: 'absolute',
            width: 60 + Math.random() * 40,
            height: 60 + Math.random() * 40,
            borderRadius: '50%',
            background: `radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, transparent 70%)`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animation: `${float} ${6 + Math.random() * 4}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 4}s`,
            filter: 'blur(20px)',
          }}
        />
      ))}

      {/* Slider Content */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          maxWidth: 500,
          px: 6,
        }}
      >
        {/* Feature Card */}
        <Box
          key={currentSlide}
          sx={{
            animation: `${fadeIn} 0.6s ease-out`,
            textAlign: 'center',
          }}
        >
          {/* Icon */}
          <Box
            sx={{
              width: 100,
              height: 100,
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 3rem',
              animation: `${slideIn} 0.8s ease-out`,
            }}
          >
            {features[currentSlide].icon}
          </Box>

          {/* Title */}
          <Typography
            sx={{
              fontSize: '1.75rem',
              fontWeight: 700,
              color: 'white',
              mb: 2,
              lineHeight: 1.3,
            }}
          >
            {features[currentSlide].title}
          </Typography>

          {/* Description */}
          <Typography
            sx={{
              fontSize: '1rem',
              color: 'rgba(255, 255, 255, 0.8)',
              lineHeight: 1.6,
              mb: 4,
            }}
          >
            {features[currentSlide].description}
          </Typography>
        </Box>

        {/* Navigation Controls */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 3,
            mt: 4,
          }}
        >
          {/* Previous Button */}
          <Box
            onClick={handlePrevSlide}
            sx={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s',
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.2)',
                transform: 'scale(1.1)',
              },
            }}
          >
            <ArrowBackIcon sx={{ color: 'white', fontSize: 20 }} />
          </Box>

          {/* Dots Indicator */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            {features.map((_, index) => (
              <Box
                key={index}
                onClick={() => setCurrentSlide(index)}
                sx={{
                  width: currentSlide === index ? 24 : 8,
                  height: 8,
                  borderRadius: 4,
                  background: currentSlide === index ? 'white' : 'rgba(255, 255, 255, 0.3)',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.6)',
                  },
                }}
              />
            ))}
          </Box>

          {/* Next Button */}
          <Box
            onClick={handleNextSlide}
            sx={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s',
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.2)',
                transform: 'scale(1.1)',
              },
            }}
          >
            <ArrowForwardIcon sx={{ color: 'white', fontSize: 20 }} />
          </Box>
        </Box>
      </Box>

      {/* Bottom Tagline */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 40,
          left: 0,
          right: 0,
          textAlign: 'center',
          zIndex: 2,
        }}
      >
        <Typography sx={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.125rem', fontWeight: 600 }}>
          AI Digital Marketing Platform with AI Marketing Automation
        </Typography>
      </Box>
    </Box>
  ), [currentSlide, handlePrevSlide, handleNextSlide]);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', overflow: 'hidden' }}>
      {/* Left Side - Login Form */}
      <Box
        sx={{
          width: { xs: '100%', md: '50%' },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#ffffff',
          p: 3,
          position: 'relative',
          zIndex: 2,
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 420, px: 2 }}>
          {/* Logo */}
          <Box sx={{ mb: 5 }}>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1.5,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 40,
                  height: 40,
                  borderRadius: 1.5,
                  background: '#2B2947',
                }}
              >
                <Box
                  sx={{
                    width: 8,
                    height: 28,
                    background: 'white',
                    borderRadius: 0.75,
                    mr: 0.5,
                  }}
                />
                <Box
                  sx={{
                    width: 8,
                    height: 28,
                    background: 'white',
                    borderRadius: 0.75,
                  }}
                />
              </Box>
              <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', letterSpacing: 0.5 }}>
                inShare
              </Typography>
            </Box>
          </Box>

          {/* Title */}
          <Typography sx={{ fontSize: '2rem', fontWeight: 700, color: '#0f172a', mb: 1 }}>
            Sign in
          </Typography>
          <Typography sx={{ fontSize: '1rem', color: '#64748b', mb: 4 }}>
            to continue to inShare
          </Typography>

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2, fontSize: '0.875rem' }}>
              {error}
            </Alert>
          )}

          {/* Email/Password Form */}
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              fullWidth
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  fontSize: '0.9375rem',
                  borderRadius: 2,
                  '& fieldset': {
                    borderColor: '#e2e8f0',
                  },
                  '&:hover fieldset': {
                    borderColor: '#cbd5e1',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#2B2947',
                    borderWidth: 2,
                  },
                },
                '& .MuiOutlinedInput-input': {
                  py: 1.5,
                },
              }}
            />

            <TextField
              fullWidth
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  fontSize: '0.9375rem',
                  borderRadius: 2,
                  '& fieldset': {
                    borderColor: '#e2e8f0',
                  },
                  '&:hover fieldset': {
                    borderColor: '#cbd5e1',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#2B2947',
                    borderWidth: 2,
                  },
                },
                '& .MuiOutlinedInput-input': {
                  py: 1.5,
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
                fontSize: '0.9375rem',
                fontWeight: 600,
                background: '#2B2947',
                boxShadow: 'none',
                '&:hover': {
                  background: '#1f1d33',
                  boxShadow: '0 4px 12px rgba(43, 41, 71, 0.3)',
                },
                '&:disabled': {
                  background: '#e2e8f0',
                  color: '#94a3b8',
                },
              }}
            >
              {isLoading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Continue'}
            </Button>
          </Box>

          {/* Footer Links */}
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography sx={{ fontSize: '0.875rem', color: '#64748b' }}>
              Don't have an account?{' '}
              <Typography
                component="span"
                sx={{
                  color: '#2B2947',
                  fontWeight: 600,
                  cursor: 'pointer',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                Sign up
              </Typography>
            </Typography>
          </Box>

          {/* Terms */}
          <Typography sx={{ mt: 4, fontSize: '0.75rem', color: '#94a3b8', textAlign: 'center', lineHeight: 1.6 }}>
            By continuing, you agree to inShare's{' '}
            <Typography component="span" sx={{ color: '#64748b', textDecoration: 'underline', cursor: 'pointer' }}>
              Terms of Service
            </Typography>{' '}
            and{' '}
            <Typography component="span" sx={{ color: '#64748b', textDecoration: 'underline', cursor: 'pointer' }}>
              Privacy Policy
            </Typography>
          </Typography>
        </Box>
      </Box>

      {/* Right Side - Feature Slider (Memoized) */}
      {rightSideSlider}
    </Box>
  );
}
