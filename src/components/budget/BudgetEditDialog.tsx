
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BudgetForm } from './form/BudgetForm';
import { useBudgets } from '@/contexts/budget';
import { useToast } from '@/hooks/use-toast';
import { Budget } from '@/types/budget';

interface BudgetEditDialogProps {
  budget: Budget;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BudgetEditDialog({ 
  budget, 
  open, 
  onOpenChange 
}: BudgetEditDialogProps) {
  const { updateBudget } = useBudgets();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUpdateBudget = async (formData: Budget) => {
    try {
      setIsSubmitting(true);
      console.log("Updating budget with data:", formData);
      
      if (budget.id) {
        await updateBudget(budget.id, formData);
        
        toast({
          title: "Orçamento atualizado",
          description: "Orçamento atualizado com sucesso!",
        });
      } else {
        throw new Error('ID do orçamento não encontrado');
      }
      
      // Close the dialog after operation is complete
      handleCancel();
    } catch (error) {
      console.error("Error updating budget:", error);
      toast({
        title: "Erro ao atualizar orçamento",
        description: "Ocorreu um erro ao atualizar o orçamento. Verifique os dados e tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    setIsSubmitting(false);
    setTimeout(() => {
      onOpenChange(false);
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
      onOpenChange(open);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
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
          <DialogTitle>Editar Orçamento</DialogTitle>
          <DialogDescription>
            Edite os dados do orçamento.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[70vh] pr-4">
          <BudgetForm 
            initialData={budget}
            onSubmit={handleUpdateBudget} 
            isSubmitting={isSubmitting}
            onCancel={handleCancel}
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
