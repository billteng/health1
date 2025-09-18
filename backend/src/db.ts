import mysql from 'mysql2/promise';

let pool: mysql.Pool;

export async function initDb() {
  const cfg = {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'patientdb',
    waitForConnections: true,
    connectionLimit: 10,
  } as const;

  // Try primary host, but if it's not reachable (e.g. "db" only valid inside Docker network),
  // fall back to 127.0.0.1 so local development works with docker-compose port mapping.
  try {
    pool = mysql.createPool(cfg);
    const conn = await pool.getConnection();
    await conn.ping();
    conn.release();
    console.log(`Connected to DB at ${cfg.host}:${cfg.port}`);
  } catch (err: any) {
    console.warn(`Failed to connect to DB at ${cfg.host}:${cfg.port} - ${err?.message}. Trying 127.0.0.1...`);
    const alt = { ...cfg, host: '127.0.0.1' };
    pool = mysql.createPool(alt);
    const conn = await pool.getConnection();
    await conn.ping();
    conn.release();
    console.log(`Connected to DB at ${alt.host}:${alt.port}`);
  }
}

export function getPool() {
  if (!pool) throw new Error('DB not initialized');
  return pool;
}
