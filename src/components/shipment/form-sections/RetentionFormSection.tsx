
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
  setFiscalNotes
}: RetentionFormSectionProps) {
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
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="retentionAmount">Valor a Pagar</Label>
          <Input
            id="retentionAmount"
            type="number"
            value={retentionAmount}
            onChange={(e) => setRetentionAmount(e.target.value)}
            placeholder="Valor em R$"
            step="0.01"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="actionNumber">Número da Ação</Label>
          <Input
            id="actionNumber"
            value={actionNumber}
            onChange={(e) => setActionNumber(e.target.value)}
            placeholder="Número da ação fiscal"
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
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="releaseDate">Data de Liberação</Label>
          <Input
            id="releaseDate"
            type="date"
            value={releaseDate}
            onChange={(e) => setReleaseDate(e.target.value)}
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
        />
      </div>
    </div>
  );
}
