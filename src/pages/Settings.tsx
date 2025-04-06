import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
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
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Plus, User, Settings as SettingsIcon, ShieldCheck } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const initialUserState = {
  name: '',
  username: '',
  email: '',
  role: 'user',
};

const userSchema = z.object({
  name: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres." }),
  username: z.string().min(3, { message: "Nome de usuário deve ter pelo menos 3 caracteres." }),
  email: z.string().email({ message: "Email inválido." }),
  role: z.enum(['admin', 'manager', 'user'], {
    required_error: "Selecione uma função."
  }),
});

type UserFormValues = z.infer<typeof userSchema>;

const getPermissionsFromRole = (role: string) => {
  switch (role) {
    case 'admin':
      return {
        deliveries: true,
        shipments: true,
        clients: true,
        cities: true,
        reports: true,
        financial: true,
        priceTables: true,
        dashboard: true,
        logbook: true,
        employees: true,
        vehicles: true,
        maintenance: true,
        settings: true,
      };
    case 'manager':
      return {
        deliveries: true,
        shipments: true,
        clients: true,
        cities: true,
        reports: true,
        financial: true,
        priceTables: true,
        dashboard: true,
        logbook: true,
        employees: false,
        vehicles: false,
        maintenance: false,
        settings: false,
      };
    default:
      return {
        deliveries: true,
        shipments: true,
        clients: true,
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
      };
  }
};

export default function Settings() {
  const [activeTab, setActiveTab] = useState('general');
  const [newUser, setNewUser] = useState(initialUserState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCreateUserDialog, setShowCreateUserDialog] = useState(false);
  const { user, users, updateUserProfile, createUser, updatePassword, deleteUser } = useAuth();
  const { toast } = useToast();

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: '',
      email: '',
      username: '',
      role: 'user',
    },
  });

  useEffect(() => {
    if (user) {
      setNewUser({
        name: user.name,
        username: user.username || '',
        email: user.email,
        role: user.role,
      });
    }
  }, [user]);

  const isFormValid = () => {
    try {
      userSchema.parse(newUser);
      return true;
    } catch (error) {
      console.error("Form validation error:", error);
      toast({
        title: "Erro de validação",
        description: "Por favor, preencha todos os campos corretamente.",
        variant: "destructive",
      });
      return false;
    }
  };

  const handleCreateUser = async () => {
    if (!isFormValid()) return;

    try {
      setIsSubmitting(true);
      
      const userData = {
        name: newUser.name,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role as 'admin' | 'manager' | 'user',
        permissions: getPermissionsFromRole(newUser.role),
        updatedAt: new Date().toISOString(),
      };
      
      await createUser(userData);
      
      toast.success('Usuário criado com sucesso');
      setNewUser(initialUserState);
      setActiveTab('general');
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error('Erro ao criar usuário');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePermissionChange = async (permission: string, value: boolean) => {
    if (!user) return;

    try {
      setIsSubmitting(true);
      const updatedPermissions = {
        ...user.permissions,
        [permission]: value,
      };

      await updateUserProfile({ permissions: updatedPermissions });
      toast.success('Permissões atualizadas com sucesso');
    } catch (error) {
      console.error('Error updating permissions:', error);
      toast.error('Erro ao atualizar permissões');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdatePassword = async (data: PasswordFormData) => {
    try {
      await updatePassword(data.currentPassword, data.newPassword);
      toast({
        title: "Senha atualizada",
        description: "Sua senha foi atualizada com sucesso.",
      });
      passwordForm.reset();
    } catch (error) {
      toast({
        title: "Erro ao atualizar senha",
        description: "Não foi possível atualizar sua senha. Verifique se a senha atual está correta.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      await deleteUser(id);
      toast({
        title: "Usuário excluído",
        description: "O usuário foi excluído com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro ao excluir usuário",
        description: "Não foi possível excluir o usuário.",
        variant: "destructive",
      });
    }
  };

  return (
    <AppLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
          <p className="text-muted-foreground">
            Gerencie as configurações da sua conta e da empresa.
          </p>
        </div>
        <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="general">Geral</TabsTrigger>
            <TabsTrigger value="security">Segurança</TabsTrigger>
            {user?.role === 'admin' && (
              <TabsTrigger value="users">Usuários</TabsTrigger>
            )}
          </TabsList>
          <TabsContent value="general" className="space-y-6 pt-6">
            <ProfileUpdateForm />
          </TabsContent>
          <TabsContent value="security" className="space-y-6 pt-6">
            <PasswordUpdateForm />
          </TabsContent>
          {user?.role === 'admin' && (
            <TabsContent value="users" className="space-y-6 pt-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle>Gerenciar Usuários</CardTitle>
                  <Dialog open={showCreateUserDialog} onOpenChange={setShowCreateUserDialog}>
                    <DialogTrigger asChild>
                      <Button variant="outline">Criar Novo Usuário</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Criar Novo Usuário</DialogTitle>
                        <DialogDescription>
                          Crie um novo usuário para acessar o sistema.
                        </DialogDescription>
                      </DialogHeader>
                      <Form {...form}>
                        <div className="grid gap-4 py-4">
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Nome</FormLabel>
                                <FormControl>
                                  <Input placeholder="Nome completo" {...field} value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} />
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
                                  <Input placeholder="Nome de usuário" {...field} value={newUser.username} onChange={(e) => setNewUser({ ...newUser, username: e.target.value })} />
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
                                  <Input type="email" placeholder="Email" {...field} value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} />
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
                                <Select onValueChange={(value) => setNewUser({ ...newUser, role: value })} defaultValue={newUser.role}>
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
                        </div>
                        <Button type="submit" onClick={handleCreateUser} disabled={isSubmitting}>
                          {isSubmitting ? 'Criando...' : 'Criar Usuário'}
                        </Button>
                      </Form>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {users.map((existingUser) => (
                      <div key={existingUser.id} className="border rounded-md p-4">
                        <div className="font-bold">{existingUser.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {existingUser.email} | {existingUser.role}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </AppLayout>
  );
}
