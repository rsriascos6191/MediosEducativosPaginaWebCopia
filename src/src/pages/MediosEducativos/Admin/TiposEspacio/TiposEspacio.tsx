/**
 * Pantalla: Admin – Tipos de espacio
 * Diseño 1:1 del prototipo de Figma.
 */

import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AdminLayout from '../../../../components/AdminLayout';
import type { TipoEspacio } from './interfaces/tiposEspacio.interface';
import { getTiposEspacio } from './services/tiposEspacio.service';

export default function TiposEspacio() {
  const [tipos, setTipos] = useState<TipoEspacio[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTiposEspacio()
      .then((res) => setTipos(res.data))
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
            Tipos de espacio
          </Typography>
          <Typography sx={{ color: '#5A6A7A', fontSize: '0.95rem' }}>
            Clasifica los espacios según su uso y capacidad
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
          Nuevo tipo
        </Button>
      </Box>

      {/* Grid de cards */}
      {loading ? (
        <Typography sx={{ color: '#5A6A7A', textAlign: 'center', py: 6 }}>
          Cargando tipos…
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
          {tipos.map((t) => (
            <Card
              key={t.id}
              elevation={0}
              sx={{
                borderRadius: '12px',
                border: '1px solid #E5EAF0',
                backgroundColor: '#FFFFFF',
              }}
            >
              <CardContent sx={{ p: 2.75 }}>
                <Typography
                  sx={{
                    fontWeight: 700,
                    fontSize: '1.1rem',
                    color: '#0B1A2A',
                    mb: 0.75,
                  }}
                >
                  {t.nombre}
                </Typography>

                <Typography
                  sx={{
                    color: '#1565C0',
                    fontSize: '0.9rem',
                    fontWeight: 500,
                    mb: 0.5,
                  }}
                >
                  {t.cantidad} espacios
                </Typography>

                <Typography
                  sx={{ color: '#5A6A7A', fontSize: '0.875rem', mb: 2 }}
                >
                  {t.descripcion}
                </Typography>

                <Button
                  variant="text"
                  sx={{
                    color: '#0B3A5C',
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
                  Gestionar →
                </Button>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </AdminLayout>
  );
}
