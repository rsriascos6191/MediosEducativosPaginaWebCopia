/**
 * Portal público – Formulario de solicitud de reserva
 */

import { useState } from 'react';
import {
  Box, Typography, Button, Container, TextField, MenuItem, Checkbox,
  FormControlLabel, Accordion, AccordionSummary, AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useNavigate } from 'react-router-dom';
import PublicLayout from '../../../../components/PublicLayout';

export default function FormularioReserva() {
  const navigate = useNavigate();
  const [medios, setMedios] = useState<Record<string, boolean>>({});

  const handleSubmit = () => {
    navigate('/reserva/confirmacion');
  };

  return (
    <PublicLayout>
      <Box sx={{ backgroundColor: '#6B7A8A', py: 4 }}>
        <Container maxWidth="lg">
          <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem', fontWeight: 600, mb: 1 }}>MEDIOS EDUCATIVOS</Typography>
          <Typography sx={{ color: '#FFFFFF', fontWeight: 800, fontSize: { xs: '1.75rem', md: '2.25rem' }, mb: 0.5 }}>
            Solicitud de reserva
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.85)' }}>
            Completa los datos de la solicitud. No necesitas crear una cuenta.
          </Typography>
          <Box sx={{ width: 40, height: 3, backgroundColor: '#E30613', mt: 2 }} />
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Steps */}
        <Box sx={{
          display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap', backgroundColor: '#FFFFFF',
          borderRadius: '12px', border: '1px solid #E5EAF0', p: 1.5, justifyContent: 'center',
        }}>
          {['01 Solicitante', '02 Evento', '03 Reserva', '04 Información', '05 Medios'].map((s, i) => (
            <Typography key={s} sx={{
              fontSize: '0.8rem', fontWeight: i === 0 ? 700 : 500,
              color: i === 0 ? '#0B3A5C' : '#9AA5B5', px: 1.5,
            }}>
              {s}
            </Typography>
          ))}
        </Box>

        {/* 01 Datos del evento */}
        <Accordion defaultExpanded elevation={0} sx={{ border: '1px solid #E5EAF0', borderRadius: '12px !important', mb: 2, '&:before': { display: 'none' } }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box>
              <Typography sx={{ fontWeight: 700, color: '#0B1A2A' }}>01 Datos del evento</Typography>
              <Typography sx={{ color: '#5A6A7A', fontSize: '0.8rem' }}>Información principal de la actividad que se desea registrar.</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' }, gap: 2 }}>
              <TextField size="small" type="date" label="Fecha de inicio *" InputLabelProps={{ shrink: true }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }} />
              <TextField size="small" type="date" label="Fecha de fin *" InputLabelProps={{ shrink: true }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }} />
              <TextField select size="small" label="Hora de inicio *"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}>
                <MenuItem value="">Seleccionar hora</MenuItem>
                {['07:00', '08:00', '09:00', '10:00', '14:00'].map((h) => <MenuItem key={h} value={h}>{h}</MenuItem>)}
              </TextField>
              <TextField select size="small" label="Hora de finalización *"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}>
                <MenuItem value="">Seleccionar hora</MenuItem>
                {['08:00', '09:00', '10:00', '12:00', '16:00'].map((h) => <MenuItem key={h} value={h}>{h}</MenuItem>)}
              </TextField>
              <TextField size="small" label="Nombre del evento *" placeholder="Ingresar nombre del evento"
                sx={{ gridColumn: { sm: 'span 2' }, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }} />
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* 02 Datos del solicitante */}
        <Accordion defaultExpanded elevation={0} sx={{ border: '1px solid #E5EAF0', borderRadius: '12px !important', mb: 2, '&:before': { display: 'none' } }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box>
              <Typography sx={{ fontWeight: 700, color: '#0B1A2A' }}>02 Datos del solicitante</Typography>
              <Typography sx={{ color: '#5A6A7A', fontSize: '0.8rem' }}>Información de contacto de quien realiza la solicitud.</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' }, gap: 2 }}>
              <TextField size="small" label="Nombre completo *" placeholder="Ingresar nombre completo"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }} />
              <TextField size="small" label="Cargo / rol *" placeholder="Ingresar cargo o rol"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }} />
              <TextField size="small" label="Correo electrónico *" placeholder="Ingresar correo electrónico"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }} />
              <TextField size="small" label="Número de contacto *" placeholder="Ingresar número de contacto"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }} />
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* 03 Dependencia */}
        <Accordion defaultExpanded elevation={0} sx={{ border: '1px solid #E5EAF0', borderRadius: '12px !important', mb: 2, '&:before': { display: 'none' } }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box>
              <Typography sx={{ fontWeight: 700, color: '#0B1A2A' }}>03 Dependencia / procedencia</Typography>
              <Typography sx={{ color: '#5A6A7A', fontSize: '0.8rem' }}>Identifica la procedencia institucional del solicitante.</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' }, gap: 2 }}>
              <TextField select size="small" label="Dependencia general *"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}>
                <MenuItem value="">Seleccione una opción</MenuItem>
                <MenuItem value="Académica">Académica</MenuItem>
                <MenuItem value="Administrativa">Administrativa</MenuItem>
              </TextField>
              <TextField select size="small" label="Programa / Dependencia específico *"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}>
                <MenuItem value="">Seleccione una opción</MenuItem>
                <MenuItem value="Ingeniería">Ingeniería de Sistemas</MenuItem>
                <MenuItem value="Educación">Educación</MenuItem>
              </TextField>
              <TextField size="small" label="Especifique el grupo" placeholder="Ingresar información si corresponde"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }} />
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* 04 Ubicación */}
        <Accordion defaultExpanded elevation={0} sx={{ border: '1px solid #E5EAF0', borderRadius: '12px !important', mb: 2, '&:before': { display: 'none' } }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box>
              <Typography sx={{ fontWeight: 700, color: '#0B1A2A' }}>04 Ubicación y espacio</Typography>
              <Typography sx={{ color: '#5A6A7A', fontSize: '0.8rem' }}>Define el campus, tipo de espacio y espacio específico.</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' }, gap: 2 }}>
              <TextField select size="small" label="Campus *"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}>
                <MenuItem value="">Seleccione campus</MenuItem>
                <MenuItem value="Centro">Campus Centro</MenuItem>
                <MenuItem value="San Damián">Campus San Damián</MenuItem>
              </TextField>
              <TextField select size="small" label="Tipo de espacio *"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}>
                <MenuItem value="">Seleccione tipo de espacio</MenuItem>
                <MenuItem value="Auditorio">Auditorio</MenuItem>
                <MenuItem value="Aula">Aula</MenuItem>
              </TextField>
              <TextField select size="small" label="Espacio específico *"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}>
                <MenuItem value="">Seleccione espacio</MenuItem>
                <MenuItem value="Auditorio principal">Auditorio principal</MenuItem>
              </TextField>
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* 05 Medios */}
        <Accordion defaultExpanded elevation={0} sx={{ border: '1px solid #E5EAF0', borderRadius: '12px !important', mb: 3, '&:before': { display: 'none' } }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box>
              <Typography sx={{ fontWeight: 700, color: '#0B1A2A' }}>05 Medios requeridos</Typography>
              <Typography sx={{ color: '#5A6A7A', fontSize: '0.8rem' }}>Selecciona los medios necesarios para la actividad.</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Typography sx={{ fontSize: '0.85rem', color: '#1A2A3A', mb: 1 }}>Seleccione los medios necesarios:</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              {['Proyector', 'Sonido', 'Micrófono', 'Computador', 'Otro'].map((m) => (
                <FormControlLabel key={m}
                  control={<Checkbox size="small" checked={!!medios[m]}
                    onChange={(e) => setMedios({ ...medios, [m]: e.target.checked })} />}
                  label={<Typography sx={{ fontSize: '0.875rem' }}>{m}</Typography>}
                />
              ))}
            </Box>
            <TextField fullWidth size="small" label="Observaciones" multiline rows={3}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }} />
          </AccordionDetails>
        </Accordion>

        {/* Footer submit */}
        <Box sx={{
          backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5EAF0',
          p: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2,
        }}>
          <Box>
            <Typography sx={{ fontWeight: 600, fontSize: '0.9rem', color: '#0B1A2A' }}>Revisión de la solicitud</Typography>
            <Typography sx={{ color: '#5A6A7A', fontSize: '0.85rem' }}>
              La solicitud será revisada por el área encargada antes de su confirmación.
            </Typography>
          </Box>
          <Button variant="contained" onClick={handleSubmit}
            sx={{
              backgroundColor: '#E30613', textTransform: 'none', fontWeight: 700, borderRadius: '8px',
              px: 3, py: 1.2, boxShadow: 'none', '&:hover': { backgroundColor: '#C10510', boxShadow: 'none' },
            }}>
            Enviar solicitud →
          </Button>
        </Box>
      </Container>
    </PublicLayout>
  );
}
