import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config();

const poolConnection = mysql.createPool({
  socketPath: process.env.DATABASE_SOCKET || '/opt/lampp/var/mysql/mysql.sock',
  user: 'root',
  password: '',
  database: 'b2ma_sms',
  waitForConnections: true,
  connectionLimit: 10,
});

export const db = drizzle(poolConnection);
