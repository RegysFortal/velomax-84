
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { StorageExit, StorageProduct } from '@/types/storage';
import { toast } from 'sonner';

interface ExitFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (exit: Omit<StorageExit, 'id' | 'createdAt'>) => void;
  products: StorageProduct[];
  exit?: StorageExit;
}

export function ExitFormDialog({ isOpen, onClose, onSave, products, exit }: ExitFormDialogProps) {
  const [formData, setFormData] = useState<Omit<StorageExit, 'id' | 'createdAt'>>({
    exitDate: exit?.exitDate || new Date().toISOString().split('T')[0],
    productId: exit?.productId || '',
    productDescription: exit?.productDescription || '',
    quantity: exit?.quantity || 1,
    withdrawnBy: exit?.withdrawnBy || '',
    invoiceNumber: exit?.invoiceNumber || '',
    observations: exit?.observations || '',
  });

  // Atualiza informações do produto quando um produto é selecionado
  const handleProductChange = (productId: string) => {
    const selectedProduct = products.find(p => p.id === productId);
    if (selectedProduct) {
      setFormData(prev => ({
        ...prev,
        productId,
        productDescription: selectedProduct.description
      }));
    }
  };

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.productId || !formData.exitDate || !formData.quantity || !formData.withdrawnBy) {
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
          <DialogTitle>{exit ? 'Editar Saída' : 'Nova Saída de Produto'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField id="exitDate" label="Data de Saída" required>
            <Input 
              id="exitDate"
              type="date"
              value={formData.exitDate}
              onChange={(e) => handleChange('exitDate', e.target.value)}
              required
            />
          </FormField>
          
          <FormField id="product" label="Produto" required>
            <Select 
              value={formData.productId} 
              onValueChange={handleProductChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um produto" />
              </SelectTrigger>
              <SelectContent>
                {products.map(product => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.code} - {product.description}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
          
          <FormField id="quantity" label="Quantidade" required>
            <Input 
              id="quantity"
              type="number"
              value={formData.quantity}
              onChange={(e) => handleChange('quantity', Number(e.target.value))}
              min={1}
              required
            />
          </FormField>
          
          <FormField id="withdrawnBy" label="Retirado Por" required>
            <Input 
              id="withdrawnBy"
              value={formData.withdrawnBy}
              onChange={(e) => handleChange('withdrawnBy', e.target.value)}
              placeholder="Ex: Tech Company Ltda"
              required
            />
          </FormField>
          
          <FormField id="invoiceNumber" label="Nota Fiscal">
            <Input 
              id="invoiceNumber"
              value={formData.invoiceNumber}
              onChange={(e) => handleChange('invoiceNumber', e.target.value)}
              placeholder="Ex: NF-654321"
            />
          </FormField>
          
          <FormField id="observations" label="Observações">
            <Textarea 
              id="observations"
              value={formData.observations}
              onChange={(e) => handleChange('observations', e.target.value)}
              rows={3}
              placeholder="Observações sobre a saída (avarias, motivo da retirada, etc.)"
            />
          </FormField>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {exit ? 'Salvar Alterações' : 'Registrar Saída'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
