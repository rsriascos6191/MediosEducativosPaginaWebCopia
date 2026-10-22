import { Box, Typography } from '@mui/material';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import MeetingRoomOutlinedIcon from '@mui/icons-material/MeetingRoomOutlined';
import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';
import EventOutlinedIcon from '@mui/icons-material/EventOutlined';
import { Link as RouterLink, NavLink, Outlet } from 'react-router-dom';

const navigation = [
  { label: 'Dashboard', to: '/admin/dashboard', icon: DashboardOutlinedIcon },
  { label: 'Solicitudes', to: '/admin/solicitudes', icon: AssignmentOutlinedIcon },
  { label: 'Agenda', to: '/admin/agenda', icon: CalendarMonthOutlinedIcon },
  { label: 'Espacios', to: '/admin/espacios', icon: MeetingRoomOutlinedIcon },
  { label: 'Campus', to: '/admin/campus', icon: AccountBalanceOutlinedIcon },
  { label: 'Contenidos', to: '/admin/contenidos', icon: ArticleOutlinedIcon },
  { label: 'Tipos de espacio', to: '/admin/tipos-espacio', icon: CategoryOutlinedIcon },
  { label: 'Dependencias', to: '/admin/dependencias', icon: BusinessOutlinedIcon },
  { label: 'Historial', to: '/admin/historial', icon: HistoryOutlinedIcon },
  { label: 'Eventos', to: '/admin/eventos', icon: EventOutlinedIcon },
  { label: 'Ceremonias', to: '/admin/eventos/ceremonias', icon: EventOutlinedIcon },
];

function AdminLayout() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
      <Box
        component="aside"
        sx={{
          width: { xs: '100%', md: 260 },
          flexShrink: 0,
          height: { xs: 'auto', md: '100vh' },
          position: { xs: 'static', md: 'sticky' },
          top: 0,
          display: 'flex',
          flexDirection: 'column',
          bgcolor: '#132B55',
          color: '#FFFFFF',
        }}
      >
        <Box sx={{ px: 3, py: 2.5, borderBottom: '1px solid rgba(255,255,255,0.12)' }}>
          <Typography sx={{ fontSize: '1rem', fontWeight: 700, letterSpacing: 0.3 }}>
            MEDIOS EDUCATIVOS
          </Typography>
          <Typography sx={{ mt: 0.25, color: 'rgba(255,255,255,0.65)', fontSize: '0.8rem' }}>
            Panel de administración
          </Typography>
        </Box>

        <Box
          component="nav"
          aria-label="Navegación de administración"
          sx={{
            display: { xs: 'flex', md: 'block' },
            overflowX: { xs: 'auto', md: 'visible' },
            overflowY: { xs: 'hidden', md: 'auto' },
            px: { xs: 1, md: 1.5 },
            py: 1.5,
          }}
        >
          {navigation.map(({ label, to, icon: Icon }) => (
            <Box
              key={to}
              component={NavLink}
              to={to}
              end={to === '/admin/dashboard' || to === '/admin/eventos'}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                minHeight: 44,
                px: 1.5,
                mb: { xs: 0, md: 0.5 },
                mr: { xs: 0.5, md: 0 },
                borderRadius: '8px',
                color: 'rgba(255,255,255,0.78)',
                textDecoration: 'none',
                whiteSpace: 'nowrap',
                '&:hover': { color: '#FFFFFF', bgcolor: 'rgba(255,255,255,0.1)' },
                '&.active': { color: '#FFFFFF', bgcolor: '#2146A3', fontWeight: 600 },
              }}
            >
              <Icon sx={{ fontSize: 20 }} />
              <Typography component="span" sx={{ fontSize: '0.9rem', fontWeight: 'inherit' }}>
                {label}
              </Typography>
            </Box>
          ))}
        </Box>

        <Box
          component={RouterLink}
          to="/"
          sx={{
            mt: 'auto',
            display: { xs: 'none', md: 'block' },
            px: 3,
            py: 2,
            borderTop: '1px solid rgba(255,255,255,0.12)',
            color: 'rgba(255,255,255,0.75)',
            textDecoration: 'none',
            fontSize: '0.875rem',
            '&:hover': { color: '#FFFFFF' },
          }}
        >
          Volver al sitio
        </Box>
      </Box>

      <Box component="main" sx={{ minWidth: 0, flex: 1, p: { xs: 2, sm: 3, md: 4 }, bgcolor: '#F4F7FA' }}>
        <Outlet />
      </Box>
    </Box>
  );
}

export default AdminLayout;
