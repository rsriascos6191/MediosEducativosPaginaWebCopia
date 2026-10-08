/**
 * Selector de campus (tabs) – diseño 1:1 del prototipo.
 */

import { Box, Button } from '@mui/material';
import type { CampusAgenda } from '../interfaces/agenda.interface';
import { CAMPUS_TABS } from '../services/agenda.service';

interface Props {
  value: CampusAgenda;
  onChange: (campus: CampusAgenda) => void;
}

export default function CampusTabs({ value, onChange }: Props) {
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.25, mb: 2.5 }}>
      {CAMPUS_TABS.map((campus) => {
        const isActive = value === campus;
        return (
          <Button
            key={campus}
            onClick={() => onChange(campus)}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.9rem',
              px: 2.5,
              py: 0.9,
              borderRadius: '8px',
              minWidth: 100,
              border: isActive ? 'none' : '1.5px solid #0B3A5C',
              backgroundColor: isActive ? '#E30613' : '#FFFFFF',
              color: isActive ? '#FFFFFF' : '#0B3A5C',
              boxShadow: 'none',
              '&:hover': {
                backgroundColor: isActive ? '#C10510' : 'rgba(11,58,92,0.06)',
                boxShadow: 'none',
                border: isActive ? 'none' : '1.5px solid #0B3A5C',
              },
            }}
          >
            {campus}
          </Button>
        );
      })}
    </Box>
  );
}
