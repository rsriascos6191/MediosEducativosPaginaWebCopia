import {
  Box,
  Button,
  Container,
  Divider,
  Typography,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const dependencyLinks = [
  ['Inicio', '/'],
  ['Información', '/informacion'],
  ['Servicios', '/servicios'],
  ['Espacios', '/espacios'],
  ['Documentos', '/documentos'],
  ['Contacto', '/contacto'],
] as const;

function PublicHeader() {
  return (
    <Box component="header">
      <Box sx={{ backgroundColor: '#2146A3', color: '#FFFFFF' }}>
        <Container maxWidth="xl">
          <Box sx={{ height: 26, display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 10 }}>
            <Typography component="span" sx={{ fontSize: 'inherit', opacity: 0.9 }}>
              MI UNICESMAG · Estudiante · Docente · Egresado
            </Typography>
            <Typography component="span" sx={{ fontSize: 'inherit', opacity: 0.9 }}>Español</Typography>
          </Box>
        </Container>
      </Box>

      <Box sx={{ backgroundColor: '#FFFFFF', borderBottom: '3px solid #E41E3F' }}>
        <Container maxWidth="xl">
          <Box sx={{ minHeight: 54, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
            <Box component={RouterLink} to="/" sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
              <Box sx={{ width: 38, height: 38, borderRadius: '50%', backgroundColor: '#2146A3', color: '#FFFFFF', display: 'grid', placeItems: 'center', fontSize: 9, fontWeight: 800, mr: 1.25 }}>
                CESMAG
              </Box>
              <Box>
                <Typography sx={{ color: '#2146A3', fontSize: 16, fontWeight: 800 }}>MEDIOS EDUCATIVOS</Typography>
                <Typography sx={{ color: '#667085', fontSize: 11 }}>Universidad CESMAG</Typography>
              </Box>
            </Box>

            <Box component="nav" aria-label="Navegación de Medios Educativos" sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 0.5 }}>
              {dependencyLinks.map(([label, to]) => (
                <Button key={to} component={RouterLink} to={to} color="inherit" sx={{ color: '#263B72', fontSize: 12, fontWeight: 600, px: 1.1, '&:hover': { color: '#E41E3F', backgroundColor: 'transparent' } }}>
                  {label}
                </Button>
              ))}
              <Divider orientation="vertical" flexItem sx={{ mx: 0.75 }} />
              <Button component={RouterLink} to="/admin/login" variant="contained" sx={{ height: 30, px: 1.5, fontSize: 11, backgroundColor: '#cd0a0a' }}>
                Administración
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}

export default PublicHeader;
