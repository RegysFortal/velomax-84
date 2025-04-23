
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ReceivableAccount } from '@/types/financial';

export interface ReceivableAccountsFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (account: Omit<ReceivableAccount, 'id' | 'createdAt' | 'updatedAt'>) => void;
  account: ReceivableAccount | null;
}

export function ReceivableAccountsForm({ open, onOpenChange, onSubmit, account }: ReceivableAccountsFormProps) {
  const [formData, setFormData] = React.useState({
    clientId: '',
    clientName: '',
    description: '',
    amount: '',
    dueDate: '',
    receivedDate: '',
    receivedAmount: '',
    remainingAmount: '',
    receivedMethod: 'pix',
    categoryId: '1',
    categoryName: 'Fretes',
    notes: '',
  });

  React.useEffect(() => {
    if (account) {
      setFormData({
        clientId: account.clientId,
        clientName: account.clientName,
        description: account.description,
        amount: account.amount.toString(),
        dueDate: account.dueDate,
        receivedDate: account.receivedDate || '',
        receivedAmount: account.receivedAmount ? account.receivedAmount.toString() : '',
        remainingAmount: account.remainingAmount ? account.remainingAmount.toString() : '',
        receivedMethod: account.receivedMethod || 'pix',
        categoryId: account.categoryId,
        categoryName: account.categoryName || '',
        notes: account.notes || '',
      });
    } else {
      // Reset form for new account
      setFormData({
        clientId: '',
        clientName: '',
        description: '',
        amount: '',
        dueDate: '',
        receivedDate: '',
        receivedAmount: '',
        remainingAmount: '',
        receivedMethod: 'pix',
        categoryId: '1',
        categoryName: 'Fretes',
        notes: '',
      });
    }
  }, [account]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const currentDate = new Date().toISOString().split('T')[0];
    const today = new Date();
    const dueDate = new Date(formData.dueDate);
    
    // Determine the status based on received date, received amount, and due date
    let status: 'pending' | 'received' | 'overdue' | 'partially_received' = 'pending';
    
    if (formData.receivedDate) {
      const receivedAmount = formData.receivedAmount ? parseFloat(formData.receivedAmount) : 0;
      const totalAmount = parseFloat(formData.amount);
      
      if (receivedAmount >= totalAmount) {
        status = 'received';
      } else if (receivedAmount > 0) {
        status = 'partially_received';
      }
    } else if (dueDate < today) {
      status = 'overdue';
    }
    
    const submittedData = {
      clientId: formData.clientId,
      clientName: formData.clientName,
      description: formData.description,
      amount: parseFloat(formData.amount),
      dueDate: formData.dueDate,
      receivedDate: formData.receivedDate || undefined,
      receivedAmount: formData.receivedAmount ? parseFloat(formData.receivedAmount) : undefined,
      remainingAmount: formData.remainingAmount ? parseFloat(formData.remainingAmount) : undefined,
      receivedMethod: formData.receivedDate ? formData.receivedMethod : undefined,
      status,
      categoryId: formData.categoryId,
      categoryName: formData.categoryName,
      notes: formData.notes || undefined,
    };
    
    onSubmit(submittedData);
  };
  
  const incomeCategories = [
    { id: '1', name: 'Fretes' },
    { id: '2', name: 'Serviços' },
    { id: '3', name: 'Vendas' },
    { id: '4', name: 'Reembolsos' },
    { id: '5', name: 'Outros' },
  ];
  
  // Mock clients for demonstration
  const clients = [
    { id: '1', name: 'Indústrias ABC' },
    { id: '2', name: 'Farmácia Saúde Total' },
    { id: '3', name: 'Supermercado Econômico' },
    { id: '4', name: 'Construtora Horizonte' },
    { id: '5', name: 'Restaurante Sabor & Arte' },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{account ? 'Editar Conta a Receber' : 'Nova Conta a Receber'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="clientId">Cliente</Label>
            <Select 
              value={formData.clientId} 
              onValueChange={(value) => {
                const selectedClient = clients.find(client => client.id === value);
                setFormData(prev => ({ 
                  ...prev, 
                  clientId: value,
                  clientName: selectedClient ? selectedClient.name : ''
                }));
              }}
            >
              <SelectTrigger id="clientId">
                <SelectValue placeholder="Selecione um cliente" />
              </SelectTrigger>
              <SelectContent>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Input
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Descrição da receita"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Valor (R$)</Label>
              <Input
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                type="number"
                step="0.01"
                min="0"
                placeholder="0,00"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dueDate">Data de Vencimento</Label>
              <Input
                id="dueDate"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                type="date"
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="receivedMethod">Forma de Recebimento</Label>
              <Select 
                value={formData.receivedMethod} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, receivedMethod: value }))}
              >
                <SelectTrigger id="receivedMethod">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pix">PIX</SelectItem>
                  <SelectItem value="cash">Dinheiro</SelectItem>
                  <SelectItem value="bank_slip">Boleto</SelectItem>
                  <SelectItem value="transfer">Transferência</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="receivedDate">Data de Recebimento</Label>
              <Input
                id="receivedDate"
                name="receivedDate"
                value={formData.receivedDate}
                onChange={handleChange}
                type="date"
              />
            </div>
          </div>
          
          {formData.receivedDate && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="receivedAmount">Valor Recebido (R$)</Label>
                <Input
                  id="receivedAmount"
                  name="receivedAmount"
                  value={formData.receivedAmount}
                  onChange={(e) => {
                    const receivedAmount = parseFloat(e.target.value) || 0;
                    const totalAmount = parseFloat(formData.amount) || 0;
                    const remainingAmount = totalAmount > receivedAmount ? totalAmount - receivedAmount : 0;
                    
                    setFormData(prev => ({
                      ...prev,
                      receivedAmount: e.target.value,
                      remainingAmount: remainingAmount.toString()
                    }));
                  }}
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0,00"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="remainingAmount">Valor Restante (R$)</Label>
                <Input
                  id="remainingAmount"
                  name="remainingAmount"
                  value={formData.remainingAmount}
                  readOnly
                  type="number"
                  step="0.01"
                  min="0"
                  className="bg-gray-50"
                />
              </div>
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="categoryId">Categoria</Label>
            <Select 
              value={formData.categoryId} 
              onValueChange={(value) => {
                const selectedCategory = incomeCategories.find(cat => cat.id === value);
                setFormData(prev => ({ 
                  ...prev, 
                  categoryId: value,
                  categoryName: selectedCategory ? selectedCategory.name : ''
                }));
              }}
            >
              <SelectTrigger id="categoryId">
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {incomeCategories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Observações</Label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Observações adicionais..."
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              {account ? 'Atualizar' : 'Salvar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
