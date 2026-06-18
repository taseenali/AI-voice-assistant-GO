import { Modal } from 'medvoice-dashboard';

export const Default = () => (
  <Modal isOpen={true} onClose={() => {}} title="Patient Details">
    <p style={{ color: '#374151', fontSize: 14 }}>
      Jane Smith — General check-up — June 29 at 3:00 PM
    </p>
  </Modal>
);
export const Large = () => (
  <Modal isOpen={true} onClose={() => {}} title="Session Transcript" size="lg">
    <p style={{ color: '#374151', fontSize: 14 }}>
      Full transcript content appears here. The modal scales to lg for longer text.
    </p>
  </Modal>
);
