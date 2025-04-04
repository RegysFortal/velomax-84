
import { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface FiscalActionFormProps {
  onSubmit: (data: { actionNumber: string; reason: string; amountToPay: number }) => void;
  onCancel: () => void;
}

export function FiscalActionForm({ onSubmit, onCancel }: FiscalActionFormProps) {
  const [actionNumber, setActionNumber] = useState("");
  const [reason, setReason] = useState("");
  const [amountToPay, setAmountToPay] = useState<number>(0);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!actionNumber.trim()) {
      toast({
        title: "Número da ação fiscal obrigatório",
        description: "Por favor, informe o número da ação fiscal",
        variant: "destructive"
      });
      return;
    }
    
    if (!reason.trim()) {
      toast({
        title: "Motivo obrigatório",
        description: "Por favor, informe o motivo da retenção fiscal",
        variant: "destructive"
      });
      return;
    }
    
    if (amountToPay <= 0) {
      toast({
        title: "Valor inválido",
        description: "O valor a pagar deve ser maior que zero",
        variant: "destructive"
      });
      return;
    }
    
    onSubmit({
      actionNumber,
      reason,
      amountToPay
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="actionNumber">Número da Ação Fiscal</Label>
        <Input
          id="actionNumber"
          value={actionNumber}
          onChange={(e) => setActionNumber(e.target.value)}
          placeholder="Informe o número da ação fiscal"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="reason">Motivo</Label>
        <Textarea
          id="reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Informe o motivo da retenção fiscal"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="amountToPay">Valor a Pagar (R$)</Label>
        <Input
          id="amountToPay"
          type="number"
          min={0}
          step="0.01"
          value={amountToPay || ""}
          onChange={(e) => setAmountToPay(parseFloat(e.target.value) || 0)}
          required
        />
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">Criar Ação Fiscal</Button>
      </div>
    </form>
  );
}
