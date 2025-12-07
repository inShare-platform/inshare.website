// Onboard Organization Page - Clean form with external labels
import { useState } from 'react';
import type { FormEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  TextField,
  Alert,
  CircularProgress,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Paper,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  ContentCopy as ContentCopyIcon,
} from '@mui/icons-material';
import { createUserRequest, clearCreatedUser, clearError } from '../redux/slices/organizationSlice';
import type { RootState } from '../../../store/store';
import type { CreateUserRequest } from '../types/organization.types';

export default function OnboardOrganizationPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error, createdUser } = useSelector((state: RootState) => state.organizations);

  const [formData, setFormData] = useState({
    adminFullName: '',
    adminEmail: '',
    organizationName: '',
    organizationEmail: '',
    phoneNumber: '',
    websiteUrl: '',
    numberOfPeople: '',
    plan: 'pro',
    comments: '',
  });

  const [copied, setCopied] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const request: CreateUserRequest = {
      fullName: formData.adminFullName,
      email: formData.adminEmail,
      organization: {
        name: formData.organizationName,
        email: formData.organizationEmail,
        phoneNumber: formData.phoneNumber || undefined,
        websiteUrl: formData.websiteUrl || undefined,
        numberOfPeople: formData.numberOfPeople ? parseInt(formData.numberOfPeople) : undefined,
        plan: formData.plan,
        comments: formData.comments || undefined,
      },
    };

    dispatch(createUserRequest(request));
  };

  const handleCopyPassword = () => {
    if (createdUser?.temporaryPassword) {
      navigator.clipboard.writeText(createdUser.temporaryPassword);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCloseDialog = () => {
    dispatch(clearCreatedUser());
    dispatch(clearError());
    navigate('/organizations');
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#ffffff' }}>
      {/* Header */}
      <Box sx={{ 
        borderBottom: '1px solid #e2e8f0',
        bgcolor: '#ffffff',
        px: 3,
        py: 2,
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
          <IconButton 
            size="small" 
            onClick={() => navigate('/organizations')}
            sx={{ color: '#64748b' }}
          >
            <ArrowBackIcon sx={{ fontSize: 20 }} />
          </IconButton>
          <Typography sx={{ fontWeight: 600, color: '#0f172a', fontSize: '1.125rem' }}>
            Create Organization
          </Typography>
        </Box>
      </Box>

      {/* Content */}
      <Box sx={{ px: 3, py: 3, maxWidth: 900, mx: 'auto' }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2, fontSize: '0.8125rem' }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          {/* Admin Details */}
          <Box sx={{ mb: 3 }}>
            <Typography sx={{ fontWeight: 600, color: '#0f172a', fontSize: '0.9375rem', mb: 2.5 }}>
              Admin User
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 2.5 }}>
              <Box>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: '#64748b', mb: 0.75 }}>
                  Full Name *
                </Typography>
                <TextField
                  size="small"
                  required
                  placeholder="Full Name"
                  value={formData.adminFullName}
                  onChange={(e) => handleChange('adminFullName', e.target.value)}
                  disabled={isLoading}
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      fontSize: '0.875rem',
                      bgcolor: '#ffffff',
                      '& fieldset': {
                        borderColor: '#e2e8f0',
                      },
                      '&:hover fieldset': {
                        borderColor: '#cbd5e1',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#2B2947',
                        borderWidth: 1,
                      },
                    },
                  }}
                />
              </Box>

              <Box>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: '#64748b', mb: 0.75 }}>
                  Email *
                </Typography>
                <TextField
                  size="small"
                  required
                  type="email"
                  placeholder="Email"
                  value={formData.adminEmail}
                  onChange={(e) => handleChange('adminEmail', e.target.value)}
                  disabled={isLoading}
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      fontSize: '0.875rem',
                      bgcolor: '#ffffff',
                      '& fieldset': {
                        borderColor: '#e2e8f0',
                      },
                      '&:hover fieldset': {
                        borderColor: '#cbd5e1',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#2B2947',
                        borderWidth: 1,
                      },
                    },
                  }}
                />
              </Box>
            </Box>
          </Box>

          {/* Organization Details */}
          <Box sx={{ mb: 3 }}>
            <Typography sx={{ fontWeight: 600, color: '#0f172a', fontSize: '0.9375rem', mb: 2.5 }}>
              Organization Details
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 2.5 }}>
              <Box>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: '#64748b', mb: 0.75 }}>
                  Organization Name *
                </Typography>
                <TextField
                  size="small"
                  required
                  placeholder="Organization Name"
                  value={formData.organizationName}
                  onChange={(e) => handleChange('organizationName', e.target.value)}
                  disabled={isLoading}
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      fontSize: '0.875rem',
                      bgcolor: '#ffffff',
                      '& fieldset': {
                        borderColor: '#e2e8f0',
                      },
                      '&:hover fieldset': {
                        borderColor: '#cbd5e1',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#2B2947',
                        borderWidth: 1,
                      },
                    },
                  }}
                />
              </Box>

              <Box>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: '#64748b', mb: 0.75 }}>
                  Email *
                </Typography>
                <TextField
                  size="small"
                  required
                  type="email"
                  placeholder="Email"
                  value={formData.organizationEmail}
                  onChange={(e) => handleChange('organizationEmail', e.target.value)}
                  disabled={isLoading}
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      fontSize: '0.875rem',
                      bgcolor: '#ffffff',
                      '& fieldset': {
                        borderColor: '#e2e8f0',
                      },
                      '&:hover fieldset': {
                        borderColor: '#cbd5e1',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#2B2947',
                        borderWidth: 1,
                      },
                    },
                  }}
                />
              </Box>

              <Box>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: '#64748b', mb: 0.75 }}>
                  Phone Number
                </Typography>
                <TextField
                  size="small"
                  placeholder="Phone Number"
                  value={formData.phoneNumber}
                  onChange={(e) => handleChange('phoneNumber', e.target.value)}
                  disabled={isLoading}
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      fontSize: '0.875rem',
                      bgcolor: '#ffffff',
                      '& fieldset': {
                        borderColor: '#e2e8f0',
                      },
                      '&:hover fieldset': {
                        borderColor: '#cbd5e1',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#2B2947',
                        borderWidth: 1,
                      },
                    },
                  }}
                />
              </Box>

              <Box>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: '#64748b', mb: 0.75 }}>
                  Website URL
                </Typography>
                <TextField
                  size="small"
                  placeholder="Website URL"
                  value={formData.websiteUrl}
                  onChange={(e) => handleChange('websiteUrl', e.target.value)}
                  disabled={isLoading}
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      fontSize: '0.875rem',
                      bgcolor: '#ffffff',
                      '& fieldset': {
                        borderColor: '#e2e8f0',
                      },
                      '&:hover fieldset': {
                        borderColor: '#cbd5e1',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#2B2947',
                        borderWidth: 1,
                      },
                    },
                  }}
                />
              </Box>

              <Box>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: '#64748b', mb: 0.75 }}>
                  Team Size
                </Typography>
                <TextField
                  size="small"
                  type="number"
                  placeholder="Team Size"
                  value={formData.numberOfPeople}
                  onChange={(e) => handleChange('numberOfPeople', e.target.value)}
                  disabled={isLoading}
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      fontSize: '0.875rem',
                      bgcolor: '#ffffff',
                      '& fieldset': {
                        borderColor: '#e2e8f0',
                      },
                      '&:hover fieldset': {
                        borderColor: '#cbd5e1',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#2B2947',
                        borderWidth: 1,
                      },
                    },
                  }}
                />
              </Box>

              <Box>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: '#64748b', mb: 0.75 }}>
                  Plan *
                </Typography>
                <TextField
                  size="small"
                  required
                  select
                  placeholder="Select Plan"
                  value={formData.plan}
                  onChange={(e) => handleChange('plan', e.target.value)}
                  disabled={isLoading}
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      fontSize: '0.875rem',
                      bgcolor: '#ffffff',
                      '& fieldset': {
                        borderColor: '#e2e8f0',
                      },
                      '&:hover fieldset': {
                        borderColor: '#cbd5e1',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#2B2947',
                        borderWidth: 1,
                      },
                    },
                  }}
                >
                  <MenuItem value="free">Free</MenuItem>
                  <MenuItem value="basic">Basic</MenuItem>
                  <MenuItem value="pro">Pro</MenuItem>
                  <MenuItem value="enterprise">Enterprise</MenuItem>
                </TextField>
              </Box>

              <Box sx={{ gridColumn: { xs: '1', md: 'span 2' } }}>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: '#64748b', mb: 0.75 }}>
                  Comments
                </Typography>
                <TextField
                  size="small"
                  fullWidth
                  multiline
                  rows={3}
                  placeholder="Comments"
                  value={formData.comments}
                  onChange={(e) => handleChange('comments', e.target.value)}
                  disabled={isLoading}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      fontSize: '0.875rem',
                      bgcolor: '#ffffff',
                      '& fieldset': {
                        borderColor: '#e2e8f0',
                      },
                      '&:hover fieldset': {
                        borderColor: '#cbd5e1',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#2B2947',
                        borderWidth: 1,
                      },
                    },
                  }}
                />
              </Box>
            </Box>
          </Box>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'flex-end', pt: 1 }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/organizations')}
              disabled={isLoading}
              sx={{
                px: 3,
                py: 0.75,
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.8125rem',
                borderColor: '#e2e8f0',
                color: '#64748b',
                '&:hover': {
                  borderColor: '#cbd5e1',
                  bgcolor: '#f8fafc',
                },
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isLoading}
              sx={{
                px: 3,
                py: 0.75,
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.8125rem',
                background: '#2B2947',
                '&:hover': {
                  background: '#1f1d33',
                },
              }}
            >
              {isLoading ? <CircularProgress size={20} sx={{ color: 'white' }} /> : 'Create Organization'}
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Success Dialog */}
      <Dialog
        open={Boolean(createdUser)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ fontWeight: 600, fontSize: '1.125rem', pb: 2 }}>
          Organization Created! 🎉
        </DialogTitle>
        <DialogContent>
          <Alert severity="success" sx={{ mb: 2, fontSize: '0.8125rem' }}>
            Organization and admin account created successfully.
          </Alert>

          <Box sx={{ mb: 2 }}>
            <Typography sx={{ color: '#64748b', fontSize: '0.75rem', mb: 0.5 }}>
              Admin Email
            </Typography>
            <Typography sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
              {createdUser?.user?.email}
            </Typography>
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography sx={{ color: '#64748b', fontSize: '0.75rem', mb: 0.5 }}>
              Temporary Password
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Paper
                sx={{
                  flex: 1,
                  p: 1.5,
                  backgroundColor: '#f8fafc',
                  fontFamily: 'monospace',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  border: '1px solid #e2e8f0',
                  borderRadius: 1.5,
                }}
              >
                {createdUser?.temporaryPassword}
              </Paper>
              <IconButton 
                size="small" 
                onClick={handleCopyPassword} 
                sx={{ color: '#2B2947' }}
              >
                <ContentCopyIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Box>
            {copied && (
              <Typography sx={{ color: '#10b981', fontSize: '0.75rem', mt: 0.5 }}>
                ✓ Copied to clipboard
              </Typography>
            )}
          </Box>

          <Alert severity="warning" sx={{ fontSize: '0.8125rem' }}>
            <strong>Important:</strong> Send this password to the admin. They must change it on first login.
          </Alert>
        </DialogContent>
        <DialogActions sx={{ p: 2.5, pt: 0 }}>
          <Button
            onClick={handleCloseDialog}
            variant="contained"
            fullWidth
            sx={{
              py: 1,
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.8125rem',
              background: '#2B2947',
              '&:hover': {
                background: '#1f1d33',
              },
            }}
          >
            Done
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
