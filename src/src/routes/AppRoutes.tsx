/**
 * Rutas de la aplicación.
 * Portal público + Panel administrativo.
 */

import { Routes, Route, Navigate } from 'react-router-dom';

/* Público */
import Inicio from '../pages/MediosEducativos/Public/Inicio/Inicio';
import Informacion from '../pages/MediosEducativos/Public/Informacion/Informacion';
import Servicios from '../pages/MediosEducativos/Public/Servicios/Servicios';
import Fotocopias from '../pages/MediosEducativos/Public/Servicios/Fotocopias';
import Horarios from '../pages/MediosEducativos/Public/Servicios/Horarios';
import Documentos from '../pages/MediosEducativos/Public/Documentos/Documentos';
import Contacto from '../pages/MediosEducativos/Public/Contacto/Contacto';
import CatalogoEspacios from '../pages/MediosEducativos/Public/Espacios/CatalogoEspacios';
import DetalleEspacio from '../pages/MediosEducativos/Public/Espacios/DetalleEspacio';
import Disponibilidad from '../pages/MediosEducativos/Public/Espacios/Disponibilidad';
import FormularioReserva from '../pages/MediosEducativos/Public/Reserva/FormularioReserva';
import Confirmacion from '../pages/MediosEducativos/Public/Reserva/Confirmacion';
import Login from '../pages/MediosEducativos/Public/Login/Login';
import LoginGraduandos from '../pages/MediosEducativos/Public/RegistroInvitados/LoginGraduandos';
import FormularioInvitados from '../pages/MediosEducativos/Public/RegistroInvitados/FormularioInvitados';

/* Admin */
import Solicitudes from '../pages/MediosEducativos/Admin/Solicitudes/Solicitudes';
import SolicitudDetalle from '../pages/MediosEducativos/Admin/Solicitudes/SolicitudDetalle';
import Agenda from '../pages/MediosEducativos/Admin/Agenda/Agenda';
import Campus from '../pages/MediosEducativos/Admin/Campus/Campus';
import Contenidos from '../pages/MediosEducativos/Admin/Contenidos/Contenidos';
import Espacios from '../pages/MediosEducativos/Admin/Espacios/Espacios';
import Dashboard from '../pages/MediosEducativos/Admin/Dashboard/Dashboard';
import Dependencias from '../pages/MediosEducativos/Admin/Dependencias/Dependencias';
import TiposEspacio from '../pages/MediosEducativos/Admin/TiposEspacio/TiposEspacio';
import Historial from '../pages/MediosEducativos/Admin/Historial/Historial';
import FichaHistorica from '../pages/MediosEducativos/Admin/Historial/FichaHistorica';
import Eventos from '../pages/MediosEducativos/Admin/Eventos/Eventos';
import CeremoniasListado from '../pages/MediosEducativos/Admin/Eventos/Ceremonias/CeremoniasListado';
import NuevaCeremonia from '../pages/MediosEducativos/Admin/Eventos/Ceremonias/NuevaCeremonia';
import DetalleCeremonia from '../pages/MediosEducativos/Admin/Eventos/Ceremonias/DetalleCeremonia';
import ConfigurarSesion from '../pages/MediosEducativos/Admin/Eventos/Ceremonias/ConfigurarSesion';
import Graduandos from '../pages/MediosEducativos/Admin/Eventos/Ceremonias/Graduandos';
import GraduandoFormulario from '../pages/MediosEducativos/Admin/Eventos/Ceremonias/GraduandoFormulario';
import GraduandoDetalle from '../pages/MediosEducativos/Admin/Eventos/Ceremonias/GraduandoDetalle';
import Invitados from '../pages/MediosEducativos/Admin/Eventos/Ceremonias/Invitados';
import ControlIngreso from '../pages/MediosEducativos/Admin/Eventos/Ceremonias/ControlIngreso';

export default function AppRoutes() {
  return (
    <Routes>
      {/* ── Portal público ── */}
      <Route path="/" element={<Inicio />} />
      <Route path="/informacion" element={<Informacion />} />
      <Route path="/servicios" element={<Servicios />} />
      <Route path="/servicios/fotocopias" element={<Fotocopias />} />
      <Route path="/servicios/horarios" element={<Horarios />} />
      <Route path="/documentos" element={<Documentos />} />
      <Route path="/contacto" element={<Contacto />} />
      <Route path="/espacios" element={<CatalogoEspacios />} />
      <Route path="/espacios/:id" element={<DetalleEspacio />} />
      <Route path="/disponibilidad" element={<Disponibilidad />} />
      <Route path="/reserva" element={<FormularioReserva />} />
      <Route path="/reserva/confirmacion" element={<Confirmacion />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registro-invitados" element={<LoginGraduandos />} />
      <Route path="/registro-invitados/formulario" element={<FormularioInvitados />} />

      {/* ── Panel administrativo ── */}
      <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="/admin/dashboard" element={<Dashboard />} />
      <Route path="/admin/solicitudes" element={<Solicitudes />} />
      <Route path="/admin/solicitudes/:id" element={<SolicitudDetalle />} />
      <Route path="/admin/agenda" element={<Agenda />} />
      <Route path="/admin/espacios" element={<Espacios />} />
      <Route path="/admin/campus" element={<Campus />} />
      <Route path="/admin/contenidos" element={<Contenidos />} />
      <Route path="/admin/tipos-espacio" element={<TiposEspacio />} />
      <Route path="/admin/dependencias" element={<Dependencias />} />
      <Route path="/admin/historial" element={<Historial />} />
      <Route path="/admin/historial/ceremonia/:id" element={<FichaHistorica />} />
      <Route path="/admin/historial/reserva/:id" element={<FichaHistorica />} />
      <Route path="/admin/eventos" element={<Eventos />} />
      <Route path="/admin/eventos/ceremonias" element={<CeremoniasListado />} />
      <Route path="/admin/eventos/ceremonias/nueva" element={<NuevaCeremonia />} />
      <Route path="/admin/eventos/ceremonias/:id" element={<DetalleCeremonia />} />
      <Route path="/admin/eventos/ceremonias/:id/sesion/:sesionId" element={<ConfigurarSesion />} />
      <Route path="/admin/eventos/ceremonias/:id/graduandos" element={<Graduandos />} />
      <Route path="/admin/eventos/ceremonias/:id/graduandos/nuevo" element={<GraduandoFormulario />} />
      <Route path="/admin/eventos/ceremonias/:id/graduandos/:graduandoId" element={<GraduandoDetalle />} />
      <Route path="/admin/eventos/ceremonias/:id/invitados" element={<Invitados />} />
      <Route path="/admin/eventos/ceremonias/:id/control" element={<ControlIngreso />} />

      {/* Catch-all → Inicio */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
