
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
    // Remover caracteres não numéricos, exceto ponto decimal e vírgula
    const numericValue = value.replace(/[^\d.,]/g, '');
    
    // Garantir apenas um separador decimal (ponto ou vírgula)
    const commaCount = (numericValue.match(/,/g) || []).length;
    const dotCount = (numericValue.match(/\./g) || []).length;
    
    // Se tiver mais de um separador, vamos manter apenas o último
    if (commaCount + dotCount > 1) {
      // Remover todos os separadores
      const withoutSeparators = numericValue.replace(/[.,]/g, '');
      // Recuperar o último separador e sua posição
      const lastCommaIndex = numericValue.lastIndexOf(',');
      const lastDotIndex = numericValue.lastIndexOf('.');
      const lastSeparatorIndex = Math.max(lastCommaIndex, lastDotIndex);
      const lastSeparator = numericValue[lastSeparatorIndex];
      
      // Adicionar o separador na posição correta
      if (lastSeparatorIndex >= 0) {
        const pos = lastSeparatorIndex - (numericValue.substring(0, lastSeparatorIndex).match(/[.,]/g) || []).length;
        return withoutSeparators.substring(0, pos) + lastSeparator + withoutSeparators.substring(pos);
      }
      return withoutSeparators;
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
