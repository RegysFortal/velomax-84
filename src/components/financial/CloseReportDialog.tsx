
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

interface CloseReportDialogProps {
  report: FinancialReport;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: (reportId: string, paymentMethod: string, dueDate: string) => Promise<void>;
}

export function CloseReportDialog({ report, open, onOpenChange, onClose }: CloseReportDialogProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string>('boleto');
  const [dueDate, setDueDate] = useState<Date | undefined>(
    // Define a data de vencimento para 7 dias após a data atual
    new Date(new Date().setDate(new Date().getDate() + 7))
  );
  
  const handleClose = async () => {
    if (!dueDate) {
      toast({
        title: "Data de vencimento é obrigatória",
        description: "Por favor, selecione uma data de vencimento",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    try {
      const formattedDate = dueDate.toISOString().split('T')[0];
      await onClose(report.id, paymentMethod, formattedDate);
      onOpenChange(false);
    } catch (error) {
      console.error("Erro ao fechar relatório:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao fechar o relatório",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Fechar Relatório</DialogTitle>
          <DialogDescription>
            Defina o método de pagamento e a data de vencimento para este relatório.
            Estas informações serão enviadas automaticamente para as contas a receber.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right" htmlFor="payment-method">
              Método de Pagamento
            </Label>
            <Select 
              value={paymentMethod} 
              onValueChange={setPaymentMethod}
            >
              <SelectTrigger id="payment-method" className="col-span-3">
                <SelectValue placeholder="Escolha o método de pagamento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="boleto">Boleto</SelectItem>
                <SelectItem value="pix">PIX</SelectItem>
                <SelectItem value="cartao">Cartão</SelectItem>
                <SelectItem value="especie">Espécie</SelectItem>
                <SelectItem value="transferencia">Transferência</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right" htmlFor="due-date">
              Data de Vencimento
            </Label>
            <div className="col-span-3">
              <DatePicker 
                date={dueDate}
                onSelect={setDueDate}
                placeholder="Selecione a data"
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button type="button" onClick={handleClose} disabled={loading}>
            {loading ? "Processando..." : "Fechar Relatório"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
