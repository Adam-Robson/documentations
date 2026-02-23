import { Pool } from 'pg';

const pool = new Pool({
    database: 'docs',
    host: 'localhost',
    port: 5432,
});

export default pool;
