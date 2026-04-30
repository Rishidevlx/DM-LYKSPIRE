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
    res.setHeader('Content-Disposition', 'attachment; filename="LyKSpire_AI_Strategy_Plan.pdf"');

    const doc = new PDFDocument({ margin: 0, size: 'A4', bufferPages: true });
    doc.pipe(res);

    const W        = doc.page.width;   // 595
    const H        = doc.page.height;  // 842
    const MARGIN   = 52;
    const CW       = W - MARGIN * 2;
    const purple   = '#7c3aed';
    const purpleL  = '#a855f7';
    const dark     = '#1a1a2e';
    const gray     = '#555566';
    const lightLine= '#e0e0ee';

    // ── cleanText helper ──
    const cleanText = (text) => {
      if (!text) return '';
      const parse = (val, depth = 0) => {
        if (typeof val === 'string') {
          val = val.trim();
          if ((val.startsWith('{') && val.endsWith('}')) || (val.startsWith('[') && val.endsWith(']'))) {
            try { val = JSON.parse(val); } catch(e) {}
          }
        }
        const pad = '  '.repeat(depth);
        if (Array.isArray(val)) return val.map(x => `${pad}• ${parse(x, 0)}`).join('\n');
        if (typeof val === 'object' && val !== null) {
          return Object.entries(val).map(([k,v]) => `${pad}• ${k.replace(/_/g,' ').toUpperCase()}:\n${parse(v, depth+1)}`).join('\n\n');
        }
        return String(val).replace(/\*\*/g,'').replace(/\*/g,'');
      };
      return parse(text).trim();
    };

    // ══════════════════════════════
    //  HELPER: draw background on current page
    // ══════════════════════════════
    const drawPageBackground = () => {
      // White background
      doc.rect(0, 0, W, H).fill('#ffffff');

      // Watermark logo — large, centered, very faint
      const logoPath = path.resolve(process.cwd(), 'src', 'assest', 'LYKSPIRE LOGO.png');
      try {
        if (fs.existsSync(logoPath)) {
          doc.opacity(0.04);
          doc.image(logoPath, W / 2 - 110, H / 2 - 110, { width: 220 });
          doc.opacity(1);
        }
      } catch(e) {}

      // Left purple accent stripe
      doc.rect(0, 0, 5, H).fill(purple);

      // Top header bar
      doc.rect(0, 0, W, 72).fill('#f8f6ff');
      doc.rect(0, 72, W, 1.5).fill(purpleL);
    };

    // ══════════════════════════════
    //  PAGE 1 — HEADER
    // ══════════════════════════════
    drawPageBackground();

    // Logo in header
    const logoPath2 = path.resolve(process.cwd(), 'src', 'assest', 'LYKSPIRE LOGO.png');
    try {
      if (fs.existsSync(logoPath2)) {
        doc.opacity(1);
        doc.image(logoPath2, MARGIN, 14, { width: 40 });
      }
    } catch(e) {}

    // Brand name
    doc.fontSize(18).fillColor(dark).font('Times-Bold')
       .text('LyKSpire', MARGIN + 50, 18, { lineBreak: false });
    doc.fontSize(8).fillColor(purpleL).font('Times-Roman')
       .text('AI-POWERED GROWTH & AUTOMATION', MARGIN + 50, 42, { lineBreak: false });

    // Date — top right
    const dateStr = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
    doc.fontSize(8).fillColor(gray).font('Times-Roman')
       .text(dateStr, 0, 30, { lineBreak: false, width: W - MARGIN, align: 'right' });

    // Report title block
    doc.fontSize(26).fillColor(dark).font('Times-Bold')
       .text('AI Business Strategy Report', MARGIN, 90, { width: CW });

    doc.fontSize(11).fillColor(gray).font('Times-Roman')
       .text('A personalised AI growth & automation plan — prepared exclusively by LyKSpire.', MARGIN, 124, { width: CW });

    // Purple underline accent
    doc.rect(MARGIN, 148, 56, 3).fill(purple);
    doc.rect(MARGIN + 62, 148, 20, 3).fill(purpleL).opacity(0.4);
    doc.opacity(1);

    // Thin divider
    doc.rect(MARGIN, 162, CW, 0.75).fill(lightLine);

    // ══════════════════════════════
    //  SECTION RENDERER
    // ══════════════════════════════
    const sectionColors = [purple, purpleL, '#059669'];
    let sIdx = 0;

    const renderSection = (title, content) => {
      const cleaned = cleanText(content);
      if (!cleaned) return;
      const col = sectionColors[sIdx % 3];
      sIdx++;
      if (doc.y > H - 160) {
        doc.addPage();
        drawPageBackground();
        doc.y = 90;
      }
      doc.moveDown(1.4);
      const ty = doc.y;

      // Title
      doc.fontSize(14).fillColor(col).font('Times-Bold')
         .text(title, MARGIN, ty, { lineBreak: false });

      // Underline: drawn BELOW title using fixed offset (ty + fontSize + gap)
      const underlineY = ty + 18;   // 14pt + 4px gap
      const titleW = doc.widthOfString(title); // fontSize already set to 14 above
      doc.rect(MARGIN, underlineY, titleW, 1.5).fill(col).opacity(0.5);
      doc.opacity(1);

      // Body text starts below the underline
      doc.y = underlineY + 10;
      doc.fontSize(10.5).fillColor(dark).font('Times-Roman')
         .text(cleaned, MARGIN, doc.y, { width: CW, align: 'left', lineGap: 4.5 });
    };

    // Render all sections
    doc.y = 172;
    renderSection('Business Overview', planData.businessOverview);
    renderSection('AI Solutions & Automation Plan', planData.automationPlan);
    renderSection('Future Growth & Enhancements', planData.futureGrowth);

    // ══════════════════════════════
    //  FOOTER ON ALL PAGES
    // ══════════════════════════════
    const range = doc.bufferedPageRange();
    const total = range.count;
    for (let i = range.start; i < range.start + total; i++) {
      doc.switchToPage(i);
      const fY = H - 38;
      doc.rect(MARGIN, fY - 8, CW, 0.75).fill(lightLine);
      doc.fontSize(8).fillColor(gray).font('Times-Roman')
         .text('lykspire.com  |  Confidential AI Strategy Document', MARGIN, fY, { lineBreak: false });
      doc.fontSize(8).fillColor(purpleL).font('Times-Bold')
         .text(`Page ${i + 1} of ${total}`, 0, fY, { align: 'right', lineBreak: false, width: W - MARGIN });
    }

    doc.switchToPage(range.start + total - 1);
    doc.y = 100;
    doc.end();

  } catch(err) {
    console.error('PDF route error:', err);
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend Server running on http://localhost:${PORT}`);
});
