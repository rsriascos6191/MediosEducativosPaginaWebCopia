/**
 * Pantalla: Graduando — Formulario
 */

import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Alert, Box, Typography, Button, TextField, MenuItem, Card, CardContent, CircularProgress,
} from '@mui/material';
import type { Ceremonia, ProgramaOption, Sesion } from './interfaces/ceremonias.interface';
import { createGraduando, getCeremoniaById, getProgramasCatalogo, getSesiones } from './services/ceremonias.service';

export default function GraduandoFormulario() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [programaId, setProgramaId] = useState('');
  const [sesion, setSesion] = useState('');
  const [documento, setDocumento] = useState('');
  const [nombres, setNombres] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [telefono, setTelefono] = useState('');
  const [correo, setCorreo] = useState('');
  const [codigo, setCodigo] = useState('');
  const [estado, setEstado] = useState('true');
  const [ceremonia, setCeremonia] = useState<Ceremonia | null>(null);
  const [programas, setProgramas] = useState<ProgramaOption[]>([]);
  const [sesiones, setSesiones] = useState<Sesion[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    Promise.all([getCeremoniaById(id), getProgramasCatalogo(), getSesiones(id)])
      .then(([ceremoniaActual, programasDisponibles, sesionesDisponibles]) => {
        setCeremonia(ceremoniaActual);
        setProgramas(programasDisponibles.filter((programa) => programa.estado));
        setSesiones(sesionesDisponibles);
      })
      .catch((loadError: unknown) => {
        setError(loadError instanceof Error ? loadError.message : 'No fue posible cargar el formulario.');
      })
      .finally(() => setLoading(false));
  }, [id]);

  const sesionesCompatibles = useMemo(() => {
    if (!programaId) return sesiones;
    const programaActual = programas.find((programa) => String(programa.id_programa) === programaId);
    return sesiones.filter((sesionActual) => programaActual && (
      sesionActual.programaIds?.includes(programaActual.id_programa)
      ?? sesionActual.programas.includes(programaActual.nombre)
    ));
  }, [programaId, programas, sesiones]);

  const handleSave = async () => {
    if (!id || !programaId || !documento || !nombres.trim() || !apellidos.trim()) {
      setError('Completa el programa, documento, nombres y apellidos.');
      return;
    }
    if (sesionesCompatibles.length > 0 && !sesion) {
      setError('Selecciona una sesión para este programa.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      await createGraduando(id, {
        programaIds: [Number(programaId)],
        idSesion: sesion ? Number(sesion) : null,
        documento,
        nombres,
        apellidos,
        telefono,
        correo,
        codigoEstudiantil: codigo,
        estado: estado === 'true',
      });
      navigate(`/admin/eventos/ceremonias/${id}/graduandos`);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'No fue posible guardar el graduando.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress sx={{ color: '#0B3A5C' }} /></Box>;
  }

  return (
    <>
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
        <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: '#0B1A2A' }}>{ceremonia?.nombre || 'Ceremonia de grados'}</Typography>
        <Typography sx={{ color: '#5A6A7A', fontSize: '0.85rem' }}>
          {ceremonia ? `${ceremonia.fecha} · ${ceremonia.lugar}` : 'Fecha · Lugar'}
        </Typography>
      </Box>

      {error && <Alert severity="error" sx={{ maxWidth: 900, mb: 2 }}>{error}</Alert>}

      <Card elevation={0} sx={{ borderRadius: '12px', border: '1px solid #E5EAF0', maxWidth: 900 }}>
        <CardContent sx={{ p: 3.5 }}>
          <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: '#0B1A2A', mb: 0.5 }}>
            Información académica
          </Typography>
          <Box sx={{ width: 40, height: 3, backgroundColor: '#E30613', mb: 2 }} />

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mb: 3 }}>
            <Box>
              <Typography sx={{ fontSize: '0.85rem', color: '#1A2A3A', mb: 0.5 }}>Programa académico</Typography>
              <TextField select fullWidth size="small" value={programaId} onChange={(e) => {
                const nuevoProgramaId = e.target.value;
                const nuevoPrograma = programas.find((programaActual) => String(programaActual.id_programa) === nuevoProgramaId);
                setProgramaId(nuevoProgramaId);
                if (!sesiones.some((sesionActual) =>
                  sesionActual.id === sesion &&
                  nuevoPrograma && (
                    sesionActual.programaIds?.includes(nuevoPrograma.id_programa)
                    ?? sesionActual.programas.includes(nuevoPrograma.nombre)
                  )
                )) setSesion('');
              }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}>
                <MenuItem value="">Selecciona un programa académico</MenuItem>
                {programas.map((programaActual) => <MenuItem key={programaActual.id_programa} value={String(programaActual.id_programa)}>{programaActual.nombre}</MenuItem>)}
              </TextField>
            </Box>
            <Box>
              <Typography sx={{ fontSize: '0.85rem', color: '#1A2A3A', mb: 0.5 }}>Sesión</Typography>
              <TextField
                select
                fullWidth
                size="small"
                value={sesion}
                onChange={(e) => setSesion(e.target.value)}
                helperText={
                  sesiones.length === 0
                    ? 'No hay sesiones configuradas para esta ceremonia.'
                    : !programaId
                      ? 'Las sesiones disponibles dependen del programa académico.'
                      : sesionesCompatibles.length > 0
                        ? 'Selecciona una sesión configurada para este programa.'
                        : 'No hay sesiones asociadas a este programa. Configura el programa en la sesión correspondiente.'
                }
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}>
                {sesionesCompatibles.length === 0 && <MenuItem value="">Sin asignar</MenuItem>}
                {sesionesCompatibles.map((sesionActual) => (
                  <MenuItem key={sesionActual.id} value={sesionActual.id}>
                    Sesión {sesionActual.numeroSesion}
                  </MenuItem>
                ))}
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
                onChange={(e) => setDocumento(e.target.value.replace(/\D/g, ''))}
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
              <TextField select fullWidth size="small" label="Estado" value={estado}
                onChange={(e) => setEstado(e.target.value)}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}>
                <MenuItem value="true">Activo</MenuItem>
                <MenuItem value="false">Inactivo</MenuItem>
              </TextField>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5 }}>
            <Button variant="outlined" onClick={() => navigate(`/admin/eventos/ceremonias/${id}/graduandos`)}
              sx={{ textTransform: 'none', borderRadius: '8px', borderColor: '#C5CDD8', color: '#1A2A3A' }}>
              Cancelar
            </Button>
            <Button variant="contained" disabled={saving} onClick={handleSave}
              sx={{
                backgroundColor: '#E30613', textTransform: 'none', fontWeight: 600, borderRadius: '8px',
                boxShadow: 'none', '&:hover': { backgroundColor: '#C10510', boxShadow: 'none' },
              }}>
              {saving ? 'Guardando…' : 'Guardar'}
            </Button>
          </Box>
        </CardContent>
      </Card>
      <Typography sx={{ color: '#5A6A7A', fontSize: '0.85rem', mt: 2 }}>
        Los invitados se gestionan posteriormente desde el detalle del graduando.
      </Typography>
    </>
  );
}
