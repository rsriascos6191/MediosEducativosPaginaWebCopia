/**
 * Pantalla: Nueva ceremonia — Formulario
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Button, TextField, MenuItem, Card, CardContent,
} from '@mui/material';
import AdminLayout from '../../../../../components/AdminLayout';
import { createCeremonia, LUGAR_OPTIONS } from './services/ceremonias.service';

export default function NuevaCeremonia() {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState('');
  const [fecha, setFecha] = useState('');
  const [lugar, setLugar] = useState('');
  const [saving, setSaving] = useState(false);

  const handleCrear = async () => {
    if (!nombre.trim()) return;
    setSaving(true);
    try {
      const c = await createCeremonia({
        nombre,
        fecha: fecha ? new Date(fecha + 'T12:00:00').toLocaleDateString('es-CO') : '',
        fechaISO: fecha,
        lugar,
        estado: 'Programada',
      });
      navigate(`/admin/eventos/ceremonias/${c.id}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#0B1A2A', fontSize: '1.75rem', mb: 0.5 }}>
          Nueva ceremonia
        </Typography>
        <Typography sx={{ color: '#5A6A7A', fontSize: '0.875rem', mb: 0.5 }}>
          Eventos institucionales / Ceremonias de grado / Nueva ceremonia
        </Typography>
        <Typography sx={{ color: '#5A6A7A', fontSize: '0.9rem' }}>
          Registra la información general de la ceremonia para continuar con su configuración.
        </Typography>
      </Box>

      <Card elevation={0} sx={{ borderRadius: '12px', border: '1px solid #E5EAF0', backgroundColor: '#FFFFFF', maxWidth: 800 }}>
        <CardContent sx={{ p: 3.5 }}>
          <Typography sx={{ fontWeight: 700, fontSize: '0.8rem', color: '#1565C0', letterSpacing: 0.5, mb: 0.5 }}>
            INFORMACIÓN GENERAL
          </Typography>
          <Typography sx={{ color: '#5A6A7A', fontSize: '0.875rem', mb: 0.5 }}>
            Datos generales para identificar y programar la ceremonia.
          </Typography>
          <Box sx={{ width: 40, height: 3, backgroundColor: '#E30613', mb: 2.5 }} />

          <Typography sx={{ fontWeight: 500, fontSize: '0.875rem', color: '#1A2A3A', mb: 0.75 }}>
            Nombre de la ceremonia
          </Typography>
          <TextField fullWidth size="small" placeholder="Ingresa el nombre de la ceremonia"
            value={nombre} onChange={(e) => setNombre(e.target.value)}
            sx={{ mb: 2.5, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
          />

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' }, gap: 2, mb: 3 }}>
            <Box>
              <Typography sx={{ fontWeight: 500, fontSize: '0.875rem', color: '#1A2A3A', mb: 0.75 }}>Fecha</Typography>
              <TextField fullWidth size="small" type="date" InputLabelProps={{ shrink: true }}
                value={fecha} onChange={(e) => setFecha(e.target.value)}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 500, fontSize: '0.875rem', color: '#1A2A3A', mb: 0.75 }}>Lugar / campus</Typography>
              <TextField select fullWidth size="small" value={lugar}
                onChange={(e) => setLugar(e.target.value)}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              >
                <MenuItem value="">Selecciona el lugar o campus</MenuItem>
                {LUGAR_OPTIONS.map((l) => <MenuItem key={l} value={l}>{l}</MenuItem>)}
              </TextField>
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 500, fontSize: '0.875rem', color: '#1A2A3A', mb: 0.75 }}>Estado</Typography>
              <TextField fullWidth size="small" value="Programada" disabled
                helperText="Estado inicial de la ceremonia"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px', backgroundColor: '#F8FAFC' } }}
              />
            </Box>
          </Box>

          <Box sx={{ backgroundColor: '#F0F5FA', borderRadius: '10px', p: 2, mb: 3 }}>
            <Typography sx={{ fontWeight: 600, fontSize: '0.9rem', color: '#0B1A2A', mb: 0.4 }}>
              Siguiente paso
            </Typography>
            <Typography sx={{ color: '#5A6A7A', fontSize: '0.85rem' }}>
              Después de crear la ceremonia podrás configurar sus sesiones, horarios, programas y graduandos.
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5 }}>
            <Button variant="outlined" onClick={() => navigate('/admin/eventos/ceremonias')}
              sx={{ textTransform: 'none', fontWeight: 500, borderRadius: '8px', borderColor: '#C5CDD8', color: '#1A2A3A' }}>
              Cancelar
            </Button>
            <Button variant="contained" disabled={saving || !nombre.trim()} onClick={handleCrear}
              sx={{
                backgroundColor: '#E30613', textTransform: 'none', fontWeight: 600, borderRadius: '8px',
                px: 2.5, boxShadow: 'none', '&:hover': { backgroundColor: '#C10510', boxShadow: 'none' },
              }}>
              Crear ceremonia
            </Button>
          </Box>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
