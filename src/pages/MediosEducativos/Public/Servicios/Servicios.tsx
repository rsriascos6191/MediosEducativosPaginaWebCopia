/**
 * Portal público – Servicios
 */

import { Box, Typography, Button, Container, Card, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PublicLayout from '../../../../components/PublicLayout';

const SERVICIOS = [
  { id: 'espacios', titulo: 'Espacios académicos', n: '01', img: 'https://www.unicesmag.edu.co/recursos/uploads/2024/02/bienvenida-consultorio-I-2-1.jpg', path: '/espacios' },
  { id: 'horarios', titulo: 'Horarios', n: '02', img: 'https://www.unicesmag.edu.co/recursos/uploads/2022/11/Aula-Mac-01-scaled.jpg', path: '/servicios/horarios' },
  { id: 'fotocopias', titulo: 'Fotocopias', n: '03', img: 'https://www.unicesmag.edu.co/recursos/uploads/2022/11/Aula-Informatica-02-1-scaled.jpg', path: '/servicios/fotocopias' },
  { id: 'reserva', titulo: 'Reserva de espacios', n: '04', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSsCm03yHUldH43ZISl04Lry8cKXHVs_ZUJtaEry09zBanMxKHiSejF9x4&s=10', path: '/reserva' },
  { id: 'tech', titulo: 'Recursos tecnológicos', n: '05', img: 'https://www.unicesmag.edu.co/recursos/uploads/2022/11/Aula-Mac-01-scaled.jpg', path: '/servicios' },
  { id: 'otros', titulo: 'Otros servicios', n: '06', img: 'https://www.unicesmag.edu.co/recursos/uploads/2025/04/San-Damian-2025-06-scaled.webp', path: '/servicios' },
];

export default function Servicios() {
  const navigate = useNavigate();

  return (
    <PublicLayout>
      <Box sx={{ backgroundColor: '#0B3A5C', py: 6 }}>
        <Container maxWidth="lg">
          <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', fontWeight: 600, mb: 1 }}>● MEDIOS EDUCATIVOS</Typography>
          <Typography sx={{ color: '#FFFFFF', fontWeight: 800, fontSize: { xs: '2rem', md: '2.5rem' }, mb: 1 }}>Servicios</Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '1rem', maxWidth: 500 }}>
            Recursos y servicios para apoyar tus actividades académicas, culturales y eventos.
          </Typography>
          <Box sx={{ width: 40, height: 3, backgroundColor: '#E30613', mt: 2 }} />
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography sx={{ color: '#E30613', fontSize: '0.8rem', fontWeight: 700, letterSpacing: 1, mb: 1 }}>NUESTROS SERVICIOS</Typography>
        <Typography sx={{ fontWeight: 800, fontSize: '1.5rem', color: '#0B1A2A', mb: 0.5 }}>
          Recursos para apoyar tus actividades
        </Typography>
        <Typography sx={{ color: '#5A6A7A', fontSize: '0.95rem', mb: 3.5 }}>
          Explora las opciones disponibles y accede a la información de cada servicio.
        </Typography>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(3, 1fr)' }, gap: 2.5 }}>
          {SERVICIOS.map((s) => (
            <Card key={s.id} elevation={0} sx={{ borderRadius: '12px', border: '1px solid #E5EAF0', overflow: 'hidden' }}>
              <Box component="img" src={s.img} alt={s.titulo} sx={{ width: '100%', height: 160, objectFit: 'cover' }} />
              <CardContent sx={{ p: 2.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                  <Typography sx={{ fontWeight: 700, fontSize: '1.05rem', color: '#0B1A2A' }}>{s.titulo}</Typography>
                  <Typography sx={{ color: '#E5EAF0', fontWeight: 800, fontSize: '1.2rem' }}>{s.n}</Typography>
                </Box>
                <Typography sx={{ color: '#5A6A7A', fontSize: '0.85rem', mb: 2 }}>
                  Información, condiciones y acompañamiento para utilizar este servicio.
                </Typography>
                <Button variant="contained" onClick={() => navigate(s.path)}
                  sx={{ backgroundColor: '#E30613', textTransform: 'none', fontWeight: 600, borderRadius: '8px', boxShadow: 'none',
                    '&:hover': { backgroundColor: '#C10510', boxShadow: 'none' } }}>
                  Ver información
                </Button>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Container>
    </PublicLayout>
  );
}
