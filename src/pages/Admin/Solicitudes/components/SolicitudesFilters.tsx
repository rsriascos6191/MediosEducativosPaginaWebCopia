/**
 * Filtros de la pantalla Solicitudes – diseño 1:1 del prototipo.
 */

import {
  Box,
  TextField,
  Button,
  MenuItem,
  InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import type { SolicitudFilters, EstadoSolicitud } from '../interfaces/solicitudes.interface';
import {
  CAMPUS_OPTIONS,
  ESTADO_OPTIONS,
  ESPACIO_OPTIONS,
} from '../services/solicitudes.service';

interface Props {
  filters: SolicitudFilters;
  onChange: (filters: SolicitudFilters) => void;
  onFilter: () => void;
  onClear: () => void;
}

export default function SolicitudesFilters({
  filters,
  onChange,
  onFilter,
  onClear,
}: Props) {
  const handleChange =
    (field: keyof SolicitudFilters) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange({ ...filters, [field]: e.target.value });
    };

  return (
    <Box
      sx={{
        backgroundColor: '#FFFFFF',
        borderRadius: '12px',
        border: '1px solid #E5EAF0',
        p: 2,
        mb: 3,
        display: 'flex',
        flexWrap: 'wrap',
        gap: 1.5,
        alignItems: 'center',
      }}
    >
      <TextField
        size="small"
        placeholder="Código o solicitante"
        value={filters.search || ''}
        onChange={handleChange('search')}
        sx={{
          minWidth: 200,
          flex: 1,
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
            backgroundColor: '#FAFBFC',
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

      <TextField
        select
        size="small"
        label="Campus"
        value={filters.campus || ''}
        onChange={handleChange('campus')}
        sx={{
          minWidth: 140,
          '& .MuiOutlinedInput-root': { borderRadius: '8px' },
        }}
      >
        <MenuItem value="">Todos</MenuItem>
        {CAMPUS_OPTIONS.map((c) => (
          <MenuItem key={c} value={c}>
            {c}
          </MenuItem>
        ))}
      </TextField>

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
        label="Espacio"
        value={filters.espacio || ''}
        onChange={handleChange('espacio')}
        sx={{
          minWidth: 150,
          '& .MuiOutlinedInput-root': { borderRadius: '8px' },
        }}
      >
        <MenuItem value="">Todos</MenuItem>
        {ESPACIO_OPTIONS.map((e) => (
          <MenuItem key={e} value={e}>
            {e}
          </MenuItem>
        ))}
      </TextField>

      <Button
        variant="contained"
        onClick={onFilter}
        sx={{
          backgroundColor: '#0B3A5C',
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: '8px',
          px: 3,
          '&:hover': { backgroundColor: '#062A42' },
        }}
      >
        Filtrar
      </Button>

      <Button
        variant="text"
        onClick={onClear}
        sx={{
          color: '#5A6A7A',
          textTransform: 'none',
          fontWeight: 500,
        }}
      >
        Limpiar filtros
      </Button>
    </Box>
  );
}
