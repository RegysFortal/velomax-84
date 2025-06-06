
import React from 'react';
import { AlertTriangle, Hash, FileText, DollarSign, Calendar } from "lucide-react";
import { Document } from "@/types/shipment";

interface RetentionInfoProps {
  document: Document;
  shouldShowPriorityBackground: boolean;
}

export function RetentionInfo({ document, shouldShowPriorityBackground }: RetentionInfoProps) {
  // Verificar se documento está retido e tem informações de retenção
  const isRetained = document.isRetained || 
                    (document.notes && typeof document.notes === 'string' && 
                     document.notes.includes('reason'));
  
  if (!isRetained) return null;

  // Tentar extrair informações de retenção do campo notes
  let retentionInfo = null;
  if (document.notes && typeof document.notes === 'string') {
    try {
      // Se for um JSON válido, fazer parse
      if (document.notes.startsWith('{') && document.notes.endsWith('}')) {
        retentionInfo = JSON.parse(document.notes);
      } else {
        // Se não for JSON, assumir que é texto simples
        return null;
      }
    } catch (e) {
      // Se não conseguir fazer parse, retentionInfo permanece null
      console.warn('Could not parse retention info from notes:', document.notes);
      return null;
    }
  }

  // Se não há informações de retenção válidas, não mostrar
  if (!retentionInfo || !retentionInfo.reason) return null;

  // Formatação do valor da retenção
  const formatCurrency = (value?: string | null) => {
    if (!value) return "R$ 0,00";
    
    // Se já tem vírgula, formatar como está
    if (value.includes(',')) {
      return `R$ ${value}`;
    }
    
    // Se é um string numérico ou número, converter para float e formatar
    const numValue = parseFloat(value.replace(',', '.'));
    if (isNaN(numValue)) return "R$ 0,00";
    
    // Formatar com vírgula como separador decimal
    return `R$ ${numValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Formatação de data
  const formatDate = (date?: string | null) => {
    if (!date) return null;
    
    try {
      const dateObj = new Date(date);
      return dateObj.toLocaleDateString('pt-BR');
    } catch (e) {
      return date; // Retorna a string original se não conseguir formatar
    }
  };

  return (
    <div className={`mt-3 border-t ${shouldShowPriorityBackground ? 'border-red-300' : 'border-amber-200'} pt-3`}>
      <div className={`${shouldShowPriorityBackground ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'} border rounded-lg p-4`}>
        <div className={`flex items-center ${shouldShowPriorityBackground ? 'text-red-800' : 'text-amber-800'} font-semibold mb-3 text-sm`}>
          <AlertTriangle className={`h-4 w-4 mr-2 ${shouldShowPriorityBackground ? 'text-red-600' : 'text-amber-600'}`} />
          Informações da Retenção Fiscal
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {retentionInfo.actionNumber && (
            <div className={`${shouldShowPriorityBackground ? 'text-red-700' : 'text-amber-700'}`}>
              <div className="flex items-center font-medium text-xs mb-1">
                <Hash className="h-3 w-3 mr-1" />
                Número da Ação:
              </div>
              <div className="text-sm font-semibold pl-4">{retentionInfo.actionNumber}</div>
            </div>
          )}
          
          {retentionInfo.reason && (
            <div className={`${shouldShowPriorityBackground ? 'text-red-700' : 'text-amber-700'}`}>
              <div className="flex items-center font-medium text-xs mb-1">
                <FileText className="h-3 w-3 mr-1" />
                Motivo da Retenção:
              </div>
              <div className="text-sm font-semibold pl-4">{retentionInfo.reason}</div>
            </div>
          )}
          
          {retentionInfo.amount && (
            <div className={`${shouldShowPriorityBackground ? 'text-red-700' : 'text-amber-700'}`}>
              <div className="flex items-center font-medium text-xs mb-1">
                <DollarSign className="h-3 w-3 mr-1" />
                Valor da Retenção:
              </div>
              <div className="text-sm font-semibold pl-4">{formatCurrency(retentionInfo.amount)}</div>
            </div>
          )}
          
          {retentionInfo.paymentDate && (
            <div className={`${shouldShowPriorityBackground ? 'text-red-700' : 'text-amber-700'}`}>
              <div className="flex items-center font-medium text-xs mb-1">
                <Calendar className="h-3 w-3 mr-1" />
                Data de Pagamento:
              </div>
              <div className="text-sm font-semibold pl-4">{formatDate(retentionInfo.paymentDate)}</div>
            </div>
          )}
          
          {retentionInfo.releaseDate && (
            <div className={`${shouldShowPriorityBackground ? 'text-red-700' : 'text-amber-700'}`}>
              <div className="flex items-center font-medium text-xs mb-1">
                <Calendar className="h-3 w-3 mr-1" />
                Data de Liberação:
              </div>
              <div className="text-sm font-semibold pl-4">{formatDate(retentionInfo.releaseDate)}</div>
            </div>
          )}
        </div>
        
        {retentionInfo.notes && (
          <div className={`mt-3 pt-3 border-t ${shouldShowPriorityBackground ? 'border-red-200 text-red-700' : 'border-amber-200 text-amber-700'}`}>
            <div className="font-medium text-xs mb-1">Observações:</div>
            <div className="text-sm pl-4">{retentionInfo.notes}</div>
          </div>
        )}
      </div>
    </div>
  );
}
