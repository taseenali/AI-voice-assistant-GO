import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { api, setAuthToken, getAuthToken } from '../lib/api';
import type { AuthUser, LoginResponse } from '../types/auth';
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
  logout: () => void;
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

  const setViewingTenantId = useCallback((tenantId: string) => {
    setViewingTenantIdState(tenantId);
    try {
      localStorage.setItem(VIEWING_TENANT_KEY, tenantId);
    } catch {
      /* private browsing */
    }
  }, []);

  const logout = useCallback(() => {
    setAuthToken(null);
    setUser(null);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const data = await api.post<LoginResponse>('/api/auth/login', { email, password });
    setAuthToken(data.token);
    setUser(data.user);
    if (data.user.role === 'super_admin') {
      setViewingTenantIdState(readStoredViewingTenant());
    }
  }, []);

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      setLoading(false);
      return;
    }

    api
      .get<AuthUser>('/api/auth/me')
      .then((me) => setUser(me))
      .catch(() => {
        setAuthToken(null);
        setUser(null);
      })
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
