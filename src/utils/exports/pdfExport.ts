
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatClientNameForFileName } from '../companyUtils';

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
  
  // Add payment information if available
  if (report.status === 'closed') {
    const paymentMethods = {
      boleto: "Boleto",
      pix: "PIX",
      cartao: "Cartão",
      especie: "Espécie",
      transferencia: "Transferência"
    };
    
    const paymentMethod = report.paymentMethod 
      ? paymentMethods[report.paymentMethod as keyof typeof paymentMethods] || report.paymentMethod 
      : "N/A";
    
    const dueDate = report.dueDate 
      ? format(new Date(report.dueDate), 'dd/MM/yyyy', { locale: ptBR })
      : "N/A";
    
    doc.text(`Forma de Pagamento: ${paymentMethod}`, 14, 67);
    doc.text(`Vencimento: ${dueDate}`, 90, 67);
  }
  
  // Track if total has been added already
  let totalAdded = false;
  
  // Create table with all required fields and borders
  autoTable(doc, {
    startY: report.status === 'closed' ? 75 : 70,
    head: [['Minuta', 'Data de Entrega', 'Hora', 'Recebedor', 'Peso (kg)', 'Valor do Frete', 'Observações']],
    body: deliveries.map(delivery => [
      delivery.minuteNumber,
      format(new Date(delivery.deliveryDate), 'dd/MM/yyyy', { locale: ptBR }),
      delivery.deliveryTime || '-',
      delivery.receiver || '-',
      delivery.weight.toString(),
      formatCurrency(delivery.totalFreight),
      delivery.notes || '-'
    ]),
    theme: 'grid', // Use 'grid' theme to add all borders
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
    // Add the total on the last page only
    didDrawPage: (data) => {
      // Check if this is the last page
      const currentPage = doc.getNumberOfPages();
      const pageCount = doc.getNumberOfPages();
      
      // Only add total on the last page
      if (currentPage === pageCount && !totalAdded) {
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
  
  // Make sure client name is properly used - fallback to "Cliente" if undefined
  // Make sure to use the actual name, not a formatted version
  const fileName = `Relatório_${client?.name || 'Cliente'}.pdf`;
  
  doc.save(fileName);
  return fileName;
}
