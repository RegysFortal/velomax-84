
import React from 'react';
import { AlertTriangle, Hash, FileText, DollarSign } from "lucide-react";
import { Document } from "@/types/shipment";

interface RetentionInfoProps {
  document: Document;
  shouldShowPriorityBackground: boolean;
}

export function RetentionInfo({ document, shouldShowPriorityBackground }: RetentionInfoProps) {
  // Verificar se documento está retido e tem informações de retenção
  const isRetained = document.type === 'retained' || 
                    (document.notes && typeof document.notes === 'string' && 
                     document.notes.includes('reason'));
  
  if (!isRetained) return null;

  // Tentar extrair informações de retenção do campo notes
  let retentionInfo = null;
  if (document.notes && typeof document.notes === 'string') {
    try {
      retentionInfo = JSON.parse(document.notes);
    } catch (e) {
      // Se não conseguir fazer parse, retentionInfo permanece null
      console.warn('Could not parse retention info from notes:', document.notes);
    }
  }

  // Se não há informações de retenção válidas, não mostrar
  if (!retentionInfo || !retentionInfo.reason) return null;

  // Formatação do valor da retenção
  const formatCurrency = (value?: string | null) => {
    if (!value) return "R$ 0,00";
    
    // If already has comma, format as is
    if (value.includes(',')) {
      return `R$ ${value}`;
    }
    
    // If it's a numeric string or number, convert to float and format
    const numValue = parseFloat(value.replace(',', '.'));
    if (isNaN(numValue)) return "R$ 0,00";
    
    // Format with comma as decimal separator
    return `R$ ${numValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className={`mt-3 border-t ${shouldShowPriorityBackground ? 'border-red-300' : 'border-amber-200'} pt-2`}>
      <div className={`${shouldShowPriorityBackground ? 'bg-red-100' : 'bg-amber-50'} p-3 rounded text-sm`}>
        <div className={`flex items-center ${shouldShowPriorityBackground ? 'text-red-800' : 'text-amber-800'} font-medium mb-2`}>
          <AlertTriangle className={`h-4 w-4 mr-1 ${shouldShowPriorityBackground ? 'text-red-600' : 'text-amber-600'}`} />
          Retenção Fiscal
        </div>
        <div className={`grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 ${shouldShowPriorityBackground ? 'text-red-700' : 'text-amber-700'}`}>
          {retentionInfo.actionNumber && (
            <div className="flex items-center">
              <Hash className="h-3 w-3 mr-1" />
              <span className="font-medium">Nº Ação:</span> {retentionInfo.actionNumber}
            </div>
          )}
          {retentionInfo.reason && (
            <div className="flex items-center">
              <FileText className="h-3 w-3 mr-1" />
              <span className="font-medium">Motivo:</span> {retentionInfo.reason}
            </div>
          )}
          {retentionInfo.amount && (
            <div className="flex items-center">
              <DollarSign className="h-3 w-3 mr-1" />
              <span className="font-medium">Valor:</span> {formatCurrency(retentionInfo.amount)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
