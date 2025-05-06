
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Product } from '@/types/inventory';
import { toast } from 'sonner';

interface ProductFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
  product?: Product;
}

export function ProductFormDialog({ isOpen, onClose, onSave, product }: ProductFormDialogProps) {
  const [formData, setFormData] = useState<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>({
    name: product?.name || '',
    code: product?.code || '',
    unit: product?.unit || 'unidade',
    category: product?.category || 'Peça de reposição',
    supplier: product?.supplier || '',
    location: product?.location || '',
    minStock: product?.minStock || 0,
    currentStock: product?.currentStock || 0,
  });

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.code) {
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
          <DialogTitle>{product ? 'Editar Produto' : 'Novo Produto'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField id="name" label="Nome do Produto" required>
              <Input 
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Ex: Pneu 175/70 R14"
                required
              />
            </FormField>
            
            <FormField id="code" label="Código" required>
              <Input 
                id="code"
                value={formData.code}
                onChange={(e) => handleChange('code', e.target.value)}
                placeholder="Ex: PN17570R14"
                required
              />
            </FormField>
            
            <FormField id="unit" label="Unidade">
              <Select 
                value={formData.unit} 
                onValueChange={(value) => handleChange('unit', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma unidade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unidade">Unidade</SelectItem>
                  <SelectItem value="L">Litro (L)</SelectItem>
                  <SelectItem value="kg">Quilograma (kg)</SelectItem>
                  <SelectItem value="m">Metro (m)</SelectItem>
                  <SelectItem value="m²">Metro quadrado (m²)</SelectItem>
                  <SelectItem value="m³">Metro cúbico (m³)</SelectItem>
                  <SelectItem value="caixa">Caixa</SelectItem>
                  <SelectItem value="pacote">Pacote</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
            
            <FormField id="category" label="Categoria">
              <Select 
                value={formData.category} 
                onValueChange={(value) => handleChange('category', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Peça de reposição">Peça de reposição</SelectItem>
                  <SelectItem value="Insumo">Insumo</SelectItem>
                  <SelectItem value="Ferramenta">Ferramenta</SelectItem>
                  <SelectItem value="Matéria-prima">Matéria-prima</SelectItem>
                  <SelectItem value="Produto acabado">Produto acabado</SelectItem>
                  <SelectItem value="Material de escritório">Material de escritório</SelectItem>
                  <SelectItem value="EPI">EPI</SelectItem>
                  <SelectItem value="Outro">Outro</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
            
            <FormField id="supplier" label="Fornecedor">
              <Input 
                id="supplier"
                value={formData.supplier}
                onChange={(e) => handleChange('supplier', e.target.value)}
                placeholder="Ex: Auto Peças Brasil"
              />
            </FormField>
            
            <FormField id="location" label="Localização">
              <Input 
                id="location"
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
                placeholder="Ex: Corredor B, Prateleira 3"
              />
            </FormField>
            
            <FormField id="minStock" label="Estoque Mínimo">
              <Input 
                id="minStock"
                type="number"
                value={formData.minStock}
                onChange={(e) => handleChange('minStock', Number(e.target.value))}
                min={0}
              />
            </FormField>
            
            <FormField id="currentStock" label="Estoque Atual">
              <Input 
                id="currentStock"
                type="number"
                value={formData.currentStock}
                onChange={(e) => handleChange('currentStock', Number(e.target.value))}
                min={0}
              />
            </FormField>
          </div>
          
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
