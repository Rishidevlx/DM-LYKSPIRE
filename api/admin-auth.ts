import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  // Add CORS headers for admin subdomain support
  response.setHeader('Access-Control-Allow-Credentials', 'true');
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'OPTIONS,POST');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }

  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  const { username, password } = request.body;

  if (
    username === process.env.ADMIN_USERNAME && 
    password === process.env.ADMIN_PASSWORD
  ) {
    // In a real app, generate a proper JWT. For MVP, we'll return a static secure token
    // that the frontend will include in subsequent requests.
    const token = Buffer.from(`${username}:${password}`).toString('base64');
    return response.status(200).json({ success: true, token });
  }

  return response.status(401).json({ error: 'Invalid credentials' });
}
