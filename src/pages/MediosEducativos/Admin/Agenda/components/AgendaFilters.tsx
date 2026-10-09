/**
 * Filtros de agenda – diseño 1:1 del prototipo.
 */

import {
  Box,
  TextField,
  Button,
  MenuItem,
  Typography,
} from '@mui/material';
import type { AgendaFilters, EstadoReserva } from '../interfaces/agenda.interface';
import {
  ESTADO_OPTIONS,
  TIPO_ESPACIO_OPTIONS,
  ESPACIO_OPTIONS,
} from '../services/agenda.service';

interface Props {
  filters: AgendaFilters;
  onChange: (filters: AgendaFilters) => void;
  onApply: () => void;
  onClear: () => void;
}

export default function AgendaFilters({
  filters,
  onChange,
  onApply,
  onClear,
}: Props) {
  const handleChange =
    (field: keyof AgendaFilters) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange({ ...filters, [field]: e.target.value });
    };

  return (
    <Box
      sx={{
        backgroundColor: '#FFFFFF',
        borderRadius: '12px',
        border: '1px solid #E5EAF0',
        p: 2.5,
        mb: 2,
      }}
    >
      <Typography
        sx={{
          fontWeight: 600,
          fontSize: '0.95rem',
          color: '#1A2A3A',
          mb: 2,
        }}
      >
        Filtros de agenda
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
          size="small"
          type="date"
          label="Fecha"
          value={filters.fecha || ''}
          onChange={handleChange('fecha')}
          InputLabelProps={{ shrink: true }}
          sx={{
            minWidth: 150,
            '& .MuiOutlinedInput-root': { borderRadius: '8px' },
          }}
        />

        <TextField
          select
          size="small"
          label="Tipo de espacio"
          value={filters.tipoEspacio || 'Todos'}
          onChange={handleChange('tipoEspacio')}
          sx={{
            minWidth: 160,
            '& .MuiOutlinedInput-root': { borderRadius: '8px' },
          }}
        >
          {TIPO_ESPACIO_OPTIONS.map((t) => (
            <MenuItem key={t} value={t}>
              {t}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          size="small"
          label="Espacio"
          value={filters.espacio || 'Todos'}
          onChange={handleChange('espacio')}
          sx={{
            minWidth: 180,
            '& .MuiOutlinedInput-root': { borderRadius: '8px' },
          }}
        >
          {ESPACIO_OPTIONS.map((e) => (
            <MenuItem key={e} value={e}>
              {e}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          size="small"
          label="Estado"
          value={filters.estado || ''}
          onChange={handleChange('estado')}
          sx={{
            minWidth: 140,
            '& .MuiOutlinedInput-root': { borderRadius: '8px' },
          }}
        >
          <MenuItem value="">Todos</MenuItem>
          {ESTADO_OPTIONS.map((e) => (
            <MenuItem key={e} value={e}>
              {e}
            </MenuItem>
          ))}
        </TextField>

        <Box sx={{ display: 'flex', gap: 1, ml: 'auto' }}>
          <Button
            variant="contained"
            onClick={onApply}
            sx={{
              backgroundColor: '#0B3A5C',
              textTransform: 'none',
              fontWeight: 600,
              borderRadius: '8px',
              px: 3,
              '&:hover': { backgroundColor: '#062A42' },
            }}
          >
            Aplicar
          </Button>
          <Button
            variant="outlined"
            onClick={onClear}
            sx={{
              textTransform: 'none',
              fontWeight: 500,
              borderRadius: '8px',
              borderColor: '#C5CDD8',
              color: '#5A6A7A',
              px: 2.5,
              '&:hover': {
                borderColor: '#9AA5B5',
                backgroundColor: 'rgba(0,0,0,0.02)',
              },
            }}
          >
            Limpiar
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
