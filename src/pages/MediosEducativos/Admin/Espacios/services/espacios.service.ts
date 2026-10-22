/**
 * Servicio de Gestión de espacios.
 */

import { obtenerEspacios } from '../../../../../services/api';
import type {
  Espacio,
  EspacioFilters,
  EspacioListResponse,
} from '../interfaces/espacios.interface';

export async function getEspacios(
  filters?: EspacioFilters,
): Promise<EspacioListResponse> {
  const espacios = await obtenerEspacios();
  let data: Espacio[] = espacios.map((espacio) => ({
    id: String(espacio.id_espacio),
    nombre: espacio.nombre,
    tipo: espacio.tipo_espacio,
    capacidad: espacio.capacidad ?? 0,
    estado: 'Disponible',
    campus: espacio.campus,
    imagen: espacio.imagen ?? undefined,
  }));

  if (filters?.nombre) {
    const nombre = filters.nombre.toLocaleLowerCase();
    data = data.filter((espacio) => espacio.nombre.toLocaleLowerCase().includes(nombre));
  }
  if (filters?.tipo) {
    data = data.filter((espacio) => espacio.tipo === filters.tipo);
  }

  return { data, total: data.length };
}
