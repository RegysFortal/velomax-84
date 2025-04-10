
import React from 'react';
import { Delivery } from '@/types';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DeliveryForm } from './DeliveryForm';

interface DeliveryFormDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  editingDelivery: Delivery | null;
  setEditingDelivery: (delivery: Delivery | null) => void;
  onComplete: () => void;
}

export function DeliveryFormDialog({
  isOpen,
  setIsOpen,
  editingDelivery,
  setEditingDelivery,
  onComplete,
}: DeliveryFormDialogProps) {
  const handleOpenNewDelivery = () => {
    setEditingDelivery(null);
    setIsOpen(true);
  };

  // Improved close handler with proper state management
  const handleCloseDialog = () => {
    // First close the dialog
    setIsOpen(false);
    
    // After dialog animation completes, reset editing state
    setTimeout(() => {
      setEditingDelivery(null);
      // Call onComplete to notify parent component
      onComplete();
    }, 200); // Small delay to ensure dialog closes smoothly
  };

  // Form completion handler
  const handleFormComplete = () => {
    // Call onComplete and close dialog
    onComplete();
    handleCloseDialog();
  };

  // Improved open change handler with safeguards
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      // If closing the dialog, use our safe close method
      handleCloseDialog();
    } else {
      // If opening the dialog, just set the state
      setIsOpen(true);
    }
  };

  return (
    <>
      <Button onClick={handleOpenNewDelivery}>
        <PlusCircle className="mr-2 h-4 w-4" />
        Nova Entrega
      </Button>
      
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent 
          className="sm:max-w-[800px] max-h-[90vh]" 
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => {
            e.preventDefault();
            handleCloseDialog();
          }}
        >
          <DialogHeader>
            <DialogTitle>
              {editingDelivery ? 'Editar Entrega' : 'Nova Entrega'}
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[calc(90vh-130px)]">
            <div className="pr-4">
              <DeliveryForm 
                delivery={editingDelivery} 
                onComplete={handleFormComplete}
                onCancel={handleCloseDialog}
              />
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
}
