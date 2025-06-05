
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * Creates a PDF report for deliveries
 * Uses landscape orientation and grid layout with borders
 */
export function createPDFReport(data: {
  report: any,
  client: any,
  deliveries: any[],
  companyData: any,
  formatCurrency: (val: number) => string
}) {
  const { report, client, deliveries, companyData, formatCurrency } = data;
  
  // Create PDF in landscape orientation
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });
  
  // Add logo at the top
  const logoImg = document.querySelector('.company-logo') as HTMLImageElement;
  if (logoImg) {
    // Convert SVG to data URL for PDF
    const canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 100;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      const svgString = new XMLSerializer().serializeToString(logoImg);
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 50, 10, 100, 80);
      };
      img.src = 'data:image/svg+xml;base64,' + btoa(svgString);
    }
    doc.addImage(canvas.toDataURL('image/png'), 'PNG', 10, 10, 20, 20);
  }
  
  // Add company information (adjusted for landscape)
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`${companyData.name}`, 40, 15);
  doc.text(`CNPJ: ${companyData.cnpj}`, 40, 20);
  doc.text(`${companyData.address}, ${companyData.city} - ${companyData.state}, ${companyData.zipCode}`, 40, 25);
  doc.text(`Tel: ${companyData.phone} | Email: ${companyData.email}`, 40, 30);
  doc.text(`${companyData.website}`, 40, 35);
  
  // Add horizontal line
  doc.setLineWidth(0.5);
  doc.line(10, 40, 280, 40);
  
  // Add title centered
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text("RELATÓRIO DE FECHAMENTO", 145, 50, { align: 'center' });
  
  // Add client name (adjusted for landscape)
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Cliente: ${client?.name || 'N/A'}`, 14, 60);
  
  // Sort deliveries by creation order (oldest first, so they appear in order of inclusion)
  const sortedDeliveries = [...deliveries].sort((a, b) => {
    // If createdAt exists, use it; otherwise use index order
    if (a.createdAt && b.createdAt) {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }
    return 0;
  });
  
  // Track if total has been added already
  let totalAdded = false;
  
  // Create table with all required fields and borders
  autoTable(doc, {
    startY: 70,
    head: [['Minuta', 'Data de Entrega', 'Hora', 'Recebedor', 'Peso (kg)', 'Valor do Frete', 'Observações']],
    body: sortedDeliveries.map(delivery => {
      // Fix date display - create date at noon to avoid timezone issues
      const deliveryDate = new Date(`${delivery.deliveryDate}T12:00:00`);
      return [
        delivery.minuteNumber,
        format(deliveryDate, 'dd/MM/yyyy', { locale: ptBR }),
        delivery.deliveryTime || '-',
        delivery.receiver || '-',
        delivery.weight.toString(),
        formatCurrency(delivery.totalFreight),
        delivery.notes || '-'
      ];
    }),
    theme: 'grid',
    styles: { 
      fontSize: 10,
      cellPadding: 3,
    },
    headStyles: { 
      fillColor: [80, 80, 80],
      textColor: [255, 255, 255],
      halign: 'center', 
      valign: 'middle',
      lineWidth: 0.5,
      lineColor: [0, 0, 0]
    },
    bodyStyles: { 
      lineWidth: 0.5,
      lineColor: [0, 0, 0]
    },
    didDrawPage: (data) => {
      // Check if this is the last page and we haven't added the total yet
      const isLastPage = data.pageNumber === doc.getNumberOfPages();
      
      if (isLastPage && !totalAdded) {
        const finalY = data.cursor.y + 10;
        
        // Draw total row - aligned to the right
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        
        // Calculate position for right alignment
        const pageWidth = doc.internal.pageSize.width;
        doc.text("Total geral dos serviços:", pageWidth - 90, finalY);
        doc.text(formatCurrency(report.totalFreight), pageWidth - 15, finalY, { align: 'right' });
        
        // Mark that we've added the total
        totalAdded = true;
      }
    }
  });
  
  // If we still haven't added the total (shouldn't happen but safety check)
  if (!totalAdded) {
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    const pageWidth = doc.internal.pageSize.width;
    doc.text("Total geral dos serviços:", pageWidth - 90, finalY);
    doc.text(formatCurrency(report.totalFreight), pageWidth - 15, finalY, { align: 'right' });
  }
  
  const fileName = `Relatório_${client?.name || 'Cliente'}.pdf`;
  doc.save(fileName);
  return fileName;
}
