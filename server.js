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

    const apiKey = process.env.GROQ_API_KEY || process.env.GEMINI_API_KEY; // Fallback just in case
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

Provide a highly professional, comprehensive, and expert-level AI automation and growth strategy.
Include real-world examples, actionable steps, and expected ROI. Make it highly detailed and easy to read.

You MUST respond ONLY with a valid JSON object containing exactly these 3 keys. The values MUST be simple readable strings (do NOT use nested objects or arrays for the values):
- "businessOverview": A deep-dive expert summary of their current state.
- "automationPlan": A highly detailed step-by-step AI integration and automation plan with specific tools and real-world examples.
- "futureGrowth": Future roadmap, scaling strategies, and enhancements.

Do not include any markdown formatting like \`\`\`json, just return the raw JSON object.`;

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
});

import path from 'path';
import fs from 'fs';

// API 2: Generate PDF
app.post('/api/generate-pdf', async (req, res) => {
  try {
    const { planData, userDetails } = req.body;

    if (!planData || !userDetails) {
      return res.status(400).json({ message: 'Missing plan data or user details' });
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="ZenThira_Growth_Plan.pdf"');

    const doc = new PDFDocument({ 
      margin: 50,
      size: 'A4',
      bufferPages: true 
    });

    doc.pipe(res);

    const primaryColor = '#a855f7'; // Purple Theme
    const darkColor = '#0a0a0a';
    const textColor = '#333333';
    const lightGray = '#f0f0f0';

    // Helper to format text
    const cleanText = (text) => {
      if (!text) return "";
      if (typeof text === 'object') {
        return Object.entries(text).map(([k, v]) => `• ${k.toUpperCase()}:\n${typeof v === 'string' ? v : JSON.stringify(v)}`).join('\n\n');
      }
      return String(text).replace(/\*\*/g, '').replace(/\*/g, '•');
    };

    // Header Background
    doc.rect(0, 0, doc.page.width, 100).fill(darkColor);
    
    // Logo / Title
    try {
      doc.image('src/assest/download.jpeg', 50, 25, { width: 50 });
      doc.fontSize(24).fillColor(primaryColor).font('Times-Bold')
         .text('ZenThira AI', 110, 35);
      doc.fontSize(12).fillColor('#ffffff').font('Times-Roman')
         .text('Custom Growth & Automation Strategy', 110, 63);
    } catch(e) {
      doc.fontSize(24).fillColor(primaryColor).font('Times-Bold')
         .text('ZenThira AI', 50, 40);
      doc.fontSize(12).fillColor('#ffffff').font('Times-Roman')
         .text('Custom Growth & Automation Strategy', 50, 68);
    }

    doc.moveDown(4);

    // Client Details Section
    doc.rect(50, 120, doc.page.width - 100, 50).fill(lightGray);
    doc.fontSize(14).fillColor(darkColor).font('Times-Bold')
       .text('Prepared For:', 65, 135);
    doc.fontSize(12).font('Times-Roman')
       .text(`Email: ${userDetails.email} | Phone: ${userDetails.phone}`, 65, 155);

    doc.moveDown(3);

    // Function to render section box without causing empty pages
    const renderSection = (title, content) => {
      doc.moveDown(2);
      
      // Section Title (Text only to prevent rect pagination bugs)
      doc.fontSize(16).fillColor(primaryColor).font('Times-Bold')
         .text(title, 50, doc.y);
      
      doc.moveDown(1);
      
      // Content
      doc.fontSize(11).fillColor(textColor).font('Times-Roman')
         .text(cleanText(content), 50, doc.y, {
           align: 'left',
           lineGap: 4,
           width: doc.page.width - 100
         });
    };

    renderSection("1. Business Overview", planData.businessOverview);
    renderSection("2. AI Solutions & Automation Plan", planData.automationPlan);
    renderSection("3. Future Growth & Enhancements", planData.futureGrowth);

    // Add Watermark Logo (Center of the document, on every page)
    const logoPath = path.join(process.cwd(), 'src', 'assest', 'LYKSPIRE LOGO.png');
    if (fs.existsSync(logoPath)) {
      const range = doc.bufferedPageRange();
      for (let i = range.start; i < range.start + range.count; i++) {
        doc.switchToPage(i);
        doc.save()
           .opacity(0.05)
           .image(logoPath, (doc.page.width - 300) / 2, (doc.page.height - 300) / 2, { width: 300 })
           .restore();
      }
    }

    // Add footer and page numbers
    const range2 = doc.bufferedPageRange();
    for (let i = range2.start; i < range2.start + range2.count; i++) {
      doc.switchToPage(i);
      
      // Footer Line
      doc.rect(50, doc.page.height - 50, doc.page.width - 100, 1).fill('#dddddd');
      
      // Footer text
      doc.fontSize(9).fillColor('#888888').font('Helvetica')
         .text('Generated by ZenThira AI | Confidential Strategy Document', 50, doc.page.height - 40);
         
      // Page Number
      doc.fontSize(9).fillColor('#888888').font('Helvetica')
         .text(`Page ${i + 1} of ${range2.count}`, doc.page.width - 100, doc.page.height - 40, { align: 'right' });
    }

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
