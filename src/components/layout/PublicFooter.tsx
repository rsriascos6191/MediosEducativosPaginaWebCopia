import {
  Box,
  Container,
  Divider,
  Link,
  Typography,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

function PublicFooter() {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#192754',
        color: '#FFFFFF',
        mt: 'auto',
      }}
    >
      <Box sx={{ backgroundColor: '#0D4FC7', py: 1 }}>
        <Typography align="center" sx={{ fontSize: 12, fontWeight: 600 }}>
          Toma el control de tu futuro con UNICESMAG
        </Typography>
      </Box>
      <Container maxWidth="xl">
        <Box
          sx={{
            py: 5,
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: '1fr 1fr',
              md: '1.3fr 1fr 1fr 1fr',
            },
            gap: 4,
          }}
        >
          {/* Identidad */}
          <Box>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                color: '#FFFFFF',
                mb: 1,
              }}
            >
              SOBRE LA UNICESMAG
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: 'rgba(255,255,255,0.75)',
                mb: 2,
              }}
            >
              Universidad CESMAG
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: 'rgba(255,255,255,0.75)',
                maxWidth: 280,
              }}
            >
              Medios Educativos · espacios, recursos y servicios para la comunidad universitaria.
            </Typography>
          </Box>

          {/* Navegación */}
          <Box>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 700,
                color: '#FFFFFF',
                mb: 2,
              }}
            >
              NAVEGACIÓN
            </Typography>

            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
              }}
            >
              <Link
                component={RouterLink}
                to="/"
                underline="none"
                sx={{
                  color: 'rgba(255,255,255,0.75)',
                  '&:hover': {
                    color: '#FFFFFF',
                  },
                }}
              >
                Inicio
              </Link>

              <Link
                component={RouterLink}
                to="/informacion"
                underline="none"
                sx={{
                  color: 'rgba(255,255,255,0.75)',
                  '&:hover': {
                    color: '#FFFFFF',
                  },
                }}
              >
                Información
              </Link>

              <Link
                component={RouterLink}
                to="/servicios"
                underline="none"
                sx={{
                  color: 'rgba(255,255,255,0.75)',
                  '&:hover': {
                    color: '#FFFFFF',
                  },
                }}
              >
                Servicios
              </Link>

              <Link
                component={RouterLink}
                to="/espacios"
                underline="none"
                sx={{
                  color: 'rgba(255,255,255,0.75)',
                  '&:hover': {
                    color: '#FFFFFF',
                  },
                }}
              >
                Espacios
              </Link>
            </Box>
          </Box>

          {/* Servicios */}
          <Box>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 700,
                color: '#FFFFFF',
                mb: 2,
              }}
            >
              SERVICIOS
            </Typography>

            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
              }}
            >
              <Link
                component={RouterLink}
                to="/disponibilidad"
                underline="none"
                sx={{
                  color: 'rgba(255,255,255,0.75)',
                  '&:hover': {
                    color: '#FFFFFF',
                  },
                }}
              >
                Consultar disponibilidad
              </Link>

              <Link
                component={RouterLink}
                to="/documentos"
                underline="none"
                sx={{
                  color: 'rgba(255,255,255,0.75)',
                  '&:hover': {
                    color: '#FFFFFF',
                  },
                }}
              >
                Documentos
              </Link>

              <Link
                component={RouterLink}
                to="/contacto"
                underline="none"
                sx={{
                  color: 'rgba(255,255,255,0.75)',
                  '&:hover': {
                    color: '#FFFFFF',
                  },
                }}
              >
                Contacto
              </Link>
            </Box>
          </Box>

          {/* Contacto */}
          <Box>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 700,
                color: '#FFFFFF',
                mb: 2,
              }}
            >
              CONTACTO
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: 'rgba(255,255,255,0.75)',
                mb: 1,
              }}
            >
              Universidad CESMAG
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: 'rgba(255,255,255,0.75)',
                mb: 1,
              }}
            >
              (602) 7244434 Ext. 1249
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: 'rgba(255,255,255,0.75)',
                wordBreak: 'break-word',
              }}
            >
              medioseducativos@unicesmag.edu.co
            </Typography>
          </Box>
        </Box>

        <Divider
          sx={{
            borderColor: 'rgba(255,255,255,0.15)',
          }}
        />

        <Box
          sx={{
            py: 2.5,
            display: 'flex',
            flexDirection: {
              xs: 'column',
              md: 'row',
            },
            justifyContent: 'space-between',
            alignItems: {
              xs: 'flex-start',
              md: 'center',
            },
            gap: 1,
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: 'rgba(255,255,255,0.6)',
            }}
          >
            © 2025 Universidad CESMAG. Todos los derechos reservados.
          </Typography>

          <Typography
            variant="caption"
            sx={{
              color: 'rgba(255,255,255,0.6)',
            }}
          >
            Institución de Educación Superior sujeta a inspección y
            vigilancia por el Ministerio de Educación Nacional.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

export default PublicFooter;
