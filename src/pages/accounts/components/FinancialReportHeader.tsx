
import React from 'react';
import { Button } from '@/components/ui/button';
import { DateRangeFilter } from '@/components/dashboard/DateRangeFilter';
import { FileText } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { toLocalDate } from '@/utils/dateUtils';

interface FinancialReportHeaderProps {
  startDate: string;
  endDate: string;
  onDateRangeChange: (range: DateRange) => void;
  generatePDF: () => void;
  exportToExcel: () => void;
}

export function FinancialReportHeader({
  startDate,
  endDate,
  onDateRangeChange,
  generatePDF,
  exportToExcel
}: FinancialReportHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Relatórios Financeiros</h1>
        <p className="text-muted-foreground">
          Análise de receitas e despesas
        </p>
      </div>
      <div className="flex gap-4">
        <DateRangeFilter
          dateRange={{
            from: toLocalDate(new Date(startDate)),
            to: toLocalDate(new Date(endDate))
          }}
          onDateRangeChange={onDateRangeChange}
        />
        <div className="flex space-x-2">
          <Button variant="outline" onClick={generatePDF}>
            <FileText className="mr-2 h-4 w-4" />
            Exportar PDF
          </Button>
          <Button variant="outline" onClick={exportToExcel}>
            <FileText className="mr-2 h-4 w-4" />
            Exportar Excel
          </Button>
        </div>
      </div>
    </div>
  );
}
