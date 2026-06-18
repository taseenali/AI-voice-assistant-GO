import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const db = new Database(path.join(__dirname, '..', 'server', 'data', 'medvoice.db'));

const password = 'demo1234';
const hash = await bcrypt.hash(password, 10);

const ins = db.prepare('INSERT OR IGNORE INTO users (user_id, tenant_id, email, password_hash, role) VALUES (?, ?, ?, ?, ?)');

const accounts = [
  ['northgate-family-health', 'admin@northgate.local'],
  ['sunrise-dental',          'admin@sunrise-dental.local'],
  ['valley-physiotherapy',    'admin@valley-physio.local'],
];

for (const [tenant, email] of accounts) {
  ins.run(randomUUID(), tenant, email, hash, 'clinic_admin');
  console.log('Created:', email, '→', tenant);
}
db.close();
console.log('Password for all three: demo1234');
