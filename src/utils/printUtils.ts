
import { Budget } from '@/types/budget';
import { Client } from '@/types';
import { formatCurrency } from '@/lib/utils';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

/**
 * Prints a budget to a new window
 */
export function printBudget(budget: Budget, clientName: string): void {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;
  
  // Format packages for printing
  const packagesHtml = budget.packages.map((pkg, index) => {
    const cubicWeight = (pkg.width * pkg.length * pkg.height) / 6000;
    const effectiveWeight = Math.max(pkg.weight, cubicWeight);
    
    return `
      <div style="margin-bottom: 10px; padding: 10px; border: 1px solid #ddd; border-radius: 4px;">
        <h4 style="margin-top: 0;">Volume ${index + 1} (${pkg.quantity} unidade${pkg.quantity > 1 ? 's' : ''})</h4>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
          <div>
            <strong>Dimensões:</strong> ${pkg.width}cm × ${pkg.length}cm × ${pkg.height}cm
          </div>
          <div>
            <strong>Peso Real:</strong> ${pkg.weight} kg
          </div>
          <div>
            <strong>Peso Cubado:</strong> ${cubicWeight.toFixed(2)} kg
          </div>
          <div>
            <strong>Peso Considerado:</strong> ${effectiveWeight.toFixed(2)} kg
          </div>
        </div>
      </div>
    `;
  }).join('');

  // Format additional services for printing
  const servicesHtml = budget.additionalServices && budget.additionalServices.length > 0
    ? budget.additionalServices.map(service => `
        <div style="display: flex; justify-content: space-between; padding: 5px 0;">
          <div>${service.description}</div>
          <div>${formatCurrency(service.value)}</div>
        </div>
      `).join('')
    : '<div style="text-align: center; padding: 10px;">Nenhum serviço adicional</div>';

  // HTML template for printing
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Orçamento - ${clientName}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          margin: 0;
          padding: 20px;
        }
        .header {
          text-align: center;
          margin-bottom: 20px;
          padding-bottom: 20px;
          border-bottom: 1px solid #eee;
        }
        .section {
          margin-bottom: 20px;
          padding-bottom: 20px;
          border-bottom: 1px solid #eee;
        }
        .grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }
        .total {
          margin-top: 20px;
          text-align: right;
          font-size: 20px;
          font-weight: bold;
        }
        .footer {
          margin-top: 50px;
          text-align: center;
          font-size: 12px;
          color: #666;
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        table th, table td {
          padding: 8px;
          text-align: left;
          border-bottom: 1px solid #ddd;
        }
        .badge {
          display: inline-block;
          padding: 3px 8px;
          border-radius: 4px;
          font-size: 12px;
          background-color: #e0e0e0;
        }
        @media print {
          body {
            padding: 0;
          }
          .no-print {
            display: none;
          }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Orçamento de Frete</h1>
        <p>Data: ${budget.createdAt ? new Date(budget.createdAt).toLocaleDateString('pt-BR') : '-'}</p>
      </div>
      
      <div class="section">
        <h2>Informações do Cliente</h2>
        <div class="grid">
          <div>
            <strong>Cliente:</strong> ${clientName}
          </div>
          <div>
            <strong>Tipo de Entrega:</strong> ${budget.deliveryType === 'standard' ? 'Padrão' : 
                                             budget.deliveryType === 'emergency' ? 'Emergencial' : 
                                             budget.deliveryType === 'exclusive' ? 'Veículo Exclusivo' : 
                                             budget.deliveryType === 'metropolitanRegion' ? 'Região Metropolitana' : 
                                             budget.deliveryType === 'doorToDoorInterior' ? 'Porta a Porta Interior' : 
                                             budget.deliveryType}
          </div>
          <div>
            <strong>Valor da Mercadoria:</strong> ${formatCurrency(budget.merchandiseValue)}
          </div>
          <div>
            <strong>Total de Volumes:</strong> ${budget.totalVolumes}
          </div>
        </div>
        
        <div style="margin-top: 15px;">
          <div>
            ${budget.hasCollection ? `<div><strong>Coleta:</strong> Sim</div>` : ''}
            ${budget.hasCollection && budget.collectionLocation ? `<div><strong>Local de Coleta:</strong> ${budget.collectionLocation}</div>` : ''}
            ${budget.hasDelivery ? `<div><strong>Entrega:</strong> Sim</div>` : ''}
          </div>
        </div>
      </div>
      
      <div class="section">
        <h2>Volumes e Medidas</h2>
        ${packagesHtml}
      </div>
      
      <div class="section">
        <h2>Serviços Adicionais</h2>
        ${servicesHtml}
      </div>
      
      ${budget.notes ? `
      <div class="section">
        <h2>Observações</h2>
        <p>${budget.notes}</p>
      </div>
      ` : ''}
      
      <div class="total">
        <div>Valor Total: ${formatCurrency(budget.totalValue)}</div>
      </div>
      
      <div class="footer">
        <p>Este orçamento tem validade de 7 dias a partir da data de emissão.</p>
        <p>* Os valores podem variar de acordo com alterações nas características da carga.</p>
      </div>
      
      <div class="no-print" style="text-align: center; margin-top: 30px;">
        <button onclick="window.print()">Imprimir</button>
        <button onclick="window.close()">Fechar</button>
      </div>
    </body>
    </html>
  `);
  
  printWindow.document.close();
  setTimeout(() => {
    printWindow.print();
  }, 500);
}

/**
 * Formats company information for reports
 */
export function getCompanyInfo() {
  const storedData = localStorage.getItem('company_settings');
  return storedData ? JSON.parse(storedData) : {
    name: 'VeloMax Transportes',
    cnpj: '12.345.678/0001-90',
    address: 'Av. Principal, 1000',
    city: 'São Paulo',
    state: 'SP',
    zipCode: '01000-000',
    phone: '(11) 1234-5678',
    email: 'contato@velomax.com',
    website: 'www.velomax.com',
    description: 'Empresa especializada em transporte de cargas.'
  };
}

/**
 * Formats a client's name for report file names
 * Takes the first name and capitalizes only the first letter
 */
export function formatClientNameForFileName(clientName: string): string {
  if (!clientName) return 'cliente';
  
  // Get the first name only
  const firstName = clientName.split(' ')[0];
  
  // Capitalize only first letter, make rest lowercase
  return firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
}

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
    // Add the total row
    foot: [['', '', '', '', '', 'Total:', formatCurrency(report.totalFreight)]],
    // Add table styling with borders
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
    footStyles: {
      fillColor: [240, 240, 240],
      textColor: [0, 0, 0],
      fontStyle: 'bold',
      lineWidth: 0.5,
      lineColor: [0, 0, 0]
    },
    theme: 'grid' // Use 'grid' theme to add all borders
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
