import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const generatePdf = async (element: HTMLElement, fileName: string = 'invoice.pdf'): Promise<void> => {
  try {
    if (!element) {
      throw new Error('No element provided for PDF generation');
    }

    // Create a canvas from the HTML element
    const canvas = await html2canvas(element, {
      scale: 2, // Higher scale for better quality
      useCORS: true, // Enable CORS for images
      logging: false, // Disable logs
      backgroundColor: '#ffffff', // White background
    });

    // Calculate dimensions to fit on A4 paper
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const imgWidth = 210; // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.save(fileName);
  } catch (error) {
    console.error('Error generating PDF:', error);
    
    // Rethrow the error so the caller can handle it
    throw error;
  }
}; 