/**
 * Portal público – Servicio Fotocopias
 */

import { Box, Typography, Button, Container, Card, CardContent, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PublicLayout from '../../../../components/PublicLayout';

export default function Fotocopias() {
  const navigate = useNavigate();

  return (
    <PublicLayout>
      <Box sx={{ backgroundColor: '#0B3A5C', py: 5 }}>
        <Container maxWidth="lg">
          <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', mb: 1 }}>Inicio / Servicios / Fotocopias</Typography>
          <Typography sx={{ color: '#FFFFFF', fontWeight: 800, fontSize: { xs: '2rem', md: '2.5rem' }, mb: 0.5 }}>FOTOCOPIAS</Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '1rem' }}>
            Servicio de reproducción de material institucional.
          </Typography>
          <Box sx={{ width: 40, height: 3, backgroundColor: '#E30613', mt: 2 }} />
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Typography sx={{ color: '#E30613', fontSize: '0.8rem', fontWeight: 700, letterSpacing: 1, mb: 1 }}>SERVICIO</Typography>
        <Typography sx={{ fontWeight: 800, fontSize: '1.5rem', color: '#0B1A2A', mb: 1 }}>Información del servicio</Typography>
        <Typography sx={{ color: '#5A6A7A', fontSize: '0.95rem', mb: 3, maxWidth: 600 }}>
          La Oficina de Medios Educativos es la unidad encargada de la reproducción de material institucional.
        </Typography>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1.5fr 1fr' }, gap: 3, mb: 4 }}>
          <Card elevation={0} sx={{ borderRadius: '12px', border: '1px solid #E5EAF0', p: 3 }}>
            <Typography sx={{ fontWeight: 700, fontSize: '1.1rem', color: '#0B1A2A', mb: 2 }}>Qué incluye</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              {['Copiado', 'Ampliación', 'Reducción', 'Escaneo', 'Impresión dúplex', 'Alto volumen'].map((t) => (
                <Chip key={t} label={t} sx={{ backgroundColor: '#F0F5FA', fontWeight: 500 }} />
              ))}
            </Box>
            <Typography sx={{ color: '#5A6A7A', fontSize: '0.85rem' }}>
              Para talleres, exámenes y documentos administrativos, utilizando formatos de papel A4 y A3.
            </Typography>
          </Card>

          <Card elevation={0} sx={{ borderRadius: '12px', backgroundColor: '#0B1A2A', p: 3 }}>
            <Chip label="CONDICIÓN" size="small" sx={{ backgroundColor: '#E30613', color: '#FFF', fontWeight: 700, mb: 2 }} />
            <Typography sx={{ color: '#FFFFFF', fontSize: '0.95rem', lineHeight: 1.6 }}>
              Todo trabajo solicitado requiere la aprobación previa del jefe o director de programa académico.
            </Typography>
          </Card>
        </Box>

        <Button variant="contained" onClick={() => navigate('/servicios')}
          sx={{ backgroundColor: '#E30613', textTransform: 'none', fontWeight: 600, borderRadius: '8px', boxShadow: 'none',
            '&:hover': { backgroundColor: '#C10510', boxShadow: 'none' } }}>
          Volver a Servicios
        </Button>
      </Container>
    </PublicLayout>
  );
}
