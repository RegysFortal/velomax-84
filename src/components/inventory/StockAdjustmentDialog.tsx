
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StockAdjustment, Product } from '@/types/inventory';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';

interface StockAdjustmentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (adjustment: Omit<StockAdjustment, 'id' | 'createdAt'>) => void;
  products: Product[];
}

export function StockAdjustmentDialog({ isOpen, onClose, onSave, products }: StockAdjustmentDialogProps) {
  const [productId, setProductId] = useState<string>('');
  const [newQuantity, setNewQuantity] = useState<number>(0);
  const [reason, setReason] = useState<string>('Contagem Física');
  const [observations, setObservations] = useState<string>('');
  const [adjustedBy, setAdjustedBy] = useState<string>('');
  
  // Reset form when dialog opens
  React.useEffect(() => {
    if (isOpen) {
      setProductId('');
      setNewQuantity(0);
      setReason('Contagem Física');
      setObservations('');
      setAdjustedBy('');
    }
  }, [isOpen]);
  
  const selectedProduct = products.find(p => p.id === productId);
  const previousQuantity = selectedProduct?.currentStock || 0;
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!productId || !adjustedBy) {
      toast.error('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    if (newQuantity === previousQuantity) {
      toast.error('A quantidade atual e a nova quantidade são iguais. Não é necessário ajuste.');
      return;
    }

    const selectedProduct = products.find(p => p.id === productId);
    if (!selectedProduct) return;

    const adjustment: Omit<StockAdjustment, 'id' | 'createdAt'> = {
      date: new Date().toISOString(),
      productId,
      productName: selectedProduct.name,
      previousQuantity,
      newQuantity,
      reason,
      adjustedBy,
      observations,
    };

    onSave(adjustment);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Ajuste de Estoque</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField id="product" label="Produto" required>
            <Select 
              value={productId} 
              onValueChange={setProductId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um produto" />
              </SelectTrigger>
              <SelectContent>
                {products.map(product => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.name} ({product.code}) - {product.currentStock} {product.unit} em estoque
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
          
          {selectedProduct && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField id="previousQuantity" label="Quantidade Atual">
                  <Input 
                    id="previousQuantity"
                    type="number"
                    value={previousQuantity}
                    readOnly
                    disabled
                  />
                </FormField>
                
                <FormField id="newQuantity" label="Nova Quantidade" required>
                  <Input 
                    id="newQuantity"
                    type="number"
                    value={newQuantity}
                    onChange={(e) => setNewQuantity(Number(e.target.value))}
                    min={0}
                    required
                  />
                </FormField>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField id="reason" label="Motivo do Ajuste" required>
                  <Select 
                    value={reason} 
                    onValueChange={setReason}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o motivo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Contagem Física">Contagem Física</SelectItem>
                      <SelectItem value="Avaria">Produto Avariado</SelectItem>
                      <SelectItem value="Extravio">Extravio</SelectItem>
                      <SelectItem value="Devolução">Devolução</SelectItem>
                      <SelectItem value="Erro de Lançamento">Erro de Lançamento</SelectItem>
                      <SelectItem value="Outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </FormField>
                
                <FormField id="adjustedBy" label="Ajustado por" required>
                  <Input 
                    id="adjustedBy"
                    value={adjustedBy}
                    onChange={(e) => setAdjustedBy(e.target.value)}
                    placeholder="Nome do responsável"
                    required
                  />
                </FormField>
              </div>
              
              <FormField id="observations" label="Observações">
                <Textarea 
                  id="observations"
                  value={observations}
                  onChange={(e) => setObservations(e.target.value)}
                  rows={3}
                  placeholder="Observações sobre o ajuste de estoque"
                />
              </FormField>
            </>
          )}
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={!productId}>
              Registrar Ajuste
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
