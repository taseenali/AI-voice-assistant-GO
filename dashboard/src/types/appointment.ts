export interface Appointment {
  id: string;
  startTime: string;
  endTime: string;
  patientName: string;
  reason: string | null;
  status: string;
  htmlLink: string | null;
}

export interface AppointmentsResponse {
  appointments: Appointment[];
  calendarEnabled: boolean;
  message: string | null;
}
