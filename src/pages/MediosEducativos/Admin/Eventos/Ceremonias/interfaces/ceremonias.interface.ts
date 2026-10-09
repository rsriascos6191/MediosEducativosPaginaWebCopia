/**
 * Interfaces para Ceremonias de grado.
 * Preparadas para futuro mapeo con API / base de datos.
 */

export type EstadoCeremonia = 'Programada' | 'En curso' | 'Finalizada';
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
}

export interface Sesion {
  id: string;
  ceremoniaId: string;
  nombre: string;
  estado: EstadoSesion;
  horaInicio?: string;
  horaFin?: string;
  programas: string[];
  graduandosCount: number;
}

export interface Graduando {
  id: string;
  ceremoniaId: string;
  sesionId?: string;
  nombres: string;
  apellidos: string;
  documento: string;
  telefono?: string;
  correo?: string;
  codigoEstudiantil?: string;
  programa: string;
  sesionLabel?: string;
  invitadosCount: number;
  estado?: string;
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
