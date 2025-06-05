
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DeliveryForm } from './DeliveryForm';
import { Delivery } from '@/types';

interface DeliveryFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingDelivery: Delivery | null;
  setEditingDelivery: (delivery: Delivery | null) => void;
  onComplete: () => void;
  deliveries: Delivery[];
  setDeliveries: React.Dispatch<React.SetStateAction<Delivery[]>>;
}

export const DeliveryFormDialog: React.FC<DeliveryFormDialogProps> = ({
  open,
  onOpenChange,
  editingDelivery,
  setEditingDelivery,
  onComplete,
  deliveries,
  setDeliveries
}) => {
  const handleComplete = () => {
    onComplete();
    onOpenChange(false);
    setEditingDelivery(null);
  };

  const handleCancel = () => {
    onOpenChange(false);
    setEditingDelivery(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingDelivery ? 'Editar Entrega' : 'Nova Entrega'}
          </DialogTitle>
        </DialogHeader>
        
        <DeliveryForm
          delivery={editingDelivery}
          onComplete={handleComplete}
          onCancel={handleCancel}
        />
      </DialogContent>
    </Dialog>
  );
};
