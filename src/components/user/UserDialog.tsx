
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, PermissionLevel } from '@/types';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PermissionsSection } from './table/PermissionsSection';
import { toast } from 'sonner';

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
  const [activeTab, setActiveTab] = useState('basic');
  const [permissions, setPermissions] = useState<Record<string, PermissionLevel>>({});
  
  const defaultPermission: PermissionLevel = {
    view: false,
    create: false,
    edit: false, 
    delete: false
  };

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
    },
  });

  // Inicializa o conjunto de permissões com valores padrão
  const initializePermissions = (userPermissions?: Record<string, any>) => {
    const defaultPermissions: Record<string, PermissionLevel> = {
      dashboard: { ...defaultPermission, view: true }, // Dashboard é sempre visível por padrão
      deliveries: { ...defaultPermission },
      shipments: { ...defaultPermission },
      shipmentReports: { ...defaultPermission },
      financialDashboard: { ...defaultPermission },
      reportsToClose: { ...defaultPermission },
      closing: { ...defaultPermission },
      cities: { ...defaultPermission },
      priceTables: { ...defaultPermission },
      receivableAccounts: { ...defaultPermission },
      payableAccounts: { ...defaultPermission },
      financialReports: { ...defaultPermission },
      vehicles: { ...defaultPermission },
      logbook: { ...defaultPermission },
      maintenance: { ...defaultPermission },
      products: { ...defaultPermission },
      inventoryEntries: { ...defaultPermission },
      inventoryExits: { ...defaultPermission },
      inventoryDashboard: { ...defaultPermission },
      system: { ...defaultPermission },
      company: { ...defaultPermission },
      users: { ...defaultPermission },
      backup: { ...defaultPermission },
    };

    // Se o usuário já tiver permissões, converter do formato antigo para o novo
    if (userPermissions) {
      Object.keys(userPermissions).forEach(key => {
        if (typeof userPermissions[key] === 'boolean') {
          // Formato antigo (boolean)
          if (defaultPermissions[key]) {
            defaultPermissions[key].view = userPermissions[key];
          }
        } else if (typeof userPermissions[key] === 'object') {
          // Já está no novo formato
          defaultPermissions[key] = userPermissions[key];
        }
      });
    }

    return defaultPermissions;
  };

  // Reset form when dialog opens/closes or user changes
  useEffect(() => {
    if (open) {
      console.log("Diálogo aberto, definindo valores do formulário", { isCreating, user });
      
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
        });
        setPermissions(initializePermissions());
      } else if (user) {
        // Determine correct role value
        let roleValue: 'user' | 'admin' | 'manager' = 'user';
        if (user.role === 'admin' || user.role === 'manager') {
          roleValue = user.role;
        }
        
        console.log("Definindo valores do formulário para usuário existente", { 
          name: user.name || '',
          username: user.username || '',
          email: user.email || '',
          role: roleValue,
          permissions: user.permissions
        });
        
        form.reset({
          name: user.name || '',
          username: user.username || '',
          email: user.email || '',
          password: '',
          role: roleValue,
          department: user.department || '',
          position: user.position || '',
          phone: user.phone || '',
        });

        // Inicializar permissões a partir do usuário existente
        setPermissions(initializePermissions(user.permissions));
      }

      // Reset para a primeira aba
      setActiveTab('basic');
    }
  }, [form, user, open, isCreating]);

  // Atualiza permissões quando o papel é alterado
  useEffect(() => {
    const role = form.watch('role');
    
    if (role === 'admin') {
      // Administradores têm acesso total a tudo
      const adminPermissions: Record<string, PermissionLevel> = {};
      Object.keys(permissions).forEach(key => {
        adminPermissions[key] = {
          view: true,
          create: true,
          edit: true,
          delete: true
        };
      });
      setPermissions(adminPermissions);
    } else if (role === 'manager' && isCreating) {
      // Gerentes têm acesso a mais recursos, mas não todos
      const managerPermissions = initializePermissions();
      
      // Definir permissões padrão para gerentes
      ['dashboard', 'deliveries', 'shipments', 'shipmentReports', 'cities',
       'vehicles', 'logbook', 'maintenance', 'financialDashboard',
       'reportsToClose', 'closing', 'receivableAccounts', 'payableAccounts',
       'priceTables', 'financialReports', 'backup'].forEach(key => {
        if (managerPermissions[key]) {
          managerPermissions[key].view = true;
          managerPermissions[key].create = true;
          managerPermissions[key].edit = true;
          managerPermissions[key].delete = key !== 'backup'; // Gerentes não podem excluir backups
        }
      });

      setPermissions(managerPermissions);
    } else if (role === 'user' && isCreating) {
      // Usuários comuns têm acesso limitado
      const userPermissions = initializePermissions();
      
      // Definir permissões padrão para usuários
      ['dashboard', 'deliveries', 'shipments'].forEach(key => {
        if (userPermissions[key]) {
          userPermissions[key].view = true;
          userPermissions[key].create = false;
          userPermissions[key].edit = false;
          userPermissions[key].delete = false;
        }
      });
      
      setPermissions(userPermissions);
    }
  }, [form.watch('role'), isCreating]);

  // Manipulador para alterar permissões individuais
  const handlePermissionChange = (name: string, level: keyof PermissionLevel, value: boolean) => {
    setPermissions(prev => ({
      ...prev,
      [name]: {
        ...prev[name],
        [level]: value
      }
    }));
  };

  const onSubmit = async (data: UserFormValues) => {
    console.log("Formulário enviado com dados:", data);
    setIsSubmitting(true);
    
    try {
      if (isCreating) {
        if (!data.password) {
          toast.error("Senha obrigatória", {
            description: "Você deve fornecer uma senha para o novo usuário.",
          });
          setIsSubmitting(false);
          return;
        }

        console.log("Criando novo usuário com permissões:", permissions);
        const newUser = await createUser({
          name: data.name,
          username: data.username,
          email: data.email,
          password: data.password,
          role: data.role,
          department: data.department,
          position: data.position,
          phone: data.phone,
          permissions: permissions,
          updatedAt: new Date().toISOString(),
        });

        toast.success("Usuário criado", {
          description: `O usuário ${newUser.name} foi criado com sucesso.`,
        });
      } else if (user) {
        const updatedUser: Partial<User> = {
          name: data.name,
          username: data.username,
          email: data.email,
          role: data.role,
          department: data.department,
          position: data.position,
          phone: data.phone,
          permissions: permissions,
          updatedAt: new Date().toISOString(),
        };

        console.log("Atualizando usuário com ID:", user.id, "e dados:", updatedUser);
        
        if (data.password) {
          updatedUser.password = data.password;
        }

        await updateUser(user.id, updatedUser);
        toast.success("Usuário atualizado", {
          description: `As informações do usuário ${user.name} foram atualizadas com sucesso.`,
        });
      }

      onClose();
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
      toast.error("Erro ao salvar usuário", {
        description: error instanceof Error ? error.message : "Ocorreu um erro ao salvar as informações do usuário.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isAdmin = form.watch('role') === 'admin';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isCreating ? 'Criar Novo Usuário' : 'Editar Usuário'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="basic">Informações Básicas</TabsTrigger>
                <TabsTrigger value="permissions">Permissões de Acesso</TabsTrigger>
              </TabsList>
              
              <TabsContent value="basic" className="space-y-4">
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
              </TabsContent>
              
              <TabsContent value="permissions">
                <div className="space-y-4">
                  <div className="pb-2">
                    <p className="text-sm text-muted-foreground">
                      {isAdmin 
                        ? 'Administradores têm acesso total a todos os recursos do sistema.' 
                        : 'Configure as permissões de acesso para este usuário:'}
                    </p>
                  </div>
                  <PermissionsSection 
                    permissions={permissions} 
                    onChange={handlePermissionChange}
                    isAdmin={isAdmin}
                  />
                </div>
              </TabsContent>
            </Tabs>

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
