import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';

import PublicLayout from '../components/layout/PublicLayout';
import Inicio from '../pages/Public/Inicio/Inicio';
import Informacion from '../pages/Public/Informacion/Informacion';
import Ceremonias from "../pages/Admin/Eventos/Ceremonias/NuevaCeremonia";
function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>

        <Route element={<PublicLayout />}>
          <Route path="/" element={<Inicio />} />
          <Route path="/informacion" element={<Informacion />} />
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