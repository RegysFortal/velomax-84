
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PayableAccount } from '@/types';

// Mock categories for now
const CATEGORIES = [
  { id: '1', name: 'Combustível' },
  { id: '2', name: 'Aluguel' },
  { id: '3', name: 'Seguros' },
  { id: '4', name: 'Água' },
  { id: '5', name: 'Luz' },
  { id: '6', name: 'Folha de pagamento' },
  { id: '7', name: 'Impostos' },
  { id: '8', name: 'Frete' },
  { id: '9', name: 'Outros' },
];

const PAYMENT_METHODS = [
  { value: 'boleto', label: 'Boleto' },
  { value: 'pix', label: 'PIX' },
  { value: 'card', label: 'Cartão' },
  { value: 'transfer', label: 'Transferência' },
  { value: 'cash', label: 'Dinheiro' },
];

const formSchema = z.object({
  supplierName: z.string().min(1, 'Obrigatório'),
  description: z.string().min(1, 'Obrigatório'),
  amount: z.coerce.number().min(0.01, 'Valor deve ser maior que zero'),
  dueDate: z.string().min(1, 'Obrigatório'),
  paymentDate: z.string().optional(),
  paymentMethod: z.string().min(1, 'Obrigatório'),
  categoryId: z.string().min(1, 'Obrigatório'),
  isFixedExpense: z.boolean().default(false),
  recurring: z.boolean().default(false),
  recurrenceFrequency: z.string().optional(),
  installments: z.coerce.number().optional(),
  currentInstallment: z.coerce.number().optional(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface PayableAccountsFormProps {
  account: PayableAccount | null;
  onSubmit: (account: PayableAccount) => void;
  onCancel: () => void;
}

export function PayableAccountsForm({ account, onSubmit, onCancel }: PayableAccountsFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: account ? {
      supplierName: account.supplierName,
      description: account.description,
      amount: account.amount,
      dueDate: account.dueDate,
      paymentDate: account.paymentDate || '',
      paymentMethod: account.paymentMethod,
      categoryId: account.categoryId,
      isFixedExpense: account.isFixedExpense,
      recurring: account.recurring || false,
      recurrenceFrequency: account.recurrenceFrequency || '',
      installments: account.installments || undefined,
      currentInstallment: account.currentInstallment || undefined,
      notes: account.notes || '',
    } : {
      supplierName: '',
      description: '',
      amount: 0,
      dueDate: '',
      paymentDate: '',
      paymentMethod: '',
      categoryId: '',
      isFixedExpense: false,
      recurring: false,
      recurrenceFrequency: '',
      installments: undefined,
      currentInstallment: undefined,
      notes: '',
    }
  });
  
  const recurring = form.watch('recurring');
  
  const handleSubmit = (values: FormValues) => {
    const category = CATEGORIES.find(c => c.id === values.categoryId);
    
    const formattedAccount: PayableAccount = {
      id: account?.id || '',
      supplierName: values.supplierName,
      description: values.description,
      amount: values.amount,
      dueDate: values.dueDate,
      paymentDate: values.paymentDate || undefined,
      paymentMethod: values.paymentMethod,
      status: values.paymentDate ? 'paid' : new Date(values.dueDate) < new Date() ? 'overdue' : 'pending',
      categoryId: values.categoryId,
      categoryName: category?.name,
      isFixedExpense: values.isFixedExpense,
      recurring: values.recurring,
      recurrenceFrequency: values.recurring ? values.recurrenceFrequency as any : undefined,
      installments: values.installments,
      currentInstallment: values.currentInstallment,
      notes: values.notes,
      createdAt: account?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    onSubmit(formattedAccount);
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 pt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="supplierName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do Fornecedor</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categoria</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {CATEGORIES.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição da despesa</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valor a pagar</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="paymentMethod"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Forma de pagamento</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {PAYMENT_METHODS.map((method) => (
                      <SelectItem key={method.value} value={method.value}>
                        {method.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data de vencimento</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="paymentDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data de pagamento</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormDescription>
                  Preencha apenas quando o pagamento for realizado
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="flex flex-col space-y-3">
          <FormField
            control={form.control}
            name="isFixedExpense"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    Despesa fixa
                  </FormLabel>
                  <FormDescription>
                    Esta é uma conta que ocorre regularmente
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="recurring"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    Despesa recorrente
                  </FormLabel>
                  <FormDescription>
                    Esta conta se repete automaticamente
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
        </div>
        
        {recurring && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border p-4 rounded-lg">
            <FormField
              control={form.control}
              name="recurrenceFrequency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Frequência</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="daily">Diária</SelectItem>
                      <SelectItem value="weekly">Semanal</SelectItem>
                      <SelectItem value="monthly">Mensal</SelectItem>
                      <SelectItem value="yearly">Anual</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-2">
              <FormField
                control={form.control}
                name="installments"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Parcelas</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="currentInstallment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Parcela atual</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        )}
        
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observações</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">
            {account ? 'Atualizar' : 'Salvar'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
