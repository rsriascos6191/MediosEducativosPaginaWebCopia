/**
 * Pantalla: Detalle de solicitud
 * Diseño 1:1 del prototipo de Figma.
 * Acciones Aprobar / Rechazar preparadas para futuro enlace a API.
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Chip,
  TextField,
  CircularProgress,
  Divider,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Swal from 'sweetalert2';
import AdminLayout from '../../../../components/AdminLayout';
import type { Solicitud, EstadoSolicitud } from './interfaces/solicitudes.interface';
import {
  getSolicitudById,
  updateEstadoSolicitud,
} from './services/solicitudes.service';

const estadoColor: Record<
  EstadoSolicitud,
  { bg: string; color: string }
> = {
  Pendiente: { bg: '#FFF4E5', color: '#B76E00' },
  Aprobada: { bg: '#E6F4EA', color: '#1B7A3D' },
  Activa: { bg: '#E3F2FD', color: '#1565C0' },
  Rechazada: { bg: '#FFEBEE', color: '#C62828' },
  Cancelada: { bg: '#F5F5F5', color: '#616161' },
};

export default function SolicitudDetalle() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [solicitud, setSolicitud] = useState<Solicitud | null>(null);
  const [loading, setLoading] = useState(true);
  const [observaciones, setObservaciones] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getSolicitudById(id)
      .then((data) => {
        setSolicitud(data);
        if (data?.observaciones) setObservaciones(data.observaciones);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleUpdateEstado = async (nuevoEstado: EstadoSolicitud) => {
    if (!solicitud) return;

    const result = await Swal.fire({
      title: nuevoEstado === 'Aprobada' ? '¿Aprobar solicitud?' : '¿Rechazar solicitud?',
      text:
        nuevoEstado === 'Aprobada'
          ? 'La solicitud pasará a estado Aprobada.'
          : 'La solicitud será rechazada.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: nuevoEstado === 'Aprobada' ? '#E30613' : '#0B3A5C',
      cancelButtonColor: '#9AA5B5',
      confirmButtonText: nuevoEstado === 'Aprobada' ? 'Sí, aprobar' : 'Sí, rechazar',
      cancelButtonText: 'Cancelar',
    });

    if (!result.isConfirmed) return;

    setUpdating(true);
    try {
      const updated = await updateEstadoSolicitud(
        solicitud.id,
        nuevoEstado,
        observaciones
      );
      if (updated) {
        setSolicitud(updated);
        await Swal.fire({
          icon: 'success',
          title: 'Estado actualizado',
          text: `La solicitud ahora está ${nuevoEstado.toLowerCase()}.`,
          timer: 2000,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'No se pudo actualizar el estado.', 'error');
    } finally {
      setUpdating(false);
    }
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

  if (!solicitud) {
    return (
      <AdminLayout>
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            Solicitud no encontrada
          </Typography>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/admin/solicitudes')}
            sx={{ mt: 2, textTransform: 'none' }}
          >
            Volver a solicitudes
          </Button>
        </Box>
      </AdminLayout>
    );
  }

  const fechaLarga = (() => {
    const d = new Date(solicitud.fecha + 'T12:00:00');
    return d.toLocaleDateString('es-CO', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  })();

  const detailRows = [
    { label: 'Solicitante', value: solicitud.solicitante },
    { label: 'Correo', value: solicitud.correo },
    { label: 'Dependencia / programa / grupo', value: solicitud.dependenciaProgramaGrupo },
    { label: 'Actividad', value: solicitud.actividad },
    { label: 'Espacio', value: solicitud.espacio },
    { label: 'Tipo de espacio', value: solicitud.tipoEspacio },
    { label: 'Campus', value: solicitud.campus },
    { label: 'Fecha', value: fechaLarga },
    { label: 'Horario', value: solicitud.horario },
    { label: 'Requisitos', value: solicitud.requisitos },
    { label: 'Asistentes', value: `${solicitud.asistentes} personas` },
  ];

  return (
    <AdminLayout>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: '#0B1A2A',
            fontSize: '1.75rem',
            mb: 0.5,
          }}
        >
          Detalle de solicitud
        </Typography>
        <Typography sx={{ color: '#5A6A7A', fontSize: '0.95rem', mb: 1.5 }}>
          Revisa la información y decide el estado de la solicitud
        </Typography>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/admin/solicitudes')}
          sx={{
            color: '#1565C0',
            textTransform: 'none',
            fontWeight: 500,
            p: 0,
            minWidth: 'auto',
            '&:hover': { backgroundColor: 'transparent', textDecoration: 'underline' },
          }}
        >
          Volver a solicitudes
        </Button>
      </Box>

      {/* Contenido en dos columnas */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '1fr 340px' },
          gap: 3,
          alignItems: 'start',
        }}
      >
        {/* Card izquierda – Información de la solicitud */}
        <Box
          sx={{
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            border: '1px solid #E5EAF0',
            p: 3,
          }}
        >
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: '1.15rem',
              color: '#0B1A2A',
              mb: 3,
            }}
          >
            {solicitud.codigo} · Solicitud de reserva
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.25 }}>
            {detailRows.map((row) => (
              <Box
                key={row.label}
                sx={{
                  display: 'grid',
                  gridTemplateColumns: '200px 1fr',
                  gap: 2,
                  alignItems: 'start',
                }}
              >
                <Typography
                  sx={{
                    color: '#5A6A7A',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                  }}
                >
                  {row.label}
                </Typography>
                <Typography
                  sx={{
                    color: '#1A2A3A',
                    fontSize: '0.9rem',
                    fontWeight: 500,
                  }}
                >
                  {row.value}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Card derecha – Estado y acciones */}
        <Box
          sx={{
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            border: '1px solid #E5EAF0',
            p: 3,
            position: 'sticky',
            top: 80,
          }}
        >
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: '1.05rem',
              color: '#0B1A2A',
              mb: 2,
            }}
          >
            Estado de la solicitud
          </Typography>

          <Chip
            label={solicitud.estado}
            sx={{
              backgroundColor: estadoColor[solicitud.estado].bg,
              color: estadoColor[solicitud.estado].color,
              fontWeight: 600,
              fontSize: '0.85rem',
              height: 32,
              borderRadius: '8px',
              mb: 2.5,
            }}
          />

          <Typography
            sx={{
              color: '#5A6A7A',
              fontSize: '0.85rem',
              fontWeight: 500,
              mb: 1,
            }}
          >
            Observaciones
          </Typography>
          <TextField
            multiline
            rows={4}
            fullWidth
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
            placeholder="Agregar observaciones…"
            sx={{
              mb: 3,
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
                backgroundColor: '#F8FAFC',
                fontSize: '0.875rem',
              },
            }}
          />

          {solicitud.estado === 'Pendiente' && (
            <Box sx={{ display: 'flex', gap: 1.5, mb: 3 }}>
              <Button
                variant="outlined"
                fullWidth
                disabled={updating}
                onClick={() => handleUpdateEstado('Rechazada')}
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                  borderRadius: '8px',
                  borderColor: '#0B3A5C',
                  color: '#0B3A5C',
                  py: 1.1,
                  '&:hover': {
                    borderColor: '#062A42',
                    backgroundColor: 'rgba(11,58,92,0.04)',
                  },
                }}
              >
                Rechazar
              </Button>
              <Button
                variant="contained"
                fullWidth
                disabled={updating}
                onClick={() => handleUpdateEstado('Aprobada')}
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                  borderRadius: '8px',
                  backgroundColor: '#E30613',
                  py: 1.1,
                  boxShadow: 'none',
                  '&:hover': {
                    backgroundColor: '#C10510',
                    boxShadow: 'none',
                  },
                }}
              >
                Aprobar
              </Button>
            </Box>
          )}

          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Box>
              <Typography sx={{ color: '#5A6A7A', fontSize: '0.8rem', mb: 0.25 }}>
                Fecha de creación
              </Typography>
              <Typography sx={{ color: '#1A2A3A', fontSize: '0.875rem', fontWeight: 500 }}>
                {solicitud.fechaCreacion}
              </Typography>
            </Box>
            <Box>
              <Typography sx={{ color: '#5A6A7A', fontSize: '0.8rem', mb: 0.25 }}>
                Última actualización
              </Typography>
              <Typography sx={{ color: '#1A2A3A', fontSize: '0.875rem', fontWeight: 500 }}>
                {solicitud.ultimaActualizacion}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </AdminLayout>
  );
}
