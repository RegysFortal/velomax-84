
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Logo } from '@/components/ui/logo';
import { ReportGenerationForm } from '@/components/report/ReportGenerationForm';
import { ReportContent } from '@/components/report/ReportContent';
import { useReportManagement } from '@/hooks/report/useReportManagement';

const Reports = () => {
  const {
    selectedClient,
    setSelectedClient,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    reportId,
    isGenerating,
    reportLoading,
    availableClients,
    clientsLoading,
    currentReport,
    filteredDeliveries,
    handleGenerateReport,
    handleExportPDF,
    handleExportExcel,
  } = useReportManagement();

  return (
    <div className="flex flex-col gap-6">
      <ScrollArea className="h-[calc(100vh-148px)] w-full">
        <div className="flex flex-col gap-6 px-8 py-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Relatórios</h1>
            <p className="text-muted-foreground">
              Gere relatórios financeiros detalhados.
            </p>
          </div>
          
          <ReportGenerationForm
            selectedClient={selectedClient}
            setSelectedClient={setSelectedClient}
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            handleGenerateReport={handleGenerateReport}
            isGenerating={isGenerating}
            reportLoading={reportLoading}
            availableClients={availableClients}
            clientsLoading={clientsLoading}
          />
          
          {/* Hidden logo for PDF generation */}
          <div className="hidden">
            <Logo className="company-logo" />
          </div>
          
          <ReportContent
            reportLoading={reportLoading}
            currentReport={currentReport}
            reportId={reportId}
            filteredDeliveries={filteredDeliveries}
            handleExportPDF={handleExportPDF}
            handleExportExcel={handleExportExcel}
          />
        </div>
      </ScrollArea>
    </div>
  );
};

export default Reports;
