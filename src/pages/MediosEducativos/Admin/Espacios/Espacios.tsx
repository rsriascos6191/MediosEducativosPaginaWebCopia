/**
 * Pantalla: Admin – Gestión de espacios
 * Diseño 1:1 del prototipo de Figma (cards con imagen + estado).
 */

import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  MenuItem,
  Card,
  CardContent,
  Chip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AdminLayout from '../../../../components/AdminLayout';
import type { Espacio, EspacioFilters } from './interfaces/espacios.interface';
import {
  getEspacios,
  TIPO_ESPACIO_OPTIONS,
} from './services/espacios.service';

const estadoStyles: Record<
  string,
  { bg: string; color: string }
> = {
  Disponible: { bg: '#E6F4EA', color: '#1B7A3D' },
  Mantenimiento: { bg: '#FFF4E5', color: '#B76E00' },
  'No disponible': { bg: '#FFEBEE', color: '#C62828' },
};

export default function Espacios() {
  const [espacios, setEspacios] = useState<Espacio[]>([]);
  const [loading, setLoading] = useState(true);
  const [nombre, setNombre] = useState('');
  const [tipo, setTipo] = useState('');

  const load = useCallback(async (filters?: EspacioFilters) => {
    setLoading(true);
    try {
      const res = await getEspacios(filters);
      setEspacios(res.data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleBuscar = () => {
    load({
      nombre: nombre || undefined,
      tipo: tipo || undefined,
    });
  };

  return (
    <AdminLayout>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          mb: 3,
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: '#0B1A2A',
              fontSize: '1.75rem',
              mb: 0.5,
            }}
          >
            Gestión de espacios
          </Typography>
          <Typography sx={{ color: '#5A6A7A', fontSize: '0.95rem' }}>
            Administra los espacios disponibles para reservas
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{
            backgroundColor: '#E30613',
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: '8px',
            px: 2.5,
            py: 1.1,
            boxShadow: 'none',
            '&:hover': { backgroundColor: '#C10510', boxShadow: 'none' },
          }}
        >
          Nuevo espacio
        </Button>
      </Box>

      {/* Barra de búsqueda */}
      <Box
        sx={{
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          border: '1px solid #E5EAF0',
          p: 2,
          mb: 3,
          display: 'flex',
          flexWrap: 'wrap',
          gap: 1.5,
          alignItems: 'center',
        }}
      >
        <Typography
          sx={{
            color: '#5A6A7A',
            fontSize: '0.875rem',
            fontWeight: 500,
            minWidth: 100,
          }}
        >
          Buscar espacio
        </Typography>
        <TextField
          size="small"
          placeholder="Nombre del espacio"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleBuscar()}
          sx={{
            flex: 1,
            minWidth: 180,
            '& .MuiOutlinedInput-root': { borderRadius: '8px' },
          }}
        />
        <TextField
          select
          size="small"
          label="Tipo"
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
          sx={{
            minWidth: 150,
            '& .MuiOutlinedInput-root': { borderRadius: '8px' },
          }}
        >
          <MenuItem value="">Todos</MenuItem>
          {TIPO_ESPACIO_OPTIONS.map((t) => (
            <MenuItem key={t} value={t}>
              {t}
            </MenuItem>
          ))}
        </TextField>
        <Button
          variant="contained"
          onClick={handleBuscar}
          sx={{
            backgroundColor: '#0B3A5C',
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: '8px',
            px: 3,
            '&:hover': { backgroundColor: '#062A42' },
          }}
        >
          Buscar
        </Button>
      </Box>

      {/* Grid de cards */}
      {loading ? (
        <Typography sx={{ color: '#5A6A7A', textAlign: 'center', py: 6 }}>
          Cargando espacios…
        </Typography>
      ) : espacios.length === 0 ? (
        <Typography sx={{ color: '#5A6A7A', textAlign: 'center', py: 6 }}>
          No se encontraron espacios.
        </Typography>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: '1fr 1fr',
            },
            gap: 2.5,
          }}
        >
          {espacios.map((e) => (
            <Card
              key={e.id}
              elevation={0}
              sx={{
                borderRadius: '12px',
                border: '1px solid #E5EAF0',
                overflow: 'hidden',
                backgroundColor: '#FFFFFF',
              }}
            >
              {/* Imagen / header visual */}
              <Box
                sx={{
                  height: 140,
                  background: e.imagenGradient || '#0B3A5C',
                  display: 'flex',
                  alignItems: 'flex-end',
                  p: 2,
                }}
              >
                <Typography
                  sx={{
                    color: '#FFFFFF',
                    fontWeight: 700,
                    fontSize: '1.15rem',
                    textShadow: '0 1px 4px rgba(0,0,0,0.4)',
                  }}
                >
                  {e.nombre}
                </Typography>
              </Box>

              <CardContent sx={{ p: 2.5 }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2,
                  }}
                >
                  <Typography sx={{ color: '#5A6A7A', fontSize: '0.875rem' }}>
                    {e.tipo} · {e.capacidad} personas
                  </Typography>
                  <Chip
                    label={e.estado}
                    size="small"
                    sx={{
                      backgroundColor: estadoStyles[e.estado]?.bg || '#F5F5F5',
                      color: estadoStyles[e.estado]?.color || '#616161',
                      fontWeight: 600,
                      fontSize: '0.75rem',
                      height: 26,
                      borderRadius: '6px',
                    }}
                  />
                </Box>

                <Button
                  variant="text"
                  sx={{
                    color: '#1565C0',
                    textTransform: 'none',
                    fontWeight: 500,
                    fontSize: '0.875rem',
                    p: 0,
                    minWidth: 'auto',
                    '&:hover': {
                      backgroundColor: 'transparent',
                      textDecoration: 'underline',
                    },
                  }}
                >
                  Ver detalle →
                </Button>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </AdminLayout>
  );
}
