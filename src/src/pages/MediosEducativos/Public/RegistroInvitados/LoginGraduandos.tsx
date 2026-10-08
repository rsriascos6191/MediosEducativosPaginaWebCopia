/**
 * Acceso a graduandos – Login para registro de invitados
 * Campos: cédula y código estudiantil (solo números)
 * Tras validación → /registro-invitados/formulario
 */

import { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  IconButton,
  Alert,
  AppBar,
  Toolbar,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';

const LOGO = 'https://www.unicesmag.edu.co/recursos/uploads/2022/04/Escudos_2-2.png';
const BG =
  'https://globosfloresyfiestas.com/wp-content/uploads/2021/06/graduacion.jpg';

/** Solo dígitos */
const onlyDigits = (value: string) => value.replace(/\D/g, '');

export default function LoginGraduandos() {
  const navigate = useNavigate();
  const [cedula, setCedula] = useState('');
  const [codigo, setCodigo] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!cedula.trim()) {
      setError('Ingresa tu número de cédula.');
      return;
    }
    if (cedula.length < 6) {
      setError('La cédula debe tener al menos 6 dígitos.');
      return;
    }
    if (!codigo.trim()) {
      setError('Ingresa tu código estudiantil.');
      return;
    }
    if (codigo.length < 4) {
      setError('El código estudiantil debe tener al menos 4 dígitos.');
      return;
    }

    // Mock: datos listos para validación contra base de datos
    localStorage.setItem('me_graduando_auth', 'true');
    localStorage.setItem('me_graduando_cedula', cedula);
    localStorage.setItem('me_graduando_codigo', codigo);
    navigate('/registro-invitados/formulario');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#0B1A2A',
      }}
    >
      {/* Cabecera azul: solo logo institucional */}
      <AppBar
        position="static"
        elevation={0}
        sx={{ backgroundColor: '#0B3A5C', borderBottom: 'none' }}
      >
        <Toolbar
          sx={{
            maxWidth: 1200,
            width: '100%',
            mx: 'auto',
            px: { xs: 2, md: 3 },
            py: 1,
            justifyContent: 'flex-start',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              cursor: 'pointer',
            }}
            onClick={() => navigate('/')}
          >
            <Box
              component="img"
              src={LOGO}
              alt="Universidad CESMAG"
              sx={{ height: 44, width: 'auto' }}
            />
            <Typography
              sx={{
                fontWeight: 700,
                color: '#FFFFFF',
                fontSize: '0.95rem',
                lineHeight: 1.2,
                display: { xs: 'none', sm: 'block' },
              }}
            >
              MEDIOS
              <br />
              EDUCATIVOS
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Contenido con fondo de graduación */}
      <Box
        sx={{
          flex: 1,
          backgroundImage: `linear-gradient(rgba(11,26,42,0.55), rgba(11,58,92,0.55)), url(${BG})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 6,
          px: 2,
        }}
      >
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            width: '100%',
            maxWidth: 420,
            boxShadow: '0 12px 40px rgba(0,0,0,0.25)',
            overflow: 'hidden',
          }}
        >
          {/* Barra superior roja institucional */}
          <Box sx={{ height: 4, backgroundColor: '#E30613' }} />

          <Box sx={{ p: 3.5 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                mb: 2,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box
                  component="img"
                  src={LOGO}
                  alt="CESMAG"
                  sx={{ height: 40 }}
                />
                <Box>
                  <Typography
                    sx={{
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      color: '#0B1A2A',
                    }}
                  >
                    MEDIOS EDUCATIVOS
                  </Typography>
                  <Typography
                    sx={{
                      color: '#E30613',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      letterSpacing: 0.5,
                    }}
                  >
                    ACCESO A GRADUANDOS
                  </Typography>
                </Box>
              </Box>
              <IconButton size="small" onClick={() => navigate('/')}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>

            <Typography
              sx={{
                fontWeight: 800,
                fontSize: '1.25rem',
                color: '#0B1A2A',
                mb: 2.5,
                lineHeight: 1.35,
              }}
            >
              Formulario de registro para invitados de los Graduandos
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2, borderRadius: '8px' }}>
                {error}
              </Alert>
            )}

            <Typography
              sx={{
                fontWeight: 500,
                fontSize: '0.85rem',
                color: '#1A2A3A',
                mb: 0.75,
              }}
            >
              Cédula
            </Typography>
            <TextField
              fullWidth
              size="small"
              placeholder="Ingresar número de cédula"
              value={cedula}
              onChange={(e) => setCedula(onlyDigits(e.target.value))}
              inputProps={{
                inputMode: 'numeric',
                pattern: '[0-9]*',
                maxLength: 15,
                autoComplete: 'off',
              }}
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': { borderRadius: '8px' },
              }}
            />

            <Typography
              sx={{
                fontWeight: 500,
                fontSize: '0.85rem',
                color: '#1A2A3A',
                mb: 0.75,
              }}
            >
              Código estudiantil
            </Typography>
            <TextField
              fullWidth
              size="small"
              placeholder="Ingresar código estudiantil"
              value={codigo}
              onChange={(e) => setCodigo(onlyDigits(e.target.value))}
              inputProps={{
                inputMode: 'numeric',
                pattern: '[0-9]*',
                maxLength: 20,
                autoComplete: 'off',
              }}
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': { borderRadius: '8px' },
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                backgroundColor: '#1565C0',
                textTransform: 'none',
                fontWeight: 700,
                fontSize: '0.95rem',
                borderRadius: '8px',
                py: 1.25,
                boxShadow: 'none',
                '&:hover': {
                  backgroundColor: '#0D47A1',
                  boxShadow: 'none',
                },
              }}
            >
              Iniciar sesión →
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
