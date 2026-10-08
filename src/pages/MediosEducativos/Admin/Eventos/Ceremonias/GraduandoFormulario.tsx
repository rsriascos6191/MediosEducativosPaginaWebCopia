/**
 * Pantalla: Graduando — Formulario
 */

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Typography, Button, TextField, MenuItem, Card, CardContent,
} from '@mui/material';
import AdminLayout from '../../../../../components/AdminLayout';
import { PROGRAMA_OPTIONS } from './services/ceremonias.service';

export default function GraduandoFormulario() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [programa, setPrograma] = useState('');
  const [sesion, setSesion] = useState('');
  const [documento, setDocumento] = useState('');
  const [nombres, setNombres] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [telefono, setTelefono] = useState('');
  const [correo, setCorreo] = useState('');
  const [codigo, setCodigo] = useState('');
  const [estado, setEstado] = useState('');

  return (
    <AdminLayout>
      <Box sx={{ mb: 2.5 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#0B1A2A', fontSize: '1.75rem', mb: 0.5 }}>
          Graduando — Formulario
        </Typography>
        <Typography sx={{ color: '#5A6A7A', fontSize: '0.875rem' }}>
          Eventos institucionales / Ceremonias de grado / Graduandos / Graduando
        </Typography>
      </Box>

      <Box sx={{
        backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5EAF0',
        px: 3, py: 1.75, mb: 2.5,
      }}>
        <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: '#0B1A2A' }}>Ceremonia de grados</Typography>
        <Typography sx={{ color: '#5A6A7A', fontSize: '0.85rem' }}>Fecha · Lugar</Typography>
      </Box>

      <Card elevation={0} sx={{ borderRadius: '12px', border: '1px solid #E5EAF0', maxWidth: 900 }}>
        <CardContent sx={{ p: 3.5 }}>
          <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: '#0B1A2A', mb: 0.5 }}>
            Información académica
          </Typography>
          <Box sx={{ width: 40, height: 3, backgroundColor: '#E30613', mb: 2 }} />

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mb: 3 }}>
            <Box>
              <Typography sx={{ fontSize: '0.85rem', color: '#1A2A3A', mb: 0.5 }}>Programa académico</Typography>
              <TextField select fullWidth size="small" value={programa} onChange={(e) => setPrograma(e.target.value)}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}>
                <MenuItem value="">Selecciona un programa académico</MenuItem>
                {PROGRAMA_OPTIONS.map((p) => <MenuItem key={p} value={p}>{p}</MenuItem>)}
              </TextField>
            </Box>
            <Box>
              <Typography sx={{ fontSize: '0.85rem', color: '#1A2A3A', mb: 0.5 }}>Sesión</Typography>
              <TextField select fullWidth size="small" value={sesion} onChange={(e) => setSesion(e.target.value)}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}>
                <MenuItem value="">Selecciona una sesión</MenuItem>
                <MenuItem value="s1">Sesión 1</MenuItem>
                <MenuItem value="s2">Sesión 2</MenuItem>
              </TextField>
            </Box>
          </Box>

          <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: '#0B1A2A', mb: 0.5 }}>
            Datos personales
          </Typography>
          <Box sx={{ width: 40, height: 3, backgroundColor: '#E30613', mb: 2 }} />

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mb: 2 }}>
            <Box>
              <Typography sx={{ fontSize: '0.85rem', color: '#1A2A3A', mb: 0.5 }}>Documento</Typography>
              <TextField fullWidth size="small" placeholder="Ingresa documento" value={documento}
                onChange={(e) => setDocumento(e.target.value)}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }} />
            </Box>
            <Box>
              <Typography sx={{ fontSize: '0.85rem', color: '#1A2A3A', mb: 0.5 }}>Nombres</Typography>
              <TextField fullWidth size="small" placeholder="Ingresa nombres" value={nombres}
                onChange={(e) => setNombres(e.target.value)}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }} />
            </Box>
            <Box>
              <Typography sx={{ fontSize: '0.85rem', color: '#1A2A3A', mb: 0.5 }}>Apellidos</Typography>
              <TextField fullWidth size="small" placeholder="Ingresa apellidos" value={apellidos}
                onChange={(e) => setApellidos(e.target.value)}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }} />
            </Box>
            <Box>
              <Typography sx={{ fontSize: '0.85rem', color: '#1A2A3A', mb: 0.5 }}>Teléfono</Typography>
              <TextField fullWidth size="small" placeholder="Ingresa teléfono" value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }} />
            </Box>
            <Box>
              <Typography sx={{ fontSize: '0.85rem', color: '#1A2A3A', mb: 0.5 }}>Correo electrónico</Typography>
              <TextField fullWidth size="small" placeholder="Ingresa correo electrónico" value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }} />
            </Box>
          </Box>

          <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: '#0B1A2A', mb: 0.5, mt: 1 }}>
            Información institucional
          </Typography>
          <Box sx={{ width: 40, height: 3, backgroundColor: '#E30613', mb: 2 }} />

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mb: 3 }}>
            <Box>
              <Typography sx={{ fontSize: '0.85rem', color: '#1A2A3A', mb: 0.5 }}>Código estudiantil</Typography>
              <TextField fullWidth size="small" placeholder="Ingresa código estudiantil" value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }} />
            </Box>
            <Box>
              <Typography sx={{ fontSize: '0.85rem', color: '#1A2A3A', mb: 0.5 }}>Estado</Typography>
              <TextField fullWidth size="small" placeholder="Estado del registro" value={estado}
                onChange={(e) => setEstado(e.target.value)}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }} />
            </Box>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5 }}>
            <Button variant="outlined" onClick={() => navigate(`/admin/eventos/ceremonias/${id}/graduandos`)}
              sx={{ textTransform: 'none', borderRadius: '8px', borderColor: '#C5CDD8', color: '#1A2A3A' }}>
              Cancelar
            </Button>
            <Button variant="contained"
              onClick={() => navigate(`/admin/eventos/ceremonias/${id}/graduandos`)}
              sx={{
                backgroundColor: '#E30613', textTransform: 'none', fontWeight: 600, borderRadius: '8px',
                boxShadow: 'none', '&:hover': { backgroundColor: '#C10510', boxShadow: 'none' },
              }}>
              Guardar
            </Button>
          </Box>
        </CardContent>
      </Card>
      <Typography sx={{ color: '#5A6A7A', fontSize: '0.85rem', mt: 2 }}>
        Los invitados se gestionan posteriormente desde el detalle del graduando.
      </Typography>
    </AdminLayout>
  );
}
