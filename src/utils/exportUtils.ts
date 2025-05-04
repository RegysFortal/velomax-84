
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { formatClientNameForFileName } from './companyUtils';

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
  
  // Create table with all required fields and borders
  autoTable(doc, {
    startY: 70,
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
    // Remove foot as we'll add the total manually only on the last page
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
    theme: 'grid', // Use 'grid' theme to add all borders
    
    // This is the critical part - only add the total on the last page
    didDrawPage: function(data) {
      // Only add the total if this is the last page
      if (data.pageNumber === doc.getNumberOfPages()) {
        // Add total row only on the last page
        const finalY = data.cursor.y + 10;
        
        // Add total row
        doc.setFillColor(240, 240, 240);
        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(0.5);
        
        // Draw total row
        const tableWidth = data.settings.margin.right - data.settings.margin.left;
        const cellWidth = tableWidth / 7;
        const totalCellY = finalY;
        
        // Draw total label cell
        doc.rect(
          data.settings.margin.left + (cellWidth * 5), 
          totalCellY, 
          cellWidth, 
          10, 
          'FD'
        );
        
        // Draw total value cell
        doc.rect(
          data.settings.margin.left + (cellWidth * 6), 
          totalCellY, 
          cellWidth, 
          10, 
          'FD'
        );
        
        // Add text for total
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text(
          'Total:', 
          data.settings.margin.left + (cellWidth * 5) + (cellWidth / 2), 
          totalCellY + 6, 
          { align: 'center' }
        );
        
        // Add value for total
        doc.text(
          formatCurrency(report.totalFreight), 
          data.settings.margin.left + (cellWidth * 6) + (cellWidth / 2), 
          totalCellY + 6, 
          { align: 'center' }
        );
      }
    }
  });
  
  // Format filename: Relatorio_PrimeiroNome_mes
  const clientFirstName = formatClientNameForFileName(client?.name || '');
  const reportMonth = format(new Date(report.startDate), 'MMMM_yyyy', { locale: ptBR });
  const fileName = `Relatorio_${clientFirstName}_${reportMonth}.pdf`;
  
  doc.save(fileName);
  return fileName;
}

/**
 * Creates an Excel report for deliveries
 * Uses grid layout with borders
 */
export function createExcelReport(data: {
  report: any,
  client: any,
  deliveries: any[],
  companyData: any,
  formatCurrency: (val: number) => string
}) {
  const { report, client, deliveries, companyData, formatCurrency } = data;
  
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.aoa_to_sheet([
    [`${companyData.name}`],
    [`CNPJ: ${companyData.cnpj}`],
    [`${companyData.address}, ${companyData.city} - ${companyData.state}, ${companyData.zipCode}`],
    [`Tel: ${companyData.phone} | Email: ${companyData.email}`],
    [`${companyData.website}`],
    [],
    ['RELATÓRIO DE FECHAMENTO'],
    [],
    [`Cliente: ${client?.name || 'N/A'}`],
    [],
    ['Minuta', 'Data de Entrega', 'Hora', 'Recebedor', 'Peso (kg)', 'Valor do Frete', 'Observações']
  ]);
  
  // Add the data rows
  const data_rows = deliveries.map(delivery => [
    delivery.minuteNumber,
    format(new Date(delivery.deliveryDate), 'dd/MM/yyyy', { locale: ptBR }),
    delivery.deliveryTime || '-',
    delivery.receiver || '-',
    delivery.weight,
    delivery.totalFreight,
    delivery.notes || '-'
  ]);
  
  XLSX.utils.sheet_add_aoa(worksheet, data_rows, { origin: 11 });
  
  // Add total row
  XLSX.utils.sheet_add_aoa(worksheet, [
    ['', '', '', '', '', 'Total:', report.totalFreight]
  ], { origin: 11 + data_rows.length });
  
  // Try to add some basic styling and borders
  const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1:G100');
  for (let R = range.s.r; R <= range.e.r; ++R) {
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cell_address = {r: R, c: C};
      const cell_ref = XLSX.utils.encode_cell(cell_address);
      if (!worksheet[cell_ref]) continue;
      
      // Add borders to cells
      worksheet[cell_ref].s = { 
        border: {
          top: { style: 'thin' },
          bottom: { style: 'thin' },
          left: { style: 'thin' },
          right: { style: 'thin' }
        }
      };
    }
  }
  
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Relatório');
  
  // Format filename: Relatorio_PrimeiroNome_mes
  const clientFirstName = formatClientNameForFileName(client?.name || '');
  const reportMonth = format(new Date(report.startDate), 'MMMM_yyyy', { locale: ptBR });
  const fileName = `Relatorio_${clientFirstName}_${reportMonth}.xlsx`;
  
  XLSX.writeFile(workbook, fileName);
  return fileName;
}
