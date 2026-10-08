const API_URL = "http://localhost:3000";

export async function obtenerCampus() {
  const respuesta = await fetch(`${API_URL}/api/campus`);

  if (!respuesta.ok) {
    throw new Error("Error al obtener los campus");
  }

  return respuesta.json();
}

export async function obtenerProgramas() {
  const respuesta = await fetch(`${API_URL}/api/programas`);

  if (!respuesta.ok) {
    throw new Error("Error al obtener los programas");
  }

  return respuesta.json();
}