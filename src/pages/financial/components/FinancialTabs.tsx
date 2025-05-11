
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OpenReportsTable } from '@/components/financial/OpenReportsTable';
import { ClosedReportsTable } from '@/components/financial/ClosedReportsTable';
import { FinancialReport } from '@/types';

interface FinancialTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  openReports: FinancialReport[];
  closedReports: FinancialReport[];
  isLoading: boolean;
  formatCurrency: (value: number) => string;
  onViewReport: (reportId: string) => void;
  onCloseReport: (report: FinancialReport) => void;
  onReopenReport: (reportId: string) => void;
  onDeleteReport: (reportId: string) => void;
  onEditPaymentDetails: (report: FinancialReport) => void;
  onExportPDF: (report: FinancialReport) => void;
  onExportExcel: (report: FinancialReport) => void;
  getPaymentMethodLabel: (method?: string) => string;
}

export function FinancialTabs({
  activeTab,
  onTabChange,
  openReports,
  closedReports,
  isLoading,
  formatCurrency,
  onViewReport,
  onCloseReport,
  onReopenReport,
  onDeleteReport,
  onEditPaymentDetails,
  onExportPDF,
  onExportExcel,
  getPaymentMethodLabel
}: FinancialTabsProps) {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="open">Relatórios a Fechar</TabsTrigger>
        <TabsTrigger value="closed">Relatórios Fechados</TabsTrigger>
      </TabsList>
      
      <TabsContent value="open" className="space-y-4">
        <OpenReportsTable 
          reports={openReports}
          isLoading={isLoading}
          formatCurrency={formatCurrency}
          onViewReport={onViewReport}
          onCloseReport={onCloseReport}
          onDeleteReport={onDeleteReport}
        />
      </TabsContent>
      
      <TabsContent value="closed" className="space-y-4">
        <ClosedReportsTable 
          reports={closedReports}
          isLoading={isLoading}
          formatCurrency={formatCurrency}
          onViewReport={onViewReport}
          onReopenReport={onReopenReport}
          onExportPDF={onExportPDF}
          onExportExcel={onExportExcel}
          onDeleteReport={onDeleteReport}
          onEditPaymentDetails={onEditPaymentDetails}
          getPaymentMethodLabel={getPaymentMethodLabel}
        />
      </TabsContent>
    </Tabs>
  );
}
