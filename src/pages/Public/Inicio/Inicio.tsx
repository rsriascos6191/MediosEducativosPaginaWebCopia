import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import {
  ArrowForward,
  EmailOutlined,
  LocationOnOutlined,
  PhoneOutlined,
  Search,
} from '@mui/icons-material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const HERO_IMAGE =
  'https://www.figma.com/api/mcp/asset/8da56da5-db18-4ef0-86c0-c86f80e515cf/dcaba.png';

const AUDITORIO_IMAGE =
  'https://www.figma.com/api/mcp/asset/a76d5636-1b6d-4685-98f8-6b9f82eb2c84/35edb.png';

const AULA_IMAGE =
  'https://www.figma.com/api/mcp/asset/9753753b-cc76-407b-a705-60017c8624dd/e08d5.png';

const PISCINAS_IMAGE =
  'https://www.figma.com/api/mcp/asset/3537c79c-3f1e-42fe-8a25-c8386fd3222c/5ec92.png';

const CAMPUS_IMAGE =
  'https://www.figma.com/api/mcp/asset/d50f9a12-7db9-4524-b9b8-b17369238f57/450cb.png';


type SpaceStatus =
  | 'Disponible'
  | 'Pendiente'
  | 'Aprobada'
  | 'Activa'
  | 'Cancelada'
  | 'Bloqueado';

interface AgendaSpace {
  name: string;
  status: SpaceStatus;
}

interface AgendaRow {
  time: string;
  spaces: AgendaSpace[];
}

const agendaRows: AgendaRow[] = [
  {
    time: '7:00',
    spaces: [
      { name: 'Auditorio', status: 'Disponible' },
      { name: 'Aulas de clases', status: 'Aprobada' },
      { name: 'Laboratorio', status: 'Disponible' },
      { name: 'Sala de reuniones', status: 'Activa' },
      { name: 'Espacio especializado', status: 'Pendiente' },
      { name: 'Piscinas', status: 'Disponible' },
    ],
  },
  {
    time: '8:00',
    spaces: [
      { name: 'Auditorio', status: 'Activa' },
      { name: 'Aulas de clases', status: 'Disponible' },
      { name: 'Laboratorio', status: 'Disponible' },
      { name: 'Sala de reuniones', status: 'Aprobada' },
      { name: 'Espacio especializado', status: 'Bloqueado' },
      { name: 'Piscinas', status: 'Activa' },
    ],
  },
  {
    time: '9:00',
    spaces: [
      { name: 'Auditorio', status: 'Aprobada' },
      { name: 'Aulas de clases', status: 'Activa' },
      { name: 'Laboratorio', status: 'Disponible' },
      { name: 'Sala de reuniones', status: 'Disponible' },
      { name: 'Espacio especializado', status: 'Pendiente' },
      { name: 'Piscinas', status: 'Cancelada' },
    ],
  },
  {
    time: '10:00',
    spaces: [
      { name: 'Auditorio', status: 'Disponible' },
      { name: 'Aulas de clases', status: 'Disponible' },
      { name: 'Laboratorio', status: 'Activa' },
      { name: 'Sala de reuniones', status: 'Bloqueado' },
      { name: 'Espacio especializado', status: 'Disponible' },
      { name: 'Piscinas', status: 'Aprobada' },
    ],
  },
  {
    time: '11:00',
    spaces: [
      { name: 'Auditorio', status: 'Pendiente' },
      { name: 'Aulas de clases', status: 'Disponible' },
      { name: 'Laboratorio', status: 'Aprobada' },
      { name: 'Sala de reuniones', status: 'Activa' },
      { name: 'Espacio especializado', status: 'Disponible' },
      { name: 'Piscinas', status: 'Bloqueado' },
    ],
  },
  {
    time: '12:00',
    spaces: [
      { name: 'Auditorio', status: 'Activa' },
      { name: 'Aulas de clases', status: 'Cancelada' },
      { name: 'Laboratorio', status: 'Disponible' },
      { name: 'Sala de reuniones', status: 'Disponible' },
      { name: 'Espacio especializado', status: 'Aprobada' },
      { name: 'Piscinas', status: 'Activa' },
    ],
  },
  {
    time: '13:00',
    spaces: [
      { name: 'Auditorio', status: 'Disponible' },
      { name: 'Aulas de clases', status: 'Aprobada' },
      { name: 'Laboratorio', status: 'Pendiente' },
      { name: 'Sala de reuniones', status: 'Activa' },
      { name: 'Espacio especializado', status: 'Disponible' },
      { name: 'Piscinas', status: 'Disponible' },
    ],
  },
  {
    time: '14:00',
    spaces: [
      { name: 'Auditorio', status: 'Bloqueado' },
      { name: 'Aulas de clases', status: 'Disponible' },
      { name: 'Laboratorio', status: 'Activa' },
      { name: 'Sala de reuniones', status: 'Aprobada' },
      { name: 'Espacio especializado', status: 'Pendiente' },
      { name: 'Piscinas', status: 'Disponible' },
    ],
  },
  {
    time: '15:00',
    spaces: [
      { name: 'Auditorio', status: 'Aprobada' },
      { name: 'Aulas de clases', status: 'Disponible' },
      { name: 'Laboratorio', status: 'Disponible' },
      { name: 'Sala de reuniones', status: 'Cancelada' },
      { name: 'Espacio especializado', status: 'Activa' },
      { name: 'Piscinas', status: 'Pendiente' },
    ],
  },
  {
    time: '16:00',
    spaces: [
      { name: 'Auditorio', status: 'Disponible' },
      { name: 'Aulas de clases', status: 'Activa' },
      { name: 'Laboratorio', status: 'Aprobada' },
      { name: 'Sala de reuniones', status: 'Disponible' },
      { name: 'Espacio especializado', status: 'Bloqueado' },
      { name: 'Piscinas', status: 'Disponible' },
    ],
  },
  {
    time: '17:00',
    spaces: [
      { name: 'Auditorio', status: 'Pendiente' },
      { name: 'Aulas de clases', status: 'Disponible' },
      { name: 'Laboratorio', status: 'Activa' },
      { name: 'Sala de reuniones', status: 'Disponible' },
      { name: 'Espacio especializado', status: 'Aprobada' },
      { name: 'Piscinas', status: 'Activa' },
    ],
  },
  {
    time: '18:00',
    spaces: [
      { name: 'Auditorio', status: 'Activa' },
      { name: 'Aulas de clases', status: 'Aprobada' },
      { name: 'Laboratorio', status: 'Disponible' },
      { name: 'Sala de reuniones', status: 'Pendiente' },
      { name: 'Espacio especializado', status: 'Disponible' },
      { name: 'Piscinas', status: 'Bloqueado' },
    ],
  },
];

