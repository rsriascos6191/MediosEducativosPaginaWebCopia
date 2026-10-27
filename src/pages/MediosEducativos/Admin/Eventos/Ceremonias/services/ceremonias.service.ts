/**
 * Servicio de Ceremonias de grado.
 * Integración con el backend de ceremonias.
 */

import type {
  Ceremonia,
  Sesion,
  Graduando,
  Invitado,
  CeremoniaFilters,
  GraduandoFilters,
  GraduandoPayload,
  NuevaCeremonia,
  ProgramaOption,
  EstadisticasControlIngreso,
  ResultadoRegistroIngreso,
  EstadoCeremonia,
} from '../interfaces/ceremonias.interface';
import type {
  ImportGraduandoRow,
  ImportGraduandosPreview,
  ImportGraduandosResult,
} from '../importGraduandos.config';
import { fetchBackend } from '../../../../../../services/api';

async function respuestaCeremonia<T extends object>(respuesta: Response): Promise<T> {
  const tipoContenido = respuesta.headers.get('content-type') || '';
  if (!tipoContenido.toLowerCase().includes('json')) {
    if (respuesta.status === 404) {
      throw new Error(
        'El backend no reconoce esta ruta. Reinícialo desde la carpeta backend para cargar las rutas actuales.'
      );
    }
    throw new Error(`El backend devolvió una respuesta que no es JSON (HTTP ${respuesta.status}).`);
  }
  const resultado = (await respuesta.json()) as T & { mensaje?: string };
  if (!respuesta.ok) {
    throw new Error(
      'mensaje' in resultado && resultado.mensaje
        ? resultado.mensaje
        : 'No fue posible consultar las ceremonias.'
    );
  }
  return resultado as T;
}

export async function getCeremonias(
  filters?: CeremoniaFilters
): Promise<{ data: Ceremonia[]; total: number }> {
  const parametros = new URLSearchParams();
  if (filters?.nombre?.trim()) parametros.set('nombre', filters.nombre.trim());
  if (filters?.fecha) parametros.set('fecha', filters.fecha);
  if (filters?.estado && filters.estado !== 'Todos') {
    parametros.set('estado', filters.estado);
  }
  const query = parametros.size ? `?${parametros.toString()}` : '';
  const respuesta = await fetchBackend(`/api/ceremonias${query}`);
  return respuestaCeremonia<{ data: Ceremonia[]; total: number }>(respuesta);
}

export async function getCeremoniaById(id: string): Promise<Ceremonia | null> {
  const respuesta = await fetchBackend(`/api/ceremonias/${encodeURIComponent(id)}`);
  if (respuesta.status === 404) return null;
  return respuestaCeremonia<Ceremonia>(respuesta);
}

export async function getFotografiasCeremonia(id: string): Promise<FotoCeremonia[]> {
  const respuesta = await fetchBackend(
    `/api/ceremonias/${encodeURIComponent(id)}/fotografias`
  );
  const resultado = await respuestaCeremonia<{ fotos: FotoCeremonia[] }>(respuesta);
  return resultado.fotos;
}

export async function guardarFotografiasCeremonia(
  id: string,
  fotos: Pick<FotoCeremonia, 'mimeType' | 'base64'>[],
): Promise<{ guardadas: number; espaciosDisponibles: number }> {
  const respuesta = await fetchBackend(
    `/api/ceremonias/${encodeURIComponent(id)}/fotografias`,
    {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fotos }),
    },
  );
  return respuestaCeremonia<{ guardadas: number; espaciosDisponibles: number }>(respuesta);
}

export interface EventoOption {
  id_evento: number;
  tipo_evento: string;
}

export interface EspacioOption {
  id_espacio: number;
  nombre: string;
  campus: string;
}

export interface FotoCeremonia {
  slot: number;
  mimeType: string;
  base64: string;
}

export interface GraduandoRegistroPublico {
  id: string;
  ceremoniaId: string;
  nombres: string;
  apellidos: string;
  documento: string;
  codigoEstudiantil: string;
  programa: string;
  cupoInvitados: number;
  invitadosRegistrados: number;
}

