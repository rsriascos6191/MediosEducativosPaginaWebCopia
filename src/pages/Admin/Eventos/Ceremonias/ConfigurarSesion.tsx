/**
 * Pantalla: Configurar sesión
 * Permite asociar varios programas académicos a una sesión.
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  TextField,
  MenuItem,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  IconButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import AdminLayout from '../../../../../components/AdminLayout';
import type { Ceremonia, Sesion } from './interfaces/ceremonias.interface';
import {
  getCeremoniaById,
  getSesionById,
  PROGRAMA_OPTIONS,
  HORA_OPTIONS,
} from './services/ceremonias.service';

export default function ConfigurarSesion() {
  const { id, sesionId } = useParams<{ id: string; sesionId: string }>();
  const navigate = useNavigate();
  const [ceremonia, setCeremonia] = useState<Ceremonia | null>(null);
  const [sesion, setSesion] = useState<Sesion | null>(null);
  const [loading, setLoading] = useState(true);
  const [nombre, setNombre] = useState('');
  const [estado, setEstado] = useState('Pendiente');
  const [horaInicio, setHoraInicio] = useState('');
  const [horaFin, setHoraFin] = useState('');
  /** Programas ya asociados a la sesión */
  const [programas, setProgramas] = useState<string[]>([]);
  /** Selección temporal del dropdown antes de agregar */
  const [programaSeleccionado, setProgramaSeleccionado] = useState('');

  useEffect(() => {
    if (!id || !sesionId) return;
    Promise.all([getCeremoniaById(id), getSesionById(sesionId)])
      .then(([c, s]) => {
        setCeremonia(c);
        setSesion(s);
        if (s) {
          setNombre(s.nombre);
          setEstado(s.estado);
          setHoraInicio(s.horaInicio || '');
          setHoraFin(s.horaFin || '');
          if (s.programas?.length) {
            setProgramas([...s.programas]);
          }
        }
      })
      .finally(() => setLoading(false));
  }, [id, sesionId]);

  const programasDisponibles = PROGRAMA_OPTIONS.filter(
    (p) => !programas.includes(p)
  );

  const handleAgregarPrograma = () => {
    if (!programaSeleccionado) return;
    if (programas.includes(programaSeleccionado)) return;
    setProgramas((prev) => [...prev, programaSeleccionado]);
    setProgramaSeleccionado('');
  };

  const handleQuitarPrograma = (prog: string) => {
    setProgramas((prev) => prev.filter((p) => p !== prog));
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
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: '#0B1A2A',
            fontSize: '1.75rem',
            mb: 0.5,
          }}
        >
          Configurar sesión
        </Typography>
        <Typography sx={{ color: '#5A6A7A', fontSize: '0.875rem' }}>
          Eventos institucionales / Ceremonias de grado / Detalle / Sesión
        </Typography>
      </Box>

      <Box
        sx={{
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          border: '1px solid #E5EAF0',
          px: 3,
          py: 2,
          mb: 2.5,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box>
          <Typography
            sx={{ fontWeight: 700, fontSize: '1.05rem', color: '#0B1A2A' }}
          >
            {ceremonia?.nombre.replace(/ — Ejemplo \d+/, '') ||
              'Ceremonia de grados'}
          </Typography>
          <Typography sx={{ color: '#5A6A7A', fontSize: '0.85rem' }}>
            Fecha · Lugar
          </Typography>
        </Box>
        <Chip
          label={ceremonia?.estado || 'Programada'}
          size="small"
          sx={{
            backgroundColor: '#E6F4EA',
            color: '#1B7A3D',
            fontWeight: 600,
            borderRadius: '6px',
          }}
        />
      </Box>

      <Typography
        sx={{ fontWeight: 700, fontSize: '1.15rem', color: '#0B1A2A', mb: 2 }}
      >
        {sesion?.nombre || 'Sesión 1'}
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1.5fr 1fr' },
          gap: 2.5,
        }}
      >
        {/* Columna izquierda: información */}
        <Card
          elevation={0}
          sx={{ borderRadius: '12px', border: '1px solid #E5EAF0' }}
        >
          <CardContent sx={{ p: 3 }}>
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: '1rem',
                color: '#0B1A2A',
                mb: 2,
              }}
            >
              Información de la sesión
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 2,
                mb: 2,
              }}
            >
              <TextField
                size="small"
                label="Nombre o número de sesión"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />
              <TextField
                select
                size="small"
                label="Estado"
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              >
                <MenuItem value="Pendiente">Pendiente</MenuItem>
                <MenuItem value="En curso">En curso</MenuItem>
                <MenuItem value="Finalizada">Finalizada</MenuItem>
              </TextField>
            </Box>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 2,
                mb: 3,
              }}
            >
              <TextField
                select
                size="small"
                label="Hora de inicio"
                value={horaInicio}
                onChange={(e) => setHoraInicio(e.target.value)}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              >
                <MenuItem value="">Selecciona hora</MenuItem>
                {HORA_OPTIONS.map((h) => (
                  <MenuItem key={h} value={h}>
                    {h}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                size="small"
                label="Hora de finalización"
                value={horaFin}
                onChange={(e) => setHoraFin(e.target.value)}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              >
                <MenuItem value="">Selecciona hora</MenuItem>
                {HORA_OPTIONS.map((h) => (
                  <MenuItem key={h} value={h}>
                    {h}
                  </MenuItem>
                ))}
              </TextField>
            </Box>

            {/* Programas académicos – múltiples */}
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: '1rem',
                color: '#0B1A2A',
                mb: 0.5,
              }}
            >
              Programas académicos
            </Typography>
            <Typography
              sx={{ color: '#5A6A7A', fontSize: '0.85rem', mb: 1.5 }}
            >
              Selecciona los programas que participarán en esta sesión. Puedes
              agregar más de uno.
            </Typography>

            <Box
              sx={{
                display: 'flex',
                gap: 1.5,
                alignItems: 'flex-start',
                mb: 1.5,
                flexWrap: 'wrap',
              }}
            >
              <TextField
                select
                size="small"
                value={programaSeleccionado}
                onChange={(e) => setProgramaSeleccionado(e.target.value)}
                sx={{
                  flex: 1,
                  minWidth: 200,
                  '& .MuiOutlinedInput-root': { borderRadius: '8px' },
                }}
              >
                <MenuItem value="">Selecciona un programa académico</MenuItem>
                {programasDisponibles.map((p) => (
                  <MenuItem key={p} value={p}>
                    {p}
                  </MenuItem>
                ))}
              </TextField>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAgregarPrograma}
                disabled={!programaSeleccionado}
                sx={{
                  backgroundColor: '#E30613',
                  textTransform: 'none',
                  fontWeight: 600,
                  borderRadius: '8px',
                  px: 2,
                  py: 0.9,
                  boxShadow: 'none',
                  whiteSpace: 'nowrap',
                  '&:hover': {
                    backgroundColor: '#C10510',
                    boxShadow: 'none',
                  },
                  '&.Mui-disabled': {
                    backgroundColor: '#F5C6CA',
                    color: '#FFFFFF',
                  },
                }}
              >
                Agregar programa
              </Button>
            </Box>

            {/* Lista de programas agregados */}
            {programas.length === 0 ? (
              <Typography sx={{ color: '#5A6A7A', fontSize: '0.85rem' }}>
                Ningún programa seleccionado
              </Typography>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {programas.map((p) => (
                  <Box
                    key={p}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      backgroundColor: '#F8FAFC',
                      border: '1px solid #E5EAF0',
                      borderRadius: '8px',
                      px: 1.5,
                      py: 0.75,
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: 500,
                        fontSize: '0.875rem',
                        color: '#1A2A3A',
                      }}
                    >
                      {p}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => handleQuitarPrograma(p)}
                      sx={{ color: '#5A6A7A', '&:hover': { color: '#E30613' } }}
                      aria-label={`Quitar ${p}`}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Columna derecha: resumen */}
        <Card
          elevation={0}
          sx={{
            borderRadius: '12px',
            border: '1px solid #E5EAF0',
            height: 'fit-content',
          }}
        >
          <CardContent sx={{ p: 2.5 }}>
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: '1rem',
                color: '#0B1A2A',
                mb: 2,
              }}
            >
              Resumen de sesión
            </Typography>

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                mb: 1.25,
              }}
            >
              <Typography sx={{ color: '#5A6A7A', fontSize: '0.875rem' }}>
                Sesión
              </Typography>
              <Typography
                sx={{
                  fontWeight: 600,
                  color: '#1A2A3A',
                  fontSize: '0.875rem',
                }}
              >
                {nombre || '1'}
              </Typography>
            </Box>

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                mb: 1.25,
              }}
            >
              <Typography sx={{ color: '#5A6A7A', fontSize: '0.875rem' }}>
                Hora
              </Typography>
              <Typography
                sx={{
                  fontWeight: 600,
                  color: '#1A2A3A',
                  fontSize: '0.875rem',
                }}
              >
                {horaInicio ? `${horaInicio} – ${horaFin}` : '—'}
              </Typography>
            </Box>

            {/* Programas listados uno debajo del otro */}
            <Box sx={{ mb: 1.25 }}>
              <Typography
                sx={{ color: '#5A6A7A', fontSize: '0.875rem', mb: 0.75 }}
              >
                Programas
              </Typography>
              {programas.length === 0 ? (
                <Typography
                  sx={{
                    fontWeight: 600,
                    color: '#1A2A3A',
                    fontSize: '0.875rem',
                    textAlign: 'right',
                  }}
                >
                  Por configurar
                </Typography>
              ) : (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    gap: 0.5,
                  }}
                >
                  {programas.map((p) => (
                    <Typography
                      key={p}
                      sx={{
                        fontWeight: 600,
                        color: '#1A2A3A',
                        fontSize: '0.875rem',
                        lineHeight: 1.4,
                      }}
                    >
                      {p}
                    </Typography>
                  ))}
                </Box>
              )}
            </Box>

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                mb: 1.25,
              }}
            >
              <Typography sx={{ color: '#5A6A7A', fontSize: '0.875rem' }}>
                Graduandos
              </Typography>
              <Typography
                sx={{
                  fontWeight: 600,
                  color: '#1A2A3A',
                  fontSize: '0.875rem',
                }}
              >
                Pendientes de importar
              </Typography>
            </Box>

            <Typography sx={{ color: '#5A6A7A', fontSize: '0.8rem', mt: 2 }}>
              La importación de graduandos se realiza en el siguiente paso.
            </Typography>
          </CardContent>
        </Card>
      </Box>

      <Box
        sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5, mt: 3 }}
      >
        <Button
          variant="outlined"
          onClick={() => navigate(`/admin/eventos/ceremonias/${id}`)}
          sx={{
            textTransform: 'none',
            fontWeight: 500,
            borderRadius: '8px',
            borderColor: '#C5CDD8',
            color: '#1A2A3A',
          }}
        >
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={() => navigate(`/admin/eventos/ceremonias/${id}`)}
          sx={{
            backgroundColor: '#E30613',
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: '8px',
            px: 2.5,
            boxShadow: 'none',
            '&:hover': {
              backgroundColor: '#C10510',
              boxShadow: 'none',
            },
          }}
        >
          Guardar sesión
        </Button>
      </Box>
    </AdminLayout>
  );
}
