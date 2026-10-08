/**
 * Pantalla: Admin – Eventos institucionales
 * Hub con acceso al módulo de Ceremonias de grado.
 */

import { Box, Typography, Button, Card, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../../../components/AdminLayout';

export default function Eventos() {
  const navigate = useNavigate();

  return (
    <AdminLayout>
      <Box sx={{ mb: 3.5 }}>
        <Typography
          variant="h4"
          sx={{ fontWeight: 700, color: '#0B1A2A', fontSize: '1.75rem', mb: 0.5 }}
        >
          Eventos institucionales
        </Typography>
        <Typography sx={{ color: '#5A6A7A', fontSize: '0.95rem' }}>
          Gestiona eventos institucionales y su programación
        </Typography>
      </Box>

      <Card
        elevation={0}
        sx={{
          borderRadius: '12px',
          border: '1px solid #E5EAF0',
          backgroundColor: '#FFFFFF',
          maxWidth: 900,
        }}
      >
        <CardContent
          sx={{
            p: 3,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Box>
            <Typography
              sx={{ fontWeight: 700, fontSize: '1.15rem', color: '#0B1A2A', mb: 0.5 }}
            >
              Ceremonias de grado
            </Typography>
            <Typography sx={{ color: '#5A6A7A', fontSize: '0.9rem' }}>
              Graduandos, invitados y control de ingreso
            </Typography>
          </Box>
          <Button
            variant="contained"
            onClick={() => navigate('/admin/eventos/ceremonias')}
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
            Abrir módulo →
          </Button>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
