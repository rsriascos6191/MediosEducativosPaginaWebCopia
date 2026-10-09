/**
 * Interfaces para Dependencias.
 * Preparadas para futuro mapeo con API / base de datos.
 */

export type TipoDependencia =
  | 'Programa académico'
  | 'Dependencia'
  | 'Área'
  | 'Grupo';

export type EstadoDependencia = 'Activa' | 'Inactiva';

export interface Dependencia {
  id: string;
  nombre: string;
  tipo: TipoDependencia;
  estado: EstadoDependencia;
}

export interface DependenciaFilters {
  nombre?: string;
  tipo?: string;
  estado?: string;
}

export interface DependenciaListResponse {
  data: Dependencia[];
  total: number;
  stats: {
    total: number;
    activas: number;
    inactivas: number;
  };
}
