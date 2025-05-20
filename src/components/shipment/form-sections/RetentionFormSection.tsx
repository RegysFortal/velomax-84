
import React from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface RetentionFormSectionProps {
  retentionReason: string;
  setRetentionReason: (reason: string) => void;
  retentionAmount: string;
  setRetentionAmount: (amount: string) => void;
  paymentDate: string;
  setPaymentDate: (date: string) => void;
  actionNumber: string;
  setActionNumber: (number: string) => void;
  releaseDate: string;
  setReleaseDate: (date: string) => void;
  fiscalNotes: string;
  setFiscalNotes: (notes: string) => void;
  disabled?: boolean;
}

export function RetentionFormSection({
  retentionReason,
  setRetentionReason,
  retentionAmount,
  setRetentionAmount,
  paymentDate,
  setPaymentDate,
  actionNumber,
  setActionNumber,
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

  return (
    <div className="space-y-4 border p-4 rounded-md bg-gray-50">
      <h3 className="font-medium">Detalhes da Retenção</h3>
      
      <div className="space-y-2">
        <Label htmlFor="retentionReason">Motivo da Retenção</Label>
        <Input
          id="retentionReason"
          value={retentionReason}
          onChange={(e) => setRetentionReason(e.target.value)}
          placeholder="Motivo da retenção"
          disabled={disabled}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="retentionAmount">Valor a Pagar</Label>
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
        <div className="space-y-2">
          <Label htmlFor="actionNumber">Número da Ação</Label>
          <Input
            id="actionNumber"
            value={actionNumber}
            onChange={(e) => setActionNumber(e.target.value)}
            placeholder="Número da ação fiscal"
            disabled={disabled}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="paymentDate">Data de Pagamento</Label>
          <Input
            id="paymentDate"
            type="date"
            value={paymentDate}
            onChange={(e) => setPaymentDate(e.target.value)}
            disabled={disabled}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="releaseDate">Data de Liberação</Label>
          <Input
            id="releaseDate"
            type="date"
            value={releaseDate}
            onChange={(e) => setReleaseDate(e.target.value)}
            disabled={disabled}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="fiscalNotes">Observações Fiscais</Label>
        <Textarea
          id="fiscalNotes"
          value={fiscalNotes}
          onChange={(e) => setFiscalNotes(e.target.value)}
          placeholder="Observações sobre a retenção"
          rows={3}
          disabled={disabled}
        />
      </div>
    </div>
  );
}
