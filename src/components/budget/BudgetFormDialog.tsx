
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
import { BudgetForm } from './BudgetForm';
import { useBudgets } from '@/contexts/BudgetContext';
import { useToast } from '@/hooks/use-toast';
import { Budget } from '@/types/budget';

export function BudgetFormDialog() {
  const { addBudget } = useBudgets();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddBudget = async (formData: Budget) => {
    try {
      setIsSubmitting(true);
      console.log("Adding budget with data:", formData);
      
      await addBudget(formData);
      
      toast({
        title: "Orçamento criado",
        description: "Orçamento criado com sucesso!",
      });
      
      // Close the dialog after operation is complete
      handleCancel();
    } catch (error) {
      console.error("Error adding budget:", error);
      toast({
        title: "Erro ao criar orçamento",
        description: "Ocorreu um erro ao criar o orçamento. Verifique os dados e tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Função para lidar com o cancelamento de forma segura
  const handleCancel = () => {
    // Primeiro remova o estado de submissão se aplicável
    setIsSubmitting(false);
    
    // Em seguida, feche o diálogo com um pequeno atraso para permitir que o React atualize outros estados primeiro
    setTimeout(() => {
      setIsDialogOpen(false);
    }, 10);
  };

  // Prevent automatic closing during submission
  const handleOpenChange = (open: boolean) => {
    if (!open && isSubmitting) {
      return; // Don't close the modal during submission
    }
    
    if (!open) {
      handleCancel();
    } else {
      setIsDialogOpen(open);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Orçamento
        </Button>
      </DialogTrigger>
      <DialogContent 
        className="sm:max-w-[800px] max-h-[90vh]" 
        onInteractOutside={(e) => {
          e.preventDefault(); // Prevent closing when clicking outside
        }}
        onEscapeKeyDown={(e) => {
          if (!isSubmitting) {
            e.preventDefault();
            handleCancel();
          }
        }}
      >
        <DialogHeader>
          <DialogTitle>Criar Orçamento</DialogTitle>
          <DialogDescription>
            Preencha os dados para criar um novo orçamento.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[70vh] pr-4">
          <BudgetForm 
            onSubmit={handleAddBudget} 
            isSubmitting={isSubmitting}
            onCancel={handleCancel}
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