export async function iniciarSesionGraduando(
  documento: string,
  codigoEstudiantil: string,
): Promise<GraduandoRegistroPublico> {
  const respuesta = await fetchBackend('/api/registro-invitados/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ documento, codigoEstudiantil }),
  });
  return respuestaCeremonia<GraduandoRegistroPublico>(respuesta);
}

export async function getEventosActivos(): Promise<EventoOption[]> {
  const respuesta = await fetchBackend('/api/eventos');
  return respuestaCeremonia<EventoOption[]>(respuesta);
}

export async function getEspaciosActivos(): Promise<EspacioOption[]> {
  const respuesta = await fetchBackend('/api/espacios');
  return respuestaCeremonia<EspacioOption[]>(respuesta);
}

export async function createCeremonia(
  payload: NuevaCeremonia
): Promise<Ceremonia> {
  const respuesta = await fetchBackend('/api/ceremonias', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return respuestaCeremonia<Ceremonia>(respuesta);
}

export async function updateCupoInvitados(
  ceremoniaId: string,
  cupoInvitados: number,
): Promise<{
  id: string;
  cupoInvitados: number;
  invitadosRegistrados: number;
  invitadosExcedidos: number;
}> {
  const respuesta = await fetchBackend(
    `/api/ceremonias/${encodeURIComponent(ceremoniaId)}/cupo-invitados`,
    {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cupoInvitados }),
    },
  );
  return respuestaCeremonia<{
    id: string;
    cupoInvitados: number;
    invitadosRegistrados: number;
    invitadosExcedidos: number;
  }>(respuesta);
}

export async function cambiarEstadoCeremonia(
  ceremoniaId: string,
  estado: EstadoCeremonia,
  motivo?: string,
): Promise<{ id: string; estado: EstadoCeremonia; sesionesFinalizadas: number }> {
  const respuesta = await fetchBackend(
    `/api/ceremonias/${encodeURIComponent(ceremoniaId)}/estado`,
    {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estado, motivo }),
    },
  );
  return respuestaCeremonia<{
    id: string;
    estado: EstadoCeremonia;
    sesionesFinalizadas: number;
  }>(respuesta);
}

export async function getSesiones(ceremoniaId: string): Promise<Sesion[]> {
  const respuesta = await fetchBackend(
    `/api/ceremonias/${encodeURIComponent(ceremoniaId)}/sesiones`
  );
  return respuestaCeremonia<Sesion[]>(respuesta);
}

export async function getSesionById(id: string): Promise<Sesion | null> {
  const respuesta = await fetchBackend(`/api/sesiones/${encodeURIComponent(id)}`);
  if (respuesta.status === 404) return null;
  return respuestaCeremonia<Sesion>(respuesta);
}

export async function addSesion(
  ceremoniaId: string,
  payload: Partial<Sesion>
): Promise<Sesion> {
  const respuesta = await fetchBackend(
    `/api/ceremonias/${encodeURIComponent(ceremoniaId)}/sesiones`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }
  );
  return respuestaCeremonia<Sesion>(respuesta);
}

