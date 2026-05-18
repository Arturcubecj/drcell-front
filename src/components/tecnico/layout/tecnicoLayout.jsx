import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box, Drawer, List, ListItem, ListItemButton, ListItemIcon,
  ListItemText, Typography, AppBar, Toolbar, IconButton,
  Badge, Avatar, Chip
} from '@mui/material';
import DashboardIcon     from '@mui/icons-material/Dashboard';
import BuildIcon         from '@mui/icons-material/Build';
import PeopleIcon        from '@mui/icons-material/People';
import InventoryIcon     from '@mui/icons-material/Inventory';
import EngineeringIcon   from '@mui/icons-material/Engineering';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PhoneAndroidIcon  from '@mui/icons-material/PhoneAndroid';
import { colors } from '../../../utils/styles';
import { Outlet } from "react-router-dom";

const DRAWER_WIDTH = 230;

const navItems = [
  { label: 'Mis Reparaciones',    icon: <DashboardIcon />,  path: '/tecnico/dashboard' },
];

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Box sx={{ display: 'flex', height: '100vh', bgcolor: colors.bg }}>

      {/* ── Sidebar ── */}
      <Drawer
        variant="permanent"
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            bgcolor: colors.surface,
            borderRight: `0.5px solid ${colors.border}`,
            display: 'flex',
            flexDirection: 'column',
          },
        }}
      >
        {/* Logo */}
        <Box sx={{ p: 2.5, borderBottom: `0.5px solid ${colors.border}` }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{
              width: 36, height: 36, bgcolor: colors.primary, borderRadius: '8px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <PhoneAndroidIcon sx={{ color: '#fff', fontSize: 20 }} />
            </Box>
            <Box>
              <Typography sx={{ fontSize: 14, fontWeight: 500, color: colors.textMain }}>
                DrCell
              </Typography>
              <Typography sx={{ fontSize: 11, color: colors.textFaint }}>
                Panel de gestión
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Nav */}
        <Box sx={{ flex: 1, py: 1.5 }}>
          <Typography sx={{
            fontSize: 10, color: colors.textDisabled, textTransform: 'uppercase',
            letterSpacing: '0.08em', px: 2.5, py: 0.5, mb: 0.5,
          }}>
            Principal
          </Typography>
          <List dense disablePadding>
            {navItems.map((item) => {
              const active = location.pathname === item.path;
              return (
                <ListItem key={item.path} disablePadding>
                  <ListItemButton
                    onClick={() => navigate(item.path)}
                    sx={{
                      px: 2.5, py: 1,
                      bgcolor: active ? colors.surfaceHover : 'transparent',
                      borderLeft: active ? `2px solid ${colors.primary}` : '2px solid transparent',
                      '&:hover': { bgcolor: colors.surfaceHover },
                    }}
                  >
                    <ListItemIcon sx={{
                      minWidth: 32,
                      color: active ? colors.textMain : colors.textFaint,
                      '& .MuiSvgIcon-root': { fontSize: 18 },
                    }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.label}
                      primaryTypographyProps={{
                        fontSize: 13,
                        color: active ? colors.textMain : colors.textMuted,
                        fontWeight: active ? 500 : 400,
                      }}
                    />
                    {item.badge && (
                      <Chip
                        label={item.badge}
                        size="small"
                        sx={{
                          height: 18, fontSize: 10, fontWeight: 500,
                          bgcolor: colors.danger, color: '#fff',
                          '& .MuiChip-label': { px: 1 },
                        }}
                      />
                    )}
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </Box>

        {/* Footer */}
        <Box sx={{
          p: 2, borderTop: `0.5px solid ${colors.border}`,
          display: 'flex', alignItems: 'center', gap: 1.5,
        }}>
          <Avatar sx={{ width: 30, height: 30, bgcolor: '#1e3a5f', fontSize: 11, fontWeight: 500, color: colors.info }}>
            JM
          </Avatar>
          <Box>
            <Typography sx={{ fontSize: 12, color: colors.textMain, fontWeight: 500 }}>Juan Mora</Typography>
            <Typography sx={{ fontSize: 10, color: colors.textFaint }}>Administrador</Typography>
          </Box>
        </Box>
      </Drawer>

      {/* ── Main ── */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* Topbar */}
        <AppBar position="static" elevation={0} sx={{
          bgcolor: colors.surface,
          borderBottom: `0.5px solid ${colors.border}`,
        }}>
          <Toolbar sx={{ minHeight: '52px !important', px: 3, justifyContent: 'space-between' }}>
            <Typography sx={{ fontSize: 15, fontWeight: 500, color: colors.textMain }}>
              {navItems.find(i => i.path === location.pathname)?.label ?? 'Panel Admin'}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton size="small" sx={{ color: colors.textFaint }}>
                <Badge badgeContent={3} color="error">
                  <NotificationsIcon sx={{ fontSize: 20 }} />
                </Badge>
              </IconButton>
              <Avatar sx={{ width: 'auto', height: 'auto', bgcolor: '#1e3a5f', fontSize: 11, color: colors.info }}>
                JM
              </Avatar>
            </Box>
          </Toolbar>
        </AppBar>
        {/* Contenido */}
        <Box sx={{ flex: 1, overflow: 'auto', bgcolor: colors.bg, p: 3 }}>
          <Outlet />
        </Box>

      </Box>
    </Box>
  );
};

export default AdminLayout;