
import React from 'react';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";

interface RetentionInfoSectionProps {
  actionNumber?: string;
  retentionReason: string;
  retentionAmount: string;
  paymentDate?: string;
  releaseDate?: string;
  fiscalNotes?: string;
  onEditClick: () => void;
}

export function RetentionInfoSection({ 
  actionNumber, 
  retentionReason, 
  retentionAmount, 
  paymentDate, 
  releaseDate, 
  fiscalNotes,
  onEditClick 
}: RetentionInfoSectionProps) {
  // Format amount for display, handling comma decimal separator
  const formatAmount = (amount: string) => {
    if (!amount) return "-";
    
    // If already has comma, format as is
    if (amount.includes(',')) {
      return `R$ ${amount}`;
    }
    
    // If it's a numeric string or number, convert to float and format
    const numValue = parseFloat(amount);
    if (isNaN(numValue)) return "-";
    
    // Format with comma as decimal separator
    return `R$ ${numValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Informações da Retenção</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onEditClick}
        >
          Editar Informações de Retenção
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Nº da Ação</p>
          <p className="font-medium">{actionNumber || "-"}</p>
        </div>
        
        <div>
          <p className="text-sm text-muted-foreground">Motivo</p>
          <p className="font-medium">{retentionReason}</p>
        </div>
        
        <div>
          <p className="text-sm text-muted-foreground">Valor a Pagar</p>
          <p className="font-medium">{formatAmount(retentionAmount)}</p>
        </div>
        
        <div>
          <p className="text-sm text-muted-foreground">Data de Pagamento</p>
          <p className="font-medium">{paymentDate || "-"}</p>
        </div>
        
        <div>
          <p className="text-sm text-muted-foreground">Data de Liberação</p>
          <p className="font-medium">{releaseDate || "-"}</p>
        </div>
        
        {fiscalNotes && (
          <div className="md:col-span-2">
            <p className="text-sm text-muted-foreground">Observações</p>
            <p className="font-medium whitespace-pre-wrap">{fiscalNotes}</p>
          </div>
        )}
      </div>
      
      <Separator />
    </div>
  );
}
