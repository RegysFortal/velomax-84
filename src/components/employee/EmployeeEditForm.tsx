
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
import {
  RadioGroup,
  RadioGroupItem,
} from '@/components/ui/radio-group';
import { useAuth } from '@/contexts/auth/AuthContext';
import { toast } from "sonner";

// Define the validation schema
const employeeFormSchema = z.object({
  name: z.string().min(3, { message: 'O nome deve ter pelo menos 3 caracteres' }),
  email: z.string().email({ message: 'Email inválido' }),
  username: z.string().min(3, { message: 'Nome de usuário deve ter pelo menos 3 caracteres' }).optional().or(z.literal('')),
  password: z.string().min(6, { message: 'A senha deve ter pelo menos 6 caracteres' }).optional().or(z.literal('')),
  role: z.enum(['admin', 'manager', 'user'], {
    required_error: 'Selecione uma função'
  }),
  department: z.string().min(1, { message: 'Selecione um departamento' }),
  position: z.string().min(1, { message: 'Informe o cargo' }),
  positionType: z.enum(['motorista', 'ajudante', 'outro'], {
    required_error: 'Selecione o tipo de cargo'
  }),
  phone: z.string().optional(),
});

type EmployeeFormValues = z.infer<typeof employeeFormSchema>;

interface EmployeeEditFormProps {
  employee: User | null;
  isCreating?: boolean;
  onComplete: () => void;
}

export function EmployeeEditForm({ employee, isCreating = false, onComplete }: EmployeeEditFormProps) {
  const { updateUser, deleteUser, createUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [positionType, setPositionType] = useState<'motorista' | 'ajudante' | 'outro'>('outro');

  // Initialize form with react-hook-form
  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: {
      name: '',
      email: '',
      username: '',
      password: '',
      role: 'user' as const,
      department: '',
      position: '',
      positionType: 'outro' as const,
      phone: '',
    }
  });

  // Fill the form with employee data when editing
  useEffect(() => {
    if (employee) {
      // Determine the position type based on position string
      let posType: 'motorista' | 'ajudante' | 'outro' = 'outro';
      if (employee.position) {
        const pos = employee.position.toLowerCase();
        if (pos === 'motorista') posType = 'motorista';
        else if (pos === 'ajudante') posType = 'ajudante';
      }
      
      setPositionType(posType);
      
      form.reset({
        name: employee.name,
        email: employee.email,
        username: employee.username || '',
        password: '',  // Don't prefill password
        role: employee.role,
        department: employee.department || '',
        position: employee.position || '',
        positionType: posType,
        phone: employee.phone || '',
      });
    } else if (isCreating) {
      form.reset({
        name: '',
        email: '',
        username: '',
        password: '',
        role: 'user',
        department: '',
        position: '',
        positionType: 'outro',
        phone: '',
      });
    }
  }, [employee, form, isCreating]);

  // Handle position type change
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'positionType') {
        const posType = value.positionType as 'motorista' | 'ajudante' | 'outro';
        setPositionType(posType);
        
        // Auto-set position field based on position type
        if (posType === 'motorista') {
          form.setValue('position', 'Motorista');
        } else if (posType === 'ajudante') {
          form.setValue('position', 'Ajudante');
        } else if (posType === 'outro' && (value.position === 'Motorista' || value.position === 'Ajudante')) {
          form.setValue('position', '');
        }
      }
    });
    
    return () => subscription.unsubscribe();
  }, [form]);

  const onSubmit = async (data: EmployeeFormValues) => {
    setIsLoading(true);
    
    try {
      if (isCreating) {
        if (!data.username || !data.password) {
          toast.error('Nome de usuário e senha são obrigatórios para novos colaboradores');
          setIsLoading(false);
          return;
        }
        
        const newUser = await createUser({
          name: data.name,
          email: data.email,
          username: data.username,
          password: data.password,
          role: data.role,
          department: data.department,
          position: data.position,
          phone: data.phone,
          permissions: {
            dashboard: true,
            deliveries: data.role !== 'user',
            shipments: data.role !== 'user',
            clients: data.role !== 'user',
            cities: data.role === 'admin',
            reports: data.role !== 'user',
            financial: data.role === 'admin',
            priceTables: data.role === 'admin',
            logbook: true,
            employees: data.role === 'admin',
            vehicles: data.role !== 'user',
            maintenance: data.role !== 'user',
            settings: data.role === 'admin',
          },
          updatedAt: new Date().toISOString(),
        });
        
        toast.success('Colaborador criado com sucesso');
      } else if (employee) {
        const updateData: Partial<User> = {
          name: data.name,
          email: data.email,
          role: data.role,
          department: data.department,
          position: data.position,
          phone: data.phone,
        };
        
        // Only update username and password if provided
        if (data.username) updateData.username = data.username;
        if (data.password) updateData.password = data.password;
        
        await updateUser(employee.id, updateData);
        toast.success('Colaborador atualizado com sucesso');
      }
      
      onComplete();
    } catch (error) {
      console.error('Error saving employee:', error);
      toast.error('Erro ao salvar colaborador');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!employee) return;
    
    if (confirm(`Tem certeza que deseja excluir o colaborador ${employee.name}?`)) {
      setIsLoading(true);
      try {
        await deleteUser(employee.id);
        toast.success('Colaborador excluído com sucesso');
        onComplete();
      } catch (error) {
        console.error('Error deleting employee:', error);
        toast.error('Erro ao excluir colaborador');
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

        {isCreating && (
          <>
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome de Usuário</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Função no Sistema</FormLabel>
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

        <FormField
          control={form.control}
          name="positionType"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Tipo de Cargo</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                  className="flex space-x-4"
                >
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="motorista" />
                    </FormControl>
                    <FormLabel className="font-normal cursor-pointer">Motorista</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="ajudante" />
                    </FormControl>
                    <FormLabel className="font-normal cursor-pointer">Ajudante</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="outro" />
                    </FormControl>
                    <FormLabel className="font-normal cursor-pointer">Outro</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="position"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cargo</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  disabled={positionType === 'motorista' || positionType === 'ajudante'} 
                />
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

        <div className="flex justify-between pt-4">
          {!isCreating && (
            <Button 
              type="button" 
              variant="destructive" 
              onClick={handleDelete}
              disabled={isLoading}
            >
              Excluir
            </Button>
          )}
          {isCreating && <div />}
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
              {isLoading ? 'Salvando...' : isCreating ? 'Criar' : 'Salvar'}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
