/**
 * Interfaces para Gestión de espacios.
 * Preparadas para futuro mapeo con API / base de datos.
 */

export type EstadoEspacio = 'Disponible' | 'Mantenimiento' | 'No disponible';

export interface Espacio {
  id: string;
  nombre: string;
  tipo: string;
  capacidad: number;
  estado: EstadoEspacio;
  campus: string;
  /** URL o path de imagen; en mock usamos gradientes */
  imagen?: string;
  imagenGradient?: string;
}

export interface EspacioFilters {
  nombre?: string;
  tipo?: string;
}

export interface EspacioListResponse {
  data: Espacio[];
  total: number;
}
