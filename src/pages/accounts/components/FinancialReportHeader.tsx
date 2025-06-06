
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { FileText, Download } from "lucide-react";

interface FinancialReportHeaderProps {
  startDate: Date;
  endDate: Date;
  onStartDateChange: (date: Date) => void;
  onEndDateChange: (date: Date) => void;
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
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Relatórios Financeiros</h1>
        <p className="text-muted-foreground">
          Análise completa das receitas e despesas do período.
        </p>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm">De:</span>
          <DatePicker
            date={startDate}
            onSelect={onStartDateChange}
            placeholder="Data inicial"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm">Até:</span>
          <DatePicker
            date={endDate}
            onSelect={onEndDateChange}
            placeholder="Data final"
          />
        </div>
        
        <Button onClick={generatePDF} variant="outline">
          <FileText className="mr-2 h-4 w-4" />
          PDF
        </Button>
        
        <Button onClick={exportToExcel} variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Excel
        </Button>
      </div>
    </div>
  );
}
