/**
 * Servicio de Dashboard.
 * Datos ficticios del prototipo. Listo para Axios.
 */

import type { DashboardData } from '../interfaces/dashboard.interface';

/**
 * En producción: return axios.get('/api/dashboard')
 */
export async function getDashboard(): Promise<DashboardData> {
  await new Promise((r) => setTimeout(r, 280));

  return {
    stats: {
      solicitudesPendientes: 12,
      reservasHoy: 8,
      espaciosActivos: 24,
      eventosProximos: 5,
    },
    solicitudesRecientes: [
      {
        id: '1',
        codigo: 'SOL-001',
        solicitante: 'Juan Pérez',
        espacio: 'Auditorio',
        fecha: '14/09/2026',
        estado: 'Pendiente',
      },
      {
        id: '2',
        codigo: 'SOL-002',
        solicitante: 'María Gómez',
        espacio: 'Aula de clase',
        fecha: '06/09/2026',
        estado: 'Aprobada',
      },
      {
        id: '3',
        codigo: 'SOL-003',
        solicitante: 'Carlos Ruiz',
        espacio: 'Laboratorio',
        fecha: '04/09/2026',
        estado: 'En proceso',
      },
      {
        id: '4',
        codigo: 'SOL-004',
        solicitante: 'Ana Torres',
        espacio: 'Sala especial',
        fecha: '01/09/2026',
        estado: 'Rechazada',
      },
    ],
  };
}
