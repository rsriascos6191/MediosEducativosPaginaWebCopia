/**
 * Portal público – Login administrativo
 * Restricción: el correo DEBE terminar en @unicesmag.edu.co
 * Tras login exitoso → /admin/dashboard
 */

import { useState } from 'react';
import {
  Box, Typography, Button, TextField, IconButton, InputAdornment, Alert,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import PublicLayout from '../../../../components/PublicLayout';

const LOGO = 'https://www.unicesmag.edu.co/recursos/uploads/2022/04/Escudos_2-2.png';
const DOMAIN = '@unicesmag.edu.co';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Ingresa tu correo electrónico.');
      return;
    }
    if (!email.toLowerCase().endsWith(DOMAIN)) {
      setError(`El correo debe pertenecer al dominio institucional ${DOMAIN}`);
      return;
    }
    if (!password.trim()) {
      setError('Ingresa tu contraseña.');
      return;
    }

    // Mock: cualquier correo @unicesmag.edu.co + contraseña no vacía abre el dashboard
    // En producción: validar contra API / base de datos
    localStorage.setItem('me_admin_auth', 'true');
    localStorage.setItem('me_admin_email', email);
    navigate('/admin/dashboard');
  };

  return (
    <PublicLayout>
      <Box sx={{
        minHeight: '70vh',
        backgroundImage: 'linear-gradient(rgba(11,26,42,0.55), rgba(11,58,92,0.6)), url(https://www.unicesmag.edu.co/recursos/uploads/2022/07/SedeCentroUCESMAG.webp)',
        backgroundSize: 'cover', backgroundPosition: 'center',
        display: 'flex', alignItems: 'center', justifyContent: 'center', py: 6, px: 2,
      }}>
        <Box
          component="form"
          onSubmit={handleLogin}
          sx={{
            backgroundColor: '#FFFFFF', borderRadius: '16px', width: '100%', maxWidth: 420,
            boxShadow: '0 12px 40px rgba(0,0,0,0.25)', overflow: 'hidden',
          }}
        >
          {/* Red top bar */}
          <Box sx={{ height: 4, backgroundColor: '#E30613' }} />

          <Box sx={{ p: 3.5 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box component="img" src={LOGO} alt="CESMAG" sx={{ height: 40 }} />
                <Box>
                  <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', color: '#0B1A2A' }}>MEDIOS EDUCATIVOS</Typography>
                  <Typography sx={{ color: '#E30613', fontSize: '0.7rem', fontWeight: 700, letterSpacing: 0.5 }}>
                    ACCESO ADMINISTRATIVO
                  </Typography>
                </Box>
              </Box>
              <IconButton size="small" onClick={() => navigate('/')}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>

            <Typography sx={{ fontWeight: 800, fontSize: '1.5rem', color: '#0B1A2A', mb: 0.5 }}>
              Panel administrativo
            </Typography>
            <Typography sx={{ color: '#5A6A7A', fontSize: '0.875rem', mb: 2.5 }}>
              Acceso exclusivo para administradores
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2, borderRadius: '8px' }}>{error}</Alert>
            )}

            <Typography sx={{ fontWeight: 500, fontSize: '0.85rem', color: '#1A2A3A', mb: 0.75 }}>
              Correo electrónico
            </Typography>
            <TextField
              fullWidth size="small" placeholder="Ingresar correo electrónico"
              value={email} onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
            />

            <Typography sx={{ fontWeight: 500, fontSize: '0.85rem', color: '#1A2A3A', mb: 0.75 }}>
              Contraseña
            </Typography>
            <TextField
              fullWidth size="small" type={showPass ? 'text' : 'password'}
              placeholder="Ingresar contraseña"
              value={password} onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setShowPass(!showPass)}>
                      {showPass ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2.5, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
            />

            <Button type="submit" fullWidth variant="contained"
              sx={{
                backgroundColor: '#E30613', textTransform: 'none', fontWeight: 700, borderRadius: '8px',
                py: 1.3, fontSize: '0.95rem', boxShadow: 'none', mb: 1.5,
                '&:hover': { backgroundColor: '#C10510', boxShadow: 'none' },
              }}>
              Iniciar sesión →
            </Button>

            <Typography sx={{ color: '#1565C0', fontSize: '0.85rem', textAlign: 'center', cursor: 'pointer', mb: 2 }}>
              ¿Olvidaste tu contraseña?
            </Typography>

            <Box sx={{ borderTop: '1px solid #E5EAF0', pt: 1.5 }}>
              <Typography sx={{ color: '#9AA5B5', fontSize: '0.75rem', textAlign: 'center' }}>
                Acceso exclusivo para administradores
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </PublicLayout>
  );
}
