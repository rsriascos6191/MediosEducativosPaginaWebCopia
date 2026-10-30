/**
 * Interfaces para Ceremonias de grado.
 */

export type EstadoCeremonia = 'Programada' | 'En curso' | 'Finalizada' | 'Cancelada';
export type EstadoSesion = 'Pendiente' | 'En curso' | 'Finalizada';
export type EstadoAutorizacion = 'Autorizado' | 'Pendiente';
export type EstadoIngreso = 'Ingresó' | 'Pendiente';

export interface Ceremonia {
  id: string;
  codigo: string;
  nombre: string;
  fecha: string;
  fechaISO: string;
  lugar: string;
  campus?: string;
  sesiones: number;
  graduandos: number;
  invitados: number;
  estado: EstadoCeremonia;
  cupoInvitados?: number;
  maxInvitadosPorGraduando: number;
}

export interface NuevaCeremonia {
  nombre: string;
  fecha: string;
  idEvento?: number;
  idEspacio: number;
  estado: EstadoCeremonia;
  maxInvitadosPorGraduando: number;
}

export interface Sesion {
  id: string;
  ceremoniaId: string;
  numeroSesion: number;
  nombre: string;
  estado: EstadoSesion;
  horaInicio?: string;
  horaFin?: string;
  programas: string[];
  programaIds?: number[];
  graduandosCount: number;
  invitadosCount: number;
}

export interface Graduando {
  id: string;
  ceremoniaId: string;
  sesionId?: string | null;
  nombres: string;
  apellidos: string;
  documento: string;
  telefono?: string;
  correo?: string;
  codigoEstudiantil?: string;
  tallaToga?: string;
  programa: string;
  programaIds?: number[];
  sesionLabel?: string;
  invitadosCount: number;
  requisitosCumplidos?: boolean;
  estado?: boolean;
  estadoIngreso?: EstadoIngreso;
  horaIngreso?: string | null;
}

export interface Invitado {
  id: string;
  graduandoId: string;
  ceremoniaId: string;
  nombre: string;
  documento: string;
  graduandoNombre: string;
  /** Parentesco o tipo (Familiar, Amigo, etc.) */
  tipo: string;
  telefono?: string;
  parentesco?: string;
  autorizacion: EstadoAutorizacion;
  estadoIngreso?: EstadoIngreso;
  horaIngreso?: string;
}

export interface CeremoniaFilters {
  nombre?: string;
  fecha?: string;
  estado?: string;
}

export interface GraduandoFilters {
  search?: string;
  sesion?: string;
  programa?: string;
}

export interface GraduandoPayload {
  nombres: string;
  apellidos: string;
  documento: string;
  correo?: string;
  telefono?: string;
  codigoEstudiantil?: string;
  tallaToga?: string;
  idSesion?: number | null;
  programaIds: number[];
  estado?: boolean;
  requisitosCumplidos?: boolean;
}

export interface ProgramaOption {
  id_programa: number;
  nombre: string;
  estado: boolean;
}

export interface ConteoControlIngreso {
  registrados: number;
  ingresaron: number;
  pendientes: number;
}

export interface EstadisticasControlIngreso {
  graduandos: ConteoControlIngreso;
  invitados: ConteoControlIngreso;
}

export interface ResultadoRegistroIngreso {
  yaIngreso: boolean;
  mensaje: string;
  horaIngreso: string | null;
  estadisticas: EstadisticasControlIngreso;
}
