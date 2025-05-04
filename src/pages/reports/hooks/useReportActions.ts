import { useState } from 'react';
import { toast } from 'sonner';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import 'jspdf-autotable'; // Import jspdf-autotable to extend jsPDF with autoTable
import { createPDFReport, createExcelReport } from '@/utils/exportUtils';

// Add type augmentation for jsPDF to recognize autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export const useReportActions = (data: any[]) => {
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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const generatePDF = async () => {
    try {
      setLoading(true);
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(18);
      doc.text("Relatório Financeiro", 105, 20, { align: 'center' });
      
      // Add date
      doc.setFontSize(12);
      doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 105, 30, { align: 'center' });
      
      // Add table headers
      const headers = ["Cliente", "Valor", "Status"];
      
      // Add table data
      const tableData = data.map(item => [
        item.name || 'N/A',
        formatCurrency(item.amount || 0),
        item.status || 'N/A'
      ]);
      
      // Add table to PDF using autoTable (imported via jspdf-autotable)
      doc.autoTable({
        head: [headers],
        body: tableData,
        startY: 40,
        theme: 'grid'
      });
      
      // Generate filename that includes client name if available
      // If this is a general report without client specific data, use "Financeiro"
      const reportName = data[0]?.name ? `Relatório_${data[0].name}` : `Relatório_Financeiro`;
      const fileName = `${reportName}.pdf`;
      
      // Save PDF
      doc.save(fileName);
      
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
      
      // Create workbook
      const wb = XLSX.utils.book_new();
      
      // Convert data to worksheet format
      const wsData = [
        ["Relatório Financeiro"],
        [`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`],
        [],
        ["Cliente", "Valor", "Status"]
      ];
      
      // Add data rows
      data.forEach(item => {
        wsData.push([
          item.name || 'N/A',
          item.amount || 0,
          item.status || 'N/A'
        ]);
      });
      
      // Create worksheet from data
      const ws = XLSX.utils.aoa_to_sheet(wsData);
      
      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, "Relatório");
      
      // Generate filename that includes client name if available
      // If this is a general report without client specific data, use "Financeiro"
      const reportName = data[0]?.name ? `Relatório_${data[0].name}` : `Relatório_Financeiro`;
      const fileName = `${reportName}.xlsx`;
      
      // Save workbook
      XLSX.writeFile(wb, fileName);
      
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
