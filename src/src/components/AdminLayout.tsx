/**
 * Layout administrativo compartido.
 * Menú lateral listo para enlazar las demás pestañas según se vayan desarrollando.
 * Diseño 1:1 con el prototipo de Figma.
 */

import { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Typography,
  Avatar,
  Button,
} from '@mui/material';
import { styled } from '@mui/material/styles';

const DRAWER_WIDTH = 260;

const Sidebar = styled(Drawer)(({ theme }) => ({
  width: DRAWER_WIDTH,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: DRAWER_WIDTH,
    boxSizing: 'border-box',
    backgroundColor: '#0B3A5C', // Azul oscuro del prototipo
    color: '#FFFFFF',
    borderRight: 'none',
    display: 'flex',
    flexDirection: 'column',
  },
}));

const TopBar = styled(Box)({
  height: 56,
  backgroundColor: '#FFFFFF',
  borderBottom: '3px solid #E30613', // Línea roja superior
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0 24px',
  position: 'sticky',
  top: 0,
  zIndex: 10,
});

const menuItems = [
  { label: 'Dashboard', path: '/admin/dashboard' },
  { label: 'Solicitudes', path: '/admin/solicitudes' },
  { label: 'Agenda por campus', path: '/admin/agenda' },
  { label: 'Gestión de espacios', path: '/admin/espacios' },
  { label: 'Gestión de campus', path: '/admin/campus' },
  { label: 'Gestión de contenidos', path: '/admin/contenidos' },
  { label: 'Tipos de espacio', path: '/admin/tipos-espacio' },
  { label: 'Dependencias', path: '/admin/dependencias' },
  { label: 'Eventos institucionales', path: '/admin/eventos' },
  { label: 'Historial', path: '/admin/historial' },
];

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F5F7FA' }}>
      {/* Sidebar */}
      <Sidebar variant="permanent" anchor="left">
        <Box sx={{ p: 3, pb: 2 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              fontSize: '1.15rem',
              lineHeight: 1.2,
              letterSpacing: '0.5px',
              color: '#FFFFFF',
            }}
          >
            MEDIOS
            <br />
            EDUCATIVOS
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: 'rgba(255,255,255,0.7)', mt: 0.5, display: 'block' }}
          >
            Panel administrativo
          </Typography>
        </Box>

        <List sx={{ flex: 1, px: 1.5, py: 1 }}>
          {menuItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <ListItemButton
                key={item.path}
                onClick={() => navigate(item.path)}
                sx={{
                  borderRadius: '8px',
                  mb: 0.5,
                  py: 1.1,
                  px: 2,
                  backgroundColor: isActive ? '#E30613' : 'transparent',
                  color: '#FFFFFF',
                  '&:hover': {
                    backgroundColor: isActive ? '#C10510' : 'rgba(255,255,255,0.08)',
                  },
                }}
              >
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: '0.9rem',
                    fontWeight: isActive ? 600 : 400,
                  }}
                />
              </ListItemButton>
            );
          })}
        </List>

        {/* Card inferior "Centro de gestión" */}
        <Box sx={{ p: 2, mt: 'auto' }}>
          <Box
            sx={{
              backgroundColor: '#062A42',
              borderRadius: '12px',
              p: 2,
              color: '#FFFFFF',
            }}
          >
            <Typography sx={{ fontWeight: 600, fontSize: '0.95rem', mb: 0.5 }}>
              Centro de gestión
            </Typography>
            <Typography sx={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.4 }}>
              Gestiona reservas y eventos institucionales desde aquí.
            </Typography>
          </Box>
        </Box>
      </Sidebar>

      {/* Contenido principal */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <TopBar>
          <Typography
            sx={{
              fontWeight: 600,
              color: '#0B3A5C',
              fontSize: '0.95rem',
              letterSpacing: '0.3px',
            }}
          >
            MEDIOS EDUCATIVOS
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography sx={{ color: '#5A6A7A', fontSize: '0.875rem' }}>
              Panel administrativo
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: '#0B3A5C',
                  fontSize: '0.85rem',
                }}
              >
                A
              </Avatar>
              <Typography sx={{ fontWeight: 500, fontSize: '0.9rem', color: '#1A2A3A' }}>
                Administrador
              </Typography>
            </Box>
          </Box>
        </TopBar>

        <Box sx={{ flex: 1, p: { xs: 2, md: 3 }, overflow: 'auto' }}>{children}</Box>
      </Box>
    </Box>
  );
}
