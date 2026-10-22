import nodemailer from "nodemailer";

function obtenerConfiguracionSmtp() {
  const host = process.env.SMTP_HOST?.trim();
  const usuario = process.env.SMTP_USER?.trim();
  const contrasena = process.env.SMTP_PASS;
  const puerto = Number(process.env.SMTP_PORT || 587);
  const remitente = process.env.SMTP_FROM?.trim() || usuario;
  const seguroConfigurado = process.env.SMTP_SECURE?.trim().toLowerCase();

  if (!host || !usuario || !contrasena || !remitente) {
    throw new Error(
      "El correo no está configurado. Completa SMTP_HOST, SMTP_USER y SMTP_PASS en backend/.env."
    );
  }
  if (!Number.isInteger(puerto) || puerto < 1 || puerto > 65535) {
    throw new Error("SMTP_PORT debe ser un puerto válido.");
  }
  if (seguroConfigurado && !["true", "false"].includes(seguroConfigurado)) {
    throw new Error("SMTP_SECURE debe ser true o false.");
  }

  return {
    host,
    port: puerto,
    secure: seguroConfigurado ? seguroConfigurado === "true" : puerto === 465,
    auth: { user: usuario, pass: contrasena },
    from: remitente,
  };
}

export async function enviarCorreoEstadoSolicitud(solicitud) {
  if (!solicitud.correo) {
    throw new Error("La solicitud no tiene un correo electrónico registrado.");
  }

  const smtp = obtenerConfiguracionSmtp();
  const transportador = nodemailer.createTransport({
    host: smtp.host,
    port: smtp.port,
    secure: smtp.secure,
    auth: smtp.auth,
  });
  const resultadoPorEstado = {
    Aprobada: "aprobada",
    Rechazada: "rechazada",
    Cancelada: "cancelada",
  };
  const resultado = resultadoPorEstado[solicitud.estado];
  if (!resultado) {
    throw new Error("El estado de la solicitud no permite enviar una notificación.");
  }
  const motivo = solicitud.estado === "Rechazada"
    ? solicitud.motivoRechazo
    : solicitud.estado === "Cancelada"
      ? solicitud.motivoCancelacion
      : null;

  await transportador.sendMail({
    from: smtp.from,
    to: solicitud.correo,
    subject: `Actualización de tu solicitud ${solicitud.codigo}`,
    text: [
      `Hola ${solicitud.solicitante},`,
      "",
      `Te informamos que tu solicitud de reserva ${solicitud.codigo} fue ${resultado}.`,
      "",
      `Actividad: ${solicitud.actividad}`,
      `Espacio: ${solicitud.espacio}`,
      `Campus: ${solicitud.campus}`,
      `Fecha: ${solicitud.fechaDisplay}`,
      `Horario: ${solicitud.horaInicio} - ${solicitud.horaFin}`,
      ...(motivo ? ["", `Motivo: ${motivo}`] : []),
      "",
      "Si tienes preguntas, comunícate con Medios Educativos.",
    ].join("\n"),
  });
}
