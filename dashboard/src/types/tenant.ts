export type TenantStatus = 'active' | 'trial' | 'suspended';

export interface TenantSummary {
  tenant_id: string;
  company_name: string;
  status: TenantStatus;
  plan_tier: string;
  created_at: string;
}

export interface TenantsListResponse {
  tenants: TenantSummary[];
}
