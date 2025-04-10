
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

  const handleCloseDialog = () => {
    // Certifique-se de que o estado é atualizado corretamente
    setIsOpen(false);
    setTimeout(() => {
      setEditingDelivery(null);
    }, 100);
    onComplete();
  };

  // Este evento será passado para o DeliveryForm quando o formulário for concluído
  const handleFormComplete = () => {
    onComplete();
    // Feche o diálogo após completar
    handleCloseDialog();
  };

  // Manipule o evento onOpenChange de forma mais segura
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      // Se fechando o diálogo
      handleCloseDialog();
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
      
      {/* Usamos o prop open para controle explícito do estado do diálogo */}
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh]" onInteractOutside={(e) => e.preventDefault()}>
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
