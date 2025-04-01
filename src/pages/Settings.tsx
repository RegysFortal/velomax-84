
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/contexts/AuthContext';
import { AppLayout } from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
import { User } from '@/types';
import { PenLine, Trash2, UserPlus, LockKeyhole } from 'lucide-react';

type UserFormData = {
  name: string;
  username: string;
  password: string;
  role: 'admin' | 'manager' | 'user';
  permissions: {
    clients: boolean;
    cities: boolean;
    reports: boolean;
    financial: boolean;
    priceTables: boolean;
    settings: boolean;
  };
};

type SystemSettingsData = {
  companyName: string;
  companyLogo: string;
  companyAddress: string;
  companyPhone: string;
  companyEmail: string;
  taxId: string;
  defaultCurrency: string;
  dateFormat: string;
  timeFormat: string;
  theme: string;
};

const SettingsPage = () => {
  const { user, updateUser, users, addUser, deleteUser, updateSystemSettings, systemSettings } = useAuth();
  const [activeTab, setActiveTab] = useState('general');
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    userId: '',
    newPassword: '',
    confirmPassword: '',
  });

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<SystemSettingsData>({
    defaultValues: systemSettings || {
      companyName: 'Velomax Transportes',
      companyLogo: '',
      companyAddress: 'Av. Principal, 1000 - Fortaleza, CE',
      companyPhone: '(85) 3333-3333',
      companyEmail: 'contato@velomaxtransportes.com.br',
      taxId: '12.345.678/0001-90',
      defaultCurrency: 'BRL',
      dateFormat: 'dd/MM/yyyy',
      timeFormat: 'HH:mm',
      theme: 'light',
    },
  });

  const { register: registerUser, handleSubmit: handleSubmitUser, reset: resetUser, setValue: setUserValue, watch: watchUser } = useForm<UserFormData>({
    defaultValues: {
      name: '',
      username: '',
      password: '',
      role: 'user',
      permissions: {
        clients: false,
        cities: false,
        reports: false,
        financial: false,
        priceTables: false,
        settings: false,
      },
    }
  });

  useEffect(() => {
    if (systemSettings) {
      reset(systemSettings);
    }
  }, [systemSettings, reset]);

  const onSubmitSettings = (data: SystemSettingsData) => {
    updateSystemSettings(data);
    toast({
      title: "Configurações atualizadas",
      description: "As configurações do sistema foram salvas com sucesso."
    });
  };

  const handleEditUser = (userId: string) => {
    setEditingUserId(userId);
    const userToEdit = users.find(u => u.id === userId);
    
    if (userToEdit) {
      setUserValue('name', userToEdit.name);
      setUserValue('username', userToEdit.username);
      setUserValue('role', userToEdit.role);
      
      if (userToEdit.permissions) {
        setUserValue('permissions.clients', userToEdit.permissions.clients);
        setUserValue('permissions.cities', userToEdit.permissions.cities);
        setUserValue('permissions.reports', userToEdit.permissions.reports);
        setUserValue('permissions.financial', userToEdit.permissions.financial);
        setUserValue('permissions.priceTables', userToEdit.permissions.priceTables);
        setUserValue('permissions.settings', userToEdit.permissions.settings);
      }
    }
    
    setIsAddUserDialogOpen(true);
  };

  const handleDeleteUser = (userId: string) => {
    deleteUser(userId);
    toast({
      title: "Usuário removido",
      description: "O usuário foi removido com sucesso."
    });
  };

  const onSubmitUser = (data: UserFormData) => {
    if (editingUserId) {
      // Update existing user
      updateUser(editingUserId, {
        name: data.name,
        username: data.username,
        role: data.role,
        permissions: data.permissions,
      });
      
      toast({
        title: "Usuário atualizado",
        description: "As informações do usuário foram atualizadas com sucesso."
      });
    } else {
      // Add new user
      addUser({
        name: data.name,
        username: data.username,
        password: data.password,
        role: data.role,
        permissions: data.permissions,
      });
      
      toast({
        title: "Usuário adicionado",
        description: "O novo usuário foi adicionado com sucesso."
      });
    }
    
    resetUser();
    setIsAddUserDialogOpen(false);
    setEditingUserId(null);
  };

  const handleOpenAddUserDialog = () => {
    resetUser({
      name: '',
      username: '',
      password: '',
      role: 'user',
      permissions: {
        clients: false,
        cities: false,
        reports: false,
        financial: false,
        priceTables: false,
        settings: false,
      },
    });
    setEditingUserId(null);
    setIsAddUserDialogOpen(true);
  };

  const handleOpenChangePassword = (userId: string) => {
    setPasswordData({
      userId,
      newPassword: '',
      confirmPassword: '',
    });
    setIsChangePasswordOpen(true);
  };

  const handleChangePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Erro na alteração de senha",
        description: "As senhas não coincidem. Por favor, tente novamente.",
        variant: "destructive",
      });
      return;
    }

    updateUser(passwordData.userId, {
      password: passwordData.newPassword,
    });

    toast({
      title: "Senha atualizada",
      description: "A senha do usuário foi atualizada com sucesso."
    });

    setIsChangePasswordOpen(false);
    setPasswordData({
      userId: '',
      newPassword: '',
      confirmPassword: '',
    });
  };

  const watchRole = watchUser('role');
  const isAdminOrManager = watchRole === 'admin' || watchRole === 'manager';

  return (
    <AppLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
          <p className="text-muted-foreground">
            Configure as opções do sistema e gerenciamento de usuários
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="general">Configurações Gerais</TabsTrigger>
            <TabsTrigger value="users">Usuários</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>Configurações da Empresa</CardTitle>
                <CardDescription>
                  Configure as informações básicas da sua empresa.
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleSubmit(onSubmitSettings)}>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Nome da Empresa</Label>
                      <Input id="companyName" {...register('companyName')} />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="taxId">CNPJ</Label>
                      <Input id="taxId" {...register('taxId')} />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="companyAddress">Endereço</Label>
                    <Input id="companyAddress" {...register('companyAddress')} />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="companyPhone">Telefone</Label>
                      <Input id="companyPhone" {...register('companyPhone')} />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="companyEmail">Email</Label>
                      <Input id="companyEmail" type="email" {...register('companyEmail')} />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="defaultCurrency">Moeda Padrão</Label>
                      <Select 
                        value={watch('defaultCurrency')} 
                        onValueChange={(value) => setValue('defaultCurrency', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a moeda" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="BRL">Real Brasileiro (R$)</SelectItem>
                          <SelectItem value="USD">Dólar Americano ($)</SelectItem>
                          <SelectItem value="EUR">Euro (€)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="dateFormat">Formato de Data</Label>
                      <Select 
                        value={watch('dateFormat')} 
                        onValueChange={(value) => setValue('dateFormat', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o formato" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="dd/MM/yyyy">DD/MM/AAAA</SelectItem>
                          <SelectItem value="MM/dd/yyyy">MM/DD/AAAA</SelectItem>
                          <SelectItem value="yyyy-MM-dd">AAAA-MM-DD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="timeFormat">Formato de Hora</Label>
                      <Select 
                        value={watch('timeFormat')} 
                        onValueChange={(value) => setValue('timeFormat', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o formato" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="HH:mm">24 horas (14:30)</SelectItem>
                          <SelectItem value="hh:mm a">12 horas (02:30 PM)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="theme">Tema do Sistema</Label>
                    <Select 
                      value={watch('theme')} 
                      onValueChange={(value) => setValue('theme', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tema" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Claro</SelectItem>
                        <SelectItem value="dark">Escuro</SelectItem>
                        <SelectItem value="system">Sistema (Automático)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit">Salvar Configurações</Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
          
          <TabsContent value="users">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Gerenciar Usuários</CardTitle>
                  <CardDescription>
                    Adicione, edite ou remova usuários do sistema.
                  </CardDescription>
                </div>
                <Button onClick={handleOpenAddUserDialog}>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Novo Usuário
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Usuário</TableHead>
                      <TableHead>Perfil</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.username}</TableCell>
                        <TableCell>
                          {user.role === 'admin' && 'Administrador'}
                          {user.role === 'manager' && 'Gerente'}
                          {user.role === 'user' && 'Usuário'}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleOpenChangePassword(user.id)}
                            >
                              <LockKeyhole className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleEditUser(user.id)}
                            >
                              <PenLine className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Tem certeza que deseja excluir o usuário "{user.name}"?
                                    Esta ação não pode ser desfeita.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => handleDeleteUser(user.id)}
                                  >
                                    Excluir
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Add/Edit User Dialog */}
        <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editingUserId ? 'Editar Usuário' : 'Adicionar Novo Usuário'}
              </DialogTitle>
              <DialogDescription>
                {editingUserId 
                  ? 'Atualize os detalhes do usuário abaixo.' 
                  : 'Preencha os detalhes do novo usuário abaixo.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmitUser(onSubmitUser)}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome Completo</Label>
                    <Input 
                      id="name" 
                      {...registerUser('name', { required: true })} 
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="username">Nome de Usuário</Label>
                    <Input 
                      id="username" 
                      {...registerUser('username', { required: true })} 
                      required
                    />
                  </div>
                  
                  {!editingUserId && (
                    <div className="space-y-2">
                      <Label htmlFor="password">Senha</Label>
                      <Input 
                        id="password" 
                        type="password" 
                        {...registerUser('password', { required: !editingUserId })}
                        required={!editingUserId} 
                      />
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="role">Perfil</Label>
                    <Select 
                      value={watchUser('role')} 
                      onValueChange={(value: 'admin' | 'manager' | 'user') => setUserValue('role', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o perfil" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Administrador</SelectItem>
                        <SelectItem value="manager">Gerente</SelectItem>
                        <SelectItem value="user">Usuário</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-4 mt-2">
                    <Label>Permissões</Label>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="permClients">Clientes</Label>
                        <Switch 
                          id="permClients" 
                          checked={watchUser('permissions.clients')}
                          onCheckedChange={(checked) => 
                            setUserValue('permissions.clients', checked)
                          }
                          disabled={watchRole === 'admin'}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label htmlFor="permCities">Cidades</Label>
                        <Switch 
                          id="permCities" 
                          checked={watchUser('permissions.cities')}
                          onCheckedChange={(checked) => 
                            setUserValue('permissions.cities', checked)
                          }
                          disabled={watchRole === 'admin'}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label htmlFor="permReports">Relatórios</Label>
                        <Switch 
                          id="permReports" 
                          checked={watchUser('permissions.reports')}
                          onCheckedChange={(checked) => 
                            setUserValue('permissions.reports', checked)
                          }
                          disabled={watchRole === 'admin'}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label htmlFor="permFinancial">Financeiro</Label>
                        <Switch 
                          id="permFinancial" 
                          checked={watchUser('permissions.financial')}
                          onCheckedChange={(checked) => 
                            setUserValue('permissions.financial', checked)
                          }
                          disabled={watchRole === 'admin'}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label htmlFor="permPriceTables">Tabelas de Preços</Label>
                        <Switch 
                          id="permPriceTables" 
                          checked={watchUser('permissions.priceTables')}
                          onCheckedChange={(checked) => 
                            setUserValue('permissions.priceTables', checked)
                          }
                          disabled={watchRole === 'admin'}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label htmlFor="permSettings">Configurações</Label>
                        <Switch 
                          id="permSettings" 
                          checked={watchUser('permissions.settings')}
                          onCheckedChange={(checked) => 
                            setUserValue('permissions.settings', checked)
                          }
                          disabled={watchRole === 'admin'}
                        />
                      </div>
                    </div>
                    
                    {isAdminOrManager && (
                      <div className="text-sm text-muted-foreground">
                        Administradores possuem acesso completo a todas as funcionalidades do sistema.
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">
                  {editingUserId ? 'Atualizar' : 'Adicionar'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Change Password Dialog */}
        <Dialog open={isChangePasswordOpen} onOpenChange={setIsChangePasswordOpen}>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>Alterar Senha</DialogTitle>
              <DialogDescription>
                Digite a nova senha para o usuário.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="newPassword">Nova Senha</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleChangePassword}>Salvar Senha</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
};

export default SettingsPage;
