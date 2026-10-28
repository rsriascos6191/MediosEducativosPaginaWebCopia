/**
 * Formulario de registro de invitados de graduandos.
 * - Datos del graduando (solo lectura, según cédula del login)
 * - Primer y segundo invitado (nombre, cédula, teléfono, parentesco)
 * Los invitados se registran en el mock de ceremonias (panel admin).
 */

import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  TextField,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  AppBar,
  Toolbar,
  Alert,
  CircularProgress,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useNavigate } from 'react-router-dom';
import {
  iniciarSesionGraduando,
  addInvitados,
  type GraduandoRegistroPublico,
} from '../../Admin/Eventos/Ceremonias/services/ceremonias.service';

const LOGO = 'https://www.unicesmag.edu.co/recursos/uploads/2022/04/Escudos_2-2.png';

const PARENTESCO_OPTIONS = [
  'Padre / Madre',
  'Cónyuge / Pareja',
  'Hijo / Hija',
  'Hermano / Hermana',
  'Abuelo / Abuela',
  'Tío / Tía',
  'Primo / Prima',
  'Amigo / Amiga',
  'Otro familiar',
  'Otro',
];

const onlyDigits = (v: string) => v.replace(/\D/g, '');

interface InvitadoForm {
  nombre: string;
  cedula: string;
  telefono: string;
  parentesco: string;
}

const emptyInvitado = (): InvitadoForm => ({
  nombre: '',
  cedula: '',
  telefono: '',
  parentesco: '',
});

