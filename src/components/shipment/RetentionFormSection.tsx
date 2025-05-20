
import React from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/date-picker";

interface RetentionFormSectionProps {
  actionNumber: string;
  setActionNumber: (action: string) => void;
  retentionReason: string;
  setRetentionReason: (reason: string) => void;
  retentionAmount: string;
  setRetentionAmount: (amount: string) => void;
  paymentDate: string;
  setPaymentDate: (date: string) => void;
  releaseDate: string;
  setReleaseDate: (date: string) => void;
  fiscalNotes: string;
  setFiscalNotes: (notes: string) => void;
  disabled?: boolean;
}

export function RetentionFormSection({
  actionNumber,
  setActionNumber,
  retentionReason,
  setRetentionReason,
  retentionAmount,
  setRetentionAmount,
  paymentDate,
  setPaymentDate,
  releaseDate,
  setReleaseDate,
  fiscalNotes,
  setFiscalNotes,
  disabled = false
}: RetentionFormSectionProps) {
  // Improved handler for amount change with better decimal support
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    
    // Remove any character that is not a digit or a comma
    value = value.replace(/[^\d,]/g, '');
    
    // Ensure there's only one comma
    const parts = value.split(',');
    if (parts.length > 2) {
      value = parts[0] + ',' + parts.slice(1).join('');
    }
    
    // Limit decimal places to 2
    if (parts.length === 2 && parts[1].length > 2) {
      value = parts[0] + ',' + parts[1].substring(0, 2);
    }
    
    setRetentionAmount(value);
  };

  // Parse date for DatePicker
  const parseDate = (dateString: string): Date | undefined => {
    if (!dateString) return undefined;
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? undefined : date;
  };

  return (
    <div className="space-y-4 border p-4 rounded-md bg-red-50 md:col-span-2">
      <h3 className="font-medium">Detalhes da Retenção</h3>
      
      <div className="space-y-2">
        <label htmlFor="actionNumber" className="text-sm font-medium">Número da Ação Fiscal</label>
        <Input 
          id="actionNumber"
          value={actionNumber}
          onChange={(e) => setActionNumber(e.target.value)}
          placeholder="Ex: AF-12345"
          disabled={disabled}
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="retentionReason" className="text-sm font-medium">Motivo da Retenção</label>
        <Textarea 
          id="retentionReason"
          value={retentionReason}
          onChange={(e) => setRetentionReason(e.target.value)}
          placeholder="Descreva o motivo da retenção fiscal"
          required
          disabled={disabled}
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="retentionAmount" className="text-sm font-medium">Valor do Imposto</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2">R$</span>
          <Input 
            id="retentionAmount"
            type="text"
            value={retentionAmount}
            onChange={handleAmountChange}
            className="pl-8"
            placeholder="0,00"
            disabled={disabled}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="paymentDate" className="text-sm font-medium">Data de Pagamento</label>
          <DatePicker
            date={parseDate(paymentDate)}
            onSelect={(date) => setPaymentDate(date ? date.toISOString().split('T')[0] : '')}
            placeholder="Selecione a data de pagamento"
            disabled={disabled}
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="releaseDate" className="text-sm font-medium">Data de Liberação</label>
          <DatePicker
            date={parseDate(releaseDate)}
            onSelect={(date) => setReleaseDate(date ? date.toISOString().split('T')[0] : '')}
            placeholder="Selecione a data de liberação"
            disabled={disabled}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="fiscalNotes" className="text-sm font-medium">Observações</label>
        <Textarea 
          id="fiscalNotes"
          value={fiscalNotes}
          onChange={(e) => setFiscalNotes(e.target.value)}
          placeholder="Observações adicionais sobre a retenção"
          rows={3}
          disabled={disabled}
        />
      </div>
    </div>
  );
}
