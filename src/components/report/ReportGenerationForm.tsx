
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { DatePicker } from '@/components/ui/date-picker';
import { Skeleton } from '@/components/ui/skeleton';
import { ClientSearchSelect } from '@/components/client/ClientSearchSelect';
import { useToast } from '@/hooks/use-toast';

interface ReportGenerationFormProps {
  selectedClient: string;
  setSelectedClient: (id: string) => void;
  startDate: Date | undefined;
  setStartDate: (date: Date | undefined) => void;
  endDate: Date | undefined;
  setEndDate: (date: Date | undefined) => void;
  handleGenerateReport: () => Promise<void>;
  isGenerating: boolean;
  reportLoading: boolean;
  availableClients: any[];
  clientsLoading: boolean;
}

export function ReportGenerationForm({
  selectedClient,
  setSelectedClient,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  handleGenerateReport,
  isGenerating,
  reportLoading,
  availableClients,
  clientsLoading
}: ReportGenerationFormProps) {
  const { toast } = useToast();

  const onGenerateReport = async () => {
    console.log('Botão "Gerar Relatório" clicado');

    // Basic validations
    if (!selectedClient) {
      toast({
        title: "Cliente não selecionado",
        description: 'Por favor, selecione um cliente.',
        variant: "destructive"
      });
      return;
    }

    if (!startDate) {
      toast({
        title: "Data inicial não informada",
        description: 'Por favor, informe a data inicial.',
        variant: "destructive"
      });
      return;
    }

    if (!endDate) {
      toast({
        title: "Data final não informada",
        description: 'Por favor, informe a data final.',
        variant: "destructive"
      });
      return;
    }

    if (startDate > endDate) {
      toast({
        title: "Período inválido",
        description: 'A data inicial não pode ser maior que a data final.',
        variant: "destructive"
      });
      return;
    }
    
    console.log('Validações passaram, executando geração do relatório...');
    
    try {
      await handleGenerateReport();
      console.log('Relatório gerado com sucesso');
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      toast({
        title: "Erro",
        description: 'Erro ao gerar relatório. Tente novamente.',
        variant: "destructive"
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gerar Novo Relatório</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="client">Cliente</Label>
            {clientsLoading ? (
              <Skeleton className="h-10 w-full" />
            ) : (
              <ClientSearchSelect
                value={selectedClient}
                onValueChange={setSelectedClient}
                placeholder="Selecione um cliente"
                disabled={isGenerating || reportLoading}
                clients={availableClients}
              />
            )}
          </div>
          <div>
            <Label>Período</Label>
            <div className="flex gap-2">
              <DatePicker 
                date={startDate} 
                onSelect={setStartDate} 
                placeholder="Data inicial"
                allowTyping={true}
                disabled={isGenerating || reportLoading}
              />
              <DatePicker 
                date={endDate} 
                onSelect={setEndDate} 
                placeholder="Data final"
                allowTyping={true}
                disabled={isGenerating || reportLoading}
              />
            </div>
          </div>
        </div>
        <Button 
          onClick={onGenerateReport} 
          disabled={isGenerating || reportLoading || !selectedClient || !startDate || !endDate}
          className="w-full"
          type="button"
        >
          {isGenerating ? "Gerando..." : "Gerar Relatório"}
        </Button>
      </CardContent>
    </Card>
  );
}
