
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFinancial } from '@/contexts/financial';
import { useToast } from '@/hooks/use-toast';
import { FinancialReport } from '@/types';
import { toLocalDate, toISODateString } from '@/utils/dateUtils';

export function useReportGeneration() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { createReport } = useFinancial();
  const [isGenerating, setIsGenerating] = useState(false);
  
  const generateReport = async ({
    selectedClient,
    startDate,
    endDate,
    deliveries,
  }: {
    selectedClient: string;
    startDate: Date | undefined;
    endDate: Date | undefined;
    deliveries: any[];
  }) => {
    if (!selectedClient || !startDate || !endDate) {
      toast({
        title: "Campos incompletos",
        description: 'Por favor, selecione um cliente e um período para gerar o relatório.',
        variant: "destructive"
      });
      return null;
    }
    
    try {
      setIsGenerating(true);

      // Filter deliveries for the selected client and date range
      const startLocalDate = toLocalDate(startDate);
      const endLocalDate = toLocalDate(endDate);
      
      console.log('Gerando relatório - data inicial:', startLocalDate);
      console.log('Gerando relatório - data final:', endLocalDate);
      
      // Set hours for proper comparison
      startLocalDate.setHours(0, 0, 0, 0);
      endLocalDate.setHours(23, 59, 59, 999);
      
      const filteredDeliveries = deliveries.filter(delivery => {
        if (delivery.clientId !== selectedClient) return false;
        const deliveryDate = new Date(delivery.deliveryDate);
        return deliveryDate >= startLocalDate && deliveryDate <= endLocalDate;
      });

      // Calculate total freight
      const totalFreight = filteredDeliveries.reduce((sum, delivery) => sum + delivery.totalFreight, 0);

      // Create the report with explicitly typed status
      const newReport: Omit<FinancialReport, 'id' | 'createdAt' | 'updatedAt'> = {
        clientId: selectedClient,
        startDate: toISODateString(startDate),
        endDate: toISODateString(endDate),
        totalDeliveries: filteredDeliveries.length,
        totalFreight: totalFreight,
        status: 'open', // Explicitly using the union type value
      };
      
      console.log('Dados do novo relatório:', newReport);
      
      const createdReport = await createReport(newReport);
      
      if (createdReport) {
        // Navigate to the new report
        navigate(`/reports?reportId=${createdReport.id}`);
        return createdReport;
      }
      return null;
    } catch (error) {
      console.error("Error generating report:", error);
      toast({
        title: "Erro ao gerar relatório",
        description: "Ocorreu um erro ao gerar o relatório. Tente novamente.",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    isGenerating,
    generateReport,
  };
}
