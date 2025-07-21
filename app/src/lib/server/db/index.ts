import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import { env } from '$env/dynamic/private';

if (!env.DATABASE_URL) throw new Error('DATABASE_URL is not set');

const client = postgres(env.DATABASE_URL, {
	// Force IPv4 to avoid IPv6 connection issues
	host_type: 'tcp',
	ssl: { rejectUnauthorized: false },
	// Add connection timeout and retry options
	connect_timeout: 10,
	idle_timeout: 20,
	max_lifetime: 60 * 30,
	// Force IPv4 by setting family to 4
	family: 4
});

export const db = drizzle(client, { schema });