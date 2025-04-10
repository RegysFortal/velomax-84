
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

  // Melhorado para seguir o padrão do ClientAddDialog que funciona corretamente
  const handleCloseDialog = () => {
    // Chame onComplete antes de fechar o diálogo
    onComplete();
    
    // Primeiro feche o diálogo
    setIsOpen(false);
    
    // Depois de um curto delay, limpe o estado de edição
    setTimeout(() => {
      setEditingDelivery(null);
    }, 10); // Reduzido para 10ms como nos outros componentes
  };

  // Manipulador quando o formulário é concluído
  const handleFormComplete = () => {
    // Fecha o diálogo usando nossa função segura
    handleCloseDialog();
  };

  // Manipulador de mudança de estado com salvaguardas
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      // Se estiver fechando o diálogo, use nosso método seguro
      handleCloseDialog();
    } else {
      // Se estiver abrindo o diálogo, apenas defina o estado
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
