
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ReceivableAccount } from '@/types';
import { useClients } from '@/contexts/clients';

// Mock categories for now
const CATEGORIES = [
  { id: '1', name: 'Fretes' },
  { id: '2', name: 'Vendas' },
  { id: '3', name: 'Reembolsos' },
  { id: '4', name: 'Serviços' },
  { id: '5', name: 'Outros' },
];

const RECEIVED_METHODS = [
  { value: 'pix', label: 'PIX' },
  { value: 'bank_slip', label: 'Boleto' },
  { value: 'cash', label: 'Dinheiro' },
  { value: 'transfer', label: 'Transferência' },
];

const formSchema = z.object({
  clientId: z.string().min(1, 'Obrigatório'),
  description: z.string().min(1, 'Obrigatório'),
  amount: z.coerce.number().min(0.01, 'Valor deve ser maior que zero'),
  dueDate: z.string().min(1, 'Obrigatório'),
  receivedDate: z.string().optional(),
  receivedAmount: z.coerce.number().optional(),
  receivedMethod: z.string().optional(),
  categoryId: z.string().min(1, 'Obrigatório'),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface ReceivableAccountsFormProps {
  account: ReceivableAccount | null;
  onSubmit: (account: ReceivableAccount) => void;
  onCancel: () => void;
}

export function ReceivableAccountsForm({ account, onSubmit, onCancel }: ReceivableAccountsFormProps) {
  const { clients } = useClients();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: account ? {
      clientId: account.clientId,
      description: account.description,
      amount: account.amount,
      dueDate: account.dueDate,
      receivedDate: account.receivedDate || '',
      receivedAmount: account.receivedAmount,
      receivedMethod: account.receivedMethod || '',
      categoryId: account.categoryId,
      notes: account.notes || '',
    } : {
      clientId: '',
      description: '',
      amount: 0,
      dueDate: '',
      receivedDate: '',
      receivedAmount: undefined,
      receivedMethod: '',
      categoryId: '',
      notes: '',
    }
  });
  
  const handleSubmit = (values: FormValues) => {
    const client = clients.find(c => c.id === values.clientId);
    const category = CATEGORIES.find(c => c.id === values.categoryId);
    
    let status: 'pending' | 'received' | 'overdue' | 'partially_received' = 'pending';
    let remainingAmount: number | undefined;
    
    if (values.receivedDate) {
      if (values.receivedAmount && values.receivedAmount < values.amount) {
        status = 'partially_received';
        remainingAmount = values.amount - values.receivedAmount;
      } else {
        status = 'received';
      }
    } else if (new Date(values.dueDate) < new Date()) {
      status = 'overdue';
    }
    
    const formattedAccount: ReceivableAccount = {
      id: account?.id || '',
      clientId: values.clientId,
      clientName: client?.name || 'Cliente Não Encontrado',
      description: values.description,
      amount: values.amount,
      dueDate: values.dueDate,
      receivedDate: values.receivedDate || undefined,
      receivedAmount: values.receivedAmount,
      remainingAmount,
      receivedMethod: values.receivedMethod || undefined,
      status,
      categoryId: values.categoryId,
      categoryName: category?.name,
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
            name="clientId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cliente</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um cliente" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
              <FormLabel>Descrição da receita</FormLabel>
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
                <FormLabel>Valor a receber</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
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
        </div>
        
        <div className="border p-4 rounded-md space-y-4">
          <h3 className="font-medium">Informações de Recebimento</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="receivedDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data de recebimento</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormDescription>
                    Preencha apenas quando o pagamento for recebido
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="receivedMethod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Forma de recebimento</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {RECEIVED_METHODS.map((method) => (
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
          
          <FormField
            control={form.control}
            name="receivedAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valor recebido</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} />
                </FormControl>
                <FormDescription>
                  Deixe em branco para o valor total ou preencha para recebimento parcial
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
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
