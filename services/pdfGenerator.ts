import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { LayoutMode } from '../types';

export const generatePdfFromHtml = async (
  containerId: string,
  filename: string = 'home-visit-report.pdf',
  layoutMode: LayoutMode
) => {
  const container = document.getElementById(containerId);
  if (!container) throw new Error('Preview container not found');

  // Find all page divs within the container
  const pageNodes = container.querySelectorAll('[data-page]');
  if (pageNodes.length === 0) throw new Error('No pages found to generate');

  // Determine jsPDF orientation ('p' for portrait, 'l' for landscape)
  const orientation = layoutMode === 'portrait' ? 'p' : 'l';

  const pdf = new jsPDF(orientation, 'mm', 'a4');
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();

  for (let i = 0; i < pageNodes.length; i++) {
    const pageNode = pageNodes[i] as HTMLElement;

    // Convert DOM to canvas
    const canvas = await html2canvas(pageNode, {
      scale: 2, // Higher scale for better quality
      useCORS: true, // Allow loading local/blob images
      logging: false, // Turn off logging
      backgroundColor: '#ffffff',
      imageTimeout: 15000, // Wait longer for images
      onclone: (document) => {
        // Ensure fonts are loaded
        const element = document.getElementById(containerId);
        if (element) element.style.display = 'block';
      }
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.85);

    // Add new page for subsequent images
    if (i > 0) {
      pdf.addPage();
    }

    // Add image to PDF
    // We add it to fit exactly the A4 size
    pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
  }

  pdf.save(filename);
};