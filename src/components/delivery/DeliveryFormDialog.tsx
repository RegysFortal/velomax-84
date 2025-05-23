
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DeliveryForm } from './DeliveryForm';
import { Delivery } from '@/types';

interface DeliveryFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  delivery?: Delivery;
  onComplete: () => void;
  editingDelivery?: Delivery | null;
  setEditingDelivery?: React.Dispatch<React.SetStateAction<Delivery | null>>;
  deliveries?: Delivery[];
  setDeliveries?: React.Dispatch<React.SetStateAction<Delivery[]>>;
}

export function DeliveryFormDialog({
  open,
  onOpenChange,
  delivery,
  onComplete,
  editingDelivery,
  setEditingDelivery,
  deliveries,
  setDeliveries
}: DeliveryFormDialogProps) {
  const deliveryToEdit = delivery || editingDelivery;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>
            {deliveryToEdit ? 'Editar Entrega' : 'Nova Entrega'}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(90vh-120px)] overflow-y-auto">
          <div className="p-1">
            <DeliveryForm
              delivery={deliveryToEdit}
              onComplete={onComplete}
              onCancel={() => onOpenChange(false)}
            />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
