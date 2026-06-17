import { seedTenantsFromConfigs, seedDefaultUsers } from './tenants/tenant-service.js';

/**
 * Platform bootstrap — run once on server start.
 */
export async function bootstrapPlatform() {
  seedTenantsFromConfigs();
  await seedDefaultUsers();
  console.log('[Platform] Bootstrap complete');
}