const spaces = [
  {
    title: 'Auditorio',
    category: 'Auditorios',
    description: 'Espacios para eventos institucionales y académicos.',
    image: AUDITORIO_IMAGE,
    route: '/espacios/auditorio',
  },
  {
    title: 'Aulas de clases',
    category: 'Aulas',
    description: 'Ambientes académicos para clases y actividades.',
    image: AULA_IMAGE,
    route: '/espacios/aulas',
  },
  {
    title: 'Laboratorios',
    category: 'Laboratorios',
    description: 'Espacios especializados para aprendizaje práctico.',
    image: AULA_IMAGE,
    route: '/espacios/laboratorios',
  },
  {
    title: 'Piscinas',
    category: 'Espacios deportivos',
    description: 'Infraestructura para actividades deportivas.',
    image: PISCINAS_IMAGE,
    route: '/espacios/piscinas',
  },
];

const services = [
  {
    title: 'Espacios académicos',
    description:
      'Información, condiciones y acompañamiento para utilizar este servicio.',
    image: AULA_IMAGE,
    route: '/servicios/espacios-academicos',
  },
  {
    title: 'Recursos tecnológicos',
    description:
      'Información, condiciones y acompañamiento para utilizar este servicio.',
    image: AULA_IMAGE,
    route: '/servicios/recursos-tecnologicos',
  },
  {
    title: 'Préstamo de equipos',
    description:
      'Información, condiciones y acompañamiento para utilizar este servicio.',
    image: AULA_IMAGE,
    route: '/servicios/prestamo-equipos',
  },
  {
    title: 'Apoyo audiovisual',
    description:
      'Información, condiciones y acompañamiento para utilizar este servicio.',
    image: CAMPUS_IMAGE,
    route: '/servicios/apoyo-audiovisual',
  },
  {
    title: 'Reservas de espacios',
    description:
      'Información, condiciones y acompañamiento para utilizar este servicio.',
    image: AUDITORIO_IMAGE,
    route: '/servicios/reservas',
  },
  {
    title: 'Otros servicios',
    description:
      'Información, condiciones y acompañamiento para utilizar este servicio.',
    image: PISCINAS_IMAGE,
    route: '/servicios/otros',
  },
];

const documents = [
  'Reglamento de Medios Educativos',
  'Guía Logística de Grados',
  'Guía de Laboratorio',
  'Procedimientos institucionales',
  'Formatos de solicitud',
  'Documentos informativos',
];

function getStatusStyles(status: SpaceStatus) {
  switch (status) {
    case 'Disponible':
      return {
        backgroundColor: '#EAF7EF',
        color: '#177245',
        borderColor: '#B9E5C8',
      };

    case 'Aprobada':
      return {
        backgroundColor: '#EAF1FB',
        color: '#1A4F85',
        borderColor: '#C4D6EE',
      };

    case 'Activa':
      return {
        backgroundColor: '#EEF0FF',
        color: '#3B4CC0',
        borderColor: '#CDD1F8',
      };

    case 'Pendiente':
      return {
        backgroundColor: '#FFF6DF',
        color: '#8A5A00',
        borderColor: '#F0D994',
      };

    case 'Cancelada':
      return {
        backgroundColor: '#FDECEF',
        color: '#B4233F',
        borderColor: '#F2BCC8',
      };

    case 'Bloqueado':
      return {
        backgroundColor: '#F0F2F5',
        color: '#5F6B7A',
        borderColor: '#D9DEE5',
      };
  }
}

