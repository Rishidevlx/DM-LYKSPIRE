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

    const prompt = `Act as an Expert AI Business Consultant. 
The user runs a ${business_type} business in the ${industry || 'general'} industry. 
Their main daily activities are: ${main_activities}. 
They currently use the following tools: ${tools}. 
Their team size is: ${team_size}. 
Their biggest challenges are: ${challenges}. 
Their ultimate goals are: ${goals}.

Please provide a highly professional, structured, and actionable plan on how they can use AI to automate tasks, solve their challenges, and achieve their goals to scale their business. 

You MUST respond ONLY with a valid JSON object containing exactly these 3 keys:
- "businessOverview": A professional summary of their current state.
- "automationPlan": A detailed step-by-step AI integration and automation plan (use bullet points like "• point").
- "futureGrowth": Future roadmap and enhancements to scale further.

Do not include any markdown formatting, just return the raw JSON object.`;

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
