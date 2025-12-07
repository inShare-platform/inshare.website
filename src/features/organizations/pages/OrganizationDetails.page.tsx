// Organization Details Page - Grid layout
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Chip,
  IconButton,
  CircularProgress,
  Alert,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Switch,
  FormControlLabel,
  Paper,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  ToggleOn as ToggleOnIcon,
  ToggleOff as ToggleOffIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Language as LanguageIcon,
  People as PeopleIcon,
  CalendarToday as CalendarIcon,
  LockReset as LockResetIcon,
  Payment as PaymentIcon,
  WhatsApp as WhatsAppIcon,
  Extension as ExtensionIcon,
  Send as SendIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import {
  fetchOrganizationsRequest,
  toggleOrganizationStatusRequest,
  approveOrganizationRequest,
  updateOrganizationRequest
} from '../redux/slices/organizationSlice';
import type { RootState } from '../../../store/store';

export default function OrganizationDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { organizations, isLoading } = useSelector((state: RootState) => state.organizations);

  const organization = organizations.find(org => org.id === id);

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [resetPasswordDialog, setResetPasswordDialog] = useState(false);
  const [sendMessageDialog, setSendMessageDialog] = useState(false);
  const [featureSearch, setFeatureSearch] = useState('');
  const [messageForm, setMessageForm] = useState({
    subject: '',
    message: '',
    channel: 'email',
  });
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    websiteUrl: '',
    numberOfPeople: '',
    plan: '',
    comments: '',
  });

  const [features, setFeatures] = useState({
    generateContent: true,
    generateImage: true,
    generateBlog: true,
    createPublishForm: true,
    sharePost: true,
    postTracking: true,
    leadCaptureCRM: true,
    autoAssignEmployee: true,
    meetingSchedule: true,
    emailTracking: true,
    postDemoEmailFollowup: true,
    postDemoWhatsappFollowup: true,
    preDemoEmailFollowup: true,
    preDemoWhatsappFollowup: true,
  });

  useEffect(() => {
    if (organizations.length === 0) {
      dispatch(fetchOrganizationsRequest());
    }
  }, [dispatch, organizations.length]);

  const handleToggleStatus = () => {
    if (organization) {
      dispatch(toggleOrganizationStatusRequest({ id: organization.id, enable: !organization.isEnabled }));
    }
  };

  const handleApprove = () => {
    if (organization && !organization.approved) {
      dispatch(approveOrganizationRequest(organization.id));
    }
  };

  const handleEditClick = () => {
    if (organization) {
      setEditForm({
        name: organization.name || '',
        email: organization.email || '',
        phoneNumber: organization.phoneNumber || '',
        websiteUrl: organization.websiteUrl || '',
        numberOfPeople: organization.numberOfPeople?.toString() || '',
        plan: organization.plan || '',
        comments: organization.comments || '',
      });
      setEditDialogOpen(true);
    }
  };

  const handleEditSave = () => {
    if (organization) {
      dispatch(
        updateOrganizationRequest({
          id: organization.id,
          data: {
            name: editForm.name,
            email: editForm.email,
            phoneNumber: editForm.phoneNumber || undefined,
            websiteUrl: editForm.websiteUrl || undefined,
            numberOfPeople: editForm.numberOfPeople ? parseInt(editForm.numberOfPeople) : undefined,
            plan: editForm.plan as 'free' | 'basic' | 'pro' | 'enterprise',
            comments: editForm.comments || undefined,
          },
        })
      );
      setEditDialogOpen(false);
    }
  };

  const handleFeatureToggle = (feature: string) => {
    setFeatures(prev => ({ ...prev, [feature]: !prev[feature as keyof typeof features] }));
  };

  const featuresList = [
    { key: 'generateContent', label: 'Generate Content' },
    { key: 'generateImage', label: 'Generate Image' },
    { key: 'generateBlog', label: 'Generate Blog' },
    { key: 'createPublishForm', label: 'Create & Publish Form' },
    { key: 'sharePost', label: 'Share Post' },
    { key: 'postTracking', label: 'Post Tracking' },
    { key: 'leadCaptureCRM', label: 'Lead Capture CRM' },
    { key: 'autoAssignEmployee', label: 'Auto Assign To Employee' },
    { key: 'meetingSchedule', label: 'Meeting Schedule' },
    { key: 'emailTracking', label: 'Email Tracking' },
    { key: 'postDemoEmailFollowup', label: 'Post Demo Email Followup' },
    { key: 'postDemoWhatsappFollowup', label: 'Post Demo WhatsApp Followup' },
    { key: 'preDemoEmailFollowup', label: 'Pre Demo Email Followup' },
    { key: 'preDemoWhatsappFollowup', label: 'Pre Demo WhatsApp Followup' },
  ];

  const filteredFeatures = featuresList.filter(feature =>
    feature.label.toLowerCase().includes(featureSearch.toLowerCase())
  );

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
        <CircularProgress size={40} sx={{ color: '#2B2947' }} />
      </Box>
    );
  }

  if (!organization) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: '#ffffff' }}>
        <Box sx={{ borderBottom: '1px solid #e2e8f0', px: 3, py: 2 }}>
          <IconButton size="small" onClick={() => navigate('/organizations')} sx={{ color: '#64748b' }}>
            <ArrowBackIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </Box>
        <Box sx={{ px: 3, py: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <Alert severity="error" sx={{ borderRadius: 2, fontSize: '0.8125rem', maxWidth: 600, width: '100%' }}>
            Organization not found.
          </Alert>
          <Button
            variant="contained"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/organizations')}
            sx={{ textTransform: 'none', fontWeight: 600, fontSize: '0.8125rem', py: 1, px: 3, bgcolor: '#2B2947', '&:hover': { bgcolor: '#1f1d33' } }}
          >
            Back to Organizations
          </Button>
        </Box>
      </Box>
    );
  }

  const org = organization;
  const planColors = getPlanColor(org.plan);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc' }}>
      {/* Header */}
      <Box sx={{ borderBottom: '1px solid #e2e8f0', bgcolor: '#ffffff', px: 3, py: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <IconButton size="small" onClick={() => navigate('/organizations')} sx={{ color: '#64748b' }}>
            <ArrowBackIcon sx={{ fontSize: 20 }} />
          </IconButton>
          <Typography sx={{ fontWeight: 600, color: '#0f172a', fontSize: '1.125rem' }}>Organization Details</Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ width: 48, height: 48, bgcolor: planColors.bg, color: planColors.text, fontSize: '1.25rem', fontWeight: 700 }}>
              {org.name.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography sx={{ fontWeight: 600, color: '#0f172a', fontSize: '1rem', mb: 0.5 }}>{org.name}</Typography>
              <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
                <Chip label={org.plan.toUpperCase()} size="small" sx={{ height: 20, fontSize: '0.6875rem', fontWeight: 600, backgroundColor: planColors.bg, color: planColors.text }} />
                <Chip icon={org.isEnabled ? <CheckCircleIcon sx={{ fontSize: 14 }} /> : <CancelIcon sx={{ fontSize: 14 }} />} label={org.isEnabled ? 'Active' : 'Inactive'} size="small" sx={{ height: 20, fontSize: '0.6875rem', fontWeight: 600, backgroundColor: org.isEnabled ? '#dcfce7' : '#fee2e2', color: org.isEnabled ? '#16a34a' : '#dc2626' }} />
                <Chip label={org.approved ? 'Approved' : 'Pending'} size="small" sx={{ height: 20, fontSize: '0.6875rem', fontWeight: 600, backgroundColor: org.approved ? '#dbeafe' : '#fef3c7', color: org.approved ? '#2563eb' : '#d97706' }} />
              </Box>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            {!org.approved && (
              <Button variant="contained" size="small" startIcon={<CheckCircleIcon sx={{ fontSize: 16 }} />} onClick={handleApprove} sx={{ textTransform: 'none', fontWeight: 600, fontSize: '0.8125rem', py: 0.75, px: 2, background: '#10b981', '&:hover': { background: '#059669' } }}>
                Approve
              </Button>
            )}
            <Button variant="outlined" size="small" startIcon={org.isEnabled ? <ToggleOffIcon sx={{ fontSize: 16 }} /> : <ToggleOnIcon sx={{ fontSize: 16 }} />} onClick={handleToggleStatus} sx={{ textTransform: 'none', fontWeight: 600, fontSize: '0.8125rem', py: 0.75, px: 2, borderColor: '#e2e8f0', color: '#64748b', '&:hover': { borderColor: '#cbd5e1', bgcolor: '#f8fafc' } }}>
              {org.isEnabled ? 'Disable' : 'Enable'}
            </Button>
            <Button variant="outlined" size="small" startIcon={<EditIcon sx={{ fontSize: 16 }} />} onClick={handleEditClick} sx={{ textTransform: 'none', fontWeight: 600, fontSize: '0.8125rem', py: 0.75, px: 2, borderColor: '#e2e8f0', color: '#64748b', '&:hover': { borderColor: '#cbd5e1', bgcolor: '#f8fafc' } }}>
              Edit
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Grid Content */}
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 2.5 }}>
          {/* Organization Info */}
          <Box>
            <Paper sx={{ p: 2.5, border: '1px solid #e2e8f0', borderRadius: 2, height: '100%', minHeight: 400, maxHeight: 400, display: 'flex', flexDirection: 'column' }}>
              <Typography sx={{ fontWeight: 600, color: '#0f172a', fontSize: '0.9375rem', mb: 2 }}>Organization Info</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <EmailIcon sx={{ color: '#64748b', fontSize: 18 }} />
                  <Box>
                    <Typography sx={{ color: '#64748b', fontSize: '0.6875rem' }}>Email</Typography>
                    <Typography sx={{ fontWeight: 500, fontSize: '0.8125rem' }}>{org.email}</Typography>
                  </Box>
                </Box>
                {org.phoneNumber && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <PhoneIcon sx={{ color: '#64748b', fontSize: 18 }} />
                    <Box>
                      <Typography sx={{ color: '#64748b', fontSize: '0.6875rem' }}>Phone</Typography>
                      <Typography sx={{ fontWeight: 500, fontSize: '0.8125rem' }}>{org.phoneNumber}</Typography>
                    </Box>
                  </Box>
                )}
                {org.websiteUrl && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <LanguageIcon sx={{ color: '#64748b', fontSize: 18 }} />
                    <Box>
                      <Typography sx={{ color: '#64748b', fontSize: '0.6875rem' }}>Website</Typography>
                      <Typography sx={{ fontWeight: 500, fontSize: '0.8125rem', color: '#2B2947', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }} onClick={() => window.open(org.websiteUrl, '_blank')}>
                        {org.websiteUrl}
                      </Typography>
                    </Box>
                  </Box>
                )}
                {org.numberOfPeople && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <PeopleIcon sx={{ color: '#64748b', fontSize: 18 }} />
                    <Box>
                      <Typography sx={{ color: '#64748b', fontSize: '0.6875rem' }}>Team Size</Typography>
                      <Typography sx={{ fontWeight: 500, fontSize: '0.8125rem' }}>{org.numberOfPeople} people</Typography>
                    </Box>
                  </Box>
                )}
                {org.createdAt && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <CalendarIcon sx={{ color: '#64748b', fontSize: 18 }} />
                    <Box>
                      <Typography sx={{ color: '#64748b', fontSize: '0.6875rem' }}>Created</Typography>
                      <Typography sx={{ fontWeight: 500, fontSize: '0.8125rem' }}>{new Date(org.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</Typography>
                    </Box>
                  </Box>
                )}
              </Box>
              <Button fullWidth variant="outlined" startIcon={<LockResetIcon />} onClick={() => setResetPasswordDialog(true)} sx={{ mt: 2, textTransform: 'none', fontWeight: 600, fontSize: '0.8125rem', borderColor: '#e2e8f0', color: '#64748b', '&:hover': { borderColor: '#cbd5e1', bgcolor: '#f8fafc' } }}>
                Reset Password
              </Button>
            </Paper>
          </Box>

          {/* Billing & Plan */}
          <Box>
            <Paper sx={{ p: 2.5, border: '1px solid #e2e8f0', borderRadius: 2, height: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <PaymentIcon sx={{ color: '#2B2947', fontSize: 20 }} />
                <Typography sx={{ fontWeight: 600, color: '#0f172a', fontSize: '0.9375rem' }}>Billing & Plan</Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography sx={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', mb: 0.5 }}>{org.plan.charAt(0).toUpperCase() + org.plan.slice(1)} Plan</Typography>
                <Typography sx={{ color: '#64748b', fontSize: '0.75rem' }}>Active since {org.createdAt ? new Date(org.createdAt).toLocaleDateString() : 'N/A'}</Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography sx={{ color: '#64748b', fontSize: '0.75rem' }}>Start Date</Typography>
                  <Typography sx={{ fontWeight: 500, fontSize: '0.75rem' }}>{org.createdAt ? new Date(org.createdAt).toLocaleDateString() : 'N/A'}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography sx={{ color: '#64748b', fontSize: '0.75rem' }}>End Date</Typography>
                  <Typography sx={{ fontWeight: 500, fontSize: '0.75rem' }}>{org.createdAt ? new Date(new Date(org.createdAt).setFullYear(new Date(org.createdAt).getFullYear() + 1)).toLocaleDateString() : 'N/A'}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography sx={{ color: '#64748b', fontSize: '0.75rem' }}>Last Payment</Typography>
                  <Typography sx={{ fontWeight: 500, fontSize: '0.75rem' }}>$99.00</Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <FormControlLabel control={<Switch defaultChecked size="small" />} label={<Typography sx={{ fontSize: '0.75rem' }}>Payment reminders</Typography>} />
                <FormControlLabel control={<Switch defaultChecked size="small" />} label={<Typography sx={{ fontSize: '0.75rem' }}>Payment confirmations</Typography>} />
                <FormControlLabel control={<Switch size="small" />} label={<Typography sx={{ fontSize: '0.75rem' }}>Invoice copies</Typography>} />
              </Box>
            </Paper>
          </Box>

          {/* Features */}
          <Box>
            <Paper sx={{ p: 2.5, border: '1px solid #e2e8f0', borderRadius: 2, height: '100%', minHeight: 400, maxHeight: 400, display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <ExtensionIcon sx={{ color: '#2B2947', fontSize: 20 }} />
                <Typography sx={{ fontWeight: 600, color: '#0f172a', fontSize: '0.9375rem' }}>Features</Typography>
              </Box>
              
              {/* Search Bar */}
              <TextField
                size="small"
                placeholder="Search features..."
                value={featureSearch}
                onChange={(e) => setFeatureSearch(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ color: '#64748b', fontSize: 18, mr: 1 }} />,
                }}
                sx={{
                  mb: 1.5,
                  '& .MuiOutlinedInput-root': {
                    fontSize: '0.75rem',
                    bgcolor: '#f8fafc',
                    '& fieldset': { borderColor: '#e2e8f0' },
                    '&:hover fieldset': { borderColor: '#cbd5e1' },
                    '&.Mui-focused fieldset': { borderColor: '#2B2947', borderWidth: 1 }
                  }
                }}
              />

              {/* Scrollable Features List */}
              <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 0.5,
                flex: 1,
                overflowY: 'auto',
                pr: 0.5
              }}>
                {filteredFeatures.length > 0 ? (
                  filteredFeatures.map((feature) => (
                    <FormControlLabel
                      key={feature.key}
                      control={
                        <Switch
                          checked={features[feature.key as keyof typeof features]}
                          onChange={() => handleFeatureToggle(feature.key)}
                          size="small"
                        />
                      }
                      label={<Typography sx={{ fontSize: '0.75rem' }}>{feature.label}</Typography>}
                    />
                  ))
                ) : (
                  <Typography sx={{ color: '#64748b', fontSize: '0.75rem', textAlign: 'center', py: 2 }}>
                    No features found
                  </Typography>
                )}
              </Box>
            </Paper>
          </Box>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 2.5, mt: 2.5 }}>
          {/* SMTP Configuration */}
          <Box>
            <Paper sx={{ p: 2.5, border: '1px solid #e2e8f0', borderRadius: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <EmailIcon sx={{ color: '#2B2947', fontSize: 20 }} />
                <Typography sx={{ fontWeight: 600, color: '#0f172a', fontSize: '0.9375rem' }}>SMTP Configuration</Typography>
              </Box>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1.5 }}>
                <TextField size="small" label="SMTP Host" placeholder="smtp.example.com" sx={{ '& .MuiInputLabel-root': { fontSize: '0.75rem' }, '& .MuiInputBase-input': { fontSize: '0.8125rem' } }} />
                <TextField size="small" label="Port" placeholder="587" sx={{ '& .MuiInputLabel-root': { fontSize: '0.75rem' }, '& .MuiInputBase-input': { fontSize: '0.8125rem' } }} />
                <TextField size="small" label="Username" placeholder="user@example.com" fullWidth sx={{ gridColumn: 'span 2', '& .MuiInputLabel-root': { fontSize: '0.75rem' }, '& .MuiInputBase-input': { fontSize: '0.8125rem' } }} />
                <TextField size="small" label="Password" type="password" placeholder="••••••••" fullWidth sx={{ gridColumn: 'span 2', '& .MuiInputLabel-root': { fontSize: '0.75rem' }, '& .MuiInputBase-input': { fontSize: '0.8125rem' } }} />
              </Box>
              <Button variant="contained" sx={{ mt: 1.5, textTransform: 'none', fontSize: '0.75rem', bgcolor: '#2B2947', '&:hover': { bgcolor: '#1f1d33' } }}>Save SMTP</Button>
            </Paper>
          </Box>

          {/* WhatsApp Configuration */}
          <Box>
            <Paper sx={{ p: 2.5, border: '1px solid #e2e8f0', borderRadius: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <WhatsAppIcon sx={{ color: '#25D366', fontSize: 20 }} />
                <Typography sx={{ fontWeight: 600, color: '#0f172a', fontSize: '0.9375rem' }}>WhatsApp Configuration</Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <TextField size="small" label="API Key" placeholder="Enter API Key" sx={{ '& .MuiInputLabel-root': { fontSize: '0.75rem' }, '& .MuiInputBase-input': { fontSize: '0.8125rem' } }} />
                <TextField size="small" label="Phone Number ID" placeholder="Enter Phone Number ID" sx={{ '& .MuiInputLabel-root': { fontSize: '0.75rem' }, '& .MuiInputBase-input': { fontSize: '0.8125rem' } }} />
                <TextField size="small" label="Webhook URL" placeholder="https://your-domain.com/webhook" sx={{ '& .MuiInputLabel-root': { fontSize: '0.75rem' }, '& .MuiInputBase-input': { fontSize: '0.8125rem' } }} />
              </Box>
              <Button variant="contained" sx={{ mt: 1.5, textTransform: 'none', fontSize: '0.75rem', bgcolor: '#25D366', '&:hover': { bgcolor: '#1faa52' } }}>Save WhatsApp</Button>
            </Paper>
          </Box>
        </Box>
      </Box>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3, maxHeight: '90vh' } }}>
        <DialogTitle sx={{ fontWeight: 600, fontSize: '1.125rem', pb: 1 }}>Edit Organization</DialogTitle>
        <DialogContent sx={{ pt: 2, pb: 1, overflowY: 'auto' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            {['name', 'email', 'phoneNumber', 'websiteUrl', 'numberOfPeople'].map((field) => (
              <Box key={field}>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: '#64748b', mb: 0.75 }}>
                  {field === 'name' ? 'Organization Name *' : field === 'email' ? 'Email *' : field === 'phoneNumber' ? 'Phone Number' : field === 'websiteUrl' ? 'Website URL' : 'Team Size'}
                </Typography>
                <TextField
                  placeholder={field === 'name' ? 'Organization Name' : field === 'email' ? 'Email' : field === 'phoneNumber' ? 'Phone Number' : field === 'websiteUrl' ? 'Website URL' : 'Team Size'}
                  value={editForm[field as keyof typeof editForm]}
                  onChange={(e) => setEditForm({ ...editForm, [field]: e.target.value })}
                  size="small"
                  fullWidth
                  required={field === 'name' || field === 'email'}
                  type={field === 'email' ? 'email' : field === 'numberOfPeople' ? 'number' : 'text'}
                  sx={{ '& .MuiOutlinedInput-root': { fontSize: '0.875rem', bgcolor: '#ffffff', '& fieldset': { borderColor: '#e2e8f0' }, '&:hover fieldset': { borderColor: '#cbd5e1' }, '&.Mui-focused fieldset': { borderColor: '#2B2947', borderWidth: 1 } } }}
                />
              </Box>
            ))}
            <Box>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: '#64748b', mb: 0.75 }}>Plan *</Typography>
              <TextField select placeholder="Select Plan" value={editForm.plan} onChange={(e) => setEditForm({ ...editForm, plan: e.target.value })} size="small" fullWidth required sx={{ '& .MuiOutlinedInput-root': { fontSize: '0.875rem', bgcolor: '#ffffff', '& fieldset': { borderColor: '#e2e8f0' }, '&:hover fieldset': { borderColor: '#cbd5e1' }, '&.Mui-focused fieldset': { borderColor: '#2B2947', borderWidth: 1 } } }}>
                <MenuItem value="free">Free</MenuItem>
                <MenuItem value="basic">Basic</MenuItem>
                <MenuItem value="pro">Pro</MenuItem>
                <MenuItem value="enterprise">Enterprise</MenuItem>
              </TextField>
            </Box>
            <Box>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: '#64748b', mb: 0.75 }}>Comments</Typography>
              <TextField placeholder="Comments" value={editForm.comments} onChange={(e) => setEditForm({ ...editForm, comments: e.target.value })} size="small" fullWidth multiline rows={3} sx={{ '& .MuiOutlinedInput-root': { fontSize: '0.875rem', bgcolor: '#ffffff', '& fieldset': { borderColor: '#e2e8f0' }, '&:hover fieldset': { borderColor: '#cbd5e1' }, '&.Mui-focused fieldset': { borderColor: '#2B2947', borderWidth: 1 } } }} />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setEditDialogOpen(false)} sx={{ textTransform: 'none', fontWeight: 600, fontSize: '0.8125rem', color: '#64748b' }}>Cancel</Button>
          <Button onClick={handleEditSave} variant="contained" sx={{ textTransform: 'none', fontWeight: 600, fontSize: '0.8125rem', bgcolor: '#2B2947', '&:hover': { bgcolor: '#1f1d33' } }}>Save Changes</Button>
        </DialogActions>
      </Dialog>

      {/* Reset Password Dialog */}
      <Dialog open={resetPasswordDialog} onClose={() => setResetPasswordDialog(false)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 600, fontSize: '1.125rem' }}>Reset Admin Password</DialogTitle>
        <DialogContent>
          <Typography sx={{ color: '#64748b', fontSize: '0.875rem', mb: 2 }}>A new temporary password will be generated and sent to the admin's email address.</Typography>
          <Alert severity="warning" sx={{ fontSize: '0.8125rem' }}>The admin will be required to change this password on their next login.</Alert>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setResetPasswordDialog(false)} sx={{ textTransform: 'none', fontWeight: 600, fontSize: '0.8125rem', color: '#64748b' }}>Cancel</Button>
          <Button variant="contained" sx={{ textTransform: 'none', fontWeight: 600, fontSize: '0.8125rem', bgcolor: '#dc2626', '&:hover': { bgcolor: '#b91c1c' } }}>Reset Password</Button>
        </DialogActions>

      {/* Send Message Dialog */}
      <Dialog open={sendMessageDialog} onClose={() => setSendMessageDialog(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 600, fontSize: '1.125rem' }}>Send Custom Message</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <Box>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: '#64748b', mb: 0.75 }}>Channel *</Typography>
              <TextField select value={messageForm.channel} onChange={(e) => setMessageForm({ ...messageForm, channel: e.target.value })} size="small" fullWidth sx={{ '& .MuiOutlinedInput-root': { fontSize: '0.875rem', bgcolor: '#ffffff', '& fieldset': { borderColor: '#e2e8f0' }, '&:hover fieldset': { borderColor: '#cbd5e1' }, '&.Mui-focused fieldset': { borderColor: '#2B2947', borderWidth: 1 } } }}>
                <MenuItem value="email"><Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><EmailIcon sx={{ fontSize: 18 }} />Email</Box></MenuItem>
                <MenuItem value="sms"><Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><PhoneIcon sx={{ fontSize: 18 }} />SMS</Box></MenuItem>
                <MenuItem value="whatsapp"><Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><WhatsAppIcon sx={{ fontSize: 18, color: '#25D366' }} />WhatsApp</Box></MenuItem>
              </TextField>
            </Box>
            <Box>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: '#64748b', mb: 0.75 }}>Subject {messageForm.channel === 'email' ? '*' : '(Optional)'}</Typography>
              <TextField placeholder="Enter subject" value={messageForm.subject} onChange={(e) => setMessageForm({ ...messageForm, subject: e.target.value })} size="small" fullWidth required={messageForm.channel === 'email'} sx={{ '& .MuiOutlinedInput-root': { fontSize: '0.875rem', bgcolor: '#ffffff', '& fieldset': { borderColor: '#e2e8f0' }, '&:hover fieldset': { borderColor: '#cbd5e1' }, '&.Mui-focused fieldset': { borderColor: '#2B2947', borderWidth: 1 } } }} />
            </Box>
            <Box>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: '#64748b', mb: 0.75 }}>Message *</Typography>
              <TextField placeholder="Enter your message" value={messageForm.message} onChange={(e) => setMessageForm({ ...messageForm, message: e.target.value })} size="small" fullWidth required multiline rows={6} sx={{ '& .MuiOutlinedInput-root': { fontSize: '0.875rem', bgcolor: '#ffffff', '& fieldset': { borderColor: '#e2e8f0' }, '&:hover fieldset': { borderColor: '#cbd5e1' }, '&.Mui-focused fieldset': { borderColor: '#2B2947', borderWidth: 1 } } }} />
              <Typography sx={{ color: '#64748b', fontSize: '0.6875rem', mt: 0.5 }}>{messageForm.message.length} characters</Typography>
            </Box>
            <Alert severity="info" sx={{ fontSize: '0.8125rem' }}>
              This message will be sent to the organization admin at <strong>{org.email}</strong>
              {messageForm.channel === 'sms' && org.phoneNumber && ` and ${org.phoneNumber}`}
              {messageForm.channel === 'whatsapp' && org.phoneNumber && ` via WhatsApp at ${org.phoneNumber}`}
            </Alert>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setSendMessageDialog(false)} sx={{ textTransform: 'none', fontWeight: 600, fontSize: '0.8125rem', color: '#64748b' }}>Cancel</Button>
          <Button variant="contained" startIcon={<SendIcon />} sx={{ textTransform: 'none', fontWeight: 600, fontSize: '0.8125rem', bgcolor: messageForm.channel === 'whatsapp' ? '#25D366' : '#2B2947', '&:hover': { bgcolor: messageForm.channel === 'whatsapp' ? '#1faa52' : '#1f1d33' } }}>Send Message</Button>
        </DialogActions>
      </Dialog>
      </Dialog>
    </Box>
  );
}