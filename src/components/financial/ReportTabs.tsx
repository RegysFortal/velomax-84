
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from '@/components/ui/scroll-area';
import { OpenReportsTable } from '@/components/financial/OpenReportsTable';
import { ClosedReportsTable } from '@/components/financial/ClosedReportsTable';
import { ArchivedReportsTable } from '@/components/financial/ArchivedReportsTable';
import { FinancialReport } from '@/types';

interface ReportTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  openReports: FinancialReport[];
  closedReports: FinancialReport[];
  archivedReports: FinancialReport[];
  isLoading: boolean;
  formatCurrency: (value: number) => string;
  getPaymentMethodLabel: (method?: string) => string;
  onViewReport: (reportId: string) => void;
  onCloseReport: (report: FinancialReport) => void;
  onDeleteReport: (reportId: string) => void;
  onReopenReport: (reportId: string) => void;
  onArchiveReport: (reportId: string) => void;
  onReturnToClosed: (reportId: string) => void;
  onExportPDF: (report: FinancialReport) => void;
  onExportExcel: (report: FinancialReport) => void;
  onEditPaymentDetails: (report: FinancialReport) => void;
  onSendToReceivables: (report: FinancialReport) => void;
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
}

export const ReportTabs: React.FC<ReportTabsProps> = ({
  activeTab,
  setActiveTab,
  openReports,
  closedReports,
  archivedReports,
  isLoading,
  formatCurrency,
  getPaymentMethodLabel,
  onViewReport,
  onCloseReport,
  onDeleteReport,
  onReopenReport,
  onArchiveReport,
  onReturnToClosed,
  onExportPDF,
  onExportExcel,
  onEditPaymentDetails,
  onSendToReceivables,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange
}) => {
  return (
    <ScrollArea className="h-[calc(100vh-148px)] w-full">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="open">Relatórios a Fechar</TabsTrigger>
          <TabsTrigger value="closed">Relatórios Fechados</TabsTrigger>
          <TabsTrigger value="archived">Relatórios Arquivados</TabsTrigger>
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
            onSendToReceivables={onSendToReceivables}
            onArchiveReport={onArchiveReport}
          />
        </TabsContent>

        <TabsContent value="archived" className="space-y-4">
          <ArchivedReportsTable 
            reports={archivedReports}
            isLoading={isLoading}
            formatCurrency={formatCurrency}
            onViewReport={onViewReport}
            onExportPDF={onExportPDF}
            onExportExcel={onExportExcel}
            getPaymentMethodLabel={getPaymentMethodLabel}
            onReturnToClosed={onReturnToClosed}
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={onStartDateChange}
            onEndDateChange={onEndDateChange}
          />
        </TabsContent>
      </Tabs>
    </ScrollArea>
  );
};