export default function FormularioInvitados() {
  const navigate = useNavigate();
  const cedulaLogin = localStorage.getItem('me_graduando_cedula') || '';
  const codigoLogin = localStorage.getItem('me_graduando_codigo') || '';
  const auth = localStorage.getItem('me_graduando_auth') === 'true';

  const [graduando, setGraduando] = useState<GraduandoRegistroPublico | null>(null);
  const [loading, setLoading] = useState(true);
  const [invitado1, setInvitado1] = useState<InvitadoForm>(emptyInvitado());
  const [invitado2, setInvitado2] = useState<InvitadoForm>(emptyInvitado());
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!auth) {
      navigate('/registro-invitados', { replace: true });
      return;
    }
    iniciarSesionGraduando(cedulaLogin, codigoLogin)
      .then((g) => {
        setGraduando(g);
      })
      .catch((cause: unknown) => {
        setGraduando(null);
        setError(cause instanceof Error ? cause.message : 'No fue posible validar el acceso.');
      })
      .finally(() => setLoading(false));
  }, [auth, cedulaLogin, codigoLogin, navigate]);

  const validateInvitado = (inv: InvitadoForm, label: string): string | null => {
    if (!inv.nombre.trim()) return `${label}: ingresa el nombre completo.`;
    if (!inv.cedula.trim() || inv.cedula.length < 6)
      return `${label}: la cédula debe tener al menos 6 dígitos.`;
    if (!inv.telefono.trim() || inv.telefono.length < 7)
      return `${label}: ingresa un teléfono válido.`;
    if (!inv.parentesco) return `${label}: selecciona el parentesco.`;
    return null;
  };

  const handleSubmit = async () => {
    setError('');
    setSuccess('');
    if (!graduando) {
      setError('No se encontró el graduando asociado a esta cédula.');
      return;
    }

    const invitadosPendientes = [
      { datos: invitado1, etiqueta: 'Primer invitado' },
      { datos: invitado2, etiqueta: 'Segundo invitado' },
    ].filter(({ datos }) =>
      datos.nombre.trim() || datos.cedula.trim() ||
      datos.telefono.trim() || datos.parentesco
    );
    if (invitadosPendientes.length === 0) {
      setError(validateInvitado(invitado1, 'Primer invitado') || 'Ingresa los datos del invitado.');
      return;
    }
    for (const invitado of invitadosPendientes) {
      const validacion = validateInvitado(invitado.datos, invitado.etiqueta);
      if (validacion) {
        setError(validacion);
        return;
      }
    }

    setSaving(true);
    try {
      const guardados = await addInvitados(
        graduando.id,
        invitadosPendientes.map(({ datos }) => ({
          nombre: datos.nombre.trim(),
          documento: datos.cedula,
          parentesco: datos.parentesco,
          telefono: datos.telefono,
          autorizacion: 'Pendiente',
        })),
      );
      setGraduando((actual) => actual
        ? { ...actual, invitadosRegistrados: actual.invitadosRegistrados + guardados.length }
        : actual);
      setSuccess(
        'Invitados registrados correctamente. Podrás verlos en el módulo de ceremonias del panel administrativo.'
      );
      setInvitado1(emptyInvitado());
      setInvitado2(emptyInvitado());
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Ocurrió un error al guardar. Intenta de nuevo.');
    } finally {
      setSaving(false);
    }
  };

  if (!auth) return null;

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#F5F7FA',
        }}
      >
        <CircularProgress sx={{ color: '#0B3A5C' }} />
      </Box>
    );
  }

  const fieldSx = { '& .MuiOutlinedInput-root': { borderRadius: '8px' } };
  const readOnlySx = {
    ...fieldSx,
    '& .MuiOutlinedInput-root': {
      borderRadius: '8px',
      backgroundColor: '#F8FAFC',
    },
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#F5F7FA',
      }}
    >
      {/* Menú azul: logo + Felicitaciones Graduando! */}
      <AppBar
        position="sticky"
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
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
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
                fontSize: '0.9rem',
                lineHeight: 1.2,
                display: { xs: 'none', sm: 'block' },
              }}
            >
              MEDIOS
              <br />
              EDUCATIVOS
            </Typography>
          </Box>

          <Typography
            sx={{
              fontFamily: 'Georgia, "Times New Roman", serif',
              fontStyle: 'italic',
              fontWeight: 600,
              fontSize: { xs: '1rem', sm: '1.25rem', md: '1.4rem' },
              color: '#D4AF37',
              letterSpacing: '0.02em',
              textShadow: '0 1px 2px rgba(0,0,0,0.25)',
            }}
          >
            ¡Felicitaciones Graduando!
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4, flex: 1 }}>
        <Typography
          sx={{
            fontWeight: 800,
            fontSize: { xs: '1.5rem', md: '1.85rem' },
            color: '#0B1A2A',
            mb: 0.5,
          }}
        >
          Registro de invitados
        </Typography>
        <Typography sx={{ color: '#5A6A7A', fontSize: '0.9rem', mb: 3 }}>
          Confirma tus datos e indica los invitados que te acompañarán en la
          ceremonia de grado.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: '8px' }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2, borderRadius: '8px' }}>
            {success}
          </Alert>
        )}

        {/* Datos del graduando (solo lectura) */}
        <Accordion
          defaultExpanded
          elevation={0}
          sx={{
            border: '1px solid #E5EAF0',
            borderRadius: '12px !important',
            mb: 2,
            backgroundColor: '#FFFFFF',
            '&:before': { display: 'none' },
          }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box>
              <Typography sx={{ fontWeight: 700, color: '#0B1A2A' }}>
                Datos del graduando
              </Typography>
              <Typography sx={{ color: '#5A6A7A', fontSize: '0.8rem' }}>
                Información asociada a la cédula con la que ingresaste. No
                editable.
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: '1fr 1fr',
                  md: '1fr 1fr 1fr 1fr',
                },
                gap: 2,
              }}
            >
              <TextField
                size="small"
                label="Nombre completo"
                value={
                  graduando
                    ? `${graduando.nombres} ${graduando.apellidos}`.trim()
                    : '—'
                }
                slotProps={{ input: { readOnly: true } }}
                sx={readOnlySx}
              />
              <TextField
                size="small"
                label="Código estudiantil"
                value={graduando?.codigoEstudiantil || codigoLogin || '—'}
                slotProps={{ input: { readOnly: true } }}
                sx={readOnlySx}
              />
              <TextField
                size="small"
                label="Cédula"
                value={graduando?.documento || cedulaLogin || '—'}
                slotProps={{ input: { readOnly: true } }}
                sx={readOnlySx}
              />
              <TextField
                size="small"
                label="Programa académico"
                value={graduando?.programa || '—'}
                slotProps={{ input: { readOnly: true } }}
                sx={readOnlySx}
              />
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* Primer invitado */}
        <Accordion
          defaultExpanded
          elevation={0}
          sx={{
            border: '1px solid #E5EAF0',
            borderRadius: '12px !important',
            mb: 2,
            backgroundColor: '#FFFFFF',
            '&:before': { display: 'none' },
          }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box>
              <Typography sx={{ fontWeight: 700, color: '#0B1A2A' }}>
                Añada primer invitado
              </Typography>
              <Typography sx={{ color: '#5A6A7A', fontSize: '0.8rem' }}>
                Datos de la persona que te acompañará en la ceremonia.
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: '1fr 1fr',
                  md: '1fr 1fr 1fr 1fr',
                },
                gap: 2,
              }}
            >
              <TextField
                size="small"
                label="Nombre completo del invitado *"
                placeholder="Nombre completo"
                value={invitado1.nombre}
                onChange={(e) =>
                  setInvitado1((p) => ({ ...p, nombre: e.target.value }))
                }
                sx={fieldSx}
              />
              <TextField
                size="small"
                label="Cédula *"
                placeholder="Solo números"
                value={invitado1.cedula}
                onChange={(e) =>
                  setInvitado1((p) => ({
                    ...p,
                    cedula: onlyDigits(e.target.value),
                  }))
                }
                slotProps={{ htmlInput: { inputMode: 'numeric', maxLength: 15 } }}
                sx={fieldSx}
              />
              <TextField
                size="small"
                label="Teléfono *"
                placeholder="Solo números"
                value={invitado1.telefono}
                onChange={(e) =>
                  setInvitado1((p) => ({
                    ...p,
                    telefono: onlyDigits(e.target.value),
                  }))
                }
                slotProps={{ htmlInput: { inputMode: 'numeric', maxLength: 15 } }}
                sx={fieldSx}
              />
              <TextField
                select
                size="small"
                label="Parentesco *"
                value={invitado1.parentesco}
                onChange={(e) =>
                  setInvitado1((p) => ({ ...p, parentesco: e.target.value }))
                }
                sx={fieldSx}
              >
                <MenuItem value="">Seleccionar</MenuItem>
                {PARENTESCO_OPTIONS.map((o) => (
                  <MenuItem key={o} value={o}>
                    {o}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* Segundo invitado */}
        <Accordion
          defaultExpanded
          elevation={0}
          sx={{
            border: '1px solid #E5EAF0',
            borderRadius: '12px !important',
            mb: 2,
            backgroundColor: '#FFFFFF',
            '&:before': { display: 'none' },
          }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box>
              <Typography sx={{ fontWeight: 700, color: '#0B1A2A' }}>
                Añada segundo invitado
              </Typography>
              <Typography sx={{ color: '#5A6A7A', fontSize: '0.8rem' }}>
                Datos del segundo acompañante en la ceremonia.
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: '1fr 1fr',
                  md: '1fr 1fr 1fr 1fr',
                },
                gap: 2,
              }}
            >
              <TextField
                size="small"
                label="Nombre completo del invitado *"
                placeholder="Nombre completo"
                value={invitado2.nombre}
                onChange={(e) =>
                  setInvitado2((p) => ({ ...p, nombre: e.target.value }))
                }
                sx={fieldSx}
              />
              <TextField
                size="small"
                label="Cédula *"
                placeholder="Solo números"
                value={invitado2.cedula}
                onChange={(e) =>
                  setInvitado2((p) => ({
                    ...p,
                    cedula: onlyDigits(e.target.value),
                  }))
                }
                slotProps={{ htmlInput: { inputMode: 'numeric', maxLength: 15 } }}
                sx={fieldSx}
              />
              <TextField
                size="small"
                label="Teléfono *"
                placeholder="Solo números"
                value={invitado2.telefono}
                onChange={(e) =>
                  setInvitado2((p) => ({
                    ...p,
                    telefono: onlyDigits(e.target.value),
                  }))
                }
                slotProps={{ htmlInput: { inputMode: 'numeric', maxLength: 15 } }}
                sx={fieldSx}
              />
              <TextField
                select
                size="small"
                label="Parentesco *"
                value={invitado2.parentesco}
                onChange={(e) =>
                  setInvitado2((p) => ({ ...p, parentesco: e.target.value }))
                }
                sx={fieldSx}
              >
                <MenuItem value="">Seleccionar</MenuItem>
                {PARENTESCO_OPTIONS.map((o) => (
                  <MenuItem key={o} value={o}>
                    {o}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
          </AccordionDetails>
        </Accordion>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 1.5,
            mt: 2,
            flexWrap: 'wrap',
          }}
        >
          <Button
            variant="outlined"
            onClick={() => {
              localStorage.removeItem('me_graduando_auth');
              localStorage.removeItem('me_graduando_cedula');
              localStorage.removeItem('me_graduando_codigo');
              navigate('/registro-invitados');
            }}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              borderRadius: '8px',
              borderColor: '#C5CDD8',
              color: '#1A2A3A',
            }}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={saving}
            sx={{
              backgroundColor: '#1565C0',
              textTransform: 'none',
              fontWeight: 700,
              borderRadius: '8px',
              px: 3,
              boxShadow: 'none',
              '&:hover': {
                backgroundColor: '#0D47A1',
                boxShadow: 'none',
              },
            }}
          >
            {saving ? 'Guardando…' : 'Registrar invitados'}
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
