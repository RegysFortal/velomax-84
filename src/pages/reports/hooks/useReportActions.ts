
import { useState } from 'react';
import { toast } from 'sonner';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import 'jspdf-autotable';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Shipment } from '@/types';
import { formatCurrency } from '@/lib/utils';

// Add type augmentation for jsPDF to recognize autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export const useReportActions = (data: Shipment[]) => {
  const [loading, setLoading] = useState(false);
  
  const getCompanyInfo = () => {
    return {
      name: 'VeloMax Transportes Ltda',
      cnpj: '12.345.678/0001-90',
      address: 'Av. Paulista, 1000',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01310-100',
      phone: '(11) 3000-1000',
      email: 'contato@velomax.com.br',
      website: 'www.velomax.com.br',
    };
  };

  const generatePDF = async () => {
    try {
      setLoading(true);
      
      // Create PDF document in landscape orientation for better table display
      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });
      
      // Format current date
      const currentDate = format(new Date(), 'dd/MM/yyyy', { locale: ptBR });
      const fileName = `embarques_${format(new Date(), 'dd-MM-yyyy')}`;
      
      // Add company information
      const companyInfo = getCompanyInfo();
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(`${companyInfo.name}`, 14, 15);
      doc.text(`CNPJ: ${companyInfo.cnpj}`, 14, 20);
      
      // Add title centered
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text("RELATÓRIO DE EMBARQUES", 148.5, 30, { align: 'center' });
      
      // Add date on the left side
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(`Data: ${currentDate}`, 14, 40);
      
      // Create table headers and data
      const headers = [
        "Transportadora", 
        "Cliente", 
        "Conhecimento", 
        "Volumes", 
        "Peso (kg)",
        "Observações"
      ];
      
      const tableData = data.map(item => [
        item.carrierName || 'N/A',
        item.companyName || 'N/A',
        item.trackingNumber || 'N/A',
        item.packages.toString(),
        item.weight.toString(),
        (item.observations || '').slice(0, 50) + (item.observations && item.observations.length > 50 ? '...' : '')
      ]);
      
      // Add table to PDF
      doc.autoTable({
        startY: 45,
        head: [headers],
        body: tableData,
        theme: 'grid',
        headStyles: {
          fillColor: [80, 80, 80],
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          halign: 'center'
        },
        styles: {
          fontSize: 9,
          cellPadding: 2,
        }
      });
      
      // Save PDF with the correct filename
      doc.save(`${fileName}.pdf`);
      
      toast.success("PDF gerado com sucesso!");
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      toast.error("Erro ao gerar PDF. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const exportToExcel = async () => {
    try {
      setLoading(true);
      
      const currentDate = format(new Date(), 'dd/MM/yyyy', { locale: ptBR });
      const fileName = `embarques_${format(new Date(), 'dd-MM-yyyy')}`;
      
      // Create workbook and worksheet
      const wb = XLSX.utils.book_new();
      
      // Set up headers and formatting
      const wsData = [
        ["RELATÓRIO DE EMBARQUES"],
        [`Data: ${currentDate}`],
        [],
        ["Transportadora", "Cliente", "Conhecimento", "Volumes", "Peso (kg)", "Observações"]
      ];
      
      // Add data rows
      data.forEach(item => {
        wsData.push([
          item.carrierName || 'N/A',
          item.companyName || 'N/A',
          item.trackingNumber || 'N/A',
          item.packages.toString(), // Convert number to string
          item.weight.toString(),   // Convert number to string
          item.observations || ''
        ]);
      });
      
      // Create worksheet
      const ws = XLSX.utils.aoa_to_sheet(wsData);
      
      // Set column widths
      const colWidths = [
        { wch: 15 }, // Transportadora
        { wch: 25 }, // Cliente
        { wch: 15 }, // Conhecimento
        { wch: 8 },  // Volumes
        { wch: 10 }, // Peso
        { wch: 30 }  // Observações
      ];
      
      ws['!cols'] = colWidths;
      
      // Style the header (title and date) - note: Excel styling might be limited
      
      // Add alignment to center the title
      if (!ws['!merges']) ws['!merges'] = [];
      ws['!merges'].push({ s: { r: 0, c: 0 }, e: { r: 0, c: 5 } });
      
      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, "Embarques");
      
      // Save Excel file
      XLSX.writeFile(wb, `${fileName}.xlsx`);
      
      toast.success("Excel gerado com sucesso!");
    } catch (error) {
      console.error("Erro ao gerar Excel:", error);
      toast.error("Erro ao gerar Excel. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    generatePDF,
    exportToExcel
  };
};
