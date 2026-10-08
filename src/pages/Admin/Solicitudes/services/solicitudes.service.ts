/**
 * Servicio de Solicitudes.
 * Actualmente usa datos ficticios.
 * Preparado para reemplazar por llamadas Axios a la API real.
 */

import type {
  Solicitud,
  SolicitudFilters,
  SolicitudListResponse,
  EstadoSolicitud,
} from '../interfaces/solicitudes.interface';

// Datos ficticios que reflejan exactamente el prototipo de Figma
const MOCK_SOLICITUDES: Solicitud[] = [
  {
    id: '1',
    codigo: 'SOL-001',
    solicitante: 'Juan Pérez',
    correo: 'juan.perez@cesmag.edu.co',
    dependenciaProgramaGrupo: 'Facultad de Ingeniería · Ingeniería de Sistemas · Grupo A',
    actividad: 'Jornada académica de integración',
    espacio: 'Auditorio San Francisco',
    tipoEspacio: 'Auditorio',
    campus: 'Centro',
    fecha: '2026-09-14',
    fechaDisplay: '14/09/2026',
    horario: '8:00 a. m. – 12:00 m.',
    requisitos: 'Proyector, sonido y montaje de sillas',
    asistentes: 180,
    estado: 'Pendiente',
    observaciones: 'Espacio solicitado sujeto a verificación de disponibilidad.',
    fechaCreacion: '09 de septiembre de 2026 · 09:40 a. m.',
    ultimaActualizacion: '09 de septiembre de 2026 · 10:35 a. m.',
  },
  {
    id: '2',
    codigo: 'SOL-002',
    solicitante: 'María Gómez',
    correo: 'maria.gomez@cesmag.edu.co',
    dependenciaProgramaGrupo: 'Facultad de Educación · Licenciatura · Grupo B',
    actividad: 'Taller de formación docente',
    espacio: 'Aula de clase',
    tipoEspacio: 'Aula de clase',
    campus: 'Centro',
    fecha: '2026-09-06',
    fechaDisplay: '06/09/2026',
    horario: '2:00 p. m. – 4:00 p. m.',
    requisitos: 'Proyector',
    asistentes: 35,
    estado: 'Aprobada',
    fechaCreacion: '01 de septiembre de 2026 · 11:00 a. m.',
    ultimaActualizacion: '02 de septiembre de 2026 · 08:15 a. m.',
  },
  {
    id: '3',
    codigo: 'SOL-003',
    solicitante: 'Carlos Ruiz',
    correo: 'carlos.ruiz@cesmag.edu.co',
    dependenciaProgramaGrupo: 'Facultad de Ciencias · Laboratorio · Grupo C',
    actividad: 'Práctica de laboratorio',
    espacio: 'Laboratorio',
    tipoEspacio: 'Laboratorio',
    campus: 'San Francisco',
    fecha: '2026-09-04',
    fechaDisplay: '04/09/2026',
    horario: '9:00 a. m. – 11:00 a. m.',
    requisitos: 'Equipos de laboratorio',
    asistentes: 25,
    estado: 'Activa',
    fechaCreacion: '28 de agosto de 2026 · 14:20 p. m.',
    ultimaActualizacion: '03 de septiembre de 2026 · 09:00 a. m.',
  },
  {
    id: '4',
    codigo: 'SOL-004',
    solicitante: 'Ana Torres',
    correo: 'ana.torres@cesmag.edu.co',
    dependenciaProgramaGrupo: 'Rectoría · Eventos · N/A',
    actividad: 'Reunión institucional',
    espacio: 'Sala especial',
    tipoEspacio: 'Sala especial',
    campus: 'Centro',
    fecha: '2026-09-01',
    fechaDisplay: '01/09/2026',
    horario: '1:00 p. m. – 3:00 p. m.',
    requisitos: 'Sonido',
    asistentes: 40,
    estado: 'Rechazada',
    observaciones: 'Espacio no disponible en la fecha solicitada.',
    fechaCreacion: '25 de agosto de 2026 · 10:00 a. m.',
    ultimaActualizacion: '26 de agosto de 2026 · 16:45 p. m.',
  },
  {
    id: '5',
    codigo: 'SOL-005',
    solicitante: 'Laura Ruiz',
    correo: 'laura.ruiz@cesmag.edu.co',
    dependenciaProgramaGrupo: 'Facultad de Artes · Música · Grupo A',
    actividad: 'Ensayo general',
    espacio: 'Auditorio',
    tipoEspacio: 'Auditorio',
    campus: 'Centro',
    fecha: '2026-08-28',
    fechaDisplay: '28/08/2026',
    horario: '7:00 a. m. – 10:00 a. m.',
    requisitos: 'Montaje de sillas y sonido',
    asistentes: 120,
    estado: 'Cancelada',
    observaciones: 'Cancelada por el solicitante.',
    fechaCreacion: '20 de agosto de 2026 · 08:30 a. m.',
    ultimaActualizacion: '27 de agosto de 2026 · 11:00 a. m.',
  },
];

