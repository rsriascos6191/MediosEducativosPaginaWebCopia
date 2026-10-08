/**
 * Servicio de Ceremonias de grado.
 * Datos ficticios del prototipo. Listo para Axios.
 */

import type {
  Ceremonia,
  Sesion,
  Graduando,
  Invitado,
  CeremoniaFilters,
  GraduandoFilters,
  EstadoCeremonia,
  EstadoSesion,
  EstadoAutorizacion,
} from '../interfaces/ceremonias.interface';

const MOCK_CEREMONIAS: Ceremonia[] = [
  {
    id: '1',
    codigo: 'CER-025',
    nombre: 'Ceremonia de grados — Ejemplo 01',
    fecha: '15/09/2026',
    fechaISO: '2026-09-15',
    lugar: 'Lugar correspondiente',
    campus: 'Campus Centro',
    sesiones: 3,
    graduandos: 180,
    invitados: 342,
    estado: 'Programada',
  },
  {
    id: '2',
    codigo: 'CER-026',
    nombre: 'Ceremonia de grados — Ejemplo 02',
    fecha: '20/09/2026',
    fechaISO: '2026-09-20',
    lugar: 'Lugar correspondiente',
    campus: 'Campus Centro',
    sesiones: 2,
    graduandos: 120,
    invitados: 280,
    estado: 'En curso',
  },
  {
    id: '3',
    codigo: 'CER-027',
    nombre: 'Ceremonia de grados — Ejemplo 03',
    fecha: '24/09/2026',
    fechaISO: '2026-09-24',
    lugar: 'Lugar correspondiente',
    campus: 'Campus Centro',
    sesiones: 4,
    graduandos: 210,
    invitados: 400,
    estado: 'Finalizada',
  },
];

const MOCK_SESIONES: Sesion[] = [
  {
    id: 's1',
    ceremoniaId: '1',
    nombre: 'Sesión 1',
    estado: 'Pendiente',
    programas: [],
    graduandosCount: 0,
  },
  {
    id: 's2',
    ceremoniaId: '1',
    nombre: 'Sesión 2',
    estado: 'Pendiente',
    programas: [],
    graduandosCount: 0,
  },
];

const MOCK_GRADUANDOS: Graduando[] = [
  {
    id: 'g1',
    ceremoniaId: '1',
    sesionId: 's1',
    nombres: 'Laura',
    apellidos: 'Gómez',
    documento: '10000001',
    programa: 'Ingeniería de Sistemas',
    sesionLabel: 'Sesión 1 · 9:00 a. m.',
    invitadosCount: 3,
    codigoEstudiantil: 'No registrado',
  },
  {
    id: 'g2',
    ceremoniaId: '1',
    sesionId: 's1',
    nombres: 'Carlos',
    apellidos: 'Ruiz',
    documento: '10000002',
    programa: 'Ingeniería de Sistemas',
    sesionLabel: 'Sesión 1 · 9:00 a. m.',
    invitadosCount: 2,
  },
  {
    id: 'g3',
    ceremoniaId: '1',
    sesionId: 's2',
    nombres: 'Ana',
    apellidos: 'Torres',
    documento: '10000003',
    programa: 'Ingeniería de Sistemas',
    sesionLabel: 'Sesión 2 · 12:00 p. m.',
    invitadosCount: 0,
  },
  {
    id: 'g4',
    ceremoniaId: '1',
    sesionId: 's2',
    nombres: 'Juan',
    apellidos: 'Pérez',
    documento: '10000004',
    programa: 'Ingeniería de Sistemas',
    sesionLabel: 'Sesión 2 · 12:00 p. m.',
    invitadosCount: 1,
  },
  {
    id: 'g5',
    ceremoniaId: '1',
    sesionId: 's1',
    nombres: 'María',
    apellidos: 'López',
    documento: '10000005',
    programa: 'Ingeniería de Sistemas',
    sesionLabel: 'Sesión 3 · 4:00 p. m.',
    invitadosCount: 3,
  },
];

