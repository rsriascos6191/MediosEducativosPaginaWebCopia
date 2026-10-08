/**
 * Pantalla: Control de ingreso — Sesión
 */

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box, Typography, Button, TextField, Card, CardContent, Chip,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  InputAdornment, CircularProgress,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AdminLayout from '../../../../../components/AdminLayout';
import type { Graduando, Invitado } from './interfaces/ceremonias.interface';
import {
  getCeremoniaById, getGraduandos, getInvitados, registrarIngreso,
} from './services/ceremonias.service';
import type { Ceremonia } from './interfaces/ceremonias.interface';

export default function ControlIngreso() {
  const { id } = useParams<{ id: string }>();
  const [ceremonia, setCeremonia] = useState<Ceremonia | null>(null);
  const [graduandos, setGraduandos] = useState<Graduando[]>([]);
  const [selectedGrad, setSelectedGrad] = useState<Graduando | null>(null);
  const [invitados, setInvitados] = useState<Invitado[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const [c, g] = await Promise.all([getCeremoniaById(id), getGraduandos(id)]);
      setCeremonia(c);
      setGraduandos(g.data);
      if (g.data.length > 0) {
        setSelectedGrad(g.data[0]);
        const invs = await getInvitados(id, g.data[0].id);
        setInvitados(invs);
      }
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  const handleSearch = async () => {
    if (!search.trim() || !id) return;
    const q = search.toLowerCase();
    const found = graduandos.find(
      (g) =>
        `${g.nombres} ${g.apellidos}`.toLowerCase().includes(q) ||
        g.documento.includes(q)
    );
    if (found) {
      setSelectedGrad(found);
      const invs = await getInvitados(id, found.id);
      setInvitados(invs);
    }
  };

  const handleRegistrar = async (invId: string) => {
    await registrarIngreso(invId);
    if (selectedGrad && id) {
      const invs = await getInvitados(id, selectedGrad.id);
      setInvitados(invs);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress sx={{ color: '#0B3A5C' }} />
        </Box>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Box sx={{ mb: 2.5 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#0B1A2A', fontSize: '1.5rem', mb: 0.5 }}>
          {ceremonia?.codigo || 'CER-025'} · Control de ingreso — Sesión 1
        </Typography>
        <Typography sx={{ color: '#5A6A7A', fontSize: '0.875rem' }}>
          Eventos institucionales / Ceremonias de grado / Detalle / Sesión 1 / Control de ingreso
        </Typography>
      </Box>

      {/* Banner */}
      <Box sx={{
        backgroundColor: '#0B3A5C', borderRadius: '12px', px: 3, py: 2, mb: 2.5,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1,
      }}>
        <Box>
          <Typography sx={{ color: '#FFFFFF', fontWeight: 700, fontSize: '1.05rem' }}>
            Ceremonia de grados · Sesión 1
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.85rem' }}>
            Fecha: 15 de septiembre de 2026 · Lugar: Auditorio Principal
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.8rem' }}>
            Hora: No disponible · Programas: No especificados
          </Typography>
        </Box>
        <Typography sx={{ color: '#FFFFFF', fontWeight: 600 }}>Estado: En curso</Typography>
      </Box>

      {/* KPIs Invitados */}
      <Typography sx={{ fontWeight: 600, fontSize: '0.95rem', color: '#1A2A3A', mb: 1 }}>Invitados</Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1.5, mb: 2.5 }}>
        {[
          { label: 'Registrados', value: 120 },
          { label: 'Ingresaron', value: 64 },
          { label: 'Pendientes', value: 56 },
        ].map((k) => (
          <Card key={k.label} elevation={0} sx={{ borderRadius: '10px', border: '1px solid #E5EAF0' }}>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 }, textAlign: 'center' }}>
              <Typography sx={{ color: '#5A6A7A', fontSize: '0.8rem' }}>{k.label}</Typography>
              <Typography sx={{ fontWeight: 700, fontSize: '1.5rem', color: '#0B1A2A' }}>{k.value}</Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* KPIs Graduandos */}
      <Typography sx={{ fontWeight: 600, fontSize: '0.95rem', color: '#1A2A3A', mb: 1 }}>Graduandos</Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1.5, mb: 3 }}>
        {[
          { label: 'Registrados', value: 120 },
          { label: 'Ingresaron', value: 64 },
          { label: 'Pendientes', value: 56 },
        ].map((k) => (
          <Card key={k.label} elevation={0} sx={{ borderRadius: '10px', border: '1px solid #E5EAF0' }}>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 }, textAlign: 'center' }}>
              <Typography sx={{ color: '#5A6A7A', fontSize: '0.8rem' }}>{k.label}</Typography>
              <Typography sx={{ fontWeight: 700, fontSize: '1.5rem', color: '#0B1A2A' }}>{k.value}</Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Buscar */}
      <Box sx={{
        backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5EAF0',
        p: 2, mb: 2, display: 'flex', gap: 1.5, alignItems: 'center',
      }}>
        <TextField fullWidth size="small" placeholder="Nombre o número de documento"
          value={search} onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#9AA5B5', fontSize: 20 }} />
              </InputAdornment>
            ),
          }}
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
        />
        <Button variant="contained" onClick={handleSearch}
          sx={{ backgroundColor: '#0B3A5C', textTransform: 'none', fontWeight: 600, borderRadius: '8px', px: 3, whiteSpace: 'nowrap',
            '&:hover': { backgroundColor: '#062A42' } }}>
          Buscar
        </Button>
      </Box>

      {/* Graduando seleccionado */}
      {selectedGrad && (
        <Box sx={{
          backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5EAF0',
          p: 2.5, mb: 2.5, display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' }, gap: 2,
        }}>
          <Box>
            <Typography sx={{ color: '#5A6A7A', fontSize: '0.8rem' }}>Graduando seleccionado</Typography>
            <Typography sx={{ fontWeight: 700, fontSize: '1.1rem', color: '#0B1A2A' }}>
              {selectedGrad.nombres} {selectedGrad.apellidos}
            </Typography>
            <Typography sx={{ color: '#5A6A7A', fontSize: '0.85rem' }}>Documento: {selectedGrad.documento}</Typography>
            <Typography sx={{ color: '#5A6A7A', fontSize: '0.85rem' }}>Programa: {selectedGrad.programa}</Typography>
          </Box>
          <Box>
            <Typography sx={{ color: '#5A6A7A', fontSize: '0.8rem' }}>Estado de ingreso</Typography>
            <Chip label="Ingresó" size="small" sx={{ backgroundColor: '#E6F4EA', color: '#1B7A3D', fontWeight: 600, mt: 0.5 }} />
            <Typography sx={{ color: '#5A6A7A', fontSize: '0.85rem', mt: 0.5 }}>Sesión: Sesión 1</Typography>
          </Box>
          <Box sx={{ textAlign: { sm: 'right' } }}>
            <Typography sx={{ color: '#1B7A3D', fontWeight: 600, fontSize: '0.9rem' }}>
              Acción: Ya ingresó
            </Typography>
          </Box>
        </Box>
      )}

      {/* Invitados asociados */}
      <Typography sx={{ fontWeight: 700, fontSize: '1.05rem', color: '#0B1A2A', mb: 0.5 }}>
        Invitados asociados
      </Typography>
      <Typography sx={{ color: '#5A6A7A', fontSize: '0.85rem', mb: 1.5 }}>
        Control individual de ingreso de los invitados asociados al graduando seleccionado.
      </Typography>

      <TableContainer sx={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5EAF0', overflow: 'hidden', mb: 2 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#FAFBFC' }}>
              {['Invitado', 'Documento', 'Estado', 'Hora de ingreso', 'Acción'].map((h) => (
                <TableCell key={h} sx={{ fontWeight: 600, color: '#1A2A3A', fontSize: '0.85rem', borderBottom: '1px solid #E5EAF0', py: 1.5 }}>
                  {h}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {invitados.map((inv) => (
              <TableRow key={inv.id} sx={{ '& td': { borderBottom: '1px solid #F0F3F7' } }}>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>{inv.nombre}</TableCell>
                <TableCell sx={{ fontSize: '0.875rem' }}>{inv.documento}</TableCell>
                <TableCell>
                  <Chip
                    label={inv.estadoIngreso || 'Pendiente'}
                    size="small"
                    sx={{
                      backgroundColor: inv.estadoIngreso === 'Ingresó' ? '#E6F4EA' : '#FFF4E5',
                      color: inv.estadoIngreso === 'Ingresó' ? '#1B7A3D' : '#B76E00',
                      fontWeight: 600, fontSize: '0.75rem', height: 24,
                    }}
                  />
                </TableCell>
                <TableCell sx={{ fontSize: '0.875rem' }}>{inv.horaIngreso || '—'}</TableCell>
                <TableCell>
                  {inv.estadoIngreso === 'Ingresó' ? (
                    <Typography sx={{ color: '#1B7A3D', fontSize: '0.85rem', fontWeight: 500 }}>
                      ✓ Ya ingresó · {inv.horaIngreso}
                    </Typography>
                  ) : (
                    <Button variant="contained" size="small" onClick={() => handleRegistrar(inv.id)}
                      sx={{
                        backgroundColor: '#E30613', textTransform: 'none', fontWeight: 600, borderRadius: '8px',
                        boxShadow: 'none', '&:hover': { backgroundColor: '#C10510', boxShadow: 'none' },
                      }}>
                      Registrar ingreso
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography sx={{ color: '#5A6A7A', fontSize: '0.85rem' }}>
        Cada ingreso se registra de forma independiente. Registrar al graduando no registra automáticamente a sus invitados.
      </Typography>
    </AdminLayout>
  );
}
