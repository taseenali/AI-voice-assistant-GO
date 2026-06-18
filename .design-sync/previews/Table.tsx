import { Table } from 'medvoice-dashboard';

const columns = [
  { key: 'name', header: 'Patient' },
  { key: 'phone', header: 'Phone' },
  { key: 'status', header: 'Status' },
];

const data = [
  { name: 'Jane Smith', phone: '+1-555-0101', status: 'Confirmed' },
  { name: 'Alex Johnson', phone: '+1-555-0202', status: 'Pending' },
  { name: 'Maria Garcia', phone: '+1-555-0303', status: 'Confirmed' },
];

export const Default = () => (
  <Table
    columns={columns}
    data={data}
    keyExtractor={(row: { name: string }) => row.name}
  />
);
export const Empty = () => (
  <Table
    columns={columns}
    data={[]}
    keyExtractor={(row: { name: string }) => row.name}
    emptyMessage="No appointments found"
  />
);
