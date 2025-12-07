// Organizations List Page - Google AI Studio inspired clean design
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
  CircularProgress,
  Alert,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  ContentCopy as ContentCopyIcon,
  BarChart as BarChartIcon,
  Business as BusinessIcon,
} from '@mui/icons-material';
import { fetchOrganizationsRequest, toggleOrganizationStatusRequest } from '../redux/slices/organizationSlice';
import type { RootState } from '../../../store/store';
import type { Organization } from '../types/organization.types';

export default function OrganizationsListPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { organizations, isLoading, error } = useSelector((state: RootState) => state.organizations);

  const [searchQuery, setSearchQuery] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [groupBy, setGroupBy] = useState<string>('organization');
  const [filterBy, setFilterBy] = useState<string>('all');

  useEffect(() => {
    dispatch(fetchOrganizationsRequest());
  }, [dispatch]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, org: Organization) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedOrg(org);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedOrg(null);
  };

  const handleViewDetails = () => {
    if (selectedOrg) {
      navigate(`/organizations/${selectedOrg.id}`);
    }
    handleMenuClose();
  };

  const handleToggleStatus = () => {
    if (selectedOrg) {
      dispatch(
        toggleOrganizationStatusRequest({
          id: selectedOrg.id,
          enable: !selectedOrg.isEnabled,
        })
      );
    }
    handleMenuClose();
  };

  const filteredOrganizations = organizations.filter((org) => {
    const matchesSearch = org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      org.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterBy === 'all') return matchesSearch;
    if (filterBy === 'active') return matchesSearch && org.isEnabled;
    if (filterBy === 'inactive') return matchesSearch && !org.isEnabled;
    if (filterBy === 'approved') return matchesSearch && org.approved;
    if (filterBy === 'pending') return matchesSearch && !org.approved;
    
    return matchesSearch;
  });

  const getPlanColor = (plan: string) => {
    const colors: Record<string, { bg: string; text: string }> = {
      free: { bg: '#f1f5f9', text: '#64748b' },
      basic: { bg: '#dbeafe', text: '#2563eb' },
      pro: { bg: '#ede9fe', text: '#7c3aed' },
      enterprise: { bg: '#fef3c7', text: '#d97706' },
    };
    return colors[plan.toLowerCase()] || { bg: '#f1f5f9', text: '#64748b' };
  };

  if (isLoading && organizations.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress size={40} sx={{ color: '#3b82f6' }} />
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography sx={{ fontWeight: 600, color: '#0f172a', fontSize: '1.125rem' }}>
            Organizations
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Button
              variant="text"
              startIcon={<BusinessIcon sx={{ fontSize: 18 }} />}
              sx={{
                textTransform: 'none',
                color: '#64748b',
                fontWeight: 500,
                fontSize: '0.8125rem',
                py: 0.75,
                px: 1.5,
                '&:hover': {
                  bgcolor: '#f8fafc',
                },
              }}
            >
              API quickstart
            </Button>
            <Button
              variant="outlined"
              startIcon={<AddIcon sx={{ fontSize: 18 }} />}
              onClick={() => navigate('/organizations/onboard')}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.8125rem',
                py: 0.75,
                px: 2,
                borderColor: '#e2e8f0',
                color: '#2B2947',
                '&:hover': {
                  borderColor: '#2B2947',
                  bgcolor: '#f8fafc',
                },
              }}
            >
              Create Organization
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Content */}
      <Box sx={{ px: 3, py: 2.5 }}>
        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 2.5,
              borderRadius: 2,
              border: '1px solid #fee2e2',
            }}
          >
            {error}
          </Alert>
        )}

        {/* Controls */}
        <Box sx={{ mb: 2.5, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Typography sx={{ color: '#64748b', fontWeight: 500, fontSize: '0.8125rem' }}>
              Group by
            </Typography>
            <ToggleButtonGroup
              value={groupBy}
              exclusive
              onChange={(_, value) => value && setGroupBy(value)}
              size="small"
              sx={{
                '& .MuiToggleButton-root': {
                  textTransform: 'none',
                  fontSize: '0.8125rem',
                  fontWeight: 500,
                  px: 1.5,
                  py: 0.5,
                  border: '1px solid #e2e8f0',
                  color: '#64748b',
                  '&.Mui-selected': {
                    bgcolor: '#2B2947',
                    color: '#ffffff',
                    borderColor: '#2B2947',
                    fontWeight: 600,
                    '&:hover': {
                      bgcolor: '#3d3a5c',
                    },
                  },
                  '&:hover': {
                    bgcolor: '#f8fafc',
                  },
                },
              }}
            >
              <ToggleButton value="organization">Organization</ToggleButton>
              <ToggleButton value="plan">Plan</ToggleButton>
            </ToggleButtonGroup>
          </Box>

          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', ml: 'auto' }}>
            <Typography sx={{ color: '#64748b', fontWeight: 500, fontSize: '0.8125rem' }}>
              Filter by
            </Typography>
            <TextField
              select
              size="small"
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
              sx={{
                minWidth: 140,
                '& .MuiOutlinedInput-root': {
                  fontSize: '0.8125rem',
                  bgcolor: '#ffffff',
                  '& fieldset': {
                    borderColor: '#e2e8f0',
                  },
                  '&:hover fieldset': {
                    borderColor: '#cbd5e1',
                  },
                },
                '& .MuiMenuItem-root': {
                  fontSize: '0.8125rem',
                },
              }}
            >
              <MenuItem value="all" sx={{ fontSize: '0.8125rem' }}>All organizations</MenuItem>
              <MenuItem value="active" sx={{ fontSize: '0.8125rem' }}>Active only</MenuItem>
              <MenuItem value="inactive" sx={{ fontSize: '0.8125rem' }}>Inactive only</MenuItem>
              <MenuItem value="approved" sx={{ fontSize: '0.8125rem' }}>Approved only</MenuItem>
              <MenuItem value="pending" sx={{ fontSize: '0.8125rem' }}>Pending only</MenuItem>
            </TextField>
          </Box>
        </Box>

        {/* Table */}
        <TableContainer sx={{ 
          border: '1px solid #e2e8f0',
          borderRadius: 2,
          bgcolor: '#ffffff',
        }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#fafafa' }}>
                <TableCell sx={{ fontWeight: 600, color: '#64748b', fontSize: '0.75rem', py: 1.25, borderBottom: '1px solid #e2e8f0' }}>
                  Organization
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#64748b', fontSize: '0.75rem', py: 1.25, borderBottom: '1px solid #e2e8f0' }}>
                  Plan
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#64748b', fontSize: '0.75rem', py: 1.25, borderBottom: '1px solid #e2e8f0' }}>
                  Created on
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#64748b', fontSize: '0.75rem', py: 1.25, borderBottom: '1px solid #e2e8f0' }}>
                  Status
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 600, color: '#64748b', fontSize: '0.75rem', py: 1.25, borderBottom: '1px solid #e2e8f0', width: 100 }}>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOrganizations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 12, borderBottom: 'none' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ 
                        width: 80, 
                        height: 80, 
                        borderRadius: '50%',
                        bgcolor: '#f8fafc',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <BusinessIcon sx={{ fontSize: 40, color: '#cbd5e1' }} />
                      </Box>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="body1" sx={{ color: '#0f172a', fontWeight: 500, mb: 0.5 }}>
                          Can't find your organizations here?
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#64748b', maxWidth: 500, mx: 'auto', mb: 2 }}>
                          {searchQuery || filterBy !== 'all' 
                            ? 'Try adjusting your search or filter criteria.'
                            : 'This list only shows organizations imported into inShare Admin. You can also create a new organization above.'}
                        </Typography>
                        {!searchQuery && filterBy === 'all' && (
                          <Button
                            variant="outlined"
                            onClick={() => navigate('/organizations/onboard')}
                            sx={{
                              textTransform: 'none',
                              fontWeight: 500,
                              borderColor: '#e2e8f0',
                              color: '#0f172a',
                              '&:hover': {
                                borderColor: '#cbd5e1',
                                bgcolor: '#f8fafc',
                              },
                            }}
                          >
                            Create organization
                          </Button>
                        )}
                      </Box>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrganizations.map((org) => {
                  const planColors = getPlanColor(org.plan);
                  return (
                    <TableRow
                      key={org.id}
                      hover
                      sx={{
                        cursor: 'pointer',
                        '&:hover': {
                          bgcolor: '#fafafa',
                        },
                        '&:last-child td': {
                          borderBottom: 'none',
                        },
                      }}
                      onClick={() => navigate(`/organizations/${org.id}`)}
                    >
                      <TableCell sx={{ py: 1.5, borderBottom: '1px solid #f1f5f9' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                          <Avatar
                            sx={{
                              width: 28,
                              height: 28,
                              bgcolor: planColors.bg,
                              color: planColors.text,
                              fontSize: '0.75rem',
                              fontWeight: 600,
                            }}
                          >
                            {org.name.charAt(0).toUpperCase()}
                          </Avatar>
                          <Box>
                            <Typography sx={{ fontWeight: 500, color: '#0f172a', fontSize: '0.8125rem' }}>
                              {org.name}
                            </Typography>
                            <Typography sx={{ color: '#64748b', fontSize: '0.6875rem' }}>
                              {org.email}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ py: 1.5, borderBottom: '1px solid #f1f5f9' }}>
                        <Typography sx={{ color: '#64748b', fontSize: '0.8125rem' }}>
                          {org.plan.charAt(0).toUpperCase() + org.plan.slice(1)}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ py: 1.5, borderBottom: '1px solid #f1f5f9' }}>
                        <Typography sx={{ color: '#64748b', fontSize: '0.8125rem' }}>
                          {org.createdAt ? new Date(org.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          }) : '-'}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ py: 1.5, borderBottom: '1px solid #f1f5f9' }}>
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          <Chip
                            label={org.isEnabled ? 'Active' : 'Inactive'}
                            size="small"
                            sx={{
                              height: 18,
                              fontSize: '0.6875rem',
                              fontWeight: 500,
                              bgcolor: org.isEnabled ? '#dcfce7' : '#fee2e2',
                              color: org.isEnabled ? '#16a34a' : '#dc2626',
                              '& .MuiChip-label': {
                                px: 0.75,
                              },
                            }}
                          />
                        </Box>
                      </TableCell>
                      <TableCell align="right" sx={{ py: 1.5, borderBottom: '1px solid #f1f5f9' }}>
                        <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
                          <IconButton
                            size="small"
                            sx={{ 
                              color: '#64748b',
                              '&:hover': {
                                bgcolor: '#f8fafc',
                              },
                            }}
                          >
                            <ContentCopyIcon sx={{ fontSize: 18 }} />
                          </IconButton>
                          <IconButton
                            size="small"
                            sx={{ 
                              color: '#64748b',
                              '&:hover': {
                                bgcolor: '#f8fafc',
                              },
                            }}
                          >
                            <BarChartIcon sx={{ fontSize: 18 }} />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={(e) => handleMenuOpen(e, org)}
                            sx={{ 
                              color: '#64748b',
                              '&:hover': {
                                bgcolor: '#f8fafc',
                              },
                            }}
                          >
                            <MoreVertIcon sx={{ fontSize: 18 }} />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Action Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            sx: {
              borderRadius: 2,
              minWidth: 180,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e2e8f0',
            },
          }}
        >
          <MenuItem onClick={handleViewDetails} sx={{ py: 1, fontSize: '0.875rem' }}>
            <VisibilityIcon sx={{ mr: 1.5, fontSize: 18, color: '#64748b' }} />
            View Details
          </MenuItem>
          <MenuItem onClick={handleViewDetails} sx={{ py: 1, fontSize: '0.875rem' }}>
            <EditIcon sx={{ mr: 1.5, fontSize: 18, color: '#64748b' }} />
            Edit
          </MenuItem>
          <MenuItem onClick={handleToggleStatus} sx={{ py: 1, fontSize: '0.875rem' }}>
            {selectedOrg?.isEnabled ? (
              <CancelIcon sx={{ mr: 1.5, fontSize: 18, color: '#dc2626' }} />
            ) : (
              <CheckCircleIcon sx={{ mr: 1.5, fontSize: 18, color: '#16a34a' }} />
            )}
            {selectedOrg?.isEnabled ? 'Disable' : 'Enable'}
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
}
