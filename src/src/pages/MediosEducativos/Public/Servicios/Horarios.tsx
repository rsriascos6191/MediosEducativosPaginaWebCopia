/**
 * Portal público – Servicio Horarios
 */

import { Box, Typography, Button, Container, Card, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PublicLayout from '../../../../components/PublicLayout';

export default function Horarios() {
  const navigate = useNavigate();

  return (
    <PublicLayout>
      <Box sx={{ backgroundColor: '#0B3A5C', py: 5 }}>
        <Container maxWidth="lg">
          <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', mb: 1 }}>Inicio / Servicios / Horarios</Typography>
          <Typography sx={{ color: '#FFFFFF', fontWeight: 800, fontSize: { xs: '2rem', md: '2.5rem' }, mb: 0.5 }}>HORARIOS</Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.8)' }}>Consulta los horarios de atención de Medios Educativos.</Typography>
          <Box sx={{ width: 40, height: 3, backgroundColor: '#E30613', mt: 2 }} />
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Typography sx={{ color: '#E30613', fontSize: '0.8rem', fontWeight: 700, letterSpacing: 1, mb: 1 }}>DOCUMENTO OFICIAL</Typography>
        <Typography sx={{ fontWeight: 800, fontSize: '1.5rem', color: '#0B1A2A', mb: 0.5 }}>Horarios de atención</Typography>
        <Typography sx={{ color: '#5A6A7A', fontSize: '0.95rem', mb: 3 }}>
          Consulta a continuación los horarios de atención de nuestras sedes
        </Typography>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, mb: 4 }}>
          <Card elevation={0} sx={{ borderRadius: '12px', border: '1px solid #E5EAF0', p: 3 }}>
            <Box sx={{ height: 4, backgroundColor: '#0B3A5C', borderRadius: 2, mb: 2 }} />
            <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', color: '#5A6A7A', mb: 0.5 }}>MEDIOS EDUCATIVOS</Typography>
            <Typography sx={{ fontWeight: 800, fontSize: '1.25rem', color: '#0B1A2A', mb: 2 }}>Horarios de Atención</Typography>
            <Typography sx={{ color: '#5A6A7A', fontSize: '0.85rem', mb: 2 }}>Documento oficial</Typography>
            <Button variant="contained" sx={{
              backgroundColor: '#E30613', textTransform: 'none', fontWeight: 600, borderRadius: '8px', boxShadow: 'none',
              '&:hover': { backgroundColor: '#C10510', boxShadow: 'none' },
            }}>
              PDF
            </Button>
            <Typography sx={{ color: '#5A6A7A', fontSize: '0.75rem', mt: 3 }}>HORARIOS · Fuente oficial</Typography>
          </Card>

          <Card elevation={0} sx={{ borderRadius: '12px', border: '1px solid #E5EAF0', p: 3 }}>
            <Box sx={{
              display: 'inline-block', backgroundColor: '#E30613', color: '#FFF', fontSize: '0.7rem',
              fontWeight: 700, px: 1.5, py: 0.5, borderRadius: '6px', mb: 2,
            }}>
              PDF OFICIAL
            </Box>
            <Typography sx={{ fontWeight: 800, fontSize: '1.25rem', color: '#0B1A2A', mb: 1 }}>Horarios de Atención</Typography>
            <Typography sx={{ color: '#5A6A7A', fontSize: '0.9rem', mb: 2 }}>
              Documento oficial con los horarios de atención de las sedes de Medios Educativos.
            </Typography>
            <Typography sx={{ color: '#5A6A7A', fontSize: '0.8rem', mb: 0.5 }}>Fuente</Typography>
            <Typography sx={{ fontWeight: 600, color: '#1A2A3A', mb: 2 }}>Horarios de Atención</Typography>
            <Typography sx={{ color: '#5A6A7A', fontSize: '0.85rem', mb: 2 }}>
              El horario oficial se consulta directamente en el documento PDF.
            </Typography>
            <Button variant="contained" sx={{
              backgroundColor: '#E30613', textTransform: 'none', fontWeight: 600, borderRadius: '8px', boxShadow: 'none',
              '&:hover': { backgroundColor: '#C10510', boxShadow: 'none' },
            }}>
              Consultar horarios
            </Button>
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
