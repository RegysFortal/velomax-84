
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { PayableAccount } from '@/types/financial';

export interface PayableAccountsFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (account: Omit<PayableAccount, 'id' | 'createdAt' | 'updatedAt'>) => void;
  account: PayableAccount | null;
}

export function PayableAccountsForm({ open, onOpenChange, onSubmit, account }: PayableAccountsFormProps) {
  const [formData, setFormData] = React.useState({
    supplierName: '',
    description: '',
    amount: '',
    dueDate: '',
    paymentDate: '',
    paymentMethod: 'boleto',
    categoryId: '1', // Default to first category
    categoryName: 'Combustível', // Default category name
    isFixedExpense: false,
    recurring: false,
    recurrenceFrequency: 'monthly',
    installments: '',
    currentInstallment: '',
    notes: '',
  });

  React.useEffect(() => {
    if (account) {
      setFormData({
        supplierName: account.supplierName,
        description: account.description,
        amount: account.amount.toString(),
        dueDate: account.dueDate,
        paymentDate: account.paymentDate || '',
        paymentMethod: account.paymentMethod,
        categoryId: account.categoryId,
        categoryName: account.categoryName || '',
        isFixedExpense: account.isFixedExpense,
        recurring: account.recurring || false,
        recurrenceFrequency: account.recurrenceFrequency || 'monthly',
        installments: account.installments ? account.installments.toString() : '',
        currentInstallment: account.currentInstallment ? account.currentInstallment.toString() : '',
        notes: account.notes || '',
      });
    } else {
      // Reset form for new account
      setFormData({
        supplierName: '',
        description: '',
        amount: '',
        dueDate: '',
        paymentDate: '',
        paymentMethod: 'boleto',
        categoryId: '1',
        categoryName: 'Combustível',
        isFixedExpense: false,
        recurring: false,
        recurrenceFrequency: 'monthly',
        installments: '',
        currentInstallment: '',
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
    
    // Determine the status based on payment date and due date
    let status: 'pending' | 'paid' | 'overdue' = 'pending';
    if (formData.paymentDate) {
      status = 'paid';
    } else if (dueDate < today) {
      status = 'overdue';
    }
    
    const submittedData = {
      supplierName: formData.supplierName,
      description: formData.description,
      amount: parseFloat(formData.amount),
      dueDate: formData.dueDate,
      paymentDate: formData.paymentDate || undefined,
      paymentMethod: formData.paymentMethod,
      status,
      categoryId: formData.categoryId,
      categoryName: formData.categoryName,
      isFixedExpense: formData.isFixedExpense,
      recurring: formData.recurring || undefined,
      recurrenceFrequency: formData.recurring ? formData.recurrenceFrequency as 'daily' | 'weekly' | 'monthly' | 'yearly' : undefined,
      installments: formData.installments ? parseInt(formData.installments) : undefined,
      currentInstallment: formData.installments ? parseInt(formData.currentInstallment) || 1 : undefined,
      notes: formData.notes || undefined,
    };
    
    onSubmit(submittedData);
  };
  
  const expenseCategories = [
    { id: '1', name: 'Combustível' },
    { id: '2', name: 'Aluguel' },
    { id: '3', name: 'Serviços' },
    { id: '4', name: 'Manutenção' },
    { id: '5', name: 'Seguros' },
    { id: '6', name: 'Impostos' },
    { id: '7', name: 'Folha de Pagamento' },
    { id: '8', name: 'Utilidades' },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{account ? 'Editar Conta a Pagar' : 'Nova Conta a Pagar'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="supplierName">Fornecedor</Label>
            <Input
              id="supplierName"
              name="supplierName"
              value={formData.supplierName}
              onChange={handleChange}
              placeholder="Nome do fornecedor"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Input
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Descrição da despesa"
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
              <Label htmlFor="paymentMethod">Forma de Pagamento</Label>
              <Select 
                value={formData.paymentMethod} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, paymentMethod: value }))}
              >
                <SelectTrigger id="paymentMethod">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="boleto">Boleto</SelectItem>
                  <SelectItem value="pix">PIX</SelectItem>
                  <SelectItem value="card">Cartão</SelectItem>
                  <SelectItem value="transfer">Transferência</SelectItem>
                  <SelectItem value="cash">Dinheiro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="paymentDate">Data de Pagamento</Label>
              <Input
                id="paymentDate"
                name="paymentDate"
                value={formData.paymentDate}
                onChange={handleChange}
                type="date"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="categoryId">Categoria</Label>
            <Select 
              value={formData.categoryId} 
              onValueChange={(value) => {
                const selectedCategory = expenseCategories.find(cat => cat.id === value);
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
                {expenseCategories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex flex-col gap-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="isFixedExpense" 
                checked={formData.isFixedExpense} 
                onCheckedChange={(checked) => 
                  setFormData(prev => ({ ...prev, isFixedExpense: !!checked }))
                }
              />
              <Label htmlFor="isFixedExpense">Despesa Fixa</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="recurring" 
                checked={formData.recurring} 
                onCheckedChange={(checked) => 
                  setFormData(prev => ({ ...prev, recurring: !!checked }))
                }
              />
              <Label htmlFor="recurring">Pagamento Recorrente</Label>
            </div>
          </div>
          
          {formData.recurring && (
            <div className="space-y-2">
              <Label htmlFor="recurrenceFrequency">Frequência</Label>
              <Select 
                value={formData.recurrenceFrequency} 
                onValueChange={(value) => setFormData(prev => ({ 
                  ...prev, 
                  recurrenceFrequency: value as 'daily' | 'weekly' | 'monthly' | 'yearly'
                }))}
              >
                <SelectTrigger id="recurrenceFrequency">
                  <SelectValue placeholder="Selecione a frequência" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Diária</SelectItem>
                  <SelectItem value="weekly">Semanal</SelectItem>
                  <SelectItem value="monthly">Mensal</SelectItem>
                  <SelectItem value="yearly">Anual</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="installments">Parcelas</Label>
              <Input
                id="installments"
                name="installments"
                value={formData.installments}
                onChange={handleChange}
                type="number"
                min="0"
                placeholder="Total de parcelas"
              />
            </div>
            
            {formData.installments && parseInt(formData.installments) > 0 && (
              <div className="space-y-2">
                <Label htmlFor="currentInstallment">Parcela Atual</Label>
                <Input
                  id="currentInstallment"
                  name="currentInstallment"
                  value={formData.currentInstallment}
                  onChange={handleChange}
                  type="number"
                  min="1"
                  max={formData.installments}
                  placeholder="Parcela atual"
                />
              </div>
            )}
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
