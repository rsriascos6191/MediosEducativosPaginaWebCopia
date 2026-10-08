/**
 * Pantalla: Graduando + invitados — Detalle
 * Modales: Editar graduando, Agregar invitado, Editar invitado
 */

import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Typography, Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Chip, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, MenuItem, IconButton, CircularProgress, Card, CardContent,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import AdminLayout from '../../../../../components/AdminLayout';
import type { Graduando, Invitado } from './interfaces/ceremonias.interface';
import {
  getGraduandoById, getInvitados, updateInvitado, addInvitado, PROGRAMA_OPTIONS,
} from './services/ceremonias.service';

export default function GraduandoDetalle() {
  const { id, graduandoId } = useParams<{ id: string; graduandoId: string }>();
  const navigate = useNavigate();
  const [graduando, setGraduando] = useState<Graduando | null>(null);
  const [invitados, setInvitados] = useState<Invitado[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [editGradOpen, setEditGradOpen] = useState(false);
  const [addInvOpen, setAddInvOpen] = useState(false);
  const [editInvOpen, setEditInvOpen] = useState(false);
  const [selectedInv, setSelectedInv] = useState<Invitado | null>(null);

  // Form states
  const [formNombres, setFormNombres] = useState('');
  const [formApellidos, setFormApellidos] = useState('');
  const [formDoc, setFormDoc] = useState('');
  const [formTel, setFormTel] = useState('');
  const [formCorreo, setFormCorreo] = useState('');
  const [formCodigo, setFormCodigo] = useState('');
  const [formPrograma, setFormPrograma] = useState('');
  const [formSesion, setFormSesion] = useState('');
  const [invNombre, setInvNombre] = useState('');
  const [invDoc, setInvDoc] = useState('');
  const [invEstado, setInvEstado] = useState('Autorizado');

  const load = useCallback(async () => {
    if (!graduandoId || !id) return;
    setLoading(true);
    try {
      const [g, invs] = await Promise.all([
        getGraduandoById(graduandoId),
        getInvitados(id, graduandoId),
      ]);
      setGraduando(g);
      setInvitados(invs);
      if (g) {
        setFormNombres(g.nombres);
        setFormApellidos(g.apellidos);
        setFormDoc(g.documento);
        setFormTel(g.telefono || 'No registrado');
        setFormCorreo(g.correo || 'No registrado');
        setFormCodigo(g.codigoEstudiantil || 'No registrado');
        setFormPrograma(g.programa);
        setFormSesion(g.sesionLabel || 'Sesión asociada');
      }
    } finally {
      setLoading(false);
    }
  }, [id, graduandoId]);

  useEffect(() => { load(); }, [load]);

  const openEditInv = (inv: Invitado) => {
    setSelectedInv(inv);
    setInvNombre(inv.nombre);
    setInvDoc(inv.documento);
    setInvEstado(inv.autorizacion);
    setEditInvOpen(true);
  };

  const handleSaveInv = async () => {
    if (selectedInv) {
      await updateInvitado(selectedInv.id, {
        nombre: invNombre,
        documento: invDoc,
        autorizacion: invEstado as 'Autorizado' | 'Pendiente',
      });
    } else if (graduandoId && id) {
      await addInvitado({
        graduandoId,
        ceremoniaId: id,
        nombre: invNombre,
        documento: invDoc,
        graduandoNombre: graduando ? `${graduando.nombres} ${graduando.apellidos}` : '',
        tipo: 'Familiar',
        autorizacion: invEstado as 'Autorizado' | 'Pendiente',
      });
    }
    setEditInvOpen(false);
    setAddInvOpen(false);
    setSelectedInv(null);
    load();
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

  const autorizados = invitados.filter((i) => i.autorizacion === 'Autorizado').length;
  const pendientes = invitados.filter((i) => i.autorizacion === 'Pendiente').length;

  return (
    <AdminLayout>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#0B1A2A', fontSize: '1.75rem', mb: 0.5 }}>
          Graduando + invitados — Detalle
        </Typography>
        <Typography sx={{ color: '#5A6A7A', fontSize: '0.875rem' }}>
          Eventos institucionales / Ceremonias de grado / Graduandos / Detalle
        </Typography>
      </Box>

      {/* Breadcrumb bar */}
      <Box sx={{
        backgroundColor: '#FFFFFF', borderRadius: '10px', border: '1px solid #E5EAF0',
        borderLeft: '4px solid #E30613', px: 2.5, py: 1.5, mb: 2.5,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1,
      }}>
        <Box>
          <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', color: '#0B1A2A' }}>Ceremonia de grados</Typography>
          <Typography sx={{ color: '#5A6A7A', fontSize: '0.8rem' }}>Fecha · Lugar</Typography>
        </Box>
        <Typography sx={{ color: '#1565C0', fontSize: '0.75rem', fontWeight: 600, letterSpacing: 0.5 }}>
          CEREMONIA → SESIÓN → PROGRAMA → GRADUANDO
        </Typography>
      </Box>

      {/* Info graduando */}
      <Card elevation={0} sx={{ borderRadius: '12px', border: '1px solid #E5EAF0', mb: 2.5 }}>
        <CardContent sx={{ p: 2.5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
            <Box>
              <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: '#0B1A2A' }}>Información del graduando</Typography>
              <Box sx={{ width: 40, height: 3, backgroundColor: '#E30613', mt: 0.5 }} />
            </Box>
            <Button variant="text" onClick={() => setEditGradOpen(true)}
              sx={{ color: '#1565C0', textTransform: 'none', fontWeight: 500, fontSize: '0.875rem' }}>
              Editar →
            </Button>
          </Box>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1.5 }}>
            {[
              { label: 'Nombre completo', value: graduando ? `${graduando.nombres} ${graduando.apellidos}` : '—' },
              { label: 'Programa académico', value: graduando?.programa || '—' },
              { label: 'Documento', value: graduando?.documento || '—' },
              { label: 'Sesión', value: graduando?.sesionLabel || 'Sesión asociada' },
              { label: 'Código estudiantil', value: graduando?.codigoEstudiantil || 'No registrado' },
              { label: 'Horario de la sesión', value: 'Según configuración de la sesión' },
            ].map((f) => (
              <Box key={f.label}>
                <Typography sx={{ color: '#5A6A7A', fontSize: '0.8rem' }}>{f.label}</Typography>
                <Typography sx={{ fontWeight: 600, color: '#1A2A3A', fontSize: '0.9rem' }}>{f.value}</Typography>
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* Stats invitados */}
      <Box sx={{
        backgroundColor: '#FFFFFF', borderRadius: '10px', border: '1px solid #E5EAF0',
        px: 2.5, py: 1.75, mb: 2.5, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap',
      }}>
        <Typography sx={{ fontWeight: 700, fontSize: '1.25rem', color: '#0B1A2A' }}>{invitados.length}</Typography>
        <Typography sx={{ color: '#5A6A7A', fontSize: '0.85rem' }}>Invitados registrados</Typography>
        <Chip label={`${autorizados} Autorizados`} size="small" sx={{ backgroundColor: '#E6F4EA', color: '#1B7A3D', fontWeight: 600 }} />
        <Chip label={`${pendientes} Pendiente`} size="small" sx={{ backgroundColor: '#FFF4E5', color: '#B76E00', fontWeight: 600 }} />
        <Typography sx={{ color: '#5A6A7A', fontSize: '0.85rem', ml: 'auto' }}>
          Invitados asociados al registro del graduando
        </Typography>
      </Box>

      {/* Relación de invitados */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5, flexWrap: 'wrap', gap: 1 }}>
        <Box>
          <Typography sx={{ fontWeight: 700, fontSize: '1.05rem', color: '#0B1A2A' }}>Relación de invitados</Typography>
          <Typography sx={{ color: '#5A6A7A', fontSize: '0.85rem' }}>
            Gestiona la validación de los invitados sin confundirla con el registro de ingreso.
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />}
          onClick={() => { setSelectedInv(null); setInvNombre(''); setInvDoc(''); setInvEstado('Autorizado'); setAddInvOpen(true); }}
          sx={{
            backgroundColor: '#E30613', textTransform: 'none', fontWeight: 600, borderRadius: '8px',
            boxShadow: 'none', '&:hover': { backgroundColor: '#C10510', boxShadow: 'none' },
          }}>
          Agregar invitado
        </Button>
      </Box>

      <TableContainer sx={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5EAF0', overflow: 'hidden', mb: 2 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#FAFBFC' }}>
              {['Invitado', 'Documento', 'Estado', 'Acción'].map((h) => (
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
                  <Chip label={inv.autorizacion} size="small" sx={{
                    backgroundColor: inv.autorizacion === 'Autorizado' ? '#E6F4EA' : '#FFF4E5',
                    color: inv.autorizacion === 'Autorizado' ? '#1B7A3D' : '#B76E00',
                    fontWeight: 600, fontSize: '0.75rem', height: 24,
                  }} />
                </TableCell>
                <TableCell>
                  <Button variant="text" onClick={() => openEditInv(inv)}
                    sx={{ color: '#1565C0', textTransform: 'none', fontWeight: 500, fontSize: '0.875rem', p: 0, minWidth: 'auto' }}>
                    Editar →
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{
        display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1, mb: 2,
        backgroundColor: '#F8FAFC', borderRadius: '8px', p: 1.5,
      }}>
        <Typography sx={{ color: '#5A6A7A', fontSize: '0.85rem' }}>
          Los invitados son registrados por el graduando y quedan asociados a su registro.
        </Typography>
        <Typography sx={{ color: '#5A6A7A', fontSize: '0.85rem' }}>
          El ingreso se registra posteriormente desde Control de ingreso por sesión.
        </Typography>
      </Box>

      <Button variant="outlined" onClick={() => navigate(`/admin/eventos/ceremonias/${id}/graduandos`)}
        sx={{ textTransform: 'none', borderRadius: '8px', borderColor: '#C5CDD8', color: '#1A2A3A' }}>
        Volver a graduandos
      </Button>

      {/* Modal Editar graduando */}
      <Dialog open={editGradOpen} onClose={() => setEditGradOpen(false)} maxWidth="md" fullWidth
        PaperProps={{ sx: { borderRadius: '12px' } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>
          Editar graduando
          <IconButton onClick={() => setEditGradOpen(false)} sx={{ position: 'absolute', right: 12, top: 12 }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: '#5A6A7A', fontSize: '0.875rem', mb: 2 }}>
            Actualiza la información del graduando registrado en la ceremonia.
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2.5 }}>
            <Box>
              <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', mb: 0.5 }}>Información personal</Typography>
              <Box sx={{ width: 40, height: 3, backgroundColor: '#E30613', mb: 1.5 }} />
              <TextField fullWidth size="small" label="Nombres" value={formNombres} onChange={(e) => setFormNombres(e.target.value)} sx={{ mb: 1.5, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }} />
              <TextField fullWidth size="small" label="Apellidos" value={formApellidos} onChange={(e) => setFormApellidos(e.target.value)} sx={{ mb: 1.5, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }} />
              <TextField fullWidth size="small" label="Documento" value={formDoc} onChange={(e) => setFormDoc(e.target.value)} sx={{ mb: 1.5, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }} />
              <TextField fullWidth size="small" label="Teléfono" value={formTel} onChange={(e) => setFormTel(e.target.value)} sx={{ mb: 1.5, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }} />
              <TextField fullWidth size="small" label="Correo electrónico" value={formCorreo} onChange={(e) => setFormCorreo(e.target.value)} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }} />
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', mb: 0.5 }}>Información académica</Typography>
              <Box sx={{ width: 40, height: 3, backgroundColor: '#E30613', mb: 1.5 }} />
              <TextField fullWidth size="small" label="Código estudiantil" value={formCodigo} onChange={(e) => setFormCodigo(e.target.value)} sx={{ mb: 1.5, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }} />
              <TextField select fullWidth size="small" label="Programa académico" value={formPrograma} onChange={(e) => setFormPrograma(e.target.value)} sx={{ mb: 1.5, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}>
                {PROGRAMA_OPTIONS.map((p) => <MenuItem key={p} value={p}>{p}</MenuItem>)}
              </TextField>
              <TextField fullWidth size="small" label="Sesión" value={formSesion} onChange={(e) => setFormSesion(e.target.value)} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }} />
              <Typography sx={{ color: '#5A6A7A', fontSize: '0.8rem', mt: 1 }}>
                Los campos muestran la información actual registrada del graduando.
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setEditGradOpen(false)} sx={{ textTransform: 'none', color: '#5A6A7A' }}>Cancelar</Button>
          <Button variant="contained" onClick={() => setEditGradOpen(false)}
            sx={{ backgroundColor: '#0B3A5C', textTransform: 'none', fontWeight: 600, borderRadius: '8px', '&:hover': { backgroundColor: '#062A42' } }}>
            Guardar cambios
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal Agregar / Editar invitado */}
      <Dialog open={addInvOpen || editInvOpen} onClose={() => { setAddInvOpen(false); setEditInvOpen(false); }} maxWidth="sm" fullWidth
        PaperProps={{ sx: { borderRadius: '12px' } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>
          {editInvOpen ? 'Editar invitado' : 'Agregar invitado'}
          <IconButton onClick={() => { setAddInvOpen(false); setEditInvOpen(false); }} sx={{ position: 'absolute', right: 12, top: 12 }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: '#5A6A7A', fontSize: '0.875rem', mb: 2 }}>
            Actualiza la información del invitado asociado al graduando.
          </Typography>
          <TextField fullWidth size="small" label="Nombre" value={invNombre} onChange={(e) => setInvNombre(e.target.value)}
            sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }} />
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 1 }}>
            <TextField size="small" label="Documento" value={invDoc} onChange={(e) => setInvDoc(e.target.value)}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }} />
            <TextField select size="small" label="Estado" value={invEstado} onChange={(e) => setInvEstado(e.target.value)}
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
          <Button onClick={() => { setAddInvOpen(false); setEditInvOpen(false); }} sx={{ textTransform: 'none', color: '#5A6A7A' }}>
            Cancelar
          </Button>
          <Button variant="contained" onClick={handleSaveInv}
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