const MOCK_INVITADOS: Invitado[] = [
  {
    id: 'i1',
    graduandoId: 'g1',
    ceremoniaId: '1',
    nombre: 'Pedro Gómez',
    documento: '100123',
    graduandoNombre: 'Laura Gómez',
    tipo: 'Familiar',
    autorizacion: 'Autorizado',
    estadoIngreso: 'Pendiente',
  },
  {
    id: 'i2',
    graduandoId: 'g1',
    ceremoniaId: '1',
    nombre: 'María Ruiz',
    documento: '100456',
    graduandoNombre: 'Laura Gómez',
    tipo: 'Familiar',
    autorizacion: 'Autorizado',
    estadoIngreso: 'Ingresó',
    horaIngreso: '7:48 a. m.',
  },
  {
    id: 'i3',
    graduandoId: 'g2',
    ceremoniaId: '1',
    nombre: 'Carlos Pérez',
    documento: '100789',
    graduandoNombre: 'Carlos Ruiz',
    tipo: 'Invitado',
    autorizacion: 'Pendiente',
    estadoIngreso: 'Pendiente',
  },
  {
    id: 'i4',
    graduandoId: 'g2',
    ceremoniaId: '1',
    nombre: 'Ana Torres',
    documento: '101012',
    graduandoNombre: 'Carlos Ruiz',
    tipo: 'Familiar',
    autorizacion: 'Autorizado',
    estadoIngreso: 'Pendiente',
  },
  {
    id: 'i5',
    graduandoId: 'g3',
    ceremoniaId: '1',
    nombre: 'Juan López',
    documento: '101345',
    graduandoNombre: 'Ana Torres',
    tipo: 'Invitado',
    autorizacion: 'Pendiente',
    estadoIngreso: 'Pendiente',
  },
];

export async function getCeremonias(
  filters?: CeremoniaFilters
): Promise<{ data: Ceremonia[]; total: number }> {
  await new Promise((r) => setTimeout(r, 220));
  let data = [...MOCK_CEREMONIAS];
  if (filters?.nombre) {
    const q = filters.nombre.toLowerCase();
    data = data.filter((c) => c.nombre.toLowerCase().includes(q));
  }
  if (filters?.estado && filters.estado !== 'Todos') {
    data = data.filter((c) => c.estado === filters.estado);
  }
  if (filters?.fecha) {
    data = data.filter((c) => c.fechaISO === filters.fecha);
  }
  return { data, total: data.length };
}

export async function getCeremoniaById(id: string): Promise<Ceremonia | null> {
  await new Promise((r) => setTimeout(r, 150));
  return MOCK_CEREMONIAS.find((c) => c.id === id) ?? null;
}

export async function createCeremonia(
  payload: Partial<Ceremonia>
): Promise<Ceremonia> {
  await new Promise((r) => setTimeout(r, 300));
  const nueva: Ceremonia = {
    id: String(Date.now()),
    codigo: `CER-${String(MOCK_CEREMONIAS.length + 28).padStart(3, '0')}`,
    nombre: payload.nombre || 'Nueva ceremonia',
    fecha: payload.fecha || '',
    fechaISO: payload.fechaISO || '',
    lugar: payload.lugar || '',
    sesiones: 0,
    graduandos: 0,
    invitados: 0,
    estado: (payload.estado as EstadoCeremonia) || 'Programada',
  };
  MOCK_CEREMONIAS.push(nueva);
  return nueva;
}

export async function getSesiones(ceremoniaId: string): Promise<Sesion[]> {
  await new Promise((r) => setTimeout(r, 150));
  return MOCK_SESIONES.filter((s) => s.ceremoniaId === ceremoniaId);
}

export async function getSesionById(id: string): Promise<Sesion | null> {
  await new Promise((r) => setTimeout(r, 120));
  return MOCK_SESIONES.find((s) => s.id === id) ?? null;
}

export async function addSesion(
  ceremoniaId: string,
  payload: Partial<Sesion>
): Promise<Sesion> {
  await new Promise((r) => setTimeout(r, 250));
  const nueva: Sesion = {
    id: `s${Date.now()}`,
    ceremoniaId,
    nombre: payload.nombre || `Sesión ${MOCK_SESIONES.filter((s) => s.ceremoniaId === ceremoniaId).length + 1}`,
    estado: (payload.estado as EstadoSesion) || 'Pendiente',
    horaInicio: payload.horaInicio,
    horaFin: payload.horaFin,
    programas: payload.programas || [],
    graduandosCount: 0,
  };
  MOCK_SESIONES.push(nueva);
  return nueva;
}

