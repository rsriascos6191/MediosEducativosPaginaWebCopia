/**
 * Pantalla: Admin – Dashboard
 * Diseño 1:1 del prototipo de Figma.
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Card,
  CardContent,
} from '@mui/material';
import AdminLayout from '../../../../components/AdminLayout';
import type { DashboardData } from './interfaces/dashboard.interface';
import { getDashboard } from './services/dashboard.service';

const estadoStyles: Record<string, { bg: string; color: string }> = {
  Pendiente: { bg: '#FFF4E5', color: '#B76E00' },
  Aprobada: { bg: '#E6F4EA', color: '#1B7A3D' },
  'En proceso': { bg: '#E3F2FD', color: '#1565C0' },
  Rechazada: { bg: '#FFEBEE', color: '#C62828' },
};

const kpiCards = [
  {
    key: 'solicitudesPendientes' as const,
    label: 'Solicitudes pendientes',
    subtitle: 'Requieren atención',
    subtitleColor: '#E30613',
    borderColor: '#E30613',
  },
  {
    key: 'reservasHoy' as const,
    label: 'Reservas de hoy',
    subtitle: 'Actualizado hoy',
    subtitleColor: '#1565C0',
    borderColor: '#1565C0',
  },
  {
    key: 'espaciosActivos' as const,
    label: 'Espacios activos',
    subtitle: 'Disponibles',
    subtitleColor: '#1B7A3D',
    borderColor: '#1B7A3D',
  },
  {
    key: 'eventosProximos' as const,
    label: 'Eventos próximos',
    subtitle: 'Este mes',
    subtitleColor: '#E30613',
    borderColor: '#E30613',
  },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboard()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

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
          Dashboard
        </Typography>
        <Typography sx={{ color: '#5A6A7A', fontSize: '0.95rem' }}>
          Resumen general del sistema
        </Typography>
      </Box>

      {/* KPI cards */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: '1fr 1fr',
            md: '1fr 1fr 1fr 1fr',
          },
          gap: 2,
          mb: 4,
        }}
      >
        {kpiCards.map((kpi) => (
          <Card
            key={kpi.key}
            elevation={0}
            sx={{
              borderRadius: '12px',
              border: '1px solid #E5EAF0',
              borderLeft: `4px solid ${kpi.borderColor}`,
              backgroundColor: '#FFFFFF',
            }}
          >
            <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
              <Typography
                sx={{ color: '#5A6A7A', fontSize: '0.85rem', fontWeight: 500, mb: 1 }}
              >
                {kpi.label}
              </Typography>
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: '2rem',
                  color: '#0B1A2A',
                  lineHeight: 1.1,
                  mb: 0.75,
                }}
              >
                {loading ? '—' : data?.stats[kpi.key]}
              </Typography>
              <Typography
                sx={{ color: kpi.subtitleColor, fontSize: '0.8rem', fontWeight: 500 }}
              >
                {kpi.subtitle}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Solicitudes recientes */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
        }}
      >
        <Typography
          sx={{ fontWeight: 700, fontSize: '1.15rem', color: '#0B1A2A' }}
        >
          Solicitudes recientes
        </Typography>
        <Button
          variant="text"
          onClick={() => navigate('/admin/solicitudes')}
          sx={{
            color: '#1565C0',
            textTransform: 'none',
            fontWeight: 500,
            fontSize: '0.875rem',
            '&:hover': { backgroundColor: 'transparent', textDecoration: 'underline' },
          }}
        >
          Ver todas →
        </Button>
      </Box>

      <TableContainer
        sx={{
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          border: '1px solid #E5EAF0',
          overflow: 'hidden',
          mb: 3,
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#FAFBFC' }}>
              {['Solicitud', 'Solicitante', 'Espacio', 'Fecha', 'Estado', 'Acción'].map(
                (h) => (
                  <TableCell
                    key={h}
                    sx={{
                      fontWeight: 600,
                      color: '#1A2A3A',
                      fontSize: '0.85rem',
                      borderBottom: '1px solid #E5EAF0',
                      py: 1.75,
                    }}
                  >
                    {h}
                  </TableCell>
                )
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} sx={{ textAlign: 'center', py: 4, color: '#5A6A7A' }}>
                  Cargando…
                </TableCell>
              </TableRow>
            ) : (
              data?.solicitudesRecientes.map((s) => (
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
                    {s.espacio}
                  </TableCell>
                  <TableCell sx={{ color: '#1A2A3A', fontSize: '0.875rem' }}>
                    {s.fecha}
                  </TableCell>
                  <TableCell sx={{ color: '#1A2A3A', fontSize: '0.875rem' }}>
                    {s.estado}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={s.estado}
                      size="small"
                      sx={{
                        backgroundColor: estadoStyles[s.estado]?.bg || '#F5F5F5',
                        color: estadoStyles[s.estado]?.color || '#616161',
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        height: 26,
                        borderRadius: '6px',
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Indicadores de gestión */}
      <Box
        sx={{
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          border: '1px solid #E5EAF0',
          px: 2.5,
          py: 2,
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <Box>
          <Typography sx={{ fontWeight: 600, fontSize: '0.95rem', color: '#0B1A2A', mb: 0.4 }}>
            Indicadores de gestión
          </Typography>
          <Typography sx={{ color: '#5A6A7A', fontSize: '0.85rem' }}>
            {data
              ? `${data.stats.solicitudesPendientes} solicitudes pendientes · ${data.stats.reservasHoy} reservas hoy · ${data.stats.eventosProximos} eventos próximos`
              : '—'}
          </Typography>
        </Box>
        <Button
          variant="contained"
          sx={{
            backgroundColor: '#0B3A5C',
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: '8px',
            px: 2.5,
            boxShadow: 'none',
            '&:hover': { backgroundColor: '#062A42', boxShadow: 'none' },
          }}
        >
          Ver reportes →
        </Button>
      </Box>
    </AdminLayout>
  );
}
