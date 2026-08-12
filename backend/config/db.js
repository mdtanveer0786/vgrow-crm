const { PrismaClient } = require('@prisma/client');
const { PrismaMariaDb } = require('@prisma/adapter-mariadb');
require('dotenv').config();

// Parse DATABASE_URL for adapter connection options
// URL format: mysql://user:password@host:port/database
const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  console.error('[DB] DATABASE_URL environment variable is not set.');
  console.error('[DB] Please set it in your .env file. Format: mysql://user:password@host:port/database');
  console.error('[DB] Falling back to individual DB_* env vars...');
}

let adapter;
if (dbUrl) {
  const matches = dbUrl.match(/mysql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);
  if (matches) {
    const [, user, password, host, port, database] = matches;
    adapter = new PrismaMariaDb({ host, port: parseInt(port), user, password, database });
  }
}

if (!adapter) {
  // Use individual env vars — all required
  const host = process.env.DB_HOST;
  const user = process.env.DB_USER;
  const password = process.env.DB_PASSWORD;
  const database = process.env.DB_NAME;
  const port = parseInt(process.env.DB_PORT || '3306');

  if (!host || !user || !database) {
    console.error('[DB] Missing required database env vars (DB_HOST, DB_USER, DB_NAME).');
    console.error('[DB] Server will attempt connection with defaults but may fail.');
  }

  adapter = new PrismaMariaDb({
    host: host || 'localhost',
    port,
    user: user || 'root',
    password: password || '',
    database: database || 'vgrow'
  });
}

const prisma = new PrismaClient({ adapter });

const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log('[DB] Prisma connected to MySQL via MariaDB adapter.');
  } catch (error) {
    console.error('[DB] Connection failed:', error.message);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

module.exports = { prisma, connectDB };
