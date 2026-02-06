import { Pool } from 'pg';


const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});


export const query = async (text: string, params?: any[]) => {

  console.log('Ejecutando query:', text);
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  console.log('Query ejecutada en', duration, 'ms con', res.rowCount, 'filas');
  return res;
};