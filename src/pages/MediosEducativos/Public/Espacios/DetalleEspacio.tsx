/**
 * Portal público – Detalle de espacio
 */

import { useEffect, useState } from 'react';
import { Alert, Box, Typography, Button, Container, Card, CardContent, CircularProgress } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { obtenerEspacio, obtenerEspacios, type EspacioOption } from '../../../../services/api';

export default function DetalleEspacio() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [espacio, setEspacio] = useState<EspacioOption | null>(null);
  const [otrosEspacios, setOtrosEspacios] = useState<EspacioOption[]>([]);
  const [loadedId, setLoadedId] = useState('');
  const [error, setError] = useState('');
  const idEspacio = Number(id);
  const idValido = Number.isInteger(idEspacio) && idEspacio > 0;

  useEffect(() => {
    let activo = true;

    if (!idValido) return;
    Promise.all([obtenerEspacio(idEspacio), obtenerEspacios()])
      .then(([detalle, espacios]) => {
        if (!activo) return;
        setEspacio(detalle);
        setOtrosEspacios(espacios.filter((item) => item.id_espacio !== idEspacio).slice(0, 4));
        setError('');
      })
      .catch((loadError: unknown) => {
        if (activo) {
          setError(loadError instanceof Error ? loadError.message : 'No fue posible cargar el espacio.');
        }
      })
      .finally(() => {
        if (activo) setLoadedId(id || '');
      });

    return () => {
      activo = false;
    };
  }, [id, idEspacio, idValido]);

  const consultarDisponibilidad = () => {
    if (espacio) navigate(`/disponibilidad?espacio=${espacio.id_espacio}`);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Typography sx={{ color: '#5A6A7A', fontSize: '0.85rem', mb: 2 }}>
        <Button onClick={() => navigate('/')} sx={{ p: 0, minWidth: 'auto', color: 'inherit', textTransform: 'none', fontSize: 'inherit' }}>Inicio</Button>
        {' / '}
        <Button onClick={() => navigate('/espacios')} sx={{ p: 0, minWidth: 'auto', color: 'inherit', textTransform: 'none', fontSize: 'inherit' }}>Espacios</Button>
        {' / Detalle'}
      </Typography>

      {!idValido || loadedId !== id ? (
        idValido
          ? <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>
          : <Alert severity="error" action={<Button color="inherit" onClick={() => navigate('/espacios')}>Volver al catálogo</Button>}>El espacio solicitado no es válido.</Alert>
      ) : error || !espacio ? (
        <Alert severity="error" action={<Button color="inherit" onClick={() => navigate('/espacios')}>Volver al catálogo</Button>}>
          {error || 'No se encontró el espacio solicitado.'}
        </Alert>
      ) : (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 1 }}>
            <Button onClick={() => navigate('/espacios')} sx={{ color: '#1565C0', textTransform: 'none', fontWeight: 500 }}>
              ← Volver al catálogo
            </Button>
            <Typography sx={{ color: '#5A6A7A', fontSize: '0.85rem', alignSelf: 'center' }}>{espacio.tipo_espacio}</Typography>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4, mb: 5 }}>
            <Box>
              {espacio.imagen ? (
                <Box component="img" src={espacio.imagen} alt={espacio.nombre}
                  sx={{ width: '100%', borderRadius: '12px', maxHeight: 360, objectFit: 'cover', mb: 1.5 }} />
              ) : (
                <Box sx={{ width: '100%', height: 300, borderRadius: '12px', background: 'linear-gradient(135deg, #0B3A5C, #4A90A4)', mb: 1.5 }} />
              )}
            </Box>

            <Box>
              <Typography sx={{ fontWeight: 800, fontSize: '1.75rem', color: '#0B1A2A', mb: 0.5 }}>
                {espacio.nombre}
              </Typography>
              <Typography sx={{ color: '#5A6A7A', fontSize: '0.9rem', mb: 0.5 }}>
                {espacio.campus} · {espacio.tipo_espacio}{espacio.ubicacion ? ` · ${espacio.ubicacion}` : ''}
              </Typography>
              <Box sx={{ width: 40, height: 3, backgroundColor: '#E30613', mb: 2 }} />
              <Typography sx={{ color: '#5A6A7A', fontSize: '0.95rem', mb: 3, lineHeight: 1.6 }}>
                {espacio.descripcion || 'Consulta disponibilidad y condiciones de uso antes de solicitar la reserva.'}
              </Typography>

              <Typography sx={{ fontWeight: 700, fontSize: '1.05rem', color: '#0B1A2A', mb: 1.5 }}>Características</Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5, mb: 3 }}>
                {[
                  { label: 'Capacidad', value: espacio.capacidad ? `${espacio.capacidad} personas` : 'Por consultar' },
                  { label: 'Equipamiento', value: [espacio.recursos, espacio.recursos_otro].filter(Boolean).join(', ') || 'Por consultar' },
                  { label: 'Ubicación', value: espacio.ubicacion || espacio.campus },
                  { label: 'Disponibilidad', value: 'Sujeta a reservas' },
                ].map((caracteristica) => (
                  <Box key={caracteristica.label} sx={{ backgroundColor: '#F0F5FA', borderRadius: '8px', p: 1.5 }}>
                    <Typography sx={{ color: '#5A6A7A', fontSize: '0.75rem' }}>{caracteristica.label}</Typography>
                    <Typography sx={{ fontWeight: 600, color: '#0B1A2A', fontSize: '0.9rem' }}>{caracteristica.value}</Typography>
                  </Box>
                ))}
              </Box>

              <Button variant="contained" onClick={consultarDisponibilidad}
                sx={{
                  backgroundColor: '#E30613', textTransform: 'none', fontWeight: 600, borderRadius: '8px',
                  px: 3, py: 1.2, boxShadow: 'none', '&:hover': { backgroundColor: '#C10510', boxShadow: 'none' },
                }}>
                Consultar disponibilidad →
              </Button>
              <Typography sx={{ color: '#5A6A7A', fontSize: '0.8rem', mt: 1 }}>Consulta fechas y horarios disponibles</Typography>
            </Box>
          </Box>

          {otrosEspacios.length > 0 && (
            <>
              <Typography sx={{ fontWeight: 700, fontSize: '1.15rem', color: '#0B1A2A', mb: 2 }}>Otros espacios disponibles</Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 2 }}>
                {otrosEspacios.map((otro) => (
                  <Card key={otro.id_espacio} elevation={0} sx={{ borderRadius: '12px', border: '1px solid #E5EAF0', overflow: 'hidden' }}>
                    {otro.imagen ? (
                      <Box component="img" src={otro.imagen} alt={otro.nombre} sx={{ width: '100%', height: 110, objectFit: 'cover' }} />
                    ) : (
                      <Box sx={{ height: 110, background: 'linear-gradient(135deg, #0B3A5C, #4A90A4)' }} />
                    )}
                    <CardContent sx={{ p: 1.5 }}>
                      <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', color: '#0B1A2A' }}>{otro.nombre}</Typography>
                      <Typography sx={{ color: '#5A6A7A', fontSize: '0.75rem', mb: 0.5 }}>
                        {otro.tipo_espacio} · {otro.campus}
                      </Typography>
                      <Button onClick={() => navigate(`/espacios/${otro.id_espacio}`)}
                        sx={{ color: '#E30613', textTransform: 'none', fontSize: '0.8rem', p: 0, fontWeight: 500 }}>
                        Ver detalles →
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </>
          )}
        </>
      )}
    </Container>
  );
}
