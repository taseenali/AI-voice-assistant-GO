/**
 * Create or reset a super_admin user.
 * Usage:  node server/scripts/create-admin.mjs --email=me@example.com --password=secret
 *         railway run node server/scripts/create-admin.mjs --email=me@example.com --password=secret
 */
import db from '../lib/database.js';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';
import { platformQueries } from '../lib/platform-migrations.js';

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, ...rest] = a.replace(/^--/, '').split('=');
    return [k, rest.join('=')];
  })
);

const email = args.email?.trim().toLowerCase();
const password = args.password?.trim();

if (!email || !password) {
  console.error('Usage: node server/scripts/create-admin.mjs --email=<email> --password=<password>');
  process.exit(1);
}

if (password.length < 12) {
  console.error('Password must be at least 12 characters.');
  process.exit(1);
}

const hash = await bcrypt.hash(password, 10);
const existing = platformQueries.getUserByEmail.get(email);

if (existing) {
  db.prepare(`UPDATE users SET password_hash = ?, role = 'super_admin', active = 1 WHERE user_id = ?`)
    .run(hash, existing.user_id);
  console.log(`[create-admin] Updated existing user: ${email} → super_admin`);
} else {
  platformQueries.insertUser.run(randomUUID(), null, email, hash, 'super_admin');
  console.log(`[create-admin] Created super_admin: ${email}`);
}
