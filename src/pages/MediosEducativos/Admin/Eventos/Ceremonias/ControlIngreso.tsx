/**
 * Pantalla: Control de ingreso — Sesión
 */

import { useCallback, useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import {
  Alert, Box, Typography, Button, TextField, MenuItem, Card, CardContent, Chip,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress,
} from '@mui/material';
import type {
  Ceremonia,
  ConteoControlIngreso,
  EstadisticasControlIngreso,
  Graduando,
  Invitado,
  Sesion,
} from './interfaces/ceremonias.interface';
import {
  buscarGraduandosControlIngreso,
  getCeremoniaById,
  getEstadisticasControlIngreso,
  getInvitadosControlIngreso,
  getSesiones,
  registrarIngreso,
  registrarIngresoGraduando,
} from './services/ceremonias.service';

function nombreSesion(sesion: Sesion): string {
  const nombre = sesion.nombre.trim();
  return nombre && !/^\d+$/.test(nombre) ? nombre : `Sesión ${sesion.numeroSesion}`;
}

function Contadores({
  titulo,
  conteo,
}: {
  titulo: string;
  conteo: ConteoControlIngreso | null;
}) {
  return (
    <>
      <Typography sx={{ fontWeight: 600, fontSize: '0.95rem', color: '#1A2A3A', mb: 1 }}>
        {titulo}
      </Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1.5, mb: 2.5 }}>
        {[
          { label: 'Registrados', value: conteo?.registrados },
          { label: 'Ingresaron', value: conteo?.ingresaron },
          { label: 'Pendientes', value: conteo?.pendientes },
        ].map((item) => (
          <Card key={item.label} elevation={0} sx={{ borderRadius: '10px', border: '1px solid #E5EAF0' }}>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 }, textAlign: 'center' }}>
              <Typography sx={{ color: '#5A6A7A', fontSize: '0.8rem' }}>{item.label}</Typography>
              <Typography sx={{ fontWeight: 700, fontSize: '1.5rem', color: '#0B1A2A' }}>
                {item.value ?? '—'}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </>
  );
}

