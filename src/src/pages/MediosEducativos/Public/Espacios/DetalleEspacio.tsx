/**
 * Portal público – Detalle de espacio
 */

import { Box, Typography, Button, Container, Card, CardContent } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import PublicLayout from '../../../../components/PublicLayout';

const IMG = 'https://www.unicesmag.edu.co/recursos/uploads/2024/02/bienvenida-consultorio-I-2-1.jpg';
const THUMBS = [
  'https://www.unicesmag.edu.co/recursos/uploads/2024/02/bienvenida-consultorio-I-2-1.jpg',
  'https://www.unicesmag.edu.co/recursos/uploads/2023/06/Difusion-VBG-03.jpg',
  'https://www.unicesmag.edu.co/recursos/uploads/2022/11/Aula-Mac-01-scaled.jpg',
  'https://www.unicesmag.edu.co/recursos/uploads/2022/11/Aula-Informatica-02-1-scaled.jpg',
];

export default function DetalleEspacio() {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <PublicLayout>
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Typography sx={{ color: '#5A6A7A', fontSize: '0.85rem', mb: 2 }}>
          Inicio / Espacios / Detalle
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 1 }}>
          <Button onClick={() => navigate('/espacios')} sx={{ color: '#1565C0', textTransform: 'none', fontWeight: 500 }}>
            ← Espacio anterior
          </Button>
          <Typography sx={{ color: '#5A6A7A', fontSize: '0.85rem', alignSelf: 'center' }}>Espacio {id || '1'} de 8</Typography>
          <Button onClick={() => navigate('/espacios')} sx={{ color: '#1565C0', textTransform: 'none', fontWeight: 500 }}>
            Siguiente espacio →
          </Button>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4, mb: 5 }}>
          <Box>
            <Box component="img" src={IMG} alt="Auditorio" sx={{ width: '100%', borderRadius: '12px', maxHeight: 320, objectFit: 'cover', mb: 1.5 }} />
            <Box sx={{ display: 'flex', gap: 1 }}>
              {THUMBS.map((t, i) => (
                <Box key={i} component="img" src={t} alt="" sx={{ width: 72, height: 52, borderRadius: '6px', objectFit: 'cover', cursor: 'pointer' }} />
              ))}
            </Box>
          </Box>

          <Box>
            <Typography sx={{ fontWeight: 800, fontSize: '1.75rem', color: '#0B1A2A', mb: 0.5 }}>
              Auditorio principal
            </Typography>
            <Typography sx={{ color: '#5A6A7A', fontSize: '0.9rem', mb: 0.5 }}>Campus Centro — Auditorio</Typography>
            <Box sx={{ width: 40, height: 3, backgroundColor: '#E30613', mb: 2 }} />
            <Typography sx={{ color: '#5A6A7A', fontSize: '0.95rem', mb: 3, lineHeight: 1.6 }}>
              Espacio para conferencias, clases, encuentros institucionales y actividades de gran aforo. Consulta disponibilidad y condiciones de uso antes de solicitar la reserva.
            </Typography>

            <Typography sx={{ fontWeight: 700, fontSize: '1.05rem', color: '#0B1A2A', mb: 1.5 }}>Características</Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5, mb: 3 }}>
              {[
                { label: 'Capacidad', value: '200 personas' },
                { label: 'Equipamiento', value: 'audiovisual' },
                { label: 'Accesibilidad', value: 'Disponible' },
                { label: 'Horarios', value: 'sujetos a disponibilidad' },
              ].map((c) => (
                <Box key={c.label} sx={{ backgroundColor: '#F0F5FA', borderRadius: '8px', p: 1.5 }}>
                  <Typography sx={{ color: '#5A6A7A', fontSize: '0.75rem' }}>{c.label}</Typography>
                  <Typography sx={{ fontWeight: 600, color: '#0B1A2A', fontSize: '0.9rem' }}>{c.value}</Typography>
                </Box>
              ))}
            </Box>

            <Button variant="contained" onClick={() => navigate('/disponibilidad')}
              sx={{
                backgroundColor: '#E30613', textTransform: 'none', fontWeight: 600, borderRadius: '8px',
                px: 3, py: 1.2, boxShadow: 'none', '&:hover': { backgroundColor: '#C10510', boxShadow: 'none' },
              }}>
              Consultar disponibilidad →
            </Button>
            <Typography sx={{ color: '#5A6A7A', fontSize: '0.8rem', mt: 1 }}>Consulta fechas y horarios disponibles</Typography>
          </Box>
        </Box>

        {/* Otros espacios */}
        <Typography sx={{ fontWeight: 700, fontSize: '1.15rem', color: '#0B1A2A', mb: 2 }}>Otros espacios disponibles</Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 2 }}>
          {[
            { t: 'Auditorios', d: 'Capacidad desde 50 hasta 500 personas', img: THUMBS[0] },
            { t: 'Aulas de clases', d: 'Capacidad de 20 hasta 60 personas', img: THUMBS[1] },
            { t: 'Salas especiales', d: 'Equipos audiovisuales y tecnología', img: THUMBS[2] },
            { t: 'Piscinas', d: 'Espacios deportivos y recreativos', img: 'https://www.unicesmag.edu.co/recursos/uploads/2025/04/San-Damian-2025-06-scaled.webp' },
          ].map((o) => (
            <Card key={o.t} elevation={0} sx={{ borderRadius: '12px', border: '1px solid #E5EAF0', overflow: 'hidden' }}>
              <Box component="img" src={o.img} alt={o.t} sx={{ width: '100%', height: 110, objectFit: 'cover' }} />
              <CardContent sx={{ p: 1.5 }}>
                <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', color: '#0B1A2A' }}>{o.t}</Typography>
                <Typography sx={{ color: '#5A6A7A', fontSize: '0.75rem', mb: 0.5 }}>{o.d}</Typography>
                <Button onClick={() => navigate('/espacios')} sx={{ color: '#E30613', textTransform: 'none', fontSize: '0.8rem', p: 0, fontWeight: 500 }}>
                  Ver detalles →
                </Button>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Container>
    </PublicLayout>
  );
}
