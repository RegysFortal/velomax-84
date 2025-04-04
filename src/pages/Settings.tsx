import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useCities } from '@/contexts/CitiesContext';
import { useClients } from '@/contexts/ClientsContext';
import { useDeliveries } from '@/contexts/DeliveriesContext';
import { useLogbook } from '@/contexts/LogbookContext';
import { useShipments } from '@/contexts/ShipmentsContext';
import { usePriceTables } from '@/contexts/PriceTablesContext';
import { useFinancial } from '@/contexts/FinancialContext';
import { AppLayout } from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
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
import { PenLine, Trash2, UserPlus, LockKeyhole, Save, UploadCloud, Download, X, Check } from 'lucide-react';

type UserFormData = {
  name: string;
  username: string;
  password: string;
  role: 'admin' | 'manager' | 'user';
  permissions: {
    // Operational permissions
    deliveries: boolean;
    shipments: boolean;
    
    // Financial permissions
    clients: boolean;
    cities: boolean;
    reports: boolean;
    financial: boolean;
    priceTables: boolean;
    
    // Management permissions
    dashboard: boolean;
    logbook: boolean;
    employees: boolean;
    vehicles: boolean;
    maintenance: boolean;
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

const defaultSettings: SystemSettingsData = {
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
};

const SettingsPage = () => {
  const { user, updateUserProfile, users, createUser, deleteUser, resetUserPassword, loading } = useAuth();
  const { theme, setTheme } = useTheme();
  const { cities } = useCities();
  const { clients } = useClients();
  const { deliveries } = useDeliveries();
  const { entries, fuelRecords } = useLogbook();
  const { shipments } = useShipments();
  const { priceTables } = usePriceTables();
  const { financialReports } = useFinancial();
  
  const [activeTab, setActiveTab] = useState('general');
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isBackupDialogOpen, setIsBackupDialogOpen] = useState(false);
  const [isRestoreDialogOpen, setIsRestoreDialogOpen] = useState(false);
  const [backupFile, setBackupFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [passwordData, setPasswordData] = useState({
    userId: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [systemSettings, setSystemSettings] = useState<SystemSettingsData>(defaultSettings);
  const { toast } = useToast();

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<SystemSettingsData>({
    defaultValues: systemSettings
  });

  const { register: registerUser, handleSubmit: handleSubmitUser, reset: resetUser, setValue: setUserValue, watch: watchUser } = useForm<UserFormData>({
    defaultValues: {
      name: '',
      username: '',
      password: '',
      role: 'user',
      permissions: {
        // Operational permissions
        deliveries: false,
        shipments: false,
        
        // Financial permissions
        clients: false,
        cities: false,
        reports: false,
        financial: false,
        priceTables: false,
        
        // Management permissions
        dashboard: true, // Default to true for dashboard
        logbook: false,
        employees: false,
        vehicles: false,
        maintenance: false,
        settings: false,
      },
    }
  });

  useEffect(() => {
    const storedSettings = localStorage.getItem('velomax_settings');
    if (storedSettings) {
      try {
        const parsedSettings = JSON.parse(storedSettings);
        setSystemSettings(parsedSettings);
        reset(parsedSettings);
      } catch (error) {
        console.error('Failed to parse stored settings', error);
      }
    }
  }, [reset]);

  useEffect(() => {
    setValue('theme', theme);
  }, [theme, setValue]);

  const updateSystemSettings = (data: SystemSettingsData) => {
    setSystemSettings(data);
    localStorage.setItem('velomax_settings', JSON.stringify(data));

    if (data.theme !== theme) {
      setTheme(data.theme as any);
    }
  };

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
        Object.entries(userToEdit.permissions).forEach(([key, value]) => {
          setUserValue(`permissions.${key}` as any, value);
        });
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

  const onSubmitUser = async (data: UserFormData) => {
    try {
      setIsSaving(true);
      
      setIsAddUserDialogOpen(false);
      
      if (editingUserId) {
        const userData = {
          name: data.name,
          username: data.username,
          role: data.role,
          permissions: data.permissions,
        };
        
        await updateUserProfile(editingUserId, userData);
        
        toast({
          title: "Usuário atualizado",
          description: "As informações do usuário foram atualizadas com sucesso."
        });
      } else {
        await createUser({
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
      setEditingUserId(null);
    } catch (error) {
      console.error("Erro ao salvar usuário:", error);
      setIsAddUserDialogOpen(true);
      toast({
        title: "Erro ao salvar",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao salvar as informações do usuário.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
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
        // Operational permissions
        deliveries: false,
        shipments: false,
        
        // Financial permissions
        clients: false,
        cities: false,
        reports: false,
        financial: false,
        priceTables: false,
        
        // Management permissions
        dashboard: true, // Default to true for dashboard
        logbook: false,
        employees: false,
        vehicles: false,
        maintenance: false,
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

    resetUserPassword(passwordData.userId, passwordData.newPassword);

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

  const createBackup = () => {
    const backup = {
      timestamp: new Date().toISOString(),
      version: "1.0",
      data: {
        settings: systemSettings,
        cities,
        clients,
        deliveries,
        logbook: {
          entries: entries,
          fuelRecords,
        },
        shipments,
        priceTables,
        financialReports,
      }
    };

    const backupData = JSON.stringify(backup, null, 2);
    const blob = new Blob([backupData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    const date = new Date().toISOString().slice(0, 10);
    a.download = `velomax_backup_${date}.json`;
    a.href = url;
    a.click();
    
    URL.revokeObjectURL(url);
    
    toast({
      title: "Backup criado",
      description: "O backup dos dados do sistema foi criado com sucesso."
    });
  };

  const handleBackupFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setBackupFile(e.target.files[0]);
    }
  };

  const restoreBackup = () => {
    if (!backupFile) {
      toast({
        title: "Nenhum arquivo selecionado",
        description: "Por favor, selecione um arquivo de backup para restaurar.",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        if (e.target?.result) {
          const backup = JSON.parse(e.target.result as string);
          
          if (!backup.data || !backup.timestamp || !backup.version) {
            throw new Error("Formato de backup inválido");
          }
          
          if (backup.data.settings) {
            localStorage.setItem('velomax_settings', JSON.stringify(backup.data.settings));
          }
          
          if (backup.data.cities) {
            localStorage.setItem('velomax_cities', JSON.stringify(backup.data.cities));
          }
          
          if (backup.data.clients) {
            localStorage.setItem('velomax_clients', JSON.stringify(backup.data.clients));
          }
          
          if (backup.data.deliveries) {
            localStorage.setItem('velomax_deliveries', JSON.stringify(backup.data.deliveries));
          }
          
          if (backup.data.logbook) {
            if (backup.data.logbook.entries) {
              localStorage.setItem('velomax_logbook_entries', JSON.stringify(backup.data.logbook.entries));
            }
            if (backup.data.logbook.fuelRecords) {
              localStorage.setItem('velomax_fuel_records', JSON.stringify(backup.data.logbook.fuelRecords));
            }
          }
          
          if (backup.data.shipments) {
            localStorage.setItem('velomax_shipments', JSON.stringify(backup.data.shipments));
          }
          
          if (backup.data.priceTables) {
            localStorage.setItem('velomax_price_tables', JSON.stringify(backup.data.priceTables));
          }
          
          if (backup.data.financialReports) {
            localStorage.setItem('velomax_financial_reports', JSON.stringify(backup.data.financialReports));
          }
          
          toast({
            title: "Backup restaurado",
            description: "Os dados do sistema foram restaurados com sucesso. A página será recarregada."
          });
          
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        }
      } catch (error) {
        console.error("Erro ao restaurar backup:", error);
        toast({
          title: "Erro na restauração",
          description: "O arquivo de backup está corrompido ou em formato inválido.",
          variant: "destructive",
        });
      }
    };
    
    reader.readAsText(backupFile);
    setIsRestoreDialogOpen(false);
    setBackupFile(null);
  };

  const watchRole = watchUser('role');
  const isAdmin = watchRole === 'admin';

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
                      onValueChange={(value) => {
                        setValue('theme', value);
                        setTheme(value as any);
                      }}
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
                  
                  <Separator />
                  
                  <CardTitle className="text-lg">Backup e Restauração</CardTitle>
                  <CardDescription>
                    Crie backups dos dados do sistema e restaure quando necessário.
                  </CardDescription>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button 
                      type="button"
                      onClick={createBackup}
                      className="flex gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Fazer Backup
                    </Button>
                    
                    <Dialog open={isRestoreDialogOpen} onOpenChange={setIsRestoreDialogOpen}>
                      <DialogTrigger asChild>
                        <Button 
                          type="button" 
                          variant="outline"
                          className="flex gap-2"
                        >
                          <UploadCloud className="h-4 w-4" />
                          Restaurar Backup
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Restaurar Backup</DialogTitle>
                          <DialogDescription>
                            Selecione um arquivo de backup para restaurar. Isso substituirá todos os dados atuais.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="backupFile">Arquivo de Backup</Label>
                            <Input 
                              id="backupFile" 
                              type="file" 
                              accept=".json" 
                              onChange={handleBackupFileChange}
                            />
                            <p className="text-sm text-muted-foreground">
                              Selecione um arquivo de backup .json criado anteriormente.
                            </p>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setIsRestoreDialogOpen(false)}>Cancelar</Button>
                          <Button onClick={restoreBackup}>Restaurar</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="flex gap-2">
                    <Save className="h-4 w-4" />
                    Salvar Configurações
                  </Button>
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
                <Button onClick={handleOpenAddUserDialog} disabled={isSaving || loading}>
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
                              disabled={isSaving || loading}
                            >
                              <LockKeyhole className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleEditUser(user.id)}
                              disabled={isSaving || loading}
                            >
                              <PenLine className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon" disabled={isSaving || loading}>
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

        <Dialog open={isAddUserDialogOpen} onOpenChange={(open) => {
          if (!isSaving && !loading) {
            setIsAddUserDialogOpen(open);
            if (!open) {
              resetUser();
              setEditingUserId(null);
            }
          }
        }}>
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
              <ScrollArea className="max-h-[70vh] overflow-y-auto pr-4">
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
                          <Label htmlFor="permDeliveries">Entregas</Label>
                          <Switch 
                            id="permDeliveries" 
                            checked={isAdmin || watchUser('permissions.deliveries')}
                            onCheckedChange={(checked) => 
                              setUserValue('permissions.deliveries', checked)
                            }
                            disabled={isAdmin}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Label htmlFor="permShipments">Embarques</Label>
                          <Switch 
                            id="permShipments" 
                            checked={isAdmin || watchUser('permissions.shipments')}
                            onCheckedChange={(checked) => 
                              setUserValue('permissions.shipments', checked)
                            }
                            disabled={isAdmin}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Label htmlFor="permClients">Clientes</Label>
                          <Switch 
                            id="permClients" 
                            checked={isAdmin || watchUser('permissions.clients')}
                            onCheckedChange={(checked) => 
                              setUserValue('permissions.clients', checked)
                            }
                            disabled={isAdmin}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Label htmlFor="permCities">Cidades</Label>
                          <Switch 
                            id="permCities" 
                            checked={isAdmin || watchUser('permissions.cities')}
                            onCheckedChange={(checked) => 
                              setUserValue('permissions.cities', checked)
                            }
                            disabled={isAdmin}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Label htmlFor="permReports">Relatórios</Label>
                          <Switch 
                            id="permReports" 
                            checked={isAdmin || watchUser('permissions.reports')}
                            onCheckedChange={(checked) => 
                              setUserValue('permissions.reports', checked)
                            }
                            disabled={isAdmin}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Label htmlFor="permFinancial">Financeiro</Label>
                          <Switch 
                            id="permFinancial" 
                            checked={isAdmin || watchUser('permissions.financial')}
                            onCheckedChange={(checked) => 
                              setUserValue('permissions.financial', checked)
                            }
                            disabled={isAdmin}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Label htmlFor="permPriceTables">Tabelas de Preços</Label>
                          <Switch 
                            id="permPriceTables" 
                            checked={isAdmin || watchUser('permissions.priceTables')}
                            onCheckedChange={(checked) => 
                              setUserValue('permissions.priceTables', checked)
                            }
                            disabled={isAdmin}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Label htmlFor="permDashboard">Dashboard</Label>
                          <Switch 
                            id="permDashboard" 
                            checked={isAdmin || watchUser('permissions.dashboard')}
                            onCheckedChange={(checked) => 
                              setUserValue('permissions.dashboard', checked)
                            }
                            disabled={isAdmin}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Label htmlFor="permLogbook">Diário de Bordo</Label>
                          <Switch 
                            id="permLogbook" 
                            checked={isAdmin || watchUser('permissions.logbook')}
                            onCheckedChange={(checked) => 
                              setUserValue('permissions.logbook', checked)
                            }
                            disabled={isAdmin}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Label htmlFor="permEmployees">Funcionários</Label>
                          <Switch 
                            id="permEmployees" 
                            checked={isAdmin || watchUser('permissions.employees')}
                            onCheckedChange={(checked) => 
                              setUserValue('permissions.employees', checked)
                            }
                            disabled={isAdmin}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Label htmlFor="permVehicles">Veículos</Label>
                          <Switch 
                            id="permVehicles" 
                            checked={isAdmin || watchUser('permissions.vehicles')}
                            onCheckedChange={(checked) => 
                              setUserValue('permissions.vehicles', checked)
                            }
                            disabled={isAdmin}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Label htmlFor="permMaintenance">Manutenções</Label>
                          <Switch 
                            id="permMaintenance" 
                            checked={isAdmin || watchUser('permissions.maintenance')}
                            onCheckedChange={(checked) => 
                              setUserValue('permissions.maintenance', checked)
                            }
                            disabled={isAdmin}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Label htmlFor="permSettings">Configurações</Label>
                          <Switch 
                            id="permSettings" 
                            checked={isAdmin || watchUser('permissions.settings')}
                            onCheckedChange={(checked) => 
                              setUserValue('permissions.settings', checked)
                            }
                            disabled={isAdmin}
                          />
                        </div>
                      </div>
                      
                      {isAdmin && (
                        <div className="text-sm text-muted-foreground mt-2 p-2 bg-muted rounded-md">
                          <strong>Nota:</strong> Administradores possuem acesso completo a todas as funcionalidades do sistema. As permissões são automaticamente habilitadas.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </ScrollArea>
              <DialogFooter className="mt-4 flex gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleCancelEdit} 
                  disabled={isSaving || loading}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSaving || loading}
                >
                  {(isSaving || loading) ? 'Salvando...' : (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      {editingUserId ? 'Salvar Alterações' : 'Adicionar Usuário'}
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

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
