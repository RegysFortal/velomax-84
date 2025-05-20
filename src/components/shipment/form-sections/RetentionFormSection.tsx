
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
  // Função auxiliar para formatar valor numérico
  const formatCurrency = (value: string) => {
    // Remover caracteres não numéricos, exceto vírgula
    let numericValue = value.replace(/[^\d,]/g, '');
    
    // Verificar se tem mais de uma vírgula
    const commaCount = (numericValue.match(/,/g) || []).length;
    if (commaCount > 1) {
      // Manter apenas a última vírgula
      const parts = numericValue.split(',');
      numericValue = parts.slice(0, -1).join('') + ',' + parts[parts.length - 1];
    }
    
    // Permitir até dois dígitos após a vírgula
    if (numericValue.includes(',')) {
      const [integerPart, decimalPart] = numericValue.split(',');
      if (decimalPart && decimalPart.length > 2) {
        return `${integerPart},${decimalPart.substring(0, 2)}`;
      }
    }
    
    return numericValue;
  };

  // Handler para alteração do valor com formatação
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatCurrency(e.target.value);
    setRetentionAmount(formattedValue);
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
          <Input
            id="retentionAmount"
            type="text"
            value={retentionAmount}
            onChange={handleAmountChange}
            placeholder="Valor em R$"
            disabled={disabled}
          />
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
