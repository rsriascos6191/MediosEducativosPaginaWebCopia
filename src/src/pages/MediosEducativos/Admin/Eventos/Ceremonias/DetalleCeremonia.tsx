/**
 * Pantalla: Detalle de ceremonia — Resumen
 * Incluye modal Agregar sesión.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Typography, Button, Card, CardContent, Chip, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, MenuItem, IconButton, CircularProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AdminLayout from '../../../../../components/AdminLayout';
import type { Ceremonia, Sesion } from './interfaces/ceremonias.interface';
import {
  getCeremoniaById, getSesiones, addSesion, HORA_OPTIONS,
} from './services/ceremonias.service';

/** Imagen en el registro fotográfico (URL local o placeholder) */
interface FotoItem {
  id: string;
  url: string;
  name?: string;
}

const FOTOS_INICIALES: FotoItem[] = [
  { id: 'p1', url: 'gradient:1' },
  { id: 'p2', url: 'gradient:2' },
  { id: 'p3', url: 'gradient:3' },
];

const GRADIENTS: Record<string, string> = {
  'gradient:1': 'linear-gradient(135deg,#1a3a5c,#4a6fa5)',
  'gradient:2': 'linear-gradient(135deg,#2c3e50,#7f8c8d)',
  'gradient:3': 'linear-gradient(135deg,#1e3a5f,#5d8aa8)',
};

const ACCEPT_IMAGES = 'image/png,image/jpeg,image/jpg,image/webp,image/gif';

