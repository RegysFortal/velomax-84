import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User } from '@/types';
import { useAuth } from '@/contexts/auth/AuthContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
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
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/components/ui/use-toast';

const userFormSchema = z.object({
  name: z.string().min(3, { message: 'O nome deve ter pelo menos 3 caracteres' }),
  username: z.string().min(3, { message: 'O nome de usuário deve ter pelo menos 3 caracteres' }),
  email: z.string().email({ message: 'Email inválido' }),
  password: z.string().optional(),
  role: z.enum(['admin', 'manager', 'user'], {
    required_error: 'Selecione uma função',
  }),
  department: z.string().optional(),
  position: z.string().optional(),
  phone: z.string().optional(),
  permissions: z.object({
    deliveries: z.boolean().default(false),
    shipments: z.boolean().default(false),
    clients: z.boolean().default(false),
    cities: z.boolean().default(false),
    reports: z.boolean().default(false),
    financial: z.boolean().default(false),
    priceTables: z.boolean().default(false),
    dashboard: z.boolean().default(true),
    logbook: z.boolean().default(false),
    employees: z.boolean().default(false),
    vehicles: z.boolean().default(false),
    maintenance: z.boolean().default(false),
    settings: z.boolean().default(false),
  }).default({
    deliveries: false,
    shipments: false,
    clients: false,
    cities: false,
    reports: false,
    financial: false,
    priceTables: false,
    dashboard: true,
    logbook: false,
    employees: false,
    vehicles: false,
    maintenance: false,
    settings: false,
  }),
});

type UserFormValues = z.infer<typeof userFormSchema>;

interface UserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
  isCreating: boolean;
  onClose: () => void;
}

