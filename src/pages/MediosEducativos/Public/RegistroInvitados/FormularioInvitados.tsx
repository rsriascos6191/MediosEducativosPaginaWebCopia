/**
 * Formulario de registro de invitados de graduandos.
 * - Datos del graduando (solo lectura, según cédula del login)
 * - Invitados dentro del límite definido para la ceremonia
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

const calcularInvitadosDisponibles = (graduando: GraduandoRegistroPublico) =>
  Math.max(0, graduando.maxInvitadosPorGraduando - graduando.invitadosRegistrados);

export default function FormularioInvitados() {
  const navigate = useNavigate();
  const cedulaLogin = localStorage.getItem('me_graduando_cedula') || '';
  const codigoLogin = localStorage.getItem('me_graduando_codigo') || '';
  const auth = localStorage.getItem('me_graduando_auth') === 'true';

  const [graduando, setGraduando] = useState<GraduandoRegistroPublico | null>(null);
  const [loading, setLoading] = useState(true);
  const [invitados, setInvitados] = useState<InvitadoForm[]>([]);
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
        setInvitados(Array.from(
          { length: calcularInvitadosDisponibles(g) },
          emptyInvitado,
        ));
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

  const actualizarInvitado = (index: number, campo: keyof InvitadoForm, valor: string) => {
    setInvitados((actuales) => actuales.map((invitado, posicion) =>
      posicion === index ? { ...invitado, [campo]: valor } : invitado
    ));
  };

  const handleSubmit = async () => {
    setError('');
    setSuccess('');
    if (!graduando) {
      setError('No se encontró el graduando asociado a esta cédula.');
      return;
    }

    const invitadosPendientes = invitados.map((datos, index) => ({
      datos,
      etiqueta: `Invitado ${graduando.invitadosRegistrados + index + 1}`,
    })).filter(({ datos }) =>
      datos.nombre.trim() || datos.cedula.trim() ||
      datos.telefono.trim() || datos.parentesco
    );
    if (invitadosPendientes.length === 0) {
      setError(
        invitados.length === 0
          ? 'Ya alcanzaste el máximo de invitados permitido para esta ceremonia.'
          : validateInvitado(
            invitados[0],
            `Invitado ${graduando.invitadosRegistrados + 1}`,
          ) || 'Ingresa los datos del invitado.'
      );
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
      const graduandoActualizado = {
        ...graduando,
        invitadosRegistrados: graduando.invitadosRegistrados + guardados.length,
      };
      setGraduando(graduandoActualizado);
      setInvitados(Array.from(
        { length: calcularInvitadosDisponibles(graduandoActualizado) },
        emptyInvitado,
      ));
      setSuccess(
        'Invitados registrados correctamente. Podrás verlos en el módulo de ceremonias del panel administrativo.'
      );
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
        {graduando && (
          <Alert severity={invitados.length === 0 ? 'warning' : 'info'} sx={{ mb: 2, borderRadius: '8px' }}>
            Cupos disponibles para ti: {invitados.length}. Invitados tuyos:
            {' '}{graduando.invitadosRegistrados}/{graduando.maxInvitadosPorGraduando}.
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

        {invitados.map((invitado, index) => (
          <Accordion
            key={index}
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
                  Añada invitado {(graduando?.invitadosRegistrados ?? 0) + index + 1}
                </Typography>
                <Typography sx={{ color: '#5A6A7A', fontSize: '0.8rem' }}>
                  Datos del acompañante en la ceremonia.
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
                  value={invitado.nombre}
                  onChange={(e) => actualizarInvitado(index, 'nombre', e.target.value)}
                  sx={fieldSx}
                />
                <TextField
                  size="small"
                  label="Cédula *"
                  placeholder="Solo números"
                  value={invitado.cedula}
                  onChange={(e) => actualizarInvitado(index, 'cedula', onlyDigits(e.target.value))}
                  slotProps={{ htmlInput: { inputMode: 'numeric', maxLength: 15 } }}
                  sx={fieldSx}
                />
                <TextField
                  size="small"
                  label="Teléfono *"
                  placeholder="Solo números"
                  value={invitado.telefono}
                  onChange={(e) => actualizarInvitado(index, 'telefono', onlyDigits(e.target.value))}
                  slotProps={{ htmlInput: { inputMode: 'numeric', maxLength: 15 } }}
                  sx={fieldSx}
                />
                <TextField
                  select
                  size="small"
                  label="Parentesco *"
                  value={invitado.parentesco}
                  onChange={(e) => actualizarInvitado(index, 'parentesco', e.target.value)}
                  sx={fieldSx}
                >
                  <MenuItem value="">Seleccionar</MenuItem>
                  {PARENTESCO_OPTIONS.map((opcion) => (
                    <MenuItem key={opcion} value={opcion}>{opcion}</MenuItem>
                  ))}
                </TextField>
              </Box>
            </AccordionDetails>
          </Accordion>
        ))}

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
            disabled={saving || invitados.length === 0}
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
            {saving ? 'Guardando…' : invitados.length === 0 ? 'Límite alcanzado' : 'Registrar invitados'}
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
