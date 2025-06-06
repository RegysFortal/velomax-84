
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/date-picker";
import { toISODateString, fromISODateString } from "@/utils/dateUtils";

interface DocumentDeliveryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  receiverName: string;
  setReceiverName: (name: string) => void;
  receiverId: string;
  setReceiverId: (id: string) => void;
  deliveryDate: string;
  setDeliveryDate: (date: string) => void;
  deliveryTime: string;
  setDeliveryTime: (time: string) => void;
  arrivalKnowledgeNumber: string;
  setArrivalKnowledgeNumber: (number: string) => void;
  notes: string;
  setNotes: (notes: string) => void;
  onConfirm: () => void;
}

export function DocumentDeliveryDialog({
  open,
  onOpenChange,
  receiverName,
  setReceiverName,
  receiverId,
  setReceiverId,
  deliveryDate,
  setDeliveryDate,
  deliveryTime,
  setDeliveryTime,
  arrivalKnowledgeNumber,
  setArrivalKnowledgeNumber,
  notes,
  setNotes,
  onConfirm
}: DocumentDeliveryDialogProps) {
  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const day = today.getDate();
    const safeDate = new Date(year, month, day, 12, 0, 0);
    return toISODateString(safeDate);
  };

  const getCurrentTime = () => {
    const now = new Date();
    return now.toTimeString().slice(0, 5);
  };

  React.useEffect(() => {
    if (open) {
      if (!deliveryDate) setDeliveryDate(getCurrentDate());
      if (!deliveryTime) setDeliveryTime(getCurrentTime());
    }
  }, [open, deliveryDate, deliveryTime, setDeliveryDate, setDeliveryTime]);

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      // Create safe date at noon to avoid timezone issues
      const year = date.getFullYear();
      const month = date.getMonth();
      const day = date.getDate();
      const safeDate = new Date(year, month, day, 12, 0, 0);
      
      const formattedDate = toISODateString(safeDate);
      console.log('DocumentDeliveryDialog - Date selected:', safeDate, 'Formatted as ISO:', formattedDate);
      setDeliveryDate(formattedDate);
    } else {
      setDeliveryDate('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Informações de Entrega</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="deliveryDate">Data de Entrega</Label>
            <DatePicker
              date={deliveryDate ? fromISODateString(deliveryDate) : undefined}
              onSelect={handleDateSelect}
              placeholder="Selecione a data"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="deliveryTime">Hora de Entrega</Label>
            <Input
              id="deliveryTime"
              type="time"
              value={deliveryTime}
              onChange={(e) => setDeliveryTime(e.target.value)}
              required
            />
          </div>
          
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
            <Label htmlFor="receiverId">Documento do Recebedor</Label>
            <Input
              id="receiverId"
              value={receiverId}
              onChange={(e) => setReceiverId(e.target.value)}
              placeholder="CPF ou RG"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="arrivalKnowledge">Número do Conhecimento de Chegada</Label>
            <Input
              id="arrivalKnowledge"
              value={arrivalKnowledgeNumber}
              onChange={(e) => setArrivalKnowledgeNumber(e.target.value)}
              placeholder="Número do conhecimento"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="deliveryNotes">Observações</Label>
            <Textarea
              id="deliveryNotes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Observações sobre a entrega"
              rows={3}
            />
          </div>
        </div>
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button 
            onClick={onConfirm}
            disabled={!deliveryDate || !deliveryTime || !receiverName}
          >
            Confirmar Entrega
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
