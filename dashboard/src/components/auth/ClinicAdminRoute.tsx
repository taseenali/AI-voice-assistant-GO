import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from '../../context/AuthContext';

export function ClinicAdminRoute({ children }: { children: ReactNode }) {
  const { user } = useAuth();

  if (user?.role === 'clinic_staff') {
    return <Navigate to="/app" replace />;
  }

  return <>{children}</>;
}
