import type { Campus, CampusListResponse } from "../interfaces/campus.interface";

const API_URL = "http://localhost:3000";

export async function getCampus(): Promise<CampusListResponse> {
  const respuesta = await fetch(`${API_URL}/api/campus`);

  if (!respuesta.ok) {
    throw new Error("Error al obtener los campus");
  }

  const datos = await respuesta.json();

  const campus: Campus[] = datos.map((item: any) => ({
    id: String(item.id_campus),
    nombre: item.nombre,
    ciudad: item.direccion_sede,
    cantidadEspacios: 0,
    estado: "Activo",
  }));

  return {
    data: campus,
    total: campus.length,
  };
}