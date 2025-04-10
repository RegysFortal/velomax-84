import React from 'react';
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
import { useToast } from '@/components/ui/use-toast';

// For type safety, we're using the same form schema here
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

  const handleUpdateClient = async (formData: z.infer<typeof clientFormSchema>) => {
    if (client) {
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
      
      // Show a success toast but don't close the dialog
      toast({
        title: "Cliente atualizado",
        description: "Os dados do cliente foram atualizados com sucesso."
      });
      // Don't close the dialog here, let the parent component handle it if needed
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
              />
            </div>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
}
