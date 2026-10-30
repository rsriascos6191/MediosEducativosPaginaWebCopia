/**
 * Pantalla: Detalle de ceremonia — Resumen
 *  modal Agregar sesión.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { Navigate, useParams, useNavigate } from 'react-router-dom';
import {
  Box, Typography, Button, Card, CardContent, Chip, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, MenuItem, IconButton, CircularProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import type { Ceremonia, Sesion } from './interfaces/ceremonias.interface';
import {
  cambiarEstadoCeremonia, getCeremoniaById, getFotografiasCeremonia,
  updateMaxInvitadosPorGraduando,
  getSesiones, addSesion, guardarFotografiasCeremonia, HORA_OPTIONS,
} from './services/ceremonias.service';

interface FotoItem {
  id: string;
  url: string;
  name?: string;
  file?: File;
}

const ACCEPT_IMAGES = 'image/png,image/jpeg,image/jpg,image/webp,image/gif';
const MAX_FOTO_BYTES = 3 * 1024 * 1024;

function convertirArchivoABase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error ?? new Error('No fue posible leer la fotografía.'));
    reader.onload = () => {
      if (typeof reader.result !== 'string') {
        reject(new Error('No fue posible leer la fotografía.'));
        return;
      }
      const separator = reader.result.indexOf(',');
      if (separator < 0) {
        reject(new Error('No fue posible preparar la fotografía.'));
        return;
      }
      resolve(reader.result.slice(separator + 1));
    };
    reader.readAsDataURL(file);
  });
}

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
  const [sesionError, setSesionError] = useState('');
  const [maxInvitadosPorGraduando, setMaxInvitadosPorGraduando] = useState(2);
  const [savingConfiguracionInvitados, setSavingConfiguracionInvitados] = useState(false);
  const [configuracionInvitadosError, setConfiguracionInvitadosError] = useState('');
  const [configuracionInvitadosSuccess, setConfiguracionInvitadosSuccess] = useState('');
  const [savingEstadoCeremonia, setSavingEstadoCeremonia] = useState(false);
  const [estadoCeremoniaError, setEstadoCeremoniaError] = useState('');

  /* Registro fotográfico */
  const [fotosCeremonia, setFotosCeremonia] = useState<{
    id: string;
    items: FotoItem[];
  } | null>(null);
  const [fotosCargadasId, setFotosCargadasId] = useState<string | null>(null);
  const [fotoErrorActual, setFotoErrorActual] = useState<{ id: string; mensaje: string } | null>(null);
  const [savingFotos, setSavingFotos] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [pendingFotos, setPendingFotos] = useState<FotoItem[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fotos = fotosCeremonia && fotosCeremonia.id === id ? fotosCeremonia.items : [];
  const fotosCargadas = fotosCargadasId === id;
  const fotoError = fotoErrorActual && fotoErrorActual.id === id ? fotoErrorActual.mensaje : '';
  const setFotoError = (mensaje: string) => {
    if (id) setFotoErrorActual({ id, mensaje });
  };

  const load = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const [c, s] = await Promise.all([getCeremoniaById(id), getSesiones(id)]);
      setCeremonia(c);
      setSesiones(s);
      if (c) {
        setMaxInvitadosPorGraduando(c.maxInvitadosPorGraduando ?? 2);
      }
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  const handleAvanzarEstadoCeremonia = async () => {
    if (!id || !ceremonia || savingEstadoCeremonia) return;
    const siguienteEstado = ceremonia.estado === 'Programada'
      ? 'En curso'
      : ceremonia.estado === 'En curso'
        ? 'Finalizada'
        : null;
    if (!siguienteEstado) return;

    setSavingEstadoCeremonia(true);
    setEstadoCeremoniaError('');
    try {
      const resultado = await cambiarEstadoCeremonia(id, siguienteEstado);
      setCeremonia((actual) => actual ? { ...actual, estado: resultado.estado } : actual);
      if (resultado.estado === 'Finalizada') {
        setSesiones((actuales) => actuales.map((sesion) => ({
          ...sesion,
          estado: 'Finalizada',
        })));
      }
    } catch (cause) {
      setEstadoCeremoniaError(
        cause instanceof Error ? cause.message : 'No fue posible cambiar el estado de la ceremonia.'
      );
    } finally {
      setSavingEstadoCeremonia(false);
    }
  };

  const handleGuardarLimiteInvitados = async () => {
    if (!id || savingConfiguracionInvitados) return;
    setSavingConfiguracionInvitados(true);
    setConfiguracionInvitadosError('');
    setConfiguracionInvitadosSuccess('');
    try {
      const resultado = await updateMaxInvitadosPorGraduando(id, maxInvitadosPorGraduando);
      setCeremonia((actual) => actual
        ? {
          ...actual,
          maxInvitadosPorGraduando: resultado.maxInvitadosPorGraduando,
        }
        : actual);
      setConfiguracionInvitadosSuccess('Límite de invitados por graduando guardado.');
    } catch (cause) {
      setConfiguracionInvitadosError(
        cause instanceof Error ? cause.message : 'No fue posible guardar la configuración de invitados.'
      );
    } finally {
      setSavingConfiguracionInvitados(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    let activa = true;
    getFotografiasCeremonia(id)
      .then((resultado) => {
        if (!activa) return;
        setFotosCeremonia({
          id,
          items: resultado.map((foto) => ({
            id: String(foto.slot),
            url: `data:${foto.mimeType};base64,${foto.base64}`,
            name: `Fotografía ${foto.slot}`,
          })),
        });
        setFotosCargadasId(id);
        setFotoErrorActual({ id, mensaje: '' });
      })
      .catch((cause) => {
        if (activa) {
          setFotoErrorActual({
            id,
            mensaje: cause instanceof Error ? cause.message : 'No fue posible cargar las fotografías.',
          });
        }
      });
    return () => { activa = false; };
  }, [id]);

  const handleAddSesion = async () => {
    if (!id) return;
    setSesionError('');
    if ((horaInicio && !horaFin) || (!horaInicio && horaFin) || (horaInicio && horaInicio >= horaFin)) {
      setSesionError('Completa un rango de horas válido.');
      return;
    }
    setSaving(true);
    try {
      const nuevaSesion = await addSesion(id, {
        nombre: sesionNombre.trim(),
        estado: sesionEstado as 'Pendiente',
        horaInicio,
        horaFin,
      });
      setSesiones((actuales) =>
        [...actuales, nuevaSesion].sort((a, b) => a.numeroSesion - b.numeroSesion)
      );
      setModalOpen(false);
      setSesionNombre('');
      setHoraInicio('');
      setHoraFin('');
    } catch (cause) {
      setSesionError(cause instanceof Error ? cause.message : 'No fue posible crear la sesión.');
    } finally {
      setSaving(false);
    }
  };

  const isImageFile = (file: File) =>
    ACCEPT_IMAGES.split(',').some((t) => file.type === t) ||
    /\.(png|jpe?g|webp|gif)$/i.test(file.name);

  const processFiles = (fileList: FileList | File[]) => {
    if (savingFotos) return;
    const files = Array.from(fileList).filter(isImageFile);
    if (!fotosCargadas) {
      setFotoError('Espera a que carguen las fotografías de la ceremonia antes de agregar otras.');
      return;
    }
    if (!files.length) {
      setFotoError('Selecciona al menos una imagen válida.');
      return;
    }
    if (files.some((file) => file.size > MAX_FOTO_BYTES)) {
      setFotoError('Cada fotografía debe ocupar como máximo 3 MB.');
      return;
    }
    if (fotos.length + pendingFotos.length + files.length > 4) {
      setFotoError('La ceremonia permite guardar hasta cuatro fotografías.');
      return;
    }
    const nuevos: FotoItem[] = files.map((f) => ({
      id: `up-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      url: URL.createObjectURL(f),
      name: f.name,
      file: f,
    }));
    setFotoError('');
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

  const handleGuardarFotos = async () => {
    if (!id || !fotosCargadas || !pendingFotos.length || savingFotos) return;
    setSavingFotos(true);
    setFotoError('');
    try {
      const fotosParaGuardar = await Promise.all(pendingFotos.map(async (foto) => {
        if (!foto.file) throw new Error('No fue posible leer una de las fotografías seleccionadas.');
        return {
          mimeType: foto.file.type,
          base64: await convertirArchivoABase64(foto.file),
        };
      }));
      await guardarFotografiasCeremonia(id, fotosParaGuardar);
      setFotosCeremonia((actuales) => ({
        id,
        items: [
          ...(actuales?.id === id ? actuales.items : []),
          ...pendingFotos.map((foto) => ({ id: foto.id, url: foto.url, name: foto.name })),
        ],
      }));
      setPendingFotos([]);
      setUploadOpen(false);
    } catch (cause) {
      setFotoError(cause instanceof Error ? cause.message : 'No fue posible guardar las fotografías.');
    } finally {
      setSavingFotos(false);
    }
  };

  const handleCancelarUpload = () => {
    if (savingFotos) return;
    pendingFotos.forEach((f) => {
      if (f.url.startsWith('blob:')) URL.revokeObjectURL(f.url);
    });
    setPendingFotos([]);
    setUploadOpen(false);
    setDragOver(false);
  };

  const handleQuitarPending = (fotoId: string) => {
    if (savingFotos) return;
    setPendingFotos((prev) => {
      const item = prev.find((f) => f.id === fotoId);
      if (item?.url.startsWith('blob:')) URL.revokeObjectURL(item.url);
      return prev.filter((f) => f.id !== fotoId);
    });
  };

  const renderFotoThumb = (foto: FotoItem, size = { w: 100, h: 70 }) => {
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
      <>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress sx={{ color: '#0B3A5C' }} />
        </Box>
      </>
    );
  }

  if (!ceremonia) {
    return (
      <>
        <Typography sx={{ textAlign: 'center', py: 8, color: '#5A6A7A' }}>Ceremonia no encontrada</Typography>
      </>
    );
  }

  if (ceremonia.estado === 'Finalizada') {
    return <Navigate to="/admin/eventos/ceremonias" replace />;
  }

  const graduandosAsignados = sesiones.reduce(
    (total, sesion) => total + (sesion.graduandosCount ?? 0),
    0
  );
  const graduandosSinSesion = ceremonia.graduandos - graduandosAsignados;

  return (
    <>
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
            Fecha: {ceremonia.fecha || '—'} · Lugar: {ceremonia.lugar || '—'}
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
          { label: 'Total de graduandos', value: String(ceremonia.graduandos ?? '—') },
          { label: 'Total de invitados', value: String(ceremonia.invitados ?? '—') },
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

      <Card elevation={0} sx={{ borderRadius: '12px', border: '1px solid #E5EAF0', mb: 3 }}>
        <CardContent sx={{ p: 2.5 }}>
          <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: '#0B1A2A', mb: 0.5 }}>
            Límite de invitados por graduando
          </Typography>
          <Typography sx={{ color: '#5A6A7A', fontSize: '0.85rem', mb: 2 }}>
            Define cuántos invitados puede registrar cada graduando en esta ceremonia.
          </Typography>
          <Box sx={{ maxWidth: 380, mb: 2 }}>
            <TextField
              select
              fullWidth
              label="Máximo por graduando"
              value={maxInvitadosPorGraduando}
              onChange={(e) => setMaxInvitadosPorGraduando(Number(e.target.value))}
              helperText="El valor habitual es 2; puedes permitir hasta 4."
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
            >
              {[2, 3, 4].map((limite) => (
                <MenuItem key={limite} value={limite}>{limite} invitados</MenuItem>
              ))}
            </TextField>
          </Box>
          {configuracionInvitadosError && (
            <Typography role="alert" sx={{ color: '#B42318', fontSize: '0.85rem', mb: 1.5 }}>
              {configuracionInvitadosError}
            </Typography>
          )}
          {configuracionInvitadosSuccess && (
            <Typography role="status" sx={{ color: '#1B7A3D', fontSize: '0.85rem', mb: 1.5 }}>
              {configuracionInvitadosSuccess}
            </Typography>
          )}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              disabled={savingConfiguracionInvitados}
              onClick={() => void handleGuardarLimiteInvitados()}
              sx={{
                backgroundColor: '#0B3A5C', textTransform: 'none', fontWeight: 600,
                borderRadius: '8px', boxShadow: 'none',
                '&:hover': { backgroundColor: '#062A42', boxShadow: 'none' },
              }}
            >
              {savingConfiguracionInvitados ? 'Guardando…' : 'Guardar configuración'}
            </Button>
          </Box>
        </CardContent>
      </Card>

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
                    <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: '#0B1A2A' }}>
                      Sesión {s.numeroSesion}
                    </Typography>
                    <Chip label={s.estado} size="small" sx={{ backgroundColor: '#FFF4E5', color: '#B76E00', fontWeight: 600, fontSize: '0.7rem', height: 22 }} />
                  </Box>
                  {s.nombre.trim() !== `Sesión ${s.numeroSesion}` && !/^\d+$/.test(s.nombre.trim()) && (
                    <Typography sx={{ color: '#5A6A7A', fontSize: '0.85rem', mb: 0.5 }}>
                      {s.nombre}
                    </Typography>
                  )}
                  <Typography sx={{ color: '#5A6A7A', fontSize: '0.85rem' }}>
                    {s.horaInicio ? `${s.horaInicio} – ${s.horaFin}` : 'Horario por definir'}
                  </Typography>
                  <Typography sx={{ color: '#5A6A7A', fontSize: '0.85rem' }}>
                    {s.programas.length ? s.programas.join(', ') : 'Programas por configurar'}
                  </Typography>
                  <Typography sx={{ color: '#5A6A7A', fontSize: '0.85rem' }}>
                    Graduandos: {s.graduandosCount ?? '—'}
                  </Typography>
                  <Typography sx={{ color: '#5A6A7A', fontSize: '0.85rem' }}>
                    Invitados: {s.invitadosCount ?? '—'}
                  </Typography>
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
              { label: 'Graduandos', value: String(ceremonia.graduandos ?? '—') },
              { label: 'Asignados a sesiones', value: String(graduandosAsignados) },
              {
                label: 'Sin sesión asignada',
                value: graduandosSinSesion >= 0 ? String(graduandosSinSesion) : 'Revisar conteo',
              },
              { label: 'Invitados', value: String(ceremonia.invitados ?? '—') },
            ].map((r) => (
              <Box key={r.label} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.25 }}>
                <Typography sx={{ color: '#5A6A7A', fontSize: '0.875rem' }}>{r.label}</Typography>
                <Typography sx={{ fontWeight: 600, color: '#1A2A3A', fontSize: '0.875rem' }}>{r.value}</Typography>
              </Box>
            ))}
            {graduandosSinSesion > 0 ? (
              <Box sx={{ mt: 2, p: 1.5, borderRadius: '8px', backgroundColor: '#FFF4E5' }}>
                <Typography sx={{ color: '#8A5700', fontSize: '0.85rem' }}>
                  {graduandosSinSesion} {graduandosSinSesion === 1 ? 'graduando no tiene' : 'graduandos no tienen'} sesión asignada. Para ubicarlos, abre el listado y selecciona el filtro «Sin asignar».
                </Typography>
                <Button
                  size="small"
                  onClick={() => navigate(`/admin/eventos/ceremonias/${id}/graduandos`)}
                  sx={{ mt: 0.5, px: 0, textTransform: 'none', fontWeight: 600 }}
                >
                  Abrir listado de graduandos
                </Button>
              </Box>
            ) : graduandosSinSesion < 0 ? (
              <Typography sx={{ color: '#B42318', fontSize: '0.85rem', mt: 2 }}>
                La suma de graduandos asignados a las sesiones supera el total de la ceremonia. Revisa los registros.
              </Typography>
            ) : null}
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
          {fotoError && (
            <Typography role="alert" sx={{ color: '#B71C1C', fontSize: '0.85rem', mb: 1.5 }}>
              {fotoError}
            </Typography>
          )}

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
                    disabled={savingFotos || !fotosCargadas}
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
          <Typography sx={{ fontWeight: 600, fontSize: '0.95rem', color: '#0B1A2A' }}>
            {ceremonia.estado === 'Programada'
              ? 'Iniciar ceremonia'
              : ceremonia.estado === 'En curso'
                ? 'Finalizar ceremonia'
                : `Ceremonia ${ceremonia.estado.toLowerCase()}`}
          </Typography>
          <Typography sx={{ color: '#5A6A7A', fontSize: '0.85rem' }}>
            {ceremonia.estado === 'Programada'
              ? 'Inicia la ceremonia.'
              : ceremonia.estado === 'En curso'
                ? 'Finaliza la ceremonia y guarda su información en el historial.'
                : 'El estado de la ceremonia es definitivo.'}
          </Typography>
          {estadoCeremoniaError && (
            <Typography role="alert" sx={{ color: '#B42318', fontSize: '0.85rem', mt: 1 }}>
              {estadoCeremoniaError}
            </Typography>
          )}
        </Box>
        <Button
          variant="contained"
          disabled={savingEstadoCeremonia || !['Programada', 'En curso'].includes(ceremonia.estado)}
          onClick={() => void handleAvanzarEstadoCeremonia()}
          sx={{
            backgroundColor: '#E30613', textTransform: 'none', fontWeight: 600, borderRadius: '8px', boxShadow: 'none',
            '&:hover': { backgroundColor: '#C10510', boxShadow: 'none' },
          }}
        >
          {savingEstadoCeremonia
            ? 'Guardando…'
            : ceremonia.estado === 'Programada'
              ? 'Iniciar ceremonia'
              : ceremonia.estado === 'En curso'
                ? 'Finalizar ceremonia'
                : `Ceremonia ${ceremonia.estado.toLowerCase()}`}
        </Button>
      </Box>

      {/* Modal Agregar sesión */}
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="sm" fullWidth
        slotProps={{ paper: { sx: { borderRadius: '12px' } } }}>
        <DialogTitle sx={{ fontWeight: 700, pr: 6 }}>
          Agregar sesión
          <IconButton onClick={() => setModalOpen(false)} sx={{ position: 'absolute', right: 12, top: 12 }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {sesionError && (
            <Typography role="alert" sx={{ color: '#B42318', fontSize: '0.875rem', mb: 2 }}>
              {sesionError}
            </Typography>
          )}
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
            <TextField size="small" label="Nombre de referencia (opcional)" value={sesionNombre}
              onChange={(e) => setSesionNombre(e.target.value)} placeholder="Ej. Jornada de la mañana"
              helperText="El número se asigna automáticamente en orden: Sesión 1, Sesión 2, etc."
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
    </>
  );
}
