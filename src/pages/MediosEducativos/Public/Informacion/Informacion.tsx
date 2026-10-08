/**
 * Portal público – Información
 */

import { Box, Typography, Button, Container, Card, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PublicLayout from '../../../../components/PublicLayout';

const IMG = 'https://entreobras.com/wp-content/uploads/2016/10/Edificio-Sicilia-CESMAG-Pasto-Narin%CC%83o-3.jpg';

export default function Informacion() {
  const navigate = useNavigate();

  return (
    <PublicLayout>
      {/* Hero */}
      <Box sx={{ backgroundColor: '#0B3A5C', py: 6 }}>
        <Container maxWidth="lg">
          <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', fontWeight: 600, letterSpacing: 1, mb: 1 }}>
            MEDIOS EDUCATIVOS
          </Typography>
          <Typography sx={{ color: '#FFFFFF', fontWeight: 800, fontSize: { xs: '2rem', md: '2.5rem' }, mb: 1 }}>
            Información
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '1rem', maxWidth: 560 }}>
            Conoce el área de Medios Educativos, sus funciones y los recursos que pone a disposición de la comunidad universitaria.
          </Typography>
        </Container>
      </Box>

      {/* Qué es */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4, alignItems: 'center' }}>
          <Box sx={{ position: 'relative' }}>
            <Box component="img" src={IMG} alt="Campus" sx={{ width: '100%', borderRadius: '12px', maxHeight: 320, objectFit: 'cover' }} />
            <Box sx={{
              position: 'absolute', bottom: 16, left: 16, backgroundColor: 'rgba(11,26,42,0.85)',
              color: '#FFF', px: 2, py: 0.75, borderRadius: '8px', fontWeight: 700, fontSize: '0.9rem',
            }}>
              SEDE CENTRO
            </Box>
          </Box>
          <Box>
            <Typography sx={{ color: '#E30613', fontSize: '0.8rem', fontWeight: 700, letterSpacing: 1, mb: 1 }}>
              MEDIOS EDUCATIVOS
            </Typography>
            <Typography sx={{ fontWeight: 800, fontSize: '1.75rem', color: '#0B1A2A', mb: 2 }}>
              ¿Qué es Medios Educativos?
            </Typography>
            <Typography sx={{ color: '#5A6A7A', fontSize: '1rem', lineHeight: 1.7, mb: 2 }}>
              En la Oficina de Medios Educativos, somos el puente que conecta los recursos físicos y tecnológicos con la excelencia educativa y operativa de la Universidad CESMAG.
            </Typography>
            <Typography sx={{ color: '#E30613', fontSize: '0.8rem', fontWeight: 600 }}>
              RECURSOS · TECNOLOGÍA · EXCELENCIA
            </Typography>
          </Box>
        </Box>
      </Container>

      {/* Aspectos clave */}
      <Box sx={{ backgroundColor: '#F0F5FA', py: 6 }}>
        <Container maxWidth="lg">
          <Typography sx={{ color: '#E30613', fontSize: '0.8rem', fontWeight: 700, letterSpacing: 1, mb: 1 }}>
            INFORMACIÓN DE INTERÉS
          </Typography>
          <Typography sx={{ fontWeight: 800, fontSize: '1.5rem', color: '#0B1A2A', mb: 0.5 }}>
            Conoce los aspectos clave de Medios Educativos
          </Typography>
          <Typography sx={{ color: '#5A6A7A', fontSize: '0.95rem', mb: 3 }}>
            Una vista breve sobre nuestro propósito, servicios y atención.
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 2.5 }}>
            {[
              { n: '01', t: 'Misión y propósito', d: 'Conectar recursos físicos y tecnológicos con la excelencia educativa y operativa.', link: 'Conocer más →', path: '/informacion' },
              { n: '02', t: 'Servicios', d: 'Conoce los servicios y recursos disponibles para apoyar las actividades de la comunidad universitaria.', link: 'Ver servicios →', path: '/servicios' },
              { n: '03', t: 'Ubicación y atención', d: 'Información de campus y atención de Medios Educativos.', link: 'Ver horarios →', path: '/servicios/horarios' },
            ].map((c) => (
              <Card key={c.n} elevation={0} sx={{ borderRadius: '12px', border: '1px solid #E5EAF0', borderTop: '3px solid #E30613' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography sx={{ fontWeight: 800, fontSize: '1.5rem', color: '#E5EAF0', mb: 1 }}>{c.n}</Typography>
                  <Typography sx={{ fontWeight: 700, fontSize: '1.1rem', color: '#0B1A2A', mb: 1 }}>{c.t}</Typography>
                  <Typography sx={{ color: '#5A6A7A', fontSize: '0.9rem', mb: 2 }}>{c.d}</Typography>
                  <Button onClick={() => navigate(c.path)} sx={{ color: '#E30613', textTransform: 'none', fontWeight: 600, p: 0 }}>
                    {c.link}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Container>
      </Box>
    </PublicLayout>
  );
}