export default function DetalleCeremonia() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [ceremonia, setCeremonia] = useState<Ceremonia | null>(null);
  const [sesiones, setSesiones] = useState<Sesion[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [sesionNombre, setSesionNombre] = useState('');
  const [sesionEstado, setSesionEstado] = useState('Pendiente');
  const [horaInicio, setHoraInicio] = useState('');
  const [horaFin, setHoraFin] = useState('');
  const [saving, setSaving] = useState(false);

  /* Registro fotográfico */
  const [fotos, setFotos] = useState<FotoItem[]>(FOTOS_INICIALES);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [pendingFotos, setPendingFotos] = useState<FotoItem[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const [c, s] = await Promise.all([getCeremoniaById(id), getSesiones(id)]);
      setCeremonia(c);
      setSesiones(s);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  const handleAddSesion = async () => {
    if (!id) return;
    setSaving(true);
    try {
      await addSesion(id, {
        nombre: sesionNombre || `Sesión ${sesiones.length + 1}`,
        estado: sesionEstado as 'Pendiente',
        horaInicio,
        horaFin,
      });
      setModalOpen(false);
      setSesionNombre('');
      setHoraInicio('');
      setHoraFin('');
      load();
    } finally {
      setSaving(false);
    }
  };

  const isImageFile = (file: File) =>
    ACCEPT_IMAGES.split(',').some((t) => file.type === t) ||
    /\.(png|jpe?g|webp|gif)$/i.test(file.name);

  const processFiles = (fileList: FileList | File[]) => {
    const files = Array.from(fileList).filter(isImageFile);
    if (!files.length) return;
    const nuevos: FotoItem[] = files.map((f) => ({
      id: `up-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      url: URL.createObjectURL(f),
      name: f.name,
    }));
    setPendingFotos((prev) => [...prev, ...nuevos]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files?.length) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      processFiles(e.target.files);
    }
    e.target.value = '';
  };

  const handleGuardarFotos = () => {
    if (!pendingFotos.length) return;
    setFotos((prev) => [...prev, ...pendingFotos]);
    setPendingFotos([]);
    setUploadOpen(false);
  };

  const handleCancelarUpload = () => {
    pendingFotos.forEach((f) => {
      if (f.url.startsWith('blob:')) URL.revokeObjectURL(f.url);
    });
    setPendingFotos([]);
    setUploadOpen(false);
    setDragOver(false);
  };

  const handleQuitarPending = (fotoId: string) => {
    setPendingFotos((prev) => {
      const item = prev.find((f) => f.id === fotoId);
      if (item?.url.startsWith('blob:')) URL.revokeObjectURL(item.url);
      return prev.filter((f) => f.id !== fotoId);
    });
  };

  const renderFotoThumb = (foto: FotoItem, size = { w: 100, h: 70 }) => {
    if (foto.url.startsWith('gradient:')) {
      return (
        <Box
          key={foto.id}
          sx={{
            width: size.w,
            height: size.h,
            borderRadius: '8px',
            background: GRADIENTS[foto.url] || GRADIENTS['gradient:1'],
            flexShrink: 0,
          }}
        />
      );
    }
    return (
      <Box
        key={foto.id}
        component="img"
        src={foto.url}
        alt={foto.name || 'Foto'}
        sx={{
          width: size.w,
          height: size.h,
          borderRadius: '8px',
          objectFit: 'cover',
          flexShrink: 0,
        }}
      />
    );
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

  if (!ceremonia) {
    return (
      <AdminLayout>
        <Typography sx={{ textAlign: 'center', py: 8, color: '#5A6A7A' }}>Ceremonia no encontrada</Typography>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Box sx={{ mb: 2.5 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#0B1A2A', fontSize: '1.75rem', mb: 0.5 }}>
          Detalle de ceremonia — Resumen
        </Typography>
        <Typography sx={{ color: '#5A6A7A', fontSize: '0.875rem' }}>
          Eventos institucionales / Ceremonias de grado / Resumen
        </Typography>
      </Box>

      {/* Banner */}
      <Box sx={{
        backgroundColor: '#0B3A5C', borderRadius: '12px', px: 3, py: 2.25, mb: 2.5,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1,
      }}>
        <Box>
          <Typography sx={{ color: '#FFFFFF', fontWeight: 700, fontSize: '1.15rem' }}>
            {ceremonia.nombre.replace(/ — Ejemplo \d+/, '') || 'Ceremonia de grados'}
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem' }}>
            Fecha · Lugar · Estado
          </Typography>
        </Box>
        <Chip label={ceremonia.estado} size="small" sx={{
          backgroundColor: '#E6F4EA', color: '#1B7A3D', fontWeight: 600, borderRadius: '6px',
        }} />
      </Box>

      {/* KPIs */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 1.5, mb: 3 }}>
        {[
          { label: 'Número de sesiones', value: sesiones.length ? String(sesiones.length) : 'Por configurar' },
          { label: 'Total de graduandos', value: ceremonia.graduandos ? String(ceremonia.graduandos) : 'Por configurar' },
          { label: 'Total de invitados', value: ceremonia.invitados ? String(ceremonia.invitados) : 'Por configurar' },
          { label: 'Estado de la ceremonia', value: ceremonia.estado },
        ].map((k) => (
          <Card key={k.label} elevation={0} sx={{ borderRadius: '10px', border: '1px solid #E5EAF0' }}>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Typography sx={{ color: '#5A6A7A', fontSize: '0.8rem', mb: 0.5 }}>{k.label}</Typography>
              <Typography sx={{ fontWeight: 700, fontSize: '1.1rem', color: '#0B1A2A' }}>{k.value}</Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Sesiones */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5, flexWrap: 'wrap', gap: 1 }}>
        <Box>
          <Typography sx={{ fontWeight: 700, fontSize: '1.1rem', color: '#0B1A2A' }}>Sesiones de la ceremonia</Typography>
          <Typography sx={{ color: '#5A6A7A', fontSize: '0.85rem' }}>
            Organiza la ceremonia en grupos y horarios según la cantidad de graduandos.
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setModalOpen(true)}
          sx={{ backgroundColor: '#E30613', textTransform: 'none', fontWeight: 600, borderRadius: '8px', boxShadow: 'none',
            '&:hover': { backgroundColor: '#C10510', boxShadow: 'none' } }}>
          + Agregar sesión
        </Button>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {sesiones.map((s) => (
            <Card key={s.id} elevation={0} sx={{ borderRadius: '12px', border: '1px solid #E5EAF0' }}>
              <CardContent sx={{ p: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: '#0B1A2A' }}>{s.nombre}</Typography>
                    <Chip label={s.estado} size="small" sx={{ backgroundColor: '#FFF4E5', color: '#B76E00', fontWeight: 600, fontSize: '0.7rem', height: 22 }} />
                  </Box>
                  <Typography sx={{ color: '#5A6A7A', fontSize: '0.85rem' }}>
                    {s.horaInicio ? `${s.horaInicio} – ${s.horaFin}` : 'Horario por definir'}
                  </Typography>
                  <Typography sx={{ color: '#5A6A7A', fontSize: '0.85rem' }}>
                    {s.programas.length ? s.programas.join(', ') : 'Programas por configurar'}
                  </Typography>
                  <Typography sx={{ color: '#5A6A7A', fontSize: '0.85rem' }}>Graduandos por configurar</Typography>
                </Box>
                <Button variant="contained" size="small"
                  onClick={() => navigate(`/admin/eventos/ceremonias/${id}/sesion/${s.id}`)}
                  sx={{ backgroundColor: '#0B3A5C', textTransform: 'none', fontWeight: 600, borderRadius: '8px', boxShadow: 'none',
                    '&:hover': { backgroundColor: '#062A42', boxShadow: 'none' } }}>
                  Ver sesión
                </Button>
              </CardContent>
            </Card>
          ))}
          {sesiones.length === 0 && (
            <Typography sx={{ color: '#5A6A7A', py: 2 }}>No hay sesiones configuradas.</Typography>
          )}
        </Box>

        <Card elevation={0} sx={{ borderRadius: '12px', border: '1px solid #E5EAF0' }}>
          <CardContent sx={{ p: 2.5 }}>
            <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: '#0B1A2A', mb: 2 }}>Resumen del avance</Typography>
            {[
              { label: 'Sesiones', value: sesiones.length ? String(sesiones.length) : 'Por configurar' },
              { label: 'Graduandos', value: 'Por configurar' },
              { label: 'Invitados', value: 'Por configurar' },
            ].map((r) => (
              <Box key={r.label} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.25 }}>
                <Typography sx={{ color: '#5A6A7A', fontSize: '0.875rem' }}>{r.label}</Typography>
                <Typography sx={{ fontWeight: 600, color: '#1A2A3A', fontSize: '0.875rem' }}>{r.value}</Typography>
              </Box>
            ))}
            <Typography sx={{ color: '#5A6A7A', fontSize: '0.8rem', mt: 2 }}>
              El detalle operativo se configura dentro de cada sesión.
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Registro fotográfico */}
      <Card elevation={0} sx={{ borderRadius: '12px', border: '1px solid #E5EAF0', mb: 2.5 }}>
        <CardContent sx={{ p: 2.5 }}>
          <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: '#0B1A2A', mb: 0.4 }}>
            Registro fotográfico
          </Typography>
          <Typography sx={{ color: '#5A6A7A', fontSize: '0.85rem', mb: 1.5 }}>
            Evidencias visuales asociadas a la ceremonia.
          </Typography>

          {/* Miniaturas guardadas + botón agregar */}
          {!uploadOpen && (
            <Box sx={{ display: 'flex', gap: 1.25, flexWrap: 'wrap', alignItems: 'center' }}>
              {fotos.map((f) => renderFotoThumb(f))}
              <Box
                onClick={() => setUploadOpen(true)}
                sx={{
                  width: 100,
                  height: 70,
                  borderRadius: '8px',
                  border: '1.5px dashed #C5CDD8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#1565C0',
                  fontSize: '0.8rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  textAlign: 'center',
                  px: 0.5,
                  '&:hover': {
                    borderColor: '#1565C0',
                    backgroundColor: 'rgba(21,101,192,0.04)',
                  },
                }}
              >
                + Agregar fotografía
              </Box>
            </Box>
          )}

          {/* Zona de carga (arrastre / selección) */}
          {uploadOpen && (
            <Box>
              <Box
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                sx={{
                  border: '1.5px dashed',
                  borderColor: dragOver ? '#1565C0' : '#C5CDD8',
                  borderRadius: '10px',
                  backgroundColor: dragOver ? 'rgba(21,101,192,0.04)' : '#FAFBFC',
                  minHeight: 180,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  px: 2,
                  py: 3,
                  mb: 2,
                  transition: 'border-color 0.15s, background-color 0.15s',
                }}
              >
                {pendingFotos.length === 0 ? (
                  <>
                    <CloudUploadIcon
                      sx={{
                        fontSize: 48,
                        color: '#5B8DEF',
                        mb: 1,
                        transform: 'rotate(0deg)',
                      }}
                    />
                    <Typography
                      sx={{
                        color: '#5A6A7A',
                        fontSize: '0.95rem',
                        textAlign: 'center',
                      }}
                    >
                      Suelte las imágenes a subir aquí
                    </Typography>
                  </>
                ) : (
                  <Box
                    sx={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 1.25,
                      justifyContent: 'center',
                      width: '100%',
                    }}
                  >
                    {pendingFotos.map((f) => (
                      <Box key={f.id} sx={{ position: 'relative' }}>
                        <Box
                          component="img"
                          src={f.url}
                          alt={f.name || 'Preview'}
                          sx={{
                            width: 100,
                            height: 70,
                            borderRadius: '8px',
                            objectFit: 'cover',
                          }}
                        />
                        <IconButton
                          size="small"
                          onClick={() => handleQuitarPending(f.id)}
                          sx={{
                            position: 'absolute',
                            top: -8,
                            right: -8,
                            backgroundColor: '#FFFFFF',
                            boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
                            width: 22,
                            height: 22,
                            '&:hover': { backgroundColor: '#FFEBEE' },
                          }}
                        >
                          <CloseIcon sx={{ fontSize: 14 }} />
                        </IconButton>
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>

              <input
                ref={fileInputRef}
                type="file"
                accept={ACCEPT_IMAGES}
                multiple
                hidden
                onChange={handleFileInput}
              />

              {/* Botones: Seleccionar archivos | Guardar cambios | Cancelar */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  flexWrap: 'wrap',
                }}
              >
                <Button
                  variant="contained"
                  onClick={() => fileInputRef.current?.click()}
                  sx={{
                    backgroundColor: '#0B3A5C',
                    textTransform: 'none',
                    fontWeight: 600,
                    borderRadius: '8px',
                    boxShadow: 'none',
                    '&:hover': {
                      backgroundColor: '#062A42',
                      boxShadow: 'none',
                    },
                  }}
                >
                  Seleccionar archivos
                </Button>

                {pendingFotos.length > 0 && (
                  <Button
                    variant="contained"
                    onClick={handleGuardarFotos}
                    sx={{
                      backgroundColor: '#1565C0',
                      textTransform: 'none',
                      fontWeight: 600,
                      borderRadius: '8px',
                      boxShadow: 'none',
                      '&:hover': {
                        backgroundColor: '#0D47A1',
                        boxShadow: 'none',
                      },
                    }}
                  >
                    Guardar cambios
                  </Button>
                )}

                <Button
                  variant="contained"
                  onClick={handleCancelarUpload}
                  sx={{
                    backgroundColor: '#E30613',
                    textTransform: 'none',
                    fontWeight: 600,
                    borderRadius: '8px',
                    boxShadow: 'none',
                    '&:hover': {
                      backgroundColor: '#C10510',
                      boxShadow: 'none',
                    },
                  }}
                >
                  Cancelar
                </Button>
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Acciones inferiores */}
      {[
        { label: 'Graduandos', desc: 'Gestionar listado', path: `/admin/eventos/ceremonias/${id}/graduandos`, color: '#E30613' },
        { label: 'Invitados', desc: 'Gestionar invitados', path: `/admin/eventos/ceremonias/${id}/invitados`, color: '#E30613' },
        { label: 'Control de ingreso', desc: 'Registrar asistencia', path: `/admin/eventos/ceremonias/${id}/control`, color: '#0B3A5C' },
      ].map((a) => (
        <Box key={a.label} sx={{
          backgroundColor: '#FFFFFF', borderRadius: '10px', border: '1px solid #E5EAF0',
          px: 2.5, py: 1.75, mb: 1.25, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1,
        }}>
          <Box>
            <Typography sx={{ fontWeight: 600, fontSize: '0.95rem', color: '#0B1A2A' }}>{a.label}</Typography>
            <Typography sx={{ color: '#5A6A7A', fontSize: '0.85rem' }}>{a.desc}</Typography>
          </Box>
          <Button variant="contained" onClick={() => navigate(a.path)}
            sx={{ backgroundColor: a.color, textTransform: 'none', fontWeight: 600, borderRadius: '8px', boxShadow: 'none',
              '&:hover': { backgroundColor: a.color === '#E30613' ? '#C10510' : '#062A42', boxShadow: 'none' } }}>
            Abrir →
          </Button>
        </Box>
      ))}

      <Box sx={{
        backgroundColor: '#FFFFFF', borderRadius: '10px', border: '1px solid #E5EAF0',
        px: 2.5, py: 1.75, mt: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1,
      }}>
        <Box>
          <Typography sx={{ fontWeight: 600, fontSize: '0.95rem', color: '#0B1A2A' }}>Finalizar ceremonia</Typography>
          <Typography sx={{ color: '#5A6A7A', fontSize: '0.85rem' }}>Finaliza la ceremonia y guarda su información en el historial.</Typography>
        </Box>
        <Button variant="contained" sx={{
          backgroundColor: '#E30613', textTransform: 'none', fontWeight: 600, borderRadius: '8px', boxShadow: 'none',
          '&:hover': { backgroundColor: '#C10510', boxShadow: 'none' },
        }}>
          Finalizar ceremonia
        </Button>
      </Box>

      {/* Modal Agregar sesión */}
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="sm" fullWidth
        PaperProps={{ sx: { borderRadius: '12px' } }}>
        <DialogTitle sx={{ fontWeight: 700, pr: 6 }}>
          Agregar sesión
          <IconButton onClick={() => setModalOpen(false)} sx={{ position: 'absolute', right: 12, top: 12 }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: '#5A6A7A', fontSize: '0.875rem', mb: 2 }}>
            Configura los datos básicos de una nueva sesión para esta ceremonia.
          </Typography>
          <Box sx={{ backgroundColor: '#F0F5FA', borderRadius: '8px', p: 1.5, mb: 2.5 }}>
            <Typography sx={{ fontWeight: 600, fontSize: '0.9rem' }}>
              {ceremonia.nombre.replace(/ — Ejemplo \d+/, '') || 'Ceremonia de grados'}
            </Typography>
            <Typography sx={{ color: '#5A6A7A', fontSize: '0.8rem' }}>Fecha · Lugar</Typography>
          </Box>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
            <TextField size="small" label="Sesión" value={sesionNombre}
              onChange={(e) => setSesionNombre(e.target.value)} placeholder="Sesión 1"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }} />
            <TextField select size="small" label="Estado" value={sesionEstado}
              onChange={(e) => setSesionEstado(e.target.value)}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}>
              <MenuItem value="Pendiente">Pendiente</MenuItem>
              <MenuItem value="En curso">En curso</MenuItem>
              <MenuItem value="Finalizada">Finalizada</MenuItem>
            </TextField>
          </Box>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 1 }}>
            <TextField select size="small" label="Hora de inicio" value={horaInicio}
              onChange={(e) => setHoraInicio(e.target.value)}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}>
              <MenuItem value="">Seleccionar hora</MenuItem>
              {HORA_OPTIONS.map((h) => <MenuItem key={h} value={h}>{h}</MenuItem>)}
            </TextField>
            <TextField select size="small" label="Hora de finalización" value={horaFin}
              onChange={(e) => setHoraFin(e.target.value)}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}>
              <MenuItem value="">Seleccionar hora</MenuItem>
              {HORA_OPTIONS.map((h) => <MenuItem key={h} value={h}>{h}</MenuItem>)}
            </TextField>
          </Box>
          <Typography sx={{ color: '#5A6A7A', fontSize: '0.8rem' }}>
            La hora de finalización debe ser posterior a la hora de inicio.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setModalOpen(false)} sx={{ textTransform: 'none', color: '#5A6A7A' }}>Cancelar</Button>
          <Button variant="contained" disabled={saving} onClick={handleAddSesion}
            sx={{ backgroundColor: '#0B3A5C', textTransform: 'none', fontWeight: 600, borderRadius: '8px',
              '&:hover': { backgroundColor: '#062A42' } }}>
            Guardar sesión
          </Button>
        </DialogActions>
      </Dialog>
    </AdminLayout>
  );
}
