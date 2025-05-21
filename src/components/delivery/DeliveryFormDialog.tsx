import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DeliveryForm } from './DeliveryForm';
import { DuplicateDeliveryAlert } from './DuplicateDeliveryAlert';
import { useDeliveriesCRUD } from '@/hooks/useDeliveriesCRUD';
import { useDeliveryFormSubmit } from './hooks/useDeliveryFormSubmit';
import { DeliveryFormData } from '@/types/delivery';

interface DeliveryFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  deliveries: any[];
  setDeliveries: React.Dispatch<React.SetStateAction<any[]>>;
}

export function DeliveryFormDialog({
  open,
  onOpenChange,
  deliveries,
  setDeliveries
}: DeliveryFormDialogProps) {
  // Add the form submission hook with duplicate checking
  const { addDelivery } = useDeliveriesCRUD(deliveries, setDeliveries);
  
  const [currentFormData, setCurrentFormData] = useState<DeliveryFormData | null>(null);
  
  const {
    submitting,
    handleSubmit,
    showDuplicateAlert,
    setShowDuplicateAlert,
    duplicateMinuteNumber,
    handleConfirmDuplicate
  } = useDeliveryFormSubmit({
    deliveries,
    addDelivery,
    onSuccess: () => onOpenChange(false)
  });

  const handleFormSubmit = (formData: DeliveryFormData) => {
    setCurrentFormData(formData);
    handleSubmit(formData);
  };

  const confirmDuplicate = () => {
    if (currentFormData) {
      handleConfirmDuplicate(currentFormData);
    }
  };
  
  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Nova Entrega</DialogTitle>
          </DialogHeader>
          
          <DeliveryForm 
            onSubmit={handleFormSubmit}
            submitting={submitting}
          />
        </DialogContent>
      </Dialog>

      {/* Add the duplicate alert */}
      <DuplicateDeliveryAlert
        open={showDuplicateAlert}
        onOpenChange={setShowDuplicateAlert}
        minuteNumber={duplicateMinuteNumber}
        onConfirm={confirmDuplicate}
      />
    </>
  );
}
