/**
 * Pantalla: Graduandos — Listado
 */

import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Typography, Button, TextField, MenuItem, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Card, CardContent,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AdminLayout from '../../../../../components/AdminLayout';
import type { Graduando, GraduandoFilters } from './interfaces/ceremonias.interface';
import { getGraduandos, getCeremoniaById, PROGRAMA_OPTIONS } from './services/ceremonias.service';
import type { Ceremonia } from './interfaces/ceremonias.interface';

export default function Graduandos() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [items, setItems] = useState<Graduando[]>([]);
  const [stats, setStats] = useState({ total: 0, revisados: 0, errores: 0 });
  const [ceremonia, setCeremonia] = useState<Ceremonia | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<GraduandoFilters>({});

  const load = useCallback(async (f?: GraduandoFilters) => {
    if (!id) return;
    setLoading(true);
    try {
      const [res, c] = await Promise.all([
        getGraduandos(id, f),
        getCeremoniaById(id),
      ]);
      setItems(res.data);
      setStats(res.stats);
      setCeremonia(c);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  return (
    <AdminLayout>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#0B1A2A', fontSize: '1.75rem', mb: 0.5 }}>
            Graduandos
          </Typography>
          <Typography sx={{ color: '#5A6A7A', fontSize: '0.875rem' }}>
            Eventos institucionales / Ceremonias de grado / Graduandos
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button variant="outlined" startIcon={<AddIcon />}
            onClick={() => navigate(`/admin/eventos/ceremonias/${id}/graduandos/nuevo`)}
            sx={{ textTransform: 'none', fontWeight: 500, borderRadius: '8px', borderColor: '#C5CDD8', color: '#1A2A3A' }}>
            + Agregar graduando
          </Button>
          <Button variant="contained" sx={{
            backgroundColor: '#0B3A5C', textTransform: 'none', fontWeight: 600, borderRadius: '8px',
            boxShadow: 'none', '&:hover': { backgroundColor: '#062A42', boxShadow: 'none' },
          }}>
            Importar graduandos
          </Button>
        </Box>
      </Box>

      <Typography sx={{ fontWeight: 600, fontSize: '1rem', color: '#0B1A2A', mt: 1 }}>
        {ceremonia?.nombre.replace(/ — Ejemplo \d+/, '') || 'Ceremonia de grados'}
      </Typography>
      <Typography sx={{ color: '#5A6A7A', fontSize: '0.85rem', mb: 2 }}>Fecha · Lugar</Typography>

      {/* Stats */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 1.5, mb: 3 }}>
        {[
          { label: 'Total de graduandos', value: stats.total },
          { label: 'Registros revisados', value: stats.revisados },
          { label: 'Registros con errores', value: stats.errores, red: true },
          { label: 'Ceremonia completa', value: 'Todos los graduandos' },
        ].map((s) => (
          <Card key={s.label} elevation={0} sx={{ borderRadius: '10px', border: '1px solid #E5EAF0' }}>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Typography sx={{ color: '#5A6A7A', fontSize: '0.8rem', mb: 0.5 }}>{s.label}</Typography>
              <Typography sx={{ fontWeight: 700, fontSize: '1.25rem', color: s.red ? '#E30613' : '#0B1A2A' }}>
                {loading ? '—' : s.value}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Filtros */}
      <Typography sx={{ fontWeight: 600, fontSize: '0.95rem', color: '#1A2A3A', mb: 1 }}>Consultar graduandos</Typography>
      <Box sx={{
        backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5EAF0',
        p: 2, mb: 2.5, display: 'flex', flexWrap: 'wrap', gap: 1.5, alignItems: 'center',
      }}>
        <TextField size="small" placeholder="Buscar por nombre o documento"
          value={filters.search || ''}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          sx={{ flex: 1, minWidth: 180, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
        />
        <TextField select size="small" label="Sesión" value={filters.sesion || 'Todas las sesiones'}
          onChange={(e) => setFilters({ ...filters, sesion: e.target.value })}
          sx={{ minWidth: 150, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}>
          <MenuItem value="Todas las sesiones">Todas las sesiones</MenuItem>
          <MenuItem value="Sesión 1">Sesión 1</MenuItem>
          <MenuItem value="Sesión 2">Sesión 2</MenuItem>
        </TextField>
        <TextField select size="small" label="Programa académico" value={filters.programa || 'Todos los programas'}
          onChange={(e) => setFilters({ ...filters, programa: e.target.value })}
          sx={{ minWidth: 170, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}>
          <MenuItem value="Todos los programas">Todos los programas</MenuItem>
          {PROGRAMA_OPTIONS.map((p) => <MenuItem key={p} value={p}>{p}</MenuItem>)}
        </TextField>
        <Button variant="contained" onClick={() => load(filters)}
          sx={{ backgroundColor: '#0B3A5C', textTransform: 'none', fontWeight: 600, borderRadius: '8px', '&:hover': { backgroundColor: '#062A42' } }}>
          Buscar
        </Button>
        <Button variant="text" onClick={() => { setFilters({}); load({}); }}
          sx={{ color: '#5A6A7A', textTransform: 'none' }}>
          Limpiar filtros
        </Button>
      </Box>

      {/* Tabla */}
      <TableContainer sx={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5EAF0', overflow: 'hidden', mb: 2.5 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#FAFBFC' }}>
              {['Graduando', 'Documento', 'Programa', 'Sesión', 'Invitados', 'Acción'].map((h) => (
                <TableCell key={h} sx={{ fontWeight: 600, color: '#1A2A3A', fontSize: '0.85rem', borderBottom: '1px solid #E5EAF0', py: 1.75 }}>
                  {h}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={6} sx={{ textAlign: 'center', py: 4, color: '#5A6A7A' }}>Cargando…</TableCell></TableRow>
            ) : items.map((g) => (
              <TableRow key={g.id} sx={{ '&:hover': { backgroundColor: '#F8FAFC' }, '& td': { borderBottom: '1px solid #F0F3F7' } }}>
                <TableCell sx={{ fontWeight: 600, color: '#1A2A3A', fontSize: '0.875rem' }}>
                  {g.nombres} {g.apellidos}
                </TableCell>
                <TableCell sx={{ color: '#1A2A3A', fontSize: '0.875rem' }}>{g.documento}</TableCell>
                <TableCell sx={{ color: '#1A2A3A', fontSize: '0.875rem' }}>{g.programa}</TableCell>
                <TableCell sx={{ color: '#1A2A3A', fontSize: '0.875rem' }}>{g.sesionLabel || '—'}</TableCell>
                <TableCell sx={{ color: '#1A2A3A', fontSize: '0.875rem' }}>
                  {g.invitadosCount} invitado{g.invitadosCount !== 1 ? 's' : ''}
                </TableCell>
                <TableCell>
                  <Button variant="text"
                    onClick={() => navigate(`/admin/eventos/ceremonias/${id}/graduandos/${g.id}`)}
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

      {/* Importar bloque */}
      <Card elevation={0} sx={{ borderRadius: '12px', border: '1px solid #E5EAF0' }}>
        <CardContent sx={{ p: 2.5 }}>
          <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', color: '#0B1A2A', mb: 0.5 }}>
            Importar graduandos
          </Typography>
          <Typography sx={{ color: '#5A6A7A', fontSize: '0.85rem', mb: 1.5 }}>
            1 Cargar archivo → 2 Revisar → 3 Validar → 4 Confirmar / Importar
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
            <Box>
              <Typography sx={{ fontWeight: 500, fontSize: '0.9rem', color: '#1A2A3A' }}>Listado oficial de graduandos</Typography>
              <Typography sx={{ color: '#1B7A3D', fontSize: '0.85rem' }}>
                {stats.revisados} registros revisados · {stats.revisados - stats.errores} válidos · {stats.errores} con errores
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button variant="outlined" sx={{ textTransform: 'none', borderRadius: '8px', borderColor: '#C5CDD8', color: '#1A2A3A' }}>
                Revisar
              </Button>
              <Button variant="contained" sx={{
                backgroundColor: '#E30613', textTransform: 'none', fontWeight: 600, borderRadius: '8px',
                boxShadow: 'none', '&:hover': { backgroundColor: '#C10510', boxShadow: 'none' },
              }}>
                Confirmar
              </Button>
            </Box>
          </Box>
          <Typography sx={{ color: '#5A6A7A', fontSize: '0.8rem', mt: 1.5 }}>
            Los invitados se registran posteriormente desde el detalle del graduando.
          </Typography>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
