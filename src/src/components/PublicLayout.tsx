/**
 * Layout del portal público.
 * Header + Footer compartidos por todas las páginas públicas.
 */

import { ReactNode } from 'react';
import { Box, AppBar, Toolbar, Button, Typography, Container, Link as MuiLink } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

const LOGO = 'https://www.unicesmag.edu.co/recursos/uploads/2022/04/Escudos_2-2.png';

const NAV = [
  { label: 'Inicio', path: '/' },
  { label: 'Información', path: '/informacion' },
  { label: 'Servicios', path: '/servicios' },
  { label: 'Documentos', path: '/documentos' },
  { label: 'Contacto', path: '/contacto' },
];

interface Props {
  children: ReactNode;
}

export default function PublicLayout({ children }: Props) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#F5F7FA' }}>
      {/* Top bar */}
      <Box sx={{ backgroundColor: '#0B1A2A', py: 0.5, px: 2 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            {['MI UNICESMAG', 'Estudiante', 'Docente', 'Administrativo', 'Egresado'].map((t) => (
              <Typography key={t} sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.7rem', cursor: 'pointer' }}>
                {t}
              </Typography>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Main header */}
      <AppBar position="sticky" elevation={0} sx={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #E5EAF0' }}>
        <Toolbar sx={{ maxWidth: 1200, width: '100%', mx: 'auto', px: { xs: 2, md: 3 }, py: 1 }}>
          <Box
            sx={{ display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer', flexShrink: 0 }}
            onClick={() => navigate('/')}
          >
            <Box component="img" src={LOGO} alt="CESMAG" sx={{ height: 44, width: 'auto' }} />
            <Typography sx={{ fontWeight: 700, color: '#0B1A2A', fontSize: '0.95rem', lineHeight: 1.2, display: { xs: 'none', sm: 'block' } }}>
              MEDIOS<br />EDUCATIVOS
            </Typography>
          </Box>

          <Box sx={{ flex: 1 }} />

          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 0.5, alignItems: 'center' }}>
            {NAV.map((n) => {
              const active = location.pathname === n.path;
              return (
                <Button
                  key={n.path}
                  onClick={() => navigate(n.path)}
                  sx={{
                    textTransform: 'none',
                    fontWeight: active ? 700 : 500,
                    color: active ? '#0B3A5C' : '#1A2A3A',
                    fontSize: '0.875rem',
                    px: 1.5,
                    borderBottom: active ? '2px solid #E30613' : '2px solid transparent',
                    borderRadius: 0,
                    '&:hover': { backgroundColor: 'transparent', color: '#E30613' },
                  }}
                >
                  {n.label}
                </Button>
              );
            })}
          </Box>

          <Button
            variant="contained"
            onClick={() => navigate('/login')}
            sx={{
              ml: 2,
              backgroundColor: '#E30613',
              textTransform: 'none',
              fontWeight: 600,
              borderRadius: '8px',
              px: 2.5,
              boxShadow: 'none',
              '&:hover': { backgroundColor: '#C10510', boxShadow: 'none' },
            }}
          >
            Administración
          </Button>
        </Toolbar>
      </AppBar>

      {/* Content */}
      <Box sx={{ flex: 1 }}>{children}</Box>

      {/* Footer */}
      <Box sx={{ backgroundColor: '#0B1A2A', color: '#FFFFFF', pt: 5, pb: 3, mt: 'auto' }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '2fr 1fr 1fr 1fr' }, gap: 3, mb: 4 }}>
            <Box>
              <Typography sx={{ fontWeight: 700, fontSize: '1rem', mb: 1 }}>MEDIOS EDUCATIVOS</Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.85rem' }}>
                Universidad CESMAG · Inicio · Espacios · Servicios · Contacto
              </Typography>
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 600, fontSize: '0.85rem', mb: 1 }}>SOBRE LA UNICESMAG</Typography>
              {['Plan de Desarrollo', 'Normatividad', 'Comunicaciones'].map((l) => (
                <Typography key={l} sx={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.8rem', mb: 0.4 }}>{l}</Typography>
              ))}
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 600, fontSize: '0.85rem', mb: 1 }}>CONTÁCTANOS</Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.8rem' }}>(602) 7244434</Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.8rem' }}>medioseducativos@unicesmag.edu.co</Typography>
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 600, fontSize: '0.85rem', mb: 1 }}>CAMPUS</Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.8rem' }}>Campus Centro · San Damián · Santiago</Typography>
            </Box>
          </Box>
          <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.1)', pt: 2 }}>
            © 2026 Universidad CESMAG · Términos y condiciones · Política de privacidad
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}
