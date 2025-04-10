
import React from 'react';
import { Delivery } from '@/types';
import { Button } from '@/components/ui/button';
import { PlusCircle, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
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

  const handleCancel = () => {
    onComplete();
    setIsOpen(false);
    
    // Reset editing state with a small delay
    setTimeout(() => {
      setEditingDelivery(null);
    }, 10);
  };

  const handleFormComplete = () => {
    handleCancel();
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      handleCancel();
    } else {
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
            handleCancel();
          }}
        >
          <DialogHeader>
            <DialogTitle>
              {editingDelivery ? 'Editar Entrega' : 'Nova Entrega'}
            </DialogTitle>
            <DialogClose asChild>
              <Button 
                type="button" 
                variant="ghost" 
                size="icon" 
                className="absolute right-4 top-4"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Fechar</span>
              </Button>
            </DialogClose>
          </DialogHeader>
          <ScrollArea className="max-h-[calc(90vh-130px)]">
            <div className="pr-4">
              <DeliveryForm 
                delivery={editingDelivery} 
                onComplete={handleFormComplete}
                onCancel={handleCancel}
              />
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
}