/**
 * Obtiene el listado de solicitudes.
 * En producción: return axios.get('/api/solicitudes', { params: filters })
 */
export async function getSolicitudes(
  filters?: SolicitudFilters
): Promise<SolicitudListResponse> {
  // Simula latencia de red
  await new Promise((resolve) => setTimeout(resolve, 300));

  let data = [...MOCK_SOLICITUDES];

  if (filters) {
    if (filters.search) {
      const q = filters.search.toLowerCase();
      data = data.filter(
        (s) =>
          s.codigo.toLowerCase().includes(q) ||
          s.solicitante.toLowerCase().includes(q)
      );
    }
    if (filters.estado) {
      data = data.filter((s) => s.estado === filters.estado);
    }
    if (filters.campus) {
      data = data.filter((s) => s.campus === filters.campus);
    }
    if (filters.espacio) {
      data = data.filter((s) =>
        s.espacio.toLowerCase().includes(filters.espacio!.toLowerCase())
      );
    }
    if (filters.fecha) {
      data = data.filter((s) => s.fecha === filters.fecha);
    }
  }

  return { data, total: data.length };
}

/**
 * Obtiene una solicitud por ID.
 * En producción: return axios.get(`/api/solicitudes/${id}`)
 */
export async function getSolicitudById(id: string): Promise<Solicitud | null> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return MOCK_SOLICITUDES.find((s) => s.id === id) ?? null;
}

/**
 * Actualiza el estado de una solicitud (Aprobar / Rechazar).
 * En producción: return axios.patch(`/api/solicitudes/${id}/estado`, { estado, observaciones })
 */
export async function updateEstadoSolicitud(
  id: string,
  estado: EstadoSolicitud,
  observaciones?: string
): Promise<Solicitud | null> {
  await new Promise((resolve) => setTimeout(resolve, 400));
  const index = MOCK_SOLICITUDES.findIndex((s) => s.id === id);
  if (index === -1) return null;

  MOCK_SOLICITUDES[index] = {
    ...MOCK_SOLICITUDES[index],
    estado,
    observaciones: observaciones ?? MOCK_SOLICITUDES[index].observaciones,
    ultimaActualizacion: new Date().toLocaleString('es-CO', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }),
  };

  return MOCK_SOLICITUDES[index];
}

/** Listas auxiliares para filtros (preparadas para catálogos de API) */
export const CAMPUS_OPTIONS = ['Centro', 'San Francisco'];
export const ESTADO_OPTIONS: EstadoSolicitud[] = [
  'Pendiente',
  'Aprobada',
  'Activa',
  'Rechazada',
  'Cancelada',
];
export const ESPACIO_OPTIONS = [
  'Auditorio',
  'Aula de clase',
  'Laboratorio',
  'Sala especial',
];