export default function ControlIngreso() {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedSessionId = searchParams.get('sesion') || '';
  const [ceremonia, setCeremonia] = useState<Ceremonia | null>(null);
  const [sesiones, setSesiones] = useState<Sesion[]>([]);
  const [estadisticas, setEstadisticas] = useState<EstadisticasControlIngreso | null>(null);
  const [graduando, setGraduando] = useState<Graduando | null>(null);
  const [resultadosBusqueda, setResultadosBusqueda] = useState<Graduando[]>([]);
  const [invitados, setInvitados] = useState<Invitado[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingEstadisticas, setLoadingEstadisticas] = useState(false);
  const [loadingBusqueda, setLoadingBusqueda] = useState(false);
  const [loadingInvitados, setLoadingInvitados] = useState(false);
  const [savingId, setSavingId] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const selectedSession = sesiones.find((sesion) => sesion.id === selectedSessionId) || null;

  useEffect(() => {
    if (!id) {
      setError('No se indicó la ceremonia.');
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    Promise.all([getCeremoniaById(id), getSesiones(id)])
      .then(([ceremoniaActual, sesionesActuales]) => {
        if (!ceremoniaActual) throw new Error('No se encontró la ceremonia.');
        if (cancelled) return;
        setCeremonia(ceremoniaActual);
        setSesiones(sesionesActuales);
        setError('');
      })
      .catch((loadError: unknown) => {
        if (cancelled) return;
        setError(loadError instanceof Error ? loadError.message : 'No fue posible cargar la ceremonia.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [id]);

  useEffect(() => {
    if (loading) return;

    if (sesiones.length === 1) {
      const unicaSesionId = sesiones[0].id;
      if (selectedSessionId !== unicaSesionId) {
        const parametros = new URLSearchParams(searchParams);
        parametros.set('sesion', unicaSesionId);
        setSearchParams(parametros, { replace: true });
      }
      return;
    }

    if (selectedSessionId && !sesiones.some((sesion) => sesion.id === selectedSessionId)) {
      setError('La sesión indicada en la URL no pertenece a esta ceremonia.');
      const parametros = new URLSearchParams(searchParams);
      parametros.delete('sesion');
      setSearchParams(parametros, { replace: true });
    }
  }, [loading, sesiones, selectedSessionId, searchParams, setSearchParams]);

  useEffect(() => {
    if (!id || !selectedSessionId || !selectedSession) {
      setEstadisticas(null);
      return;
    }

    let cancelled = false;
    setLoadingEstadisticas(true);
    setError('');
    getEstadisticasControlIngreso(id, selectedSessionId)
      .then((conteos) => {
        if (!cancelled) setEstadisticas(conteos);
      })
      .catch((loadError: unknown) => {
        if (!cancelled) {
          setEstadisticas(null);
          setError(loadError instanceof Error ? loadError.message : 'No fue posible cargar los contadores.');
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingEstadisticas(false);
      });

    return () => { cancelled = true; };
  }, [id, selectedSessionId, selectedSession]);

  const handleSessionChange = (sesionId: string) => {
    const parametros = new URLSearchParams(searchParams);
    if (sesionId) parametros.set('sesion', sesionId);
    else parametros.delete('sesion');
    setSearchParams(parametros);
    setGraduando(null);
    setResultadosBusqueda([]);
    setInvitados([]);
    setEstadisticas(null);
    setError('');
    setNotice('');
  };

  const seleccionarGraduando = useCallback(async (seleccionado: Graduando) => {
    if (!id || !selectedSessionId) return;
    setError('');
    setNotice('');
    setGraduando(seleccionado);
    setInvitados([]);
    setLoadingInvitados(true);
    try {
      const lista = await getInvitadosControlIngreso(id, selectedSessionId, seleccionado.id);
      setInvitados(lista);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'No fue posible cargar los invitados autorizados.');
    } finally {
      setLoadingInvitados(false);
    }
  }, [id, selectedSessionId]);

  const handleSearch = async () => {
    if (!id || !selectedSessionId) {
      setError('Selecciona una sesión antes de buscar.');
      return;
    }
    if (!search.trim()) {
      setError('Ingresa un nombre o documento para buscar.');
      return;
    }

    setError('');
    setNotice('');
    setGraduando(null);
    setInvitados([]);
    setResultadosBusqueda([]);
    setLoadingBusqueda(true);
    try {
      const resultados = await buscarGraduandosControlIngreso(id, selectedSessionId, search.trim());
      setResultadosBusqueda(resultados);
      if (resultados.length === 1) await seleccionarGraduando(resultados[0]);
    } catch (searchError) {
      setError(searchError instanceof Error ? searchError.message : 'No fue posible buscar el graduando.');
    } finally {
      setLoadingBusqueda(false);
    }
  };

  const handleRegistrarGraduando = async () => {
    if (!id || !selectedSessionId || !graduando) return;
    setSavingId(`graduando:${graduando.id}`);
    setError('');
    setNotice('');
    try {
      const resultado = await registrarIngresoGraduando(id, graduando.id, selectedSessionId);
      setGraduando((actual) => actual ? {
        ...actual,
        estadoIngreso: 'Ingresó',
        horaIngreso: resultado.horaIngreso,
      } : actual);
      setEstadisticas(resultado.estadisticas);
      setNotice(resultado.horaIngreso
        ? `${resultado.mensaje} · ${resultado.horaIngreso}`
        : resultado.mensaje);
    } catch (registerError) {
      setError(registerError instanceof Error ? registerError.message : 'No fue posible registrar el ingreso del graduando.');
    } finally {
      setSavingId('');
    }
  };

  const handleRegistrarInvitado = async (invitado: Invitado) => {
    if (!selectedSessionId) return;
    setSavingId(`invitado:${invitado.id}`);
    setError('');
    setNotice('');
    try {
      const resultado = await registrarIngreso(invitado.id, selectedSessionId);
      setInvitados((actuales) => actuales.map((actual) => actual.id === invitado.id
        ? { ...actual, estadoIngreso: 'Ingresó', horaIngreso: resultado.horaIngreso || undefined }
        : actual));
      setEstadisticas(resultado.estadisticas);
      setNotice(resultado.horaIngreso
        ? `${resultado.mensaje} · ${resultado.horaIngreso}`
        : resultado.mensaje);
    } catch (registerError) {
      setError(registerError instanceof Error ? registerError.message : 'No fue posible registrar el ingreso del invitado.');
    } finally {
      setSavingId('');
    }
  };

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress sx={{ color: '#0B3A5C' }} /></Box>;
  }

  const sesionLabel = selectedSession ? nombreSesion(selectedSession) : 'No disponible';

  return (
    <>
      <Box sx={{ mb: 2.5 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#0B1A2A', fontSize: '1.5rem', mb: 0.5 }}>
          {ceremonia?.codigo || '—'} · Control de ingreso{selectedSession ? ` — ${sesionLabel}` : ''}
        </Typography>
        <Typography sx={{ color: '#5A6A7A', fontSize: '0.875rem' }}>
          Eventos institucionales / Ceremonias de grado / Control de ingreso
          {selectedSession ? ` / ${sesionLabel}` : ''}
        </Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {notice && <Alert severity="success" sx={{ mb: 2 }}>{notice}</Alert>}

      <Box sx={{
        backgroundColor: '#0B3A5C', borderRadius: '12px', px: 3, py: 2, mb: 2.5,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1,
      }}>
        <Box>
          <Typography sx={{ color: '#FFFFFF', fontWeight: 700, fontSize: '1.05rem' }}>
            {ceremonia?.nombre || 'No disponible'}{selectedSession ? ` · ${sesionLabel}` : ''}
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.85rem' }}>
            Fecha: {ceremonia?.fecha || '—'} · Lugar: {ceremonia?.lugar || '—'}
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.8rem' }}>
            Hora: {selectedSession
              ? `${selectedSession.horaInicio || '—'} – ${selectedSession.horaFin || '—'}`
              : '—'}
            {' · Programas: '}
            {selectedSession?.programas.length ? selectedSession.programas.join(', ') : '—'}
          </Typography>
        </Box>
        <Typography sx={{ color: '#FFFFFF', fontWeight: 600 }}>
          Estado: {selectedSession?.estado || 'No disponible'}
        </Typography>
      </Box>

      {sesiones.length > 0 ? (
        <TextField
          select
          fullWidth
          size="small"
          label="Sesión"
          value={selectedSessionId}
          disabled={sesiones.length === 1}
          onChange={(event) => handleSessionChange(event.target.value)}
          sx={{ mb: 2.5, maxWidth: 480, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
        >
          {sesiones.length > 1 && <MenuItem value="">Selecciona una sesión</MenuItem>}
          {sesiones.map((sesion) => (
            <MenuItem key={sesion.id} value={sesion.id}>{nombreSesion(sesion)}</MenuItem>
          ))}
        </TextField>
      ) : (
        <Alert severity="info" sx={{ mb: 2.5 }}>No hay sesiones configuradas para esta ceremonia.</Alert>
      )}

      {sesiones.length > 1 && !selectedSessionId ? (
        <Alert severity="info">Selecciona una sesión para consultar el control de ingreso.</Alert>
      ) : selectedSession ? (
        <>
          {loadingEstadisticas && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
              <CircularProgress size={28} sx={{ color: '#0B3A5C' }} />
            </Box>
          )}
          <Contadores titulo="Invitados" conteo={estadisticas?.invitados || null} />
          <Contadores titulo="Graduandos" conteo={estadisticas?.graduandos || null} />

          <Box sx={{
            backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5EAF0',
            p: 2, mb: 2, display: 'flex', gap: 1.5, alignItems: 'center',
          }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Nombre o número de documento"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              onKeyDown={(event) => { if (event.key === 'Enter') void handleSearch(); }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
            />
            <Button
              variant="contained"
              onClick={() => void handleSearch()}
              disabled={loadingBusqueda}
              sx={{ backgroundColor: '#0B3A5C', textTransform: 'none', fontWeight: 600, borderRadius: '8px', px: 3, whiteSpace: 'nowrap',
                '&:hover': { backgroundColor: '#062A42' } }}
            >
              {loadingBusqueda ? 'Buscando…' : 'Buscar'}
            </Button>
          </Box>

          {resultadosBusqueda.length > 1 && (
            <Box sx={{ backgroundColor: '#FFFFFF', border: '1px solid #E5EAF0', borderRadius: '12px', p: 2, mb: 2 }}>
              <Typography sx={{ fontWeight: 600, mb: 1 }}>Selecciona el graduando</Typography>
              {resultadosBusqueda.map((resultado) => (
                <Button
                  key={resultado.id}
                  fullWidth
                  onClick={() => void seleccionarGraduando(resultado)}
                  sx={{ justifyContent: 'space-between', textTransform: 'none', color: '#1A2A3A' }}
                >
                  <span>{resultado.nombres} {resultado.apellidos}</span>
                  <span>{resultado.documento}</span>
                </Button>
              ))}
            </Box>
          )}

          {graduando ? (
            <Box sx={{
              backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5EAF0',
              p: 2.5, mb: 2.5, display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' }, gap: 2,
            }}>
              <Box>
                <Typography sx={{ color: '#5A6A7A', fontSize: '0.8rem' }}>Graduando seleccionado</Typography>
                <Typography sx={{ fontWeight: 700, fontSize: '1.1rem', color: '#0B1A2A' }}>
                  {graduando.nombres} {graduando.apellidos}
                </Typography>
                <Typography sx={{ color: '#5A6A7A', fontSize: '0.85rem' }}>
                  Documento: {graduando.documento || '—'}
                </Typography>
                <Typography sx={{ color: '#5A6A7A', fontSize: '0.85rem' }}>
                  Programa: {graduando.programa || '—'}
                </Typography>
              </Box>
              <Box>
                <Typography sx={{ color: '#5A6A7A', fontSize: '0.8rem' }}>Estado de ingreso</Typography>
                <Chip
                  label={graduando.estadoIngreso || 'Pendiente'}
                  size="small"
                  sx={{
                    backgroundColor: graduando.estadoIngreso === 'Ingresó' ? '#E6F4EA' : '#FFF4E5',
                    color: graduando.estadoIngreso === 'Ingresó' ? '#1B7A3D' : '#B76E00',
                    fontWeight: 600,
                    mt: 0.5,
                  }}
                />
                <Typography sx={{ color: '#5A6A7A', fontSize: '0.85rem', mt: 0.5 }}>
                  Sesión: {sesionLabel}
                </Typography>
              </Box>
              <Box sx={{ textAlign: { sm: 'right' } }}>
                {graduando.estadoIngreso === 'Ingresó' ? (
                  <Typography sx={{ color: '#1B7A3D', fontWeight: 600, fontSize: '0.9rem' }}>
                    Ya ingresó{graduando.horaIngreso ? ` · ${graduando.horaIngreso}` : ''}
                  </Typography>
                ) : (
                  <Button
                    variant="contained"
                    disabled={savingId === `graduando:${graduando.id}`}
                    onClick={() => void handleRegistrarGraduando()}
                    sx={{ backgroundColor: '#E30613', textTransform: 'none', fontWeight: 600, borderRadius: '8px',
                      '&:hover': { backgroundColor: '#C10510' } }}
                  >
                    {savingId === `graduando:${graduando.id}` ? 'Registrando…' : 'Registrar ingreso'}
                  </Button>
                )}
              </Box>
            </Box>
          ) : (
            <Box sx={{ backgroundColor: '#FFFFFF', border: '1px solid #E5EAF0', borderRadius: '12px', p: 3, mb: 2.5 }}>
              <Typography sx={{ color: '#5A6A7A' }}>Busca o escanea un documento</Typography>
            </Box>
          )}

          <Typography sx={{ fontWeight: 700, fontSize: '1.05rem', color: '#0B1A2A', mb: 0.5 }}>
            Invitados asociados
          </Typography>
          <Typography sx={{ color: '#5A6A7A', fontSize: '0.85rem', mb: 1.5 }}>
            Control individual de los invitados autorizados del graduando seleccionado.
          </Typography>

          {loadingInvitados ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
              <CircularProgress size={28} sx={{ color: '#0B3A5C' }} />
            </Box>
          ) : graduando ? (
            <TableContainer sx={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5EAF0', overflow: 'hidden', mb: 2 }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#FAFBFC' }}>
                    {['Invitado', 'Documento', 'Estado', 'Hora de ingreso', 'Acción'].map((heading) => (
                      <TableCell key={heading} sx={{ fontWeight: 600, color: '#1A2A3A', fontSize: '0.85rem', borderBottom: '1px solid #E5EAF0', py: 1.5 }}>
                        {heading}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {invitados.map((invitado) => (
                    <TableRow key={invitado.id} sx={{ '& td': { borderBottom: '1px solid #F0F3F7' } }}>
                      <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>{invitado.nombre || '—'}</TableCell>
                      <TableCell sx={{ fontSize: '0.875rem' }}>{invitado.documento || '—'}</TableCell>
                      <TableCell>
                        <Chip
                          label={invitado.estadoIngreso || 'Pendiente'}
                          size="small"
                          sx={{
                            backgroundColor: invitado.estadoIngreso === 'Ingresó' ? '#E6F4EA' : '#FFF4E5',
                            color: invitado.estadoIngreso === 'Ingresó' ? '#1B7A3D' : '#B76E00',
                            fontWeight: 600, fontSize: '0.75rem', height: 24,
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ fontSize: '0.875rem' }}>{invitado.horaIngreso || '—'}</TableCell>
                      <TableCell>
                        {invitado.estadoIngreso === 'Ingresó' ? (
                          <Typography sx={{ color: '#1B7A3D', fontSize: '0.85rem', fontWeight: 500 }}>
                            Ya ingresó{invitado.horaIngreso ? ` · ${invitado.horaIngreso}` : ''}
                          </Typography>
                        ) : (
                          <Button
                            variant="contained"
                            size="small"
                            disabled={savingId === `invitado:${invitado.id}`}
                            onClick={() => void handleRegistrarInvitado(invitado)}
                            sx={{
                              backgroundColor: '#E30613', textTransform: 'none', fontWeight: 600, borderRadius: '8px',
                              boxShadow: 'none', '&:hover': { backgroundColor: '#C10510', boxShadow: 'none' },
                            }}
                          >
                            {savingId === `invitado:${invitado.id}` ? 'Registrando…' : 'Registrar ingreso'}
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                  {invitados.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} sx={{ textAlign: 'center', py: 3, color: '#5A6A7A' }}>
                        No hay invitados autorizados asociados a este graduando.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Box sx={{ backgroundColor: '#FFFFFF', border: '1px solid #E5EAF0', borderRadius: '12px', p: 2, color: '#5A6A7A' }}>
              Busca un graduando para consultar sus invitados autorizados.
            </Box>
          )}
        </>
      ) : null}
    </>
  );
}
