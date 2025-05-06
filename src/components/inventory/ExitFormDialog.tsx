
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StockExit, Product } from '@/types/inventory';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';

interface ExitFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (exit: Omit<StockExit, 'id' | 'createdAt'>) => void;
  products: Product[];
  exit?: StockExit;
}

export function ExitFormDialog({ isOpen, onClose, onSave, products, exit }: ExitFormDialogProps) {
  const [formData, setFormData] = useState<Omit<StockExit, 'id' | 'createdAt'>>({
    date: exit?.date || new Date().toISOString().split('T')[0],
    productId: exit?.productId || '',
    productName: exit?.productName || '',
    quantity: exit?.quantity || 1,
    purpose: exit?.purpose || 'Manutenção',
    withdrawnBy: exit?.withdrawnBy || '',
    documentNumber: exit?.documentNumber || '',
    observations: exit?.observations || '',
  });
  
  // Atualiza informações do produto quando um produto é selecionado
  const handleProductChange = (productId: string) => {
    const selectedProduct = products.find(p => p.id === productId);
    if (selectedProduct) {
      setFormData(prev => ({
        ...prev,
        productId,
        productName: selectedProduct.name
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
    
    if (!formData.productId || !formData.date || !formData.quantity || !formData.purpose || !formData.withdrawnBy) {
      toast.error('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    const selectedProduct = products.find(p => p.id === formData.productId);
    if (selectedProduct && formData.quantity > selectedProduct.currentStock) {
      toast.error(`Estoque insuficiente! Disponível: ${selectedProduct.currentStock} ${selectedProduct.unit}`);
      return;
    }

    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{exit ? 'Editar Saída' : 'Nova Saída'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField id="date" label="Data" required>
              <Input 
                id="date"
                type="date"
                value={formData.date.substring(0, 10)}
                onChange={(e) => handleChange('date', e.target.value)}
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
                      {product.name} ({product.code}) - {product.currentStock} {product.unit} disponível
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
            
            <FormField id="purpose" label="Finalidade" required>
              <Select 
                value={formData.purpose} 
                onValueChange={(value) => handleChange('purpose', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a finalidade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Manutenção">Manutenção</SelectItem>
                  <SelectItem value="Operação">Operação</SelectItem>
                  <SelectItem value="Venda">Venda</SelectItem>
                  <SelectItem value="Devolução">Devolução</SelectItem>
                  <SelectItem value="Transferência">Transferência</SelectItem>
                  <SelectItem value="Perda">Perda/Avaria</SelectItem>
                  <SelectItem value="Outro">Outro</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
            
            <FormField id="withdrawnBy" label="Retirado por" required>
              <Input 
                id="withdrawnBy"
                value={formData.withdrawnBy}
                onChange={(e) => handleChange('withdrawnBy', e.target.value)}
                placeholder="Ex: Carlos Pereira"
                required
              />
            </FormField>
            
            <FormField id="documentNumber" label="Número do Documento">
              <Input 
                id="documentNumber"
                value={formData.documentNumber || ''}
                onChange={(e) => handleChange('documentNumber', e.target.value)}
                placeholder="Ex: OS-123456"
              />
            </FormField>
          </div>
          
          <FormField id="observations" label="Observações">
            <Textarea 
              id="observations"
              value={formData.observations || ''}
              onChange={(e) => handleChange('observations', e.target.value)}
              rows={3}
              placeholder="Observações sobre a saída de material"
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
