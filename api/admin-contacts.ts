import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  // CORS
  response.setHeader('Access-Control-Allow-Credentials', 'true');
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }

  // Basic auth check
  const authHeader = request.headers.authorization;
  const expectedToken = Buffer.from(`${process.env.ADMIN_USERNAME}:${process.env.ADMIN_PASSWORD}`).toString('base64');
  
  if (!authHeader || authHeader !== `Bearer ${expectedToken}`) {
    return response.status(401).json({ error: 'Unauthorized' });
  }

  if (request.method === 'GET') {
    try {
      const mysql = require('mysql2/promise');
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

      const [rows] = await db.execute('SELECT * FROM contact_enquiries ORDER BY created_at DESC');
      return response.status(200).json({ contacts: rows });
    } catch (error: any) {
      console.error('Failed to fetch contacts:', error);
      return response.status(500).json({ error: 'Failed to fetch contacts', details: error.message });
    }
  }

  return response.status(405).json({ error: 'Method not allowed' });
}
