
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { FinancialReport } from '@/types';
import { toLocalDate, toISODateString } from '@/utils/dateUtils';
import { useFinancial } from '@/contexts/financial';

export function useReportGeneration() {
  const { toast } = useToast();
  const { createReport, financialReports } = useFinancial();
  const [isGenerating, setIsGenerating] = useState(false);
  
  const checkForDuplicateReport = (
    selectedClient: string,
    startDate: Date,
    endDate: Date
  ): FinancialReport | null => {
    const startLocalDate = toLocalDate(startDate);
    const endLocalDate = toLocalDate(endDate);
    
    // Check if there's already a report for this client that overlaps with the date range
    const existingReport = financialReports.find(report => {
      if (report.clientId !== selectedClient) return false;
      
      const reportStart = new Date(report.startDate);
      const reportEnd = new Date(report.endDate);
      
      // Check for date overlap
      return (
        (startLocalDate >= reportStart && startLocalDate <= reportEnd) ||
        (endLocalDate >= reportStart && endLocalDate <= reportEnd) ||
        (startLocalDate <= reportStart && endLocalDate >= reportEnd)
      );
    });
    
    return existingReport || null;
  };
  
  const checkForDuplicateDeliveries = (
    deliveries: any[],
    selectedClient: string,
    startDate: Date,
    endDate: Date
  ): number => {
    const startLocalDate = toLocalDate(startDate);
    const endLocalDate = toLocalDate(endDate);
    startLocalDate.setHours(0, 0, 0, 0);
    endLocalDate.setHours(23, 59, 59, 999);
    
    // Filter deliveries for the selected client and date range
    const filteredDeliveries = deliveries.filter(delivery => {
      if (delivery.clientId !== selectedClient) return false;
      const deliveryDate = new Date(delivery.deliveryDate);
      return deliveryDate >= startLocalDate && deliveryDate <= endLocalDate;
    });
    
    // Check how many of these deliveries are already in other reports
    let duplicateCount = 0;
    
    filteredDeliveries.forEach(delivery => {
      const isInOtherReport = financialReports.some(report => {
        if (report.clientId !== selectedClient) return false;
        
        const reportStart = new Date(report.startDate);
        const reportEnd = new Date(report.endDate);
        const deliveryDate = new Date(delivery.deliveryDate);
        
        return deliveryDate >= reportStart && deliveryDate <= reportEnd;
      });
      
      if (isInOtherReport) {
        duplicateCount++;
      }
    });
    
    return duplicateCount;
  };
  
  const generateReport = async ({
    selectedClient,
    startDate,
    endDate,
    deliveries,
    ignoreDuplicates = false
  }: {
    selectedClient: string;
    startDate: Date | undefined;
    endDate: Date | undefined;
    deliveries: any[];
    ignoreDuplicates?: boolean;
  }) => {
    console.log('generateReport chamado com:', {
      selectedClient,
      startDate,
      endDate,
      deliveriesLength: deliveries?.length || 0,
      ignoreDuplicates
    });

    if (!selectedClient || !startDate || !endDate) {
      console.error('Parâmetros obrigatórios ausentes:', { selectedClient, startDate, endDate });
      toast({
        title: "Campos incompletos",
        description: 'Por favor, selecione um cliente e um período para gerar o relatório.',
        variant: "destructive"
      });
      return { result: null, duplicateCount: 0 };
    }

    if (!deliveries || deliveries.length === 0) {
      console.error('Nenhuma entrega disponível para filtrar');
      toast({
        title: "Sem dados",
        description: 'Não há entregas disponíveis para gerar o relatório.',
        variant: "destructive"
      });
      return { result: null, duplicateCount: 0 };
    }
    
    // Check for duplicate report
    const duplicateReport = checkForDuplicateReport(selectedClient, startDate, endDate);
    if (duplicateReport) {
      toast({
        title: "Relatório já existe",
        description: `Já existe um relatório para este cliente no período selecionado (${new Date(duplicateReport.startDate).toLocaleDateString()} - ${new Date(duplicateReport.endDate).toLocaleDateString()}).`,
        variant: "destructive"
      });
      return { result: null, duplicateCount: 0 };
    }
    
    // Check for duplicate deliveries if not ignoring
    if (!ignoreDuplicates) {
      const duplicateCount = checkForDuplicateDeliveries(deliveries, selectedClient, startDate, endDate);
      if (duplicateCount > 0) {
        return { result: null, duplicateCount };
      }
    }
    
    try {
      setIsGenerating(true);

      console.log('Iniciando geração de relatório...');

      // Filter deliveries for the selected client and date range
      const startLocalDate = toLocalDate(startDate);
      const endLocalDate = toLocalDate(endDate);
      
      console.log('Período de filtro:', {
        startLocalDate: startLocalDate.toISOString(),
        endLocalDate: endLocalDate.toISOString()
      });
      
      // Set hours for proper comparison
      startLocalDate.setHours(0, 0, 0, 0);
      endLocalDate.setHours(23, 59, 59, 999);
      
      const filteredDeliveries = deliveries.filter(delivery => {
        if (delivery.clientId !== selectedClient) return false;
        const deliveryDate = new Date(delivery.deliveryDate);
        return deliveryDate >= startLocalDate && deliveryDate <= endLocalDate;
      });

      console.log('Entregas filtradas:', {
        total: deliveries.length,
        filtered: filteredDeliveries.length,
        clientId: selectedClient
      });

      if (filteredDeliveries.length === 0) {
        toast({
          title: "Nenhuma entrega encontrada",
          description: 'Não foram encontradas entregas para o cliente e período selecionados.',
          variant: "destructive"
        });
        return { result: null, duplicateCount: 0 };
      }

      // Calculate total freight
      const totalFreight = filteredDeliveries.reduce((sum, delivery) => {
        const freight = parseFloat(delivery.totalFreight) || 0;
        return sum + freight;
      }, 0);

      console.log('Total do frete calculado:', totalFreight);

      // Create the report
      const newReport: Omit<FinancialReport, 'id' | 'createdAt' | 'updatedAt'> = {
        clientId: selectedClient,
        startDate: toISODateString(startDate),
        endDate: toISODateString(endDate),
        totalDeliveries: filteredDeliveries.length,
        totalFreight: totalFreight,
        status: 'open',
      };
      
      console.log('Criando relatório com dados:', newReport);
      
      const createdReport = await createReport(newReport);
      
      if (createdReport) {
        console.log('Relatório criado com sucesso:', createdReport);
        
        toast({
          title: "Relatório gerado com sucesso",
          description: `Relatório criado com ${filteredDeliveries.length} entregas e total de R$ ${totalFreight.toFixed(2)}`,
        });
        
        return { result: createdReport, duplicateCount: 0 };
      } else {
        throw new Error('Falha ao criar relatório - createReport retornou null');
      }
    } catch (error) {
      console.error("Erro detalhado ao gerar relatório:", error);
      toast({
        title: "Erro ao gerar relatório",
        description: "Ocorreu um erro ao gerar o relatório. Verifique os dados e tente novamente.",
        variant: "destructive"
      });
      return { result: null, duplicateCount: 0 };
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    isGenerating,
    generateReport,
  };
}
