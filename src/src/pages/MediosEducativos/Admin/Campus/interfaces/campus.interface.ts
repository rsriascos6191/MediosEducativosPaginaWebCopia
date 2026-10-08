/**
 * Interfaces para Gestión de campus.
 * Preparadas para futuro mapeo con API / base de datos.
 */

export type EstadoCampus = 'Activo' | 'Inactivo';

export interface Campus {
  id: string;
  nombre: string;
  ciudad: string;
  cantidadEspacios: number;
  estado: EstadoCampus;
  descripcion?: string;
}

export interface CampusListResponse {
  data: Campus[];
  total: number;
}
