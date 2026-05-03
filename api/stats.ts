import { VercelRequest, VercelResponse } from '@vercel/node';
import mysql from 'mysql2/promise';

// ══ TiDB Cloud Connection Pool ══
const db = mysql.createPool({
  host: process.env.TIDB_HOST || 'gateway01.ap-southeast-1.prod.aws.tidbcloud.com',
  port: parseInt(process.env.TIDB_PORT || '4000'),
  user: process.env.TIDB_USER,
  password: process.env.TIDB_PASS,
  database: process.env.TIDB_NAME || 'lykspire_leads',
  ssl: { rejectUnauthorized: true },
  waitForConnections: true,
  connectionLimit: 1,
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const [rows] = await db.execute('SELECT stat_value FROM app_stats WHERE stat_key = ?', ['plan_count']);
    const count = (rows as any[]).length > 0 ? (rows as any[])[0].stat_value : 4000;
    return res.status(200).json({ plan_count: count });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
