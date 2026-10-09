/**
 * Tabla de agenda – diseño 1:1 del prototipo.
 */

import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
  Chip,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import type { ReservaAgenda, EstadoReserva } from '../interfaces/agenda.interface';

interface Props {
  reservas: ReservaAgenda[];
  loading?: boolean;
}

const estadoStyles: Record<
  EstadoReserva,
  { bg: string; color: string }
> = {
  Aprobada: { bg: '#E6F4EA', color: '#1B7A3D' },
  Activa: { bg: '#E8F5E9', color: '#2E7D32' },
  Pendiente: { bg: '#FFF4E5', color: '#B76E00' },
  Bloqueado: { bg: '#F0F2F5', color: '#5A6A7A' },
};

const headers = [
  'Código',
  'Actividad',
  'Solicitante',
  'Espacio',
  'Campus',
  'Fecha',
  'Horario',
  'Estado',
  'Acción',
];

export default function AgendaTable({ reservas, loading }: Props) {
  const navigate = useNavigate();

  if (loading) {
    return (
      <Box sx={{ p: 4, textAlign: 'center', color: '#5A6A7A' }}>
        Cargando agenda…
      </Box>
    );
  }

  if (reservas.length === 0) {
    return (
      <Box
        sx={{
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          border: '1px solid #E5EAF0',
          p: 5,
          textAlign: 'center',
          color: '#5A6A7A',
        }}
      >
        No se encontraron reservas con los filtros aplicados.
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
          <TableRow sx={{ backgroundColor: '#0B3A5C' }}>
            {headers.map((h) => (
              <TableCell
                key={h}
                sx={{
                  color: '#FFFFFF',
                  fontWeight: 600,
                  fontSize: '0.82rem',
                  py: 1.6,
                  borderBottom: 'none',
                  whiteSpace: 'nowrap',
                }}
              >
                {h}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {reservas.map((r) => (
            <TableRow
              key={r.id}
              sx={{
                '&:hover': { backgroundColor: '#F8FAFC' },
                '& td': { borderBottom: '1px solid #F0F3F7' },
              }}
            >
              <TableCell
                sx={{ fontWeight: 600, color: '#1565C0', fontSize: '0.875rem' }}
              >
                {r.codigo}
              </TableCell>
              <TableCell sx={{ color: '#1A2A3A', fontSize: '0.875rem' }}>
                {r.actividad}
              </TableCell>
              <TableCell sx={{ color: '#1A2A3A', fontSize: '0.875rem' }}>
                {r.solicitante}
              </TableCell>
              <TableCell sx={{ color: '#1A2A3A', fontSize: '0.875rem' }}>
                {r.espacio}
              </TableCell>
              <TableCell sx={{ color: '#1A2A3A', fontSize: '0.875rem' }}>
                {r.campus}
              </TableCell>
              <TableCell sx={{ color: '#1A2A3A', fontSize: '0.875rem' }}>
                {r.fechaDisplay}
              </TableCell>
              <TableCell sx={{ color: '#1A2A3A', fontSize: '0.875rem' }}>
                {r.horario}
              </TableCell>
              <TableCell>
                <Chip
                  label={r.estado}
                  size="small"
                  sx={{
                    backgroundColor: estadoStyles[r.estado].bg,
                    color: estadoStyles[r.estado].color,
                    fontWeight: 600,
                    fontSize: '0.75rem',
                    height: 26,
                    borderRadius: '6px',
                  }}
                />
              </TableCell>
              <TableCell>
                <Button
                  variant="text"
                  onClick={() => {
                    if (r.solicitudId) {
                      navigate(`/admin/solicitudes/${r.solicitudId}`);
                    } else {
                      navigate(`/admin/solicitudes`);
                    }
                  }}
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
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
