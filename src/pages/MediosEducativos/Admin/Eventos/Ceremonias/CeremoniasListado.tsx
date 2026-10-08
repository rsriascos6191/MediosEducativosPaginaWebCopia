/**
 * Pantalla: Ceremonias de grado — Listado
 */

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Button, TextField, MenuItem,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AdminLayout from '../../../../../components/AdminLayout';
import type { Ceremonia, CeremoniaFilters } from './interfaces/ceremonias.interface';
import { getCeremonias, ESTADO_CEREMONIA_OPTIONS } from './services/ceremonias.service';

const estadoStyles: Record<string, { bg: string; color: string }> = {
  Programada: { bg: '#E3F2FD', color: '#1565C0' },
  'En curso': { bg: '#E6F4EA', color: '#1B7A3D' },
  Finalizada: { bg: '#F0F2F5', color: '#5A6A7A' },
};

export default function CeremoniasListado() {
  const navigate = useNavigate();
  const [items, setItems] = useState<Ceremonia[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<CeremoniaFilters>({});

  const load = useCallback(async (f?: CeremoniaFilters) => {
    setLoading(true);
    try {
      const res = await getCeremonias(f);
      setItems(res.data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  return (
    <AdminLayout>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#0B1A2A', fontSize: '1.75rem', mb: 0.5 }}>
            Ceremonias de grado
          </Typography>
          <Typography sx={{ color: '#5A6A7A', fontSize: '0.875rem' }}>
            Eventos institucionales / Ceremonias de grado
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/admin/eventos/ceremonias/nueva')}
          sx={{
            backgroundColor: '#E30613', textTransform: 'none', fontWeight: 600,
            borderRadius: '8px', px: 2.5, py: 1.1, boxShadow: 'none',
            '&:hover': { backgroundColor: '#C10510', boxShadow: 'none' },
          }}
        >
          Nueva ceremonia
        </Button>
      </Box>
      <Typography sx={{ color: '#5A6A7A', fontSize: '0.9rem', mb: 2.5 }}>
        Cada ceremonia puede organizarse en varias sesiones y horarios según la cantidad de graduandos.
      </Typography>

      {/* Filtros */}
      <Box sx={{
        backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5EAF0',
        p: 2, mb: 2.5, display: 'flex', flexWrap: 'wrap', gap: 1.5, alignItems: 'center',
      }}>
        <TextField size="small" placeholder="Buscar por nombre de ceremonia"
          value={filters.nombre || ''}
          onChange={(e) => setFilters({ ...filters, nombre: e.target.value })}
          sx={{ flex: 1, minWidth: 200, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
        />
        <TextField size="small" type="date" label="Fecha" InputLabelProps={{ shrink: true }}
          value={filters.fecha || ''}
          onChange={(e) => setFilters({ ...filters, fecha: e.target.value })}
          sx={{ minWidth: 150, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
        />
        <TextField select size="small" label="Estado" value={filters.estado || 'Todos'}
          onChange={(e) => setFilters({ ...filters, estado: e.target.value })}
          sx={{ minWidth: 130, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
        >
          {ESTADO_CEREMONIA_OPTIONS.map((e) => <MenuItem key={e} value={e}>{e}</MenuItem>)}
        </TextField>
        <Button variant="contained" onClick={() => load(filters)}
          sx={{ backgroundColor: '#0B3A5C', textTransform: 'none', fontWeight: 600, borderRadius: '8px', px: 3, '&:hover': { backgroundColor: '#062A42' } }}>
          Buscar
        </Button>
        <Button variant="text" onClick={() => { setFilters({}); load({}); }}
          sx={{ color: '#5A6A7A', textTransform: 'none', fontWeight: 500 }}>
          Limpiar filtros
        </Button>
      </Box>

      {/* Tabla */}
      <TableContainer sx={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5EAF0', overflow: 'hidden' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#FAFBFC' }}>
              {['Ceremonia', 'Fecha', 'Lugar', 'Sesiones', 'Graduandos', 'Estado', 'Acciones'].map((h) => (
                <TableCell key={h} sx={{ fontWeight: 600, color: '#1A2A3A', fontSize: '0.85rem', borderBottom: '1px solid #E5EAF0', py: 1.75 }}>
                  {h}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={7} sx={{ textAlign: 'center', py: 4, color: '#5A6A7A' }}>Cargando…</TableCell></TableRow>
            ) : items.map((c) => (
              <TableRow key={c.id} sx={{ '&:hover': { backgroundColor: '#F8FAFC' }, '& td': { borderBottom: '1px solid #F0F3F7' } }}>
                <TableCell sx={{ fontWeight: 600, color: '#1A2A3A', fontSize: '0.875rem' }}>{c.nombre}</TableCell>
                <TableCell sx={{ color: '#1A2A3A', fontSize: '0.875rem' }}>{c.fecha}</TableCell>
                <TableCell sx={{ color: '#1A2A3A', fontSize: '0.875rem' }}>{c.lugar}</TableCell>
                <TableCell sx={{ color: '#1A2A3A', fontSize: '0.875rem' }}>{c.sesiones} sesiones</TableCell>
                <TableCell sx={{ color: '#1A2A3A', fontSize: '0.875rem' }}>{c.graduandos} graduandos</TableCell>
                <TableCell>
                  <Chip label={c.estado} size="small" sx={{
                    backgroundColor: estadoStyles[c.estado]?.bg, color: estadoStyles[c.estado]?.color,
                    fontWeight: 600, fontSize: '0.75rem', height: 26, borderRadius: '6px',
                  }} />
                </TableCell>
                <TableCell>
                  <Button variant="text" onClick={() => navigate(`/admin/eventos/ceremonias/${c.id}`)}
                    sx={{ color: '#1565C0', textTransform: 'none', fontWeight: 500, fontSize: '0.875rem', p: 0, minWidth: 'auto',
                      '&:hover': { backgroundColor: 'transparent', textDecoration: 'underline' } }}>
                    Ver detalle
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Typography sx={{ color: '#5A6A7A', fontSize: '0.85rem', mt: 2 }}>
        Datos de ejemplo para representar una ceremonia general con varias sesiones.
      </Typography>
    </AdminLayout>
  );
}
