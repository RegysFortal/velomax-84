
import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import { toast } from "sonner";

interface DeliveryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  receiverName: string;
  setReceiverName: (name: string) => void;
  deliveryDate: string;
  setDeliveryDate: (date: string) => void;
  deliveryTime: string;
  setDeliveryTime: (time: string) => void;
  onConfirm: () => void;
}

export function DeliveryDialog({
  open,
  onOpenChange,
  receiverName,
  setReceiverName,
  deliveryDate,
  setDeliveryDate,
  deliveryTime,
  setDeliveryTime,
  onConfirm
}: DeliveryDialogProps) {
  // Este efeito garante que o console.log apenas será executado quando as props mudam
  useEffect(() => {
    if (open) {
      console.log('DeliveryDialog - Current values:', { 
        receiverName, 
        deliveryDate, 
        deliveryTime 
      });
    }
  }, [open, receiverName, deliveryDate, deliveryTime]);

  const handleConfirm = () => {
    if (!receiverName.trim()) {
      toast.error("Por favor, informe o nome do recebedor");
      return;
    }

    if (!deliveryDate) {
      toast.error("Por favor, selecione a data de entrega");
      return;
    }

    if (!deliveryTime.trim()) {
      toast.error("Por favor, informe o horário da entrega");
      return;
    }

    console.log('DeliveryDialog - Confirming with values:', {
      receiverName,
      deliveryDate,
      deliveryTime
    });
    
    onConfirm();
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      // Use ISO string and split to avoid timezone issues
      const formattedDate = date.toISOString().split('T')[0];
      
      console.log('DeliveryDialog - Date selected:', formattedDate);
      setDeliveryDate(formattedDate);
    } else {
      setDeliveryDate('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="z-[1001]">
        <DialogHeader>
          <DialogTitle>Detalhes da Entrega</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="receiverName">Nome do Recebedor</Label>
            <Input 
              id="receiverName" 
              value={receiverName} 
              onChange={(e) => setReceiverName(e.target.value)} 
              placeholder="Nome completo"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="deliveryDate">Data da Entrega</Label>
            <DatePicker
              date={deliveryDate ? new Date(deliveryDate) : undefined}
              onSelect={handleDateSelect}
              placeholder="Selecione a data"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="deliveryTime">Horário da Entrega</Label>
            <Input 
              id="deliveryTime" 
              type="time"
              value={deliveryTime} 
              onChange={(e) => setDeliveryTime(e.target.value)} 
              required
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={handleConfirm}>Confirmar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
