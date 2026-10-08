/**
 * Pantalla principal: Admin – Solicitudes
 * Diseño 1:1 del prototipo de Figma.
 * Datos ficticios preparados para futuro enlace a API.
 */

import { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AdminLayout from '../../../../components/AdminLayout';
import SolicitudesFilters from './components/SolicitudesFilters';
import SolicitudesTable from './components/SolicitudesTable';
import type { Solicitud, SolicitudFilters } from './interfaces/solicitudes.interface';
import { getSolicitudes } from './services/solicitudes.service';

export default function Solicitudes() {
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<SolicitudFilters>({});

  const loadData = useCallback(async (currentFilters?: SolicitudFilters) => {
    setLoading(true);
    try {
      const response = await getSolicitudes(currentFilters);
      setSolicitudes(response.data);
    } catch (error) {
      console.error('Error al cargar solicitudes:', error);
      setSolicitudes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleFilter = () => {
    loadData(filters);
  };

  const handleClear = () => {
    setFilters({});
    loadData({});
  };

  return (
    <AdminLayout>
      {/* Header de la página */}
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
            Solicitudes
          </Typography>
          <Typography sx={{ color: '#5A6A7A', fontSize: '0.95rem' }}>
            Gestiona y revisa las solicitudes de reserva
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
            fontSize: '0.9rem',
            boxShadow: 'none',
            '&:hover': {
              backgroundColor: '#C10510',
              boxShadow: 'none',
            },
          }}
        >
          Nueva solicitud
        </Button>
      </Box>

      {/* Filtros */}
      <SolicitudesFilters
        filters={filters}
        onChange={setFilters}
        onFilter={handleFilter}
        onClear={handleClear}
      />

      {/* Tabla */}
      <SolicitudesTable solicitudes={solicitudes} loading={loading} />
    </AdminLayout>
  );
}
