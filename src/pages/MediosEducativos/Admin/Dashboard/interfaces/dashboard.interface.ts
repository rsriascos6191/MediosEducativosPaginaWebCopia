/**
 * Interfaces para Dashboard.
 * Preparadas para futuro mapeo con API / base de datos.
 */

export interface DashboardStats {
  solicitudesPendientes: number;
  reservasHoy: number;
  espaciosActivos: number;
  eventosProximos: number;
}

export interface SolicitudReciente {
  id: string;
  codigo: string;
  solicitante: string;
  espacio: string;
  fecha: string;
  estado: string;
}

export interface DashboardData {
  stats: DashboardStats;
  solicitudesRecientes: SolicitudReciente[];
}
