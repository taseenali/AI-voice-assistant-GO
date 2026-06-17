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
import { SuperAdminRoute } from './components/auth/SuperAdminRoute';

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Routes>
                      <Route path="/" element={<Overview />} />
                      <Route path="/leads" element={<Leads />} />
                      <Route path="/sessions" element={<Sessions />} />
                      <Route path="/appointments" element={<Appointments />} />
                      <Route path="/emergency" element={<EmergencyLog />} />
                      <Route path="/health" element={<SystemHealth />} />
                      <Route path="/config" element={<Configuration />} />
                      <Route
                        path="/admin/tenants"
                        element={
                          <SuperAdminRoute>
                            <TenantsAdmin />
                          </SuperAdminRoute>
                        }
                      />
                    </Routes>
                  </MainLayout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
