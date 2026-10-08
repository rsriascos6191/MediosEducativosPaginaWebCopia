/**
 * Portal público – Consultar disponibilidad
 */

import { useState } from 'react';
import { Box, Typography, Button, Container, TextField, MenuItem, Card, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PublicLayout from '../../../../components/PublicLayout';

export default function Disponibilidad() {
  const navigate = useNavigate();
  const [campus, setCampus] = useState('');
  const [espacio, setEspacio] = useState('');
  const [fecha, setFecha] = useState('');
  const [horaIni, setHoraIni] = useState('');
  const [horaFin, setHoraFin] = useState('');
  const [consultado, setConsultado] = useState(false);

  return (
    <PublicLayout>
      <Box sx={{ backgroundColor: '#6B7A8A', py: 5 }}>
        <Container maxWidth="lg">
          <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem', fontWeight: 600, mb: 1 }}>MEDIOS EDUCATIVOS</Typography>
          <Typography sx={{ color: '#FFFFFF', fontWeight: 800, fontSize: { xs: '2rem', md: '2.25rem' }, mb: 1 }}>
            Consultar disponibilidad
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.85)' }}>
            Selecciona los criterios para consultar los espacios disponibles.
          </Typography>
          <Box sx={{ width: 40, height: 3, backgroundColor: '#E30613', mt: 2 }} />
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Card elevation={0} sx={{ borderRadius: '12px', border: '1px solid #E5EAF0', p: 3, mb: 4 }}>
          <Typography sx={{ fontWeight: 700, fontSize: '1.15rem', color: '#0B1A2A', mb: 0.5 }}>Define tu búsqueda</Typography>
          <Typography sx={{ color: '#5A6A7A', fontSize: '0.85rem', mb: 0.5 }}>Selecciona los criterios para consultar disponibilidad.</Typography>
          <Box sx={{ width: 40, height: 3, backgroundColor: '#E30613', mb: 2.5 }} />

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' }, gap: 2, mb: 2 }}>
            <TextField select size="small" label="Campus" value={campus} onChange={(e) => setCampus(e.target.value)}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}>
              <MenuItem value="">Seleccionar campus</MenuItem>
              <MenuItem value="Centro">Campus Centro</MenuItem>
              <MenuItem value="San Damián">Campus San Damián</MenuItem>
              <MenuItem value="Santiago">Campus Santiago</MenuItem>
            </TextField>
            <TextField select size="small" label="Espacio" value={espacio} onChange={(e) => setEspacio(e.target.value)}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}>
              <MenuItem value="">Seleccionar espacio</MenuItem>
              <MenuItem value="Auditorio">Auditorio</MenuItem>
              <MenuItem value="Aula">Aula</MenuItem>
              <MenuItem value="Laboratorio">Laboratorio</MenuItem>
            </TextField>
            <TextField size="small" type="date" label="Fecha" InputLabelProps={{ shrink: true }}
              value={fecha} onChange={(e) => setFecha(e.target.value)}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }} />
          </Box>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' }, gap: 2, alignItems: 'end' }}>
            <TextField select size="small" label="Hora de inicio" value={horaIni} onChange={(e) => setHoraIni(e.target.value)}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}>
              <MenuItem value="">Seleccionar hora</MenuItem>
              {['07:00', '08:00', '09:00', '10:00', '11:00', '14:00', '16:00'].map((h) => (
                <MenuItem key={h} value={h}>{h}</MenuItem>
              ))}
            </TextField>
            <TextField select size="small" label="Hora de finalización" value={horaFin} onChange={(e) => setHoraFin(e.target.value)}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}>
              <MenuItem value="">Seleccionar hora</MenuItem>
              {['08:00', '09:00', '10:00', '11:00', '12:00', '15:00', '17:00'].map((h) => (
                <MenuItem key={h} value={h}>{h}</MenuItem>
              ))}
            </TextField>
            <Button variant="contained" onClick={() => setConsultado(true)}
              sx={{
                backgroundColor: '#E30613', textTransform: 'none', fontWeight: 700, borderRadius: '8px', py: 1.2, boxShadow: 'none',
                '&:hover': { backgroundColor: '#C10510', boxShadow: 'none' },
              }}>
              Consultar disponibilidad →
            </Button>
          </Box>
          <Button onClick={() => { setCampus(''); setEspacio(''); setFecha(''); setHoraIni(''); setHoraFin(''); setConsultado(false); }}
            sx={{ color: '#5A6A7A', textTransform: 'none', fontSize: '0.85rem', mt: 1.5 }}>
            Limpiar filtros
          </Button>
        </Card>

        <Typography sx={{ fontWeight: 700, fontSize: '1.25rem', color: '#0B1A2A', mb: 0.5 }}>Resultados</Typography>
        <Box sx={{ width: 40, height: 3, backgroundColor: '#E30613', mb: 2 }} />

        <Card elevation={0} sx={{ borderRadius: '12px', border: '1px solid #E5EAF0', p: 4, textAlign: 'center' }}>
          {!consultado ? (
            <>
              <Typography sx={{ fontWeight: 700, fontSize: '1.15rem', color: '#0B1A2A', mb: 0.5 }}>
                Selecciona los criterios de búsqueda
              </Typography>
              <Typography sx={{ color: '#5A6A7A', fontSize: '0.9rem', mb: 2 }}>
                para consultar la disponibilidad de los espacios.
              </Typography>
            </>
          ) : (
            <>
              <Typography sx={{ fontWeight: 700, fontSize: '1.15rem', color: '#1B7A3D', mb: 1 }}>
                Espacio disponible
              </Typography>
              <Typography sx={{ color: '#5A6A7A', mb: 2 }}>
                {espacio || 'Espacio'} · {campus || 'Campus'} · {fecha || 'Fecha'} · {horaIni}–{horaFin}
              </Typography>
              <Button variant="contained" onClick={() => navigate('/reserva')}
                sx={{
                  backgroundColor: '#E30613', textTransform: 'none', fontWeight: 600, borderRadius: '8px', boxShadow: 'none',
                  '&:hover': { backgroundColor: '#C10510', boxShadow: 'none' },
                }}>
                Solicitar reserva →
              </Button>
            </>
          )}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Box sx={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#1565C0' }} />
              <Typography sx={{ fontSize: '0.8rem', color: '#5A6A7A' }}>Disponible</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Box sx={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#E30613' }} />
              <Typography sx={{ fontSize: '0.8rem', color: '#5A6A7A' }}>Reservado</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Box sx={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#5A6A7A' }} />
              <Typography sx={{ fontSize: '0.8rem', color: '#5A6A7A' }}>No disponible</Typography>
            </Box>
          </Box>
        </Card>
      </Container>
    </PublicLayout>
  );
}
