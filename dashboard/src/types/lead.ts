export interface Lead {
  name: string | null;
  patient_type: 'new' | 'returning' | null;
  dob: string | null;
  reason_for_visit: string | null;
  insurance_provider: string | null;
  insurance_id: string | null;
  urgency: string | null;
  contactMethod: 'phone' | 'email' | null;
  client_id: string;
  capturedAt: string;
  completeness: number;
  service?: string;
}