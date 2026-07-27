import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

//managed Postgres->(Neon/Render) gives us ONE connection string and requires,
//TLS. local docker-compose gives us discrete vars and no TLS. So supporting both.
const connectionString = process.env.DATABASE_URL;

export const pool = new Pool(
  connectionString
    ? {
        connectionString,
        ssl: { rejectUnauthorized: false },
      }
    : {
        user: process.env.DB_USER || 'myuser',
        host: process.env.DB_HOST || 'localhost',
        database: process.env.DB_NAME || 'urldb',
        password: process.env.DB_PASSWORD || 'mypassword',
        port: process.env.DB_PORT || 5432,
      }
);

//an idle-client error is recoverable — pg discards that client and hands out a
//fresh one.Neon scales to zero after 5 min idle and drops connections when it
//does, so exiting here means the service restarts every few minutes.
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err.message);
});