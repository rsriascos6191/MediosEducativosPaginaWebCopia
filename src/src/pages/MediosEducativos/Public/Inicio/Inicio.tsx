/**
 * Portal público – Inicio (Desktop)
 * Diseño 1:1 del prototipo.
 */

import { Box, Typography, Button, Container, TextField, MenuItem, Card, CardContent, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PublicLayout from '../../../../components/PublicLayout';

const BANNER = 'https://www.unicesmag.edu.co/recursos/uploads/2022/07/SedeCentroUCESMAG.webp';
const IMG_AUDITORIOS = 'https://www.unicesmag.edu.co/recursos/uploads/2024/02/bienvenida-consultorio-I-2-1.jpg';
const IMG_AULAS = 'https://www.unicesmag.edu.co/recursos/uploads/2023/06/Difusion-VBG-03.jpg';
const IMG_SALAS = 'https://www.unicesmag.edu.co/recursos/uploads/2022/11/Aula-Mac-01-scaled.jpg';
const IMG_PISCINAS = 'https://www.unicesmag.edu.co/recursos/uploads/2025/04/San-Damian-2025-06-scaled.webp';
const IMG_QUIENES = 'https://www.unicesmag.edu.co/recursos/uploads/2025/11/Nuevos-Programas-Unicesmag-2025.webp';

const DESTACADOS = [
  { titulo: 'Auditorios', desc: 'Capacidad desde 50 hasta 500 personas', img: IMG_AUDITORIOS },
  { titulo: 'Aulas de clases', desc: 'Capacidad de 20 hasta 60 personas', img: IMG_AULAS },
  { titulo: 'Salas especiales', desc: 'Equipos audiovisuales y tecnología', img: IMG_SALAS },
  { titulo: 'Piscinas', desc: 'Espacios deportivos y recreativos', img: IMG_PISCINAS },
];

const SERVICIOS = [
  { titulo: 'Espacios académicos', img: IMG_AUDITORIOS },
  { titulo: 'Recursos tecnológicos', img: IMG_SALAS },
  { titulo: 'Préstamo de equipos', img: 'https://www.unicesmag.edu.co/recursos/uploads/2022/11/Aula-Informatica-02-1-scaled.jpg' },
  { titulo: 'Apoyo audiovisual', img: 'https://www.unicesmag.edu.co/recursos/uploads/2025/04/LabVivo-2025-02.webp' },
  { titulo: 'Reservas de espacios', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSsCm03yHUldH43ZISl04Lry8cKXHVs_ZUJtaEry09zBanMxKHiSejF9x4&s=10' },
  { titulo: 'Otros servicios', img: IMG_PISCINAS },
];

const DOCS = [
  'Reglamento de Medios Educativos',
  'Guía Logística de Grados',
  'Guía de Laboratorio',
  'Manual de buenas prácticas de laboratorio de Física',
  'Manual de buenas prácticas de laboratorio de Electrónica',
  'Manual de buenas prácticas de laboratorio VIVO',
];

export default function Inicio() {
  const navigate = useNavigate();

  return (
    <PublicLayout>
      {/* Hero */}
      <Box sx={{
        position: 'relative', minHeight: 420,
        backgroundImage: `linear-gradient(90deg, rgba(11,26,42,0.85) 0%, rgba(11,26,42,0.4) 60%), url(${BANNER})`,
        backgroundSize: 'cover', backgroundPosition: 'center',
        display: 'flex', alignItems: 'center',
      }}>
        <Container maxWidth="lg">
          <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem', fontWeight: 600, letterSpacing: 1, mb: 1 }}>
            RESERVA DE ESPACIOS
          </Typography>
          <Typography sx={{ color: '#FFFFFF', fontWeight: 800, fontSize: { xs: '2rem', md: '2.75rem' }, lineHeight: 1.15, mb: 1.5, maxWidth: 520 }}>
            MEDIOS EDUCATIVOS
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.85)', fontSize: '1rem', maxWidth: 480, mb: 3 }}>
            En la Universidad CESMAG ponemos a tu disposición nuestros espacios para que tus ideas, proyectos y actividades se hagan realidad.
          </Typography>
          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
            <Button variant="contained" onClick={() => navigate('/espacios')}
              sx={{ backgroundColor: '#E30613', textTransform: 'none', fontWeight: 600, borderRadius: '8px', px: 3, py: 1.2, boxShadow: 'none',
                '&:hover': { backgroundColor: '#C10510', boxShadow: 'none' } }}>
              Explorar espacios →
            </Button>
            <Button variant="outlined" onClick={() => navigate('/disponibilidad')}
              sx={{ borderColor: '#FFFFFF', color: '#FFFFFF', textTransform: 'none', fontWeight: 600, borderRadius: '8px', px: 3, py: 1.2,
                '&:hover': { borderColor: '#FFFFFF', backgroundColor: 'rgba(255,255,255,0.1)' } }}>
              Consultar disponibilidad
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Buscador */}
      <Container maxWidth="lg" sx={{ mt: -3, position: 'relative', zIndex: 2, mb: 5 }}>
        <Box sx={{
          backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5EAF0',
          p: 2.5, display: 'flex', flexWrap: 'wrap', gap: 1.5, alignItems: 'flex-end', boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        }}>
          <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', color: '#0B1A2A', width: '100%', mb: 0.5 }}>
            Buscar espacios
          </Typography>
          {[
            { label: 'Tipo de espacio', opts: ['Auditorio', 'Aula', 'Laboratorio'] },
            { label: 'Campus', opts: ['Centro', 'San Damián', 'Santiago'] },
            { label: 'Fecha', opts: [] },
            { label: 'Hora', opts: ['07:00', '08:00', '09:00', '10:00'] },
          ].map((f) => (
            <TextField key={f.label} select={f.opts.length > 0} size="small" label={f.label}
              type={f.label === 'Fecha' ? 'date' : undefined}
              InputLabelProps={f.label === 'Fecha' ? { shrink: true } : undefined}
              sx={{ minWidth: 140, flex: 1, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}>
              {f.opts.map((o) => <MenuItem key={o} value={o}>{o}</MenuItem>)}
            </TextField>
          ))}
          <Button variant="contained" onClick={() => navigate('/espacios')}
            sx={{ backgroundColor: '#E30613', textTransform: 'none', fontWeight: 600, borderRadius: '8px', px: 3, py: 1.1, boxShadow: 'none',
              '&:hover': { backgroundColor: '#C10510', boxShadow: 'none' } }}>
            Buscar
          </Button>
        </Box>
      </Container>

      {/* Agenda diaria */}
      <Container maxWidth="lg" sx={{ mb: 5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
          <Box>
            <Typography sx={{ fontWeight: 700, fontSize: '1.35rem', color: '#0B1A2A' }}>Agenda diaria</Typography>
            <Typography sx={{ color: '#5A6A7A', fontSize: '0.9rem' }}>Consulta la programación y disponibilidad de nuestros espacios.</Typography>
          </Box>
          <Chip label="HOY · 11 SEP 2026" sx={{ fontWeight: 600, backgroundColor: '#E3F2FD', color: '#1565C0' }} />
        </Box>
        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
          {['Campus Centro', 'Campus San Damián', 'Campus Santiago'].map((c, i) => (
            <Chip key={c} label={c} variant={i === 0 ? 'filled' : 'outlined'}
              sx={{ fontWeight: 600, backgroundColor: i === 0 ? '#0B3A5C' : 'transparent', color: i === 0 ? '#FFF' : '#1A2A3A', borderColor: '#C5CDD8' }} />
          ))}
        </Box>
        <Box sx={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5EAF0', p: 2, overflowX: 'auto' }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: '80px repeat(6, 1fr)', gap: 0.75, minWidth: 600 }}>
            <Typography sx={{ fontWeight: 600, fontSize: '0.75rem', color: '#5A6A7A' }}>Hora</Typography>
            {['Auditorio', 'Aulas de clases', 'Laboratorio', 'Sala de reuniones', 'Espacio especializado', 'Piscinas'].map((h) => (
              <Typography key={h} sx={{ fontWeight: 600, fontSize: '0.7rem', color: '#5A6A7A', textAlign: 'center' }}>{h}</Typography>
            ))}
            {['7:00', '8:00', '9:00', '10:00', '11:00'].map((hora) => (
              <>
                <Typography key={hora} sx={{ fontSize: '0.8rem', color: '#1A2A3A', fontWeight: 500, alignSelf: 'center' }}>{hora}</Typography>
                {Array.from({ length: 6 }).map((_, i) => {
                  const estados = ['Disponible', 'Aprobada', 'Activa', 'Pendiente', 'Bloqueado', 'Cancelada'];
                  const e = estados[(i + hora.charCodeAt(0)) % estados.length];
                  const colors: Record<string, { bg: string; c: string }> = {
                    Disponible: { bg: '#E6F4EA', c: '#1B7A3D' },
                    Aprobada: { bg: '#E3F2FD', c: '#1565C0' },
                    Activa: { bg: '#E8F5E9', c: '#2E7D32' },
                    Pendiente: { bg: '#FFF4E5', c: '#B76E00' },
                    Bloqueado: { bg: '#FFEBEE', c: '#C62828' },
                    Cancelada: { bg: '#F5F5F5', c: '#757575' },
                  };
                  return (
                    <Chip key={`${hora}-${i}`} label={e} size="small"
                      sx={{ backgroundColor: colors[e].bg, color: colors[e].c, fontWeight: 600, fontSize: '0.65rem', height: 22, borderRadius: '4px' }} />
                  );
                })}
              </>
            ))}
          </Box>
        </Box>
        <Button onClick={() => navigate('/disponibilidad')} sx={{ mt: 1.5, color: '#1565C0', textTransform: 'none', fontWeight: 500 }}>
          Consultar disponibilidad →
        </Button>
      </Container>

      {/* Espacios destacados */}
      <Container maxWidth="lg" sx={{ mb: 6 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2.5 }}>
          <Box>
            <Typography sx={{ fontWeight: 700, fontSize: '1.35rem', color: '#0B1A2A' }}>Espacios destacados</Typography>
            <Typography sx={{ color: '#5A6A7A', fontSize: '0.9rem' }}>Encuentra auditorios, aulas, salas especiales y espacios deportivos.</Typography>
          </Box>
          <Button onClick={() => navigate('/espacios')} sx={{ color: '#1565C0', textTransform: 'none', fontWeight: 500 }}>
            Ver todos los espacios →
          </Button>
        </Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 2 }}>
          {DESTACADOS.map((d) => (
            <Card key={d.titulo} elevation={0} sx={{ borderRadius: '12px', border: '1px solid #E5EAF0', overflow: 'hidden' }}>
              <Box component="img" src={d.img} alt={d.titulo} sx={{ width: '100%', height: 140, objectFit: 'cover' }} />
              <CardContent sx={{ p: 2 }}>
                <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: '#0B1A2A', mb: 0.5 }}>{d.titulo}</Typography>
                <Typography sx={{ color: '#5A6A7A', fontSize: '0.8rem', mb: 1 }}>{d.desc}</Typography>
                <Button onClick={() => navigate('/espacios')} sx={{ color: '#E30613', textTransform: 'none', fontWeight: 500, fontSize: '0.85rem', p: 0 }}>
                  Ver detalles →
                </Button>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Container>

      {/* Quiénes somos */}
      <Box sx={{ backgroundColor: '#0B3A5C', py: 6, mb: 6 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4, alignItems: 'center' }}>
            <Box>
              <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem', fontWeight: 600, mb: 1 }}>¿QUIÉNES SOMOS?</Typography>
              <Typography sx={{ color: '#FFFFFF', fontWeight: 700, fontSize: '1.5rem', mb: 1.5 }}>
                Facilitamos experiencias que enseñan
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.95rem', mb: 2.5 }}>
                En la Oficina de Medios Educativos somos el puente que conecta los recursos físicos y tecnológicos con la excelencia educativa y operativa de la Universidad CESMAG.
              </Typography>
              <Button onClick={() => navigate('/informacion')}
                sx={{ color: '#FFFFFF', textTransform: 'none', fontWeight: 600, borderBottom: '2px solid #E30613', borderRadius: 0, px: 0 }}>
                Conocer más →
              </Button>
            </Box>
            <Box component="img" src={IMG_QUIENES} alt="Quiénes somos"
              sx={{ width: '100%', borderRadius: '12px', maxHeight: 280, objectFit: 'cover' }} />
          </Box>
        </Container>
      </Box>

      {/* Cómo reservar */}
      <Container maxWidth="lg" sx={{ mb: 6 }}>
        <Typography sx={{ fontWeight: 700, fontSize: '1.35rem', color: '#0B1A2A', mb: 0.5, textAlign: 'center' }}>
          ¿Cómo reservar un espacio?
        </Typography>
        <Typography sx={{ color: '#5A6A7A', fontSize: '0.9rem', textAlign: 'center', mb: 3 }}>
          Un recorrido simple para encontrar, solicitar y confirmar el espacio que necesitas.
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 2 }}>
          {[
            { n: '01', t: 'Explora', d: 'Encuentra el espacio adecuado para tu actividad.' },
            { n: '02', t: 'Consulta', d: 'Revisa la disponibilidad de fecha y horario.' },
            { n: '03', t: 'Solicita', d: 'Completa el formulario de reserva.' },
            { n: '04', t: 'Confirma', d: 'Consulta el estado de tu solicitud.' },
          ].map((s) => (
            <Card key={s.n} elevation={0} sx={{ borderRadius: '12px', border: '1px solid #E5EAF0', textAlign: 'center', p: 2.5 }}>
              <Typography sx={{ fontWeight: 800, fontSize: '1.5rem', color: '#E30613', mb: 0.5 }}>{s.n}</Typography>
              <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: '#0B1A2A', mb: 0.5 }}>{s.t}</Typography>
              <Typography sx={{ color: '#5A6A7A', fontSize: '0.85rem' }}>{s.d}</Typography>
            </Card>
          ))}
        </Box>
      </Container>

      {/* Servicios */}
      <Box sx={{ backgroundColor: '#0B3A5C', py: 5, mb: 6 }}>
        <Container maxWidth="lg">
          <Typography sx={{ color: '#FFFFFF', fontWeight: 700, fontSize: '1.5rem', mb: 0.5 }}>Servicios</Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.9rem', mb: 3 }}>
            Recursos y servicios para apoyar tus actividades académicas, culturales y eventos.
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(3, 1fr)' }, gap: 2 }}>
            {SERVICIOS.map((s) => (
              <Card key={s.titulo} elevation={0} sx={{ borderRadius: '12px', overflow: 'hidden' }}>
                <Box component="img" src={s.img} alt={s.titulo} sx={{ width: '100%', height: 130, objectFit: 'cover' }} />
                <CardContent sx={{ p: 2 }}>
                  <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', color: '#0B1A2A', mb: 0.5 }}>{s.titulo}</Typography>
                  <Typography sx={{ color: '#5A6A7A', fontSize: '0.8rem', mb: 1 }}>
                    Información, condiciones y acompañamiento para utilizar este servicio.
                  </Typography>
                  <Button size="small" onClick={() => navigate('/servicios')}
                    sx={{ backgroundColor: '#E30613', color: '#FFF', textTransform: 'none', fontWeight: 600, borderRadius: '6px', px: 1.5,
                      '&:hover': { backgroundColor: '#C10510' } }}>
                    Ver información
                  </Button>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Documentos */}
      <Container maxWidth="lg" sx={{ mb: 6 }}>
        <Typography sx={{ fontWeight: 700, fontSize: '1.35rem', color: '#0B1A2A', mb: 0.5 }}>
          Reglamentos, guías y procedimientos
        </Typography>
        <Typography sx={{ color: '#5A6A7A', fontSize: '0.9rem', mb: 2.5 }}>
          Consulta reglamentos, guías, procedimientos y manuales institucionales.
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1.5 }}>
          {DOCS.map((d) => (
            <Box key={d} sx={{
              backgroundColor: '#FFFFFF', borderRadius: '10px', border: '1px solid #E5EAF0',
              px: 2, py: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{ backgroundColor: '#E30613', color: '#FFF', fontSize: '0.65rem', fontWeight: 700, px: 1, py: 0.4, borderRadius: '4px' }}>PDF</Box>
                <Typography sx={{ fontWeight: 500, fontSize: '0.875rem', color: '#1A2A3A' }}>{d}</Typography>
              </Box>
              <Button onClick={() => navigate('/documentos')} sx={{ color: '#E30613', textTransform: 'none', fontWeight: 500, fontSize: '0.8rem' }}>
                Consultar / Descargar →
              </Button>
            </Box>
          ))}
        </Box>
      </Container>

      {/* Horarios de atención */}
      <Container maxWidth="lg" sx={{ mb: 6 }}>
        <Typography sx={{ fontWeight: 700, fontSize: '1.35rem', color: '#0B1A2A', mb: 2.5 }}>
          Consulta los horarios de atención de nuestras sedes
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 2 }}>
          {[
            { nombre: 'CAMPUS CENTRO', horario: 'Lunes a viernes\n6:45 a. m. – 10:15 p. m.\nSábado\n7:00 a. m. – 6:00 p. m.' },
            { nombre: 'CAMPUS SANTIAGO', horario: 'Lunes a viernes\n7:00 a. m. – 12:00 p. m.' },
            { nombre: 'CAMPUS SAN DAMIÁN', horario: 'Lunes a viernes\n7:00 a. m. – 6:00 p. m.\nSábado\n7:00 a. m. – 12:00 p. m.' },
          ].map((c) => (
            <Card key={c.nombre} elevation={0} sx={{ borderRadius: '12px', border: '1px solid #E5EAF0', p: 2.5 }}>
              <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', color: '#E30613', mb: 1 }}>{c.nombre}</Typography>
              <Typography sx={{ color: '#1A2A3A', fontSize: '0.875rem', whiteSpace: 'pre-line' }}>{c.horario}</Typography>
            </Card>
          ))}
        </Box>
      </Container>

      {/* Contacto rápido */}
      <Box sx={{ backgroundColor: '#0B3A5C', py: 5 }}>
        <Container maxWidth="lg">
          <Typography sx={{ color: '#FFFFFF', fontWeight: 700, fontSize: '1.35rem', mb: 2 }}>CONTACTO MEDIOS EDUCATIVOS</Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
            <Box>
              <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', mb: 0.5 }}>UBICACIÓN</Typography>
              <Typography sx={{ color: '#FFFFFF', fontSize: '0.9rem', mb: 1.5 }}>Universidad CESMAG · Campus Centro, Sede Administrativa</Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', mb: 0.5 }}>TELÉFONO</Typography>
              <Typography sx={{ color: '#FFFFFF', fontSize: '0.9rem', mb: 1.5 }}>(602) 7244434 Ext. 1249</Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', mb: 0.5 }}>CORREO ELECTRÓNICO</Typography>
              <Typography sx={{ color: '#FFFFFF', fontSize: '0.9rem' }}>medioseducativos@unicesmag.edu.co</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
              <Button onClick={() => navigate('/contacto')}
                sx={{ backgroundColor: '#FFFFFF', color: '#0B3A5C', textTransform: 'none', fontWeight: 700, borderRadius: '8px', px: 3,
                  '&:hover': { backgroundColor: '#F0F5FA' } }}>
                PQRF
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
    </PublicLayout>
  );
}
