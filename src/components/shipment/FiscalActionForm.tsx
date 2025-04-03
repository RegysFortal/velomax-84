
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useShipments } from "@/contexts/ShipmentsContext";
import { FiscalAction } from "@/types/shipment";
import { format } from 'date-fns';
import { toast } from "sonner";

interface FiscalActionFormProps {
  shipmentId: string;
  fiscalAction?: FiscalAction;
  open: boolean;
  onClose: () => void;
}

export function FiscalActionForm({ shipmentId, fiscalAction, open, onClose }: FiscalActionFormProps) {
  const { updateFiscalAction, clearFiscalAction } = useShipments();
  
  // Form state
  const [reason, setReason] = useState(fiscalAction?.reason || "");
  const [amountToPay, setAmountToPay] = useState(fiscalAction?.amountToPay?.toString() || "");
  const [paymentDate, setPaymentDate] = useState(
    fiscalAction?.paymentDate
      ? format(new Date(fiscalAction.paymentDate), 'yyyy-MM-dd')
      : ""
  );
  const [releaseDate, setReleaseDate] = useState(
    fiscalAction?.releaseDate
      ? format(new Date(fiscalAction.releaseDate), 'yyyy-MM-dd')
      : ""
  );
  
  useEffect(() => {
    if (fiscalAction) {
      setReason(fiscalAction.reason || "");
      setAmountToPay(fiscalAction.amountToPay?.toString() || "");
      
      if (fiscalAction.paymentDate) {
        setPaymentDate(format(new Date(fiscalAction.paymentDate), 'yyyy-MM-dd'));
      }
      
      if (fiscalAction.releaseDate) {
        setReleaseDate(format(new Date(fiscalAction.releaseDate), 'yyyy-MM-dd'));
      }
    }
  }, [fiscalAction]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validate form
      if (!reason.trim()) {
        toast.error("O motivo da ação fiscal é obrigatório");
        return;
      }
      
      const amount = amountToPay ? parseFloat(amountToPay) : 0;
      
      // Ensure all required fields are present
      const data = {
        reason: reason.trim(),  // Required
        amountToPay: amount,    // Required
        paymentDate: paymentDate || undefined,
        releaseDate: releaseDate || undefined,
      };
      
      await updateFiscalAction(shipmentId, data);
      toast.success("Ação fiscal atualizada com sucesso");
      onClose();
    } catch (error) {
      toast.error("Erro ao salvar ação fiscal");
      console.error(error);
    }
  };
  
  const handleClear = async () => {
    try {
      await clearFiscalAction(shipmentId);
      toast.success("Ação fiscal removida com sucesso");
      onClose();
    } catch (error) {
      toast.error("Erro ao remover ação fiscal");
      console.error(error);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{fiscalAction ? "Editar Ação Fiscal" : "Registrar Ação Fiscal"}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="reason" className="text-sm font-medium">Motivo da Retenção</label>
              <Textarea 
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Descreva o motivo da retenção"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="amountToPay" className="text-sm font-medium">Valor a Pagar</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2">R$</span>
                <Input 
                  id="amountToPay"
                  type="number"
                  min="0"
                  step="0.01"
                  value={amountToPay}
                  onChange={(e) => setAmountToPay(e.target.value)}
                  className="pl-8"
                  placeholder="0,00"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="paymentDate" className="text-sm font-medium">Data de Pagamento</label>
                <Input 
                  id="paymentDate"
                  type="date"
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="releaseDate" className="text-sm font-medium">Data de Liberação</label>
                <Input 
                  id="releaseDate"
                  type="date"
                  value={releaseDate}
                  onChange={(e) => setReleaseDate(e.target.value)}
                />
              </div>
            </div>
          </div>
          
          <DialogFooter className="flex justify-end space-x-2">
            {fiscalAction && (
              <Button 
                type="button" 
                variant="destructive" 
                onClick={handleClear}
              >
                Remover Ação Fiscal
              </Button>
            )}
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {fiscalAction ? "Atualizar" : "Registrar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
