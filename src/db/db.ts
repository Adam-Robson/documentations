import { Pool } from 'pg';

const pool = new Pool({
    database: process.env.PGDATABASE ?? 'docs',
    host: process.env.PGHOST ?? 'localhost',
    port: parseInt(process.env.PGPORT ?? '5432'),
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
});

export default pool;
