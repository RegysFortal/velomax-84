
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileDown, FileUp } from 'lucide-react';

interface ReportActionsProps {
  onExportPDF: () => void;
  onExportExcel: () => void;
}

export function ReportActions({ onExportPDF, onExportExcel }: ReportActionsProps) {
  return (
    <div className="flex space-x-2">
      <Button variant="outline" onClick={onExportPDF}>
        <FileDown className="mr-2 h-4 w-4" />
        Exportar PDF
      </Button>
      <Button variant="outline" onClick={onExportExcel}>
        <FileUp className="mr-2 h-4 w-4" />
        Exportar Excel
      </Button>
    </div>
  );
}
