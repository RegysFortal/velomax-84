
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from '@/components/ui/scroll-area';
import { OpenReportsTable } from '@/components/financial/OpenReportsTable';
import { ClosedReportsTable } from '@/components/financial/ClosedReportsTable';
import { FinancialReport } from '@/types';

interface ReportTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  openReports: FinancialReport[];
  closedReports: FinancialReport[];
  isLoading: boolean;
  formatCurrency: (value: number) => string;
  getPaymentMethodLabel: (method?: string) => string;
  onViewReport: (reportId: string) => void;
  onCloseReport: (report: FinancialReport) => void;
  onDeleteReport: (reportId: string) => void;
  onReopenReport: (reportId: string) => void;
  onExportPDF: (report: FinancialReport) => void;
  onExportExcel: (report: FinancialReport) => void;
  onEditPaymentDetails: (report: FinancialReport) => void;
}

export const ReportTabs: React.FC<ReportTabsProps> = ({
  activeTab,
  setActiveTab,
  openReports,
  closedReports,
  isLoading,
  formatCurrency,
  getPaymentMethodLabel,
  onViewReport,
  onCloseReport,
  onDeleteReport,
  onReopenReport,
  onExportPDF,
  onExportExcel,
  onEditPaymentDetails
}) => {
  return (
    <ScrollArea className="h-[calc(100vh-148px)] w-full">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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
    </ScrollArea>
  );
};
