
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DatePickerField } from './forms/DatePickerField';
import { User } from '@/types';

const employeeSchema = z.object({
  name: z.string().min(3, { message: 'Nome deve ter pelo menos 3 caracteres' }),
  email: z.string().email({ message: 'Email inválido' }).optional().or(z.literal('')),
  position: z.string().min(1, { message: 'Posição é obrigatória' }),
  phone: z.string().optional(),
  department: z.string().optional(),
  employeeSince: z.string().optional(),
});

interface EmployeeEditFormProps {
  employee: User | null;
  isCreating?: boolean;
  onComplete?: () => void;
  onSave?: (employee: User, isNew: boolean) => Promise<void>;
  isEmployeeForm?: boolean;
}

export function EmployeeEditForm({
  employee,
  isCreating = false,
  onComplete,
  onSave,
  isEmployeeForm = false
}: EmployeeEditFormProps) {
  const [employeeSince, setEmployeeSince] = useState<Date | undefined>(
    employee?.employeeSince ? new Date(employee.employeeSince) : undefined
  );

  const form = useForm<z.infer<typeof employeeSchema>>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      name: employee?.name || '',
      email: employee?.email || '',
      position: employee?.position || '',
      phone: employee?.phone || '',
      department: employee?.department || '',
      employeeSince: employee?.employeeSince || '',
    },
  });

  useEffect(() => {
    // Update form values when employee changes
    if (employee) {
      form.reset({
        name: employee.name || '',
        email: employee.email || '',
        position: employee.position || '',
        phone: employee.phone || '',
        department: employee.department || '',
        employeeSince: employee.employeeSince || '',
      });
      
      setEmployeeSince(employee.employeeSince ? new Date(employee.employeeSince) : undefined);
    }
  }, [employee, form]);

  const onSubmit = async (data: z.infer<typeof employeeSchema>) => {
    try {
      console.log("Submitting employee form with data:", data);
      
      const employeeData = {
        ...data,
        id: employee?.id || '',
        role: employee?.role || 'user',
        createdAt: employee?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (onSave) {
        await onSave(employeeData as User, isCreating);
      }

      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      console.error('Error saving employee:', error);
      toast.error('Erro ao salvar colaborador');
    }
  };

  const handleDateChange = (date: Date | undefined) => {
    setEmployeeSince(date);
    
    if (date) {
      // Format date to ISO string and take just the date part
      const formattedDate = date.toISOString().split('T')[0];
      form.setValue('employeeSince', formattedDate);
    } else {
      form.setValue('employeeSince', '');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome Completo</FormLabel>
              <FormControl>
                <Input placeholder="Nome do colaborador" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="email@exemplo.com" {...field} />
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
                  <Input placeholder="(00) 00000-0000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="position"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cargo</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Gerente, Analista" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="department"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Departamento</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um departamento" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="operations">Operações</SelectItem>
                    <SelectItem value="finance">Financeiro</SelectItem>
                    <SelectItem value="administrative">Administrativo</SelectItem>
                    <SelectItem value="logistics">Logística</SelectItem>
                    <SelectItem value="commercial">Comercial</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <FormLabel>Data de Admissão</FormLabel>
            <DatePickerField
              id="employeeSince"
              value={employeeSince}
              onChange={handleDateChange}
              placeholder="Selecione a data"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          {onComplete && (
            <Button type="button" variant="outline" onClick={onComplete}>
              Cancelar
            </Button>
          )}
          <Button type="submit">
            {isCreating ? 'Adicionar' : 'Salvar Alterações'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
