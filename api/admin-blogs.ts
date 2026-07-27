import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  // CORS
  response.setHeader('Access-Control-Allow-Credentials', 'true');
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }

  // Basic auth check for mutations
  if (request.method !== 'GET') {
    const authHeader = request.headers.authorization;
    const expectedToken = Buffer.from(`${process.env.ADMIN_USERNAME}:${process.env.ADMIN_PASSWORD}`).toString('base64');
    
    if (!authHeader || authHeader !== `Bearer ${expectedToken}`) {
      return response.status(401).json({ error: 'Unauthorized' });
    }
  }

  const mysql = require('mysql2/promise');
  let db;
  try {
    db = mysql.createPool({
      host: process.env.TIDB_HOST || 'gateway01.ap-southeast-1.prod.aws.tidbcloud.com',
      port: parseInt(process.env.TIDB_PORT || '4000'),
      user: process.env.TIDB_USER,
      password: process.env.TIDB_PASS,
      database: process.env.TIDB_NAME || 'lykspire_leads',
      ssl: { rejectUnauthorized: true },
      waitForConnections: true,
      connectionLimit: 1,
    });
  } catch (err: any) {
    return response.status(500).json({ error: 'DB Connection failed', details: err.message });
  }

  try {
    if (request.method === 'GET') {
      const { id } = request.query;
      if (id) {
        const [rows] = await db.execute('SELECT * FROM blogs WHERE id = ?', [id]);
        if ((rows as any[]).length === 0) return response.status(404).json({ error: 'Not found' });
        return response.status(200).json({ blog: (rows as any[])[0] });
      } else {
        const [rows] = await db.execute('SELECT * FROM blogs ORDER BY created_at DESC');
        return response.status(200).json({ blogs: rows });
      }
    }

    if (request.method === 'POST') {
      const { title, banner_image, alt_text, content, publish_date, read_time } = request.body;
      const [result] = await db.execute(
        'INSERT INTO blogs (title, banner_image, alt_text, content, publish_date, read_time) VALUES (?, ?, ?, ?, ?, ?)',
        [title, banner_image || null, alt_text || null, content, publish_date || null, read_time || null]
      );
      return response.status(201).json({ success: true, id: (result as any).insertId });
    }

    if (request.method === 'PUT') {
      const { id } = request.query;
      const { title, banner_image, alt_text, content, publish_date, read_time } = request.body;
      if (!id) return response.status(400).json({ error: 'Blog ID required' });
      
      await db.execute(
        'UPDATE blogs SET title=?, banner_image=?, alt_text=?, content=?, publish_date=?, read_time=? WHERE id=?',
        [title, banner_image || null, alt_text || null, content, publish_date || null, read_time || null, id]
      );
      return response.status(200).json({ success: true });
    }

    if (request.method === 'DELETE') {
      const { id } = request.query;
      if (!id) return response.status(400).json({ error: 'Blog ID required' });
      
      await db.execute('DELETE FROM blogs WHERE id = ?', [id]);
      return response.status(200).json({ success: true });
    }

    return response.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    console.error('Blogs API Error:', error);
    return response.status(500).json({ error: 'Server error', details: error.message });
  }
}
