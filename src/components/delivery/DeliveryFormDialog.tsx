
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DeliveryForm } from './DeliveryForm';
import { DuplicateDeliveryAlert } from './DuplicateDeliveryAlert';
import { useDeliveriesCRUD } from '@/hooks/useDeliveriesCRUD';
import { useDeliveryFormSubmit } from './hooks/useDeliveryFormSubmit';
import { DeliveryFormData, Delivery } from '@/types';

interface DeliveryFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  deliveries: Delivery[];
  setDeliveries: React.Dispatch<React.SetStateAction<Delivery[]>>;
  editingDelivery?: Delivery | null;
  setEditingDelivery?: (delivery: Delivery | null) => void;
  onComplete?: () => void;
}

export function DeliveryFormDialog({
  open,
  onOpenChange,
  deliveries,
  setDeliveries,
  editingDelivery = null,
  setEditingDelivery = () => {},
  onComplete = () => {}
}: DeliveryFormDialogProps) {
  // Add the form submission hook with duplicate checking
  const { addDelivery } = useDeliveriesCRUD(deliveries, setDeliveries);
  
  const [currentFormData, setCurrentFormData] = useState<DeliveryFormData | null>(null);
  const [showDuplicateAlert, setShowDuplicateAlert] = useState(false);
  
  const {
    submitting,
    handleSubmit,
    duplicateMinuteNumber,
    handleConfirmDuplicate
  } = useDeliveryFormSubmit({
    deliveries,
    addDelivery,
    onSuccess: () => {
      onComplete();
      onOpenChange(false);
    },
    isEditMode: !!editingDelivery,
    delivery: editingDelivery,
    setFormData: setCurrentFormData,
    setShowDuplicateAlert
  });
  
  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {editingDelivery ? 'Editar Entrega' : 'Nova Entrega'}
            </DialogTitle>
          </DialogHeader>
          
          <DeliveryForm 
            delivery={editingDelivery}
            onComplete={() => {
              onComplete();
              onOpenChange(false);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Add the duplicate alert */}
      <DuplicateDeliveryAlert
        open={showDuplicateAlert}
        onOpenChange={setShowDuplicateAlert}
        minuteNumber={duplicateMinuteNumber}
        onConfirm={() => {
          if (currentFormData) {
            handleConfirmDuplicate(currentFormData);
          }
        }}
      />
    </>
  );
}
