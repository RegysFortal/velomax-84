
import React from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/date-picker";

interface RetentionFormSectionProps {
  retentionReason: string;
  setRetentionReason: (reason: string) => void;
  retentionAmount: string;
  setRetentionAmount: (amount: string) => void;
  paymentDate: string;
  setPaymentDate: (date: string) => void;
}

export function RetentionFormSection({
  retentionReason,
  setRetentionReason,
  retentionAmount,
  setRetentionAmount,
  paymentDate,
  setPaymentDate
}: RetentionFormSectionProps) {
  return (
    <div className="space-y-4 border p-4 rounded-md bg-red-50 md:col-span-2">
      <h3 className="font-medium">Detalhes da Retenção</h3>
      
      <div className="space-y-2">
        <label htmlFor="retentionReason" className="text-sm font-medium">Motivo da Retenção</label>
        <Textarea 
          id="retentionReason"
          value={retentionReason}
          onChange={(e) => setRetentionReason(e.target.value)}
          placeholder="Descreva o motivo da retenção fiscal"
          required
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="retentionAmount" className="text-sm font-medium">Valor do Imposto</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2">R$</span>
          <Input 
            id="retentionAmount"
            type="number"
            min="0"
            step="0.01"
            value={retentionAmount}
            onChange={(e) => setRetentionAmount(e.target.value)}
            className="pl-8"
            placeholder="0,00"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="paymentDate" className="text-sm font-medium">Data de Pagamento</label>
        <DatePicker
          date={paymentDate ? new Date(paymentDate) : undefined}
          onSelect={(date) => setPaymentDate(date ? date.toISOString().split('T')[0] : '')}
          placeholder="Selecione a data de pagamento"
        />
      </div>
    </div>
  );
}
