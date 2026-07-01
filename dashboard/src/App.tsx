import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { MainLayout } from './components/layout/MainLayout';
import { LoginPage } from './pages/LoginPage';
import { Overview } from './components/panels/Overview/Overview';
import { Leads } from './components/panels/Leads/Leads';
import { Sessions } from './components/panels/Sessions/Sessions';
import { EmergencyLog } from './components/panels/Emergency/EmergencyLog';
import { Appointments } from './components/panels/Appointments/Appointments';
import { SystemHealth } from './components/panels/SystemHealth/SystemHealth';
import { Configuration } from './components/panels/Configuration/Configuration';
import { TenantsAdmin } from './components/panels/Admin/TenantsAdmin';
import { Compliance } from './components/panels/Admin/Compliance';
import { AuditLog } from './components/panels/Admin/AuditLog';
import { UserManagement } from './components/panels/Admin/UserManagement';
import { Analytics } from './components/panels/Analytics/Analytics';
import { SuperAdminRoute } from './components/auth/SuperAdminRoute';
import { Landing } from './marketing/Landing';

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Routes>
            {/* Public */}
            <Route path="/" element={<Landing heroVariant="split" showLivePulse />} />
            <Route path="/login" element={<LoginPage />} />

            {/* Protected dashboard — proper nested routes, Outlet in MainLayout */}
            <Route
              path="/app"
              element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Overview />} />
              <Route path="leads" element={<Leads />} />
              <Route path="sessions" element={<Sessions />} />
              <Route path="appointments" element={<Appointments />} />
              <Route path="emergency" element={<EmergencyLog />} />
              <Route path="health" element={<SystemHealth />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="config" element={<Configuration />} />
              <Route
                path="admin/tenants"
                element={
                  <SuperAdminRoute>
                    <TenantsAdmin />
                  </SuperAdminRoute>
                }
              />
              <Route
                path="admin/compliance"
                element={
                  <SuperAdminRoute>
                    <Compliance />
                  </SuperAdminRoute>
                }
              />
              <Route
                path="admin/audit-log"
                element={
                  <SuperAdminRoute>
                    <AuditLog />
                  </SuperAdminRoute>
                }
              />
              <Route path="admin/users" element={<UserManagement />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
