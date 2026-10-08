/**
 * Servicio de Historial (reservas y ceremonias).
 * Datos ficticios del prototipo. Listo para Axios.
 */

import type {
  HistorialReserva,
  HistorialCeremonia,
  HistorialFilters,
  HistorialListResponse,
} from '../interfaces/historial.interface';

const MOCK_RESERVAS: HistorialReserva[] = [
  {
    id: 'r21',
    codigo: 'SOL-021',
    fecha: '28/08/2026',
    fechaISO: '2026-08-28',
    programa: null,
    espacio: null,
    estado: 'Finalizada',
    anio: 2026,
    mes: 8,
  },
  {
    id: 'r20',
    codigo: 'SOL-020',
    fecha: '25/08/2026',
    fechaISO: '2026-08-25',
    programa: null,
    espacio: null,
    estado: 'Finalizada',
    anio: 2026,
    mes: 8,
  },
  {
    id: 'r19',
    codigo: 'SOL-019',
    fecha: '20/08/2026',
    fechaISO: '2026-08-20',
    programa: null,
    espacio: null,
    estado: 'Finalizada',
    anio: 2026,
    mes: 8,
  },
  {
    id: 'r18',
    codigo: 'SOL-018',
    fecha: '15/08/2026',
    fechaISO: '2026-08-15',
    programa: null,
    espacio: null,
    estado: 'Finalizada',
    anio: 2026,
    mes: 8,
  },
];

const MOCK_CEREMONIAS: HistorialCeremonia[] = [
  {
    id: 'c25',
    codigo: 'CER-025',
    ceremonia: 'Ceremonia de grados',
    fecha: '29/08/2026',
    fechaISO: '2026-08-29',
    programa: 'Ingeniería de Sistemas',
    estado: 'Finalizada',
    anio: 2026,
    mes: 8,
    fechaLarga: '29 de agosto de 2026',
    espacio: 'Auditorio San Francisco',
    campus: 'Campus Centro',
    sesiones: null,
    programasCount: null,
    graduandos: 120,
    invitados: 342,
    ingresosRegistrados: 118,
  },
  {
    id: 'c24',
    codigo: 'CER-024',
    ceremonia: 'Ceremonia de grados',
    fecha: '15/08/2026',
    fechaISO: '2026-08-15',
    programa: 'Psicología',
    estado: 'Finalizada',
    anio: 2026,
    mes: 8,
    fechaLarga: '15 de agosto de 2026',
    espacio: 'Auditorio San Francisco',
    campus: 'Campus Centro',
    sesiones: null,
    programasCount: null,
    graduandos: 95,
    invitados: 280,
    ingresosRegistrados: 90,
  },
  {
    id: 'c23',
    codigo: 'CER-023',
    ceremonia: 'Ceremonia de grados',
    fecha: '01/08/2026',
    fechaISO: '2026-08-01',
    programa: 'Administración',
    estado: 'Finalizada',
    anio: 2026,
    mes: 8,
    fechaLarga: '1 de agosto de 2026',
    espacio: 'Auditorio San Francisco',
    campus: 'Campus Centro',
    sesiones: null,
    programasCount: null,
    graduandos: 110,
    invitados: 310,
    ingresosRegistrados: 105,
  },
  {
    id: 'c22',
    codigo: 'CER-022',
    ceremonia: 'Ceremonia de grados',
    fecha: '18/07/2026',
    fechaISO: '2026-07-18',
    programa: 'Educación',
    estado: 'Finalizada',
    anio: 2026,
    mes: 7,
    fechaLarga: '18 de julio de 2026',
    espacio: 'Auditorio San Francisco',
    campus: 'Campus Centro',
    sesiones: null,
    programasCount: null,
    graduandos: 88,
    invitados: 250,
    ingresosRegistrados: 82,
  },
];

function applyFilters<T extends { anio: number; mes: number; programa?: string | null; codigo: string }>(
  data: T[],
  filters?: HistorialFilters
): T[] {
  let result = [...data];
  if (!filters) return result;

  if (filters.anio && filters.anio !== 'Todos') {
    result = result.filter((r) => String(r.anio) === filters.anio);
  }
  if (filters.mes && filters.mes !== 'Todos') {
    result = result.filter((r) => String(r.mes) === filters.mes);
  }
  if (filters.programa && filters.programa !== 'Todos los programas') {
    result = result.filter(
      (r) => r.programa && r.programa === filters.programa
    );
  }
  if (filters.codigo) {
    const q = filters.codigo.toLowerCase();
    result = result.filter((r) => r.codigo.toLowerCase().includes(q));
  }
  return result;
}

/**
 * En producción: return axios.get('/api/historial/reservas', { params: filters })
 */
export async function getHistorialReservas(
  filters?: HistorialFilters
): Promise<HistorialListResponse<HistorialReserva>> {
  await new Promise((r) => setTimeout(r, 220));
  const data = applyFilters(MOCK_RESERVAS, filters);
  return { data, total: data.length };
}

/**
 * En producción: return axios.get('/api/historial/ceremonias', { params: filters })
 */
export async function getHistorialCeremonias(
  filters?: HistorialFilters
): Promise<HistorialListResponse<HistorialCeremonia>> {
  await new Promise((r) => setTimeout(r, 220));
  const data = applyFilters(MOCK_CEREMONIAS, filters);
  return { data, total: data.length };
}

/**
 * En producción: return axios.get(`/api/historial/ceremonias/${id}`)
 */
export async function getCeremoniaById(
  id: string
): Promise<HistorialCeremonia | null> {
  await new Promise((r) => setTimeout(r, 180));
  return MOCK_CEREMONIAS.find((c) => c.id === id) ?? null;
}

/**
 * Ficha de reserva histórica (reutiliza estructura de ceremonia para la vista de detalle).
 * En producción: return axios.get(`/api/historial/reservas/${id}`)
 */
export async function getReservaHistoricaById(
  id: string
): Promise<HistorialCeremonia | null> {
  await new Promise((r) => setTimeout(r, 180));
  const r = MOCK_RESERVAS.find((x) => x.id === id);
  if (!r) return null;
  return {
    id: r.id,
    codigo: r.codigo,
    ceremonia: 'Solicitud de reserva',
    fecha: r.fecha,
    fechaISO: r.fechaISO,
    programa: r.programa || '—',
    estado: r.estado,
    anio: r.anio,
    mes: r.mes,
    fechaLarga: r.fecha,
    espacio: r.espacio || '—',
    campus: '—',
    sesiones: null,
    programasCount: null,
    graduandos: 0,
    invitados: 0,
    ingresosRegistrados: 0,
  };
}

export const ANIO_OPTIONS = ['Todos', '2026', '2025', '2024'];
export const MES_OPTIONS = [
  'Todos',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  '11',
  '12',
];
export const MES_LABELS: Record<string, string> = {
  Todos: 'Todos',
  '1': 'Enero',
  '2': 'Febrero',
  '3': 'Marzo',
  '4': 'Abril',
  '5': 'Mayo',
  '6': 'Junio',
  '7': 'Julio',
  '8': 'Agosto',
  '9': 'Septiembre',
  '10': 'Octubre',
  '11': 'Noviembre',
  '12': 'Diciembre',
};
export const PROGRAMA_OPTIONS = [
  'Todos los programas',
  'Ingeniería de Sistemas',
  'Psicología',
  'Administración',
  'Educación',
];
