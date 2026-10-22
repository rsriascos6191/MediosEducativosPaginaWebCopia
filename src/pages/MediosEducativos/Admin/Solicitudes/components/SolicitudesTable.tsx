/**
 * Tabla de solicitudes – diseño 1:1 del prototipo.
 */

import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import type { Solicitud, EstadoSolicitud } from '../interfaces/solicitudes.interface';

interface Props {
  solicitudes: Solicitud[];
  loading?: boolean;
  onRechazar: (solicitud: Solicitud) => void;
  onCancelar: (solicitud: Solicitud) => void;
}

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

export default function SolicitudesTable({
  solicitudes,
  loading,
  onRechazar,
  onCancelar,
}: Props) {
  const navigate = useNavigate();

  if (loading) {
    return (
      <Box sx={{ p: 4, textAlign: 'center', color: '#5A6A7A' }}>
        Cargando solicitudes…
      </Box>
    );
  }

  if (solicitudes.length === 0) {
    return (
      <Box sx={{ p: 4, textAlign: 'center', color: '#5A6A7A' }}>
        No se encontraron solicitudes con los filtros aplicados.
      </Box>
    );
  }

  return (
    <TableContainer
      sx={{
        backgroundColor: '#FFFFFF',
        borderRadius: '12px',
        border: '1px solid #E5EAF0',
        overflow: 'hidden',
      }}
    >
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: '#FAFBFC' }}>
            {['Código', 'Solicitante', 'Espacio', 'Fecha', 'Horario', 'Campus', 'Acciones', 'Estado'].map(
              (header) => (
                <TableCell
                  key={header}
                  sx={{
                    fontWeight: 600,
                    color: '#1A2A3A',
                    fontSize: '0.85rem',
                    borderBottom: '1px solid #E5EAF0',
                    py: 1.75,
                  }}
                >
                  {header}
                </TableCell>
              )
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {solicitudes.map((s) => (
            <TableRow
              key={s.id}
              sx={{
                '&:hover': { backgroundColor: '#F8FAFC' },
                '& td': { borderBottom: '1px solid #F0F3F7' },
              }}
            >
              <TableCell sx={{ fontWeight: 600, color: '#1A2A3A', fontSize: '0.875rem' }}>
                {s.codigo}
              </TableCell>
              <TableCell sx={{ color: '#1A2A3A', fontSize: '0.875rem' }}>
                {s.solicitante}
              </TableCell>
              <TableCell sx={{ color: '#1A2A3A', fontSize: '0.875rem' }}>
                {s.espacio.includes('Auditorio') ? 'Auditorio' : s.espacio}
              </TableCell>
              <TableCell sx={{ color: '#1A2A3A', fontSize: '0.875rem' }}>
                {s.fechaDisplay}
              </TableCell>
              <TableCell sx={{ color: '#1A2A3A', fontSize: '0.875rem' }}>
                {s.horario}
              </TableCell>
              <TableCell sx={{ color: '#1A2A3A', fontSize: '0.875rem' }}>
                {s.campus}
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 0.75 }}>
                  <Button
                    variant="text"
                    onClick={() => navigate(`/admin/solicitudes/${s.id}`)}
                    sx={{
                      color: '#1565C0',
                      textTransform: 'none',
                      fontWeight: 500,
                      fontSize: '0.875rem',
                      p: 0,
                      minWidth: 'auto',
                      '&:hover': { backgroundColor: 'transparent', textDecoration: 'underline' },
                    }}
                  >
                    Ver detalle →
                  </Button>
                  {s.estado === 'Pendiente' && (
                    <Button
                      size="small"
                      onClick={() => onRechazar(s)}
                      sx={{ color: '#C62828', textTransform: 'none', minWidth: 'auto', px: 0.5 }}
                    >
                      Rechazar
                    </Button>
                  )}
                  {(s.estado === 'Pendiente' || s.estado === 'Aprobada') && (
                    <Button
                      size="small"
                      onClick={() => onCancelar(s)}
                      sx={{ color: '#5A6A7A', textTransform: 'none', minWidth: 'auto', px: 0.5 }}
                    >
                      Cancelar
                    </Button>
                  )}
                </Box>
              </TableCell>
              <TableCell>
                <Chip
                  label={s.estado}
                  size="small"
                  sx={{
                    backgroundColor: estadoColor[s.estado].bg,
                    color: estadoColor[s.estado].color,
                    fontWeight: 600,
                    fontSize: '0.75rem',
                    height: 26,
                    borderRadius: '6px',
                  }}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