export async function getGraduandos(
  ceremoniaId: string,
  filters?: GraduandoFilters
): Promise<{ data: Graduando[]; total: number; stats: { total: number; revisados: number; errores: number } }> {
  await new Promise((r) => setTimeout(r, 200));
  let data = MOCK_GRADUANDOS.filter((g) => g.ceremoniaId === ceremoniaId);
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    data = data.filter(
      (g) =>
        `${g.nombres} ${g.apellidos}`.toLowerCase().includes(q) ||
        g.documento.includes(q)
    );
  }
  if (filters?.programa && filters.programa !== 'Todos los programas') {
    data = data.filter((g) => g.programa === filters.programa);
  }
  return {
    data,
    total: data.length,
    stats: { total: 120, revisados: 120, errores: 2 },
  };
}

export async function getGraduandoById(id: string): Promise<Graduando | null> {
  await new Promise((r) => setTimeout(r, 120));
  return MOCK_GRADUANDOS.find((g) => g.id === id) ?? null;
}

/** Busca graduando por cédula (documento). Listo para API real. */
export async function getGraduandoByDocumento(
  documento: string
): Promise<Graduando | null> {
  await new Promise((r) => setTimeout(r, 120));
  const doc = documento.trim();
  const found = MOCK_GRADUANDOS.find((g) => g.documento === doc);
  if (found) return found;
  // Fallback de prueba: cédula válida → perfil demo para el formulario público
  if (doc.length >= 6) {
    return {
      id: `g-demo-${doc}`,
      ceremoniaId: '1',
      sesionId: 's1',
      nombres: 'Graduando',
      apellidos: 'Demo',
      documento: doc,
      codigoEstudiantil:
        (typeof localStorage !== 'undefined' &&
          localStorage.getItem('me_graduando_codigo')) ||
        '0000',
      programa: 'Ingeniería de Sistemas',
      sesionLabel: 'Sesión 1',
      invitadosCount: 0,
    };
  }
  return null;
}

export async function getInvitados(
  ceremoniaId: string,
  graduandoId?: string
): Promise<Invitado[]> {
  await new Promise((r) => setTimeout(r, 150));
  let data = MOCK_INVITADOS.filter((i) => i.ceremoniaId === ceremoniaId);
  if (graduandoId) {
    data = data.filter((i) => i.graduandoId === graduandoId);
  }
  return data;
}

export async function updateInvitado(
  id: string,
  payload: Partial<Invitado>
): Promise<Invitado | null> {
  await new Promise((r) => setTimeout(r, 200));
  const idx = MOCK_INVITADOS.findIndex((i) => i.id === id);
  if (idx === -1) return null;
  MOCK_INVITADOS[idx] = { ...MOCK_INVITADOS[idx], ...payload };
  return MOCK_INVITADOS[idx];
}

export async function addInvitado(
  payload: Omit<Invitado, 'id'>
): Promise<Invitado> {
  await new Promise((r) => setTimeout(r, 200));
  const nuevo: Invitado = { ...payload, id: `i${Date.now()}` };
  MOCK_INVITADOS.push(nuevo);
  const gIdx = MOCK_GRADUANDOS.findIndex((g) => g.id === payload.graduandoId);
  if (gIdx !== -1) {
    MOCK_GRADUANDOS[gIdx] = {
      ...MOCK_GRADUANDOS[gIdx],
      invitadosCount: (MOCK_GRADUANDOS[gIdx].invitadosCount || 0) + 1,
    };
  }
  return nuevo;
}

export async function registrarIngreso(
  invitadoId: string
): Promise<Invitado | null> {
  await new Promise((r) => setTimeout(r, 200));
  const idx = MOCK_INVITADOS.findIndex((i) => i.id === invitadoId);
  if (idx === -1) return null;
  const hora = new Date().toLocaleTimeString('es-CO', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
  MOCK_INVITADOS[idx] = {
    ...MOCK_INVITADOS[idx],
    estadoIngreso: 'Ingresó',
    horaIngreso: hora,
  };
  return MOCK_INVITADOS[idx];
}

export const ESTADO_CEREMONIA_OPTIONS = ['Todos', 'Programada', 'En curso', 'Finalizada'];
export const PROGRAMA_OPTIONS = [
  'Ingeniería de Sistemas',
  'Psicología',
  'Administración',
  'Educación',
];
export const LUGAR_OPTIONS = [
  'Auditorio San Francisco',
  'Auditorio Principal',
  'Coliseo',
  'Campus Centro',
];
export const HORA_OPTIONS = [
  '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00', '18:00',
];
