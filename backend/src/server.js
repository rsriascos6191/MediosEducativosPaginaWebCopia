import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { randomUUID } from "node:crypto";
import { pool } from "./db.js";
import { enviarCorreoEstadoSolicitud } from "./notifications/email.service.js";

dotenv.config();

const app = express();

app.use(cors());
const jsonBodyParser = express.json({ limit: "8mb" });
const photoJsonBodyParser = express.json({ limit: "18mb" });
app.use((req, res, next) => {
  const parser = /^\/api\/ceremonias\/\d+\/fotografias$/.test(req.path)
    ? photoJsonBodyParser
    : jsonBodyParser;
  return parser(req, res, next);
});
app.use((error, _req, res, next) => {
  if (error?.type === "entity.too.large") {
    return res.status(413).json({ mensaje: "El archivo o los datos superan el límite de tamaño permitido." });
  }
  return next(error);
});

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.json({
    mensaje: "Backend Medios Educativos funcionando",
  });
});

app.get("/api/campus", async (req, res) => {
  try {
    const resultado = await pool.query(
      "SELECT * FROM campus ORDER BY id_campus"
    );

    res.json(resultado.rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensaje: "Error al consultar los campus",
    });
  }
});
app.get("/api/programas", async (req, res) => {
  try {
    const resultado = await pool.query(
      "SELECT * FROM programa ORDER BY id_programa"
    );

    res.json(resultado.rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensaje: "Error al consultar los programas",
    });
  }
});

app.get("/api/eventos", async (req, res) => {
  try {
    const resultado = await pool.query(
      `SELECT id_evento, tipo_evento
       FROM evento_institucional
       WHERE estado = TRUE
       ORDER BY tipo_evento, id_evento DESC`
    );
    return res.json(resultado.rows);
  } catch (error) {
    console.error("Error al consultar los eventos institucionales:", error);
    return res.status(500).json({ mensaje: "Error al consultar los eventos institucionales." });
  }
});

const estadosCeremonia = ["Programada", "En curso", "Finalizada", "Cancelada"];
const estadosCeremoniaCreacion = ["Programada", "En curso", "Finalizada"];
const estadosCeremoniaActivasRegistroInvitados = ["Programada"];
const estadosSesion = ["Pendiente", "En curso", "Finalizada"];
const transicionesCeremonia = {
  Programada: ["En curso", "Cancelada"],
  "En curso": ["Finalizada", "Cancelada"],
  Finalizada: ["Programada"],
};
const ordenEstadosSesion = ["Pendiente", "En curso", "Finalizada"];
const columnasEvidenciaFotografica = [
  "evidencia_fotografia_1",
  "evidencia_fotografia_2",
  "evidencia_fotografia_3",
  "evidencia_fotografia_4",
];

function obtenerMimeImagen(buffer) {
  if (buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) {
    return "image/png";
  }
  if (buffer.length >= 3 && buffer[0] === 255 && buffer[1] === 216 && buffer[2] === 255) {
    return "image/jpeg";
  }
  if (
    buffer.length >= 12 &&
    buffer.toString("ascii", 0, 4) === "RIFF" &&
    buffer.toString("ascii", 8, 12) === "WEBP"
  ) {
    return "image/webp";
  }
  if (["GIF87a", "GIF89a"].includes(buffer.toString("ascii", 0, 6))) {
    return "image/gif";
  }
  return null;
}

app.get("/api/ceremonias", async (req, res) => {
  const { nombre, fecha, estado } = req.query;
  if (
    [nombre, fecha, estado].some((valor) => valor !== undefined && typeof valor !== "string") ||
    (estado && !estadosCeremonia.includes(estado)) ||
    (fecha && !/^\d{4}-\d{2}-\d{2}$/.test(fecha))
  ) {
    return res.status(400).json({ mensaje: "Uno o más filtros de ceremonia no son válidos." });
  }

  const condiciones = [];
  const valores = [];
  const agregarFiltro = (condicion, valor) => {
    valores.push(valor);
    condiciones.push(condicion.replace("?", `$${valores.length}`));
  };

  if (nombre?.trim()) agregarFiltro("cg.nombre ILIKE ?", `%${nombre.trim()}%`);
  if (fecha) agregarFiltro("cg.fecha = ?::date", fecha);
  if (estado) agregarFiltro("cg.estado = ?", estado);

  try {
    const resultado = await pool.query(
      `SELECT cg.id_ceremonia AS id,
              cg.codigo_ceremonia AS codigo,
              cg.nombre,
              TO_CHAR(cg.fecha, 'DD/MM/YYYY') AS fecha,
              TO_CHAR(cg.fecha, 'YYYY-MM-DD') AS "fechaISO",
              e.nombre AS lugar,
              c.nombre AS campus,
              cg.estado,
              cg.cupo_invitados AS "cupoInvitados",
              (SELECT COUNT(*)::int FROM sesion s
               WHERE s.id_ceremonia = cg.id_ceremonia) AS sesiones,
              (SELECT COUNT(*)::int FROM graduando g
               WHERE g.id_ceremonia = cg.id_ceremonia) AS graduandos,
              (SELECT COUNT(*)::int
               FROM invitado i
               JOIN graduando gi ON gi.id_graduando = i.id_graduando
               WHERE gi.id_ceremonia = cg.id_ceremonia) AS invitados
       FROM ceremonia_grado cg
       JOIN espacio e ON e.id_espacio = cg.id_espacio
       JOIN campus c ON c.id_campus = e.id_campus
       ${condiciones.length ? `WHERE ${condiciones.join(" AND ")}` : ""}
       ORDER BY cg.fecha DESC, cg.id_ceremonia DESC`,
      valores
    );

    return res.json({ data: resultado.rows, total: resultado.rows.length });
  } catch (error) {
    console.error("Error al consultar las ceremonias:", error);
    return res.status(500).json({ mensaje: "Error al consultar las ceremonias." });
  }
});

app.get("/api/ceremonias/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isSafeInteger(id) || id <= 0) {
    return res.status(400).json({ mensaje: "El identificador de la ceremonia no es válido." });
  }

  try {
    const resultado = await pool.query(
      `SELECT cg.id_ceremonia AS id,
              cg.codigo_ceremonia AS codigo,
              cg.nombre,
              TO_CHAR(cg.fecha, 'DD/MM/YYYY') AS fecha,
              TO_CHAR(cg.fecha, 'YYYY-MM-DD') AS "fechaISO",
              e.nombre AS lugar,
              c.nombre AS campus,
              cg.estado,
              cg.cupo_invitados AS "cupoInvitados",
              (SELECT COUNT(*)::int FROM sesion s
               WHERE s.id_ceremonia = cg.id_ceremonia) AS sesiones,
              (SELECT COUNT(*)::int FROM graduando g
               WHERE g.id_ceremonia = cg.id_ceremonia) AS graduandos,
              (SELECT COUNT(*)::int
               FROM invitado i
               JOIN graduando gi ON gi.id_graduando = i.id_graduando
               WHERE gi.id_ceremonia = cg.id_ceremonia) AS invitados,
              cg.resolucion_grados AS "resolucionGrados",
              cg.informacion_historica AS "informacionHistorica"
       FROM ceremonia_grado cg
       JOIN espacio e ON e.id_espacio = cg.id_espacio
       JOIN campus c ON c.id_campus = e.id_campus
       WHERE cg.id_ceremonia = $1`,
      [id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({ mensaje: "No se encontró la ceremonia." });
    }
    return res.json(resultado.rows[0]);
  } catch (error) {
    console.error("Error al consultar el detalle de la ceremonia:", error);
    return res.status(500).json({ mensaje: "Error al consultar la ceremonia." });
  }
});

