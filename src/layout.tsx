// Main Layout Component - Google AI Studio inspired
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  IconButton,
  Avatar,
  Divider,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  Business as BusinessIcon,
  Dashboard as DashboardIcon,
  Settings as SettingsIcon,
  ExitToApp as LogoutIcon,
  Menu as MenuIcon,
} from '@mui/icons-material';
import { useState } from 'react';
import { logout } from './features/auth/redux/slices/authSlice';
import type { RootState } from './store/store';

const drawerWidth = 240;

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const isSuperAdmin = user?.role === 'super_admin';

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    handleMenuClose();
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Organizations', icon: <BusinessIcon />, path: '/organizations' },
  ];

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Logo */}
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box
          sx={{
            width: 28,
            height: 28,
            background: '#2B2947',
            borderRadius: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 0.3,
          }}
        >
          <Box sx={{ width: 4, height: 16, background: '#e2e8f0', borderRadius: 0.3 }} />
          <Box sx={{ width: 4, height: 16, background: '#cbd5e1', borderRadius: 0.3 }} />
          <Box sx={{ width: 4, height: 16, background: '#94a3b8', borderRadius: 0.3 }} />
        </Box>
        <Typography sx={{ fontWeight: 600, color: '#0f172a', fontSize: '0.9375rem' }}>
          inShare
        </Typography>
      </Box>

      <Divider />

      {/* Navigation */}
      <List sx={{ flex: 1, px: 1, py: 1.5 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 0.25 }}>
            <ListItemButton
              onClick={() => navigate(item.path)}
              selected={location.pathname === item.path}
              sx={{
                borderRadius: 1.5,
                py: 0.75,
                '&.Mui-selected': {
                  bgcolor: '#f1f5f9',
                  '&:hover': {
                    bgcolor: '#e2e8f0',
                  },
                },
                '&:hover': {
                  bgcolor: '#f8fafc',
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 36, color: location.pathname === item.path ? '#2B2947' : '#64748b' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontSize: '0.8125rem',
                  fontWeight: location.pathname === item.path ? 600 : 500,
                  color: location.pathname === item.path ? '#0f172a' : '#64748b',
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider />

      {/* Bottom Section */}
      <Box sx={{ p: 1.5 }}>
        {!isSuperAdmin && (
          <ListItemButton
            onClick={() => navigate('/settings')}
            sx={{
              borderRadius: 1.5,
              mb: 0.5,
              py: 0.75,
              '&:hover': {
                bgcolor: '#f8fafc',
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 36, color: '#64748b' }}>
              <SettingsIcon sx={{ fontSize: 20 }} />
            </ListItemIcon>
            <ListItemText
              primary="Settings"
              primaryTypographyProps={{
                fontSize: '0.8125rem',
                fontWeight: 500,
                color: '#64748b',
              }}
            />
          </ListItemButton>
        )}

        <ListItemButton
          onClick={handleMenuOpen}
          sx={{
            borderRadius: 1.5,
            py: 0.75,
            '&:hover': {
              bgcolor: '#f8fafc',
            },
          }}
        >
          <Avatar
            sx={{
              width: 28,
              height: 28,
              bgcolor: '#2B2947',
              fontSize: '0.75rem',
              mr: 1.5,
            }}
          >
            {user?.fullName?.charAt(0).toUpperCase() || 'A'}
          </Avatar>
          <ListItemText
            primary={user?.fullName || 'Admin'}
            secondary={user?.email || 'admin@inshare.in'}
            primaryTypographyProps={{
              fontSize: '0.8125rem',
              fontWeight: 500,
              color: '#0f172a',
            }}
            secondaryTypographyProps={{
              fontSize: '0.6875rem',
              color: '#64748b',
            }}
          />
        </ListItemButton>
      </Box>

      {/* User Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            borderRadius: 2,
            minWidth: 200,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e2e8f0',
          },
        }}
      >
        <MenuItem onClick={handleLogout} sx={{ py: 1.5 }}>
          <LogoutIcon sx={{ mr: 1.5, fontSize: 20, color: '#64748b' }} />
          <Typography variant="body2">Logout</Typography>
        </MenuItem>
      </Menu>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#ffffff' }}>
      {/* Mobile Menu Button */}
      <IconButton
        color="inherit"
        aria-label="open drawer"
        edge="start"
        onClick={handleDrawerToggle}
        sx={{ 
          display: { sm: 'none' },
          position: 'fixed',
          top: 16,
          left: 16,
          zIndex: 1300,
          bgcolor: 'white',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          '&:hover': {
            bgcolor: '#f8fafc',
          },
        }}
      >
        <MenuIcon />
      </IconButton>

      {/* Sidebar - Desktop */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            borderRight: '1px solid #e2e8f0',
            bgcolor: '#ffffff',
          },
        }}
        open
      >
        {drawer}
      </Drawer>

      {/* Sidebar - Mobile */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            borderRight: '1px solid #e2e8f0',
            bgcolor: '#ffffff',
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          bgcolor: '#fafafa',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
