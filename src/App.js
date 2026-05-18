import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout      from './components/admin/layout/AdminLayout';
import TecnicoLayout    from './components/tecnico/layout/TecnicoLayout';
import DashboardAdmin   from './components/admin/pages/DashboardAdmin';
import DashboardTecnico from './components/tecnico/pages/DashboardTecnico';
import ReparacionesAdmin from './components/admin/pages/ReparacionesAdmin';

function App() {
  return (
    <Routes>

      {/* ADMIN */}
      <Route path="/admin/*" element={
        <AdminLayout>
          <Routes>
            <Route path="dashboard" element={<DashboardAdmin />} />
            <Route path="reparaciones" element={<ReparacionesAdmin />} />
            <Route path="*" element={<Navigate to="dashboard" />} />
          </Routes>
        </AdminLayout>
      } />

      {/* TECNICO */}
      <Route path="/tecnico/*" element={
        <TecnicoLayout>
          <Routes>
            <Route path="dashboard" element={<DashboardTecnico />} />
            <Route path="*" element={<Navigate to="dashboard" />} />
          </Routes>
        </TecnicoLayout>
      } />

      {/* Ruta por defecto */}
      <Route path="*" element={<Navigate to="/admin/dashboard" />} />

    </Routes>
  );
}

export default App;