export type UserRole = 'super_admin' | 'clinic_admin' | 'clinic_staff';

export interface AuthUser {
  userId: string;
  email: string;
  role: UserRole;
  tenantId: string | null;
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
}
