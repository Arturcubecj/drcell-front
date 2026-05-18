import './App.css';
import AdminLayout from './components/admin/layout/AdminLayout';
import Dashboard from './components/admin/pages/DashboardAdmin';
function App() {
  return (
    <AdminLayout>
      <Dashboard />
    </AdminLayout>
  );
}

export default App;
