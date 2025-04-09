
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { ClientForm } from '@/components/client/ClientForm';
import { useClients } from '@/contexts/ClientsContext';
import { z } from 'zod';
import { clientFormSchema } from '@/components/client/ClientFormSchema';

export function ClientAddDialog() {
  const { addClient } = useClients();
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const handleAddClient = (formData: z.infer<typeof clientFormSchema>) => {
    addClient({
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
    
    setIsDialogOpen(false);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Cliente
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Adicionar Cliente</DialogTitle>
          <DialogDescription>
            Adicione um novo cliente à sua empresa.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
          <ClientForm 
            onSubmit={handleAddClient} 
            submitButtonLabel="Adicionar" 
            initialData={undefined}
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

