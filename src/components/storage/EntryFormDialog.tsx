
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { StorageEntry, StorageProduct } from '@/types/storage';
import { Client } from '@/types';
import { toast } from 'sonner';

interface EntryFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (entry: Omit<StorageEntry, 'id' | 'createdAt'>) => void;
  products: StorageProduct[];
  clients: Client[];
  entry?: StorageEntry;
}

export function EntryFormDialog({ isOpen, onClose, onSave, products, clients, entry }: EntryFormDialogProps) {
  const [formData, setFormData] = useState<Omit<StorageEntry, 'id' | 'createdAt'>>({
    arrivalDate: entry?.arrivalDate || new Date().toISOString().split('T')[0],
    productId: entry?.productId || '',
    productDescription: entry?.productDescription || '',
    quantity: entry?.quantity || 1,
    invoiceNumber: entry?.invoiceNumber || '',
    supplier: entry?.supplier || '',
    clientId: entry?.clientId || '',
    unitPrice: entry?.unitPrice || 0,
    totalPrice: entry?.totalPrice || 0,
    carrier: entry?.carrier || '',
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
        productDescription: selectedProduct.description,
        unitPrice: selectedProduct.unitPrice
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
    
    if (!formData.productId || !formData.arrivalDate || !formData.quantity || !formData.invoiceNumber || !formData.clientId) {
      toast.error('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>{entry ? 'Editar Entrada' : 'Nova Entrada de Produto'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[60vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField id="arrivalDate" label="Data de Chegada" required>
              <Input 
                id="arrivalDate"
                type="date"
                value={formData.arrivalDate}
                onChange={(e) => handleChange('arrivalDate', e.target.value)}
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
            
            <FormField id="invoiceNumber" label="Nota Fiscal" required>
              <Input 
                id="invoiceNumber"
                value={formData.invoiceNumber}
                onChange={(e) => handleChange('invoiceNumber', e.target.value)}
                placeholder="Ex: NF-123456"
                required
              />
            </FormField>
            
            <FormField id="supplier" label="Fornecedor">
              <Input 
                id="supplier"
                value={formData.supplier}
                onChange={(e) => handleChange('supplier', e.target.value)}
                placeholder="Ex: Tech Solutions Ltda"
              />
            </FormField>
            
            <FormField id="client" label="Cliente" required>
              <Select 
                value={formData.clientId} 
                onValueChange={(value) => handleChange('clientId', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um cliente" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map(client => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                className="bg-gray-50"
              />
            </FormField>
            
            <FormField id="carrier" label="Transportadora">
              <Input 
                id="carrier"
                value={formData.carrier}
                onChange={(e) => handleChange('carrier', e.target.value)}
                placeholder="Ex: Transportadora Express"
              />
            </FormField>
            
            <FormField id="transportDocument" label="Conhecimento de Transporte (CT-e)">
              <Input 
                id="transportDocument"
                value={formData.transportDocument}
                onChange={(e) => handleChange('transportDocument', e.target.value)}
                placeholder="Ex: CT-e 789012"
              />
            </FormField>
            
            <FormField id="receivedBy" label="Recebido Por">
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
              placeholder="Observações sobre a entrada (problemas, avarias, etc.)"
            />
          </FormField>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {entry ? 'Salvar Alterações' : 'Registrar Entrada'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
