import { VercelRequest, VercelResponse } from '@vercel/node';
import PDFDocument from 'pdfkit';
import path from 'path';
import fs from 'fs';
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
  connectionLimit: 5,
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { planData, userDetails } = req.body;
    if (!planData || !userDetails) {
      return res.status(400).json({ message: 'Missing plan data or user details' });
    }

    // ══ Save lead to TiDB (awaited to ensure completion in serverless) ══
    const saveLead = async () => {
      try {
        await db.execute(
          'INSERT INTO pdf_downloads (email, phone) VALUES (?, ?)',
          [userDetails.email || '', userDetails.phone || '']
        );
        console.log('Lead saved:', userDetails.email);
      } catch (e: any) {
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

    const cleanText = (text: any): string => {
      if (!text) return '';
      const parse = (val: any, depth = 0): string => {
        if (typeof val === 'string') {
          val = val.trim();
          if ((val.startsWith('{') && val.endsWith('}')) || (val.startsWith('[') && val.endsWith(']'))) {
            try { val = JSON.parse(val); } catch(e) {}
          }
        }
        const pad = '  '.repeat(depth);
        if (Array.isArray(val)) return val.map((x: any) => `${pad}• ${parse(x, 0)}`).join('\n');
        if (typeof val === 'object' && val !== null) {
          return Object.entries(val).map(([k,v]) => `${pad}• ${k.replace(/_/g,' ').toUpperCase()}:\n${parse(v, depth+1)}`).join('\n\n');
        }
        return String(val).replace(/\*\*/g,'').replace(/\*/g,'');
      };
      return parse(text).trim();
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

    const logoPath2 = path.resolve(process.cwd(), 'src', 'assest', 'LYKSPIRE LOGO.png');
    try { if (fs.existsSync(logoPath2)) { doc.opacity(1); doc.image(logoPath2, MARGIN, 14, { width: 40 }); } } catch(e) {}

    doc.fontSize(18).fillColor(dark).font('Times-Bold').text('LyKSpire', MARGIN + 50, 18, { lineBreak: false });
    doc.fontSize(8).fillColor(purpleL).font('Times-Roman').text('AI-POWERED GROWTH & AUTOMATION', MARGIN + 50, 42, { lineBreak: false });

    const dateStr = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
    doc.fontSize(8).fillColor(gray).font('Times-Roman').text(dateStr, 0, 30, { lineBreak: false, width: W - MARGIN, align: 'right' });

    doc.fontSize(26).fillColor(dark).font('Times-Bold').text('AI Business Strategy Report', MARGIN, 90, { width: CW });
    doc.fontSize(11).fillColor(gray).font('Times-Roman').text('A personalised AI growth & automation plan — prepared exclusively by LyKSpire.', MARGIN, 124, { width: CW });
    doc.rect(MARGIN, 148, 56, 3).fill(purple);
    doc.rect(MARGIN + 62, 148, 20, 3).fill(purpleL).opacity(0.4);
    doc.opacity(1);
    doc.rect(MARGIN, 162, CW, 0.75).fill(lightLine);

    const sectionColors = [purple, purpleL, '#059669', '#f59e0b'];
    let sIdx = 0;

    const renderSection = (title: string, content: any) => {
      const cleaned = cleanText(content);
      if (!cleaned) return;
      const col = sectionColors[sIdx % 3];
      sIdx++;
      if (doc.y > H - 195) { // Increased threshold
        doc.addPage();
        drawPageBackground();
        doc.y = 90;
      }
      doc.moveDown(1.4);
      const ty = doc.y;

      // Title
      doc.fontSize(14).fillColor(col).font('Times-Bold')
         .text(title, MARGIN, ty, { lineBreak: false });

      // Underline: fixed offset below title (ty + fontSize + gap)
      const underlineY = ty + 18;
      const titleW = doc.widthOfString(title); // fontSize already set to 14 above
      doc.rect(MARGIN, underlineY, titleW, 1.5).fill(col).opacity(0.5);
      doc.opacity(1);


      doc.y = underlineY + 10;
      doc.fontSize(10.5).fillColor(dark).font('Times-Roman')
         .text(cleaned, MARGIN, doc.y, { width: CW, align: 'left', lineGap: 4.5 });
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
      doc.fontSize(8).fillColor(gray).font('Times-Roman')
         .text('lykspire.com  |  Confidential', MARGIN, fY, { lineBreak: false, width: CW / 2 });
      doc.fontSize(8).fillColor(purpleL).font('Times-Bold')
         .text(`Page ${i + 1} of ${total}`, MARGIN + CW / 2, fY, { lineBreak: false, width: CW / 2, align: 'right' });

    }

    doc.switchToPage(range.start + total - 1);
    doc.y = 100;
    doc.end();

  } catch (error) {
    console.error('Error generating PDF:', error);
    if (!res.headersSent) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }
}
