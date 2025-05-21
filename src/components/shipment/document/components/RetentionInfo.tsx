
import React from 'react';
import { AlertTriangle } from "lucide-react";
import { Document } from "@/types/shipment";

interface RetentionInfoProps {
  document: Document;
  shouldShowPriorityBackground: boolean;
}

export function RetentionInfo({ document, shouldShowPriorityBackground }: RetentionInfoProps) {
  // Formatação do valor da retenção
  const formatCurrency = (value?: string) => {
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
      <div className={`${shouldShowPriorityBackground ? 'bg-red-100' : 'bg-amber-50'} p-2 rounded text-sm`}>
        <div className={`flex items-center ${shouldShowPriorityBackground ? 'text-red-800' : 'text-amber-800'} font-medium mb-1`}>
          <AlertTriangle className={`h-4 w-4 mr-1 ${shouldShowPriorityBackground ? 'text-red-600' : 'text-amber-600'}`} />
          Retenção Fiscal
        </div>
        <div className={`grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 ${shouldShowPriorityBackground ? 'text-red-700' : 'text-amber-700'}`}>
          {document.retentionInfo?.actionNumber && (
            <div>Nº Ação: {document.retentionInfo.actionNumber}</div>
          )}
          {document.retentionInfo?.reason && (
            <div>Motivo: {document.retentionInfo.reason}</div>
          )}
          {document.retentionInfo?.amount && (
            <div>Valor: {formatCurrency(document.retentionInfo.amount)}</div>
          )}
          {document.retentionInfo?.paymentDate && (
            <div>Pgto: {document.retentionInfo.paymentDate}</div>
          )}
          {document.retentionInfo?.releaseDate && (
            <div>Liberação: {document.retentionInfo.releaseDate}</div>
          )}
          {document.retentionInfo?.notes && (
            <div className="col-span-2">Obs: {document.retentionInfo.notes}</div>
          )}
        </div>
      </div>
    </div>
  );
}
