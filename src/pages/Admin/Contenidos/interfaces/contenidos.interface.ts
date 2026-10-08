/**
 * Interfaces para Gestión de contenidos.
 * Preparadas para futuro mapeo con API / base de datos.
 */

export type TipoContenido = 'Documentos' | 'Horarios académicos';
export type EstadoContenido = 'Activo' | 'Inactivo';

export interface Contenido {
  id: string;
  nombre: string;
  tipoArchivo: string;
  estado: EstadoContenido;
  categoria: TipoContenido;
  url?: string;
}

export interface ContenidoListResponse {
  data: Contenido[];
  total: number;
}
