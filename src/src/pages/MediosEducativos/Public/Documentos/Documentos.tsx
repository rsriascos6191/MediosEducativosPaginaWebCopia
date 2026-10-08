/**
 * Portal público – Documentos
 */

import { useState } from 'react';
import { Box, Typography, Button, Container, Card, CardContent, TextField, InputAdornment, Chip } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PublicLayout from '../../../../components/PublicLayout';

const CATS = ['Todos', 'Formatos de solicitud', 'Reglamentos y políticas', 'Manuales e instructivos', 'Documentos informativos'];

const DOCS = [
  { titulo: 'Formatos de solicitud', cat: 'Formatos de solicitud' },
  { titulo: 'Reglamentos y políticas', cat: 'Reglamentos y políticas' },
  { titulo: 'Manuales e instructivos', cat: 'Manuales e instructivos' },
  { titulo: 'Documentos informativos', cat: 'Documentos informativos' },
];

export default function Documentos() {
  const [cat, setCat] = useState('Todos');
  const [search, setSearch] = useState('');

  const filtered = DOCS.filter((d) => {
    if (cat !== 'Todos' && d.cat !== cat) return false;
    if (search && !d.titulo.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <PublicLayout>
      <Box sx={{
        backgroundImage: 'linear-gradient(90deg, rgba(11,58,92,0.9), rgba(11,58,92,0.7)), url(https://www.unicesmag.edu.co/recursos/uploads/2022/07/SedeCentroUCESMAG.webp)',
        backgroundSize: 'cover', backgroundPosition: 'center', py: 6,
      }}>
        <Container maxWidth="lg">
          <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', fontWeight: 600, mb: 1 }}>MEDIOS EDUCATIVOS</Typography>
          <Typography sx={{ color: '#FFFFFF', fontWeight: 800, fontSize: { xs: '2rem', md: '2.5rem' }, mb: 1 }}>Documentos</Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.85)', maxWidth: 500 }}>
            Consulta documentos y formatos relacionados con los servicios de Medios Educativos.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Search */}
        <Box sx={{
          backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5EAF0',
          p: 2, mb: 3, display: 'flex', gap: 1.5, alignItems: 'center',
        }}>
          <TextField fullWidth size="small" placeholder="Buscar por nombre o palabra clave..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: '#9AA5B5' }} /></InputAdornment> }}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
          />
          <Button variant="contained" sx={{
            backgroundColor: '#E30613', textTransform: 'none', fontWeight: 600, borderRadius: '8px', px: 3, boxShadow: 'none',
            '&:hover': { backgroundColor: '#C10510', boxShadow: 'none' },
          }}>
            Buscar
          </Button>
        </Box>

        {/* Categories */}
        <Typography sx={{ fontWeight: 600, fontSize: '0.9rem', color: '#1A2A3A', mb: 1.5 }}>Categorías</Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3.5 }}>
          {CATS.map((c) => (
            <Chip key={c} label={c} onClick={() => setCat(c)}
              sx={{
                fontWeight: 600, cursor: 'pointer',
                backgroundColor: cat === c ? '#0B3A5C' : '#FFFFFF',
                color: cat === c ? '#FFF' : '#1A2A3A',
                border: cat === c ? 'none' : '1px solid #E5EAF0',
                '&:hover': { backgroundColor: cat === c ? '#062A42' : '#F0F5FA' },
              }}
            />
          ))}
        </Box>

        <Typography sx={{ fontWeight: 700, fontSize: '1.15rem', color: '#0B1A2A', mb: 0.5 }}>Documentos disponibles</Typography>
        <Typography sx={{ color: '#5A6A7A', fontSize: '0.9rem', mb: 2.5 }}>
          Consulta las categorías disponibles y accede a la documentación.
        </Typography>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
          {filtered.map((d) => (
            <Card key={d.titulo} elevation={0} sx={{ borderRadius: '12px', border: '1px solid #E5EAF0', borderTop: '3px solid #E30613' }}>
              <CardContent sx={{ p: 2.5 }}>
                <Typography sx={{ fontWeight: 700, fontSize: '1.05rem', color: '#0B1A2A', mb: 0.5 }}>{d.titulo}</Typography>
                <Typography sx={{ color: '#5A6A7A', fontSize: '0.85rem', mb: 2 }}>Documento disponible para consulta.</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography sx={{ color: '#5A6A7A', fontSize: '0.8rem' }}>Disponible para consulta</Typography>
                  <Button variant="contained" size="small" sx={{
                    backgroundColor: '#E30613', textTransform: 'none', fontWeight: 600, borderRadius: '8px', boxShadow: 'none',
                    '&:hover': { backgroundColor: '#C10510', boxShadow: 'none' },
                  }}>
                    Ver / Descargar →
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Container>
    </PublicLayout>
  );
}
