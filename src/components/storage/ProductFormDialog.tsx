
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { StorageProduct } from '@/types/storage';
import { toast } from 'sonner';

interface ProductFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Omit<StorageProduct, 'id' | 'createdAt' | 'updatedAt'>) => void;
  product?: StorageProduct;
}

export function ProductFormDialog({ isOpen, onClose, onSave, product }: ProductFormDialogProps) {
  const [formData, setFormData] = useState<Omit<StorageProduct, 'id' | 'createdAt' | 'updatedAt'>>({
    description: product?.description || '',
    code: product?.code || '',
    unitPrice: product?.unitPrice || 0,
  });

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.description || !formData.code) {
      toast.error('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{product ? 'Editar Produto' : 'Novo Produto'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField id="description" label="Descrição do Produto" required>
            <Input 
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Ex: Equipamentos Eletrônicos - Notebooks"
              required
            />
          </FormField>
          
          <FormField id="code" label="Código" required>
            <Input 
              id="code"
              value={formData.code}
              onChange={(e) => handleChange('code', e.target.value)}
              placeholder="Ex: ELE001"
              required
            />
          </FormField>
          
          <FormField id="unitPrice" label="Valor Unitário (R$)">
            <Input 
              id="unitPrice"
              type="number"
              step="0.01"
              value={formData.unitPrice}
              onChange={(e) => handleChange('unitPrice', Number(e.target.value))}
              min={0}
              placeholder="0,00"
            />
          </FormField>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {product ? 'Salvar Alterações' : 'Cadastrar Produto'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
