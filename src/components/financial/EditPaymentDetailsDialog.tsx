
import React, { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  Dialog, 
  DialogContent, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { DatePicker } from '@/components/ui/date-picker';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FinancialReport } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface EditPaymentDetailsDialogProps {
  report: FinancialReport;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (reportId: string, paymentMethod: string | null, dueDate: string | null) => Promise<void>;
}

export function EditPaymentDetailsDialog({ 
  report, 
  open, 
  onOpenChange, 
  onSave 
}: EditPaymentDetailsDialogProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string | null>(report.paymentMethod || null);
  const [dueDate, setDueDate] = useState<Date | undefined>(
    report.dueDate ? new Date(report.dueDate) : undefined
  );
  const [removeDueDate, setRemoveDueDate] = useState(false);
  const [removePaymentMethod, setRemovePaymentMethod] = useState(false);
  
  const handleSave = async () => {
    setLoading(true);
    try {
      // Calculate the actual values to save based on removal flags
      const methodToSave = removePaymentMethod ? null : paymentMethod;
      const dateToSave = removeDueDate ? null : (dueDate ? dueDate.toISOString().split('T')[0] : null);
      
      await onSave(report.id, methodToSave, dateToSave);
      onOpenChange(false);
      
      toast({
        title: "Sucesso",
        description: "Detalhes de pagamento atualizados com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao salvar detalhes de pagamento:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar os detalhes de pagamento",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Função para manipular alterações no método de pagamento
  const handlePaymentMethodChange = (value: string) => {
    console.log("Payment method selected:", value);
    setPaymentMethod(value);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Detalhes de Pagamento</DialogTitle>
          <DialogDescription>
            Atualize o método de pagamento e a data de vencimento para este relatório.
            Estas informações serão atualizadas nas contas a receber.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right" htmlFor="payment-method">
              Método de Pagamento
            </Label>
            <div className="col-span-3 space-y-2">
              <Select 
                value={paymentMethod || ""}
                onValueChange={handlePaymentMethodChange}
                disabled={removePaymentMethod}
              >
                <SelectTrigger id="payment-method" className="w-full">
                  <SelectValue placeholder="Escolha o método de pagamento" />
                </SelectTrigger>
                <SelectContent position="popper" className="w-full bg-background z-50">
                  <SelectItem value="boleto">Boleto</SelectItem>
                  <SelectItem value="pix">PIX</SelectItem>
                  <SelectItem value="cartao">Cartão</SelectItem>
                  <SelectItem value="especie">Espécie</SelectItem>
                  <SelectItem value="transferencia">Transferência</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="remove-payment-method"
                  checked={removePaymentMethod}
                  onChange={(e) => setRemovePaymentMethod(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="remove-payment-method" className="text-sm text-gray-500">
                  Remover método de pagamento
                </label>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right" htmlFor="due-date">
              Data de Vencimento
            </Label>
            <div className="col-span-3 space-y-2">
              <DatePicker 
                date={dueDate}
                onSelect={setDueDate}
                disabled={removeDueDate}
                placeholder="Selecione a data"
              />
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="remove-due-date"
                  checked={removeDueDate}
                  onChange={(e) => setRemoveDueDate(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="remove-due-date" className="text-sm text-gray-500">
                  Remover data de vencimento
                </label>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button type="button" onClick={handleSave} disabled={loading}>
            {loading ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
