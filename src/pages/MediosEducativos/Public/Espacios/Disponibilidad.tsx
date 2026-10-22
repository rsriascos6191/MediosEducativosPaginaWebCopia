/**
 * Portal público – Consultar disponibilidad
 */

import { useEffect, useMemo, useState } from 'react';
import { Alert, Box, Typography, Button, Container, TextField, MenuItem, Card, CircularProgress } from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  consultarDisponibilidadEspacio,
  obtenerEspacios,
  type DisponibilidadEspacio,
  type EspacioOption,
} from '../../../../services/api';

export default function Disponibilidad() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [espacios, setEspacios] = useState<EspacioOption[]>([]);
  const [loadingEspacios, setLoadingEspacios] = useState(true);
  const [campus, setCampus] = useState('');
  const [espacioId, setEspacioId] = useState(searchParams.get('espacio') || '');
  const [fecha, setFecha] = useState('');
  const [horaInicio, setHoraInicio] = useState('');
  const [horaFin, setHoraFin] = useState('');
  const [consultando, setConsultando] = useState(false);
  const [resultado, setResultado] = useState<DisponibilidadEspacio | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let activo = true;
    obtenerEspacios()
      .then((resultadoEspacios) => {
        if (!activo) return;
        setEspacios(resultadoEspacios);
        const preseleccionado = resultadoEspacios.find(
          (espacio) => String(espacio.id_espacio) === searchParams.get('espacio'),
        );
        if (preseleccionado) setCampus(preseleccionado.campus);
      })
      .catch((loadError: unknown) => {
        if (activo) {
          setError(loadError instanceof Error ? loadError.message : 'No fue posible cargar los espacios.');
        }
      })
      .finally(() => {
        if (activo) setLoadingEspacios(false);
      });

    return () => {
      activo = false;
    };
  }, [searchParams]);

  const campusOptions = useMemo(
    () => [...new Set(espacios.map((espacio) => espacio.campus))].sort(),
    [espacios],
  );
  const espacioOptions = espacios.filter((espacio) => !campus || espacio.campus === campus);

  const consultar = async () => {
    setError('');
    setResultado(null);

    if (!espacioId || !fecha || !horaInicio || !horaFin) {
      setError('Selecciona un espacio, una fecha y las horas de inicio y finalización.');
      return;
    }
    if (horaFin <= horaInicio) {
      setError('La hora de finalización debe ser posterior a la hora de inicio.');
      return;
    }

    setConsultando(true);
    try {
      const disponibilidad = await consultarDisponibilidadEspacio(
        Number(espacioId),
        fecha,
        horaInicio,
        horaFin,
      );
      setResultado(disponibilidad);
    } catch (queryError: unknown) {
      setError(queryError instanceof Error ? queryError.message : 'No fue posible consultar la disponibilidad.');
    } finally {
      setConsultando(false);
    }
  };

  const solicitarReserva = () => {
    if (!resultado?.disponible) return;
    const parametros = new URLSearchParams({
      espacio: String(resultado.id_espacio),
      fecha,
      horaInicio,
      horaFin,
    });
    navigate(`/reserva?${parametros.toString()}`);
  };

  return (
    <>
      <Box sx={{ backgroundColor: '#6B7A8A', py: 5 }}>
        <Container maxWidth="lg">
          <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem', fontWeight: 600, mb: 1 }}>MEDIOS EDUCATIVOS</Typography>
          <Typography sx={{ color: '#FFFFFF', fontWeight: 800, fontSize: { xs: '2rem', md: '2.25rem' }, mb: 1 }}>
            Consultar disponibilidad
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.85)' }}>
            Selecciona los criterios para consultar los espacios disponibles.
          </Typography>
          <Box sx={{ width: 40, height: 3, backgroundColor: '#E30613', mt: 2 }} />
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Card elevation={0} sx={{ borderRadius: '12px', border: '1px solid #E5EAF0', p: 3, mb: 4 }}>
          <Typography sx={{ fontWeight: 700, fontSize: '1.15rem', color: '#0B1A2A', mb: 0.5 }}>Define tu búsqueda</Typography>
          <Typography sx={{ color: '#5A6A7A', fontSize: '0.85rem', mb: 0.5 }}>Selecciona los criterios para consultar disponibilidad.</Typography>
          <Box sx={{ width: 40, height: 3, backgroundColor: '#E30613', mb: 2.5 }} />

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' }, gap: 2, mb: 2 }}>
            <TextField select size="small" label="Campus" value={campus} onChange={(event) => {
              setCampus(event.target.value);
              setEspacioId('');
              setResultado(null);
            }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}>
              <MenuItem value="">Seleccionar campus</MenuItem>
              {campusOptions.map((option) => <MenuItem key={option} value={option}>{option}</MenuItem>)}
            </TextField>
            <TextField select size="small" label="Espacio" value={espacioId}
              disabled={loadingEspacios || !campus}
              onChange={(event) => { setEspacioId(event.target.value); setResultado(null); }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}>
              <MenuItem value="">Seleccionar espacio</MenuItem>
              {espacioOptions.map((espacio) => (
                <MenuItem key={espacio.id_espacio} value={String(espacio.id_espacio)}>
                  {espacio.nombre} · {espacio.tipo_espacio}
                </MenuItem>
              ))}
            </TextField>
            <TextField size="small" type="date" label="Fecha" slotProps={{ inputLabel: { shrink: true } }}
              value={fecha} onChange={(event) => { setFecha(event.target.value); setResultado(null); }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }} />
          </Box>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' }, gap: 2, alignItems: 'end' }}>
            <TextField select size="small" label="Hora de inicio" value={horaInicio}
              onChange={(event) => { setHoraInicio(event.target.value); setResultado(null); }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}>
              <MenuItem value="">Seleccionar hora</MenuItem>
              {['07:00', '08:00', '09:00', '10:00', '11:00', '14:00', '16:00'].map((hora) => (
                <MenuItem key={hora} value={hora}>{hora}</MenuItem>
              ))}
            </TextField>
            <TextField select size="small" label="Hora de finalización" value={horaFin}
              onChange={(event) => { setHoraFin(event.target.value); setResultado(null); }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}>
              <MenuItem value="">Seleccionar hora</MenuItem>
              {['08:00', '09:00', '10:00', '11:00', '12:00', '15:00', '17:00'].map((hora) => (
                <MenuItem key={hora} value={hora}>{hora}</MenuItem>
              ))}
            </TextField>
            <Button variant="contained" onClick={consultar} disabled={loadingEspacios || consultando}
              sx={{
                backgroundColor: '#E30613', textTransform: 'none', fontWeight: 700, borderRadius: '8px', py: 1.2, boxShadow: 'none',
                '&:hover': { backgroundColor: '#C10510', boxShadow: 'none' },
              }}>
              {consultando ? <CircularProgress size={20} color="inherit" /> : 'Consultar disponibilidad →'}
            </Button>
          </Box>
          <Button onClick={() => {
            setCampus('');
            setEspacioId('');
            setFecha('');
            setHoraInicio('');
            setHoraFin('');
            setResultado(null);
            setError('');
          }} sx={{ color: '#5A6A7A', textTransform: 'none', fontSize: '0.85rem', mt: 1.5 }}>
            Limpiar filtros
          </Button>
        </Card>

        <Typography sx={{ fontWeight: 700, fontSize: '1.25rem', color: '#0B1A2A', mb: 0.5 }}>Resultados</Typography>
        <Box sx={{ width: 40, height: 3, backgroundColor: '#E30613', mb: 2 }} />

        <Card elevation={0} sx={{ borderRadius: '12px', border: '1px solid #E5EAF0', p: 4, textAlign: 'center' }}>
          {!resultado ? (
            <>
              <Typography sx={{ fontWeight: 700, fontSize: '1.15rem', color: '#0B1A2A', mb: 0.5 }}>
                Selecciona los criterios de búsqueda
              </Typography>
              <Typography sx={{ color: '#5A6A7A', fontSize: '0.9rem' }}>
                para consultar la disponibilidad real del espacio.
              </Typography>
            </>
          ) : (
            <>
              <Typography sx={{ fontWeight: 700, fontSize: '1.15rem', color: resultado.disponible ? '#1B7A3D' : '#C62828', mb: 1 }}>
                {resultado.disponible ? 'Espacio disponible' : 'Espacio no disponible'}
              </Typography>
              <Typography sx={{ color: '#5A6A7A', mb: 2 }}>
                {resultado.nombre} · {resultado.campus} · {fecha} · {horaInicio}–{horaFin}
              </Typography>
              {resultado.disponible && (
                <Button variant="contained" onClick={solicitarReserva}
                  sx={{
                    backgroundColor: '#E30613', textTransform: 'none', fontWeight: 600, borderRadius: '8px', boxShadow: 'none',
                    '&:hover': { backgroundColor: '#C10510', boxShadow: 'none' },
                  }}>
                  Solicitar reserva →
                </Button>
              )}
            </>
          )}
        </Card>
      </Container>
    </>
  );
}
