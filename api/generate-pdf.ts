import { VercelRequest, VercelResponse } from '@vercel/node';
import PDFDocument from 'pdfkit';
import path from 'path';
import fs from 'fs';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { planText } = req.body;

    if (!planText) {
      return res.status(400).json({ message: 'Missing plan text' });
    }

    // Set headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="AI_Automation_Plan.pdf"');

    // Create a new PDF document
    const doc = new PDFDocument({ margin: 50 });

    // Pipe the PDF to the response
    doc.pipe(res);

    // Add Watermark Logo
    const logoPath = path.join(process.cwd(), 'src', 'assest', 'LYKSPIRE LOGO.png');
    if (fs.existsSync(logoPath)) {
      doc.save()
         .opacity(0.08)
         .image(logoPath, (doc.page.width - 400) / 2, (doc.page.height - 400) / 2, { width: 400 })
         .restore();
    }

    // Styling the PDF
    doc.fontSize(24).fillColor('#00B4D8').text('Lykspire AI Business Consultant', { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(14).fillColor('#666666').text('Your Custom Automation & Growth Strategy', { align: 'center' });
    doc.moveDown(2);

    // Add content
    // We clean up markdown asterisks if any remain for a cleaner look in the PDF
    const cleanText = planText.replace(/\*\*/g, '').replace(/\*/g, '•');

    doc.fontSize(12).fillColor('#333333').text(cleanText, {
      align: 'left',
      lineGap: 4,
    });

    // Finalize the PDF and end the stream
    doc.end();

  } catch (error) {
    console.error('Error generating PDF:', error);
    if (!res.headersSent) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }
}
