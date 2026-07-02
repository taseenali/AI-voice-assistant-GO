import { X, User, Calendar, Phone, Mail, Shield, Clock } from 'lucide-react';
import { Badge } from '../../shared/Badge';
import type { Lead } from '../../../types/lead';

interface LeadDetailPanelProps {
  lead: Lead | null;
  onClose: () => void;
}

export function LeadDetailPanel({ lead, onClose }: LeadDetailPanelProps) {
  if (!lead) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-[420px] bg-card-bg border-l border-card-border z-40 overflow-y-auto" style={{ boxShadow: 'var(--app-shadow-pop)' }}>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-display font-medium tracking-tight text-text-primary">Lead Details</h2>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text-primary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Completeness Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-text-muted">Profile Completeness</span>
            <span className="text-sm font-semibold text-text-primary">
              {lead.completeness}%
            </span>
          </div>
          <div className="h-2 bg-card-border rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                lead.completeness >= 75
                  ? 'bg-success'
                  : lead.completeness >= 50
                  ? 'bg-warning'
                  : 'bg-app-muted'
              }`}
              style={{ width: `${lead.completeness}%` }}
            />
          </div>
        </div>

        {/* Fields */}
        <div className="space-y-4">
          <DetailField icon={User} label="Name" value={lead.name || 'Not provided'} />
          <DetailField
            icon={Phone}
            label="Phone"
            value={lead.phone || 'Not provided'}
            mono={Boolean(lead.phone)}
          />
          <DetailField
            icon={User}
            label="Patient Type"
            value={lead.patient_type || 'Unknown'}
          />
          <DetailField
            icon={Calendar}
            label="Date of Birth"
            value={lead.dob || 'Not provided'}
          />
          <DetailField
            icon={Clock}
            label="Reason for Visit"
            value={lead.reason_for_visit || 'Not provided'}
          />
          <DetailField
            icon={Shield}
            label="Insurance"
            value={
              lead.insurance_provider
                ? `${lead.insurance_provider}${lead.insurance_id ? ` · ${lead.insurance_id}` : ''}`
                : 'Not provided'
            }
          />
          <DetailField
            icon={Mail}
            label="Preferred Contact"
            value={lead.contactMethod || 'Not specified'}
          />
          <DetailField
            icon={Mail}
            label="Client ID"
            value={lead.client_id}
            mono
          />
          <DetailField
            icon={Calendar}
            label="Captured At"
            value={new Date(lead.capturedAt).toLocaleString()}
          />
        </div>

        {/* Service */}
        {lead.service && (
          <div className="mt-4">
            <span className="text-xs text-text-muted mb-1 block">Service</span>
            <Badge label={lead.service} />
          </div>
        )}
      </div>
    </div>
  );
}

function DetailField({
  icon: Icon,
  label,
  value,
  mono = false,
}: {
  icon: typeof User;
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="w-4 h-4 text-text-muted mt-0.5 flex-shrink-0" />
      <div>
        <p className="text-xs text-text-muted">{label}</p>
        <p className={`text-sm text-text-primary ${mono ? 'font-mono text-xs' : ''}`}>
          {value}
        </p>
      </div>
    </div>
  );
}