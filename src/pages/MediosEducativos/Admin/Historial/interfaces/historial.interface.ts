/**
 * Interfaces para Historial (reservas y ceremonias).
 * Preparadas para futuro mapeo con API / base de datos.
 */

export type TipoHistorial = 'reservas' | 'ceremonias';

export type EstadoHistorial = 'Finalizada' | 'Cancelada' | 'Archivada';

export interface HistorialReserva {
  id: string;
  codigo: string;
  fecha: string; // DD/MM/YYYY
  fechaISO: string;
  programa: string | null;
  espacio: string | null;
  estado: EstadoHistorial;
  anio: number;
  mes: number;
}

export interface HistorialCeremonia {
  id: string;
  codigo: string;
  ceremonia: string;
  fecha: string;
  fechaISO: string;
  programa: string;
  estado: EstadoHistorial;
  anio: number;
  mes: number;
  /** Datos de ficha histórica */
  fechaLarga?: string;
  espacio?: string;
  campus?: string;
  sesiones?: number | null;
  programasCount?: number | null;
  graduandos?: number;
  invitados?: number;
  ingresosRegistrados?: number;
}

export interface HistorialFilters {
  anio?: string;
  mes?: string;
  programa?: string;
  codigo?: string;
}

export interface HistorialListResponse<T> {
  data: T[];
  total: number;
}
