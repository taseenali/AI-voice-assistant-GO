import { Toast } from 'medvoice-dashboard';

export const Success = () => <Toast message="Appointment booked successfully" type="success" onClose={() => {}} />;
export const Error = () => <Toast message="Failed to connect to calendar" type="error" onClose={() => {}} />;
export const Warning = () => <Toast message="Calendar sync pending" type="warning" onClose={() => {}} />;
export const Info = () => <Toast message="New patient registered" type="info" onClose={() => {}} />;
