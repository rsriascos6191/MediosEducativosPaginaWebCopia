/**
 * Interfaces para el módulo Agenda por campus.
 * Preparadas para futuro mapeo con respuestas de API / base de datos.
 */

export type EstadoReserva =
  | 'Aprobada'
  | 'Activa'
  | 'Pendiente'
  | 'Bloqueado';

export type CampusAgenda = 'Todos' | 'Centro' | 'Santiago' | 'San Damián';

export interface ReservaAgenda {
  id: string;
  codigo: string;
  actividad: string;
  solicitante: string;
  espacio: string;
  tipoEspacio: string;
  campus: Exclude<CampusAgenda, 'Todos'>;
  fecha: string; // YYYY-MM-DD
  fechaDisplay: string; // DD/MM/YYYY
  horario: string;
  estado: EstadoReserva;
  /** ID de la solicitud asociada (para “Ver detalle”) */
  solicitudId?: string;
}

export interface AgendaFilters {
  campus?: CampusAgenda;
  fecha?: string;
  tipoEspacio?: string;
  espacio?: string;
  estado?: EstadoReserva | '';
  search?: string;
}

export interface AgendaListResponse {
  data: ReservaAgenda[];
  total: number;
}
