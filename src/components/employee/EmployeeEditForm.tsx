
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User } from '@/types';
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
import { useAuth } from '@/contexts/auth/AuthContext';
import { toast } from "sonner";

// Define the validation schema
const employeeFormSchema = z.object({
  name: z.string().min(3, { message: 'O nome deve ter pelo menos 3 caracteres' }),
  email: z.string().email({ message: 'Email inválido' }),
  role: z.enum(['admin', 'manager', 'user'], {
    required_error: 'Selecione uma função'
  }),
  department: z.string().min(1, { message: 'Selecione um departamento' }),
  position: z.string().min(1, { message: 'Informe o cargo' }),
  phone: z.string().optional(),
});

type EmployeeFormValues = z.infer<typeof employeeFormSchema>;

interface EmployeeEditFormProps {
  employee: User | null;
  onComplete: () => void;
}

export function EmployeeEditForm({ employee, onComplete }: EmployeeEditFormProps) {
  const { updateUser, deleteUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // Initialize form with react-hook-form
  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: {
      name: '',
      email: '',
      role: 'user' as const,
      department: '',
      position: '',
      phone: '',
    }
  });

  // Fill the form with employee data when editing
  useEffect(() => {
    if (employee) {
      form.reset({
        name: employee.name,
        email: employee.email,
        role: employee.role,
        department: employee.department || '',
        position: employee.position || '',
        phone: employee.phone || '',
      });
    }
  }, [employee, form]);

  const onSubmit = async (data: EmployeeFormValues) => {
    if (!employee) return;
    
    setIsLoading(true);
    try {
      await updateUser(employee.id, data);
      toast.success('Funcionário atualizado com sucesso');
      onComplete();
    } catch (error) {
      console.error('Error updating employee:', error);
      toast.error('Erro ao atualizar funcionário');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!employee) return;
    
    if (confirm(`Tem certeza que deseja excluir o funcionário ${employee.name}?`)) {
      setIsLoading(true);
      try {
        await deleteUser(employee.id);
        toast.success('Funcionário excluído com sucesso');
        onComplete();
      } catch (error) {
        console.error('Error deleting employee:', error);
        toast.error('Erro ao excluir funcionário');
      } finally {
        setIsLoading(false);
      }
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
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} type="email" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Função</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a função" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="admin">Administrador</SelectItem>
                    <SelectItem value="manager">Gerente</SelectItem>
                    <SelectItem value="user">Usuário</SelectItem>
                  </SelectContent>
                </Select>
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
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o departamento" />
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

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="position"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cargo</FormLabel>
                <FormControl>
                  <Input {...field} />
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
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-between pt-4">
          <Button 
            type="button" 
            variant="destructive" 
            onClick={handleDelete}
            disabled={isLoading}
          >
            Excluir
          </Button>
          <div className="space-x-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onComplete}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              Salvar
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