function Inicio() {
  const navigate = useNavigate();

  const [tipoEspacio, setTipoEspacio] = useState('');
  const [campus, setCampus] = useState('');
  const [fecha, setFecha] = useState('');
  const [horario, setHorario] = useState('');
  const [selectedCampus, setSelectedCampus] = useState('Campus Centro');

  const consultarDisponibilidad = () => {
    const params = new URLSearchParams();

    if (tipoEspacio) params.set('tipo', tipoEspacio);
    if (campus) params.set('campus', campus);
    if (fecha) params.set('fecha', fecha);
    if (horario) params.set('horario', horario);

    navigate(`/disponibilidad?${params.toString()}`);
  };

  return (
    <Box
      sx={{
        backgroundColor: '#FFFFFF',
        color: '#18214D',
        overflow: 'hidden',
      }}
    >
      {/* HERO */}
      <Box
        sx={{
          position: 'relative',
          minHeight: 520,
          backgroundColor: '#1A4F85',
          overflow: 'hidden',
        }}
      >
        <Box
          component="img"
          src={HERO_IMAGE}
          alt="Universidad CESMAG"
          sx={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />

        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(90deg, rgba(0,35,82,0.94) 0%, rgba(0,63,135,0.78) 42%, rgba(0,63,135,0.10) 100%)',
          }}
        />

        <Container
          maxWidth="xl"
          sx={{
            position: 'relative',
            zIndex: 2,
            height: '100%',
          }}
        >
          <Box
            sx={{
              width: { xs: '100%', md: 620 },
              pt: { xs: 5, md: 8.5 },
            }}
          >
            <Typography
              sx={{
                color: '#FFFFFF',
                fontSize: 14,
                fontWeight: 600,
                letterSpacing: 1.2,
                textTransform: 'uppercase',
                mb: 2,
              }}
            >
              Espacios universitarios
            </Typography>

            <Box
              sx={{
                width: 74,
                height: 3,
                backgroundColor: '#E41E3F',
                mb: 2.5,
              }}
            />

            <Typography
              component="h1"
              sx={{
                color: '#FFFFFF',
                fontSize: { xs: 42, md: 64 },
                lineHeight: 1.05,
                fontWeight: 700,
                mb: 3,
              }}
            >
              Medios Educativos
            </Typography>

            <Typography
              sx={{
                color: 'rgba(255,255,255,0.92)',
                fontSize: { xs: 18, md: 22 },
                lineHeight: 1.45,
                maxWidth: 560,
                mb: 4,
              }}
            >
              En la Universidad CESMAG ponemos a tu disposición nuestros espacios para 
              que tus ideas, proyectos y actividades se hagan realidad.
            </Typography>

            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
            >
              <Button
                variant="contained"
                onClick={() => navigate('/disponibilidad')}
                sx={{
                  backgroundColor: '#E41E3F',
                  color: '#FFFFFF',
                  minHeight: 48,
                  px: 3,
                  '&:hover': {
                    backgroundColor: '#C91836',
                  },
                }}
              >
                Explorar espacios 
              </Button>

              <Button
                variant="outlined"
                onClick={() => navigate('/informacion')}
                sx={{
                  minHeight: 48,
                  px: 3,
                  color: '#FFFFFF',
                  borderColor: 'rgba(255,255,255,0.75)',
                  '&:hover': {
                    borderColor: '#FFFFFF',
                    backgroundColor: 'rgba(255,255,255,0.08)',
                  },
                }}
              >
                Consultar disponibilidad
              </Button>
            </Stack>
          </Box>
        </Container>
      </Box>

      {/* BUSCADOR */}
      <Container
        maxWidth="xl"
        sx={{
          position: 'relative',
          zIndex: 5,
          mt: { xs: -35, md: -9.5 },
          mb: 7,
        }}
      >
        <Card
          sx={{
            borderRadius: 2.25,
            boxShadow: '0 18px 45px rgba(25,55,90,0.18)',
            border: '1px solid rgba(210,219,232,0.7)',
          }}
        >
          <CardContent sx={{ p: { xs: 3, md: 3.5 } }}>
            <Grid container spacing={2} sx={{ alignItems: 'flex-end' }}>
              <Grid size={{ xs: 12, md: 2 }}>
                <Typography
                  sx={{
                    fontSize: 17,
                    fontWeight: 700,
                    color: '#18214D',
                    mb: 1,
                  }}
                >
                  Consulta un espacio
                </Typography>
                <Typography
                  sx={{
                    fontSize: 13,
                    color: '#5F6B7A',
                  }}
                >
                  Encuentra disponibilidad.
                </Typography>
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                <FormControl fullWidth size="small">
                  <InputLabel>Tipo de espacio</InputLabel>
                  <Select
                    value={tipoEspacio}
                    label="Tipo de espacio"
                    onChange={(event) =>
                      setTipoEspacio(event.target.value)
                    }
                  >
                    <MenuItem value="">Todos</MenuItem>
                    <MenuItem value="auditorio">Auditorio</MenuItem>
                    <MenuItem value="aula">Aula</MenuItem>
                    <MenuItem value="laboratorio">Laboratorio</MenuItem>
                    <MenuItem value="sala">Sala de reuniones</MenuItem>
                    <MenuItem value="piscina">Piscinas</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                <FormControl fullWidth size="small">
                  <InputLabel>Campus</InputLabel>
                  <Select
                    value={campus}
                    label="Campus"
                    onChange={(event) => setCampus(event.target.value)}
                  >
                    <MenuItem value="">Todos</MenuItem>
                    <MenuItem value="centro">Campus Centro</MenuItem>
                    <MenuItem value="santiago">Campus Santiago</MenuItem>
                    <MenuItem value="san-damian">
                      Campus San Damián
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Fecha"
                  type="date"
                  value={fecha}
                  onChange={(event) => setFecha(event.target.value)}
                  slotProps={{
                    inputLabel: {
                      shrink: true,
                    },
                  }}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                <FormControl fullWidth size="small">
                  <InputLabel>Horario</InputLabel>
                  <Select
                    value={horario}
                    label="Horario"
                    onChange={(event) => setHorario(event.target.value)}
                  >
                    <MenuItem value="">Cualquier horario</MenuItem>
                    <MenuItem value="7:00">7:00 a. m.</MenuItem>
                    <MenuItem value="8:00">8:00 a. m.</MenuItem>
                    <MenuItem value="9:00">9:00 a. m.</MenuItem>
                    <MenuItem value="10:00">10:00 a. m.</MenuItem>
                    <MenuItem value="11:00">11:00 a. m.</MenuItem>
                    <MenuItem value="12:00">12:00 m.</MenuItem>
                    <MenuItem value="13:00">1:00 p. m.</MenuItem>
                    <MenuItem value="14:00">2:00 p. m.</MenuItem>
                    <MenuItem value="15:00">3:00 p. m.</MenuItem>
                    <MenuItem value="16:00">4:00 p. m.</MenuItem>
                    <MenuItem value="17:00">5:00 p. m.</MenuItem>
                    <MenuItem value="18:00">6:00 p. m.</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid size={{ xs: 12, md: 2 }}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<Search />}
                  onClick={consultarDisponibilidad}
                  sx={{
                    height: 40,
                    backgroundColor: '#E41E3F',
                    '&:hover': {
                      backgroundColor: '#C91836',
                    },
                  }}
                >
                  Consultar
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Container>

      {/* AGENDA DIARIA */}
      <Box
        component="section"
        sx={{
          backgroundColor: '#FFFFFF',
          py: 7,
        }}
      >
        <Container maxWidth="xl">
          <Box sx={{ mb: 3 }}>
            <Box
              sx={{
                width: 54,
                height: 3,
                backgroundColor: '#E41E3F',
                mb: 1.5,
              }}
            />

            <Typography
              sx={{
                color: '#1A4F85',
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: 1.2,
              }}
            >
              AGENDA DIARIA
            </Typography>

            <Typography
              component="h2"
              sx={{
                fontSize: { xs: 30, md: 42 },
                lineHeight: 1.15,
                fontWeight: 700,
                color: '#18214D',
              }}
            >
              Agenda diaria
            </Typography>

            <Typography
              sx={{
                color: '#5F6B7A',
                mt: 1,
                fontSize: 16,
              }}
            >
              Consulta la programación y disponibilidad de nuestros espacios.
            </Typography>
          </Box>

          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={2}
            sx={{ mb: 4,justifyContent: 'space-between', }}
          >
            <Stack direction="row" spacing={1}>
              <Button variant="outlined" size="small">
                ←
              </Button>

              <Button
                variant="outlined"
                size="small"
                sx={{
                  minWidth: 190,
                }}
              >
                HOY · 11 SEP 2026
              </Button>

              <Button variant="outlined" size="small">
                →
              </Button>

              <Button variant="contained" size="small">
                Hoy
              </Button>
            </Stack>

            <Stack
              direction="row"
              spacing={1}
              sx={{
                overflowX: 'auto',
              }}
            >
              {['Campus Centro', 'Campus San Damián', 'Campus Santiago'].map(
                (item) => (
                  <Button
                    key={item}
                    variant={
                      selectedCampus === item ? 'contained' : 'outlined'
                    }
                    size="small"
                    onClick={() => setSelectedCampus(item)}
                    sx={{
                      whiteSpace: 'nowrap',
                      ...(selectedCampus === item
                        ? {
                            backgroundColor: '#1A4F85',
                          }
                        : {}),
                    }}
                  >
                    {item}
                  </Button>
                ),
              )}
            </Stack>
          </Stack>

          <Stack
            direction="row"
            spacing={1.5}
            sx={{
              mb: 2,
              flexWrap: 'wrap',
            }}
          >
            <Chip
              label="Disponibles 6"
              sx={{
                backgroundColor: '#EAF7EF',
                color: '#177245',
              }}
            />

            <Chip
              label="Ocupados 3"
              sx={{
                backgroundColor: '#EEF0FF',
                color: '#3B4CC0',
              }}
            />

            <Chip
              label="Reservas del día 9"
              sx={{
                backgroundColor: '#F0F2F5',
                color: '#5F6B7A',
              }}
            />
          </Stack>

          <Box
            sx={{
              border: '1px solid #DDE4EC',
              borderRadius: 1.5,
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                overflowX: 'auto',
                maxHeight: 300,
                overflowY: 'auto',
              }}
            >
              <Box sx={{ minWidth: 1120 }}>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns:
                      '80px repeat(6, minmax(170px, 1fr))',
                    position: 'sticky',
                    top: 0,
                    zIndex: 2,
                    backgroundColor: '#F4F7FA',
                    borderBottom: '1px solid #DDE4EC',
                  }}
                >
                  {[
                    'Hora',
                    'Auditorio',
                    'Aulas de clases',
                    'Laboratorio',
                    'Sala de reuniones',
                    'Espacio especializado',
                    'Piscinas',
                  ].map((header) => (
                    <Box
                      key={header}
                      sx={{
                        p: 1.5,
                        fontSize: 13,
                        fontWeight: 700,
                        color: '#18214D',
                        borderRight: '1px solid #E3E8EF',
                      }}
                    >
                      {header}
                    </Box>
                  ))}
                </Box>

                {agendaRows.map((row) => (
                  <Box
                    key={row.time}
                    sx={{
                      display: 'grid',
                      gridTemplateColumns:
                        '80px repeat(6, minmax(170px, 1fr))',
                      minHeight: 50,
                      borderBottom: '1px solid #E8EDF2',
                    }}
                  >
                    <Box
                      sx={{
                        p: 1.5,
                        fontSize: 13,
                        fontWeight: 600,
                        color: '#18214D',
                        borderRight: '1px solid #E3E8EF',
                        backgroundColor: '#FFFFFF',
                      }}
                    >
                      {row.time}
                    </Box>

                    {row.spaces.map((space) => {
                      const styles = getStatusStyles(space.status);

                      return (
                        <Box
                          key={`${row.time}-${space.name}`}
                          onClick={() => {
                            if (space.status === 'Disponible') {
                              navigate(
                                `/disponibilidad?campus=${encodeURIComponent(
                                  selectedCampus,
                                )}&espacio=${encodeURIComponent(
                                  space.name,
                                )}&hora=${row.time}`,
                              );
                            }
                          }}
                          sx={{
                            m: 0.5,
                            minHeight: 38,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 1,
                            border: `1px solid ${styles.borderColor}`,
                            backgroundColor: styles.backgroundColor,
                            color: styles.color,
                            fontSize: 12,
                            fontWeight: 600,
                            cursor:
                              space.status === 'Disponible'
                                ? 'pointer'
                                : 'default',
                            transition: 'all 0.15s ease',
                            '&:hover':
                              space.status === 'Disponible'
                                ? {
                                    transform: 'translateY(-1px)',
                                    boxShadow:
                                      '0 3px 10px rgba(26,79,133,0.14)',
                                  }
                                : {},
                          }}
                        >
                          {space.status}
                        </Box>
                      );
                    })}
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              mt: 2,
            }}
          >
            <Button
              endIcon={<ArrowForward />}
              onClick={() => navigate('/disponibilidad')}
              sx={{
                color: '#1A4F85',
                fontWeight: 700,
              }}
            >
              Consultar disponibilidad
            </Button>
          </Box>
        </Container>
      </Box>

      {/* ESPACIOS DESTACADOS */}
      <Box
        component="section"
        sx={{
          backgroundColor: '#FFFFFF',
          py: 8,
        }}
      >
        <Container maxWidth="xl">
         <Stack
  direction="row"
  sx={{
    mb: 4,
    justifyContent: 'space-between',
    alignItems: 'center',
  }}
>
            <Box>
              <Typography
                sx={{
                  color: '#1A4F85',
                  fontSize: 13,
                  fontWeight: 700,
                  letterSpacing: 1.1,
                }}
              >
                ESPACIOS UNIVERSITARIOS
              </Typography>

              <Typography
                component="h2"
                sx={{
                  fontSize: { xs: 30, md: 40 },
                  fontWeight: 700,
                  color: '#18214D',
                }}
              >
                Espacios destacados
              </Typography>
            </Box>

            <Button
              endIcon={<ArrowForward />}
              onClick={() => navigate('/espacios')}
              sx={{
                color: '#1A4F85',
                fontWeight: 700,
              }}
            >
              Ver todos
            </Button>
          </Stack>

          <Grid container spacing={3}>
            {spaces.map((space) => (
              <Grid key={space.title} size={{ xs: 12, sm: 6, lg: 3 }}>
                <Card
                  onClick={() => navigate(space.route)}
                  sx={{
                    height: '100%',
                    cursor: 'pointer',
                    overflow: 'hidden',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 14px 30px rgba(24,33,77,0.14)',
                    },
                  }}
                >
                  <Box
                    component="img"
                    src={space.image}
                    alt={space.title}
                    sx={{
                      width: '100%',
                      height: 150,
                      objectFit: 'cover',
                    }}
                  />

                  <CardContent sx={{ p: 2.5 }}>
                    <Typography
                      sx={{
                        fontSize: 12,
                        color: '#E41E3F',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        mb: 1,
                      }}
                    >
                      {space.category}
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: 19,
                        fontWeight: 700,
                        color: '#18214D',
                        mb: 1,
                      }}
                    >
                      {space.title}
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: 14,
                        lineHeight: 1.5,
                        color: '#5F6B7A',
                        mb: 2,
                      }}
                    >
                      {space.description}
                    </Typography>

                    <Typography
                      sx={{
                        color: '#1A4F85',
                        fontSize: 14,
                        fontWeight: 700,
                      }}
                    >
                      Conocer espacio →
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* QUIÉNES SOMOS */}
      <Box
        component="section"
        sx={{
          backgroundColor: '#FFFFFF',
          py: { xs: 5, md: 7 },
          overflow: 'visible',
        }}
      >
        <Container maxWidth="xl">
          <Box
            sx={{
              position: 'relative',
              minHeight: { xs: 430, md: 360 },
              borderRadius: { xs: 3, md: 4 },
              overflow: 'visible',
              display: 'flex',
              alignItems: 'center',
              background: 'linear-gradient(110deg, #18214D 0%, #1A4F85 58%, #174777 100%)',
              boxShadow: '0 14px 34px rgba(24,33,77,0.14)',
            }}
          >
            {/* Decoración roja detrás de la fotografía */}
            <Box
              sx={{
                position: 'absolute',
                zIndex: 0,
                width: { xs: 210, md: 360 },
                height: { xs: 300, md: 470 },
                right: { xs: 10, md: 260 },
                top: { xs: 65, md: -55 },
                background: 'linear-gradient(135deg, rgba(228,30,63,0.72), rgba(228,30,63,0.18))',
                transform: 'skewX(-16deg) rotate(8deg)',
                borderRadius: 4,
                opacity: 0.85,
              }}
            />

            {/* Fotografía que sobresale del contenedor por el lado derecho */}
            <Box
              sx={{
                position: 'absolute',
                zIndex: 2,
                right: { xs: 12, sm: 24, md: 48 },
                top: { xs: 'auto', md: '50%' },
                bottom: { xs: -55, md: 'auto' },
                transform: { xs: 'none', md: 'translateY(-50%)' },
                width: { xs: 'calc(100% - 24px)', sm: '55%', md: 500, lg: 560 },
                height: { xs: 205, sm: 230, md: 315, lg: 340 },
                borderRadius: { xs: 3, md: 4 },
                overflow: 'hidden',
                backgroundImage: `url(${CAMPUS_IMAGE})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                boxShadow: '0 18px 38px rgba(0,0,0,0.24)',
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(90deg, rgba(24,33,77,0.20), rgba(24,33,77,0.02) 65%)',
                }}
              />
            </Box>

            <Grid
              container
              sx={{
                position: 'relative',
                zIndex: 3,
                width: '100%',
                minHeight: { xs: 430, md: 360 },
                alignItems: 'center',
                px: { xs: 3, sm: 5, md: 7 },
                py: { xs: 4, md: 5 },
              }}
            >
              <Grid
                size={{ xs: 12, md: 7 }}
                sx={{
                  pr: { xs: 0, md: 4 },
                  pb: { xs: 145, md: 0 },
                  transform: { xs: 'translateY(-8px)', md: 'translateY(-18px)' },
                }}
              >
                <Typography
                  sx={{
                    fontSize: { xs: 15, sm: 17, md: 19 },
                    fontWeight: 800,
                    letterSpacing: { xs: 1.4, md: 1.8 },
                    color: '#E41E3F',
                    mb: { xs: 2, md: 2.5 },
                    transform: { xs: 'translateY(0px)', md: 'translateY(0px)' },
                  }}
                >
                  ¿QUIÉNES SOMOS?
                </Typography>

                <Typography
                  component="h2"
                  sx={{
                    color: '#FFFFFF',
                    fontSize: { xs: 32, sm: 38, md: 46 },
                    lineHeight: 1.08,
                    fontWeight: 800,
                    maxWidth: { xs: '100%', md: 700 },
                    mb: 2,
                  }}
                >
                  Facilitamos experiencias que enseñan
                </Typography>

                <Typography
                  sx={{
                    color: 'rgba(255,255,255,0.88)',
                    fontSize: { xs: 14, md: 16 },
                    lineHeight: 1.55,
                    maxWidth: 650,
                    mb: 0,
                  }}
                >
                  Medios Educativos acompaña a la comunidad universitaria
                  mediante la gestión de espacios, recursos y servicios que
                  apoyan las actividades académicas, institucionales y
                  administrativas.
                </Typography>
              </Grid>

              <Grid
                size={{ xs: 12, md: 5 }}
                sx={{
                  display: 'flex',
                  justifyContent: { xs: 'flex-start', md: 'flex-end' },
                  alignItems: { xs: 'flex-start', md: 'center' },
                  mt: { xs: 0, md: 0 },
                  position: 'relative',
                  zIndex: 4,
                }}
              >
                <Button
                  variant="outlined"
                  onClick={() => navigate('/informacion')}
                  sx={{
                    minHeight: 48,
                    px: 3,
                    borderRadius: 999,
                    color: '#FFFFFF',
                    borderColor: 'rgba(255,255,255,0.9)',
                    fontSize: 15,
                    fontWeight: 700,
                    whiteSpace: 'nowrap',
                    '&:hover': {
                      borderColor: '#FFFFFF',
                      backgroundColor: 'rgba(255,255,255,0.10)',
                    },
                  }}
                >
                  Conocer Medios Educativos →
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Box>

      {/* CÓMO RESERVAR */}
      <Box
        component="section"
        sx={{
          backgroundColor: '#FFFFFF',
          py: { xs: 7, md: 8 },
        }}
      >
        <Container maxWidth="xl">
          <Typography
            sx={{
              color: '#1A4F85',
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: 1.1,
              mb: 1,
            }}
          >
            PROCESO DE RESERVA
          </Typography>

          <Typography
            component="h2"
            sx={{
              fontSize: { xs: 30, md: 40 },
              fontWeight: 700,
              color: '#18214D',
              mb: 1,
            }}
          >
            ¿Cómo reservar un espacio?
          </Typography>

          <Typography
            sx={{
              color: '#5F6B7A',
              mb: 5,
              fontSize: 16,
            }}
          >
            Sigue estos pasos para consultar y solicitar un espacio de Medios Educativos.
          </Typography>

          <Grid container spacing={3}>
            {[
              ['01', 'Explora', 'Conoce los espacios disponibles.'],
              ['02', 'Consulta', 'Revisa disponibilidad según fecha y horario.'],
              ['03', 'Solicita', 'Diligencia la solicitud de reserva.'],
              ['04', 'Confirma', 'Recibe información sobre el estado de tu solicitud.'],
            ].map(([number, title, description]) => (
              <Grid key={number} size={{ xs: 12, sm: 6, md: 3 }}>
                <Box
                  sx={{
                    height: '100%',
                    p: 2.5,
                    borderTop: '3px solid #E41E3F',
                    backgroundColor: '#F8FAFC',
                    borderRadius: 1.5,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 42,
                      lineHeight: 1,
                      fontWeight: 700,
                      color: '#E41E3F',
                    }}
                  >
                    {number}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: 18,
                      fontWeight: 700,
                      color: '#18214D',
                      mt: 1.5,
                    }}
                  >
                    {title}
                  </Typography>
                  <Typography
                    sx={{
                      color: '#5F6B7A',
                      fontSize: 14,
                      mt: 1,
                      lineHeight: 1.5,
                    }}
                  >
                    {description}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* SERVICIOS — alineado a Figma (PDF Inicio Desktop) */}
      <Box component="section">
        {/* Cabecera azul institucional */}
        <Box
          sx={{
            backgroundColor: '#18214D',
            pt: { xs: 6, md: 7 },
            pb: { xs: 6, md: 7 },
          }}
        >
          <Container maxWidth="xl">
            <Typography
              component="h2"
              sx={{
                fontSize: { xs: 32, md: 42 },
                fontWeight: 700,
                color: '#FFFFFF',
                mb: 1.5,
              }}
            >
              Servicios
            </Typography>
            <Typography
              sx={{
                color: 'rgba(255,255,255,0.85)',
                fontSize: { xs: 15, md: 17 },
                maxWidth: 640,
                lineHeight: 1.5,
              }}
            >
              Recursos y servicios para apoyar tus actividades académicas,
              culturales y eventos.
            </Typography>
          </Container>
        </Box>

        {/* Tarjetas */}
        <Box
          sx={{
            backgroundColor: '#F4F7FA',
            pt: { xs: 2.5, md: 3 },
            pb: { xs: 7, md: 8 },
            mt: 0,
          }}
        >
    
          <Container maxWidth="xl">
            <Grid container spacing={2.5}>
              {services.map((service) => (
                <Grid key={service.title} size={{ xs: 12, sm: 6, lg: 4 }}>
                  <Card
                    elevation={0}
                    sx={{
                      height: '100%',
                      borderRadius: 2,
                      overflow: 'hidden',
                      border: '1px solid #E5EAF0',
                      backgroundColor: '#FFFFFF',
                      display: 'flex',
                      flexDirection: 'column',
                      transition:
                        'transform 0.2s ease, box-shadow 0.2s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 14px 28px rgba(24,33,77,0.12)',
                      },
                    }}
                  >
                    <Box
                      component="img"
                      src={service.image}
                      alt={service.title}
                      sx={{
                        width: '100%',
                        height: 160,
                        objectFit: 'cover',
                        display: 'block',
                      }}
                    />

                    <CardContent
                      sx={{
                        p: 2.5,
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: 17,
                          fontWeight: 700,
                          color: '#18214D',
                          mb: 1,
                        }}
                      >
                        {service.title}
                      </Typography>

                      <Typography
                        sx={{
                          color: '#5F6B7A',
                          fontSize: 14,
                          lineHeight: 1.5,
                          mb: 2.5,
                          flex: 1,
                        }}
                      >
                        {service.description}
                      </Typography>

                      <Button
                        variant="contained"
                        onClick={() => navigate(service.route)}
                        sx={{
                          alignSelf: 'flex-start',
                          backgroundColor: '#E41E3F',
                          color: '#FFFFFF',
                          textTransform: 'none',
                          fontWeight: 600,
                          fontSize: 13,
                          px: 2,
                          py: 0.85,
                          borderRadius: 1.25,
                          boxShadow: 'none',
                          '&:hover': {
                            backgroundColor: '#C91836',
                            boxShadow: 'none',
                          },
                        }}
                      >
                        Ver información
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>
      </Box>

      {/* DOCUMENTOS */}
      <Box
        component="section"
        sx={{
          backgroundColor: '#FFFFFF',
          py: { xs: 7, md: 8 },
        }}
      >
        <Container maxWidth="xl">
          <Typography
            sx={{
              color: '#1A4F85',
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: 1.1,
              mb: 1,
            }}
          >
            DOCUMENTOS
          </Typography>

          <Typography
            component="h2"
            sx={{
              fontSize: { xs: 30, md: 40 },
              fontWeight: 700,
              color: '#18214D',
              mb: 1,
            }}
          >
            Reglamentos, guías y procedimientos
          </Typography>

          <Typography sx={{ color: '#5F6B7A', mb: 4 }}>
            Consulta la documentación institucional relacionada con los servicios de Medios Educativos.
          </Typography>

          <Grid container spacing={1.5}>
            {documents.map((document) => (
              <Grid key={document} size={{ xs: 12, md: 6 }}>
                <Card
                  onClick={() => navigate('/documentos')}
                  sx={{
                    cursor: 'pointer',
                    borderRadius: 1.5,
                    '&:hover': { borderColor: '#1A4F85' },
                  }}
                >
                  <CardContent
                    sx={{
                      py: 1.8,
                      px: 2.5,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 2,
                    }}
                  >
                    <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                      <Box
                        sx={{
                          width: 38,
                          height: 34,
                          borderRadius: 1,
                          backgroundColor: '#FDECEF',
                          color: '#E41E3F',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 11,
                          fontWeight: 700,
                        }}
                      >
                        PDF
                      </Box>
                      <Typography sx={{ fontWeight: 600, color: '#18214D' }}>
                        {document}
                      </Typography>
                    </Stack>
                    <Typography
                      sx={{
                        color: '#1A4F85',
                        fontSize: 13,
                        fontWeight: 700,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      Consultar →
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Button
            onClick={() => navigate('/documentos')}
            sx={{ mt: 3, px: 0, color: '#1A4F85', fontWeight: 700 }}
          >
            Ver todos los documentos →
          </Button>
        </Container>
      </Box>

      {/* HORARIOS DE ATENCIÓN — alineado a Figma (PDF Inicio Desktop) */}
      <Box
        component="section"
        sx={{
          backgroundColor: '#FFFFFF',
          py: { xs: 7, md: 8 },
        }}
      >
        <Container maxWidth="xl">
          <Typography
            sx={{
              color: '#E41E3F',
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: 1.2,
              textTransform: 'uppercase',
              mb: 1,
            }}
          >
            Horarios de atención
          </Typography>

          <Typography
            component="h2"
            sx={{
              fontSize: { xs: 28, md: 36 },
              fontWeight: 700,
              color: '#18214D',
              mb: 1,
              maxWidth: 640,
              lineHeight: 1.2,
            }}
          >
            Consulta los horarios de atención de nuestras sedes
          </Typography>

          <Grid container spacing={2.5} sx={{ mt: 1 }}>
            {[
              {
                name: 'CAMPUS CENTRO',
                rows: [
                  { label: 'Lunes a viernes', value: '6:45 a. m. – 10:15 p. m.', note: 'Jornada continua' },
                  { label: 'Sábado', value: '7:00 a. m. – 6:00 p. m.', note: 'Jornada continua' },
                ],
              },
              {
                name: 'CAMPUS SANTIAGO',
                rows: [
                  { label: 'Lunes a viernes', value: '7:00 a. m. – 12:00 p. m.', note: '' },
                ],
              },
              {
                name: 'CAMPUS SAN DAMIÁN',
                rows: [
                  { label: 'Lunes a viernes', value: '7:00 a. m. – 6:00 p. m.', note: 'Jornada continua' },
                  { label: 'Sábado', value: '7:00 a. m. – 12:00 p. m.', note: '' },
                ],
              },
            ].map((campus) => (
              <Grid key={campus.name} size={{ xs: 12, md: 4 }}>
                <Card
                  elevation={0}
                  sx={{
                    height: '100%',
                    borderRadius: 2,
                    border: '1px solid #E5EAF0',
                    backgroundColor: '#FFFFFF',
                  }}
                >
                  <CardContent sx={{ p: 2.75 }}>
                    <Stack
                      direction="row"
                      spacing={1}
                      sx={{ alignItems: 'center', mb: 2 }}
                    >
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          backgroundColor: '#1A4F85',
                          flexShrink: 0,
                        }}
                      />
                      <Typography
                        sx={{
                          fontSize: 15,
                          fontWeight: 800,
                          color: '#18214D',
                          letterSpacing: 0.3,
                        }}
                      >
                        {campus.name}
                      </Typography>
                    </Stack>

                    <Typography
                      sx={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: '#5F6B7A',
                        mb: 1.5,
                      }}
                    >
                      Ubicación
                    </Typography>

                    <Stack spacing={1.75}>
                      {campus.rows.map((row) => (
                        <Box key={row.label + row.value}>
                          <Typography
                            sx={{
                              fontSize: 13,
                              fontWeight: 600,
                              color: '#18214D',
                            }}
                          >
                            {row.label}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: 14,
                              color: '#5F6B7A',
                              mt: 0.25,
                            }}
                          >
                            {row.value}
                          </Typography>
                          {row.note ? (
                            <Typography
                              sx={{
                                fontSize: 12,
                                color: '#8A94A6',
                                mt: 0.15,
                                fontStyle: 'italic',
                              }}
                            >
                              {row.note}
                            </Typography>
                          ) : null}
                        </Box>
                      ))}
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Button
            endIcon={<ArrowForward />}
            onClick={() => navigate('/contacto')}
            sx={{
              mt: 3,
              px: 0,
              color: '#E41E3F',
              fontWeight: 700,
              fontSize: 14,
              textTransform: 'none',
              '&:hover': {
                backgroundColor: 'transparent',
                color: '#C91836',
              },
            }}
          >
            Contactanos
          </Button>
        </Container>
      </Box>

      {/* CONTACTO MEDIOS EDUCATIVOS — alineado a Figma */}
      <Box
        component="section"
        sx={{
          backgroundColor: '#FFFFFF',
          py: { xs: 7, md: 8 },
        }}
      >
        <Container maxWidth="xl">
          <Grid container spacing={4} sx={{ alignItems: 'flex-start' }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography
                sx={{
                  color: '#E41E3F',
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: 1.2,
                  textTransform: 'uppercase',
                  mb: 1,
                }}
              >
                Contacto
              </Typography>

              <Typography
                component="h2"
                sx={{
                  fontSize: { xs: 28, md: 36 },
                  fontWeight: 800,
                  color: '#18214D',
                  mb: 1,
                  lineHeight: 1.15,
                }}
              >
                CONTACTO MEDIOS EDUCATIVOS
              </Typography>

              <Typography
                sx={{
                  color: '#5F6B7A',
                  fontSize: 15,
                  mb: 3.5,
                }}
              >
                Comunícate con nosotros
              </Typography>

              <Stack spacing={2.5}>
                <Stack direction="row" spacing={1.5} sx={{ alignItems: 'flex-start' }}>
                  <LocationOnOutlined sx={{ color: '#E41E3F', fontSize: 22, mt: 0.2 }} />
                  <Box>
                    <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#E41E3F', letterSpacing: 0.4 }}>
                      UBICACIÓN
                    </Typography>
                    <Typography sx={{ fontSize: 14, color: '#18214D', fontWeight: 600 }}>
                      Universidad CESMAG
                    </Typography>
                    <Typography sx={{ fontSize: 14, color: '#5F6B7A' }}>
                      Campus Centro, Sede Administrativa
                    </Typography>
                  </Box>
                </Stack>

                <Stack direction="row" spacing={1.5} sx={{ alignItems: 'flex-start' }}>
                  <PhoneOutlined sx={{ color: '#E41E3F', fontSize: 22, mt: 0.2 }} />
                  <Box>
                    <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#E41E3F', letterSpacing: 0.4 }}>
                      TELÉFONO
                    </Typography>
                    <Typography sx={{ fontSize: 14, color: '#18214D' }}>
                      (602) 7244434 Ext. 1249
                    </Typography>
                  </Box>
                </Stack>

                <Stack direction="row" spacing={1.5} sx={{ alignItems: 'flex-start' }}>
                  <EmailOutlined sx={{ color: '#E41E3F', fontSize: 22, mt: 0.2 }} />
                  <Box>
                    <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#E41E3F', letterSpacing: 0.4 }}>
                      CORREO ELECTRÓNICO
                    </Typography>
                    <Typography sx={{ fontSize: 14, color: '#18214D' }}>
                      medioseducativos@unicesmag.edu.co
                    </Typography>
                  </Box>
                </Stack>
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                sx={{
                  borderLeft: { md: '1px solid #E5EAF0' },
                  pl: { md: 4 },
                  pt: { xs: 1, md: 6 },
                }}
              >
                <Typography
                  sx={{
                    color: '#5F6B7A',
                    fontSize: 15,
                    lineHeight: 1.6,
                    mb: 3,
                    maxWidth: 420,
                  }}
                >
                  Para comunicarte con nosotros visítanos en nuestra oficina o a
                  través de nuestros medios de comunicación.
                </Typography>

                <Button
                  variant="contained"
                  onClick={() => navigate('/contacto')}
                  sx={{
                    backgroundColor: '#1A4F85',
                    color: '#FFFFFF',
                    textTransform: 'none',
                    fontWeight: 700,
                    px: 3,
                    py: 1.1,
                    borderRadius: 1.25,
                    boxShadow: 'none',
                    '&:hover': {
                      backgroundColor: '#143E6A',
                      boxShadow: 'none',
                    },
                  }}
                >
                  PQRF
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}

export default Inicio;