export function UserDialog({ open, onOpenChange, user, isCreating, onClose }: UserDialogProps) {
  const { createUser, updateUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: '',
      username: '',
      email: '',
      password: '',
      role: 'user' as const,
      department: '',
      position: '',
      phone: '',
      permissions: {
        deliveries: false,
        shipments: false,
        clients: false,
        cities: false,
        reports: false,
        financial: false,
        priceTables: false,
        dashboard: true,
        logbook: false,
        employees: false,
        vehicles: false,
        maintenance: false,
        settings: false,
      },
    },
  });

  useEffect(() => {
    if (open) {
      if (isCreating) {
        form.reset({
          name: '',
          username: '',
          email: '',
          password: '',
          role: 'user',
          department: '',
          position: '',
          phone: '',
          permissions: {
            deliveries: false,
            shipments: false,
            clients: false,
            cities: false,
            reports: false,
            financial: false,
            priceTables: false,
            dashboard: true,
            logbook: false,
            employees: false,
            vehicles: false,
            maintenance: false,
            settings: false,
          },
        });
      } else if (user) {
        let roleValue: 'user' | 'admin' | 'manager' = 'user';
        if (user.role === 'admin' || user.role === 'manager') {
          roleValue = user.role;
        }
        
        form.reset({
          name: user.name,
          username: user.username,
          email: user.email,
          password: '',
          role: roleValue,
          department: user.department || '',
          position: user.position || '',
          phone: user.phone || '',
          permissions: user.permissions || {
            deliveries: false,
            shipments: false,
            clients: false,
            cities: false,
            reports: false,
            financial: false,
            priceTables: false,
            dashboard: true,
            logbook: false,
            employees: false,
            vehicles: false,
            maintenance: false,
            settings: false,
          },
        });
      }
    }
  }, [form, user, open, isCreating]);

  const onSubmit = async (data: UserFormValues) => {
    setIsSubmitting(true);
    try {
      if (isCreating) {
        if (!data.password) {
          toast({
            title: "Senha obrigatória",
            description: "Você deve fornecer uma senha para o novo usuário.",
            variant: "destructive",
          });
          setIsSubmitting(false);
          return;
        }

        const completePermissions = {
          deliveries: data.permissions.deliveries || false,
          shipments: data.permissions.shipments || false,
          clients: data.permissions.clients || false,
          cities: data.permissions.cities || false,
          reports: data.permissions.reports || false,
          financial: data.permissions.financial || false,
          priceTables: data.permissions.priceTables || false,
          dashboard: data.permissions.dashboard || true,
          logbook: data.permissions.logbook || false,
          employees: data.permissions.employees || false,
          vehicles: data.permissions.vehicles || false,
          maintenance: data.permissions.maintenance || false,
          settings: data.permissions.settings || false,
        };

        const newUser = await createUser({
          name: data.name,
          username: data.username,
          email: data.email,
          password: data.password,
          role: data.role,
          department: data.department,
          position: data.position,
          phone: data.phone,
          permissions: completePermissions,
          updatedAt: new Date().toISOString(),
        });

        toast({
          title: "Usuário criado",
          description: `O usuário ${newUser.name} foi criado com sucesso.`,
        });
      } else if (user) {
        const updatedPermissions = {
          deliveries: data.permissions.deliveries || false,
          shipments: data.permissions.shipments || false,
          clients: data.permissions.clients || false,
          cities: data.permissions.cities || false,
          reports: data.permissions.reports || false,
          financial: data.permissions.financial || false,
          priceTables: data.permissions.priceTables || false,
          dashboard: data.permissions.dashboard || true,
          logbook: data.permissions.logbook || false,
          employees: data.permissions.employees || false,
          vehicles: data.permissions.vehicles || false,
          maintenance: data.permissions.maintenance || false,
          settings: data.permissions.settings || false,
        };

        const updatedUser: Partial<User> = {
          name: data.name,
          username: data.username,
          email: data.email,
          role: data.role,
          department: data.department,
          position: data.position,
          phone: data.phone,
          permissions: updatedPermissions,
          updatedAt: new Date().toISOString(),
        };

        if (data.password) {
          updatedUser.password = data.password;
        }

        await updateUser(user.id, updatedUser);
        toast({
          title: "Usuário atualizado",
          description: `As informações do usuário ${user.name} foram atualizadas com sucesso.`,
        });
      }

      onClose();
    } catch (error) {
      console.error('Error saving user:', error);
      toast({
        title: "Erro ao salvar usuário",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao salvar as informações do usuário.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isCreating ? 'Criar Novo Usuário' : 'Editar Usuário'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{isCreating ? 'Senha' : 'Nova Senha (opcional)'}</FormLabel>
                    <FormControl>
                      <Input {...field} type="password" placeholder={isCreating ? '' : 'Deixe em branco para manter a senha atual'} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                          <SelectValue placeholder="Selecione uma função" />
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

            <div className="space-y-4">
              <h3 className="text-md font-medium">Permissões de Acesso</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="permissions.dashboard"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="font-normal cursor-pointer">
                        Dashboard
                      </FormLabel>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="permissions.clients"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="font-normal cursor-pointer">
                        Clientes
                      </FormLabel>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="permissions.deliveries"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="font-normal cursor-pointer">
                        Entregas
                      </FormLabel>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="permissions.priceTables"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="font-normal cursor-pointer">
                        Tabelas de Preço
                      </FormLabel>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="permissions.cities"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="font-normal cursor-pointer">
                        Cidades
                      </FormLabel>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="permissions.reports"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="font-normal cursor-pointer">
                        Relatórios
                      </FormLabel>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="permissions.financial"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="font-normal cursor-pointer">
                        Financeiro
                      </FormLabel>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="permissions.logbook"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="font-normal cursor-pointer">
                        Diário de Bordo
                      </FormLabel>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="permissions.vehicles"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="font-normal cursor-pointer">
                        Veículos
                      </FormLabel>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="permissions.employees"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="font-normal cursor-pointer">
                        Funcionários
                      </FormLabel>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="permissions.maintenance"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="font-normal cursor-pointer">
                        Manutenção
                      </FormLabel>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="permissions.shipments"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="font-normal cursor-pointer">
                        Transportadoras
                      </FormLabel>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="permissions.settings"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="font-normal cursor-pointer">
                        Configurações
                      </FormLabel>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Salvando...' : isCreating ? 'Criar' : 'Atualizar'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
