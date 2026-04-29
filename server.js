import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import PDFDocument from 'pdfkit';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// API 1: Generate Plan using Gemini
app.post('/api/generate-plan', async (req, res) => {
  try {
    const { business_type, industry, main_activities, challenges, tools, team_size, goals } = req.body;

    if (!business_type || !main_activities || !challenges || !goals) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      return res.status(500).json({ message: 'GEMINI_API_KEY is not configured in .env' });
    }

    const prompt = `Act as an Expert AI Business Consultant. 
The user runs a ${business_type} business in the ${industry || 'general'} industry. 
Their main daily activities are: ${main_activities}. 
They currently use the following tools: ${tools}. 
Their team size is: ${team_size}. 
Their biggest challenges are: ${challenges}. 
Their ultimate goals are: ${goals}.

Please provide a highly professional, structured, and actionable plan on how they can use AI to automate tasks, solve their challenges, and achieve their goals to scale their business. Use clear headings, bullet points, and concise professional English. Do not use Markdown, just use standard text formatting. Limit the response to 3-4 sections max.`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API Error:', errorData);
      return res.status(500).json({ message: 'Failed to generate plan from AI.' });
    }

    const data = await response.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't generate a plan at this moment.";

    return res.status(200).json({ plan: generatedText });
  } catch (error) {
    console.error('Error generating plan:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

import path from 'path';
import fs from 'fs';

// API 2: Generate PDF
app.post('/api/generate-pdf', async (req, res) => {
  try {
    const { planText } = req.body;

    if (!planText) {
      return res.status(400).json({ message: 'Missing plan text' });
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="AI_Automation_Plan.pdf"');

    const doc = new PDFDocument({ margin: 50 });
    doc.pipe(res);

    // Add Watermark Logo
    const logoPath = path.join(process.cwd(), 'src', 'assest', 'LYKSPIRE LOGO.png');
    if (fs.existsSync(logoPath)) {
      doc.save()
         .opacity(0.08)
         .image(logoPath, (doc.page.width - 400) / 2, (doc.page.height - 400) / 2, { width: 400 })
         .restore();
    }

    doc.fontSize(24).fillColor('#00B4D8').text('Lykspire AI Business Consultant', { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(14).fillColor('#666666').text('Your Custom Automation & Growth Strategy', { align: 'center' });
    doc.moveDown(2);

    const cleanText = planText.replace(/\*\*/g, '').replace(/\*/g, '•');

    doc.fontSize(12).fillColor('#333333').text(cleanText, {
      align: 'left',
      lineGap: 4,
    });

    doc.end();
  } catch (error) {
    console.error('Error generating PDF:', error);
    if (!res.headersSent) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend Server running on http://localhost:${PORT}`);
});
