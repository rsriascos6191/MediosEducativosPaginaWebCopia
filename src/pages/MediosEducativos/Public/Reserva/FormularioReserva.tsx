/**
 * Portal público – Formulario de solicitud de reserva
 */

import { useEffect, useState, type FormEvent } from 'react';
import {
  Alert, Box, Typography, Button, Container, TextField, MenuItem, Checkbox,
  FormControlLabel, Accordion, AccordionSummary, AccordionDetails, CircularProgress,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  crearSolicitudReserva,
  obtenerCampus,
  obtenerEspacios,
  obtenerTiposEspacio,
  type CampusOption,
  type EspacioOption,
  type NuevaSolicitudReserva,
  type TipoEspacioOption,
} from '../../../../services/api';

export default function FormularioReserva() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const espacioInicial = Number(searchParams.get('espacio'));
  const fechaInicial = searchParams.get('fecha') || '';
  const [campusOptions, setCampusOptions] = useState<CampusOption[]>([]);
  const [espacioOptions, setEspacioOptions] = useState<EspacioOption[]>([]);
  const [tipoEspacioOptions, setTipoEspacioOptions] = useState<TipoEspacioOption[]>([]);
  const [loadingCatalogos, setLoadingCatalogos] = useState(true);
  const [form, setForm] = useState<NuevaSolicitudReserva>({
    fechaInicio: fechaInicial,
    fechaFin: fechaInicial,
    horaInicio: searchParams.get('horaInicio') || '',
    horaFin: searchParams.get('horaFin') || '',
    nombreActividad: '',
    solicitante: '',
    cargo: '',
    correo: '',
    numeroContacto: '',
    dependencia: '',
    programa: '',
    grupo: '',
    campus: '',
    tipoEspacio: '',
    idEspacio: Number.isInteger(espacioInicial) && espacioInicial > 0 ? espacioInicial : 0,
    medios: [],
    observaciones: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let activo = true;

    Promise.all([obtenerCampus(), obtenerTiposEspacio(), obtenerEspacios()])
      .then(([campus, tiposEspacio, espacios]) => {
        if (!activo) return;
        setCampusOptions(campus);
        setTipoEspacioOptions(tiposEspacio);
        setEspacioOptions(espacios);
        const espacioSeleccionado = espacios.find(
          (espacio) => espacio.id_espacio === espacioInicial,
        );
        if (espacioSeleccionado) {
          setForm((actual) => ({
            ...actual,
            campus: espacioSeleccionado.campus,
            tipoEspacio: espacioSeleccionado.tipo_espacio,
            idEspacio: espacioSeleccionado.id_espacio,
          }));
        }
      })
      .catch((catalogError: unknown) => {
        if (!activo) return;
        setError(
          catalogError instanceof Error
            ? catalogError.message
            : 'No fue posible cargar los campus y espacios disponibles.',
        );
      })
      .finally(() => {
        if (activo) setLoadingCatalogos(false);
      });

    return () => {
      activo = false;
    };
  }, [espacioInicial]);

  const espaciosFiltrados = espacioOptions.filter(
    (espacio) =>
      (!form.campus || espacio.campus === form.campus) &&
      (!form.tipoEspacio || espacio.tipo_espacio === form.tipoEspacio),
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setSaving(true);

    try {
      const solicitud = await crearSolicitudReserva(form);
      navigate('/reserva/confirmacion', { state: { solicitud } });
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : 'No fue posible guardar la solicitud. Inténtalo nuevamente.',
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Box sx={{ backgroundColor: '#6B7A8A', py: 4 }}>
        <Container maxWidth="lg">
          <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem', fontWeight: 600, mb: 1 }}>MEDIOS EDUCATIVOS</Typography>
          <Typography sx={{ color: '#FFFFFF', fontWeight: 800, fontSize: { xs: '1.75rem', md: '2.25rem' }, mb: 0.5 }}>
            Solicitud de reserva
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.85)' }}>
            Completa los datos de la solicitud. No necesitas crear una cuenta.
          </Typography>
          <Box sx={{ width: 40, height: 3, backgroundColor: '#E30613', mt: 2 }} />
        </Container>
      </Box>

      <Box component="form" onSubmit={handleSubmit}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Steps */}
        <Box sx={{
          display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap', backgroundColor: '#FFFFFF',
          borderRadius: '12px', border: '1px solid #E5EAF0', p: 1.5, justifyContent: 'center',
        }}>
          {['01 Solicitante', '02 Evento', '03 Reserva', '04 Información', '05 Medios'].map((s, i) => (
            <Typography key={s} sx={{
              fontSize: '0.8rem', fontWeight: i === 0 ? 700 : 500,
              color: i === 0 ? '#0B3A5C' : '#9AA5B5', px: 1.5,
            }}>
              {s}
            </Typography>
          ))}
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {/* 01 Datos del evento */}
        <Accordion defaultExpanded elevation={0} sx={{ border: '1px solid #E5EAF0', borderRadius: '12px !important', mb: 2, '&:before': { display: 'none' } }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box>
              <Typography sx={{ fontWeight: 700, color: '#0B1A2A' }}>01 Datos del evento</Typography>
              <Typography sx={{ color: '#5A6A7A', fontSize: '0.8rem' }}>Información principal de la actividad que se desea registrar.</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' }, gap: 2 }}>
              <TextField required size="small" type="date" label="Fecha de inicio *" value={form.fechaInicio}
                onChange={(event) => setForm({ ...form, fechaInicio: event.target.value })}
                slotProps={{ inputLabel: { shrink: true } }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }} />
              <TextField required size="small" type="date" label="Fecha de fin *" value={form.fechaFin}
                onChange={(event) => setForm({ ...form, fechaFin: event.target.value })}
                slotProps={{ inputLabel: { shrink: true } }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }} />
              <TextField required select size="small" label="Hora de inicio *" value={form.horaInicio}
                onChange={(event) => setForm({ ...form, horaInicio: event.target.value })}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}>
                <MenuItem value="">Seleccionar hora</MenuItem>
                {['07:00', '08:00', '09:00', '10:00', '14:00'].map((h) => <MenuItem key={h} value={h}>{h}</MenuItem>)}
              </TextField>
              <TextField required select size="small" label="Hora de finalización *" value={form.horaFin}
                onChange={(event) => setForm({ ...form, horaFin: event.target.value })}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}>
                <MenuItem value="">Seleccionar hora</MenuItem>
                {['08:00', '09:00', '10:00', '12:00', '16:00'].map((h) => <MenuItem key={h} value={h}>{h}</MenuItem>)}
              </TextField>
              <TextField required size="small" label="Nombre del evento *" placeholder="Ingresar nombre del evento"
                value={form.nombreActividad}
                onChange={(event) => setForm({ ...form, nombreActividad: event.target.value })}
                sx={{ gridColumn: { sm: 'span 2' }, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }} />
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* 02 Datos del solicitante */}
        <Accordion defaultExpanded elevation={0} sx={{ border: '1px solid #E5EAF0', borderRadius: '12px !important', mb: 2, '&:before': { display: 'none' } }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box>
              <Typography sx={{ fontWeight: 700, color: '#0B1A2A' }}>02 Datos del solicitante</Typography>
              <Typography sx={{ color: '#5A6A7A', fontSize: '0.8rem' }}>Información de contacto de quien realiza la solicitud.</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' }, gap: 2 }}>
              <TextField required size="small" label="Nombre completo *" placeholder="Ingresar nombre completo"
                value={form.solicitante} onChange={(event) => setForm({ ...form, solicitante: event.target.value })}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }} />
              <TextField required size="small" label="Cargo / rol *" placeholder="Ingresar cargo o rol"
                value={form.cargo} onChange={(event) => setForm({ ...form, cargo: event.target.value })}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }} />
              <TextField required size="small" type="email" label="Correo electrónico *" placeholder="Ingresar correo electrónico"
                value={form.correo} onChange={(event) => setForm({ ...form, correo: event.target.value })}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }} />
              <TextField required size="small" label="Número de contacto *" placeholder="Ingresar número de contacto"
                value={form.numeroContacto} onChange={(event) => setForm({ ...form, numeroContacto: event.target.value })}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }} />
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* 03 Dependencia */}
        <Accordion defaultExpanded elevation={0} sx={{ border: '1px solid #E5EAF0', borderRadius: '12px !important', mb: 2, '&:before': { display: 'none' } }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box>
              <Typography sx={{ fontWeight: 700, color: '#0B1A2A' }}>03 Dependencia / procedencia</Typography>
              <Typography sx={{ color: '#5A6A7A', fontSize: '0.8rem' }}>Identifica la procedencia institucional del solicitante.</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' }, gap: 2 }}>
              <TextField required select size="small" label="Dependencia general *" value={form.dependencia}
                onChange={(event) => setForm({ ...form, dependencia: event.target.value })}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}>
                <MenuItem value="">Seleccione una opción</MenuItem>
                <MenuItem value="Académica">Académica</MenuItem>
                <MenuItem value="Administrativa">Administrativa</MenuItem>
              </TextField>
              <TextField required select size="small" label="Programa / Dependencia específico *" value={form.programa}
                onChange={(event) => setForm({ ...form, programa: event.target.value })}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}>
                <MenuItem value="">Seleccione una opción</MenuItem>
                <MenuItem value="Ingeniería">Ingeniería de Sistemas</MenuItem>
                <MenuItem value="Educación">Educación</MenuItem>
              </TextField>
              <TextField size="small" label="Especifique el grupo" placeholder="Ingresar información si corresponde"
                value={form.grupo} onChange={(event) => setForm({ ...form, grupo: event.target.value })}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }} />
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* 04 Ubicación */}
        <Accordion defaultExpanded elevation={0} sx={{ border: '1px solid #E5EAF0', borderRadius: '12px !important', mb: 2, '&:before': { display: 'none' } }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box>
              <Typography sx={{ fontWeight: 700, color: '#0B1A2A' }}>04 Ubicación y espacio</Typography>
              <Typography sx={{ color: '#5A6A7A', fontSize: '0.8rem' }}>Define el campus, tipo de espacio y espacio específico.</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' }, gap: 2 }}>
              <TextField required select size="small" label="Campus *" value={form.campus}
                disabled={loadingCatalogos}
                onChange={(event) => setForm({
                  ...form,
                  campus: event.target.value,
                  tipoEspacio: '',
                  idEspacio: 0,
                })}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}>
                <MenuItem value="">Seleccione campus</MenuItem>
                {campusOptions.map((campus) => (
                  <MenuItem key={campus.id_campus} value={campus.nombre}>
                    {campus.nombre}
                  </MenuItem>
                ))}
              </TextField>
              <TextField required select size="small" label="Tipo de espacio *" value={form.tipoEspacio}
                disabled={loadingCatalogos || !form.campus}
                onChange={(event) => setForm({
                  ...form,
                  tipoEspacio: event.target.value,
                  idEspacio: 0,
                })}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}>
                <MenuItem value="">Seleccione tipo de espacio</MenuItem>
                {tipoEspacioOptions.map((tipo) => (
                  <MenuItem key={tipo.id_tipo_espacio} value={tipo.nombre}>
                    {tipo.nombre}
                  </MenuItem>
                ))}
              </TextField>
              <TextField required select size="small" label="Espacio específico *" value={form.idEspacio || ''}
                disabled={loadingCatalogos || !form.tipoEspacio}
                onChange={(event) => setForm({ ...form, idEspacio: Number(event.target.value) })}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}>
                <MenuItem value="">
                  {espaciosFiltrados.length > 0
                    ? 'Seleccione espacio'
                    : 'No hay espacios activos para este tipo en el campus'}
                </MenuItem>
                {espaciosFiltrados.map((espacio) => (
                  <MenuItem key={espacio.id_espacio} value={espacio.id_espacio}>
                    {espacio.nombre}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* 05 Medios */}
        <Accordion defaultExpanded elevation={0} sx={{ border: '1px solid #E5EAF0', borderRadius: '12px !important', mb: 3, '&:before': { display: 'none' } }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box>
              <Typography sx={{ fontWeight: 700, color: '#0B1A2A' }}>05 Medios requeridos</Typography>
              <Typography sx={{ color: '#5A6A7A', fontSize: '0.8rem' }}>Selecciona los medios necesarios para la actividad.</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Typography sx={{ fontSize: '0.85rem', color: '#1A2A3A', mb: 1 }}>Seleccione los medios necesarios:</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              {['Proyector', 'Sonido', 'Micrófono', 'Computador', 'Otro'].map((m) => (
                <FormControlLabel key={m}
                  control={<Checkbox size="small" checked={form.medios.includes(m)}
                    onChange={(event) => setForm({
                      ...form,
                      medios: event.target.checked
                        ? [...form.medios, m]
                        : form.medios.filter((medio) => medio !== m),
                    })} />}
                  label={<Typography sx={{ fontSize: '0.875rem' }}>{m}</Typography>}
                />
              ))}
            </Box>
            <TextField fullWidth size="small" label="Observaciones" multiline rows={3}
              value={form.observaciones}
              onChange={(event) => setForm({ ...form, observaciones: event.target.value })}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }} />
          </AccordionDetails>
        </Accordion>

        {/* Footer submit */}
        <Box sx={{
          backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5EAF0',
          p: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2,
        }}>
          <Box>
            <Typography sx={{ fontWeight: 600, fontSize: '0.9rem', color: '#0B1A2A' }}>Revisión de la solicitud</Typography>
            <Typography sx={{ color: '#5A6A7A', fontSize: '0.85rem' }}>
              La solicitud será revisada por el área encargada antes de su confirmación.
            </Typography>
          </Box>
          <Button type="submit" variant="contained" disabled={saving}
            sx={{
              backgroundColor: '#E30613', textTransform: 'none', fontWeight: 700, borderRadius: '8px',
              px: 3, py: 1.2, boxShadow: 'none', '&:hover': { backgroundColor: '#C10510', boxShadow: 'none' },
            }}>
            {saving ? <><CircularProgress size={18} color="inherit" sx={{ mr: 1 }} /> Guardando...</> : 'Enviar solicitud →'}
          </Button>
        </Box>
      </Container>
      </Box>
    </>
  );
}
