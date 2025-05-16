
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ReportTable } from '@/components/report/ReportTable';
import { ReportSummary } from '@/components/report/ReportSummary';
import { ReportActions } from '@/components/report/ReportActions';
import { FinancialReport } from '@/types';
import { Delivery } from '@/types/delivery';

interface ReportContentProps {
  reportLoading: boolean;
  currentReport?: FinancialReport;
  reportId: string | null;
  filteredDeliveries: Delivery[];
  handleExportPDF: () => void;
  handleExportExcel: () => void;
}

export function ReportContent({
  reportLoading,
  currentReport,
  reportId,
  filteredDeliveries,
  handleExportPDF,
  handleExportExcel
}: ReportContentProps) {
  if (reportLoading) {
    return (
      <Card>
        <CardContent className="py-6">
          <Skeleton className="h-40 w-full" />
        </CardContent>
      </Card>
    );
  }
  
  if (currentReport) {
    return (
      <>
        <div className="flex justify-between items-center">
          <ReportSummary report={currentReport} />
          {currentReport.status === 'closed' && (
            <ReportActions 
              onExportPDF={handleExportPDF}
              onExportExcel={handleExportExcel}
            />
          )}
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Detalhes do Relatório</CardTitle>
          </CardHeader>
          <CardContent>
            <ReportTable deliveries={filteredDeliveries} />
          </CardContent>
        </Card>
      </>
    );
  }
  
  if (reportId) {
    return (
      <Card>
        <CardContent className="py-6 text-center">
          <p className="text-muted-foreground">Relatório não encontrado</p>
        </CardContent>
      </Card>
    );
  }
  
  return null;
}
