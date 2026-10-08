/**
 * Pantalla: Admin – Historial
 * Selector: Historial de reservas | Historial de ceremonias
 * Diseño 1:1 del prototipo de Figma.
 */

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  TextField,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import AdminLayout from '../../../../components/AdminLayout';
import type {
  TipoHistorial,
  HistorialReserva,
  HistorialCeremonia,
  HistorialFilters,
} from './interfaces/historial.interface';
import {
  getHistorialReservas,
  getHistorialCeremonias,
  ANIO_OPTIONS,
  MES_OPTIONS,
  MES_LABELS,
  PROGRAMA_OPTIONS,
} from './services/historial.service';

export default function Historial() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<TipoHistorial>('reservas');
  const [reservas, setReservas] = useState<HistorialReserva[]>([]);
  const [ceremonias, setCeremonias] = useState<HistorialCeremonia[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<HistorialFilters>({});

  const load = useCallback(async (tipo: TipoHistorial, f?: HistorialFilters) => {
    setLoading(true);
    try {
      if (tipo === 'reservas') {
        const res = await getHistorialReservas(f);
        setReservas(res.data);
        setTotal(res.total);
      } else {
        const res = await getHistorialCeremonias(f);
        setCeremonias(res.data);
        setTotal(res.total);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(tab, filters);
  }, [tab]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleBuscar = () => load(tab, filters);
  const handleLimpiar = () => {
    setFilters({});
    load(tab, {});
  };

  const handleTabChange = (nuevo: TipoHistorial) => {
    setTab(nuevo);
    setFilters({});
  };

  const isReservas = tab === 'reservas';
  const title = isReservas ? 'Historial de reservas' : 'Historial de ceremonias';
  const subtitle = isReservas
    ? 'Consulta y exporta el historial de solicitudes y reservas gestionadas.'
    : 'Consulta y gestiona el repositorio histórico de ceremonias finalizadas.';

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
            {title}
          </Typography>
          <Typography sx={{ color: '#5A6A7A', fontSize: '0.95rem' }}>
            {subtitle}
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
            py: 1.1,
            boxShadow: 'none',
            '&:hover': { backgroundColor: '#062A42', boxShadow: 'none' },
          }}
        >
          Exportar
        </Button>
      </Box>

      {/* Menú selector – encima de Consultar historial */}
      <Box
        sx={{
          display: 'flex',
          mb: 2.5,
          borderRadius: '10px',
          overflow: 'hidden',
          border: '1px solid #E5EAF0',
          backgroundColor: '#FFFFFF',
        }}
      >
        {(
          [
            { key: 'reservas' as const, label: 'Historial de reservas' },
            { key: 'ceremonias' as const, label: 'Historial de ceremonias' },
          ] as const
        ).map((t) => {
          const active = tab === t.key;
          return (
            <Button
              key={t.key}
              onClick={() => handleTabChange(t.key)}
              sx={{
                flex: 1,
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.9rem',
                py: 1.4,
                borderRadius: 0,
                backgroundColor: active ? '#0B3A5C' : 'transparent',
                color: active ? '#FFFFFF' : '#1A2A3A',
                '&:hover': {
                  backgroundColor: active ? '#062A42' : 'rgba(11,58,92,0.04)',
                },
              }}
            >
              {t.label}
            </Button>
          );
        })}
      </Box>

      {/* Consultar historial – filtros */}
      <Box
        sx={{
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          border: '1px solid #E5EAF0',
          p: 2.5,
          mb: 2.5,
        }}
      >
        <Typography
          sx={{ fontWeight: 600, fontSize: '0.95rem', color: '#1A2A3A', mb: 1.75 }}
        >
          Consultar historial
        </Typography>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 1.5,
            alignItems: 'flex-end',
          }}
        >
          <TextField
            select
            size="small"
            label="Año"
            value={filters.anio || 'Todos'}
            onChange={(e) => setFilters({ ...filters, anio: e.target.value })}
            sx={{ minWidth: 120, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
          >
            {ANIO_OPTIONS.map((a) => (
              <MenuItem key={a} value={a}>
                {a}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            size="small"
            label="Mes"
            value={filters.mes || 'Todos'}
            onChange={(e) => setFilters({ ...filters, mes: e.target.value })}
            sx={{ minWidth: 130, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
          >
            {MES_OPTIONS.map((m) => (
              <MenuItem key={m} value={m}>
                {MES_LABELS[m] || m}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            size="small"
            label="Programa"
            value={filters.programa || 'Todos los programas'}
            onChange={(e) => setFilters({ ...filters, programa: e.target.value })}
            sx={{ minWidth: 180, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
          >
            {PROGRAMA_OPTIONS.map((p) => (
              <MenuItem key={p} value={p}>
                {p}
              </MenuItem>
            ))}
          </TextField>

          {!isReservas && (
            <TextField
              size="small"
              label="Código de ceremonia"
              placeholder="Buscar por código"
              value={filters.codigo || ''}
              onChange={(e) => setFilters({ ...filters, codigo: e.target.value })}
              sx={{ minWidth: 160, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
            />
          )}

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
          <Button
            variant="text"
            onClick={handleLimpiar}
            sx={{
              color: '#5A6A7A',
              textTransform: 'none',
              fontWeight: 500,
            }}
          >
            Limpiar filtros
          </Button>
        </Box>
      </Box>

      {/* Contador de resultados */}
      <Typography
        sx={{ fontWeight: 600, fontSize: '0.95rem', color: '#1A2A3A', mb: 1.5 }}
      >
        {loading ? '…' : `${total} resultados encontrados`}
      </Typography>

      {/* Tabla */}
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
              {(isReservas
                ? ['Código', 'Fecha', 'Programa', 'Espacio', 'Estado', 'Acciones']
                : ['Código', 'Ceremonia', 'Fecha', 'Programas', 'Estado', 'Acciones']
              ).map((h) => (
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
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} sx={{ textAlign: 'center', py: 4, color: '#5A6A7A' }}>
                  Cargando…
                </TableCell>
              </TableRow>
            ) : isReservas ? (
              reservas.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} sx={{ textAlign: 'center', py: 4, color: '#5A6A7A' }}>
                    No se encontraron registros.
                  </TableCell>
                </TableRow>
              ) : (
                reservas.map((r) => (
                  <TableRow
                    key={r.id}
                    sx={{
                      '&:hover': { backgroundColor: '#F8FAFC' },
                      '& td': { borderBottom: '1px solid #F0F3F7' },
                    }}
                  >
                    <TableCell sx={{ fontWeight: 600, color: '#1A2A3A', fontSize: '0.875rem' }}>
                      {r.codigo}
                    </TableCell>
                    <TableCell sx={{ color: '#1A2A3A', fontSize: '0.875rem' }}>
                      {r.fecha}
                    </TableCell>
                    <TableCell sx={{ color: '#5A6A7A', fontSize: '0.875rem' }}>
                      {r.programa ?? '—'}
                    </TableCell>
                    <TableCell sx={{ color: '#5A6A7A', fontSize: '0.875rem' }}>
                      {r.espacio ?? '—'}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={r.estado}
                        size="small"
                        sx={{
                          backgroundColor: '#E3F2FD',
                          color: '#1565C0',
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
                        onClick={() =>
                          navigate(`/admin/historial/reserva/${r.id}`)
                        }
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
                ))
              )
            ) : ceremonias.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} sx={{ textAlign: 'center', py: 4, color: '#5A6A7A' }}>
                  No se encontraron registros.
                </TableCell>
              </TableRow>
            ) : (
              ceremonias.map((c) => (
                <TableRow
                  key={c.id}
                  sx={{
                    '&:hover': { backgroundColor: '#F8FAFC' },
                    '& td': { borderBottom: '1px solid #F0F3F7' },
                  }}
                >
                  <TableCell sx={{ fontWeight: 600, color: '#1A2A3A', fontSize: '0.875rem' }}>
                    {c.codigo}
                  </TableCell>
                  <TableCell sx={{ color: '#1A2A3A', fontSize: '0.875rem' }}>
                    {c.ceremonia}
                  </TableCell>
                  <TableCell sx={{ color: '#1A2A3A', fontSize: '0.875rem' }}>
                    {c.fecha}
                  </TableCell>
                  <TableCell sx={{ color: '#1A2A3A', fontSize: '0.875rem' }}>
                    {c.programa}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={c.estado}
                      size="small"
                      sx={{
                        backgroundColor: '#E6F4EA',
                        color: '#1B7A3D',
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
                      onClick={() =>
                        navigate(`/admin/historial/ceremonia/${c.id}`)
                      }
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
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Footer */}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          mt: 2,
          gap: 2,
        }}
      >
        <Typography sx={{ color: '#5A6A7A', fontSize: '0.85rem' }}>
          Los registros históricos se conservan para consulta y no se editan desde
          este repositorio.
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography sx={{ color: '#5A6A7A', fontSize: '0.85rem' }}>
            1–{total} de {total}
          </Typography>
          <IconButton size="small" disabled>
            <ChevronLeftIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" disabled>
            <ChevronRightIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>
    </AdminLayout>
  );
}
