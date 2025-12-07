// Dashboard Page - Metrics and Statistics
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
} from '@mui/material';
import {
  Business as BusinessIcon,
  CheckCircle as CheckCircleIcon,
  TrendingUp as TrendingUpIcon,
  Cancel as CancelIcon,
  People as PeopleIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';
import { fetchOrganizationsRequest } from '../../organizations/redux/slices/organizationSlice';
import type { RootState } from '../../../store/store';

export default function DashboardPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { organizations, isLoading } = useSelector((state: RootState) => state.organizations);

  useEffect(() => {
    dispatch(fetchOrganizationsRequest());
  }, [dispatch]);

  const totalOrgs = organizations.length;
  const activeOrgs = organizations.filter(o => o.isEnabled).length;
  const approvedOrgs = organizations.filter(o => o.approved).length;
  const pendingOrgs = organizations.filter(o => !o.approved).length;
  const totalUsers = organizations.reduce((sum, org) => sum + (org.numberOfPeople || 0), 0);

  const metrics = [
    {
      title: 'Total Organizations',
      value: totalOrgs,
      icon: <BusinessIcon sx={{ fontSize: 32 }} />,
      color: '#3b82f6',
      bgColor: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    },
    {
      title: 'Active Organizations',
      value: activeOrgs,
      icon: <CheckCircleIcon sx={{ fontSize: 32 }} />,
      color: '#10b981',
      bgColor: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    },
    {
      title: 'Approved',
      value: approvedOrgs,
      icon: <TrendingUpIcon sx={{ fontSize: 32 }} />,
      color: '#8b5cf6',
      bgColor: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
    },
    {
      title: 'Pending Approval',
      value: pendingOrgs,
      icon: <CancelIcon sx={{ fontSize: 32 }} />,
      color: '#f59e0b',
      bgColor: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    },
    {
      title: 'Total Users',
      value: totalUsers,
      icon: <PeopleIcon sx={{ fontSize: 32 }} />,
      color: '#ec4899',
      bgColor: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
    },
    {
      title: 'Inactive Organizations',
      value: totalOrgs - activeOrgs,
      icon: <AssessmentIcon sx={{ fontSize: 32 }} />,
      color: '#64748b',
      bgColor: 'linear-gradient(135deg, #64748b 0%, #475569 100%)',
    },
  ];

  if (isLoading && organizations.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress size={40} sx={{ color: '#2B2947' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#ffffff' }}>
      {/* Header */}
      <Box sx={{ 
        borderBottom: '1px solid #e2e8f0',
        bgcolor: '#ffffff',
        px: 3,
        py: 2,
      }}>
        <Typography sx={{ fontWeight: 600, color: '#0f172a', fontSize: '1.125rem' }}>
          Dashboard
        </Typography>
        <Typography sx={{ color: '#64748b', fontSize: '0.8125rem', mt: 0.5 }}>
          Overview of your organizations and metrics
        </Typography>
      </Box>

      {/* Content */}
      <Box sx={{ px: 3, py: 3 }}>
        {/* Metrics Grid */}
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
          gap: 3,
          mb: 4,
        }}>
          {metrics.map((metric, index) => (
            <Card
              key={index}
              sx={{
                borderRadius: 3,
                border: '1px solid #e2e8f0',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: '0 4px 12px 0 rgba(0, 0, 0, 0.15)',
                  transform: 'translateY(-4px)',
                },
              }}
              onClick={() => navigate('/organizations')}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box>
                    <Typography sx={{ color: '#64748b', fontSize: '0.8125rem', fontWeight: 500, mb: 1 }}>
                      {metric.title}
                    </Typography>
                    <Typography sx={{ fontSize: '2rem', fontWeight: 700, color: '#0f172a' }}>
                      {metric.value}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: 2,
                      background: metric.bgColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                    }}
                  >
                    {metric.icon}
                  </Box>
                </Box>
                <Box sx={{ 
                  height: 4, 
                  borderRadius: 2,
                  background: `linear-gradient(90deg, ${metric.color} 0%, ${metric.color}40 100%)`,
                  mt: 2,
                }} />
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* Quick Stats */}
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
          gap: 3,
        }}>
          {/* Plan Distribution */}
          <Card sx={{ 
            borderRadius: 3, 
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          }}>
            <CardContent sx={{ p: 3 }}>
              <Typography sx={{ fontWeight: 600, color: '#0f172a', fontSize: '1rem', mb: 3 }}>
                Plan Distribution
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {['free', 'basic', 'pro', 'enterprise'].map((plan) => {
                  const count = organizations.filter(o => o.plan.toLowerCase() === plan).length;
                  const percentage = totalOrgs > 0 ? (count / totalOrgs) * 100 : 0;
                  const colors: Record<string, string> = {
                    free: '#94a3b8',
                    basic: '#3b82f6',
                    pro: '#8b5cf6',
                    enterprise: '#f59e0b',
                  };
                  return (
                    <Box key={plan}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography sx={{ fontSize: '0.8125rem', fontWeight: 500, color: '#0f172a', textTransform: 'capitalize' }}>
                          {plan}
                        </Typography>
                        <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: '#64748b' }}>
                          {count} ({percentage.toFixed(0)}%)
                        </Typography>
                      </Box>
                      <Box sx={{ 
                        height: 8, 
                        borderRadius: 1,
                        bgcolor: '#f1f5f9',
                        overflow: 'hidden',
                      }}>
                        <Box sx={{ 
                          height: '100%', 
                          width: `${percentage}%`,
                          bgcolor: colors[plan],
                          transition: 'width 0.3s ease',
                        }} />
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            </CardContent>
          </Card>

          {/* Status Overview */}
          <Card sx={{ 
            borderRadius: 3, 
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          }}>
            <CardContent sx={{ p: 3 }}>
              <Typography sx={{ fontWeight: 600, color: '#0f172a', fontSize: '1rem', mb: 3 }}>
                Status Overview
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{ 
                      width: 40, 
                      height: 40, 
                      borderRadius: 2,
                      bgcolor: '#dcfce7',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <CheckCircleIcon sx={{ color: '#16a34a', fontSize: 20 }} />
                    </Box>
                    <Typography sx={{ fontSize: '0.8125rem', fontWeight: 500, color: '#0f172a' }}>
                      Active & Approved
                    </Typography>
                  </Box>
                  <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, color: '#16a34a' }}>
                    {organizations.filter(o => o.isEnabled && o.approved).length}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{ 
                      width: 40, 
                      height: 40, 
                      borderRadius: 2,
                      bgcolor: '#fef3c7',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <CancelIcon sx={{ color: '#d97706', fontSize: 20 }} />
                    </Box>
                    <Typography sx={{ fontSize: '0.8125rem', fontWeight: 500, color: '#0f172a' }}>
                      Needs Attention
                    </Typography>
                  </Box>
                  <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, color: '#d97706' }}>
                    {organizations.filter(o => !o.isEnabled || !o.approved).length}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{ 
                      width: 40, 
                      height: 40, 
                      borderRadius: 2,
                      bgcolor: '#fee2e2',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <CancelIcon sx={{ color: '#dc2626', fontSize: 20 }} />
                    </Box>
                    <Typography sx={{ fontSize: '0.8125rem', fontWeight: 500, color: '#0f172a' }}>
                      Inactive
                    </Typography>
                  </Box>
                  <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, color: '#dc2626' }}>
                    {totalOrgs - activeOrgs}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
}