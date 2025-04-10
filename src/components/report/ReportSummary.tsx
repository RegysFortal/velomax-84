
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FinancialReport } from '@/types';
import { useClients } from '@/contexts';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ReportSummaryProps {
  report: FinancialReport;
}

export function ReportSummary({ report }: ReportSummaryProps) {
  const { clients } = useClients();
  const client = clients.find(c => c.id === report.clientId);
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };
  
  const startDate = new Date(report.startDate);
  const endDate = new Date(report.endDate);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumo do Relatório</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <div>
            <h3 className="text-sm font-medium">Cliente</h3>
            <p className="text-lg">{client?.name || 'Cliente não encontrado'}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium">Período</h3>
            <p className="text-lg">
              {format(startDate, 'dd/MM/yyyy', { locale: ptBR })} até {format(endDate, 'dd/MM/yyyy', { locale: ptBR })}
            </p>
          </div>
        </div>
        <div className="space-y-3">
          <div>
            <h3 className="text-sm font-medium">Total de Entregas</h3>
            <p className="text-lg">{report.totalDeliveries}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium">Valor Total</h3>
            <p className="text-lg font-semibold">{formatCurrency(report.totalFreight)}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium">Status</h3>
            <p className="text-lg capitalize">{report.status === 'open' ? 'Em aberto' : 'Fechado'}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
