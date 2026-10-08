/**
 * Servicio de Agenda por campus.
 * Datos ficticios extraídos del prototipo de Figma.
 * Preparado para reemplazar por llamadas Axios a la API real.
 */

import type {
  ReservaAgenda,
  AgendaFilters,
  AgendaListResponse,
  EstadoReserva,
  CampusAgenda,
} from '../interfaces/agenda.interface';

const MOCK_RESERVAS: ReservaAgenda[] = [
  // Campus Centro
  {
    id: '1',
    codigo: 'RES-001',
    actividad: 'Reunión académica',
    solicitante: 'Juan Pérez',
    espacio: 'Auditorio San Francisco',
    tipoEspacio: 'Auditorio',
    campus: 'Centro',
    fecha: '2026-09-14',
    fechaDisplay: '14/09/2026',
    horario: '09:00-11:00',
    estado: 'Aprobada',
    solicitudId: '1',
  },
  {
    id: '2',
    codigo: 'RES-002',
    actividad: 'Clase de Sistemas',
    solicitante: 'María Gómez',
    espacio: 'Aula 203',
    tipoEspacio: 'Aula de clase',
    campus: 'Centro',
    fecha: '2026-09-14',
    fechaDisplay: '14/09/2026',
    horario: '07:00-09:00',
    estado: 'Activa',
    solicitudId: '2',
  },
  {
    id: '4',
    codigo: 'RES-004',
    actividad: 'Comité de programa',
    solicitante: 'Ana Torres',
    espacio: 'Sala de Juntas',
    tipoEspacio: 'Sala especial',
    campus: 'Centro',
    fecha: '2026-09-15',
    fechaDisplay: '15/09/2026',
    horario: '10:00-13:00',
    estado: 'Aprobada',
    solicitudId: '4',
  },
  {
    id: '6',
    codigo: 'RES-006',
    actividad: 'Evento institucional',
    solicitante: 'Pedro López',
    espacio: 'Auditorio San Francisco',
    tipoEspacio: 'Auditorio',
    campus: 'Centro',
    fecha: '2026-09-16',
    fechaDisplay: '16/09/2026',
    horario: '08:00-12:00',
    estado: 'Aprobada',
  },
  // Campus San Damián
  {
    id: '3',
    codigo: 'RES-003',
    actividad: 'Taller docente',
    solicitante: 'Carlos Ruiz',
    espacio: 'Laboratorio de Sistemas',
    tipoEspacio: 'Laboratorio',
    campus: 'San Damián',
    fecha: '2026-09-14',
    fechaDisplay: '14/09/2026',
    horario: '12:00-14:00',
    estado: 'Pendiente',
    solicitudId: '3',
  },
  {
    id: '5',
    codigo: 'RES-005',
    actividad: 'Entrenamiento deportivo',
    solicitante: 'Laura Ruiz',
    espacio: 'Coliseo',
    tipoEspacio: 'Espacio deportivo',
    campus: 'San Damián',
    fecha: '2026-09-15',
    fechaDisplay: '15/09/2026',
    horario: '13:00-16:00',
    estado: 'Bloqueado',
  },
  {
    id: '7',
    codigo: 'RES-007',
    actividad: 'Práctica de laboratorio',
    solicitante: 'Sofía Martínez',
    espacio: 'Laboratorio de Sistemas',
    tipoEspacio: 'Laboratorio',
    campus: 'San Damián',
    fecha: '2026-09-16',
    fechaDisplay: '16/09/2026',
    horario: '14:00-16:00',
    estado: 'Pendiente',
  },
  // Campus Santiago
  {
    id: 's1',
    codigo: 'RES-S01',
    actividad: 'Seminario académico',
    solicitante: 'Daniela Castro',
    espacio: 'Aula 305',
    tipoEspacio: 'Aula de clase',
    campus: 'Santiago',
    fecha: '2026-09-17',
    fechaDisplay: '17/09/2026',
    horario: '08:00-10:00',
    estado: 'Aprobada',
  },
  {
    id: 's2',
    codigo: 'RES-S02',
    actividad: 'Práctica de laboratorio',
    solicitante: 'Andrés López',
    espacio: 'Laboratorio de Sistemas',
    tipoEspacio: 'Laboratorio',
    campus: 'Santiago',
    fecha: '2026-09-18',
    fechaDisplay: '18/09/2026',
    horario: '14:00-16:00',
    estado: 'Pendiente',
  },
  // Filas adicionales para llegar a ~14 en “Todos” (como en el prototipo)
  {
    id: '8',
    codigo: 'RES-008',
    actividad: 'Charla de inducción',
    solicitante: 'Camila Restrepo',
    espacio: 'Auditorio San Francisco',
    tipoEspacio: 'Auditorio',
    campus: 'Centro',
    fecha: '2026-09-19',
    fechaDisplay: '19/09/2026',
    horario: '09:00-11:00',
    estado: 'Aprobada',
  },
  {
    id: '9',
    codigo: 'RES-009',
    actividad: 'Reunión de coordinación',
    solicitante: 'Jorge Mejía',
    espacio: 'Sala de Juntas',
    tipoEspacio: 'Sala especial',
    campus: 'Centro',
    fecha: '2026-09-20',
    fechaDisplay: '20/09/2026',
    horario: '14:00-16:00',
    estado: 'Activa',
  },
  {
    id: '10',
    codigo: 'RES-010',
    actividad: 'Taller de investigación',
    solicitante: 'Valentina Gómez',
    espacio: 'Laboratorio de Sistemas',
    tipoEspacio: 'Laboratorio',
    campus: 'San Damián',
    fecha: '2026-09-21',
    fechaDisplay: '21/09/2026',
    horario: '10:00-12:00',
    estado: 'Pendiente',
  },
  {
    id: '11',
    codigo: 'RES-011',
    actividad: 'Clase de programación',
    solicitante: 'Diego Vargas',
    espacio: 'Aula 203',
    tipoEspacio: 'Aula de clase',
    campus: 'Centro',
    fecha: '2026-09-22',
    fechaDisplay: '22/09/2026',
    horario: '07:00-09:00',
    estado: 'Aprobada',
  },
  {
    id: '12',
    codigo: 'RES-012',
    actividad: 'Entrenamiento selectivo',
    solicitante: 'Natalia Quintero',
    espacio: 'Coliseo',
    tipoEspacio: 'Espacio deportivo',
    campus: 'San Damián',
    fecha: '2026-09-23',
    fechaDisplay: '23/09/2026',
    horario: '16:00-18:00',
    estado: 'Bloqueado',
  },
];

