/**
 * Pantalla: Listado de Invitados — Gestión
 * Modal: Editar invitado
 */

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box, Typography, Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, MenuItem, IconButton, CircularProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AdminLayout from '../../../../../components/AdminLayout';
import type { Invitado } from './interfaces/ceremonias.interface';
import { getInvitados, updateInvitado, getCeremoniaById } from './services/ceremonias.service';
import type { Ceremonia } from './interfaces/ceremonias.interface';

export default function Invitados() {
  const { id } = useParams<{ id: string }>();
  const [items, setItems] = useState<Invitado[]>([]);
  const [ceremonia, setCeremonia] = useState<Ceremonia | null>(null);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [selected, setSelected] = useState<Invitado | null>(null);
  const [nombre, setNombre] = useState('');
  const [documento, setDocumento] = useState('');
  const [estado, setEstado] = useState('Autorizado');

  const load = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const [invs, c] = await Promise.all([getInvitados(id), getCeremoniaById(id)]);
      setItems(invs);
      setCeremonia(c);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  const openEdit = (inv: Invitado) => {
    setSelected(inv);
    setNombre(inv.nombre);
    setDocumento(inv.documento);
    setEstado(inv.autorizacion);
    setEditOpen(true);
  };

  const handleSave = async () => {
    if (!selected) return;
    await updateInvitado(selected.id, {
      nombre,
      documento,
      autorizacion: estado as 'Autorizado' | 'Pendiente',
    });
    setEditOpen(false);
    load();
  };

  return (
    <AdminLayout>
      <Box sx={{ mb: 2.5 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#0B1A2A', fontSize: '1.75rem', mb: 0.5 }}>
          Listado de Invitados — Gestión
        </Typography>
        <Typography sx={{ color: '#5A6A7A', fontSize: '0.875rem' }}>
          Eventos institucionales / Ceremonias de grado / Invitados
        </Typography>
      </Box>

      <Typography sx={{ fontWeight: 700, fontSize: '1.1rem', color: '#0B1A2A', mb: 2 }}>
        {ceremonia?.codigo || 'CER-025'} · Invitados de la ceremonia
      </Typography>

      <TableContainer sx={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5EAF0', overflow: 'hidden' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#FAFBFC' }}>
              {['Nombre', 'Documento', 'Graduando', 'Tipo', 'Autorización', 'Acción'].map((h) => (
                <TableCell key={h} sx={{ fontWeight: 600, color: '#1A2A3A', fontSize: '0.85rem', borderBottom: '1px solid #E5EAF0', py: 1.75 }}>
                  {h}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} sx={{ textAlign: 'center', py: 4 }}>
                  <CircularProgress size={28} sx={{ color: '#0B3A5C' }} />
                </TableCell>
              </TableRow>
            ) : items.map((inv) => (
              <TableRow key={inv.id} sx={{ '&:hover': { backgroundColor: '#F8FAFC' }, '& td': { borderBottom: '1px solid #F0F3F7' } }}>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>{inv.nombre}</TableCell>
                <TableCell sx={{ fontSize: '0.875rem' }}>{inv.documento}</TableCell>
                <TableCell sx={{ fontSize: '0.875rem' }}>{inv.graduandoNombre}</TableCell>
                <TableCell sx={{ fontSize: '0.875rem' }}>{inv.tipo}</TableCell>
                <TableCell sx={{ fontSize: '0.875rem', color: inv.autorizacion === 'Autorizado' ? '#1B7A3D' : '#B76E00' }}>
                  {inv.autorizacion}
                </TableCell>
                <TableCell>
                  <Button variant="text" onClick={() => openEdit(inv)}
                    sx={{ color: '#1565C0', textTransform: 'none', fontWeight: 500, fontSize: '0.875rem', p: 0, minWidth: 'auto',
                      '&:hover': { backgroundColor: 'transparent', textDecoration: 'underline' } }}>
                    Editar →
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="sm" fullWidth
        PaperProps={{ sx: { borderRadius: '12px' } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>
          Editar invitado
          <IconButton onClick={() => setEditOpen(false)} sx={{ position: 'absolute', right: 12, top: 12 }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: '#5A6A7A', fontSize: '0.875rem', mb: 2 }}>
            Actualiza la información del invitado asociado al graduando.
          </Typography>
          <TextField fullWidth size="small" label="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)}
            sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }} />
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 1 }}>
            <TextField size="small" label="Documento" value={documento} onChange={(e) => setDocumento(e.target.value)}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }} />
            <TextField select size="small" label="Estado" value={estado} onChange={(e) => setEstado(e.target.value)}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}>
              <MenuItem value="Autorizado">Autorizado</MenuItem>
              <MenuItem value="Pendiente">Pendiente</MenuItem>
            </TextField>
          </Box>
          <Typography sx={{ color: '#5A6A7A', fontSize: '0.8rem' }}>
            El estado corresponde a la validación del invitado, no al registro de ingreso.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setEditOpen(false)} sx={{ textTransform: 'none', color: '#5A6A7A' }}>Cancelar</Button>
          <Button variant="contained" onClick={handleSave}
            sx={{
              backgroundColor: '#E30613', textTransform: 'none', fontWeight: 600, borderRadius: '8px',
              boxShadow: 'none', '&:hover': { backgroundColor: '#C10510', boxShadow: 'none' },
            }}>
            Guardar cambios
          </Button>
        </DialogActions>
      </Dialog>
    </AdminLayout>
  );
}
