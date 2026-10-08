/**
 * Pantalla: Ficha histórica — Ceremonia / Reserva
 * Diseño 1:1 del prototipo (Ficha histórica detalle — Ceremonia).
 * Sirve tanto para ceremonias como para reservas históricas.
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CircularProgress,
} from '@mui/material';
import AdminLayout from '../../../../components/AdminLayout';
import type { HistorialCeremonia } from './interfaces/historial.interface';
import {
  getCeremoniaById,
  getReservaHistoricaById,
} from './services/historial.service';

export default function FichaHistorica() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const isReserva = location.pathname.includes('/reserva/');
  const [ficha, setFicha] = useState<HistorialCeremonia | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    const loader = isReserva ? getReservaHistoricaById : getCeremoniaById;
    loader(id)
      .then(setFicha)
      .finally(() => setLoading(false));
  }, [id, isReserva]);

  if (loading) {
    return (
      <AdminLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress sx={{ color: '#0B3A5C' }} />
        </Box>
      </AdminLayout>
    );
  }

  if (!ficha) {
    return (
      <AdminLayout>
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography color="text.secondary">Registro no encontrado</Typography>
          <Button
            onClick={() => navigate('/admin/historial')}
            sx={{ mt: 2, textTransform: 'none' }}
          >
            Volver al historial
          </Button>
        </Box>
      </AdminLayout>
    );
  }

  const titleLabel = isReserva ? 'Reserva' : 'Ceremonia';
  const breadcrumb = isReserva
    ? 'Eventos institucionales / Reservas / Registro histórico'
    : 'Eventos institucionales / Ceremonias de grado / Registro histórico';

  const kpis = [
    { label: 'Sesiones', value: ficha.sesiones ?? '—' },
    { label: 'Programas', value: ficha.programasCount ?? '—' },
    { label: 'Graduandos', value: ficha.graduandos ?? 0, highlight: false },
    {
      label: 'Invitados',
      value: ficha.invitados ?? 0,
      highlight: true,
    },
    { label: 'Ingresos registrados', value: ficha.ingresosRegistrados ?? 0 },
  ];

  return (
    <AdminLayout>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          mb: 1.5,
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
            Ficha histórica — {titleLabel}
          </Typography>
          <Typography sx={{ color: '#5A6A7A', fontSize: '0.875rem' }}>
            {breadcrumb}
          </Typography>
        </Box>
        <Button
          variant="contained"
          sx={{
            backgroundColor: '#0B3A5C',
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: '8px',
            px: 3,
            boxShadow: 'none',
            '&:hover': { backgroundColor: '#062A42', boxShadow: 'none' },
          }}
        >
          Exportar
        </Button>
      </Box>

      {/* Código · título */}
      <Typography
        sx={{
          fontWeight: 700,
          fontSize: '1.15rem',
          color: '#0B1A2A',
          mb: 2,
        }}
      >
        {ficha.codigo} · {ficha.ceremonia}
      </Typography>

      {/* Banner fecha · espacio */}
      <Box
        sx={{
          backgroundColor: '#0B3A5C',
          borderRadius: '12px',
          px: 3,
          py: 2.25,
          mb: 2.5,
          color: '#FFFFFF',
        }}
      >
        <Typography sx={{ fontWeight: 600, fontSize: '1.05rem', mb: 0.4 }}>
          {ficha.fechaLarga || ficha.fecha}
          {ficha.espacio && ficha.espacio !== '—' ? ` · ${ficha.espacio}` : ''}
        </Typography>
        <Typography sx={{ fontSize: '0.875rem', opacity: 0.9 }}>
          {ficha.campus || '—'} · Estado: {ficha.estado}
        </Typography>
      </Box>

      {/* KPI cards */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr 1fr',
            sm: 'repeat(3, 1fr)',
            md: 'repeat(5, 1fr)',
          },
          gap: 1.5,
          mb: 2.5,
        }}
      >
        {kpis.map((k) => (
          <Card
            key={k.label}
            elevation={0}
            sx={{
              borderRadius: '10px',
              border: '1px solid #E5EAF0',
              backgroundColor: '#FFFFFF',
            }}
          >
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 }, textAlign: 'center' }}>
              <Typography
                sx={{ color: '#5A6A7A', fontSize: '0.8rem', mb: 0.5 }}
              >
                {k.label}
              </Typography>
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: '1.35rem',
                  color: k.highlight ? '#1B7A3D' : '#0B1A2A',
                }}
              >
                {k.value}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Trazabilidad histórica */}
      <Box
        sx={{
          backgroundColor: '#FFFFFF',
          borderRadius: '10px',
          border: '1px solid #E5EAF0',
          px: 2.5,
          py: 1.75,
          mb: 2.5,
        }}
      >
        <Typography
          sx={{ fontWeight: 600, fontSize: '0.9rem', color: '#0B1A2A', mb: 0.5 }}
        >
          Trazabilidad histórica
        </Typography>
        <Typography sx={{ color: '#5A6A7A', fontSize: '0.85rem' }}>
          Ceremonia → Sesiones → Programas → Graduandos → Invitados → Control de
          ingreso
        </Typography>
      </Box>

      {/* Grid 2x2 de secciones */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: 2,
          mb: 3,
        }}
      >
        {/* Sesiones */}
        <Card
          elevation={0}
          sx={{
            borderRadius: '12px',
            border: '1px solid #E5EAF0',
            backgroundColor: '#FFFFFF',
          }}
        >
          <CardContent sx={{ p: 2.5 }}>
            <Typography
              sx={{ fontWeight: 700, fontSize: '1rem', color: '#0B1A2A', mb: 0.5 }}
            >
              Sesiones de la ceremonia
            </Typography>
            <Typography sx={{ color: '#5A6A7A', fontSize: '0.85rem', mb: 2 }}>
              Consulta las sesiones históricas y sus programas asociados.
            </Typography>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 1.5,
              }}
            >
              <Typography sx={{ color: '#5A6A7A', fontSize: '0.875rem' }}>
                Sesiones registradas
              </Typography>
              <Typography sx={{ fontWeight: 600, color: '#1A2A3A' }}>
                {ficha.sesiones ?? '—'}
              </Typography>
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
              Consultar sesiones →
            </Button>
          </CardContent>
        </Card>

        {/* Graduandos e invitados */}
        <Card
          elevation={0}
          sx={{
            borderRadius: '12px',
            border: '1px solid #E5EAF0',
            backgroundColor: '#FFFFFF',
          }}
        >
          <CardContent sx={{ p: 2.5 }}>
            <Typography
              sx={{ fontWeight: 700, fontSize: '1rem', color: '#0B1A2A', mb: 0.5 }}
            >
              Graduandos e invitados
            </Typography>
            <Typography sx={{ color: '#5A6A7A', fontSize: '0.85rem', mb: 2 }}>
              Consulta la relación histórica de participantes dentro de la
              ceremonia.
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 1.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography sx={{ color: '#5A6A7A', fontSize: '0.875rem' }}>
                  Graduandos
                </Typography>
                <Typography sx={{ fontWeight: 700, fontSize: '1.1rem', color: '#0B1A2A' }}>
                  {ficha.graduandos ?? 0}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography sx={{ color: '#5A6A7A', fontSize: '0.875rem' }}>
                  Invitados
                </Typography>
                <Typography sx={{ fontWeight: 700, fontSize: '1.1rem', color: '#0B1A2A' }}>
                  {ficha.invitados ?? 0}
                </Typography>
              </Box>
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
              Consultar participantes →
            </Button>
          </CardContent>
        </Card>

        {/* Control de ingreso */}
        <Card
          elevation={0}
          sx={{
            borderRadius: '12px',
            border: '1px solid #E5EAF0',
            backgroundColor: '#FFFFFF',
          }}
        >
          <CardContent sx={{ p: 2.5 }}>
            <Typography
              sx={{ fontWeight: 700, fontSize: '1rem', color: '#0B1A2A', mb: 0.5 }}
            >
              Control de ingreso
            </Typography>
            <Typography sx={{ color: '#5A6A7A', fontSize: '0.85rem', mb: 2 }}>
              Consulta el registro histórico de ingreso conservado para la
              ceremonia.
            </Typography>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 1.5,
              }}
            >
              <Typography sx={{ color: '#5A6A7A', fontSize: '0.875rem' }}>
                Ingresos registrados
              </Typography>
              <Typography sx={{ fontWeight: 700, fontSize: '1.1rem', color: '#0B1A2A' }}>
                {ficha.ingresosRegistrados ?? 0}
              </Typography>
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
              Consultar control →
            </Button>
          </CardContent>
        </Card>

        {/* Evidencias fotográficas */}
        <Card
          elevation={0}
          sx={{
            borderRadius: '12px',
            border: '1px solid #E5EAF0',
            backgroundColor: '#FFFFFF',
          }}
        >
          <CardContent sx={{ p: 2.5 }}>
            <Typography
              sx={{ fontWeight: 700, fontSize: '1rem', color: '#0B1A2A', mb: 0.5 }}
            >
              Evidencias fotográficas
            </Typography>
            <Typography sx={{ color: '#5A6A7A', fontSize: '0.85rem', mb: 2 }}>
              Registro visual conservado como parte del historial de la ceremonia.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1.25, flexWrap: 'wrap' }}>
              {[
                'linear-gradient(135deg, #1a3a5c, #4a6fa5)',
                'linear-gradient(135deg, #2c3e50, #7f8c8d)',
                'linear-gradient(135deg, #1e3a5f, #5d8aa8)',
              ].map((bg, i) => (
                <Box
                  key={i}
                  sx={{
                    width: 88,
                    height: 64,
                    borderRadius: '8px',
                    background: bg,
                    flexShrink: 0,
                  }}
                />
              ))}
            </Box>
          </CardContent>
        </Card>
      </Box>

      <Typography sx={{ color: '#5A6A7A', fontSize: '0.85rem' }}>
        Registro histórico de consulta. La {isReserva ? 'reserva' : 'ceremonia'}{' '}
        finalizada no se edita desde esta ficha.
      </Typography>
    </AdminLayout>
  );
}
