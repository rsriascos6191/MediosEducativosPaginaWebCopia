const API_URL = "http://localhost:3000";

export async function fetchBackend(path: string, init?: RequestInit): Promise<Response> {
  try {
    return await fetch(`${API_URL}${path}`, init);
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(
        "No se pudo conectar con el backend. Verifica que esté iniciado en el puerto 3000 y configurado para conectarse a PostgreSQL.",
      );
    }
    throw error;
  }
}

export interface NuevaSolicitudReserva {
  fechaInicio: string;
  fechaFin: string;
  horaInicio: string;
  horaFin: string;
  nombreActividad: string;
  solicitante: string;
  cargo: string;
  correo: string;
  numeroContacto: string;
  dependencia: string;
  programa: string;
  grupo: string;
  campus: string;
  tipoEspacio: string;
  idEspacio: number;
  medios: string[];
  observaciones: string;
}

export interface CampusOption {
  id_campus: number;
  nombre: string;
}

export interface EspacioOption {
  id_espacio: number;
  nombre: string;
  id_campus: number;
  campus: string;
  id_tipo_espacio: number;
  tipo_espacio: string;
  capacidad: number | null;
  ubicacion: string | null;
  recursos: string | null;
  recursos_otro: string | null;
  imagen: string | null;
  descripcion: string | null;
  estado: boolean;
}

export interface DisponibilidadEspacio {
  id_espacio: number;
  nombre: string;
  campus: string;
  tipo_espacio: string;
  capacidad: number | null;
  disponible: boolean;
}

export interface TipoEspacioOption {
  id_tipo_espacio: number;
  nombre: string;
}

export interface SolicitudReservaCreada {
  id: number;
  codigo: string;
  estado: string;
  solicitante: string;
  campus: string;
  espacio: string;
  fechaInicio: string;
  fechaFin: string;
  horaInicio: string;
  horaFin: string;
}

export async function obtenerCampus(): Promise<CampusOption[]> {
  const respuesta = await fetchBackend("/api/campus");

  if (!respuesta.ok) {
    throw new Error("Error al obtener los campus");
  }

  return respuesta.json() as Promise<CampusOption[]>;
}

export async function obtenerProgramas() {
  const respuesta = await fetchBackend("/api/programas");

  if (!respuesta.ok) {
    throw new Error("Error al obtener los programas");
  }

  return respuesta.json();
}

export async function obtenerEspacios(): Promise<EspacioOption[]> {
  const respuesta = await fetchBackend("/api/espacios");

  if (!respuesta.ok) {
    throw new Error("Error al obtener los espacios disponibles");
  }

  return respuesta.json() as Promise<EspacioOption[]>;
}

export async function obtenerEspacio(id: number): Promise<EspacioOption> {
  const respuesta = await fetchBackend(`/api/espacios/${id}`);
  const resultado = (await respuesta.json()) as EspacioOption | { mensaje?: string };

  if (!respuesta.ok) {
    throw new Error(
      "mensaje" in resultado && resultado.mensaje
        ? resultado.mensaje
        : "Error al obtener el espacio solicitado",
    );
  }

  return resultado as EspacioOption;
}

export async function consultarDisponibilidadEspacio(
  id: number,
  fecha: string,
  horaInicio: string,
  horaFin: string,
): Promise<DisponibilidadEspacio> {
  const parametros = new URLSearchParams({ fecha, horaInicio, horaFin });
  const respuesta = await fetchBackend(
    `/api/espacios/${id}/disponibilidad?${parametros.toString()}`,
  );
  const resultado = (await respuesta.json()) as
    | DisponibilidadEspacio
    | { mensaje?: string };

  if (!respuesta.ok) {
    throw new Error(
      "mensaje" in resultado && resultado.mensaje
        ? resultado.mensaje
        : "Error al consultar la disponibilidad del espacio",
    );
  }

  return resultado as DisponibilidadEspacio;
}

export async function obtenerTiposEspacio(): Promise<TipoEspacioOption[]> {
  const respuesta = await fetchBackend("/api/tipos-espacio");

  if (!respuesta.ok) {
    throw new Error("Error al obtener los tipos de espacio");
  }

  return respuesta.json() as Promise<TipoEspacioOption[]>;
}

export async function crearSolicitudReserva(
  solicitud: NuevaSolicitudReserva,
): Promise<SolicitudReservaCreada> {
  const respuesta = await fetchBackend("/api/solicitudes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(solicitud),
  });

  const resultado = (await respuesta.json()) as
    | SolicitudReservaCreada
    | { mensaje?: string };

  if (!respuesta.ok) {
    throw new Error(
      "mensaje" in resultado && resultado.mensaje
        ? resultado.mensaje
        : "No fue posible guardar la solicitud de reserva.",
    );
  }

  if (!("codigo" in resultado) || !("id" in resultado)) {
    throw new Error("El servidor devolvió una respuesta inválida.");
  }

  return resultado;
}