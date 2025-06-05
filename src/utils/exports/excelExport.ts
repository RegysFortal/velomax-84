
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import * as XLSX from 'xlsx';

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
    [],
    ['Minuta', 'Data de Entrega', 'Hora', 'Recebedor', 'Peso (kg)', 'Valor do Frete', 'Observações']
  ];
  
  const worksheet = XLSX.utils.aoa_to_sheet(headerRows);
  
  // Sort deliveries by creation order (oldest first, so they appear in order of inclusion)
  const sortedDeliveries = [...deliveries].sort((a, b) => {
    // If createdAt exists, use it; otherwise use index order
    if (a.createdAt && b.createdAt) {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }
    return 0;
  });
  
  // Add the data rows with corrected dates
  const data_rows = sortedDeliveries.map(delivery => {
    // Fix date display - create date at noon to avoid timezone issues
    const deliveryDate = new Date(`${delivery.deliveryDate}T12:00:00`);
    return [
      delivery.minuteNumber,
      format(deliveryDate, 'dd/MM/yyyy', { locale: ptBR }),
      delivery.deliveryTime || '-',
      delivery.receiver || '-',
      delivery.weight,
      delivery.totalFreight,
      delivery.notes || '-'
    ];
  });
  
  XLSX.utils.sheet_add_aoa(worksheet, data_rows, { origin: headerRows.length });
  
  // Add total row at the end
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
  
  const fileName = `Relatório_${client?.name || 'Cliente'}.xlsx`;
  XLSX.writeFile(workbook, fileName);
  return fileName;
}
