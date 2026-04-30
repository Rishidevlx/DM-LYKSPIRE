import { VercelRequest, VercelResponse } from '@vercel/node';
import PDFDocument from 'pdfkit';
import path from 'path';
import fs from 'fs';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { planData, userDetails } = req.body;
    if (!planData || !userDetails) {
      return res.status(400).json({ message: 'Missing plan data or user details' });
    }

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
      const logoPath = path.resolve(process.cwd(), 'src', 'assest', 'LYKSPIRE LOGO.png');
      try {
        if (fs.existsSync(logoPath)) {
          doc.opacity(0.04);
          doc.image(logoPath, W / 2 - 110, H / 2 - 110, { width: 220 });
          doc.opacity(1);
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

    const sectionColors = [purple, purpleL, '#059669'];
    let sIdx = 0;

    const renderSection = (title: string, content: any) => {
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

      // Underline: fixed offset below title (ty + fontSize + gap)
      const underlineY = ty + 18;
      const titleW = doc.widthOfString(title, { fontSize: 14 });
      doc.rect(MARGIN, underlineY, titleW, 1.5).fill(col).opacity(0.5);
      doc.opacity(1);

      doc.y = underlineY + 10;
      doc.fontSize(10.5).fillColor(dark).font('Times-Roman')
         .text(cleaned, MARGIN, doc.y, { width: CW, align: 'left', lineGap: 4.5 });
    };

    doc.y = 172;
    renderSection('Business Overview', planData.businessOverview);
    renderSection('AI Solutions & Automation Plan', planData.automationPlan);
    renderSection('Future Growth & Enhancements', planData.futureGrowth);

    const range = doc.bufferedPageRange();
    const total = range.count;
    for (let i = range.start; i < range.start + total; i++) {
      doc.switchToPage(i);
      const fY = H - 38;
      doc.rect(MARGIN, fY - 8, CW, 0.75).fill(lightLine);
      doc.fontSize(8).fillColor(gray).font('Times-Roman').text('lykspire.com  |  Confidential AI Strategy Document', MARGIN, fY, { lineBreak: false });
      doc.fontSize(8).fillColor(purpleL).font('Times-Bold').text(`Page ${i + 1} of ${total}`, 0, fY, { align: 'right', lineBreak: false, width: W - MARGIN });
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
