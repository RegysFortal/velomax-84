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
  
  // Use the actual client name for the filename, not a formatted version
  const fileName = `Relatório_${client?.name || 'Cliente'}.xlsx`;
  
  XLSX.writeFile(workbook, fileName);
  return fileName;
}
