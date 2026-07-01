import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { api } from '../lib/api';
import type { AuthUser } from '../types/auth';
import { DEFAULT_CLIENT_ID } from '../lib/constants';

const VIEWING_TENANT_KEY = 'medvoice_viewing_tenant';

interface AuthContextValue {
  user: AuthUser | null;
  /** Active dashboard scope — JWT tenant for clinic users; selected tenant for super_admin */
  tenantId: string;
  viewingTenantId: string;
  setViewingTenantId: (tenantId: string) => void;
  isSuperAdmin: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function readStoredViewingTenant(): string {
  try {
    return localStorage.getItem(VIEWING_TENANT_KEY) || DEFAULT_CLIENT_ID;
  } catch {
    return DEFAULT_CLIENT_ID;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewingTenantId, setViewingTenantIdState] = useState(readStoredViewingTenant);

  const setViewingTenantId = useCallback((id: string) => {
    setViewingTenantIdState(id);
    try {
      localStorage.setItem(VIEWING_TENANT_KEY, id);
    } catch {
      /* private browsing */
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post('/api/auth/logout', {});
    } catch {
      /* ignore network errors on logout */
    }
    setUser(null);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const data = await api.post<{ user: AuthUser }>('/api/auth/login', { email, password });
    setUser(data.user);
    if (data.user.role === 'super_admin') {
      setViewingTenantIdState(readStoredViewingTenant());
    }
  }, []);

  // On mount: hit /me to check if a valid session cookie already exists.
  useEffect(() => {
    api
      .get<AuthUser>('/api/auth/me')
      .then((me) => setUser(me))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const isSuperAdmin = user?.role === 'super_admin';

  const tenantId = useMemo(() => {
    if (isSuperAdmin) return viewingTenantId;
    if (user?.tenantId) return user.tenantId;
    return DEFAULT_CLIENT_ID;
  }, [isSuperAdmin, viewingTenantId, user?.tenantId]);

  const value = useMemo(
    () => ({
      user,
      tenantId,
      viewingTenantId,
      setViewingTenantId,
      isSuperAdmin,
      loading,
      login,
      logout,
    }),
    [user, tenantId, viewingTenantId, setViewingTenantId, isSuperAdmin, loading, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
