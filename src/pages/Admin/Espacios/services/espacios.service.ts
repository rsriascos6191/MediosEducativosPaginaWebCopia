/**
 * Servicio de Gestión de espacios.
 * Datos ficticios del prototipo. Listo para Axios.
 */

import type {
  Espacio,
  EspacioFilters,
  EspacioListResponse,
} from '../interfaces/espacios.interface';

const MOCK_ESPACIOS: Espacio[] = [
  {
    id: '1',
    nombre: 'Auditorio San Francisco',
    tipo: 'Auditorio',
    capacidad: 500,
    estado: 'Disponible',
    campus: 'Centro',
    imagenGradient: 'linear-gradient(135deg, #1a3a5c 0%, #2d5a87 50%, #c9a227 100%)',
  },
  {
    id: '2',
    nombre: 'Aula 203',
    tipo: 'Aula de clase',
    capacidad: 60,
    estado: 'Disponible',
    campus: 'Centro',
    imagenGradient: 'linear-gradient(135deg, #2c3e50 0%, #3498db 50%, #ecf0f1 100%)',
  },
  {
    id: '3',
    nombre: 'Laboratorio de Sistemas',
    tipo: 'Laboratorio',
    capacidad: 40,
    estado: 'Mantenimiento',
    campus: 'San Damián',
    imagenGradient: 'linear-gradient(135deg, #1e3a5f 0%, #4a90a4 50%, #e8d5b7 100%)',
  },
  {
    id: '4',
    nombre: 'Sala de eventos',
    tipo: 'Sala especial',
    capacidad: 120,
    estado: 'Disponible',
    campus: 'Centro',
    imagenGradient: 'linear-gradient(135deg, #2c1810 0%, #8b6914 40%, #d4a574 100%)',
  },
];

/**
 * En producción: return axios.get('/api/espacios', { params: filters })
 */
export async function getEspacios(
  filters?: EspacioFilters
): Promise<EspacioListResponse> {
  await new Promise((r) => setTimeout(r, 260));

  let data = [...MOCK_ESPACIOS];

  if (filters?.nombre) {
    const q = filters.nombre.toLowerCase();
    data = data.filter((e) => e.nombre.toLowerCase().includes(q));
  }
  if (filters?.tipo) {
    data = data.filter((e) => e.tipo === filters.tipo);
  }

  return { data, total: data.length };
}

export const TIPO_ESPACIO_OPTIONS = [
  'Auditorio',
  'Aula de clase',
  'Laboratorio',
  'Sala especial',
];
