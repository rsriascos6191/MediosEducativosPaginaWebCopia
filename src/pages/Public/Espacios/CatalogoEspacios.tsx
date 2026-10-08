/**
 * Portal público – Catálogo de espacios
 */

import { useState } from 'react';
import { Box, Typography, Button, Container, TextField, MenuItem, Card, CardContent, Pagination } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PublicLayout from '../../../../components/PublicLayout';

const ESPACIOS = [
  { id: '1', nombre: 'Auditorio', tipo: 'AUDITORIO', capacidad: '200 personas', campus: 'Campus Centro', img: 'https://www.unicesmag.edu.co/recursos/uploads/2024/02/bienvenida-consultorio-I-2-1.jpg' },
  { id: '2', nombre: 'Aula', tipo: 'AULA', capacidad: '40 personas', campus: 'Campus Centro', img: 'https://www.unicesmag.edu.co/recursos/uploads/2023/06/Difusion-VBG-03.jpg' },
  { id: '3', nombre: 'Laboratorio', tipo: 'LABORATORIO', capacidad: '30 personas', campus: 'Campus Centro', img: 'https://www.unicesmag.edu.co/recursos/uploads/2022/11/Aula-Mac-01-scaled.jpg' },
  { id: '4', nombre: 'Sala de reuniones', tipo: 'SALA DE REUNIONES', capacidad: '20 personas', campus: 'Campus Centro', img: 'https://www.unicesmag.edu.co/recursos/uploads/2022/11/Aula-Informatica-02-1-scaled.jpg' },
  { id: '5', nombre: 'Espacio especializado', tipo: 'ESPACIO ESPECIALIZADO', capacidad: 'según configuración', campus: 'Campus Centro', img: 'https://www.unicesmag.edu.co/recursos/uploads/2025/04/LabVivo-2025-02.webp' },
  { id: '6', nombre: 'Otros espacios', tipo: 'OTROS ESPACIOS', capacidad: 'Consulta disponibilidad', campus: 'Campus Centro', img: 'https://www.unicesmag.edu.co/recursos/uploads/2025/04/San-Damian-2025-06-scaled.webp' },
  { id: '7', nombre: 'Piscinas / espacios deportivos', tipo: 'PISCINAS / ESPACIOS DEPORTIVOS', capacidad: 'Consulta disponibilidad', campus: '', img: 'https://www.unicesmag.edu.co/recursos/uploads/2025/04/San-Damian-2025-06-scaled.webp' },
  { id: '8', nombre: 'Otros espacios', tipo: 'OTROS ESPACIOS', capacidad: 'Consulta disponibilidad', campus: '', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSsCm03yHUldH43ZISl04Lry8cKXHVs_ZUJtaEry09zBanMxKHiSejF9x4&s=10' },
];

export default function CatalogoEspacios() {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState('');
  const [campus, setCampus] = useState('');
  const [tipo, setTipo] = useState('');
  const [page, setPage] = useState(1);

  const filtered = ESPACIOS.filter((e) => {
    if (nombre && !e.nombre.toLowerCase().includes(nombre.toLowerCase())) return false;
    if (campus && !e.campus.toLowerCase().includes(campus.toLowerCase())) return false;
    if (tipo && !e.tipo.toLowerCase().includes(tipo.toLowerCase())) return false;
    return true;
  });

  return (
    <PublicLayout>
      <Box sx={{ backgroundColor: '#0B3A5C', py: 5 }}>
        <Container maxWidth="lg">
          <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', fontWeight: 600, mb: 1 }}>ESPACIOS CESMAG</Typography>
          <Typography sx={{ color: '#FFFFFF', fontWeight: 800, fontSize: { xs: '2rem', md: '2.5rem' }, mb: 1 }}>
            Catálogo de espacios
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.8)' }}>
            Encuentra el espacio ideal, revisa sus características y consulta su disponibilidad.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Filters */}
        <Box sx={{
          backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5EAF0',
          p: 2.5, mb: 3.5, boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
        }}>
          <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', color: '#0B1A2A', mb: 1.5 }}>
            ENCUENTRA EL ESPACIO QUE NECESITAS · Buscar y filtrar espacios
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, alignItems: 'center' }}>
            <TextField size="small" placeholder="Buscar espacio..." value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              sx={{ flex: 1, minWidth: 160, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }} />
            <TextField select size="small" label="Campus" value={campus}
              onChange={(e) => setCampus(e.target.value)}
              sx={{ minWidth: 150, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}>
              <MenuItem value="">Seleccionar campus</MenuItem>
              <MenuItem value="Centro">Campus Centro</MenuItem>
              <MenuItem value="San">Campus San Damián</MenuItem>
              <MenuItem value="Santiago">Campus Santiago</MenuItem>
            </TextField>
            <TextField select size="small" label="Tipo de espacio" value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              sx={{ minWidth: 150, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}>
              <MenuItem value="">Seleccionar tipo</MenuItem>
              <MenuItem value="auditorio">Auditorio</MenuItem>
              <MenuItem value="aula">Aula</MenuItem>
              <MenuItem value="laboratorio">Laboratorio</MenuItem>
            </TextField>
            <Button variant="contained" sx={{
              backgroundColor: '#E30613', textTransform: 'none', fontWeight: 700, borderRadius: '8px', px: 3, boxShadow: 'none',
              '&:hover': { backgroundColor: '#C10510', boxShadow: 'none' },
            }}>
              BUSCAR
            </Button>
          </Box>
          <Button onClick={() => { setNombre(''); setCampus(''); setTipo(''); }}
            sx={{ color: '#5A6A7A', textTransform: 'none', fontSize: '0.85rem', mt: 1 }}>
            Limpiar filtros
          </Button>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography sx={{ fontWeight: 600, fontSize: '0.9rem', color: '#5A6A7A' }}>ESPACIOS DISPONIBLES</Typography>
          <Typography sx={{ color: '#5A6A7A', fontSize: '0.85rem' }}>
            Mostrando 1–{filtered.length} de {filtered.length} espacios
          </Typography>
        </Box>

        {filtered.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <Typography sx={{ fontWeight: 700, color: '#0B1A2A', mb: 1 }}>No encontramos espacios con estos criterios.</Typography>
            <Typography sx={{ color: '#5A6A7A', mb: 2 }}>Prueba modificando los filtros de búsqueda.</Typography>
            <Button variant="contained" onClick={() => { setNombre(''); setCampus(''); setTipo(''); }}
              sx={{ backgroundColor: '#0B3A5C', textTransform: 'none', borderRadius: '8px' }}>
              Limpiar filtros
            </Button>
          </Box>
        ) : (
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 2 }}>
            {filtered.map((e) => (
              <Card key={e.id} elevation={0} sx={{ borderRadius: '12px', border: '1px solid #E5EAF0', overflow: 'hidden' }}>
                <Box component="img" src={e.img} alt={e.nombre} sx={{ width: '100%', height: 140, objectFit: 'cover' }} />
                <CardContent sx={{ p: 2 }}>
                  <Typography sx={{ color: '#5A6A7A', fontSize: '0.7rem', fontWeight: 600, letterSpacing: 0.5, mb: 0.3 }}>
                    {e.tipo}
                  </Typography>
                  <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: '#0B1A2A', mb: 0.5 }}>{e.nombre}</Typography>
                  <Typography sx={{ color: '#5A6A7A', fontSize: '0.8rem', mb: 1.5 }}>
                    Capacidad {e.capacidad}{e.campus ? ` · ${e.campus}` : ''}
                  </Typography>
                  <Button onClick={() => navigate(`/espacios/${e.id}`)}
                    sx={{ color: '#E30613', textTransform: 'none', fontWeight: 600, fontSize: '0.85rem', p: 0 }}>
                    Ver espacio →
                  </Button>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination count={8} page={page} onChange={(_, p) => setPage(p)} color="primary"
            sx={{ '& .Mui-selected': { backgroundColor: '#E30613 !important', color: '#FFF' } }} />
        </Box>
      </Container>
    </PublicLayout>
  );
}
