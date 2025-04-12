
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
  setFiscalNotes
}: RetentionFormSectionProps) {
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="paymentDate" className="text-sm font-medium">Data de Pagamento</label>
          <DatePicker
            date={paymentDate ? new Date(paymentDate) : undefined}
            onSelect={(date) => setPaymentDate(date ? date.toISOString().split('T')[0] : '')}
            placeholder="Selecione a data de pagamento"
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="releaseDate" className="text-sm font-medium">Data de Liberação</label>
          <DatePicker
            date={releaseDate ? new Date(releaseDate) : undefined}
            onSelect={(date) => setReleaseDate(date ? date.toISOString().split('T')[0] : '')}
            placeholder="Selecione a data de liberação"
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
        />
      </div>
    </div>
  );
}
