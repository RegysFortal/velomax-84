
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ClientForm } from '@/components/client/ClientForm';
import { useClients } from '@/contexts/ClientsContext';
import { Client } from '@/types';
import { z } from 'zod';

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

  const handleUpdateClient = (formData: z.infer<typeof clientFormSchema>) => {
    if (client) {
      updateClient(client.id, {
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
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Editar Cliente</DialogTitle>
          <DialogDescription>
            Edite os dados do cliente.
          </DialogDescription>
        </DialogHeader>
        {client && (
          <ClientForm 
            onSubmit={handleUpdateClient}
            submitButtonLabel="Atualizar"
            initialData={client}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
