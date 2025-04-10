
import React, { useState } from 'react';
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
import { useClients } from '@/contexts';
import { z } from 'zod';
import { clientFormSchema } from '@/components/client/ClientFormSchema';
import { useToast } from '@/hooks/use-toast';

export function ClientAddDialog() {
  const { addClient } = useClients();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddClient = async (formData: z.infer<typeof clientFormSchema>) => {
    try {
      setIsSubmitting(true);
      console.log("Adding client with data:", formData);
      console.log("Price table ID from form:", formData.priceTableId);
      
      await addClient({
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
        title: "Cliente adicionado",
        description: "Cliente adicionado com sucesso!",
      });
      
      // Fechar o diálogo após um breve delay para permitir que a animação ocorra
      setTimeout(() => {
        setIsDialogOpen(false);
      }, 300);
    } catch (error) {
      console.error("Error adding client:", error);
      toast({
        title: "Erro ao adicionar cliente",
        description: "Ocorreu um erro ao adicionar o cliente. Verifique os dados e tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Previne o fechamento automático do modal durante submissão
  const handleOpenChange = (open: boolean) => {
    console.log("Dialog open state changing to:", open);
    console.log("Is currently submitting:", isSubmitting);
    
    if (!open && isSubmitting) {
      console.log("Preventing dialog from closing during submission");
      return; // Não fecha o modal se estiver submetendo
    }
    
    setIsDialogOpen(open);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Cliente
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px] max-h-[90vh]" onInteractOutside={(e) => {
        if (isSubmitting) {
          e.preventDefault();
        }
      }}>
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
            isSubmitting={isSubmitting}
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
