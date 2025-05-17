
import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReportFilters } from './ReportFilters';

interface DetailedReportTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  startDate: string;
  endDate: string;
}

export function DetailedReportTabs({
  activeTab,
  setActiveTab,
  startDate,
  endDate
}: DetailedReportTabsProps) {
  return (
    <TabsContent value="expenses" className="space-y-6">
      <ReportFilters />
      {/* Expense reports and tables would go here */}
      <Card>
        <CardHeader>
          <CardTitle>Relatório Detalhado de Despesas</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground pb-4">
            Filtro aplicado: {format(new Date(startDate), 'dd/MM/yyyy', { locale: ptBR })} até {format(new Date(endDate), 'dd/MM/yyyy', { locale: ptBR })}
          </p>
          
          {/* Table would go here */}
          <div className="border rounded-md">
            <p className="p-4 text-center text-muted-foreground">
              Dados de despesas detalhados seriam exibidos aqui
            </p>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
