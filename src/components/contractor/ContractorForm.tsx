
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useEmployeesData } from '@/hooks/useEmployeesData';

const formSchema = z.object({
  name: z.string().min(3, { message: 'Nome deve ter pelo menos 3 caracteres' }),
  document: z.string().min(11, { message: 'CPF deve ter 11 dígitos' }),
  rg: z.string().min(1, { message: 'RG é obrigatório' }),
  phone: z.string().min(10, { message: 'Telefone deve ter pelo menos 10 dígitos' }),
  birthDate: z.string().min(1, { message: 'Data de nascimento é obrigatória' }),
  address: z.string().min(5, { message: 'Endereço deve ter pelo menos 5 caracteres' }),
  contractorType: z.enum(['driver', 'helper'], { 
    required_error: 'Tipo de terceiro é obrigatório' 
  }),
});

interface ContractorFormProps {
  contractor?: any;
  onContractorTypeChange: (type: 'driver' | 'helper') => void;
  onComplete: (data: any) => void;
}

export function ContractorForm({ contractor, onContractorTypeChange, onComplete }: ContractorFormProps) {
  const { addEmployee, updateEmployee } = useEmployeesData();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: contractor?.name || '',
      document: contractor?.document || '',
      rg: contractor?.rg || '',
      phone: contractor?.phone || '',
      birthDate: contractor?.birthDate ? new Date(contractor.birthDate).toISOString().split('T')[0] : '',
      address: contractor?.address || '',
      contractorType: (contractor?.role === 'driver' ? 'driver' : 'helper') || 'helper',
    },
  });
  
  useEffect(() => {
    const contractorType = form.watch('contractorType');
    onContractorTypeChange(contractorType as 'driver' | 'helper');
  }, [form.watch('contractorType')]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const formattedData = {
        name: data.name,
        document: data.document,
        rg: data.rg,
        phone: data.phone,
        birthDate: data.birthDate,
        address: data.address,
        role: data.contractorType,
        type: 'contractor',
      };

      if (contractor?.id) {
        await updateEmployee(contractor.id, formattedData);
      } else {
        await addEmployee(formattedData);
      }
      
      onComplete(formattedData);
    } catch (error) {
      console.error('Erro ao salvar terceiro:', error);
    }
  };

  return (
    <ScrollArea className="max-h-[450px]">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome Completo</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome completo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="document"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CPF</FormLabel>
                  <FormControl>
                    <Input placeholder="CPF (apenas números)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="rg"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>RG</FormLabel>
                  <FormControl>
                    <Input placeholder="RG" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="birthDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data de Nascimento</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone</FormLabel>
                  <FormControl>
                    <Input placeholder="Telefone" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="contractorType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="driver">Motorista</SelectItem>
                      <SelectItem value="helper">Ajudante</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Endereço</FormLabel>
                <FormControl>
                  <Input placeholder="Endereço completo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex justify-end pt-4">
            <Button type="submit">
              {form.watch('contractorType') === 'driver' ? 'Próximo' : 'Salvar'}
            </Button>
          </div>
        </form>
      </Form>
    </ScrollArea>
  );
}
