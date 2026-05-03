import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import PDFDocument from 'pdfkit';
import path from 'path';
import fs from 'fs';
import mysql from 'mysql2/promise';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ══ TiDB Cloud Connection Pool ══
const db = mysql.createPool({
  host: process.env.TIDB_HOST || 'gateway01.ap-southeast-1.prod.aws.tidbcloud.com',
  port: parseInt(process.env.TIDB_PORT || '4000'),
  user: process.env.TIDB_USER,
  password: process.env.TIDB_PASS,
  database: process.env.TIDB_NAME || 'lykspire_leads',
  ssl: { rejectUnauthorized: true },
  waitForConnections: true,
  connectionLimit: 5,
});

// ══ Auto-create DB + table on startup ══
async function initDB() {
  try {
    // Create database
    const rootPool = mysql.createPool({
      host: process.env.TIDB_HOST || 'gateway01.ap-southeast-1.prod.aws.tidbcloud.com',
      port: parseInt(process.env.TIDB_PORT || '4000'),
      user: process.env.TIDB_USER,
      password: process.env.TIDB_PASS,
      ssl: { rejectUnauthorized: true },
      waitForConnections: true,
      connectionLimit: 2,
    });
    await rootPool.execute(`CREATE DATABASE IF NOT EXISTS ${process.env.TIDB_NAME || 'lykspire_leads'}`);
    await rootPool.end();
    // Create tables
    await db.execute(`
      CREATE TABLE IF NOT EXISTS pdf_downloads (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        downloaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await db.execute(`
      CREATE TABLE IF NOT EXISTS app_stats (
        stat_key VARCHAR(50) PRIMARY KEY,
        stat_value INT DEFAULT 0
      )
    `);

    // Initialize plan_count with 4000 if it doesn't exist
    await db.execute(`
      INSERT IGNORE INTO app_stats (stat_key, stat_value) VALUES ('plan_count', 4000)
    `);

    console.log('TiDB: lykspire_leads DB & tables ready ✅');
  } catch (err) {
    console.error('TiDB init error:', err.message);
  }
}
initDB();


// API 0: Get Global Stats
app.get('/api/stats', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT stat_value FROM app_stats WHERE stat_key = ?', ['plan_count']);
    const count = rows.length > 0 ? rows[0].stat_value : 4000;
    res.json({ plan_count: count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API 1: Generate Plan using Gemini
app.post('/api/generate-plan', async (req, res) => {
  try {
    const { business_type, industry, years_in_business, language, main_activities, challenges, tools, team_size, goals } = req.body;

    if (!business_type || !main_activities || !challenges || !goals) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const apiKey = process.env.GROQ_API_KEY || process.env.GEMINI_API_KEY; // Fallback just in case
    if (!apiKey) {
      return res.status(500).json({ message: 'GROQ_API_KEY is not configured in .env' });
    }

    const prompt = `You are an Expert AI Business Consultant. Analyze this business and generate a detailed, actionable growth plan.
 
Business Details:
- Business Type: ${business_type}
- Industry: ${industry || 'general'}
- Years in Business: ${years_in_business || 'not specified'}
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

    // Increment global count asynchronously (don't block the user)
    db.execute('UPDATE app_stats SET stat_value = stat_value + 200 WHERE stat_key = ?', ['plan_count']).catch(err => console.error('Stats update error:', err));

    return res.status(200).json({ plan: generatedText });
  } catch (error) {
    console.error('Error generating plan:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

// API 2: Generate PDF
app.post('/api/generate-pdf', async (req, res) => {
  try {
    const { planData, userDetails, language } = req.body;

    if (!planData || !userDetails) {
      return res.status(400).json({ message: 'Missing plan data or user details' });
    }

    // ══ Save lead to TiDB ══
    const saveLead = async () => {
      try {
        await db.execute(
          'INSERT INTO pdf_downloads (email, phone) VALUES (?, ?)',
          [userDetails.email || '', userDetails.phone || '']
        );
      } catch (e) {
        console.error('Lead save error:', e.message);
      }
    };
    await saveLead();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="LyKSpire_AI_Strategy_Plan.pdf"');

    const doc = new PDFDocument({ margin: 0, size: 'A4', bufferPages: true });
    doc.pipe(res);

    const W        = doc.page.width;
    const H        = doc.page.height;
    const MARGIN   = 52;
    const CW       = W - MARGIN * 2;
    const purple   = '#7c3aed';
    const purpleL  = '#a855f7';
    const dark     = '#1a1a2e';
    const gray     = '#555566';
    const lightLine= '#e0e0ee';

    // ══ Font Management ══
    const fontDir = path.join(process.cwd(), 'src', 'fonts');
    const tamilRegular = path.join(fontDir, 'NotoSansTamil-Regular.ttf');
    const tamilBold = path.join(fontDir, 'NotoSansTamil-Bold.ttf');

    // Headers and Static UI always use standard English fonts
    const uiRegular = 'Times-Roman';
    const uiBold = 'Times-Bold';

    // Content font depends on language
    let contentRegular = 'Times-Roman';
    let contentBold = 'Times-Bold';

    if (language === 'Tamil' && fs.existsSync(tamilRegular)) {
      contentRegular = tamilRegular;
      contentBold = fs.existsSync(tamilBold) ? tamilBold : tamilRegular;
    }

    const cleanText = (text) => {
      if (!text) return '';
      let val = text;
      if (typeof val === 'string') {
        val = val.trim();
        if ((val.startsWith('{') && val.endsWith('}')) || (val.startsWith('[') && val.endsWith(']'))) {
          try { val = JSON.parse(val); } catch(e) {}
        }
      }

      const lines = [];
      const process = (v) => {
        if (Array.isArray(v)) v.forEach(process);
        else if (typeof v === 'object' && v !== null) {
          Object.entries(v).forEach(([k, item]) => {
            lines.push(`${k.replace(/_/g,' ').toUpperCase()}:`);
            process(item);
          });
        } else {
          // Split by newline or by period followed by space (sentences)
          const raw = String(v).replace(/\*\*/g,'').replace(/\*/g,'').trim();
          const parts = raw.split(/\n|(?<=[.!?])\s+(?=[A-Z\u0B80-\u0BFF])/); 
          parts.forEach(p => {
            const clean = p.trim();
            if (clean) lines.push(clean);
          });
        }
      };
      process(val);

      return lines.map(line => {
        if (line.endsWith(':') || line.startsWith('•')) return line;
        return `• ${line}`;
      }).join('\n');
    };

    const drawPageBackground = () => {
      doc.rect(0, 0, W, H).fill('#ffffff');
      const logoPath = path.join(process.cwd(), 'src', 'assest', 'LYKSPIRE LOGO.png');
      try {
        if (fs.existsSync(logoPath)) {
          doc.save();
          doc.opacity(0.04);
          doc.image(logoPath, W / 2 - 110, H / 2 - 110, { width: 220 });
          doc.restore();
        }
      } catch(e) {}
      doc.rect(0, 0, 5, H).fill(purple);
      doc.rect(0, 0, W, 72).fill('#f8f6ff');
      doc.rect(0, 72, W, 1.5).fill(purpleL);
    };

    drawPageBackground();

    // Header Content
    const logoPath2 = path.resolve(process.cwd(), 'src', 'assest', 'LYKSPIRE LOGO.png');
    try {
      if (fs.existsSync(logoPath2)) {
        doc.opacity(1);
        doc.image(logoPath2, MARGIN, 14, { width: 40 });
      }
    } catch(e) {}

    doc.fontSize(18).fillColor(dark).font(uiBold)
       .text('LyKSpire', MARGIN + 50, 18, { lineBreak: false });
    doc.fontSize(8).fillColor(purpleL).font(uiRegular)
       .text('AI-POWERED GROWTH & AUTOMATION', MARGIN + 50, 42, { lineBreak: false });

    const dateStr = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
    doc.fontSize(8).fillColor(gray).font(uiRegular)
       .text(dateStr, 0, 30, { lineBreak: false, width: W - MARGIN, align: 'right' });

    doc.fontSize(26).fillColor(dark).font(uiBold)
       .text('AI Business Strategy Report', MARGIN, 90, { width: CW });

    doc.fontSize(11).fillColor(gray).font(uiRegular)
       .text('A personalised AI growth & automation plan — prepared exclusively by LyKSpire.', MARGIN, 130, { width: CW });

    doc.rect(MARGIN, 154, 56, 3).fill(purple);
    doc.rect(MARGIN + 62, 154, 20, 3).fill(purpleL).opacity(0.4);
    doc.opacity(1);
    doc.rect(MARGIN, 168, CW, 0.75).fill(lightLine);

    const sectionColors = [purple, purpleL, '#059669', '#f59e0b'];
    let sIdx = 0;

    const renderSection = (title, content) => {
      const cleaned = cleanText(content);
      if (!cleaned) return;
      const col = sectionColors[sIdx % sectionColors.length];
      sIdx++;
      
      // Conservative check for page breaks
      if (doc.y > H - 180) {
        doc.addPage();
        drawPageBackground();
        doc.y = 110;
      }
      
      doc.moveDown(1.5);
      const ty = doc.y;

      doc.fontSize(14).fillColor(col).font(uiBold)
         .text(title, MARGIN, ty, { lineBreak: false });

      const titleW = doc.widthOfString(title);
      doc.rect(MARGIN, ty + 18, titleW, 1.5).fill(col).opacity(0.5);
      doc.opacity(1);

      doc.y = ty + 28;
      
      // Render line by line to ensure bullets look good and avoid overlap
      const lines = cleaned.split('\n');
      lines.forEach(line => {
        if (doc.y > H - 100) { // Increased buffer to avoid footer overlap
          doc.addPage();
          drawPageBackground();
          doc.y = 110;
        }
        const isHeader = line.endsWith(':');
        doc.fontSize(isHeader ? 11 : 10.5)
           .fillColor(isHeader ? dark : '#333333')
           .font(isHeader ? contentBold : contentRegular)
           .text(line, MARGIN, doc.y, { width: CW, align: 'left', lineGap: 4.5 });
      });
    };

    doc.y = 172;
    renderSection('Snapshot', planData.snapshot);
    renderSection('Market Edge', planData.marketEdge);
    renderSection('Digital Growth', planData.digitalGrowth);
    renderSection('30-Day Action Plan', planData.actionPlan);

    const range = doc.bufferedPageRange();
    const total = range.count;
    for (let i = range.start; i < range.start + total; i++) {
      doc.switchToPage(i);
      const fY = H - 36;
      doc.rect(MARGIN, fY - 10, CW, 0.75).fill(lightLine);
      doc.fontSize(8).fillColor(gray).font(uiRegular)
         .text('lykspire.com  |  Confidential', MARGIN, fY, { lineBreak: false, width: CW / 2 });
      doc.fontSize(8).fillColor(purpleL).font(uiBold)
         .text(`Page ${i + 1} of ${total}`, MARGIN + CW / 2, fY, { lineBreak: false, width: CW / 2, align: 'right' });
    }

    doc.end();

  } catch(err) {
    console.error('PDF route error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend Server running on http://localhost:${PORT}`);
});