export async function updateSesion(
  id: string,
  payload: Pick<Sesion, 'nombre' | 'estado' | 'horaInicio' | 'horaFin' | 'programas'>
): Promise<Sesion> {
  const respuesta = await fetchBackend(`/api/sesiones/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return respuestaCeremonia<Sesion>(respuesta);
}

export async function getProgramasActivos(): Promise<string[]> {
  const programas = await getProgramasCatalogo();
  return programas.filter((programa) => programa.estado).map((programa) => programa.nombre);
}

export async function getProgramasCatalogo(): Promise<ProgramaOption[]> {
  const respuesta = await fetchBackend('/api/programas');
  return respuestaCeremonia<ProgramaOption[]>(respuesta);
}

export async function getGraduandos(
  ceremoniaId: string,
  filters?: GraduandoFilters
): Promise<{ data: Graduando[]; total: number; stats: { total: number; revisados: number; errores: number } }> {
  const parametros = new URLSearchParams();
  if (filters?.search?.trim()) parametros.set('search', filters.search.trim());
  if (filters?.sesion && filters.sesion !== 'Todas las sesiones') {
    parametros.set('sesion', filters.sesion);
  }
  if (filters?.programa && filters.programa !== 'Todos los programas') {
    parametros.set('programa', filters.programa);
  }
  const query = parametros.size ? `?${parametros.toString()}` : '';
  const respuesta = await fetchBackend(
    `/api/ceremonias/${encodeURIComponent(ceremoniaId)}/graduandos${query}`
  );
  return respuestaCeremonia<{
    data: Graduando[];
    total: number;
    stats: { total: number; revisados: number; errores: number };
  }>(respuesta);
}

export async function getGraduandoById(id: string): Promise<Graduando | null> {
  const respuesta = await fetchBackend(`/api/graduandos/${encodeURIComponent(id)}`);
  if (respuesta.status === 404) return null;
  return respuestaCeremonia<Graduando>(respuesta);
}

export async function createGraduando(
  ceremoniaId: string,
  payload: GraduandoPayload
): Promise<Graduando> {
  const respuesta = await fetchBackend(
    `/api/ceremonias/${encodeURIComponent(ceremoniaId)}/graduandos`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }
  );
  return respuestaCeremonia<Graduando>(respuesta);
}

export async function previewImportGraduandos(
  ceremoniaId: string,
  filas: ImportGraduandoRow[],
): Promise<ImportGraduandosPreview> {
  const respuesta = await fetchBackend(
    `/api/ceremonias/${encodeURIComponent(ceremoniaId)}/graduandos/importacion/validar`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filas }),
    },
  );
  return respuestaCeremonia<ImportGraduandosPreview>(respuesta);
}

export async function importGraduandos(
  ceremoniaId: string,
  filas: ImportGraduandoRow[],
): Promise<ImportGraduandosResult> {
  const respuesta = await fetchBackend(
    `/api/ceremonias/${encodeURIComponent(ceremoniaId)}/graduandos/importacion/confirmar`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filas }),
    },
  );
  return respuestaCeremonia<ImportGraduandosResult>(respuesta);
}

export async function updateGraduando(
  id: string,
  payload: GraduandoPayload
): Promise<Graduando> {
  const respuesta = await fetchBackend(`/api/graduandos/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return respuestaCeremonia<Graduando>(respuesta);
}

/** Busca graduando por documento para el formulario público de invitados. */
export async function getGraduandoByDocumento(
  documento: string
): Promise<Graduando | null> {
  const respuesta = await fetchBackend(
    `/api/graduandos/documento/${encodeURIComponent(documento)}`
  );
  if (respuesta.status === 404) return null;
  return respuestaCeremonia<Graduando>(respuesta);
}

export async function getInvitados(
  ceremoniaId: string,
  graduandoId?: string
): Promise<Invitado[]> {
  const parametros = new URLSearchParams();
  if (graduandoId) parametros.set('graduandoId', graduandoId);
  const queryString = parametros.toString();
  const query = queryString ? `?${queryString}` : '';
  const respuesta = await fetchBackend(
    `/api/ceremonias/${encodeURIComponent(ceremoniaId)}/invitados${query}`
  );
  return respuestaCeremonia<Invitado[]>(respuesta);
}

export async function getEstadisticasControlIngreso(
  ceremoniaId: string,
  sesionId: string
): Promise<EstadisticasControlIngreso> {
  const parametros = new URLSearchParams({ sesion: sesionId });
  const respuesta = await fetchBackend(
    `/api/ceremonias/${encodeURIComponent(ceremoniaId)}/control-ingreso?${parametros.toString()}`
  );
  return respuestaCeremonia<EstadisticasControlIngreso>(respuesta);
}

export async function buscarGraduandosControlIngreso(
  ceremoniaId: string,
  sesionId: string,
  search: string
): Promise<Graduando[]> {
  const parametros = new URLSearchParams({ sesion: sesionId, search });
  const respuesta = await fetchBackend(
    `/api/ceremonias/${encodeURIComponent(ceremoniaId)}/control-ingreso/graduandos?${parametros.toString()}`
  );
  return respuestaCeremonia<Graduando[]>(respuesta);
}

export async function getInvitadosControlIngreso(
  ceremoniaId: string,
  sesionId: string,
  graduandoId: string
): Promise<Invitado[]> {
  const parametros = new URLSearchParams({ sesion: sesionId });
  const respuesta = await fetchBackend(
    `/api/ceremonias/${encodeURIComponent(ceremoniaId)}/control-ingreso/graduandos/${encodeURIComponent(graduandoId)}/invitados?${parametros.toString()}`
  );
  return respuestaCeremonia<Invitado[]>(respuesta);
}

export async function updateInvitado(
  id: string,
  payload: Partial<Invitado>
): Promise<Invitado | null> {
  const respuesta = await fetchBackend(`/api/invitados/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (respuesta.status === 404) return null;
  return respuestaCeremonia<Invitado>(respuesta);
}

export type NuevoInvitadoPayload =
  Pick<Invitado, 'nombre' | 'documento' | 'autorizacion'> &
  Partial<Pick<Invitado, 'tipo' | 'telefono' | 'parentesco'>>;

export async function addInvitado(
  payload: NuevoInvitadoPayload & Pick<Invitado, 'graduandoId'>
): Promise<Invitado> {
  const respuesta = await fetchBackend(
    `/api/graduandos/${encodeURIComponent(payload.graduandoId)}/invitados`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: payload.nombre,
        documento: payload.documento,
        autorizacion: payload.autorizacion,
        telefono: payload.telefono,
        parentesco: payload.parentesco || payload.tipo,
      }),
    }
  );
  return respuestaCeremonia<Invitado>(respuesta);
}

export async function addInvitados(
  graduandoId: string,
  invitados: NuevoInvitadoPayload[],
): Promise<Invitado[]> {
  const respuesta = await fetchBackend(
    `/api/graduandos/${encodeURIComponent(graduandoId)}/invitados/lote`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        invitados: invitados.map((invitado) => ({
          nombre: invitado.nombre,
          documento: invitado.documento,
          autorizacion: invitado.autorizacion,
          telefono: invitado.telefono,
          parentesco: invitado.parentesco || invitado.tipo,
        })),
      }),
    },
  );
  return respuestaCeremonia<Invitado[]>(respuesta);
}

export async function registrarIngreso(
  invitadoId: string,
  sesionId: string
): Promise<ResultadoRegistroIngreso> {
  const respuesta = await fetchBackend(
    `/api/invitados/${encodeURIComponent(invitadoId)}/ingreso`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id_sesion: Number(sesionId) }),
    }
  );
  return respuestaCeremonia<ResultadoRegistroIngreso>(respuesta);
}

export async function registrarIngresoGraduando(
  ceremoniaId: string,
  graduandoId: string,
  sesionId: string
): Promise<ResultadoRegistroIngreso> {
  const respuesta = await fetchBackend(
    `/api/ceremonias/${encodeURIComponent(ceremoniaId)}/graduandos/${encodeURIComponent(graduandoId)}/ingreso`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id_sesion: Number(sesionId) }),
    }
  );
  return respuestaCeremonia<ResultadoRegistroIngreso>(respuesta);
}

export const ESTADO_CEREMONIA_OPTIONS = ['Todos', 'Programada', 'En curso', 'Finalizada', 'Cancelada'];
export const PROGRAMA_OPTIONS = [
  'Ingeniería de Sistemas',
  'Psicología',
  'Administración',
  'Educación',
];
export const LUGAR_OPTIONS = [
  'Auditorio San Francisco',
  'Auditorio Principal',
  'Coliseo',
  'Campus Centro',
];
export const HORA_OPTIONS = [
  '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00', '18:00',
];
