/**
 * Pantalla principal: Admin – Solicitudes
 * Diseño 1:1 del prototipo de Figma.
 * Datos ficticios preparados para futuro enlace a API.
 */

import { useState, useEffect, useCallback } from 'react';
import { Alert, Box, Typography, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Swal from 'sweetalert2';
import SolicitudesFilters from './components/SolicitudesFilters';
import SolicitudesTable from './components/SolicitudesTable';
import type { Solicitud, SolicitudFilters } from './interfaces/solicitudes.interface';
import ModalMotivo from './components/ModalMotivo';
import {
  getSolicitudes,
  updateEstadoSolicitud,
} from './services/solicitudes.service';

type EstadoConMotivo = 'Rechazada' | 'Cancelada';

export default function Solicitudes() {
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [filters, setFilters] = useState<SolicitudFilters>({});
  const [accionConMotivo, setAccionConMotivo] = useState<{
    solicitud: Solicitud;
    estado: EstadoConMotivo;
  } | null>(null);
  const [updating, setUpdating] = useState(false);

  const loadData = useCallback(async (currentFilters?: SolicitudFilters) => {
    setLoading(true);
    setLoadError('');
    try {
      const response = await getSolicitudes(currentFilters);
      setSolicitudes(response.data);
    } catch (error) {
      console.error('Error al cargar solicitudes:', error);
      setSolicitudes([]);
      setLoadError(
        error instanceof Error
          ? error.message
          : 'No fue posible cargar las solicitudes.',
      );
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

  const handleConfirmarMotivo = async (motivo: string): Promise<boolean> => {
    if (!accionConMotivo) return false;

    setUpdating(true);
    try {
      const resultado = await updateEstadoSolicitud(
        accionConMotivo.solicitud.id,
        accionConMotivo.estado,
        motivo,
      );
      if (!resultado) {
        throw new Error('No se encontró la solicitud para actualizar.');
      }

      setSolicitudes((actuales) =>
        actuales.flatMap((solicitud) => {
          if (solicitud.id !== resultado.solicitud.id) return [solicitud];
          if (filters.estado && filters.estado !== resultado.solicitud.estado) return [];
          return [resultado.solicitud];
        }),
      );

      await Swal.fire({
        icon: resultado.notificacion.enviado ? 'success' : 'warning',
        title: resultado.notificacion.enviado
          ? `Solicitud ${accionConMotivo.estado.toLowerCase()}`
          : 'Estado guardado; correo no enviado',
        text: resultado.notificacion.mensaje,
        timer: resultado.notificacion.enviado ? 2500 : undefined,
        showConfirmButton: !resultado.notificacion.enviado,
      });
      return true;
    } catch (error) {
      console.error('Error al actualizar la solicitud:', error);
      await Swal.fire(
        'Error',
        error instanceof Error ? error.message : 'No se pudo actualizar la solicitud.',
        'error',
      );
      return false;
    } finally {
      setUpdating(false);
    }
  };

  return (
    <>
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
      {loadError && <Alert severity="error" sx={{ mb: 2 }}>{loadError}</Alert>}
      <SolicitudesFilters
        filters={filters}
        onChange={setFilters}
        onFilter={handleFilter}
        onClear={handleClear}
      />

      {/* Tabla */}
      <SolicitudesTable
        solicitudes={solicitudes}
        loading={loading}
        onRechazar={(solicitud) => setAccionConMotivo({ solicitud, estado: 'Rechazada' })}
        onCancelar={(solicitud) => setAccionConMotivo({ solicitud, estado: 'Cancelada' })}
      />
      <ModalMotivo
        open={accionConMotivo !== null}
        titulo={accionConMotivo?.estado === 'Rechazada' ? 'Rechazar solicitud' : 'Cancelar solicitud'}
        etiqueta={accionConMotivo?.estado === 'Rechazada' ? 'Motivo del rechazo' : 'Motivo de la cancelación'}
        textoConfirmar={accionConMotivo?.estado === 'Rechazada' ? 'Rechazar' : 'Cancelar solicitud'}
        cargando={updating}
        onClose={() => setAccionConMotivo(null)}
        onConfirmar={handleConfirmarMotivo}
      />
    </>
  );
}
