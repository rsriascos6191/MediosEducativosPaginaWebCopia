/**
 * Pantalla: Admin – Gestión de campus
 * Diseño 1:1 del prototipo de Figma.
 */

import { useState, useEffect } from 'react';
import { Box, Typography, Button, Chip, Card, CardContent } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AdminLayout from '../../../../components/AdminLayout';
import type { Campus as CampusType } from './interfaces/campus.interface';
import { getCampus } from './services/campus.service';

export default function Campus() {
  const [campusList, setCampusList] = useState<CampusType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getCampus()
      .then((res) => setCampusList(res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminLayout>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          mb: 3.5,
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
            Gestión de campus
          </Typography>
          <Typography sx={{ color: '#5A6A7A', fontSize: '0.95rem' }}>
            Administra las sedes donde se encuentran los espacios
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
          Nuevo campus
        </Button>
      </Box>

      {/* Cards de campus */}
      {loading ? (
        <Typography sx={{ color: '#5A6A7A', textAlign: 'center', py: 6 }}>
          Cargando campus…
        </Typography>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: '1fr 1fr',
              md: '1fr 1fr 1fr',
            },
            gap: 2.5,
          }}
        >
          {campusList.map((c) => (
            <Card
              key={c.id}
              elevation={0}
              sx={{
                borderRadius: '12px',
                border: '1px solid #E5EAF0',
                overflow: 'hidden',
                backgroundColor: '#FFFFFF',
              }}
            >
              {/* Barra roja superior */}
              <Box sx={{ height: 4, backgroundColor: '#E30613' }} />

              <CardContent sx={{ p: 2.5 }}>
                <Typography
                  sx={{
                    fontWeight: 700,
                    fontSize: '1.1rem',
                    color: '#0B1A2A',
                    mb: 0.75,
                  }}
                >
                  {c.nombre}
                </Typography>

                <Typography
                  sx={{ color: '#5A6A7A', fontSize: '0.875rem', mb: 2 }}
                >
                  {c.ciudad} · {c.cantidadEspacios} espacios
                </Typography>

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
                    mb: 2,
                  }}
                />

                <Box>
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
                    Editar campus →
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </AdminLayout>
  );
}
