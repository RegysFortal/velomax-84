
import React from 'react';
import { Button } from '@/components/ui/button';
import { DateFilter } from '@/components/dashboard/DateFilter';
import { FileText } from 'lucide-react';
import { format } from 'date-fns';

interface FinancialReportHeaderProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  generatePDF: () => void;
  exportToExcel: () => void;
}

export function FinancialReportHeader({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  generatePDF,
  exportToExcel
}: FinancialReportHeaderProps) {
  // State for date filter mode
  const [dateFilter, setDateFilter] = React.useState<'day' | 'month' | 'year' | 'custom'>('month');

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Relatórios Financeiros</h1>
          <p className="text-muted-foreground">
            Análise de receitas e despesas
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={generatePDF}
          >
            <FileText className="mr-2 h-4 w-4" />
            Exportar PDF
          </Button>
          <Button 
            variant="outline" 
            onClick={exportToExcel}
          >
            <FileText className="mr-2 h-4 w-4" />
            Exportar Excel
          </Button>
        </div>
      </div>

      <div className="bg-card rounded-md border p-4">
        <DateFilter
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
          startDate={startDate}
          setStartDate={onStartDateChange}
          endDate={endDate}
          setEndDate={onEndDateChange}
        />
      </div>
    </div>
  );
}
