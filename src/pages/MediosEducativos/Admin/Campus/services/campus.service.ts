/**
 * Servicio de Gestión de campus.
 * Datos ficticios del prototipo. Listo para Axios.
 */

import type { Campus, CampusListResponse } from '../interfaces/campus.interface';

const MOCK_CAMPUS: Campus[] = [
  {
    id: '1',
    nombre: 'Campus Centro',
    ciudad: 'Pasto',
    cantidadEspacios: 18,
    estado: 'Activo',
  },
  {
    id: '2',
    nombre: 'Campus San Damian',
    ciudad: 'Pasto',
    cantidadEspacios: 12,
    estado: 'Activo',
  },
  {
    id: '3',
    nombre: 'Campus Santiago',
    ciudad: 'Pasto',
    cantidadEspacios: 6,
    estado: 'Activo',
  },
];

/**
 * En producción: return axios.get('/api/campus')
 */
export async function getCampus(): Promise<CampusListResponse> {
  await new Promise((r) => setTimeout(r, 250));
  return { data: [...MOCK_CAMPUS], total: MOCK_CAMPUS.length };
}

/**
 * En producción: return axios.get(`/api/campus/${id}`)
 */
export async function getCampusById(id: string): Promise<Campus | null> {
  await new Promise((r) => setTimeout(r, 150));
  return MOCK_CAMPUS.find((c) => c.id === id) ?? null;
}
