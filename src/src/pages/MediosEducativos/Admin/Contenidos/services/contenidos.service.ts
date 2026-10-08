/**
 * Servicio de Gestión de contenidos.
 * Datos ficticios del prototipo. Listo para Axios.
 */

import type {
  Contenido,
  ContenidoListResponse,
  TipoContenido,
} from '../interfaces/contenidos.interface';

const MOCK_CONTENIDOS: Contenido[] = [
  // Documentos
  {
    id: 'd1',
    nombre: 'Formatos de solicitud',
    tipoArchivo: 'Archivo oficial',
    estado: 'Activo',
    categoria: 'Documentos',
  },
  {
    id: 'd2',
    nombre: 'Reglamentos y políticas',
    tipoArchivo: 'Archivo oficial',
    estado: 'Activo',
    categoria: 'Documentos',
  },
  {
    id: 'd3',
    nombre: 'Manuales e instructivos',
    tipoArchivo: 'Archivo oficial',
    estado: 'Activo',
    categoria: 'Documentos',
  },
  {
    id: 'd4',
    nombre: 'Documentos informativos',
    tipoArchivo: 'Archivo oficial',
    estado: 'Activo',
    categoria: 'Documentos',
  },
  // Horarios académicos
  {
    id: 'h1',
    nombre: 'Horario academico 2026 periodo 1',
    tipoArchivo: 'Archivo oficial',
    estado: 'Activo',
    categoria: 'Horarios académicos',
  },
];

/**
 * En producción: return axios.get('/api/contenidos', { params: { categoria } })
 */
export async function getContenidos(
  categoria: TipoContenido
): Promise<ContenidoListResponse> {
  await new Promise((r) => setTimeout(r, 220));
  const data = MOCK_CONTENIDOS.filter((c) => c.categoria === categoria);
  return { data, total: data.length };
}
