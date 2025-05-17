
import React, { useState } from 'react';
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
    if (!selectedClient || !startDate || !endDate) {
      toast({
        title: "Campos incompletos",
        description: 'Por favor, selecione um cliente e um período para gerar o relatório.',
        variant: "destructive"
      });
      return;
    }
    
    await handleGenerateReport();
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
                disabled={isGenerating}
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
                placeholder={isGenerating ? "Carregando..." : "Data inicial"} 
                allowTyping={true}
              />
              <DatePicker 
                date={endDate} 
                onSelect={setEndDate} 
                placeholder={isGenerating ? "Carregando..." : "Data final"} 
                allowTyping={true}
              />
            </div>
          </div>
        </div>
        <Button 
          onClick={onGenerateReport} 
          disabled={isGenerating || reportLoading || !selectedClient || !startDate || !endDate}
        >
          {isGenerating ? "Gerando..." : "Gerar Relatório"}
        </Button>
      </CardContent>
    </Card>
  );
}
