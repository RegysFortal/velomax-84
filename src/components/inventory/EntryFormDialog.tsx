
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { StockEntry, Product } from '@/types/inventory';
import { EntryForm } from './entry-form/EntryForm';
import { useEntryForm } from './entry-form/useEntryForm';

interface EntryFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (entry: Omit<StockEntry, 'id' | 'createdAt'>) => void;
  products: Product[];
  entry?: StockEntry;
}

export function EntryFormDialog({ isOpen, onClose, onSave, products, entry }: EntryFormDialogProps) {
  const { formData, handleFormDataChange, handleSubmit } = useEntryForm({
    entry,
    onSave,
    onClose
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{entry ? 'Editar Entrada' : 'Nova Entrada'}</DialogTitle>
        </DialogHeader>
        
        <EntryForm
          products={products}
          entry={entry}
          onFormDataChange={handleFormDataChange}
          formData={formData}
        />
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" onClick={handleSubmit}>
            {entry ? 'Salvar Alterações' : 'Registrar Entrada'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
