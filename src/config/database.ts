import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

const { DB_USER, DB_HOST, DB_DATABASE, DB_PASSWORD, DB_PORT } = process.env;
if (!DB_USER || !DB_HOST || !DB_DATABASE || !DB_PASSWORD || !DB_PORT) {
  throw new Error('Please make sure all required environment variables are set in .env file');
}

const pool = new Pool({
    user: DB_USER,
    host: DB_HOST,
    database: DB_DATABASE,
    password: DB_PASSWORD,
    port: Number(DB_PORT),
});

export default pool;