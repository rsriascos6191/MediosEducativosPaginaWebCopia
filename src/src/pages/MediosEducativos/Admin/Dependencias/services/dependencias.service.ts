/**
 * Servicio de Dependencias.
 * Datos ficticios del prototipo. Listo para Axios.
 */

import type {
  Dependencia,
  DependenciaFilters,
  DependenciaListResponse,
} from '../interfaces/dependencias.interface';

const MOCK: Dependencia[] = [
  { id: '1', nombre: 'Ingeniería de Sistemas', tipo: 'Programa académico', estado: 'Activa' },
  { id: '2', nombre: 'Bienestar Universitario', tipo: 'Dependencia', estado: 'Activa' },
  { id: '3', nombre: 'Recursos Humanos', tipo: 'Dependencia', estado: 'Activa' },
  { id: '4', nombre: 'Facultad de Ingeniería', tipo: 'Área', estado: 'Inactiva' },
  { id: '5', nombre: 'Grupo de Investigación TIC', tipo: 'Grupo', estado: 'Activa' },
  { id: '6', nombre: 'Licenciatura en Educación', tipo: 'Programa académico', estado: 'Activa' },
  { id: '7', nombre: 'Oficina de Admisiones', tipo: 'Dependencia', estado: 'Activa' },
  { id: '8', nombre: 'Facultad de Educación', tipo: 'Área', estado: 'Activa' },
  { id: '9', nombre: 'Semillero de Robótica', tipo: 'Grupo', estado: 'Activa' },
  { id: '10', nombre: 'Comunicaciones', tipo: 'Dependencia', estado: 'Activa' },
  { id: '11', nombre: 'Contaduría Pública', tipo: 'Programa académico', estado: 'Inactiva' },
  { id: '12', nombre: 'Vicerrectoría Académica', tipo: 'Área', estado: 'Activa' },
];

/**
 * En producción: return axios.get('/api/dependencias', { params: filters })
 */
export async function getDependencias(
  filters?: DependenciaFilters
): Promise<DependenciaListResponse> {
  await new Promise((r) => setTimeout(r, 250));

  let data = [...MOCK];

  if (filters?.nombre) {
    const q = filters.nombre.toLowerCase();
    data = data.filter((d) => d.nombre.toLowerCase().includes(q));
  }
  if (filters?.tipo && filters.tipo !== 'Todos') {
    data = data.filter((d) => d.tipo === filters.tipo);
  }
  if (filters?.estado && filters.estado !== 'Todas') {
    data = data.filter((d) => d.estado === filters.estado);
  }

  const activas = MOCK.filter((d) => d.estado === 'Activa').length;
  const inactivas = MOCK.filter((d) => d.estado === 'Inactiva').length;

  return {
    data,
    total: data.length,
    stats: { total: MOCK.length, activas, inactivas },
  };
}

export const TIPO_OPTIONS = [
  'Todos',
  'Programa académico',
  'Dependencia',
  'Área',
  'Grupo',
];

export const ESTADO_OPTIONS = ['Todas', 'Activa', 'Inactiva'];
