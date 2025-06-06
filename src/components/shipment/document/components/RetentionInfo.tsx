
import React from 'react';
import { AlertTriangle, Hash, FileText, DollarSign } from "lucide-react";
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

  return (
    <div className={`mt-3 border-t ${shouldShowPriorityBackground ? 'border-red-300' : 'border-amber-200'} pt-2`}>
      <div className={`${shouldShowPriorityBackground ? 'bg-red-100' : 'bg-amber-50'} p-3 rounded text-sm`}>
        <div className={`flex items-center ${shouldShowPriorityBackground ? 'text-red-800' : 'text-amber-800'} font-medium mb-2`}>
          <AlertTriangle className={`h-4 w-4 mr-1 ${shouldShowPriorityBackground ? 'text-red-600' : 'text-amber-600'}`} />
          Retenção Fiscal
        </div>
        <div className={`space-y-2 ${shouldShowPriorityBackground ? 'text-red-700' : 'text-amber-700'}`}>
          {retentionInfo.actionNumber && (
            <div>
              <div className="flex items-center font-medium">
                <Hash className="h-3 w-3 mr-1" />
                Nº Ação:
              </div>
              <div className="ml-4">{retentionInfo.actionNumber}</div>
            </div>
          )}
          {retentionInfo.reason && (
            <div>
              <div className="flex items-center font-medium">
                <FileText className="h-3 w-3 mr-1" />
                Motivo:
              </div>
              <div className="ml-4">{retentionInfo.reason}</div>
            </div>
          )}
          {retentionInfo.amount && (
            <div>
              <div className="flex items-center font-medium">
                <DollarSign className="h-3 w-3 mr-1" />
                Valor:
              </div>
              <div className="ml-4">{formatCurrency(retentionInfo.amount)}</div>
            </div>
          )}
          {retentionInfo.paymentDate && (
            <div>
              <div className="font-medium">Data de Pagamento:</div>
              <div className="ml-4">{retentionInfo.paymentDate}</div>
            </div>
          )}
          {retentionInfo.releaseDate && (
            <div>
              <div className="font-medium">Data de Liberação:</div>
              <div className="ml-4">{retentionInfo.releaseDate}</div>
            </div>
          )}
          {retentionInfo.notes && (
            <div>
              <div className="font-medium">Observações:</div>
              <div className="ml-4">{retentionInfo.notes}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
