
import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ClientForm } from '@/components/client/ClientForm';
import { useClients } from '@/contexts';
import { Client } from '@/types';
import { z } from 'zod';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { clientFormSchema } from '@/components/client/ClientFormSchema';

interface ClientEditDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  client: Client | null;
}

export function ClientEditDialog({
  isOpen,
  onOpenChange,
  client,
}: ClientEditDialogProps) {
  const { updateClient } = useClients();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Log para verificar quando o diálogo é aberto/fechado
  useEffect(() => {
    console.log("ClientEditDialog - isOpen:", isOpen);
    console.log("ClientEditDialog - client:", client);
  }, [isOpen, client]);

  const handleUpdateClient = async (formData: z.infer<typeof clientFormSchema>) => {
    if (!client) return;
    
    console.log("Submitting form with data:", formData);
    console.log("Price table ID from form:", formData.priceTableId);
    
    try {
      setIsSubmitting(true);
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
      
      // Mostra um toast de sucesso
      toast({
        title: "Cliente atualizado",
        description: "Os dados do cliente foram atualizados com sucesso."
      });
      
      // Explicitamente fechar o diálogo após a atualização bem-sucedida
      setTimeout(() => {
        onOpenChange(false);
      }, 300);
    } catch (error) {
      console.error("Erro ao atualizar cliente:", error);
      toast({
        title: "Erro ao atualizar cliente",
        description: "Ocorreu um erro ao atualizar os dados do cliente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Previne o fechamento automático do modal durante submissão
  const handleOpenChange = (open: boolean) => {
    if (isSubmitting && !open) {
      return; // Não fecha o modal se estiver submetendo
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[625px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Editar Cliente</DialogTitle>
          <DialogDescription>
            Edite os dados do cliente.
          </DialogDescription>
        </DialogHeader>
        {client && (
          <ScrollArea className="max-h-[calc(90vh-130px)]">
            <div className="pr-4">
              <ClientForm 
                onSubmit={handleUpdateClient}
                submitButtonLabel="Atualizar"
                initialData={client}
                isSubmitting={isSubmitting}
              />
            </div>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
}
