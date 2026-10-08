/**
 * Pantalla: Admin – Dependencias
 * Diseño 1:1 del prototipo de Figma.
 */

import { useState, useEffect, useCallback } from 'react';
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
  Card,
  CardContent,
  Pagination,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AdminLayout from '../../../../components/AdminLayout';
import type {
  Dependencia,
  DependenciaFilters,
} from './interfaces/dependencias.interface';
import {
  getDependencias,
  TIPO_OPTIONS,
  ESTADO_OPTIONS,
} from './services/dependencias.service';

const PAGE_SIZE = 5;

export default function Dependencias() {
  const [items, setItems] = useState<Dependencia[]>([]);
  const [stats, setStats] = useState({ total: 0, activas: 0, inactivas: 0 });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<DependenciaFilters>({});
  const [page, setPage] = useState(1);

  const load = useCallback(async (f?: DependenciaFilters) => {
    setLoading(true);
    try {
      const res = await getDependencias(f);
      setItems(res.data);
      setStats(res.stats);
      setPage(1);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleApply = () => load(filters);
  const handleClear = () => {
    setFilters({});
    load({});
  };

  const pageCount = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const paginated = items.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

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
            sx={{ fontWeight: 700, color: '#0B1A2A', fontSize: '1.75rem', mb: 0.5 }}
          >
            Dependencias
          </Typography>
          <Typography sx={{ color: '#5A6A7A', fontSize: '0.95rem' }}>
            Administrar las dependencias, programas, áreas y grupos registrados
            para la gestión de solicitudes.
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
          + Nueva dependencia
        </Button>
      </Box>

      {/* Stats cards */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' },
          gap: 2,
          mb: 3,
        }}
      >
        {[
          { label: 'Total de dependencias', value: stats.total },
          { label: 'Dependencias activas', value: stats.activas },
          { label: 'Dependencias inactivas', value: stats.inactivas },
        ].map((s) => (
          <Card
            key={s.label}
            elevation={0}
            sx={{
              borderRadius: '12px',
              border: '1px solid #E5EAF0',
              backgroundColor: '#FFFFFF',
            }}
          >
            <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
              <Typography sx={{ color: '#5A6A7A', fontSize: '0.85rem', mb: 0.75 }}>
                {s.label}
              </Typography>
              <Typography sx={{ fontWeight: 700, fontSize: '1.75rem', color: '#0B1A2A' }}>
                {loading ? '—' : s.value}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Filtros */}
      <Box
        sx={{
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          border: '1px solid #E5EAF0',
          p: 2.5,
          mb: 3,
        }}
      >
        <Typography sx={{ fontWeight: 600, fontSize: '0.95rem', color: '#1A2A3A', mb: 1.5 }}>
          Buscar y filtrar
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, alignItems: 'flex-end' }}>
          <TextField
            size="small"
            label="Buscar por nombre"
            placeholder="Escribe el nombre de la dependencia"
            value={filters.nombre || ''}
            onChange={(e) => setFilters({ ...filters, nombre: e.target.value })}
            sx={{
              flex: 1,
              minWidth: 220,
              '& .MuiOutlinedInput-root': { borderRadius: '8px' },
            }}
          />
          <TextField
            select
            size="small"
            label="Tipo"
            value={filters.tipo || 'Todos'}
            onChange={(e) => setFilters({ ...filters, tipo: e.target.value })}
            sx={{ minWidth: 160, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
          >
            {TIPO_OPTIONS.map((t) => (
              <MenuItem key={t} value={t}>
                {t}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            size="small"
            label="Estado"
            value={filters.estado || 'Todas'}
            onChange={(e) => setFilters({ ...filters, estado: e.target.value })}
            sx={{ minWidth: 130, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
          >
            {ESTADO_OPTIONS.map((e) => (
              <MenuItem key={e} value={e}>
                {e}
              </MenuItem>
            ))}
          </TextField>
          <Button
            variant="outlined"
            onClick={handleClear}
            sx={{
              textTransform: 'none',
              fontWeight: 500,
              borderRadius: '8px',
              borderColor: '#C5CDD8',
              color: '#5A6A7A',
            }}
          >
            Limpiar
          </Button>
          <Button
            variant="contained"
            onClick={handleApply}
            sx={{
              backgroundColor: '#0B3A5C',
              textTransform: 'none',
              fontWeight: 600,
              borderRadius: '8px',
              '&:hover': { backgroundColor: '#062A42' },
            }}
          >
            Aplicar
          </Button>
        </Box>
      </Box>

      {/* Tabla */}
      <Typography sx={{ fontWeight: 700, fontSize: '1.1rem', color: '#0B1A2A', mb: 1.5 }}>
        Listado de dependencias
      </Typography>

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
              {['Dependencia', 'Tipo', 'Estado', 'Acciones'].map((h) => (
                <TableCell
                  key={h}
                  sx={{
                    color: '#FFFFFF',
                    fontWeight: 600,
                    fontSize: '0.82rem',
                    py: 1.6,
                    borderBottom: 'none',
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
                <TableCell colSpan={4} sx={{ textAlign: 'center', py: 4, color: '#5A6A7A' }}>
                  Cargando…
                </TableCell>
              </TableRow>
            ) : (
              paginated.map((d) => (
                <TableRow
                  key={d.id}
                  sx={{
                    '&:hover': { backgroundColor: '#F8FAFC' },
                    '& td': { borderBottom: '1px solid #F0F3F7' },
                  }}
                >
                  <TableCell sx={{ fontWeight: 600, color: '#1A2A3A', fontSize: '0.9rem' }}>
                    {d.nombre}
                  </TableCell>
                  <TableCell sx={{ color: '#5A6A7A', fontSize: '0.875rem' }}>
                    {d.tipo}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={d.estado}
                      size="small"
                      sx={{
                        backgroundColor:
                          d.estado === 'Activa' ? '#E6F4EA' : '#F0F2F5',
                        color: d.estado === 'Activa' ? '#1B7A3D' : '#5A6A7A',
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        height: 26,
                        borderRadius: '6px',
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 2 }}>
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
                        Editar
                      </Button>
                      <Button
                        variant="text"
                        sx={{
                          color: d.estado === 'Activa' ? '#E30613' : '#1B7A3D',
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
                        {d.estado === 'Activa' ? 'Desactivar' : 'Activar'}
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Footer paginación */}
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
        <Typography sx={{ color: '#5A6A7A', fontSize: '0.875rem' }}>
          Mostrando {paginated.length} de {items.length} dependencias
        </Typography>
        <Pagination
          count={pageCount}
          page={page}
          onChange={(_, p) => setPage(p)}
          size="small"
          color="primary"
        />
      </Box>

      {/* Nota conservación */}
      <Box
        sx={{
          mt: 2.5,
          backgroundColor: '#FFFFFF',
          borderRadius: '10px',
          border: '1px solid #E5EAF0',
          px: 2.5,
          py: 1.75,
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <Box>
          <Typography sx={{ fontWeight: 600, fontSize: '0.9rem', color: '#0B1A2A' }}>
            Conservación de registros
          </Typography>
          <Typography sx={{ color: '#5A6A7A', fontSize: '0.85rem' }}>
            Las dependencias inactivas se conservan para mantener la trazabilidad
            histórica.
          </Typography>
        </Box>
        <Button
          variant="text"
          sx={{
            color: '#1565C0',
            textTransform: 'none',
            fontWeight: 500,
            fontSize: '0.875rem',
            '&:hover': { backgroundColor: 'transparent', textDecoration: 'underline' },
          }}
        >
          Activar o desactivar
        </Button>
      </Box>
    </AdminLayout>
  );
}
