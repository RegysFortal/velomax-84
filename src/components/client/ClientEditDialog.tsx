
import React, { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { ClientForm } from '@/components/client/ClientForm';
import { useClients } from '@/contexts';
import { z } from 'zod';
import { clientFormSchema } from '@/components/client/ClientFormSchema';
import { useToast } from '@/hooks/use-toast';
import { Client } from '@/types';

interface ClientEditDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  client: Client | null;
}

export function ClientEditDialog({ isOpen, onOpenChange, client }: ClientEditDialogProps) {
  const { updateClient } = useClients();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUpdateClient = async (formData: z.infer<typeof clientFormSchema>) => {
    if (!client) return;
    
    try {
      setIsSubmitting(true);
      console.log("Updating client with data:", formData);
      
      await updateClient(client.id, {
        name: formData.name,
        tradingName: formData.tradingName,
        document: formData.document || '',
        address: formData.address || '',
        street: formData.street,
        number: formData.number,
        complement: formData.complement,
        neighborhood: formData.neighborhood,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        contact: formData.contact,
        phone: formData.phone,
        email: formData.email,
        notes: formData.notes || '',
        priceTableId: formData.priceTableId,
      });
      
      toast({
        title: "Cliente atualizado",
        description: "Cliente atualizado com sucesso!",
      });
      
      // Close dialog safely
      handleDialogClose();
    } catch (error) {
      console.error("Error updating client:", error);
      toast({
        title: "Erro ao atualizar cliente",
        description: "Ocorreu um erro ao atualizar o cliente. Verifique os dados e tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Safe function to close dialog
  const handleDialogClose = () => {
    // First reset submission state
    setIsSubmitting(false);
    
    // Close dialog with small delay
    setTimeout(() => {
      onOpenChange(false);
    }, 100); // Slight delay for better reliability
  };
  
  // Prevent auto-closing during submission
  const handleOpenChangeInternal = useCallback((open: boolean) => {
    if (!open && isSubmitting) {
      return; // Don't close while submitting
    }
    
    if (!open) {
      handleDialogClose();
    } else {
      onOpenChange(true);
    }
  }, [isSubmitting, onOpenChange]);

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChangeInternal}>
      <DialogContent 
        className="sm:max-w-[625px] max-h-[90vh]"
        onInteractOutside={(e) => {
          if (isSubmitting) {
            e.preventDefault(); // Prevent closing when clicking outside during submission
          }
        }}
      >
        <DialogHeader>
          <DialogTitle>Editar Cliente</DialogTitle>
          <DialogDescription>
            Edite as informações do cliente.
          </DialogDescription>
          <DialogClose asChild>
            <Button 
              type="button" 
              variant="ghost" 
              size="icon" 
              className="absolute right-4 top-4"
              onClick={handleDialogClose}
              disabled={isSubmitting}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Fechar</span>
            </Button>
          </DialogClose>
        </DialogHeader>
        
        <ScrollArea className="h-[60vh] pr-4">
          {client && (
            <ClientForm 
              onSubmit={handleUpdateClient} 
              submitButtonLabel="Atualizar" 
              initialData={client}
              isSubmitting={isSubmitting}
              onCancel={handleDialogClose}
            />
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
