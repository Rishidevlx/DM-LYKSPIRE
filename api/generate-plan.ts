import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { business_type, industry, main_activities, challenges, tools, team_size, goals } = req.body;

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
- Daily Activities: ${main_activities}
- Tools Used: ${tools || 'none specified'}
- Team Size: ${team_size}
- Challenges: ${challenges}
- Goals: ${goals}

Generate a professional 4-section business growth plan. Respond ONLY with a valid JSON object with exactly these 4 keys.
All values MUST be detailed, plain readable strings. NO nested objects or arrays.

- "snapshot": Write 4-5 rich sentences covering: current business stage, team dynamics, main activities, biggest challenge, and what's at stake for their goals. Be specific and insightful.

- "marketEdge": Write 5-6 sentences covering at least 3 opportunities. Include:
  * Trend Alert: A specific current market trend in their industry they can ride.
  * Winning Gap: A specific competitor blind spot they can exploit.
  * Quick Win: One immediate move they can make this week for visible impact.
  Be specific with platform names, tool names, or industry data where relevant.

- "digitalGrowth": Write 5-6 sentences covering:
  * Primary Platform: Best digital platform for their business type and why.
  * Content Strategy: Specific content mix (e.g. 40% educational, 30% promotional, 30% behind-the-scenes).
  * Local SEO: Specific Google My Business and local keyword tactics.
  * Engagement: One specific community-building or retargeting tactic.
  Be highly specific to their industry and business type.

- "actionPlan": Write a detailed 4-week plan as bullet points. Use this EXACT format with line breaks between each week:
  Week 1 (Branding): [2-3 specific branding actions]
  • Action 1
  • Action 2
  • Action 3

  Week 2 (Launch): [2-3 specific launch actions]
  • Action 1
  • Action 2
  • Action 3

  Week 3 (Audit): [2-3 specific audit/analysis actions]
  • Action 1
  • Action 2
  • Action 3

  Week 4 (Scale): [2-3 specific scaling/automation actions]
  • Action 1
  • Action 2
  • Action 3

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

    return res.status(200).json({ plan: generatedText });
  } catch (error) {
    console.error('Error generating plan:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
