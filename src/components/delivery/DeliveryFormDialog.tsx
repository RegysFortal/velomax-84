
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

  // Função segura para fechar o diálogo, seguindo o padrão de ClientAddDialog
  const handleDialogClose = () => {
    // Primeiro remova o estado de submissão
    
    // Em seguida, feche o diálogo 
    setIsOpen(false);
    
    // Após fechar o diálogo, com um pequeno atraso limpe o estado de edição
    setTimeout(() => {
      setEditingDelivery(null);
    }, 10);
  };

  // Manipulador quando o formulário é concluído
  const handleFormComplete = () => {
    // Executa o callback de conclusão
    onComplete();
    
    // Depois fecha o diálogo
    handleDialogClose();
  };

  // Manipulador de mudança de estado do diálogo
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      // Se estiver fechando o diálogo, primeiro execute o callback
      onComplete();
      // Depois use nosso método seguro para fechar
      handleDialogClose();
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
            onComplete();
            handleDialogClose();
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
                onCancel={() => {
                  onComplete();
                  handleDialogClose();
                }}
              />
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
}
