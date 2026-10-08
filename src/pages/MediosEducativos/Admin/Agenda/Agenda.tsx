/**
 * Pantalla: Admin – Agenda por campus
 * Diseño 1:1 del prototipo de Figma (Todos / Centro / Santiago / San Damián).
 * Datos ficticios preparados para futuro enlace a API.
 */

import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
  Pagination,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import AdminLayout from '../../../../components/AdminLayout';
import CampusTabs from './components/CampusTabs';
import AgendaFilters from './components/AgendaFilters';
import AgendaTable from './components/AgendaTable';
import type {
  ReservaAgenda,
  AgendaFilters as Filters,
  CampusAgenda,
} from './interfaces/agenda.interface';
import { getAgenda } from './services/agenda.service';

const PAGE_SIZE = 7;

export default function Agenda() {
  const [reservas, setReservas] = useState<ReservaAgenda[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [campus, setCampus] = useState<CampusAgenda>('Todos');
  const [filters, setFilters] = useState<Filters>({});
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const loadData = useCallback(
    async (campusTab: CampusAgenda, currentFilters: Filters, searchText: string) => {
      setLoading(true);
      try {
        const response = await getAgenda({
          ...currentFilters,
          campus: campusTab,
          search: searchText || undefined,
        });
        setReservas(response.data);
        setTotal(response.total);
        setPage(1);
      } catch (error) {
        console.error('Error al cargar agenda:', error);
        setReservas([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    loadData(campus, filters, search);
  }, [campus]); // solo recarga al cambiar de campus; Aplicar/buscar se disparan manualmente

  const handleCampusChange = (newCampus: CampusAgenda) => {
    setCampus(newCampus);
  };

  const handleApply = () => {
    loadData(campus, filters, search);
  };

  const handleClear = () => {
    const empty: Filters = {};
    setFilters(empty);
    setSearch('');
    loadData(campus, empty, '');
  };

  const handleSearchKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      loadData(campus, filters, search);
    }
  };

  // Paginación client-side sobre el resultado filtrado
  const pageCount = Math.max(1, Math.ceil(reservas.length / PAGE_SIZE));
  const paginated = reservas.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const countLabel =
    campus === 'Todos'
      ? `${total} reservas agendadas`
      : `${total} reservas en Campus ${campus}`;

  return (
    <AdminLayout>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          mb: 2.5,
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
            Agenda por campus
          </Typography>
          <Typography sx={{ color: '#5A6A7A', fontSize: '0.95rem' }}>
            Consulta y gestiona la agenda de reservas programadas por campus y espacio.
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
          + Nueva reserva
        </Button>
      </Box>

      {/* Tabs de campus */}
      <CampusTabs value={campus} onChange={handleCampusChange} />

      {/* Filtros */}
      <AgendaFilters
        filters={filters}
        onChange={setFilters}
        onApply={handleApply}
        onClear={handleClear}
      />

      {/* Buscador + contador */}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
          alignItems: 'center',
          mb: 2.5,
        }}
      >
        <TextField
          size="small"
          placeholder="Buscar por actividad, solicitante, espacio o código de reserva"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleSearchKey}
          sx={{
            flex: 1,
            minWidth: 280,
            '& .MuiOutlinedInput-root': {
              borderRadius: '10px',
              backgroundColor: '#FFFFFF',
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#9AA5B5', fontSize: 20 }} />
              </InputAdornment>
            ),
          }}
        />
        <Typography
          sx={{
            color: '#1565C0',
            fontWeight: 600,
            fontSize: '0.9rem',
            whiteSpace: 'nowrap',
          }}
        >
          {countLabel}
        </Typography>
      </Box>

      {/* Tabla */}
      <AgendaTable reservas={paginated} loading={loading} />

      {/* Footer: contador + paginación + exportar */}
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
          Mostrando {paginated.length} de {total} reservas agendadas
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Pagination
            count={pageCount}
            page={page}
            onChange={(_, p) => setPage(p)}
            size="small"
            color="primary"
            sx={{
              '& .MuiPaginationItem-root': {
                fontWeight: 500,
              },
            }}
          />
          <Button
            variant="outlined"
            sx={{
              textTransform: 'none',
              fontWeight: 500,
              borderRadius: '8px',
              borderColor: '#C5CDD8',
              color: '#1A2A3A',
              px: 2,
              '&:hover': {
                borderColor: '#0B3A5C',
                backgroundColor: 'rgba(11,58,92,0.04)',
              },
            }}
          >
            Exportar agenda
          </Button>
        </Box>
      </Box>

      {/* Leyenda de estados */}
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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
          <Typography sx={{ color: '#5A6A7A', fontSize: '0.85rem', fontWeight: 500 }}>
            Estados:
          </Typography>
          {[
            { label: 'Aprobada', bg: '#E6F4EA', color: '#1B7A3D' },
            { label: 'Activa', bg: '#E8F5E9', color: '#2E7D32' },
            { label: 'Pendiente', bg: '#FFF4E5', color: '#B76E00' },
            { label: 'Bloqueado', bg: '#F0F2F5', color: '#5A6A7A' },
          ].map((s) => (
            <Box
              key={s.label}
              sx={{
                backgroundColor: s.bg,
                color: s.color,
                fontWeight: 600,
                fontSize: '0.75rem',
                px: 1.5,
                py: 0.4,
                borderRadius: '6px',
              }}
            >
              {s.label}
            </Box>
          ))}
        </Box>
        <Typography sx={{ color: '#5A6A7A', fontSize: '0.85rem' }}>
          Selecciona “Ver detalle” para consultar la solicitud asociada.
        </Typography>
      </Box>
    </AdminLayout>
  );
}
