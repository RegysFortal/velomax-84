
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { Shipment } from '@/types';

export function useReportActions(filteredShipments: Shipment[]) {
  const generatePDF = useCallback(() => {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });
    
    doc.setFontSize(16);
    doc.text("Relatório de Embarques", 14, 20);
    
    const tableColumn = [
      "Empresa", 
      "Conhecimento", 
      "Transportadora", 
      "Modo", 
      "Volumes", 
      "Peso (kg)", 
      "Chegada", 
      "Status"
    ];
    
    const tableRows = filteredShipments.map((shipment) => [
      shipment.companyName,
      shipment.trackingNumber,
      shipment.carrierName,
      shipment.transportMode === 'air' ? 'Aéreo' : 'Rodoviário',
      shipment.packages,
      shipment.weight.toFixed(2),
      shipment.arrivalDate ? format(new Date(shipment.arrivalDate), 'dd/MM/yyyy', { locale: ptBR }) : 'Não definida',
      shipment.status === 'in_transit' ? 'Em Trânsito' : 
        shipment.status === 'retained' ? 'Retida' : 
        shipment.status === 'delivered' ? 'Retirada' : 'Entregue'
    ]);
    
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 80,
      theme: 'striped',
      styles: { fontSize: 8 },
      headStyles: { fillColor: [41, 128, 185] }
    });
    
    doc.save(`relatorio-embarques-${format(new Date(), 'yyyyMMdd')}.pdf`);
    toast.success("Relatório PDF gerado e baixado com sucesso!");
  }, [filteredShipments]);

  const exportToExcel = useCallback(() => {
    const excelData = filteredShipments.map((shipment) => ({
      'Empresa': shipment.companyName,
      'Conhecimento': shipment.trackingNumber,
      'Transportadora': shipment.carrierName,
      'Modo': shipment.transportMode === 'air' ? 'Aéreo' : 'Rodoviário',
      'Volumes': shipment.packages,
      'Peso (kg)': shipment.weight.toFixed(2),
      'Data de Chegada': shipment.arrivalDate ? format(new Date(shipment.arrivalDate), 'dd/MM/yyyy', { locale: ptBR }) : 'Não definida',
      'Status': shipment.status === 'in_transit' ? 'Em Trânsito' : 
               shipment.status === 'retained' ? 'Retida' : 
               shipment.status === 'delivered' ? 'Retirada' : 
               shipment.status === 'delivered_final' ? 'Entregue' : 'Desconhecido',
      'Observações': shipment.observations || ''
    }));
    
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Embarques");
    
    XLSX.writeFile(workbook, `relatorio-embarques-${format(new Date(), 'yyyyMMdd')}.xlsx`);
    toast.success("Dados exportados para Excel com sucesso!");
  }, [filteredShipments]);

  return {
    generatePDF,
    exportToExcel
  };
}
