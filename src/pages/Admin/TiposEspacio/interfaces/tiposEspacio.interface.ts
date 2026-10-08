/**
 * Interfaces para Tipos de espacio.
 * Preparadas para futuro mapeo con API / base de datos.
 */

export interface TipoEspacio {
  id: string;
  nombre: string;
  cantidad: number;
  descripcion: string;
}

export interface TipoEspacioListResponse {
  data: TipoEspacio[];
  total: number;
}
