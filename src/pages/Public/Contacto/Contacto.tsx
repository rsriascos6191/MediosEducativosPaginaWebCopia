/**
 * Portal público – Contacto
 */

import { useState } from 'react';
import { Box, Typography, Button, Container, TextField, Card, CardContent } from '@mui/material';
import PublicLayout from '../../../../components/PublicLayout';

const BANNER = 'https://entreobras.com/wp-content/uploads/2016/10/Edificio-Sicilia-CESMAG-Pasto-Narin%CC%83o-3.jpg';

export default function Contacto() {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [asunto, setAsunto] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [enviado, setEnviado] = useState(false);

  const handleEnviar = () => {
    if (!nombre || !correo || !mensaje) return;
    setEnviado(true);
  };

  return (
    <PublicLayout>
      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Typography sx={{ fontWeight: 800, fontSize: { xs: '2rem', md: '2.5rem' }, color: '#0B1A2A', mb: 0.5 }}>
          Contacto
        </Typography>
        <Typography sx={{ color: '#5A6A7A', fontSize: '1rem', mb: 4 }}>
          Comunícate con Medios Educativos para resolver dudas o solicitar información.
        </Typography>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
          {/* Info card */}
          <Box sx={{
            borderRadius: '12px', overflow: 'hidden', position: 'relative', minHeight: 320,
            backgroundImage: `linear-gradient(rgba(11,26,42,0.6), rgba(11,26,42,0.7)), url(${BANNER})`,
            backgroundSize: 'cover', backgroundPosition: 'center',
            display: 'flex', alignItems: 'center', p: 4,
          }}>
            <Box>
              <Typography sx={{ color: '#FFFFFF', fontWeight: 700, fontSize: '1.25rem', mb: 2 }}>
                Información de atención
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.9rem', mb: 0.5 }}>Universidad CESMAG</Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.9rem', mb: 0.5 }}>Campus y ubicación</Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.9rem', mb: 0.5 }}>Teléfono / correo institucional</Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.9rem' }}>Horario de atención</Typography>
            </Box>
          </Box>

          {/* Form */}
          <Card elevation={0} sx={{ borderRadius: '12px', border: '1px solid #E5EAF0' }}>
            <CardContent sx={{ p: 3.5 }}>
              <Typography sx={{ fontWeight: 700, fontSize: '1.15rem', color: '#0B1A2A', mb: 2.5 }}>
                Envíanos un mensaje
              </Typography>
              {enviado ? (
                <Typography sx={{ color: '#1B7A3D', fontWeight: 600 }}>¡Mensaje enviado correctamente!</Typography>
              ) : (
                <>
                  <TextField fullWidth size="small" label="Nombre" placeholder="Ingresar nombre..."
                    value={nombre} onChange={(e) => setNombre(e.target.value)}
                    sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }} />
                  <TextField fullWidth size="small" label="Correo electrónico" placeholder="Ingresar correo..."
                    value={correo} onChange={(e) => setCorreo(e.target.value)}
                    sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }} />
                  <TextField fullWidth size="small" label="Asunto" placeholder="Ingresar asunto..."
                    value={asunto} onChange={(e) => setAsunto(e.target.value)}
                    sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }} />
                  <TextField fullWidth size="small" label="Mensaje" multiline rows={4}
                    value={mensaje} onChange={(e) => setMensaje(e.target.value)}
                    sx={{ mb: 2.5, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }} />
                  <Button variant="contained" onClick={handleEnviar}
                    sx={{
                      backgroundColor: '#E30613', textTransform: 'none', fontWeight: 600, borderRadius: '8px',
                      px: 3, boxShadow: 'none', '&:hover': { backgroundColor: '#C10510', boxShadow: 'none' },
                    }}>
                    Enviar mensaje
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </Box>
      </Container>
    </PublicLayout>
  );
}
