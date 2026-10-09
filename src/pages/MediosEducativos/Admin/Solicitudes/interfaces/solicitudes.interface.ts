/**
 * Interfaces para el módulo de Solicitudes.
 * Preparadas para futuro mapeo con respuestas de API / base de datos.
 */

export type EstadoSolicitud =
  | 'Pendiente'
  | 'Aprobada'
  | 'Activa'
  | 'Rechazada'
  | 'Cancelada';

export interface Solicitud {
  id: string;
  codigo: string;
  solicitante: string;
  correo: string;
  dependenciaProgramaGrupo: string;
  actividad: string;
  espacio: string;
  tipoEspacio: string;
  campus: string;
  fecha: string; // ISO o formato legible
  fechaDisplay: string;
  horario: string;
  requisitos: string;
  asistentes: number;
  estado: EstadoSolicitud;
  observaciones?: string;
  fechaCreacion: string;
  ultimaActualizacion: string;
}

export interface SolicitudFilters {
  search?: string; // Código o solicitante
  estado?: EstadoSolicitud | '';
  campus?: string;
  fecha?: string;
  espacio?: string;
}

export interface SolicitudListResponse {
  data: Solicitud[];
  total: number;
}
