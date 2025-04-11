
import { Budget } from '@/types/budget';
import { useNavigate } from 'react-router-dom';
import { formatToReadableDate } from '@/utils/dateUtils';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { formatCurrency } from '@/lib/utils';

interface UseBudgetActionsProps {
  getClientName: (clientId: string) => string;
}

export function useBudgetActions({ getClientName }: UseBudgetActionsProps) {
  const navigate = useNavigate();

  const handleEdit = (budget: Budget) => {
    // In a real implementation, this would navigate to an edit view or open a dialog
    console.log("Edit budget:", budget.id);
    // navigate(`/budgets/edit/${budget.id}`);
  };

  const handlePrint = (budget: Budget) => {
    const doc = new jsPDF();
    
    // Add logo or header
    doc.setFontSize(20);
    doc.text('Orçamento de Frete', 105, 15, { align: 'center' });
    
    // Add basic info
    doc.setFontSize(12);
    const clientName = getClientName(budget.clientId);
    doc.text(`Cliente: ${clientName}`, 14, 30);
    doc.text(`Data: ${formatToReadableDate(new Date(budget.createdAt || ''))}`, 14, 40);
    doc.text(`Volumes: ${budget.totalVolumes}`, 14, 50);
    
    // Add package details
    doc.text('Detalhes dos Volumes:', 14, 65);
    
    const tableData = budget.packages.map((pkg, index) => [
      `${index + 1}`,
      `${pkg.width.toFixed(2)} x ${pkg.length.toFixed(2)} x ${pkg.height.toFixed(2)}`,
      `${pkg.weight.toFixed(2)} kg`,
      `${pkg.quantity || 1}`
    ]);
    
    (doc as any).autoTable({
      startY: 70,
      head: [['#', 'Dimensões (cm)', 'Peso (kg)', 'Qtd']],
      body: tableData,
    });
    
    // Add total and delivery info
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    
    doc.text(`Tipo de Entrega: ${budget.deliveryType}`, 14, finalY);
    
    if (budget.merchandiseValue) {
      doc.text(`Valor da Mercadoria: ${formatCurrency(budget.merchandiseValue)}`, 14, finalY + 10);
    }
    
    if (budget.additionalServices && budget.additionalServices.length > 0) {
      doc.text('Serviços Adicionais:', 14, finalY + 20);
      
      const servicesTableData = budget.additionalServices.map(service => [
        service.description,
        formatCurrency(service.value)
      ]);
      
      (doc as any).autoTable({
        startY: finalY + 25,
        head: [['Descrição', 'Valor']],
        body: servicesTableData,
      });
    }
    
    // Final value
    const valueY = (doc as any).lastAutoTable ? (doc as any).lastAutoTable.finalY + 15 : finalY + 30;
    doc.setFontSize(14);
    doc.text(`Valor Total: ${formatCurrency(budget.totalValue)}`, 14, valueY);
    
    // Notes if available
    if (budget.notes) {
      doc.setFontSize(12);
      doc.text('Observações:', 14, valueY + 15);
      doc.text(budget.notes, 14, valueY + 25);
    }
    
    // Save with a formatted name
    const fileName = `orcamento_${clientName.replace(/ /g, '_')}_${budget.id}.pdf`;
    doc.save(fileName);
  };

  return {
    handleEdit,
    handlePrint
  };
}
