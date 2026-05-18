import { Routes, Route, Navigate } from 'react-router-dom';

import AdminLayout from './Components/admin/layout/AdminLayout';
import TecnicoLayout from './Components/tecnico/layout/tecnicoLayout';
import DashboardAdmin from './Components/admin/pages/DashboardAdmin';
import DashboardTecnico from './Components/tecnico/pages/dashboardTecnico';

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