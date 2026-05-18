import { Routes, Route, Navigate } from 'react-router-dom';

import AdminLayout from './components/admin/layout/AdminLayout';
import TecnicoLayout from './components/tecnico/layout/tecnicoLayout';
import DashboardAdmin from './components/admin/pages/DashboardAdmin';
import DashboardTecnico from './components/tecnico/pages/dashboardTecnico';

function App() {
  return (
    <Routes>

      {/* ADMIN */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="dashboard" element={<DashboardAdmin />} />
        <Route path="" element={<Navigate to="dashboard" />} />
      </Route>

      {/* TECNICO */}
      <Route path="/tecnico" element={<TecnicoLayout />}>
        <Route path="dashboard" element={<DashboardTecnico/>} />
        <Route path="" element={<Navigate to="dashboard" />} />
      </Route>

    </Routes>
  );
}

export default App;