app.patch("/api/ceremonias/:id/estado", async (req, res) => {
  const idCeremonia = Number(req.params.id);
  const cuerpo = req.body && typeof req.body === "object" && !Array.isArray(req.body)
    ? req.body
    : null;
  const estado = cuerpo?.estado;
  const motivo = typeof cuerpo?.motivo === "string" ? cuerpo.motivo.trim() : "";
  if (
    !Number.isSafeInteger(idCeremonia) ||
    idCeremonia <= 0 ||
    !["Programada", "En curso", "Finalizada", "Cancelada"].includes(estado) ||
    (estado === "Cancelada" && (!motivo || motivo.length > 1000))
  ) {
    return res.status(400).json({
      mensaje: estado === "Cancelada"
        ? "Indica un motivo de cancelación de hasta 1000 caracteres."
        : "El identificador o el estado de la ceremonia no son válidos.",
    });
  }

  let client;
  try {
    client = await pool.connect();
    await client.query("BEGIN");
    const ceremonia = await client.query(
      `SELECT cg.estado, e.id_admin_gestion AS id_admin_responsable
       FROM ceremonia_grado cg
       JOIN evento_institucional e ON e.id_evento = cg.id_evento
       WHERE cg.id_ceremonia = $1
       FOR UPDATE OF cg`,
      [idCeremonia]
    );
    if (ceremonia.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ mensaje: "No se encontró la ceremonia." });
    }

    const estadoAnterior = ceremonia.rows[0].estado;
    const restablecimientoPruebas =
      estadoAnterior === "Finalizada" && estado === "Programada";
    if (restablecimientoPruebas && process.env.NODE_ENV === "production") {
      await client.query("ROLLBACK");
      return res.status(403).json({
        mensaje: "El restablecimiento de ceremonias solo está disponible durante las pruebas.",
      });
    }
    if (!transicionesCeremonia[estadoAnterior]?.includes(estado)) {
      await client.query("ROLLBACK");
      return res.status(409).json({
        mensaje: `No se puede cambiar una ceremonia de "${estadoAnterior}" a "${estado}".`,
      });
    }

    let sesionesFinalizadas = 0;
    if (estado === "Finalizada" || estado === "Cancelada") {
      const sesiones = await client.query(
        `UPDATE sesion
         SET estado = 'Finalizada'
         WHERE id_ceremonia = $1
           AND estado IN ('Pendiente', 'En curso')
         RETURNING id_sesion`,
        [idCeremonia]
      );
      sesionesFinalizadas = sesiones.rowCount;
    } else if (restablecimientoPruebas) {
      await client.query(
        `UPDATE sesion
         SET estado = 'Pendiente'
         WHERE id_ceremonia = $1
           AND estado IN ('En curso', 'Finalizada')`,
        [idCeremonia]
      );
    }

    const actualizada = await client.query(
      `UPDATE ceremonia_grado
       SET estado = $1
       WHERE id_ceremonia = $2
       RETURNING id_ceremonia::text AS id, estado`,
      [estado, idCeremonia]
    );
    if (!restablecimientoPruebas) {
      const accion = estado === "En curso"
        ? "Iniciar"
        : estado === "Finalizada" ? "Finalizar" : "Cancelar";
      await client.query(
        `INSERT INTO historial_estado_ceremonia
           (id_ceremonia, id_admin_responsable, accion, estado_anterior, estado_nuevo, motivo)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          idCeremonia,
          ceremonia.rows[0].id_admin_responsable,
          accion,
          estadoAnterior,
          estado,
          estado === "Cancelada" ? motivo : null,
        ]
      );
    }
    await client.query("COMMIT");
    return res.json({
      ...actualizada.rows[0],
      sesionesFinalizadas,
    });
  } catch (error) {
    if (client) {
      await client.query("ROLLBACK").catch((rollbackError) => {
        console.error("Error al revertir el cambio de estado de la ceremonia:", rollbackError);
      });
    }
    console.error("Error al cambiar el estado de la ceremonia:", error);
    return res.status(500).json({ mensaje: "No fue posible cambiar el estado de la ceremonia." });
  } finally {
    client?.release();
  }
});

app.patch("/api/ceremonias/:id/cupo-invitados", async (req, res) => {
  const idCeremonia = Number(req.params.id);
  const cupoInvitados = req.body && typeof req.body === "object" && !Array.isArray(req.body)
    ? req.body.cupoInvitados
    : null;
  if (
    !Number.isSafeInteger(idCeremonia) || idCeremonia <= 0 ||
    !Number.isSafeInteger(cupoInvitados) || cupoInvitados < 0
  ) {
    return res.status(400).json({ mensaje: "El cupo de invitados debe ser un entero igual o mayor que cero." });
  }

  let client;
  try {
    client = await pool.connect();
    await client.query("BEGIN");
    const ceremonia = await client.query(
      "SELECT id_ceremonia FROM ceremonia_grado WHERE id_ceremonia = $1 FOR UPDATE",
      [idCeremonia]
    );
    if (ceremonia.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ mensaje: "No se encontró la ceremonia." });
    }
    await client.query("SELECT pg_advisory_xact_lock($1, $2)", [51, idCeremonia]);
    const actualizados = await client.query(
      `UPDATE ceremonia_grado
       SET cupo_invitados = $1
       WHERE id_ceremonia = $2
       RETURNING id_ceremonia::text AS id, cupo_invitados AS "cupoInvitados"`,
      [cupoInvitados, idCeremonia]
    );
    const conteo = await client.query(
      `SELECT COUNT(*)::int AS registrados
       FROM invitado i
       JOIN graduando g ON g.id_graduando = i.id_graduando
       WHERE g.id_ceremonia = $1`,
      [idCeremonia]
    );
    await client.query("COMMIT");
    const registrados = conteo.rows[0].registrados;
    return res.json({
      ...actualizados.rows[0],
      invitadosRegistrados: registrados,
      invitadosExcedidos: Math.max(0, registrados - cupoInvitados),
    });
  } catch (error) {
    if (client) {
      await client.query("ROLLBACK").catch((rollbackError) => {
        console.error("Error al revertir la actualización del cupo:", rollbackError);
      });
    }
    console.error("Error al actualizar el cupo de invitados:", error);
    return res.status(500).json({ mensaje: "No fue posible actualizar el cupo de invitados." });
  } finally {
    client?.release();
  }
});

app.get("/api/ceremonias/:id/fotografias", async (req, res) => {
  const idCeremonia = Number(req.params.id);
  if (!Number.isSafeInteger(idCeremonia) || idCeremonia <= 0) {
    return res.status(400).json({ mensaje: "El identificador de la ceremonia no es válido." });
  }

  try {
    const resultado = await pool.query(
      `SELECT ${columnasEvidenciaFotografica.join(", ")}
       FROM ceremonia_grado
       WHERE id_ceremonia = $1`,
      [idCeremonia]
    );
    if (resultado.rows.length === 0) {
      return res.status(404).json({ mensaje: "No se encontró la ceremonia." });
    }

    const fotos = [];
    for (const [indice, columna] of columnasEvidenciaFotografica.entries()) {
      const buffer = resultado.rows[0][columna];
      if (!buffer) continue;
      const mimeType = obtenerMimeImagen(buffer);
      if (!mimeType) {
        console.error(`La evidencia fotográfica ${indice + 1} de la ceremonia ${idCeremonia} no es una imagen reconocida.`);
        return res.status(500).json({ mensaje: "No fue posible leer una de las fotografías de la ceremonia." });
      }
      fotos.push({
        slot: indice + 1,
        mimeType,
        base64: buffer.toString("base64"),
      });
    }
    return res.json({ fotos });
  } catch (error) {
    console.error("Error al consultar las fotografías de la ceremonia:", error);
    return res.status(500).json({ mensaje: "No fue posible consultar las fotografías de la ceremonia." });
  }
});

app.patch("/api/ceremonias/:id/fotografias", async (req, res) => {
  const idCeremonia = Number(req.params.id);
  const entrada = req.body && typeof req.body === "object" && !Array.isArray(req.body)
    ? req.body.fotos
    : null;
  if (
    !Number.isSafeInteger(idCeremonia) ||
    idCeremonia <= 0 ||
    !Array.isArray(entrada) ||
    entrada.length < 1 ||
    entrada.length > columnasEvidenciaFotografica.length
  ) {
    return res.status(400).json({ mensaje: "La ceremonia o las fotografías no son válidas." });
  }

  const fotos = [];
  for (const foto of entrada) {
    if (
      !foto ||
      typeof foto !== "object" ||
      typeof foto.base64 !== "string" ||
      !/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(foto.base64)
    ) {
      return res.status(400).json({ mensaje: "Una de las fotografías no tiene un formato válido." });
    }
    const buffer = Buffer.from(foto.base64, "base64");
    if (
      buffer.length === 0 ||
      buffer.length > 3 * 1024 * 1024 ||
      buffer.toString("base64") !== foto.base64
    ) {
      return res.status(400).json({ mensaje: "Cada fotografía debe ocupar como máximo 3 MB." });
    }
    const mimeType = obtenerMimeImagen(buffer);
    const mimeSolicitado = foto.mimeType === "image/jpg" ? "image/jpeg" : foto.mimeType;
    if (!mimeType || (mimeSolicitado && mimeSolicitado !== mimeType)) {
      return res.status(400).json({ mensaje: "Solo se permiten imágenes PNG, JPEG, WEBP o GIF válidas." });
    }
    fotos.push(buffer);
  }

  let client;
  try {
    client = await pool.connect();
    await client.query("BEGIN");
    const ceremonia = await client.query(
      `SELECT ${columnasEvidenciaFotografica.join(", ")}
       FROM ceremonia_grado
       WHERE id_ceremonia = $1
       FOR UPDATE`,
      [idCeremonia]
    );
    if (ceremonia.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ mensaje: "No se encontró la ceremonia." });
    }

    const espaciosDisponibles = columnasEvidenciaFotografica
      .map((columna, indice) => ({ columna, indice }))
      .filter(({ columna }) => ceremonia.rows[0][columna] == null);
    if (fotos.length > espaciosDisponibles.length) {
      await client.query("ROLLBACK");
      return res.status(409).json({ mensaje: "La ceremonia no tiene suficientes espacios para guardar esas fotografías." });
    }

    for (const [indice, buffer] of fotos.entries()) {
      const columna = espaciosDisponibles[indice].columna;
      await client.query(
        `UPDATE ceremonia_grado SET ${columna} = $1 WHERE id_ceremonia = $2`,
        [buffer, idCeremonia]
      );
    }
    await client.query("COMMIT");
    return res.status(201).json({
      guardadas: fotos.length,
      espaciosDisponibles: espaciosDisponibles.length - fotos.length,
    });
  } catch (error) {
    if (client) {
      await client.query("ROLLBACK").catch((rollbackError) => {
        console.error("Error al revertir el registro fotográfico:", rollbackError);
      });
    }
    console.error("Error al guardar las fotografías de la ceremonia:", error);
    return res.status(500).json({ mensaje: "No fue posible guardar las fotografías de la ceremonia." });
  } finally {
    client?.release();
  }
});

const consultaSesion = `
  SELECT s.id_sesion::text AS id,
         s.id_ceremonia::text AS "ceremoniaId",
         s.numero_sesion AS "numeroSesion",
         s.nombre,
         s.estado,
         TO_CHAR(s.hora_inicio, 'HH24:MI') AS "horaInicio",
         TO_CHAR(s.hora_fin, 'HH24:MI') AS "horaFin",
         COALESCE(
           json_agg(p.nombre ORDER BY p.nombre)
             FILTER (WHERE p.id_programa IS NOT NULL),
           '[]'::json
         ) AS programas,
         COALESCE(
           json_agg(sp.id_programa ORDER BY sp.id_programa)
             FILTER (WHERE sp.id_programa IS NOT NULL),
           '[]'::json
         ) AS "programaIds",
         (SELECT COUNT(*)::int
          FROM graduando g
          WHERE g.id_sesion = s.id_sesion
            AND g.id_ceremonia = s.id_ceremonia) AS "graduandosCount",
         (SELECT COUNT(*)::int
          FROM invitado i
          JOIN graduando g ON g.id_graduando = i.id_graduando
          WHERE g.id_sesion = s.id_sesion
            AND g.id_ceremonia = s.id_ceremonia) AS "invitadosCount"
  FROM sesion s
  LEFT JOIN sesion_programa sp ON sp.id_sesion = s.id_sesion
  LEFT JOIN programa p ON p.id_programa = sp.id_programa
`;

app.get("/api/ceremonias/:id/sesiones", async (req, res) => {
  const idCeremonia = Number(req.params.id);
  if (!Number.isSafeInteger(idCeremonia) || idCeremonia <= 0) {
    return res.status(400).json({ mensaje: "El identificador de la ceremonia no es válido." });
  }

  try {
    const ceremonia = await pool.query(
      "SELECT 1 FROM ceremonia_grado WHERE id_ceremonia = $1",
      [idCeremonia]
    );
    if (ceremonia.rows.length === 0) {
      return res.status(404).json({ mensaje: "No se encontró la ceremonia." });
    }
    const resultado = await pool.query(
      `${consultaSesion}
       WHERE s.id_ceremonia = $1
       GROUP BY s.id_sesion
       ORDER BY s.numero_sesion, s.id_sesion`,
      [idCeremonia]
    );
    return res.json(resultado.rows);
  } catch (error) {
    console.error("Error al consultar las sesiones:", error);
    return res.status(500).json({ mensaje: "Error al consultar las sesiones." });
  }
});

app.get("/api/sesiones/:id", async (req, res) => {
  const idSesion = Number(req.params.id);
  if (!Number.isSafeInteger(idSesion) || idSesion <= 0) {
    return res.status(400).json({ mensaje: "El identificador de la sesión no es válido." });
  }

  try {
    const resultado = await pool.query(
      `${consultaSesion}
       WHERE s.id_sesion = $1
       GROUP BY s.id_sesion`,
      [idSesion]
    );
    if (resultado.rows.length === 0) {
      return res.status(404).json({ mensaje: "No se encontró la sesión." });
    }
    return res.json(resultado.rows[0]);
  } catch (error) {
    console.error("Error al consultar la sesión:", error);
    return res.status(500).json({ mensaje: "Error al consultar la sesión." });
  }
});

app.post("/api/ceremonias/:id/sesiones", async (req, res) => {
  const idCeremonia = Number(req.params.id);
  const cuerpo = req.body;
  if (!Number.isSafeInteger(idCeremonia) || idCeremonia <= 0) {
    return res.status(400).json({ mensaje: "El identificador de la ceremonia no es válido." });
  }
  if (!cuerpo || typeof cuerpo !== "object" || Array.isArray(cuerpo)) {
    return res.status(400).json({ mensaje: "El cuerpo de la sesión no es válido." });
  }

  const nombre = typeof cuerpo.nombre === "string" ? cuerpo.nombre.trim() : "";
  const estado = cuerpo.estado ?? "Pendiente";
  const horaInicio = cuerpo.horaInicio || null;
  const horaFin = cuerpo.horaFin || null;
  const programas = cuerpo.programas ?? [];
  const horaValida = (hora) => typeof hora === "string" && /^([01]\d|2[0-3]):[0-5]\d$/.test(hora);
  if (
    (nombre && nombre.length > 150) ||
    !estadosSesion.includes(estado) ||
    (horaInicio !== null && !horaValida(horaInicio)) ||
    (horaFin !== null && !horaValida(horaFin)) ||
    ((horaInicio === null) !== (horaFin === null)) ||
    (horaInicio !== null && horaFin <= horaInicio) ||
    !Array.isArray(programas) ||
    programas.some((programa) => typeof programa !== "string" || !programa.trim())
  ) {
    return res.status(400).json({ mensaje: "Completa los datos de la sesión con valores válidos." });
  }

  let client;
  try {
    client = await pool.connect();
    await client.query("BEGIN");
    const ceremonia = await client.query(
      "SELECT id_ceremonia FROM ceremonia_grado WHERE id_ceremonia = $1 FOR UPDATE",
      [idCeremonia]
    );
    if (ceremonia.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ mensaje: "No se encontró la ceremonia." });
    }

    const numero = await client.query(
      "SELECT COALESCE(MAX(numero_sesion), 0) + 1 AS numero FROM sesion WHERE id_ceremonia = $1",
      [idCeremonia]
    );
    const creada = await client.query(
      `INSERT INTO sesion
         (id_ceremonia, numero_sesion, nombre, estado, hora_inicio, hora_fin)
       VALUES ($1, $2, $3, $4, $5::time, $6::time)
       RETURNING id_sesion`,
      [
        idCeremonia,
        numero.rows[0].numero,
        nombre || `Sesión ${numero.rows[0].numero}`,
        estado,
        horaInicio,
        horaFin,
      ]
    );
    const idSesion = creada.rows[0].id_sesion;

    if (programas.length > 0) {
      const programasEncontrados = await client.query(
        `SELECT id_programa, nombre
         FROM programa
         WHERE estado = TRUE AND nombre = ANY($1::varchar[])`,
        [programas.map((programa) => programa.trim())]
      );
      const nombresSolicitados = new Set(programas.map((programa) => programa.trim()));
      if (programasEncontrados.rows.length !== nombresSolicitados.size) {
        await client.query("ROLLBACK");
        return res.status(400).json({ mensaje: "Uno o más programas no existen o no están activos." });
      }
      for (const programa of programasEncontrados.rows) {
        await client.query(
          "INSERT INTO sesion_programa (id_sesion, id_programa) VALUES ($1, $2)",
          [idSesion, programa.id_programa]
        );
      }
    }

    const resultado = await client.query(
      `${consultaSesion}
       WHERE s.id_sesion = $1
       GROUP BY s.id_sesion`,
      [idSesion]
    );
    await client.query("COMMIT");
    return res.status(201).json(resultado.rows[0]);
  } catch (error) {
    if (client) {
      await client.query("ROLLBACK").catch((rollbackError) => {
        console.error("Error al revertir la creación de la sesión:", rollbackError);
      });
    }
    console.error("Error al crear la sesión:", error);
    return res.status(500).json({ mensaje: "Error al crear la sesión." });
  } finally {
    client?.release();
  }
});

app.patch("/api/sesiones/:id", async (req, res) => {
  const idSesion = Number(req.params.id);
  const cuerpo = req.body;
  if (!Number.isSafeInteger(idSesion) || idSesion <= 0) {
    return res.status(400).json({ mensaje: "El identificador de la sesión no es válido." });
  }
  if (!cuerpo || typeof cuerpo !== "object" || Array.isArray(cuerpo)) {
    return res.status(400).json({ mensaje: "El cuerpo de la sesión no es válido." });
  }

  const nombre = typeof cuerpo.nombre === "string" ? cuerpo.nombre.trim() : "";
  const estado = cuerpo.estado;
  const horaInicio = cuerpo.horaInicio || null;
  const horaFin = cuerpo.horaFin || null;
  const programas = cuerpo.programas;
  const horaValida = (hora) => typeof hora === "string" && /^([01]\d|2[0-3]):[0-5]\d$/.test(hora);
  if (
    !nombre || nombre.length > 150 || !estadosSesion.includes(estado) ||
    (horaInicio !== null && !horaValida(horaInicio)) ||
    (horaFin !== null && !horaValida(horaFin)) ||
    ((horaInicio === null) !== (horaFin === null)) ||
    (horaInicio !== null && horaFin <= horaInicio) ||
    !Array.isArray(programas) ||
    programas.some((programa) => typeof programa !== "string" || !programa.trim())
  ) {
    return res.status(400).json({ mensaje: "Completa los datos de la sesión con valores válidos." });
  }

  let client;
  try {
    client = await pool.connect();
    await client.query("BEGIN");
    const sesion = await client.query(
      "SELECT id_sesion, estado FROM sesion WHERE id_sesion = $1 FOR UPDATE",
      [idSesion]
    );
    if (sesion.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ mensaje: "No se encontró la sesión." });
    }
    const estadoActual = sesion.rows[0].estado;
    const indiceEstadoActual = ordenEstadosSesion.indexOf(estadoActual);
    const indiceEstadoNuevo = ordenEstadosSesion.indexOf(estado);
    if (
      indiceEstadoActual < 0 ||
      indiceEstadoNuevo < 0 ||
      (process.env.NODE_ENV === "production" && (
        indiceEstadoNuevo < indiceEstadoActual ||
        indiceEstadoNuevo > indiceEstadoActual + 1
      ))
    ) {
      await client.query("ROLLBACK");
      return res.status(409).json({
        mensaje: `No se puede cambiar una sesión de "${estadoActual}" a "${estado}".`,
      });
    }

    const programasUnicos = [...new Set(programas.map((programa) => programa.trim()))];
    const programasEncontrados = programasUnicos.length
      ? await client.query(
          `SELECT id_programa, nombre
           FROM programa
           WHERE estado = TRUE AND nombre = ANY($1::varchar[])`,
          [programasUnicos]
        )
      : { rows: [] };
    if (programasEncontrados.rows.length !== programasUnicos.length) {
      await client.query("ROLLBACK");
      return res.status(400).json({ mensaje: "Uno o más programas no existen o no están activos." });
    }

    await client.query(
      `UPDATE sesion
       SET nombre = $1, estado = $2, hora_inicio = $3::time, hora_fin = $4::time
       WHERE id_sesion = $5`,
      [nombre, estado, horaInicio, horaFin, idSesion]
    );
    await client.query("DELETE FROM sesion_programa WHERE id_sesion = $1", [idSesion]);
    for (const programa of programasEncontrados.rows) {
      await client.query(
        "INSERT INTO sesion_programa (id_sesion, id_programa) VALUES ($1, $2)",
        [idSesion, programa.id_programa]
      );
    }

    const resultado = await client.query(
      `${consultaSesion}
       WHERE s.id_sesion = $1
       GROUP BY s.id_sesion`,
      [idSesion]
    );
    await client.query("COMMIT");
    return res.json(resultado.rows[0]);
  } catch (error) {
    if (client) {
      await client.query("ROLLBACK").catch((rollbackError) => {
        console.error("Error al revertir la actualización de la sesión:", rollbackError);
      });
    }
    console.error("Error al actualizar la sesión:", error);
    return res.status(500).json({ mensaje: "Error al actualizar la sesión." });
  } finally {
    client?.release();
  }
});

const consultaGraduando = `
  SELECT g.id_graduando::text AS id,
         g.id_ceremonia::text AS "ceremoniaId",
         g.id_sesion::text AS "sesionId",
         g.nombres,
         g.apellidos,
         g.identificacion AS documento,
         g.correo_electronico AS correo,
         g.telefono,
         g.codigo_estudiantil AS "codigoEstudiantil",
         g.talla_toga AS "tallaToga",
         g.requisitos_cumplidos AS "requisitosCumplidos",
         g.estado,
         COALESCE(s.nombre, 'Sin asignar') AS "sesionLabel",
         COALESCE(programas.nombres, 'Sin programa') AS programa,
         COALESCE(programas.ids, '[]'::json) AS "programaIds",
         (SELECT COUNT(*)::int
          FROM invitado i
          WHERE i.id_graduando = g.id_graduando) AS "invitadosCount"
  FROM graduando g
  LEFT JOIN sesion s ON s.id_sesion = g.id_sesion
  LEFT JOIN LATERAL (
    SELECT STRING_AGG(p.nombre, ', ' ORDER BY p.nombre) AS nombres,
           JSON_AGG(gp.id_programa ORDER BY p.nombre) AS ids
    FROM graduando_programa gp
    JOIN programa p ON p.id_programa = gp.id_programa
    WHERE gp.id_graduando = g.id_graduando
  ) programas ON TRUE
`;

const normalizarDocumento = (documento) => documento.replace(/\D/g, "");

async function obtenerDocumentosExistentes(
  client,
  idCeremonia,
  documentos,
  { idGraduandoExcluir = null, idInvitadoExcluir = null } = {}
) {
  if (documentos.length === 0) return new Set();
  const resultado = await client.query(
    `SELECT regexp_replace(g.identificacion, '[^0-9]', '', 'g') AS documento
     FROM graduando g
     WHERE g.id_ceremonia = $1
       AND ($3::integer IS NULL OR g.id_graduando <> $3)
       AND regexp_replace(g.identificacion, '[^0-9]', '', 'g') = ANY($2::text[])
     UNION
     SELECT regexp_replace(i.identificacion, '[^0-9]', '', 'g') AS documento
     FROM invitado i
     JOIN graduando g ON g.id_graduando = i.id_graduando
     WHERE g.id_ceremonia = $1
       AND ($4::integer IS NULL OR i.id_invitado <> $4)
       AND regexp_replace(i.identificacion, '[^0-9]', '', 'g') = ANY($2::text[])`,
    [idCeremonia, documentos, idGraduandoExcluir, idInvitadoExcluir]
  );
  return new Set(resultado.rows.map((fila) => fila.documento));
}

const consultaInvitado = `
  SELECT i.id_invitado::text AS id,
         g.id_graduando::text AS "graduandoId",
         g.id_ceremonia::text AS "ceremoniaId",
         i.nombre,
         COALESCE(i.identificacion, '') AS documento,
         COALESCE(to_jsonb(i)->>'telefono', '') AS telefono,
         COALESCE(to_jsonb(i)->>'parentesco', 'Familiar') AS parentesco,
         CONCAT(g.nombres, ' ', g.apellidos) AS "graduandoNombre",
         COALESCE(to_jsonb(i)->>'parentesco', 'Familiar') AS tipo,
         CASE WHEN i.autorizado THEN 'Autorizado' ELSE 'Pendiente' END AS autorizacion,
         CASE WHEN ingreso.ingreso IS TRUE THEN 'Ingresó' ELSE 'Pendiente' END AS "estadoIngreso",
         CASE WHEN ingreso.ingreso IS TRUE
           THEN TO_CHAR(ingreso.hora_ingreso, 'FMHH12:MI AM')
           ELSE NULL
         END AS "horaIngreso"
  FROM invitado i
  JOIN graduando g ON g.id_graduando = i.id_graduando
  LEFT JOIN LATERAL (
    SELECT ci.ingreso, ci.hora_ingreso
    FROM control_ingreso ci
    WHERE ci.id_invitado = i.id_invitado
    ORDER BY ci.id_control_ingreso DESC
    LIMIT 1
  ) ingreso ON TRUE
`;

async function obtenerColumnasOpcionalesInvitado(db) {
  const resultado = await db.query(
    `SELECT column_name
     FROM information_schema.columns
     WHERE table_schema = current_schema()
       AND table_name = 'invitado'
       AND column_name = ANY($1::text[])`,
    [["telefono", "parentesco"]]
  );
  return new Set(resultado.rows.map((fila) => fila.column_name));
}

async function consultarEstadisticasControlIngreso(db, idCeremonia, idSesion) {
  const resultado = await db.query(
    `SELECT
       (SELECT COUNT(*)::int
        FROM graduando g
        WHERE g.id_ceremonia = $1 AND g.id_sesion = $2) AS graduandos_registrados,
       (SELECT COUNT(DISTINCT g.id_graduando)::int
        FROM graduando g
        JOIN control_ingreso ci
          ON ci.id_graduando = g.id_graduando
         AND ci.id_sesion = $2
         AND ci.ingreso = TRUE
        WHERE g.id_ceremonia = $1 AND g.id_sesion = $2) AS graduandos_ingresaron,
       (SELECT COUNT(*)::int
        FROM invitado i
        JOIN graduando g ON g.id_graduando = i.id_graduando
        WHERE g.id_ceremonia = $1
          AND g.id_sesion = $2
          AND i.autorizado = TRUE) AS invitados_registrados,
       (SELECT COUNT(DISTINCT i.id_invitado)::int
        FROM invitado i
        JOIN graduando g ON g.id_graduando = i.id_graduando
        JOIN control_ingreso ci
          ON ci.id_invitado = i.id_invitado
         AND ci.id_sesion = $2
         AND ci.ingreso = TRUE
        WHERE g.id_ceremonia = $1
          AND g.id_sesion = $2
          AND i.autorizado = TRUE) AS invitados_ingresaron`,
    [idCeremonia, idSesion]
  );
  const conteos = resultado.rows[0];
  return {
    graduandos: {
      registrados: conteos.graduandos_registrados,
      ingresaron: conteos.graduandos_ingresaron,
      pendientes: Math.max(0, conteos.graduandos_registrados - conteos.graduandos_ingresaron),
    },
    invitados: {
      registrados: conteos.invitados_registrados,
      ingresaron: conteos.invitados_ingresaron,
      pendientes: Math.max(0, conteos.invitados_registrados - conteos.invitados_ingresaron),
    },
  };
}

async function insertarControlIngreso(db, idSesion, tipoPersona, idPersona) {
  const columna = tipoPersona === "graduando" ? "id_graduando" : "id_invitado";
  const buscarIngresoExistente = () => db.query(
    `SELECT TO_CHAR(hora_ingreso, 'FMHH12:MI AM') AS "horaIngreso"
     FROM control_ingreso
     WHERE id_sesion = $1
       AND ${columna} = $2
       AND ingreso = TRUE
     ORDER BY id_control_ingreso
     LIMIT 1`,
    [idSesion, idPersona]
  );
  const registroExistente = await buscarIngresoExistente();
  if (registroExistente.rows.length > 0) {
    return {
      yaIngreso: true,
      mensaje: "Ya ingresó",
      horaIngreso: registroExistente.rows[0].horaIngreso,
    };
  }

  const insertado = await db.query(
    `INSERT INTO control_ingreso (id_sesion, ${columna}, ingreso, hora_ingreso)
     VALUES ($1, $2, TRUE, CURRENT_TIME)
     ON CONFLICT DO NOTHING
     RETURNING TO_CHAR(hora_ingreso, 'FMHH12:MI AM') AS "horaIngreso"`,
    [idSesion, idPersona]
  );
  if (insertado.rowCount === 1) {
    return {
      yaIngreso: false,
      mensaje: "Ingreso registrado.",
      horaIngreso: insertado.rows[0].horaIngreso,
    };
  }

  const existente = await buscarIngresoExistente();
  if (existente.rows.length > 0) {
    return {
      yaIngreso: true,
      mensaje: "Ya ingresó",
      horaIngreso: existente.rows[0].horaIngreso,
    };
  }
  return {
    yaIngreso: false,
    mensaje: "Ya existe un registro de control para esta persona y sesión.",
    horaIngreso: null,
    conflicto: true,
  };
}

app.get("/api/ceremonias/:id/control-ingreso", async (req, res) => {
  const idCeremonia = Number(req.params.id);
  const idSesion = Number(req.query.sesion);
  if (
    !Number.isSafeInteger(idCeremonia) || idCeremonia <= 0 ||
    typeof req.query.sesion !== "string" ||
    !Number.isSafeInteger(idSesion) || idSesion <= 0
  ) {
    return res.status(400).json({ mensaje: "La ceremonia o la sesión no son válidas." });
  }

  try {
    const sesion = await pool.query(
      "SELECT 1 FROM sesion WHERE id_sesion = $1 AND id_ceremonia = $2",
      [idSesion, idCeremonia]
    );
    if (sesion.rows.length === 0) {
      return res.status(404).json({ mensaje: "La sesión no pertenece a esta ceremonia." });
    }
    return res.json(await consultarEstadisticasControlIngreso(pool, idCeremonia, idSesion));
  } catch (error) {
    console.error("Error al consultar las estadísticas de ingreso:", error);
    return res.status(500).json({ mensaje: "Error al consultar las estadísticas de ingreso." });
  }
});

app.get("/api/ceremonias/:id/control-ingreso/graduandos", async (req, res) => {
  const idCeremonia = Number(req.params.id);
  const idSesion = Number(req.query.sesion);
  const busqueda = typeof req.query.search === "string" ? req.query.search.trim() : "";
  if (
    !Number.isSafeInteger(idCeremonia) || idCeremonia <= 0 ||
    typeof req.query.sesion !== "string" ||
    !Number.isSafeInteger(idSesion) || idSesion <= 0 ||
    typeof req.query.search !== "string" ||
    !busqueda || busqueda.length > 150
  ) {
    return res.status(400).json({ mensaje: "Ingresa un nombre o documento válido y selecciona una sesión." });
  }

  try {
    const sesion = await pool.query(
      "SELECT 1 FROM sesion WHERE id_sesion = $1 AND id_ceremonia = $2",
      [idSesion, idCeremonia]
    );
    if (sesion.rows.length === 0) {
      return res.status(404).json({ mensaje: "La sesión no pertenece a esta ceremonia." });
    }

    const documento = normalizarDocumento(busqueda);
    const patron = `%${busqueda}%`;
    const coincidencias = await pool.query(
      `SELECT graduando.*,
              CASE WHEN control.ingreso IS TRUE THEN 'Ingresó' ELSE 'Pendiente' END AS "estadoIngreso",
              control."horaIngreso"
       FROM (
         ${consultaGraduando}
         WHERE g.id_ceremonia = $1 AND g.id_sesion = $2
       ) graduando
       LEFT JOIN LATERAL (
         SELECT ci.ingreso,
                TO_CHAR(ci.hora_ingreso, 'FMHH12:MI AM') AS "horaIngreso"
         FROM control_ingreso ci
         WHERE ci.id_sesion = $2
           AND ci.id_graduando = graduando.id::integer
           AND ci.ingreso = TRUE
         ORDER BY ci.id_control_ingreso
         LIMIT 1
       ) control ON TRUE
       WHERE CONCAT_WS(' ', graduando.nombres, graduando.apellidos) ILIKE $3
          OR ($4 <> '' AND regexp_replace(graduando.documento, '[^0-9]', '', 'g') = $4)
       ORDER BY graduando.apellidos, graduando.nombres, graduando.id
       LIMIT 50`,
      [idCeremonia, idSesion, patron, documento]
    );
    if (coincidencias.rows.length > 0) {
      return res.json(coincidencias.rows);
    }

    const otraCoincidencia = await pool.query(
      `SELECT id_ceremonia, id_sesion
       FROM graduando
       WHERE CONCAT_WS(' ', nombres, apellidos) ILIKE $1
          OR ($2 <> '' AND regexp_replace(identificacion, '[^0-9]', '', 'g') = $2)
       ORDER BY CASE WHEN id_ceremonia = $3 THEN 0 ELSE 1 END, id_graduando
       LIMIT 1`,
      [patron, documento, idCeremonia]
    );
    if (otraCoincidencia.rows.length > 0) {
      if (otraCoincidencia.rows[0].id_ceremonia === idCeremonia) {
        return res.status(409).json({
          mensaje: "Este graduando pertenece a otra sesión / no tiene sesión asignada",
        });
      }
      return res.status(409).json({ mensaje: "Este graduando pertenece a otra ceremonia." });
    }
    return res.status(404).json({ mensaje: "No se encontró un graduando con ese nombre o documento." });
  } catch (error) {
    console.error("Error al buscar graduandos para el control de ingreso:", error);
    return res.status(500).json({ mensaje: "Error al buscar graduandos para el control de ingreso." });
  }
});

app.get("/api/ceremonias/:id/control-ingreso/graduandos/:graduandoId/invitados", async (req, res) => {
  const idCeremonia = Number(req.params.id);
  const idGraduando = Number(req.params.graduandoId);
  const idSesion = Number(req.query.sesion);
  if (
    !Number.isSafeInteger(idCeremonia) || idCeremonia <= 0 ||
    !Number.isSafeInteger(idGraduando) || idGraduando <= 0 ||
    typeof req.query.sesion !== "string" ||
    !Number.isSafeInteger(idSesion) || idSesion <= 0
  ) {
    return res.status(400).json({ mensaje: "La ceremonia, sesión o graduando no son válidos." });
  }

  try {
    const graduando = await pool.query(
      "SELECT id_ceremonia, id_sesion FROM graduando WHERE id_graduando = $1",
      [idGraduando]
    );
    if (graduando.rows.length === 0 || graduando.rows[0].id_ceremonia !== idCeremonia) {
      return res.status(404).json({ mensaje: "El graduando no pertenece a esta ceremonia." });
    }
    if (graduando.rows[0].id_sesion === null || graduando.rows[0].id_sesion !== idSesion) {
      return res.status(409).json({
        mensaje: "Este graduando pertenece a otra sesión / no tiene sesión asignada",
      });
    }
    const sesion = await pool.query(
      "SELECT 1 FROM sesion WHERE id_sesion = $1 AND id_ceremonia = $2",
      [idSesion, idCeremonia]
    );
    if (sesion.rows.length === 0) {
      return res.status(404).json({ mensaje: "La sesión no pertenece a esta ceremonia." });
    }

    const invitados = await pool.query(
      `SELECT i.id_invitado::text AS id,
              g.id_graduando::text AS "graduandoId",
              g.id_ceremonia::text AS "ceremoniaId",
              i.nombre,
              COALESCE(i.identificacion, '') AS documento,
              COALESCE(to_jsonb(i)->>'telefono', '') AS telefono,
              COALESCE(to_jsonb(i)->>'parentesco', 'Familiar') AS parentesco,
              CONCAT(g.nombres, ' ', g.apellidos) AS "graduandoNombre",
              COALESCE(to_jsonb(i)->>'parentesco', 'Familiar') AS tipo,
              'Autorizado'::text AS autorizacion,
              CASE WHEN control.id_control_ingreso IS NULL THEN 'Pendiente' ELSE 'Ingresó' END AS "estadoIngreso",
              control."horaIngreso"
       FROM invitado i
       JOIN graduando g ON g.id_graduando = i.id_graduando
       LEFT JOIN LATERAL (
         SELECT ci.id_control_ingreso,
                TO_CHAR(ci.hora_ingreso, 'FMHH12:MI AM') AS "horaIngreso"
         FROM control_ingreso ci
         WHERE ci.id_invitado = i.id_invitado
           AND ci.id_sesion = $1
           AND ci.ingreso = TRUE
         ORDER BY ci.id_control_ingreso
         LIMIT 1
       ) control ON TRUE
       WHERE g.id_ceremonia = $2
         AND g.id_sesion = $1
         AND g.id_graduando = $3
         AND i.autorizado = TRUE
       ORDER BY i.nombre, i.id_invitado`,
      [idSesion, idCeremonia, idGraduando]
    );
    return res.json(invitados.rows);
  } catch (error) {
    console.error("Error al consultar invitados para el control de ingreso:", error);
    return res.status(500).json({ mensaje: "Error al consultar invitados para el control de ingreso." });
  }
});

function validarDatosGraduando(cuerpo) {
  const nombres = typeof cuerpo.nombres === "string" ? cuerpo.nombres.trim() : "";
  const apellidos = typeof cuerpo.apellidos === "string" ? cuerpo.apellidos.trim() : "";
  const documento = typeof cuerpo.documento === "string"
    ? normalizarDocumento(cuerpo.documento)
    : "";
  const correo = typeof cuerpo.correo === "string" ? cuerpo.correo.trim() : "";
  const telefono = typeof cuerpo.telefono === "string" ? cuerpo.telefono.trim() : "";
  const codigoEstudiantil = typeof cuerpo.codigoEstudiantil === "string"
    ? cuerpo.codigoEstudiantil.trim()
    : "";
  const tallaToga = typeof cuerpo.tallaToga === "string" ? cuerpo.tallaToga.trim() : "";
  const estado = cuerpo.estado === undefined ? true : cuerpo.estado;
  const requisitosCumplidos = cuerpo.requisitosCumplidos === undefined
    ? false
    : cuerpo.requisitosCumplidos;
  const idSesion = cuerpo.idSesion === undefined || cuerpo.idSesion === null || cuerpo.idSesion === ""
    ? null
    : Number(cuerpo.idSesion);
  const programaIds = Array.isArray(cuerpo.programaIds)
    ? cuerpo.programaIds.map(Number)
    : cuerpo.idPrograma === undefined ? [] : [Number(cuerpo.idPrograma)];

  if (
    !nombres || nombres.length > 150 || !apellidos || apellidos.length > 150 ||
    !documento || documento.length > 50 ||
    (correo && (correo.length > 150 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo))) ||
    telefono.length > 50 || codigoEstudiantil.length > 50 || tallaToga.length > 20 ||
    typeof estado !== "boolean" || typeof requisitosCumplidos !== "boolean" ||
    (idSesion !== null && (!Number.isSafeInteger(idSesion) || idSesion <= 0))
  ) {
    return { mensaje: "Verifica los datos personales, el documento y los valores seleccionados." };
  }
  return {
    valores: {
      nombres,
      apellidos,
      documento,
      correo: correo || null,
      telefono: telefono || null,
      codigoEstudiantil: codigoEstudiantil || null,
      tallaToga: tallaToga || null,
      estado,
      requisitosCumplidos,
      idSesion,
      programaIds,
    },
  };
}

async function validarProgramasGraduando(client, programaIds) {
  const idsUnicos = [...new Set(programaIds)];
  if (!idsUnicos.length || idsUnicos.some((id) => !Number.isSafeInteger(id) || id <= 0)) {
    return { mensaje: "Selecciona al menos un programa académico válido." };
  }
  const encontrados = await client.query(
    `SELECT id_programa
     FROM programa
     WHERE estado = TRUE AND id_programa = ANY($1::integer[])`,
    [idsUnicos]
  );
  if (encontrados.rows.length !== idsUnicos.length) {
    return { mensaje: "Uno o más programas no existen o no están activos." };
  }
  return { ids: idsUnicos };
}

async function validarSesionGraduando(client, idCeremonia, idSesion, programaIds) {
  if (idSesion === null) return null;
  const sesion = await client.query(
    `SELECT id_sesion
     FROM sesion
     WHERE id_sesion = $1 AND id_ceremonia = $2`,
    [idSesion, idCeremonia]
  );
  if (sesion.rows.length === 0) {
    return "La sesión seleccionada no pertenece a esta ceremonia.";
  }
  if (!programaIds.length) {
    return "Para asignar una sesión, el graduando debe tener un programa compatible.";
  }
  const programaCompatible = await client.query(
    `SELECT EXISTS (
       SELECT 1
       FROM sesion_programa
       WHERE id_sesion = $1 AND id_programa = ANY($2::integer[])
     ) AS compatible`,
    [idSesion, programaIds]
  );
  if (!programaCompatible.rows[0].compatible) {
    return "La sesión debe incluir al menos uno de los programas del graduando.";
  }
  return null;
}

const MAX_FILAS_IMPORTACION_GRADUANDOS = 1000;
const CAMPOS_IMPORTACION_GRADUANDOS = [
  "identificacion",
  "nombres",
  "apellidos",
  "correo_electronico",
  "telefono",
  "codigo_estudiantil",
  "talla_toga",
  "programa",
  "sesion",
];

function obtenerFilasImportacion(body) {
  if (!body || typeof body !== "object" || Array.isArray(body) || !Array.isArray(body.filas)) {
    return { mensaje: "El archivo no contiene una lista válida de filas." };
  }
  if (body.filas.length === 0 || body.filas.length > MAX_FILAS_IMPORTACION_GRADUANDOS) {
    return { mensaje: `La importación debe tener entre 1 y ${MAX_FILAS_IMPORTACION_GRADUANDOS} filas.` };
  }

  const filas = [];
  for (const fila of body.filas) {
    if (
      !fila || typeof fila !== "object" || Array.isArray(fila) ||
      !Number.isSafeInteger(fila.filaExcel) || fila.filaExcel < 2 ||
      CAMPOS_IMPORTACION_GRADUANDOS.some((campo) =>
        fila[campo] !== undefined &&
        fila[campo] !== null &&
        !["string", "number", "boolean"].includes(typeof fila[campo])
      )
    ) {
      return { mensaje: "Una o más filas del archivo tienen un formato no válido." };
    }
    const normalizada = { filaExcel: fila.filaExcel };
    for (const campo of CAMPOS_IMPORTACION_GRADUANDOS) {
      normalizada[campo] = String(fila[campo] ?? "").trim();
    }
    filas.push(normalizada);
  }
  return { filas };
}

function normalizarNombreCatalogo(nombre) {
  return String(nombre ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

function obtenerNumeroSesion(valor) {
  const normalizado = normalizarNombreCatalogo(valor).replace(/\s+/g, "");
  const coincidencia = /^(?:sesion)?(\d+)$/.exec(normalizado);
  if (!coincidencia) return null;
  const numero = Number(coincidencia[1]);
  return Number.isSafeInteger(numero) && numero > 0 ? numero : null;
}

async function analizarImportacionGraduandos(client, idCeremonia, filas) {
  const [programasResultado, sesionesResultado] = await Promise.all([
    client.query(
      "SELECT id_programa, nombre FROM programa WHERE estado = TRUE"
    ),
    client.query(
      `SELECT s.id_sesion, s.numero_sesion, sp.id_programa
       FROM sesion s
       LEFT JOIN sesion_programa sp ON sp.id_sesion = s.id_sesion
       WHERE s.id_ceremonia = $1`,
      [idCeremonia]
    ),
  ]);

  const documentos = [...new Set(
    filas.map((fila) => normalizarDocumento(fila.identificacion)).filter(Boolean)
  )];
  const documentosExistentes = await obtenerDocumentosExistentes(
    client,
    idCeremonia,
    documentos
  );

  const programasPorNombre = new Map();
  for (const programa of programasResultado.rows) {
    const nombreNormalizado = normalizarNombreCatalogo(programa.nombre);
    const encontrados = programasPorNombre.get(nombreNormalizado) ?? [];
    encontrados.push(programa);
    programasPorNombre.set(nombreNormalizado, encontrados);
  }

  const sesionesPorNumero = new Map();
  for (const sesion of sesionesResultado.rows) {
    const encontrada = sesionesPorNumero.get(sesion.numero_sesion) ?? {
      id: sesion.id_sesion,
      programas: new Set(),
    };
    if (sesion.id_programa !== null) encontrada.programas.add(sesion.id_programa);
    sesionesPorNumero.set(sesion.numero_sesion, encontrada);
  }

  const filasPorDocumento = new Map();
  for (const fila of filas) {
    const documento = normalizarDocumento(fila.identificacion);
    if (!documento) continue;
    const ocurrencias = filasPorDocumento.get(documento) ?? [];
    ocurrencias.push(fila.filaExcel);
    filasPorDocumento.set(documento, ocurrencias);
  }

  const validas = [];
  const reporte = [];

  for (const fila of filas) {
    const errores = [];
    const identificacion = normalizarDocumento(fila.identificacion);
    const nombres = fila.nombres.trim();
    const apellidos = fila.apellidos.trim();
    const correo = fila.correo_electronico.trim();
    const telefono = fila.telefono.trim();
    const codigoEstudiantil = fila.codigo_estudiantil.trim();
    const tallaToga = fila.talla_toga.trim();

    if (!identificacion) errores.push("La identificación es obligatoria y debe contener dígitos.");
    if (identificacion.length > 50) errores.push("La identificación supera 50 caracteres.");
    if (!nombres) errores.push("Los nombres son obligatorios.");
    if (nombres.length > 150) errores.push("Los nombres superan 150 caracteres.");
    if (!apellidos) errores.push("Los apellidos son obligatorios.");
    if (apellidos.length > 150) errores.push("Los apellidos superan 150 caracteres.");
    if (correo && (correo.length > 150 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo))) {
      errores.push("El correo electrónico no es válido.");
    }
    if (telefono.length > 50) errores.push("El teléfono supera 50 caracteres.");
    if (codigoEstudiantil.length > 50) errores.push("El código estudiantil supera 50 caracteres.");
    if (tallaToga.length > 20) errores.push("La talla de toga supera 20 caracteres.");

    const ocurrencias = filasPorDocumento.get(identificacion) ?? [];
    if (identificacion && ocurrencias.length > 1) {
      errores.push(`Documento duplicado en el archivo (filas ${ocurrencias.join(", ")}).`);
    }
    if (identificacion && documentosExistentes.has(identificacion)) {
      errores.push("El documento ya existe en esta ceremonia.");
    }

    const nombresPrograma = normalizarNombreCatalogo(fila.programa);
    const coincidenciasPrograma = programasPorNombre.get(nombresPrograma) ?? [];
    let idPrograma = null;
    if (!fila.programa.trim()) {
      errores.push("El programa es obligatorio.");
    } else if (coincidenciasPrograma.length === 0) {
      errores.push(`El programa "${fila.programa}" no existe o no está activo.`);
    } else if (coincidenciasPrograma.length > 1) {
      errores.push(`El programa "${fila.programa}" no se puede identificar de forma única.`);
    } else {
      idPrograma = coincidenciasPrograma[0].id_programa;
    }

    let idSesion = null;
    if (fila.sesion.trim()) {
      const numeroSesion = obtenerNumeroSesion(fila.sesion);
      if (numeroSesion === null) {
        errores.push("La sesión debe ser un número, por ejemplo 1 o Sesión 1.");
      } else {
        const sesion = sesionesPorNumero.get(numeroSesion);
        if (!sesion) {
          errores.push(`La sesión ${numeroSesion} no existe en esta ceremonia.`);
        } else if (idPrograma !== null && !sesion.programas.has(idPrograma)) {
          errores.push(`La sesión ${numeroSesion} no está asociada al programa "${fila.programa}".`);
        } else {
          idSesion = sesion.id;
        }
      }
    }

    if (errores.length === 0 && idPrograma !== null) {
      const validacion = validarDatosGraduando({
        documento: identificacion,
        nombres,
        apellidos,
        correo,
        telefono,
        codigoEstudiantil,
        tallaToga,
        programaIds: [idPrograma],
        idSesion,
        estado: true,
        requisitosCumplidos: false,
      });
      if (validacion.mensaje) {
        errores.push(validacion.mensaje);
      } else {
        validas.push({
          filaExcel: fila.filaExcel,
          graduando: validacion.valores,
        });
      }
    }

    if (errores.length > 0) {
      reporte.push({
        filaExcel: fila.filaExcel,
        identificacion: identificacion || fila.identificacion,
        errores: [...new Set(errores)],
      });
    }
  }

  return { total: filas.length, validas, reporte };
}

app.get("/api/ceremonias/:id/graduandos", async (req, res) => {
  const idCeremonia = Number(req.params.id);
  const { search, sesion, programa } = req.query;
  if (
    !Number.isSafeInteger(idCeremonia) || idCeremonia <= 0 ||
    [search, sesion, programa].some((valor) => valor !== undefined && typeof valor !== "string")
  ) {
    return res.status(400).json({ mensaje: "Uno o más filtros de graduandos no son válidos." });
  }
  if (sesion && sesion !== "sin-asignar" && (!/^\d+$/.test(sesion) || Number(sesion) <= 0)) {
    return res.status(400).json({ mensaje: "El filtro de sesión no es válido." });
  }
  if (programa && (!/^\d+$/.test(programa) || Number(programa) <= 0)) {
    return res.status(400).json({ mensaje: "El filtro de programa no es válido." });
  }

  const condiciones = ["g.id_ceremonia = $1"];
  const valores = [idCeremonia];
  if (search?.trim()) {
    valores.push(`%${search.trim()}%`);
    condiciones.push(
      `(g.nombres ILIKE $${valores.length} OR g.apellidos ILIKE $${valores.length} OR g.identificacion ILIKE $${valores.length})`
    );
  }
  if (sesion === "sin-asignar") {
    condiciones.push("g.id_sesion IS NULL");
  } else if (sesion) {
    valores.push(Number(sesion));
    condiciones.push(`g.id_sesion = $${valores.length}`);
  }
  if (programa) {
    valores.push(Number(programa));
    condiciones.push(
      `EXISTS (SELECT 1 FROM graduando_programa gp WHERE gp.id_graduando = g.id_graduando AND gp.id_programa = $${valores.length})`
    );
  }

  try {
    const resultado = await pool.query(
      `${consultaGraduando}
       WHERE ${condiciones.join(" AND ")}
       ORDER BY g.apellidos, g.nombres, g.id_graduando`,
      valores
    );
    return res.json({
      data: resultado.rows,
      total: resultado.rows.length,
      stats: { total: resultado.rows.length, revisados: resultado.rows.length, errores: 0 },
    });
  } catch (error) {
    console.error("Error al consultar los graduandos:", error);
    return res.status(500).json({ mensaje: "Error al consultar los graduandos." });
  }
});

app.get("/api/graduandos/documento/:documento", async (req, res) => {
  const documento = normalizarDocumento(req.params.documento);
  if (documento.length < 6 || documento.length > 50) {
    return res.status(400).json({ mensaje: "El documento no es válido." });
  }
  try {
    const coincidencias = await pool.query(
      `SELECT id_graduando
       FROM graduando
       WHERE regexp_replace(identificacion, '[^0-9]', '', 'g') = $1
       ORDER BY id_graduando`,
      [documento]
    );
    if (coincidencias.rows.length === 0) {
      return res.status(404).json({ mensaje: "No se encontró un graduando con ese documento." });
    }
    if (coincidencias.rows.length > 1) {
      return res.status(409).json({ mensaje: "El documento está asociado a más de una ceremonia; contacta a Medios Educativos." });
    }
    const resultado = await pool.query(
      `${consultaGraduando} WHERE g.id_graduando = $1`,
      [coincidencias.rows[0].id_graduando]
    );
    return res.json(resultado.rows[0]);
  } catch (error) {
    console.error("Error al consultar el graduando por documento:", error);
    return res.status(500).json({ mensaje: "Error al consultar el graduando." });
  }
});

app.post("/api/registro-invitados/login", async (req, res) => {
  const cuerpo = req.body;
  if (!cuerpo || typeof cuerpo !== "object" || Array.isArray(cuerpo)) {
    return res.status(400).json({ mensaje: "Las credenciales no son válidas." });
  }

  const documento = typeof cuerpo.documento === "string"
    ? normalizarDocumento(cuerpo.documento)
    : "";
  const codigoEstudiantil = typeof cuerpo.codigoEstudiantil === "string"
    ? normalizarDocumento(cuerpo.codigoEstudiantil)
    : "";
  if (
    documento.length < 6 || documento.length > 50 ||
    codigoEstudiantil.length < 4 || codigoEstudiantil.length > 50
  ) {
    return res.status(400).json({ mensaje: "Ingresa un documento y código estudiantil válidos." });
  }

  try {
    const resultado = await pool.query(
      `SELECT g.id_graduando,
              g.id_ceremonia,
              g.nombres,
              g.apellidos,
              g.identificacion,
              g.codigo_estudiantil,
              g.requisitos_cumplidos,
              cg.estado AS estado_ceremonia,
              cg.cupo_invitados,
              (SELECT COUNT(*)::int
               FROM invitado i
               WHERE i.id_graduando = g.id_graduando) AS invitados_registrados,
              COALESCE(
                (SELECT STRING_AGG(p.nombre, ', ' ORDER BY p.nombre)
                 FROM graduando_programa gp
                 JOIN programa p ON p.id_programa = gp.id_programa
                 WHERE gp.id_graduando = g.id_graduando),
                'Sin programa'
              ) AS programa
       FROM graduando g
       JOIN ceremonia_grado cg ON cg.id_ceremonia = g.id_ceremonia
       WHERE regexp_replace(g.identificacion, '[^0-9]', '', 'g') = $1
         AND regexp_replace(COALESCE(g.codigo_estudiantil, ''), '[^0-9]', '', 'g') = $2
       ORDER BY g.id_graduando
       LIMIT 2`,
      [documento, codigoEstudiantil]
    );

    if (resultado.rows.length === 0) {
      return res.status(401).json({ mensaje: "El documento o código estudiantil no es correcto." });
    }
    if (resultado.rows.length > 1) {
      return res.status(409).json({ mensaje: "Las credenciales no identifican un único graduando." });
    }

    const graduando = resultado.rows[0];
    if (!estadosCeremoniaActivasRegistroInvitados.includes(graduando.estado_ceremonia)) {
      return res.status(403).json({
        mensaje: "El registro de invitados para esta ceremonia está cerrado",
      });
    }
    if (graduando.requisitos_cumplidos !== true) {
      return res.status(403).json({
        mensaje: "No cumples los requisitos para registrar invitados. Contacta a Medios Educativos.",
      });
    }

    return res.json({
      id: String(graduando.id_graduando),
      ceremoniaId: String(graduando.id_ceremonia),
      nombres: graduando.nombres,
      apellidos: graduando.apellidos,
      documento: normalizarDocumento(graduando.identificacion),
      codigoEstudiantil: graduando.codigo_estudiantil || "",
      programa: graduando.programa,
      cupoInvitados: graduando.cupo_invitados,
      invitadosRegistrados: graduando.invitados_registrados,
    });
  } catch (error) {
    console.error("Error al validar el acceso al registro de invitados:", error);
    return res.status(500).json({ mensaje: "No fue posible validar el acceso al registro de invitados." });
  }
});

app.get("/api/graduandos/:id", async (req, res) => {
  const idGraduando = Number(req.params.id);
  if (!Number.isSafeInteger(idGraduando) || idGraduando <= 0) {
    return res.status(400).json({ mensaje: "El identificador del graduando no es válido." });
  }
  try {
    const resultado = await pool.query(
      `${consultaGraduando} WHERE g.id_graduando = $1`,
      [idGraduando]
    );
    if (resultado.rows.length === 0) {
      return res.status(404).json({ mensaje: "No se encontró el graduando." });
    }
    return res.json(resultado.rows[0]);
  } catch (error) {
    console.error("Error al consultar el graduando:", error);
    return res.status(500).json({ mensaje: "Error al consultar el graduando." });
  }
});

app.get("/api/ceremonias/:id/invitados", async (req, res) => {
  const idCeremonia = Number(req.params.id);
  const idGraduando = req.query.graduandoId === undefined
    ? null
    : Number(req.query.graduandoId);
  if (
    !Number.isSafeInteger(idCeremonia) || idCeremonia <= 0 ||
    (idGraduando !== null && (!Number.isSafeInteger(idGraduando) || idGraduando <= 0))
  ) {
    return res.status(400).json({ mensaje: "La ceremonia o el graduando no son válidos." });
  }

  const valores = [idCeremonia];
  let filtro = "g.id_ceremonia = $1";
  if (idGraduando !== null) {
    valores.push(idGraduando);
    filtro += " AND g.id_graduando = $2";
  }
  try {
    const resultado = await pool.query(
      `${consultaInvitado}
       WHERE ${filtro}
       ORDER BY i.nombre, i.id_invitado`,
      valores
    );
    return res.json(resultado.rows);
  } catch (error) {
    console.error("Error al consultar los invitados:", error);
    return res.status(500).json({ mensaje: "Error al consultar los invitados." });
  }
});

const MAX_INVITADOS_POR_REGISTRO = 100;

function validarInvitadosEntrada(filas) {
  if (
    !Array.isArray(filas) ||
    filas.length === 0 ||
    filas.length > MAX_INVITADOS_POR_REGISTRO
  ) {
    return { mensaje: `El registro debe contener entre 1 y ${MAX_INVITADOS_POR_REGISTRO} invitados.` };
  }

  const invitados = [];
  for (const fila of filas) {
    if (!fila || typeof fila !== "object" || Array.isArray(fila)) {
      return { mensaje: "Uno o más invitados tienen datos no válidos." };
    }
    const nombre = typeof fila.nombre === "string" ? fila.nombre.trim() : "";
    const documento = typeof fila.documento === "string"
      ? normalizarDocumento(fila.documento)
      : "";
    const telefono = fila.telefono === undefined
      ? ""
      : typeof fila.telefono === "string" ? fila.telefono.trim() : null;
    const parentesco = fila.parentesco === undefined
      ? typeof fila.tipo === "string" ? fila.tipo.trim() : ""
      : typeof fila.parentesco === "string" ? fila.parentesco.trim() : null;
    if (
      !nombre || nombre.length > 150 ||
      !documento || documento.length > 50 ||
      telefono === null || telefono.length > 50 ||
      parentesco === null || parentesco.length > 100 ||
      !["Autorizado", "Pendiente"].includes(fila.autorizacion)
    ) {
      return { mensaje: "Verifica el nombre, documento y autorización del invitado." };
    }
    invitados.push({
      nombre,
      documento,
      telefono: telefono || null,
      parentesco: parentesco || null,
      autorizado: fila.autorizacion === "Autorizado",
    });
  }
  return { invitados };
}

async function registrarInvitadosEnTransaccion(idGraduando, invitados) {
  let client;
  try {
    client = await pool.connect();
    await client.query("BEGIN");
    const graduando = await client.query(
      `SELECT g.id_graduando, g.id_ceremonia, g.requisitos_cumplidos,
              cg.estado AS estado_ceremonia, cg.cupo_invitados
       FROM graduando g
       JOIN ceremonia_grado cg ON cg.id_ceremonia = g.id_ceremonia
       WHERE g.id_graduando = $1
       FOR UPDATE OF g, cg`,
      [idGraduando]
    );
    if (graduando.rows.length === 0) {
      await client.query("ROLLBACK");
      return { status: 404, mensaje: "No se encontró el graduando." };
    }

    const datosGraduando = graduando.rows[0];
    await client.query(
      "SELECT pg_advisory_xact_lock($1, $2)",
      [51, datosGraduando.id_ceremonia]
    );
    if (!estadosCeremoniaActivasRegistroInvitados.includes(datosGraduando.estado_ceremonia)) {
      await client.query("ROLLBACK");
      return {
        status: 403,
        mensaje: "El registro de invitados para esta ceremonia está cerrado",
      };
    }
    if (datosGraduando.requisitos_cumplidos !== true) {
      await client.query("ROLLBACK");
      return {
        status: 403,
        mensaje: "No cumples los requisitos para registrar invitados. Contacta a Medios Educativos.",
      };
    }

    const conteo = await client.query(
      `SELECT COUNT(*)::int AS registrados
       FROM invitado i
       JOIN graduando g ON g.id_graduando = i.id_graduando
       WHERE g.id_ceremonia = $1`,
      [datosGraduando.id_ceremonia]
    );
    if (conteo.rows[0].registrados + invitados.length > datosGraduando.cupo_invitados) {
      await client.query("ROLLBACK");
      return {
        status: 409,
        mensaje: `El cupo de invitados es ${datosGraduando.cupo_invitados}; ya hay ${conteo.rows[0].registrados} registrados.`,
      };
    }

    const documentos = invitados.map((invitado) => invitado.documento);
    if (new Set(documentos).size !== documentos.length) {
      await client.query("ROLLBACK");
      return { status: 409, mensaje: "Hay documentos duplicados en el registro." };
    }
    const documentosExistentes = await obtenerDocumentosExistentes(
      client,
      datosGraduando.id_ceremonia,
      documentos
    );
    if (documentos.some((documento) => documentosExistentes.has(documento))) {
      await client.query("ROLLBACK");
      return {
        status: 409,
        mensaje: "Uno o más documentos ya están registrados en esta ceremonia.",
      };
    }

    const columnasOpcionales = await obtenerColumnasOpcionalesInvitado(client);
    const registros = [];
    for (const invitado of invitados) {
      const columnas = ["id_graduando", "nombre", "identificacion"];
      const valores = [idGraduando, invitado.nombre, invitado.documento];
      if (columnasOpcionales.has("telefono")) {
        columnas.push("telefono");
        valores.push(invitado.telefono);
      }
      if (columnasOpcionales.has("parentesco")) {
        columnas.push("parentesco");
        valores.push(invitado.parentesco);
      }
      columnas.push("autorizado");
      valores.push(invitado.autorizado);
      const creado = await client.query(
        `INSERT INTO invitado
           (${columnas.join(", ")})
         VALUES (${valores.map((_, indice) => `$${indice + 1}`).join(", ")})
         RETURNING id_invitado`,
        valores
      );
      const resultado = await client.query(
        `${consultaInvitado} WHERE i.id_invitado = $1`,
        [creado.rows[0].id_invitado]
      );
      registros.push(resultado.rows[0]);
    }

    await client.query("COMMIT");
    return { registros };
  } catch (error) {
    if (client) {
      await client.query("ROLLBACK").catch((rollbackError) => {
        console.error("Error al revertir el registro de invitados:", rollbackError);
      });
    }
    throw error;
  } finally {
    client?.release();
  }
}

app.post("/api/graduandos/:id/invitados", async (req, res) => {
  const idGraduando = Number(req.params.id);
  if (!Number.isSafeInteger(idGraduando) || idGraduando <= 0) {
    return res.status(400).json({ mensaje: "El identificador del graduando no es válido." });
  }
  const entrada = validarInvitadosEntrada([req.body]);
  if (entrada.mensaje) return res.status(400).json({ mensaje: entrada.mensaje });

  try {
    const resultado = await registrarInvitadosEnTransaccion(idGraduando, entrada.invitados);
    if (resultado.mensaje) return res.status(resultado.status).json({ mensaje: resultado.mensaje });
    return res.status(201).json(resultado.registros[0]);
  } catch (error) {
    console.error("Error al crear el invitado:", error);
    return res.status(500).json({ mensaje: "Error al guardar el invitado." });
  }
});

app.post("/api/graduandos/:id/invitados/lote", async (req, res) => {
  const idGraduando = Number(req.params.id);
  const entrada = validarInvitadosEntrada(
    req.body && typeof req.body === "object" && !Array.isArray(req.body)
      ? req.body.invitados
      : null
  );
  if (!Number.isSafeInteger(idGraduando) || idGraduando <= 0) {
    return res.status(400).json({ mensaje: "El identificador del graduando no es válido." });
  }
  if (entrada.mensaje) return res.status(400).json({ mensaje: entrada.mensaje });

  try {
    const resultado = await registrarInvitadosEnTransaccion(idGraduando, entrada.invitados);
    if (resultado.mensaje) return res.status(resultado.status).json({ mensaje: resultado.mensaje });
    return res.status(201).json(resultado.registros);
  } catch (error) {
    console.error("Error al registrar el lote de invitados:", error);
    return res.status(500).json({ mensaje: "No fue posible guardar los invitados." });
  }
});

app.patch("/api/invitados/:id", async (req, res) => {
  const idInvitado = Number(req.params.id);
  const cuerpo = req.body || {};
  if (!Number.isSafeInteger(idInvitado) || idInvitado <= 0) {
    return res.status(400).json({ mensaje: "El identificador del invitado no es válido." });
  }

  let client;
  try {
    client = await pool.connect();
    await client.query("BEGIN");
    const columnasOpcionales = await obtenerColumnasOpcionalesInvitado(client);
    const actual = await client.query(
      `SELECT i.nombre, i.identificacion, i.autorizado,
              COALESCE(to_jsonb(i)->>'telefono', '') AS telefono,
              COALESCE(to_jsonb(i)->>'parentesco', '') AS parentesco,
              g.id_ceremonia
       FROM invitado i
       JOIN graduando g ON g.id_graduando = i.id_graduando
       WHERE i.id_invitado = $1
       FOR UPDATE OF i, g`,
      [idInvitado]
    );
    if (actual.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ mensaje: "No se encontró el invitado." });
    }
    await client.query(
      "SELECT pg_advisory_xact_lock($1, $2)",
      [51, actual.rows[0].id_ceremonia]
    );
    const nombre = cuerpo.nombre === undefined
      ? actual.rows[0].nombre
      : typeof cuerpo.nombre === "string" ? cuerpo.nombre.trim() : "";
    const documento = cuerpo.documento === undefined
      ? actual.rows[0].identificacion || ""
      : typeof cuerpo.documento === "string" ? normalizarDocumento(cuerpo.documento) : "";
    const autorizado = cuerpo.autorizacion === undefined
      ? actual.rows[0].autorizado === true
      : cuerpo.autorizacion === "Autorizado";
    const telefono = cuerpo.telefono === undefined
      ? actual.rows[0].telefono || ""
      : typeof cuerpo.telefono === "string" ? cuerpo.telefono.trim() : null;
    const parentesco = cuerpo.parentesco === undefined
      ? actual.rows[0].parentesco || ""
      : typeof cuerpo.parentesco === "string" ? cuerpo.parentesco.trim() : null;
    if (
      !nombre || nombre.length > 150 || !documento || documento.length > 50 ||
      telefono === null || telefono.length > 50 ||
      parentesco === null || parentesco.length > 100 ||
      (cuerpo.autorizacion !== undefined &&
        !["Autorizado", "Pendiente"].includes(cuerpo.autorizacion)) ||
      (cuerpo.nombre !== undefined && typeof cuerpo.nombre !== "string") ||
      (cuerpo.documento !== undefined && typeof cuerpo.documento !== "string") ||
      (cuerpo.telefono !== undefined && typeof cuerpo.telefono !== "string") ||
      (cuerpo.parentesco !== undefined && typeof cuerpo.parentesco !== "string")
    ) {
      await client.query("ROLLBACK");
      return res.status(400).json({ mensaje: "Verifica el nombre, documento y autorización del invitado." });
    }
    const documentosExistentes = await obtenerDocumentosExistentes(
      client,
      actual.rows[0].id_ceremonia,
      [documento],
      { idInvitadoExcluir: idInvitado }
    );
    if (documentosExistentes.has(documento)) {
      await client.query("ROLLBACK");
      return res.status(409).json({ mensaje: "El documento ya está registrado en esta ceremonia." });
    }
    const actualizaciones = ["nombre = $2", "identificacion = $3", "autorizado = $4"];
    const valoresActualizacion = [idInvitado, nombre, documento, autorizado];
    if (columnasOpcionales.has("telefono")) {
      valoresActualizacion.push(telefono || null);
      actualizaciones.push(`telefono = $${valoresActualizacion.length}`);
    }
    if (columnasOpcionales.has("parentesco")) {
      valoresActualizacion.push(parentesco || null);
      actualizaciones.push(`parentesco = $${valoresActualizacion.length}`);
    }
    await client.query(
      `UPDATE invitado
       SET ${actualizaciones.join(", ")}
       WHERE id_invitado = $1`,
      valoresActualizacion
    );
    const resultado = await client.query(
      `${consultaInvitado} WHERE i.id_invitado = $1`,
      [idInvitado]
    );
    await client.query("COMMIT");
    return res.json(resultado.rows[0]);
  } catch (error) {
    if (client) {
      await client.query("ROLLBACK").catch((rollbackError) => {
        console.error("Error al revertir la actualización del invitado:", rollbackError);
      });
    }
    console.error("Error al actualizar el invitado:", error);
    return res.status(500).json({ mensaje: "Error al actualizar el invitado." });
  } finally {
    client?.release();
  }
});

app.post("/api/ceremonias/:id/graduandos/:graduandoId/ingreso", async (req, res) => {
  const idCeremonia = Number(req.params.id);
  const idGraduando = Number(req.params.graduandoId);
  const idSesion = req.body && typeof req.body === "object" && !Array.isArray(req.body)
    ? req.body.id_sesion
    : null;
  if (
    !Number.isSafeInteger(idCeremonia) || idCeremonia <= 0 ||
    !Number.isSafeInteger(idGraduando) || idGraduando <= 0 ||
    !Number.isSafeInteger(idSesion) || idSesion <= 0
  ) {
    return res.status(400).json({ mensaje: "La ceremonia, el graduando o la sesión no son válidos." });
  }

  let client;
  try {
    client = await pool.connect();
    await client.query("BEGIN");
    const graduando = await client.query(
      `SELECT id_ceremonia, id_sesion
       FROM graduando
       WHERE id_graduando = $1
       FOR UPDATE`,
      [idGraduando]
    );
    if (graduando.rows.length === 0 || graduando.rows[0].id_ceremonia !== idCeremonia) {
      await client.query("ROLLBACK");
      return res.status(404).json({ mensaje: "El graduando no pertenece a esta ceremonia." });
    }
    const sesion = await client.query(
      "SELECT 1 FROM sesion WHERE id_sesion = $1 AND id_ceremonia = $2",
      [idSesion, idCeremonia]
    );
    if (sesion.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(400).json({ mensaje: "La sesión no pertenece a esta ceremonia." });
    }
    if (graduando.rows[0].id_sesion === null || graduando.rows[0].id_sesion !== idSesion) {
      await client.query("ROLLBACK");
      return res.status(409).json({
        mensaje: "Este graduando pertenece a otra sesión / no tiene sesión asignada",
      });
    }

    const registro = await insertarControlIngreso(client, idSesion, "graduando", idGraduando);
    if (registro.conflicto) {
      await client.query("ROLLBACK");
      return res.status(409).json({ mensaje: registro.mensaje });
    }
    const estadisticas = await consultarEstadisticasControlIngreso(client, idCeremonia, idSesion);
    await client.query("COMMIT");
    return res.json({ ...registro, estadisticas });
  } catch (error) {
    if (client) {
      await client.query("ROLLBACK").catch((rollbackError) => {
        console.error("Error al revertir el registro de ingreso del graduando:", rollbackError);
      });
    }
    console.error("Error al registrar el ingreso del graduando:", error);
    return res.status(500).json({ mensaje: "Error al registrar el ingreso del graduando." });
  } finally {
    client?.release();
  }
});

app.post("/api/invitados/:id/ingreso", async (req, res) => {
  const idInvitado = Number(req.params.id);
  const idSesion = req.body && typeof req.body === "object" && !Array.isArray(req.body)
    ? req.body.id_sesion
    : null;
  if (
    !Number.isSafeInteger(idInvitado) || idInvitado <= 0 ||
    !Number.isSafeInteger(idSesion) || idSesion <= 0
  ) {
    return res.status(400).json({ mensaje: "El invitado o la sesión no son válidos." });
  }

  let client;
  try {
    client = await pool.connect();
    await client.query("BEGIN");
    const invitado = await client.query(
      `SELECT i.autorizado, g.id_graduando, g.id_ceremonia, g.id_sesion
       FROM invitado i
       JOIN graduando g ON g.id_graduando = i.id_graduando
       WHERE i.id_invitado = $1
       FOR UPDATE OF i, g`,
      [idInvitado]
    );
    if (invitado.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ mensaje: "No se encontró el invitado." });
    }
    const datosInvitado = invitado.rows[0];
    const sesion = await client.query(
      "SELECT 1 FROM sesion WHERE id_sesion = $1 AND id_ceremonia = $2",
      [idSesion, datosInvitado.id_ceremonia]
    );
    if (sesion.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(400).json({ mensaje: "La sesión no pertenece a la ceremonia del invitado." });
    }
    if (datosInvitado.id_sesion === null || datosInvitado.id_sesion !== idSesion) {
      await client.query("ROLLBACK");
      return res.status(409).json({
        mensaje: "Este graduando pertenece a otra sesión / no tiene sesión asignada",
      });
    }
    if (datosInvitado.autorizado !== true) {
      await client.query("ROLLBACK");
      return res.status(403).json({ mensaje: "El invitado no está autorizado para ingresar." });
    }

    const registro = await insertarControlIngreso(client, idSesion, "invitado", idInvitado);
    if (registro.conflicto) {
      await client.query("ROLLBACK");
      return res.status(409).json({ mensaje: registro.mensaje });
    }
    const estadisticas = await consultarEstadisticasControlIngreso(
      client,
      datosInvitado.id_ceremonia,
      idSesion
    );
    await client.query("COMMIT");
    return res.json({ ...registro, estadisticas });
  } catch (error) {
    if (client) {
      await client.query("ROLLBACK").catch((rollbackError) => {
        console.error("Error al revertir el registro de ingreso del invitado:", rollbackError);
      });
    }
    console.error("Error al registrar el ingreso del invitado:", error);
    return res.status(500).json({ mensaje: "Error al registrar el ingreso del invitado." });
  } finally {
    client?.release();
  }
});

app.post("/api/ceremonias/:id/graduandos/importacion/validar", async (req, res) => {
  const idCeremonia = Number(req.params.id);
  if (!Number.isSafeInteger(idCeremonia) || idCeremonia <= 0) {
    return res.status(400).json({ mensaje: "El identificador de la ceremonia no es válido." });
  }
  const entrada = obtenerFilasImportacion(req.body);
  if (entrada.mensaje) return res.status(400).json({ mensaje: entrada.mensaje });

  let client;
  try {
    client = await pool.connect();
    await client.query("BEGIN READ ONLY");
    const ceremonia = await client.query(
      "SELECT id_ceremonia FROM ceremonia_grado WHERE id_ceremonia = $1",
      [idCeremonia]
    );
    if (ceremonia.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ mensaje: "No se encontró la ceremonia." });
    }

    const analisis = await analizarImportacionGraduandos(client, idCeremonia, entrada.filas);
    await client.query("COMMIT");
    return res.json({
      total: analisis.total,
      validos: analisis.validas.length,
      invalidos: analisis.reporte.length,
      reporte: analisis.reporte,
    });
  } catch (error) {
    if (client) {
      await client.query("ROLLBACK").catch((rollbackError) => {
        console.error("Error al revertir la validación de graduandos:", rollbackError);
      });
    }
    console.error("Error al validar la importación de graduandos:", error);
    return res.status(500).json({ mensaje: "No fue posible validar el archivo de graduandos." });
  } finally {
    client?.release();
  }
});

app.post("/api/ceremonias/:id/graduandos/importacion/confirmar", async (req, res) => {
  const idCeremonia = Number(req.params.id);
  if (!Number.isSafeInteger(idCeremonia) || idCeremonia <= 0) {
    return res.status(400).json({ mensaje: "El identificador de la ceremonia no es válido." });
  }
  const entrada = obtenerFilasImportacion(req.body);
  if (entrada.mensaje) return res.status(400).json({ mensaje: entrada.mensaje });

  let client;
  try {
    client = await pool.connect();
    await client.query("BEGIN");
    const ceremonia = await client.query(
      "SELECT id_ceremonia FROM ceremonia_grado WHERE id_ceremonia = $1 FOR UPDATE",
      [idCeremonia]
    );
    if (ceremonia.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ mensaje: "No se encontró la ceremonia." });
    }
    await client.query("SELECT pg_advisory_xact_lock($1, $2)", [51, idCeremonia]);

    const analisis = await analizarImportacionGraduandos(client, idCeremonia, entrada.filas);
    for (const fila of analisis.validas) {
      const graduando = fila.graduando;
      const creado = await client.query(
        `INSERT INTO graduando
           (id_ceremonia, id_sesion, nombres, apellidos, identificacion,
            correo_electronico, telefono, codigo_estudiantil, talla_toga,
            requisitos_cumplidos, estado)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
         RETURNING id_graduando`,
        [
          idCeremonia,
          graduando.idSesion,
          graduando.nombres,
          graduando.apellidos,
          graduando.documento,
          graduando.correo,
          graduando.telefono,
          graduando.codigoEstudiantil,
          graduando.tallaToga,
          graduando.requisitosCumplidos,
          graduando.estado,
        ]
      );
      for (const idPrograma of graduando.programaIds) {
        await client.query(
          "INSERT INTO graduando_programa (id_graduando, id_programa) VALUES ($1, $2)",
          [creado.rows[0].id_graduando, idPrograma]
        );
      }
    }

    await client.query("COMMIT");
    return res.status(201).json({
      total: analisis.total,
      validos: analisis.validas.length,
      invalidos: analisis.reporte.length,
      importados: analisis.validas.length,
      reporte: analisis.reporte,
    });
  } catch (error) {
    if (client) {
      await client.query("ROLLBACK").catch((rollbackError) => {
        console.error("Error al revertir la importación de graduandos:", rollbackError);
      });
    }
    console.error("Error al importar graduandos:", error);
    return res.status(500).json({ mensaje: "No fue posible importar los graduandos." });
  } finally {
    client?.release();
  }
});

app.post("/api/ceremonias/:id/graduandos", async (req, res) => {
  const idCeremonia = Number(req.params.id);
  const cuerpo = req.body;
  if (!Number.isSafeInteger(idCeremonia) || idCeremonia <= 0) {
    return res.status(400).json({ mensaje: "El identificador de la ceremonia no es válido." });
  }
  if (!cuerpo || typeof cuerpo !== "object" || Array.isArray(cuerpo)) {
    return res.status(400).json({ mensaje: "El cuerpo del graduando no es válido." });
  }
  const validacion = validarDatosGraduando(cuerpo);
  if (validacion.mensaje) return res.status(400).json({ mensaje: validacion.mensaje });
  const graduando = validacion.valores;

  let client;
  try {
    client = await pool.connect();
    await client.query("BEGIN");
    const ceremonia = await client.query(
      "SELECT id_ceremonia FROM ceremonia_grado WHERE id_ceremonia = $1",
      [idCeremonia]
    );
    if (ceremonia.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ mensaje: "No se encontró la ceremonia." });
    }
    await client.query("SELECT pg_advisory_xact_lock($1, $2)", [51, idCeremonia]);
    const documentosExistentes = await obtenerDocumentosExistentes(
      client,
      idCeremonia,
      [graduando.documento]
    );
    if (documentosExistentes.has(graduando.documento)) {
      await client.query("ROLLBACK");
      return res.status(409).json({ mensaje: "El documento ya está registrado en esta ceremonia." });
    }
    const programas = await validarProgramasGraduando(client, graduando.programaIds);
    if (programas.mensaje) {
      await client.query("ROLLBACK");
      return res.status(400).json({ mensaje: programas.mensaje });
    }
    const errorSesion = await validarSesionGraduando(client, idCeremonia, graduando.idSesion, programas.ids);
    if (errorSesion) {
      await client.query("ROLLBACK");
      return res.status(400).json({ mensaje: errorSesion });
    }

    const creado = await client.query(
      `INSERT INTO graduando
         (id_ceremonia, id_sesion, nombres, apellidos, identificacion,
          correo_electronico, telefono, codigo_estudiantil, talla_toga,
          requisitos_cumplidos, estado)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING id_graduando`,
      [idCeremonia, graduando.idSesion, graduando.nombres, graduando.apellidos,
        graduando.documento, graduando.correo, graduando.telefono,
        graduando.codigoEstudiantil, graduando.tallaToga,
        graduando.requisitosCumplidos, graduando.estado]
    );
    const idGraduando = creado.rows[0].id_graduando;
    for (const idPrograma of programas.ids) {
      await client.query(
        "INSERT INTO graduando_programa (id_graduando, id_programa) VALUES ($1, $2)",
        [idGraduando, idPrograma]
      );
    }
    const resultado = await client.query(
      `${consultaGraduando} WHERE g.id_graduando = $1`,
      [idGraduando]
    );
    await client.query("COMMIT");
    return res.status(201).json(resultado.rows[0]);
  } catch (error) {
    if (client) {
      await client.query("ROLLBACK").catch((rollbackError) => {
        console.error("Error al revertir la creación del graduando:", rollbackError);
      });
    }
    console.error("Error al crear el graduando:", error);
    return res.status(500).json({ mensaje: "Error al crear el graduando." });
  } finally {
    client?.release();
  }
});

app.patch("/api/graduandos/:id", async (req, res) => {
  const idGraduando = Number(req.params.id);
  const cuerpo = req.body;
  if (!Number.isSafeInteger(idGraduando) || idGraduando <= 0) {
    return res.status(400).json({ mensaje: "El identificador del graduando no es válido." });
  }
  if (!cuerpo || typeof cuerpo !== "object" || Array.isArray(cuerpo)) {
    return res.status(400).json({ mensaje: "El cuerpo del graduando no es válido." });
  }
  const validacion = validarDatosGraduando(cuerpo);
  if (validacion.mensaje) return res.status(400).json({ mensaje: validacion.mensaje });
  const graduando = validacion.valores;

  let client;
  try {
    client = await pool.connect();
    await client.query("BEGIN");
    const actual = await client.query(
      "SELECT id_ceremonia FROM graduando WHERE id_graduando = $1 FOR UPDATE",
      [idGraduando]
    );
    if (actual.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ mensaje: "No se encontró el graduando." });
    }
    const idCeremonia = actual.rows[0].id_ceremonia;
    await client.query("SELECT pg_advisory_xact_lock($1, $2)", [51, idCeremonia]);
    const documentosExistentes = await obtenerDocumentosExistentes(
      client,
      idCeremonia,
      [graduando.documento],
      { idGraduandoExcluir: idGraduando }
    );
    if (documentosExistentes.has(graduando.documento)) {
      await client.query("ROLLBACK");
      return res.status(409).json({ mensaje: "El documento ya está registrado en esta ceremonia." });
    }
    const programas = await validarProgramasGraduando(client, graduando.programaIds);
    if (programas.mensaje) {
      await client.query("ROLLBACK");
      return res.status(400).json({ mensaje: programas.mensaje });
    }
    const errorSesion = await validarSesionGraduando(client, idCeremonia, graduando.idSesion, programas.ids);
    if (errorSesion) {
      await client.query("ROLLBACK");
      return res.status(400).json({ mensaje: errorSesion });
    }
    await client.query(
      `UPDATE graduando
       SET id_sesion = $1, nombres = $2, apellidos = $3, identificacion = $4,
           correo_electronico = $5, telefono = $6, codigo_estudiantil = $7,
           talla_toga = $8, requisitos_cumplidos = $9, estado = $10
       WHERE id_graduando = $11`,
      [graduando.idSesion, graduando.nombres, graduando.apellidos,
        graduando.documento, graduando.correo, graduando.telefono,
        graduando.codigoEstudiantil, graduando.tallaToga,
        graduando.requisitosCumplidos, graduando.estado, idGraduando]
    );
    await client.query("DELETE FROM graduando_programa WHERE id_graduando = $1", [idGraduando]);
    for (const idPrograma of programas.ids) {
      await client.query(
        "INSERT INTO graduando_programa (id_graduando, id_programa) VALUES ($1, $2)",
        [idGraduando, idPrograma]
      );
    }
    const resultado = await client.query(
      `${consultaGraduando} WHERE g.id_graduando = $1`,
      [idGraduando]
    );
    await client.query("COMMIT");
    return res.json(resultado.rows[0]);
  } catch (error) {
    if (client) {
      await client.query("ROLLBACK").catch((rollbackError) => {
        console.error("Error al revertir la actualización del graduando:", rollbackError);
      });
    }
    console.error("Error al actualizar el graduando:", error);
    return res.status(500).json({ mensaje: "Error al actualizar el graduando." });
  } finally {
    client?.release();
  }
});

app.post("/api/ceremonias", async (req, res) => {
  const cuerpo = req.body;
  if (!cuerpo || typeof cuerpo !== "object" || Array.isArray(cuerpo)) {
    return res.status(400).json({ mensaje: "El cuerpo de la ceremonia no es válido." });
  }

  const nombre = typeof cuerpo.nombre === "string" ? cuerpo.nombre.trim() : "";
  const fecha = typeof cuerpo.fecha === "string" ? cuerpo.fecha : "";
  const idEventoSolicitado = cuerpo.idEvento === undefined ? null : Number(cuerpo.idEvento);
  const idEspacio = Number(cuerpo.idEspacio);
  const cupoInvitados = cuerpo.cupoInvitados === undefined
    ? 2
    : Number(cuerpo.cupoInvitados);
  const estado = cuerpo.estado;
  const fechaValida = /^\d{4}-\d{2}-\d{2}$/.test(fecha) &&
    (() => {
      const [anio, mes, dia] = fecha.split("-").map(Number);
      const fechaUtc = new Date(Date.UTC(anio, mes - 1, dia));
      return fechaUtc.getUTCFullYear() === anio &&
        fechaUtc.getUTCMonth() === mes - 1 &&
        fechaUtc.getUTCDate() === dia;
    })();

  if (
    !nombre || nombre.length > 255 || !fechaValida ||
    (idEventoSolicitado !== null &&
      (!Number.isSafeInteger(idEventoSolicitado) || idEventoSolicitado <= 0)) ||
    !Number.isSafeInteger(idEspacio) || idEspacio <= 0 ||
    !Number.isSafeInteger(cupoInvitados) || cupoInvitados < 0 ||
    !estadosCeremoniaCreacion.includes(estado)
  ) {
    return res.status(400).json({ mensaje: "Completa los datos de la ceremonia con valores válidos." });
  }

  let client;
  try {
    client = await pool.connect();
    await client.query("BEGIN");
    const referencias = await client.query(
      `SELECT e.id_espacio, e.nombre AS lugar, c.nombre AS campus
       FROM espacio e
       JOIN campus c ON c.id_campus = e.id_campus
       WHERE e.id_espacio = $1 AND e.estado = TRUE`,
      [idEspacio]
    );
    if (referencias.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(400).json({ mensaje: "Selecciona un espacio activo." });
    }

    await client.query("SELECT pg_advisory_xact_lock($1, $2)", [40, 1]);
    let idEvento = idEventoSolicitado;
    if (idEvento === null) {
      const eventoGrado = await client.query(
        `SELECT id_evento
         FROM evento_institucional
         WHERE estado = TRUE AND LOWER(tipo_evento) = LOWER($1)
         ORDER BY id_evento DESC
         LIMIT 1`,
        ["Ceremonia de grado"]
      );
      if (eventoGrado.rows.length > 0) {
        idEvento = eventoGrado.rows[0].id_evento;
      } else {
        const administradores = await client.query(
          `SELECT id_admin
           FROM usuario_admin
           WHERE estado = TRUE
           ORDER BY id_admin`
        );
        if (administradores.rows.length !== 1) {
          await client.query("ROLLBACK");
          return res.status(409).json({
            mensaje: "Para crear el evento de la ceremonia debe existir exactamente un administrador activo.",
          });
        }
        const eventoCreado = await client.query(
          `INSERT INTO evento_institucional (id_admin_gestion, tipo_evento)
           VALUES ($1, $2)
           RETURNING id_evento`,
          [administradores.rows[0].id_admin, "Ceremonia de grado"]
        );
        idEvento = eventoCreado.rows[0].id_evento;
      }
    } else {
      const eventoActivo = await client.query(
        `SELECT id_evento
         FROM evento_institucional
         WHERE id_evento = $1 AND estado = TRUE`,
        [idEvento]
      );
      if (eventoActivo.rows.length === 0) {
        await client.query("ROLLBACK");
        return res.status(400).json({ mensaje: "El evento institucional seleccionado no está activo." });
      }
    }

    const codigo = `CER-${randomUUID().toUpperCase()}`;
    const creada = await client.query(
      `INSERT INTO ceremonia_grado
         (id_evento, id_espacio, codigo_ceremonia, nombre, fecha, estado, cupo_invitados)
       VALUES ($1, $2, $3, $4, $5::date, $6, $7)
       RETURNING id_ceremonia::text AS id`,
      [idEvento, idEspacio, codigo, nombre, fecha, estado, cupoInvitados]
    );
    await client.query("COMMIT");
    const referencia = referencias.rows[0];
    return res.status(201).json({
      id: creada.rows[0].id,
      codigo,
      nombre,
      fecha: new Date(`${fecha}T12:00:00Z`).toLocaleDateString("es-CO", { timeZone: "UTC" }),
      fechaISO: fecha,
      lugar: referencia.lugar,
      campus: referencia.campus,
      sesiones: 0,
      graduandos: 0,
      invitados: 0,
      estado,
      cupoInvitados,
    });
  } catch (error) {
    if (client) {
      await client.query("ROLLBACK").catch((rollbackError) => {
        console.error("Error al revertir la creación de ceremonia:", rollbackError);
      });
    }
    console.error("Error al crear la ceremonia:", error);
    return res.status(500).json({ mensaje: "Error al crear la ceremonia." });
  } finally {
    client?.release();
  }
});

app.get("/api/tipos-espacio", async (req, res) => {
  try {
    const resultado = await pool.query(
      "SELECT id_tipo_espacio, nombre FROM tipo_espacio ORDER BY nombre"
    );

    res.json(resultado.rows);
  } catch (error) {
    console.error("Error al consultar los tipos de espacio:", error);
    res.status(500).json({
      mensaje: "Error al consultar los tipos de espacio",
    });
  }
});

app.get("/api/espacios", async (req, res) => {
  try {
    const resultado = await pool.query(
      `SELECT e.id_espacio, e.nombre, e.id_campus, c.nombre AS campus,
              e.id_tipo_espacio, t.nombre AS tipo_espacio, e.capacidad,
              e.ubicacion, e.recursos, e.recursos_otro, e.imagen,
              e.descripcion, e.estado
       FROM espacio e
       JOIN campus c ON c.id_campus = e.id_campus
       JOIN tipo_espacio t ON t.id_tipo_espacio = e.id_tipo_espacio
       WHERE e.estado = TRUE
       ORDER BY c.nombre, t.nombre, e.nombre`
    );

    res.json(resultado.rows);
  } catch (error) {
    console.error("Error al consultar los espacios:", error);
    res.status(500).json({
      mensaje: "Error al consultar los espacios disponibles",
    });
  }
});

app.get("/api/espacios/:id", async (req, res) => {
  const idEspacio = Number(req.params.id);
  if (!Number.isInteger(idEspacio) || idEspacio <= 0) {
    return res.status(400).json({ mensaje: "El espacio solicitado no es válido." });
  }

  try {
    const resultado = await pool.query(
      `SELECT e.id_espacio, e.nombre, e.id_campus, c.nombre AS campus,
              e.id_tipo_espacio, t.nombre AS tipo_espacio, e.capacidad,
              e.ubicacion, e.recursos, e.recursos_otro, e.imagen,
              e.descripcion, e.estado
       FROM espacio e
       JOIN campus c ON c.id_campus = e.id_campus
       JOIN tipo_espacio t ON t.id_tipo_espacio = e.id_tipo_espacio
       WHERE e.estado = TRUE AND e.id_espacio = $1`,
      [idEspacio]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({ mensaje: "No se encontró el espacio solicitado." });
    }

    return res.json(resultado.rows[0]);
  } catch (error) {
    console.error("Error al consultar el detalle del espacio:", error);
    return res.status(500).json({ mensaje: "Error al consultar el espacio." });
  }
});

app.get("/api/espacios/:id/disponibilidad", async (req, res) => {
  const idEspacio = Number(req.params.id);
  const { fecha, horaInicio, horaFin } = req.query;
  const fechaValida = (valor) => {
    if (typeof valor !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(valor)) return false;
    const [anio, mes, dia] = valor.split("-").map(Number);
    const fechaUtc = new Date(Date.UTC(anio, mes - 1, dia));
    return fechaUtc.getUTCFullYear() === anio &&
      fechaUtc.getUTCMonth() === mes - 1 &&
      fechaUtc.getUTCDate() === dia;
  };
  const horaValida = (valor) => typeof valor === "string" && /^([01]\d|2[0-3]):[0-5]\d$/.test(valor);

  if (
    !Number.isInteger(idEspacio) || idEspacio <= 0 ||
    !fechaValida(fecha) || !horaValida(horaInicio) || !horaValida(horaFin) ||
    horaFin <= horaInicio
  ) {
    return res.status(400).json({ mensaje: "Indica un espacio, fecha y rango de horas válidos." });
  }

  try {
    const resultado = await pool.query(
      `SELECT e.id_espacio, e.nombre, c.nombre AS campus, t.nombre AS tipo_espacio,
              e.capacidad,
              NOT EXISTS (
                SELECT 1
                FROM solicitud_reserva sr
                WHERE sr.id_espacio = e.id_espacio
                  AND sr.fecha_inicio <= $2::date
                  AND sr.fecha_fin >= $2::date
                  AND sr.hora_inicio < $4::time
                  AND sr.hora_fin > $3::time
                  AND LOWER(sr.estado) NOT IN ('rechazada', 'rechazado', 'cancelada', 'cancelado')
              ) AS disponible
       FROM espacio e
       JOIN campus c ON c.id_campus = e.id_campus
       JOIN tipo_espacio t ON t.id_tipo_espacio = e.id_tipo_espacio
       WHERE e.estado = TRUE AND e.id_espacio = $1`,
      [idEspacio, fecha, horaInicio, horaFin]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({ mensaje: "No se encontró el espacio solicitado." });
    }

    return res.json(resultado.rows[0]);
  } catch (error) {
    console.error("Error al consultar la disponibilidad del espacio:", error);
    return res.status(500).json({ mensaje: "Error al consultar la disponibilidad." });
  }
});

const referencias = {
  programa: { tabla: "programa", id: "id_programa" },
  dependencia: { tabla: "dependencia", id: "id_dependencia" },
  grupo: { tabla: "grupo", id: "id_grupo" },
};

const estadosSolicitud = [
  "Pendiente",
  "Aprobada",
  "Activa",
  "Rechazada",
  "Cancelada",
];

const consultaSolicitud = `
  SELECT
    sr.id_solicitud::text AS id,
    sr.codigo_solicitud AS codigo,
    s.nombre AS solicitante,
    COALESCE(s.correo, '') AS correo,
    CONCAT_WS(' · ', NULLIF(d.nombre, ''), NULLIF(p.nombre, ''), NULLIF(g.nombre, ''))
      AS "dependenciaProgramaGrupo",
    sr.nombre_actividad AS actividad,
    e.nombre AS espacio,
    te.nombre AS "tipoEspacio",
    c.nombre AS campus,
    TO_CHAR(sr.fecha_inicio, 'YYYY-MM-DD') AS fecha,
    TO_CHAR(sr.fecha_inicio, 'DD/MM/YYYY') AS "fechaDisplay",
    TO_CHAR(sr.hora_inicio, 'HH24:MI:SS') AS "horaInicio",
    TO_CHAR(sr.hora_fin, 'HH24:MI:SS') AS "horaFin",
    COALESCE(sr.requerimientos, '') AS requisitos,
    NULL::integer AS asistentes,
    sr.estado AS estado,
    COALESCE(sr.requerimientos, '') AS observaciones,
    sr.motivo_rechazo AS "motivoRechazo",
    sr.motivo_cancelacion AS "motivoCancelacion",
    TO_CHAR(sr.fecha_registro, 'DD/MM/YYYY HH24:MI') AS "fechaCreacion",
    TO_CHAR(sr.fecha_actualizacion, 'DD/MM/YYYY HH24:MI') AS "ultimaActualizacion"
  FROM solicitud_reserva sr
  JOIN solicitante s ON s.id_solicitante = sr.id_solicitante
  JOIN espacio e ON e.id_espacio = sr.id_espacio
  JOIN campus c ON c.id_campus = e.id_campus
  JOIN tipo_espacio te ON te.id_tipo_espacio = e.id_tipo_espacio
  LEFT JOIN dependencia d ON d.id_dependencia = s.id_dependencia
  LEFT JOIN programa p ON p.id_programa = s.id_programa
  LEFT JOIN grupo g ON g.id_grupo = s.id_grupo
`;

app.get("/api/solicitudes", async (req, res) => {
  const camposFiltro = ["search", "estado", "campus", "fecha", "espacio"];
  if (camposFiltro.some((campo) =>
    req.query[campo] !== undefined && typeof req.query[campo] !== "string"
  )) {
    return res.status(400).json({ mensaje: "Uno o más filtros no son válidos." });
  }

  const { search, estado, campus, fecha, espacio } = req.query;
  if (estado && !estadosSolicitud.includes(estado)) {
    return res.status(400).json({ mensaje: "El estado indicado no es válido." });
  }
  if (fecha && !/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
    return res.status(400).json({ mensaje: "La fecha indicada no es válida." });
  }

  const condiciones = [];
  const valores = [];
  const agregarFiltro = (condicion, valor) => {
    valores.push(valor);
    condiciones.push(condicion.replace("?", `$${valores.length}`));
  };

  if (search) {
    valores.push(`%${search}%`);
    const parametro = `$${valores.length}`;
    condiciones.push(
      `(sr.codigo_solicitud ILIKE ${parametro} OR s.nombre ILIKE ${parametro})`
    );
  }
  if (estado) agregarFiltro("sr.estado = ?", estado);
  if (campus) agregarFiltro("c.nombre = ?", campus);
  if (fecha) agregarFiltro("sr.fecha_inicio = ?::date", fecha);
  if (espacio) agregarFiltro("e.nombre ILIKE ?", `%${espacio}%`);

  try {
    const resultado = await pool.query(
      `${consultaSolicitud}
       ${condiciones.length ? `WHERE ${condiciones.join(" AND ")}` : ""}
       ORDER BY sr.fecha_registro DESC, sr.id_solicitud DESC`,
      valores
    );

    return res.json({ data: resultado.rows, total: resultado.rows.length });
  } catch (error) {
    console.error("Error al consultar las solicitudes:", error);
    return res.status(500).json({ mensaje: "Error al consultar las solicitudes." });
  }
});

app.get("/api/solicitudes/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isSafeInteger(id) || id <= 0) {
    return res.status(400).json({ mensaje: "El identificador de la solicitud no es válido." });
  }

  try {
    const resultado = await pool.query(
      `${consultaSolicitud} WHERE sr.id_solicitud = $1`,
      [id]
    );
    if (resultado.rows.length === 0) {
      return res.status(404).json({ mensaje: "No se encontró la solicitud." });
    }
    return res.json(resultado.rows[0]);
  } catch (error) {
    console.error("Error al consultar el detalle de la solicitud:", error);
    return res.status(500).json({ mensaje: "Error al consultar la solicitud." });
  }
});

app.patch("/api/solicitudes/:id/estado", async (req, res) => {
  const id = Number(req.params.id);
  const { estado, motivo } = req.body ?? {};
  if (!Number.isSafeInteger(id) || id <= 0) {
    return res.status(400).json({ mensaje: "El identificador de la solicitud no es válido." });
  }
  if (!["Aprobada", "Rechazada", "Cancelada"].includes(estado)) {
    return res.status(400).json({ mensaje: "El estado indicado no es válido." });
  }
  const requiereMotivo = estado === "Rechazada" || estado === "Cancelada";
  if (
    requiereMotivo &&
    (typeof motivo !== "string" || motivo.trim().length === 0)
  ) {
    return res.status(400).json({ mensaje: "Debes indicar el motivo de la decisión." });
  }
  if (typeof motivo === "string" && motivo.trim().length > 2000) {
    return res.status(400).json({ mensaje: "El motivo no puede superar 2000 caracteres." });
  }

  let client;
  let solicitud;
  let idNotificacion;
  try {
    client = await pool.connect();
    await client.query("BEGIN");
    const actualizada = await client.query(
      `UPDATE solicitud_reserva
       SET estado = $1::varchar(50),
           fecha_actualizacion = CURRENT_TIMESTAMP,
           motivo_rechazo = CASE
             WHEN $1::varchar(50) = 'Rechazada' THEN $2::text
             ELSE motivo_rechazo
           END,
           motivo_cancelacion = CASE
             WHEN $1::varchar(50) = 'Cancelada' THEN $2::text
             ELSE motivo_cancelacion
           END
       WHERE id_solicitud = $3
         AND (
           ($1::varchar(50) IN ('Aprobada', 'Rechazada') AND estado = 'Pendiente')
           OR ($1::varchar(50) = 'Cancelada' AND estado IN ('Pendiente', 'Aprobada'))
         )
       RETURNING id_solicitud`,
      [estado, requiereMotivo ? motivo.trim() : "", id]
    );

    if (actualizada.rows.length === 0) {
      const existente = await client.query(
        "SELECT estado FROM solicitud_reserva WHERE id_solicitud = $1",
        [id]
      );
      await client.query("ROLLBACK");
      if (existente.rows.length === 0) {
        return res.status(404).json({ mensaje: "No se encontró la solicitud." });
      }
      return res.status(409).json({
        mensaje: "La transición de estado solicitada no es válida.",
      });
    }

    const resultado = await client.query(
      `${consultaSolicitud} WHERE sr.id_solicitud = $1`,
      [id]
    );
    solicitud = resultado.rows[0];
    const notificacion = await client.query(
      `INSERT INTO notificacion (id_solicitud, tipo)
       VALUES ($1, $2)
       RETURNING id_notificacion`,
      [id, `Correo estado ${estado}`]
    );
    idNotificacion = notificacion.rows[0].id_notificacion;
    await client.query("COMMIT");
  } catch (error) {
    if (client) {
      await client.query("ROLLBACK").catch((rollbackError) => {
        console.error("Error al revertir el cambio de estado:", rollbackError);
      });
    }
    console.error("Error al actualizar el estado de la solicitud:", error);
    return res.status(500).json({ mensaje: "Error al actualizar el estado de la solicitud." });
  } finally {
    client?.release();
  }

  let notificacionCorreo;
  let errorCorreo;
  let correoEnviado = false;
  try {
    await enviarCorreoEstadoSolicitud(solicitud);
    correoEnviado = true;
  } catch (error) {
    errorCorreo = error;
    console.error("No se pudo enviar la notificación por correo:", error);
  }

  if (!correoEnviado) {
    notificacionCorreo = {
      enviado: false,
      mensaje: errorCorreo instanceof Error
        ? `El estado se guardó, pero no se pudo enviar el correo: ${errorCorreo.message}`
        : "El estado se guardó, pero no se pudo enviar el correo.",
    };
  } else {
    try {
      await pool.query(
        `UPDATE notificacion
         SET fecha_envio = CURRENT_TIMESTAMP, estado_envio = TRUE
         WHERE id_notificacion = $1`,
        [idNotificacion]
      );
      notificacionCorreo = {
        enviado: true,
        mensaje: `Se envió el correo a ${solicitud.correo}.`,
      };
    } catch (errorRegistro) {
      console.error("El correo se envió, pero no se pudo registrar el envío:", errorRegistro);
      notificacionCorreo = {
        enviado: true,
        mensaje: "El correo se envió, pero no se pudo guardar el registro del envío.",
      };
    }
  }

  return res.json({
    solicitud,
    notificacion: notificacionCorreo,
  });
});

async function obtenerOCrearReferencia(client, tipo, nombre) {
  const { tabla, id } = referencias[tipo];
  const existente = await client.query(
    `SELECT ${id} FROM ${tabla} WHERE LOWER(nombre) = LOWER($1) LIMIT 1`,
    [nombre]
  );

  if (existente.rows.length > 0) {
    return existente.rows[0][id];
  }

  const creada = await client.query(
    `INSERT INTO ${tabla} (nombre) VALUES ($1) RETURNING ${id}`,
    [nombre]
  );
  return creada.rows[0][id];
}

app.post("/api/solicitudes", async (req, res) => {
  if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
    return res.status(400).json({
      mensaje: "El cuerpo de la solicitud no tiene un formato válido.",
    });
  }

  const camposObligatorios = [
    "fechaInicio",
    "fechaFin",
    "horaInicio",
    "horaFin",
    "nombreActividad",
    "solicitante",
    "cargo",
    "correo",
    "numeroContacto",
    "dependencia",
    "programa",
    "campus",
    "tipoEspacio",
  ];
  const valores = Object.fromEntries(
    camposObligatorios.map((campo) => [
      campo,
      typeof req.body[campo] === "string" ? req.body[campo].trim() : "",
    ])
  );

  const faltantes = camposObligatorios.filter((campo) => !valores[campo]);
  if (faltantes.length > 0) {
    return res.status(400).json({
      mensaje: "Completa todos los campos obligatorios de la solicitud.",
    });
  }

  const fechaValida = (fecha) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) return false;
    const [anio, mes, dia] = fecha.split("-").map(Number);
    const fechaUtc = new Date(Date.UTC(anio, mes - 1, dia));
    return (
      fechaUtc.getUTCFullYear() === anio &&
      fechaUtc.getUTCMonth() === mes - 1 &&
      fechaUtc.getUTCDate() === dia
    );
  };
  const horaValida = (hora) => /^([01]\d|2[0-3]):[0-5]\d$/.test(hora);

  if (
    !fechaValida(valores.fechaInicio) ||
    !fechaValida(valores.fechaFin) ||
    valores.fechaFin < valores.fechaInicio
  ) {
    return res.status(400).json({
      mensaje: "Verifica que las fechas sean válidas y estén en orden.",
    });
  }

  if (
    !horaValida(valores.horaInicio) ||
    !horaValida(valores.horaFin) ||
    (valores.fechaInicio === valores.fechaFin &&
      valores.horaFin <= valores.horaInicio)
  ) {
    return res.status(400).json({
      mensaje: "Verifica que las horas sean válidas y estén en orden.",
    });
  }

  if (
    valores.nombreActividad.length > 255 ||
    valores.solicitante.length > 150 ||
    valores.cargo.length > 100 ||
    valores.correo.length > 150 ||
    valores.numeroContacto.length > 50 ||
    valores.dependencia.length > 150 ||
    valores.programa.length > 150 ||
    valores.campus.length > 100 ||
    valores.tipoEspacio.length > 150 ||
    (typeof req.body.grupo === "string" && req.body.grupo.trim().length > 150)
  ) {
    return res.status(400).json({
      mensaje: "Uno o más campos superan la longitud permitida.",
    });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valores.correo)) {
    return res.status(400).json({
      mensaje: "Ingresa un correo electrónico válido.",
    });
  }

  const idEspacio = Number(req.body.idEspacio);
  if (!Number.isInteger(idEspacio) || idEspacio <= 0) {
    return res.status(400).json({
      mensaje: "Selecciona un espacio válido.",
    });
  }

  const medios = Array.isArray(req.body.medios)
    ? req.body.medios.filter(
        (medio) => typeof medio === "string" && medio.trim().length > 0
      )
    : [];
  const observaciones =
    typeof req.body.observaciones === "string"
      ? req.body.observaciones.trim()
      : "";
  const requerimientos = [
    medios.length > 0 ? `Medios requeridos: ${medios.join(", ")}` : "",
    observaciones ? `Observaciones: ${observaciones}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  let client;
  try {
    client = await pool.connect();
    await client.query("BEGIN");

    const espacioEncontrado = await client.query(
      `SELECT e.id_espacio, e.nombre, c.nombre AS campus
       FROM espacio e
       JOIN campus c ON c.id_campus = e.id_campus
       JOIN tipo_espacio t ON t.id_tipo_espacio = e.id_tipo_espacio
       WHERE e.estado = TRUE
         AND e.id_espacio = $1
         AND c.nombre = $2
         AND t.nombre = $3
       ORDER BY e.id_espacio
       LIMIT 1`,
      [idEspacio, valores.campus, valores.tipoEspacio]
    );

    if (espacioEncontrado.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(400).json({
        mensaje: "El espacio seleccionado no coincide con el campus o tipo indicado.",
      });
    }

    await client.query("SELECT pg_advisory_xact_lock($1, $2)", [10, idEspacio]);
    const cruceReserva = await client.query(
      `SELECT EXISTS (
         SELECT 1
         FROM solicitud_reserva sr
         WHERE sr.id_espacio = $1
           AND sr.fecha_inicio <= $3::date
           AND sr.fecha_fin >= $2::date
           AND sr.hora_inicio < $5::time
           AND sr.hora_fin > $4::time
           AND LOWER(sr.estado) NOT IN ('rechazada', 'rechazado', 'cancelada', 'cancelado')
       ) AS ocupado`,
      [
        idEspacio,
        valores.fechaInicio,
        valores.fechaFin,
        valores.horaInicio,
        valores.horaFin,
      ]
    );

    if (cruceReserva.rows[0].ocupado) {
      await client.query("ROLLBACK");
      return res.status(409).json({
        mensaje: "El espacio ya tiene una solicitud o reserva en ese horario.",
      });
    }

    const idDependencia = await obtenerOCrearReferencia(
      client,
      "dependencia",
      valores.dependencia
    );
    const idPrograma = await obtenerOCrearReferencia(
      client,
      "programa",
      valores.programa
    );
    const idGrupo = valores.grupo
      ? await obtenerOCrearReferencia(client, "grupo", valores.grupo)
      : null;

    const solicitante = await client.query(
      `INSERT INTO solicitante
         (id_programa, id_dependencia, id_grupo, nombre, cargo, correo, numero_contacto)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id_solicitante`,
      [
        idPrograma,
        idDependencia,
        idGrupo,
        valores.solicitante,
        valores.cargo,
        valores.correo,
        valores.numeroContacto,
      ]
    );

    const codigo = `SOL-${randomUUID().toUpperCase()}`;
    const solicitud = await client.query(
      `INSERT INTO solicitud_reserva
         (id_solicitante, id_espacio, codigo_solicitud, fecha_inicio, fecha_fin,
          hora_inicio, hora_fin, nombre_actividad, requerimientos, estado)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'Pendiente')
       RETURNING id_solicitud, codigo_solicitud, estado`,
      [
        solicitante.rows[0].id_solicitante,
        espacioEncontrado.rows[0].id_espacio,
        codigo,
        valores.fechaInicio,
        valores.fechaFin,
        valores.horaInicio,
        valores.horaFin,
        valores.nombreActividad,
        requerimientos || null,
      ]
    );

    await client.query("COMMIT");
    return res.status(201).json({
      id: solicitud.rows[0].id_solicitud,
      codigo: solicitud.rows[0].codigo_solicitud,
      estado: solicitud.rows[0].estado,
      solicitante: valores.solicitante,
      campus: espacioEncontrado.rows[0].campus,
      espacio: espacioEncontrado.rows[0].nombre,
      fechaInicio: valores.fechaInicio,
      fechaFin: valores.fechaFin,
      horaInicio: valores.horaInicio,
      horaFin: valores.horaFin,
    });
  } catch (error) {
    if (client) {
      await client.query("ROLLBACK").catch((rollbackError) => {
        console.error("Error al revertir la transacción:", rollbackError);
      });
    }
    console.error("Error al guardar la solicitud de reserva:", error);
    return res.status(500).json({
      mensaje: "Ocurrió un error al guardar la solicitud en la base de datos.",
    });
  } finally {
    client?.release();
  }
});

pool.query("SELECT NOW()")
  .then(() => console.log("Conexión con PostgreSQL correcta"))
  .catch((error) =>
    console.error("Error de conexión con PostgreSQL:", error)
  );

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});