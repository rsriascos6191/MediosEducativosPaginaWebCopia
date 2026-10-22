/**
 * Portal público – Catálogo de espacios
 */

import { useEffect, useMemo, useState } from 'react';
import {
  Alert, Box, Typography, Button, Container, TextField, MenuItem, Card,
  CardContent, Pagination, CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { obtenerEspacios, type EspacioOption } from '../../../../services/api';

const PAGE_SIZE = 8;

export default function CatalogoEspacios() {
  const navigate = useNavigate();
  const [espacios, setEspacios] = useState<EspacioOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [nombre, setNombre] = useState('');
  const [campus, setCampus] = useState('');
  const [tipo, setTipo] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    let activo = true;

    obtenerEspacios()
      .then((resultado) => {
        if (activo) setEspacios(resultado);
      })
      .catch((loadError: unknown) => {
        if (activo) {
          setError(loadError instanceof Error ? loadError.message : 'No fue posible cargar los espacios.');
        }
      })
      .finally(() => {
        if (activo) setLoading(false);
      });

    return () => {
      activo = false;
    };
  }, []);

  const campusOptions = useMemo(
    () => [...new Set(espacios.map((espacio) => espacio.campus))].sort(),
    [espacios],
  );
  const tipoOptions = useMemo(
    () => [...new Set(espacios.map((espacio) => espacio.tipo_espacio))].sort(),
    [espacios],
  );
  const filtered = espacios.filter((espacio) => {
    if (nombre && !espacio.nombre.toLowerCase().includes(nombre.trim().toLowerCase())) return false;
    if (campus && espacio.campus !== campus) return false;
    if (tipo && espacio.tipo_espacio !== tipo) return false;
    return true;
  });
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageEspacios = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const limpiarFiltros = () => {
    setNombre('');
    setCampus('');
    setTipo('');
    setPage(1);
  };

  return (
    <>
      <Box sx={{ backgroundColor: '#0B3A5C', py: 5 }}>
        <Container maxWidth="lg">
          <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', fontWeight: 600, mb: 1 }}>ESPACIOS CESMAG</Typography>
          <Typography sx={{ color: '#FFFFFF', fontWeight: 800, fontSize: { xs: '2rem', md: '2.5rem' }, mb: 1 }}>
            Catálogo de espacios
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.8)' }}>
            Encuentra el espacio ideal, revisa sus características y consulta su disponibilidad.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{
          backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5EAF0',
          p: 2.5, mb: 3.5, boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
        }}>
          <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', color: '#0B1A2A', mb: 1.5 }}>
            ENCUENTRA EL ESPACIO QUE NECESITAS · Buscar y filtrar espacios
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, alignItems: 'center' }}>
            <TextField size="small" placeholder="Buscar espacio..." value={nombre}
              onChange={(event) => { setNombre(event.target.value); setPage(1); }}
              sx={{ flex: 1, minWidth: 160, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }} />
            <TextField select size="small" label="Campus" value={campus}
              onChange={(event) => { setCampus(event.target.value); setPage(1); }}
              sx={{ minWidth: 150, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}>
              <MenuItem value="">Todos los campus</MenuItem>
              {campusOptions.map((option) => <MenuItem key={option} value={option}>{option}</MenuItem>)}
            </TextField>
            <TextField select size="small" label="Tipo de espacio" value={tipo}
              onChange={(event) => { setTipo(event.target.value); setPage(1); }}
              sx={{ minWidth: 150, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}>
              <MenuItem value="">Todos los tipos</MenuItem>
              {tipoOptions.map((option) => <MenuItem key={option} value={option}>{option}</MenuItem>)}
            </TextField>
            <Button variant="contained" onClick={() => setPage(1)} sx={{
              backgroundColor: '#E30613', textTransform: 'none', fontWeight: 700, borderRadius: '8px', px: 3, boxShadow: 'none',
              '&:hover': { backgroundColor: '#C10510', boxShadow: 'none' },
            }}>
              BUSCAR
            </Button>
          </Box>
          <Button onClick={limpiarFiltros}
            sx={{ color: '#5A6A7A', textTransform: 'none', fontSize: '0.85rem', mt: 1 }}>
            Limpiar filtros
          </Button>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography sx={{ fontWeight: 600, fontSize: '0.9rem', color: '#5A6A7A' }}>ESPACIOS DISPONIBLES</Typography>
          <Typography sx={{ color: '#5A6A7A', fontSize: '0.85rem' }}>
            {filtered.length === 0 ? 'No hay espacios para mostrar' : `Mostrando ${(page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, filtered.length)} de ${filtered.length} espacios`}
          </Typography>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}><CircularProgress /></Box>
        ) : filtered.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <Typography sx={{ fontWeight: 700, color: '#0B1A2A', mb: 1 }}>
              {error ? 'No fue posible mostrar los espacios.' : 'No encontramos espacios con estos criterios.'}
            </Typography>
            {!error && <Typography sx={{ color: '#5A6A7A', mb: 2 }}>Prueba modificando los filtros de búsqueda.</Typography>}
            {!error && <Button variant="contained" onClick={limpiarFiltros}
              sx={{ backgroundColor: '#0B3A5C', textTransform: 'none', borderRadius: '8px' }}>
              Limpiar filtros
            </Button>}
          </Box>
        ) : (
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 2 }}>
            {pageEspacios.map((espacio) => (
              <Card key={espacio.id_espacio} elevation={0} sx={{ borderRadius: '12px', border: '1px solid #E5EAF0', overflow: 'hidden' }}>
                {espacio.imagen ? (
                  <Box component="img" src={espacio.imagen} alt={espacio.nombre} sx={{ width: '100%', height: 140, objectFit: 'cover' }} />
                ) : (
                  <Box sx={{ height: 140, background: 'linear-gradient(135deg, #0B3A5C, #4A90A4)' }} />
                )}
                <CardContent sx={{ p: 2 }}>
                  <Typography sx={{ color: '#5A6A7A', fontSize: '0.7rem', fontWeight: 600, letterSpacing: 0.5, mb: 0.3 }}>
                    {espacio.tipo_espacio}
                  </Typography>
                  <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: '#0B1A2A', mb: 0.5 }}>{espacio.nombre}</Typography>
                  <Typography sx={{ color: '#5A6A7A', fontSize: '0.8rem', mb: 1.5 }}>
                    Capacidad {espacio.capacidad ? `${espacio.capacidad} personas` : 'por consultar'} · {espacio.campus}
                  </Typography>
                  <Button onClick={() => navigate(`/espacios/${espacio.id_espacio}`)}
                    sx={{ color: '#E30613', textTransform: 'none', fontWeight: 600, fontSize: '0.85rem', p: 0 }}>
                    Ver espacio →
                  </Button>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}

        {!loading && filtered.length > PAGE_SIZE && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Pagination count={pageCount} page={page} onChange={(_, nextPage) => setPage(nextPage)} color="primary"
              sx={{ '& .Mui-selected': { backgroundColor: '#E30613 !important', color: '#FFF' } }} />
          </Box>
        )}
      </Container>
    </>
  );
}
