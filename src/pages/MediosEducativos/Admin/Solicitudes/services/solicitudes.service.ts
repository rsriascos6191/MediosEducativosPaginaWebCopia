import { fetchBackend } from '../../../../../services/api';
import type {
  Solicitud,
  SolicitudFilters,
  SolicitudListResponse,
  EstadoSolicitud,
} from '../interfaces/solicitudes.interface';

interface SolicitudApi {
  id: string;
  codigo: string;
  solicitante: string;
  correo: string;
  dependenciaProgramaGrupo: string;
  actividad: string;
  espacio: string;
  tipoEspacio: string;
  campus: string;
  fecha: string;
  fechaDisplay: string;
  horaInicio: string;
  horaFin: string;
  requisitos: string;
  asistentes: number | null;
  estado: string;
  observaciones: string;
  motivoRechazo: string | null;
  motivoCancelacion: string | null;
  fechaCreacion: string;
  ultimaActualizacion: string;
}

interface ApiError {
  mensaje?: string;
}

export interface ResultadoNotificacionCorreo {
  enviado: boolean;
  mensaje: string;
}

export interface SolicitudActualizada {
  solicitud: Solicitud;
  notificacion: ResultadoNotificacionCorreo;
}

const estadosSolicitud: EstadoSolicitud[] = [
  'Pendiente',
  'Aprobada',
  'Activa',
  'Rechazada',
  'Cancelada',
];

function esEstadoSolicitud(estado: string): estado is EstadoSolicitud {
  return estadosSolicitud.some((opcion) => opcion === estado);
}

async function leerRespuesta<T>(respuesta: Response): Promise<T> {
  const resultado = (await respuesta.json()) as T | ApiError;

  if (!respuesta.ok) {
    const mensaje =
      resultado !== null &&
      typeof resultado === 'object' &&
      'mensaje' in resultado &&
      typeof resultado.mensaje === 'string'
        ? resultado.mensaje
        : 'No fue posible completar la solicitud.';
    throw new Error(mensaje);
  }

  return resultado as T;
}

function formatearHora(hora: string): string {
  const [horas, minutos] = hora.split(':').map(Number);
  if (!Number.isInteger(horas) || !Number.isInteger(minutos)) {
    throw new Error('El servidor devolvió un horario inválido.');
  }

  return new Date(2000, 0, 1, horas, minutos).toLocaleTimeString('es-CO', {
    hour: 'numeric',
    minute: '2-digit',
  });
}

function convertirSolicitud(solicitud: SolicitudApi): Solicitud {
  if (!esEstadoSolicitud(solicitud.estado)) {
    throw new Error(`El servidor devolvió un estado desconocido: ${solicitud.estado}`);
  }

  return {
    id: solicitud.id,
    codigo: solicitud.codigo,
    solicitante: solicitud.solicitante,
    correo: solicitud.correo,
    dependenciaProgramaGrupo: solicitud.dependenciaProgramaGrupo,
    actividad: solicitud.actividad,
    espacio: solicitud.espacio,
    tipoEspacio: solicitud.tipoEspacio,
    campus: solicitud.campus,
    fecha: solicitud.fecha,
    fechaDisplay: solicitud.fechaDisplay,
    horario: `${formatearHora(solicitud.horaInicio)} – ${formatearHora(solicitud.horaFin)}`,
    requisitos: solicitud.requisitos,
    asistentes: solicitud.asistentes,
    estado: solicitud.estado,
    observaciones: solicitud.observaciones,
    motivoRechazo: solicitud.motivoRechazo,
    motivoCancelacion: solicitud.motivoCancelacion,
    fechaCreacion: solicitud.fechaCreacion,
    ultimaActualizacion: solicitud.ultimaActualizacion,
  };
}

function crearParametrosFiltros(filters?: SolicitudFilters): string {
  const parametros = new URLSearchParams();
  if (filters?.search) parametros.set('search', filters.search);
  if (filters?.estado) parametros.set('estado', filters.estado);
  if (filters?.campus) parametros.set('campus', filters.campus);
  if (filters?.fecha) parametros.set('fecha', filters.fecha);
  if (filters?.espacio) parametros.set('espacio', filters.espacio);
  return parametros.toString();
}

export async function getSolicitudes(
  filters?: SolicitudFilters,
): Promise<SolicitudListResponse> {
  const query = crearParametrosFiltros(filters);
  const respuesta = await fetchBackend(`/api/solicitudes${query ? `?${query}` : ''}`);
  const resultado = await leerRespuesta<{ data: SolicitudApi[]; total: number }>(
    respuesta,
  );

  return {
    data: resultado.data.map(convertirSolicitud),
    total: resultado.total,
  };
}

export async function getSolicitudById(id: string): Promise<Solicitud | null> {
  const respuesta = await fetchBackend(`/api/solicitudes/${encodeURIComponent(id)}`);
  if (respuesta.status === 404) return null;

  const resultado = await leerRespuesta<SolicitudApi>(respuesta);
  return convertirSolicitud(resultado);
}

export async function updateEstadoSolicitud(
  id: string,
  estado: EstadoSolicitud,
  motivo?: string,
): Promise<SolicitudActualizada | null> {
  const respuesta = await fetchBackend(
    `/api/solicitudes/${encodeURIComponent(id)}/estado`,
    {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estado, motivo }),
    },
  );
  if (respuesta.status === 404) return null;

  const resultado = await leerRespuesta<{
    solicitud: SolicitudApi;
    notificacion: ResultadoNotificacionCorreo;
  }>(respuesta);
  return {
    solicitud: convertirSolicitud(resultado.solicitud),
    notificacion: resultado.notificacion,
  };
}

export const ESTADO_OPTIONS: EstadoSolicitud[] = estadosSolicitud;
export const CAMPUS_OPTIONS = ['Centro', 'San Francisco'];
export const ESPACIO_OPTIONS = [
  'Auditorio',
  'Aula de clase',
  'Laboratorio',
  'Sala especial',
];
