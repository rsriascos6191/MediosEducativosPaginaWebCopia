import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';

import PublicLayout from '../components/layout/PublicLayout';
import AdminLayout from '../components/layout/AdminLayout';

// ==============================
// PÚBLICO
// ==============================
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

// ==============================
// ADMINISTRACIÓN
// ==============================
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

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>

        <Route element={<PublicLayout />}>
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
          <Route
            path="/registro-invitados/formulario"
            element={<FormularioInvitados />}
          />
        </Route>

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="solicitudes" element={<Solicitudes />} />
          <Route path="solicitudes/:id" element={<SolicitudDetalle />} />
          <Route path="agenda" element={<Agenda />} />
          <Route path="espacios" element={<Espacios />} />
          <Route path="campus" element={<Campus />} />
          <Route path="contenidos" element={<Contenidos />} />
          <Route path="tipos-espacio" element={<TiposEspacio />} />
          <Route path="dependencias" element={<Dependencias />} />
          <Route path="historial" element={<Historial />} />
          <Route path="historial/ceremonia/:id" element={<FichaHistorica />} />
          <Route path="historial/reserva/:id" element={<FichaHistorica />} />
          <Route path="eventos" element={<Eventos />} />
          <Route path="eventos/ceremonias" element={<CeremoniasListado />} />
          <Route path="eventos/ceremonias/nueva" element={<NuevaCeremonia />} />
          <Route path="eventos/ceremonias/:id" element={<DetalleCeremonia />} />
          <Route
            path="eventos/ceremonias/:id/sesion/:sesionId"
            element={<ConfigurarSesion />}
          />
          <Route path="eventos/ceremonias/:id/graduandos" element={<Graduandos />} />
          <Route
            path="eventos/ceremonias/:id/graduandos/nuevo"
            element={<GraduandoFormulario />}
          />
          <Route
            path="eventos/ceremonias/:id/graduandos/:graduandoId"
            element={<GraduandoDetalle />}
          />
          <Route path="eventos/ceremonias/:id/invitados" element={<Invitados />} />
          <Route path="eventos/ceremonias/:id/control" element={<ControlIngreso />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
