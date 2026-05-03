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
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { business_type, industry, language, main_activities, challenges, tools, team_size, goals } = req.body;

    if (!business_type || !main_activities || !challenges || !goals) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const apiKey = process.env.GROQ_API_KEY || process.env.GEMINI_API_KEY; // Fallback
    if (!apiKey) {
      return res.status(500).json({ message: 'GROQ_API_KEY is not configured in .env' });
    }

    const prompt = `You are an Expert AI Business Consultant. Analyze this business and generate a detailed, actionable growth plan.

Business Details:
- Business Type: ${business_type}
- Industry: ${industry || 'general'}
- Preferred Language: ${language || 'English'}
- Daily Activities: ${main_activities}
- Tools Used: ${tools || 'none specified'}
- Team Size: ${team_size}
- Challenges: ${challenges}
- Goals: ${goals}

STRICT REQUIREMENT: Generate the ENTIRE report in ${language || 'English'}. 
If the language is NOT English (e.g. Tamil), then:
1. You MUST NOT use any English words at all.
2. Translate everything including technical terms, platform names, and labels like "Week 1", "Week 2", "Trend Alert", "Snapshot", etc. into ${language}.
3. A single English word in the output will be considered a failure.

Generate a professional 4-section business growth plan. Respond ONLY with a valid JSON object with exactly these 4 keys.
All values MUST be detailed, plain readable strings. NO nested objects or arrays.

- "snapshot": Write 4-5 key points (each on a new line) covering: current business stage, team dynamics, main activities, biggest challenge, and what's at stake.

- "marketEdge": Write 5-6 key points (each on a new line) including a "Trend Alert", "Winning Gap", and "Quick Win". (Translate these labels to ${language}).

- "digitalGrowth": Write 5-6 key points (each on a new line) covering Primary Platform, Content Strategy, Local SEO, and Engagement tactics.

- "actionPlan": Write a detailed 4-week plan. Use this EXACT format (translate "Week" and "Branding/Launch/Audit/Scale" to ${language}, for Tamil use "வாரம்"). Each week must be a header, followed by individual bullet points on new lines:
  Week 1 (Branding):
  • Action Point 1
  • Action Point 2

  Week 2 (Launch):
  • Action Point 1
  • Action Point 2

  Week 3 (Audit):
  • Action Point 1
  • Action Point 2

  Week 4 (Scale):
  • Action Point 1
  • Action Point 2

Return raw JSON only. No markdown, no code blocks, no extra commentary.`;

    const url = `https://api.groq.com/openai/v1/chat/completions`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Groq API Error:', errorData);
      return res.status(500).json({ message: 'Failed to generate plan from AI.' });
    }

    const data = await response.json();
    let generatedText = data.choices?.[0]?.message?.content || "{}";
    
    // Clean up markdown just in case Groq adds markdown blocks
    generatedText = generatedText.replace(/```json/gi, '').replace(/```/g, '').trim();

    // Increment global count
    try {
      await db.execute('UPDATE app_stats SET stat_value = stat_value + 200 WHERE stat_key = ?', ['plan_count']);
    } catch (e) {
      console.error('Failed to increment global stats:', e);
    }

    return res.status(200).json({ plan: generatedText });
  } catch (error) {
    console.error('Error generating plan:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
