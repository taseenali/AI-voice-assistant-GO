import React from 'react';
import { User, Phone, FileText, Calendar, CheckCircle, Clock } from 'lucide-react';

export interface PatientInfo {
  name?: string;
  phone?: string;
  reason?: string;
}

export interface AppointmentInfo {
  date?: string;
  time?: string;
  status?: 'pending' | 'confirmed' | 'failed';
}

interface Props {
  patient: PatientInfo;
  appointment: AppointmentInfo;
  callStatus: 'idle' | 'active' | 'ended';
}

function Field({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value?: string;
}) {
  return (
    <div className="flex items-start gap-2.5 py-2.5 border-b border-white/[0.06] last:border-0">
      <Icon size={13} className="mt-0.5 flex-shrink-0 text-on-dark-muted" />
      <div className="min-w-0">
        <div className="text-[10px] uppercase tracking-widest text-on-dark-muted mb-0.5">
          {label}
        </div>
        {value ? (
          <div className="text-xs text-on-dark font-medium leading-snug animate-fade-in">
            {value}
          </div>
        ) : (
          <div className="text-xs text-white/20">—</div>
        )}
      </div>
    </div>
  );
}

function ApptStatus({ status }: { status?: AppointmentInfo['status'] }) {
  if (!status) return <div className="text-xs text-white/20">—</div>;
  const map = {
    pending:   { label: 'Pending',   cls: 'text-warning',  Icon: Clock },
    confirmed: { label: 'Confirmed', cls: 'text-signal',   Icon: CheckCircle },
    failed:    { label: 'Failed',    cls: 'text-danger',   Icon: Clock },
  };
  const { label, cls, Icon } = map[status];
  return (
    <div className={`flex items-center gap-1.5 text-xs font-medium ${cls}`}>
      <Icon size={12} />
      {label}
    </div>
  );
}

export function PatientPanel({ patient, appointment, callStatus }: Props) {
  const hasPatient = !!(patient.name || patient.phone || patient.reason);
  const hasAppt = !!(appointment.date || appointment.time);
  const empty = callStatus === 'idle';

  return (
    <aside className="w-64 flex-shrink-0 flex flex-col gap-4">
      {/* Patient card */}
      <div className="rounded-xl border border-white/[0.08] overflow-hidden">
        <div className="px-4 py-2.5 border-b border-white/[0.06]">
          <span className="text-[10px] uppercase tracking-widest text-on-dark-muted font-semibold">
            Patient
          </span>
        </div>
        <div className={`px-4 transition-opacity duration-300 ${empty ? 'opacity-30' : 'opacity-100'}`}>
          <Field icon={User}     label="Name"   value={patient.name} />
          <Field icon={Phone}    label="Phone"  value={patient.phone} />
          <Field icon={FileText} label="Reason" value={patient.reason} />
        </div>
      </div>

      {/* Appointment card */}
      <div className="rounded-xl border border-white/[0.08] overflow-hidden">
        <div className="px-4 py-2.5 border-b border-white/[0.06]">
          <span className="text-[10px] uppercase tracking-widest text-on-dark-muted font-semibold">
            Appointment
          </span>
        </div>
        <div className={`px-4 transition-opacity duration-300 ${empty && !hasAppt ? 'opacity-30' : 'opacity-100'}`}>
          <Field icon={Calendar} label="Date" value={appointment.date} />
          <Field icon={Clock}    label="Time" value={appointment.time} />
          <div className="flex items-start gap-2.5 py-2.5">
            <CheckCircle size={13} className="mt-0.5 flex-shrink-0 text-on-dark-muted" />
            <div className="min-w-0">
              <div className="text-[10px] uppercase tracking-widest text-on-dark-muted mb-0.5">
                Status
              </div>
              <ApptStatus status={appointment.status} />
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
