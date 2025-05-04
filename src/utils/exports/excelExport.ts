
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import * as XLSX from 'xlsx';
import { formatClientNameForFileName } from '../companyUtils';

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
  
  // Preparar cabeçalhos base
  const headerRows = [
    [`${companyData.name}`],
    [`CNPJ: ${companyData.cnpj}`],
    [`${companyData.address}, ${companyData.city} - ${companyData.state}, ${companyData.zipCode}`],
    [`Tel: ${companyData.phone} | Email: ${companyData.email}`],
    [`${companyData.website}`],
    [],
    ['RELATÓRIO DE FECHAMENTO'],
    [],
    [`Cliente: ${client?.name || 'N/A'}`],
  ];
  
  // Adicionar informações de pagamento se o relatório estiver fechado
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
    
    headerRows.push([`Forma de Pagamento: ${paymentMethod} | Vencimento: ${dueDate}`]);
  }
  
  // Adicionar linha em branco e cabeçalhos da tabela
  headerRows.push([]);
  headerRows.push(['Minuta', 'Data de Entrega', 'Hora', 'Recebedor', 'Peso (kg)', 'Valor do Frete', 'Observações']);
  
  const worksheet = XLSX.utils.aoa_to_sheet(headerRows);
  
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
  
  XLSX.utils.sheet_add_aoa(worksheet, data_rows, { origin: headerRows.length });
  
  // Add total row
  XLSX.utils.sheet_add_aoa(worksheet, [
    ['', '', '', '', '', 'Total:', report.totalFreight]
  ], { origin: headerRows.length + data_rows.length });
  
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
  
  // Use the actual client name for the filename, not a formatted version
  const fileName = `Relatório_${client?.name || 'Cliente'}.xlsx`;
  
  XLSX.writeFile(workbook, fileName);
  return fileName;
}
