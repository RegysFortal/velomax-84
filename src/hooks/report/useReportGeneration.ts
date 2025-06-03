
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

      console.log('Iniciando geração de relatório:', {
        selectedClient,
        startDate,
        endDate,
        totalDeliveries: deliveries.length
      });

      // Filter deliveries for the selected client and date range
      const startLocalDate = toLocalDate(startDate);
      const endLocalDate = toLocalDate(endDate);
      
      console.log('Filtrando entregas - data inicial:', startLocalDate);
      console.log('Filtrando entregas - data final:', endLocalDate);
      
      // Set hours for proper comparison
      startLocalDate.setHours(0, 0, 0, 0);
      endLocalDate.setHours(23, 59, 59, 999);
      
      const filteredDeliveries = deliveries.filter(delivery => {
        if (delivery.clientId !== selectedClient) return false;
        const deliveryDate = new Date(delivery.deliveryDate);
        return deliveryDate >= startLocalDate && deliveryDate <= endLocalDate;
      });

      console.log('Entregas filtradas:', filteredDeliveries.length);

      if (filteredDeliveries.length === 0) {
        toast({
          title: "Nenhuma entrega encontrada",
          description: 'Não foram encontradas entregas para o cliente e período selecionados.',
          variant: "destructive"
        });
        return null;
      }

      // Calculate total freight
      const totalFreight = filteredDeliveries.reduce((sum, delivery) => {
        const freight = parseFloat(delivery.totalFreight) || 0;
        return sum + freight;
      }, 0);

      console.log('Total do frete calculado:', totalFreight);

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
        console.log('Relatório criado com sucesso:', createdReport);
        
        toast({
          title: "Relatório gerado com sucesso",
          description: `Relatório criado com ${filteredDeliveries.length} entregas e total de R$ ${totalFreight.toFixed(2)}`,
        });
        
        // Navigate to the new report
        navigate(`/reports?reportId=${createdReport.id}`);
        return createdReport;
      } else {
        throw new Error('Falha ao criar relatório');
      }
    } catch (error) {
      console.error("Erro ao gerar relatório:", error);
      toast({
        title: "Erro ao gerar relatório",
        description: "Ocorreu um erro ao gerar o relatório. Verifique os dados e tente novamente.",
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
