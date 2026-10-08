/**
 * Servicio de Tipos de espacio.
 * Datos ficticios del prototipo. Listo para Axios.
 */

import type {
  TipoEspacio,
  TipoEspacioListResponse,
} from '../interfaces/tiposEspacio.interface';

const MOCK: TipoEspacio[] = [
  {
    id: '1',
    nombre: 'Auditorios',
    cantidad: 4,
    descripcion: 'Eventos y ceremonias',
  },
  {
    id: '2',
    nombre: 'Aulas de clase',
    cantidad: 12,
    descripcion: 'Clases y talleres',
  },
  {
    id: '3',
    nombre: 'Laboratorios',
    cantidad: 5,
    descripcion: 'Prácticas académicas',
  },
  {
    id: '4',
    nombre: 'Salas especiales',
    cantidad: 3,
    descripcion: 'Reuniones y eventos',
  },
  {
    id: '5',
    nombre: 'Espacios deportivos',
    cantidad: 4,
    descripcion: 'Actividades deportivas',
  },
];

/**
 * En producción: return axios.get('/api/tipos-espacio')
 */
export async function getTiposEspacio(): Promise<TipoEspacioListResponse> {
  await new Promise((r) => setTimeout(r, 220));
  return { data: [...MOCK], total: MOCK.length };
}