/**
 * Obtiene la agenda filtrada.
 * En producción: return axios.get('/api/agenda', { params: filters })
 */
export async function getAgenda(
  filters?: AgendaFilters
): Promise<AgendaListResponse> {
  await new Promise((resolve) => setTimeout(resolve, 280));

  let data = [...MOCK_RESERVAS];

  if (filters) {
    if (filters.campus && filters.campus !== 'Todos') {
      data = data.filter((r) => r.campus === filters.campus);
    }
    if (filters.estado) {
      data = data.filter((r) => r.estado === filters.estado);
    }
    if (filters.tipoEspacio && filters.tipoEspacio !== 'Todos') {
      data = data.filter((r) => r.tipoEspacio === filters.tipoEspacio);
    }
    if (filters.espacio && filters.espacio !== 'Todos') {
      data = data.filter((r) =>
        r.espacio.toLowerCase().includes(filters.espacio!.toLowerCase())
      );
    }
    if (filters.fecha) {
      // El prototipo muestra un selector de fecha; se filtra por coincidencia exacta
      data = data.filter((r) => r.fecha === filters.fecha);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      data = data.filter(
        (r) =>
          r.codigo.toLowerCase().includes(q) ||
          r.actividad.toLowerCase().includes(q) ||
          r.solicitante.toLowerCase().includes(q) ||
          r.espacio.toLowerCase().includes(q)
      );
    }
  }

  // Orden por fecha ascendente
  data.sort((a, b) => a.fecha.localeCompare(b.fecha) || a.horario.localeCompare(b.horario));

  return { data, total: data.length };
}

export const CAMPUS_TABS: CampusAgenda[] = [
  'Todos',
  'Centro',
  'Santiago',
  'San Damián',
];

export const ESTADO_OPTIONS: EstadoReserva[] = [
  'Aprobada',
  'Activa',
  'Pendiente',
  'Bloqueado',
];

export const TIPO_ESPACIO_OPTIONS = [
  'Todos',
  'Auditorio',
  'Aula de clase',
  'Laboratorio',
  'Sala especial',
  'Espacio deportivo',
];

export const ESPACIO_OPTIONS = [
  'Todos',
  'Auditorio San Francisco',
  'Aula 203',
  'Aula 305',
  'Sala de Juntas',
  'Laboratorio de Sistemas',
  'Coliseo',
];
