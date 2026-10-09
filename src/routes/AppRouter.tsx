import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';

import PublicLayout from '../components/layout/PublicLayout';
import Inicio from '../pages/Public/Inicio/Inicio';
import Contacto from '../pages/Public/Contacto/Contacto';
import Informacion from '../pages/Public/Informacion/Informacion';
import Ceremonias from "../pages/Admin/Eventos/Ceremonias/NuevaCeremonia";
import Documentos from '../pages/Public/Documentos/Documentos';
import Espacios from '../pages/Public/Espacios/CatalogoEspacios';
import Servicios from '../pages/Public/Servicios/Servicios';
function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>

        <Route element={<PublicLayout />}>
          <Route path="/" element={<Inicio />} />
          <Route path="/informacion" element={<Informacion />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/documentos" element={<Documentos />} />
          <Route path="/espacios" element={<Espacios />} />
          <Route path="/servicios" element={<Servicios />} />
        </Route>
<Route
  path="/eventos/ceremonias"
  element={<Ceremonias />}
/>
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;