
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StockEntry, Product } from '@/types/inventory';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';

interface EntryFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (entry: Omit<StockEntry, 'id' | 'createdAt'>) => void;
  products: Product[];
  entry?: StockEntry;
}

export function EntryFormDialog({ isOpen, onClose, onSave, products, entry }: EntryFormDialogProps) {
  const [formData, setFormData] = useState<Omit<StockEntry, 'id' | 'createdAt'>>({
    date: entry?.date || new Date().toISOString().split('T')[0],
    productId: entry?.productId || '',
    productName: entry?.productName || '',
    quantity: entry?.quantity || 1,
    invoiceNumber: entry?.invoiceNumber || '',
    supplier: entry?.supplier || '',
    unitPrice: entry?.unitPrice || 0,
    totalPrice: entry?.totalPrice || 0,
    transportDocument: entry?.transportDocument || '',
    receivedBy: entry?.receivedBy || '',
    observations: entry?.observations || '',
  });
  
  // Atualiza o preço total quando a quantidade ou preço unitário mudam
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      totalPrice: prev.quantity * prev.unitPrice
    }));
  }, [formData.quantity, formData.unitPrice]);
  
  // Atualiza informações do produto quando um produto é selecionado
  const handleProductChange = (productId: string) => {
    const selectedProduct = products.find(p => p.id === productId);
    if (selectedProduct) {
      setFormData(prev => ({
        ...prev,
        productId,
        productName: selectedProduct.name,
        supplier: selectedProduct.supplier
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
    
    if (!formData.productId || !formData.date || !formData.quantity || !formData.invoiceNumber) {
      toast.error('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{entry ? 'Editar Entrada' : 'Nova Entrada'}</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[70vh]">
          <form onSubmit={handleSubmit} className="space-y-4 p-1">
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
                        {product.name} ({product.code})
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
              
              <FormField id="invoiceNumber" label="Nota Fiscal" required>
                <Input 
                  id="invoiceNumber"
                  value={formData.invoiceNumber}
                  onChange={(e) => handleChange('invoiceNumber', e.target.value)}
                  placeholder="Ex: NF-45678"
                  required
                />
              </FormField>
              
              <FormField id="supplier" label="Fornecedor">
                <Input 
                  id="supplier"
                  value={formData.supplier}
                  onChange={(e) => handleChange('supplier', e.target.value)}
                  placeholder="Ex: Auto Peças Brasil"
                />
              </FormField>
              
              <FormField id="unitPrice" label="Preço Unitário (R$)">
                <Input 
                  id="unitPrice"
                  type="number"
                  step="0.01"
                  value={formData.unitPrice}
                  onChange={(e) => handleChange('unitPrice', Number(e.target.value))}
                  min={0}
                />
              </FormField>
              
              <FormField id="totalPrice" label="Preço Total (R$)">
                <Input 
                  id="totalPrice"
                  type="number"
                  step="0.01"
                  value={formData.totalPrice}
                  readOnly
                />
              </FormField>
              
              <FormField id="transportDocument" label="Documento de Transporte">
                <Input 
                  id="transportDocument"
                  value={formData.transportDocument}
                  onChange={(e) => handleChange('transportDocument', e.target.value)}
                  placeholder="Ex: CT-12345"
                />
              </FormField>
              
              <FormField id="receivedBy" label="Recebido por">
                <Input 
                  id="receivedBy"
                  value={formData.receivedBy}
                  onChange={(e) => handleChange('receivedBy', e.target.value)}
                  placeholder="Ex: João Silva"
                />
              </FormField>
            </div>
            
            <FormField id="observations" label="Observações">
              <Textarea 
                id="observations"
                value={formData.observations}
                onChange={(e) => handleChange('observations', e.target.value)}
                rows={3}
                placeholder="Observações sobre a entrada de material"
              />
            </FormField>
          </form>
        </ScrollArea>
        
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
