
import React, { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { User, UserPermissions } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Trash, PlusCircle, UserPlus, Settings as SettingsIcon, Key } from "lucide-react";

const UserPermissionCard = ({ user, canEdit }: { user: User, canEdit: boolean }) => {
  const { updateUserPermissions, deleteUser, resetUserPassword } = useAuth();
  const [permissions, setPermissions] = useState<UserPermissions>(
    user.permissions || {
      clients: false,
      cities: false,
      reports: false,
      financial: false,
      priceTables: false,
      settings: false
    }
  );
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isResetPasswordDialogOpen, setIsResetPasswordDialogOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  const handlePermissionChange = (key: keyof UserPermissions) => {
    const updatedPermissions = {
      ...permissions,
      [key]: !permissions[key]
    };
    setPermissions(updatedPermissions);
  };

  const handleSave = () => {
    updateUserPermissions(user.id, permissions);
    toast.success("Permissões do usuário atualizadas com sucesso");
  };

  const handleDelete = () => {
    deleteUser(user.id);
    setIsDeleteDialogOpen(false);
  };

  const handleResetPassword = () => {
    if (!newPassword.trim()) {
      toast.error("A senha não pode estar vazia");
      return;
    }
    
    resetUserPassword(user.id, newPassword);
    setNewPassword("");
    setIsResetPasswordDialogOpen(false);
  };

  // Role badges with colors
  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge className="bg-red-500">Administrador</Badge>;
      case 'manager':
        return <Badge className="bg-blue-500">Gerente</Badge>;
      default:
        return <Badge>Usuário</Badge>;
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-xl">{user.name}</CardTitle>
              <CardDescription>@{user.username}</CardDescription>
            </div>
          </div>
          {getRoleBadge(user.role)}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <h3 className="font-medium">Acesso a Módulos</h3>
              <Separator />
              
              <div className="flex items-center justify-between">
                <Label htmlFor={`clients-${user.id}`}>Clientes</Label>
                <Switch 
                  id={`clients-${user.id}`}
                  checked={permissions.clients} 
                  onCheckedChange={() => handlePermissionChange('clients')}
                  disabled={!canEdit || user.role === 'admin'}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor={`cities-${user.id}`}>Cidades</Label>
                <Switch 
                  id={`cities-${user.id}`}
                  checked={permissions.cities} 
                  onCheckedChange={() => handlePermissionChange('cities')}
                  disabled={!canEdit || user.role === 'admin'}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor={`reports-${user.id}`}>Relatórios</Label>
                <Switch 
                  id={`reports-${user.id}`}
                  checked={permissions.reports} 
                  onCheckedChange={() => handlePermissionChange('reports')}
                  disabled={!canEdit || user.role === 'admin'}
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-medium">Acesso a Módulos</h3>
              <Separator />
              
              <div className="flex items-center justify-between">
                <Label htmlFor={`financial-${user.id}`}>Financeiro</Label>
                <Switch 
                  id={`financial-${user.id}`}
                  checked={permissions.financial} 
                  onCheckedChange={() => handlePermissionChange('financial')}
                  disabled={!canEdit || user.role === 'admin'}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor={`priceTables-${user.id}`}>Tabelas de Preço</Label>
                <Switch 
                  id={`priceTables-${user.id}`}
                  checked={permissions.priceTables} 
                  onCheckedChange={() => handlePermissionChange('priceTables')}
                  disabled={!canEdit || user.role === 'admin'}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor={`settings-${user.id}`}>Configurações</Label>
                <Switch 
                  id={`settings-${user.id}`}
                  checked={permissions.settings} 
                  onCheckedChange={() => handlePermissionChange('settings')}
                  disabled={!canEdit || user.role === 'admin' || user.role === 'user'}
                />
              </div>
            </div>
          </div>
          
          {canEdit && (
            <div className="flex justify-between">
              {user.role !== 'admin' && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setIsDeleteDialogOpen(true)}
                >
                  <Trash className="h-4 w-4 mr-2" />
                  Excluir Usuário
                </Button>
              )}

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsResetPasswordDialogOpen(true)}
                >
                  <Key className="h-4 w-4 mr-2" />
                  Redefinir Senha
                </Button>
                
                {user.role !== 'admin' && (
                  <Button onClick={handleSave} size="sm">
                    Salvar Alterações
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>

        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Excluir usuário</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir o usuário {user.name}? Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Dialog open={isResetPasswordDialogOpen} onOpenChange={setIsResetPasswordDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Redefinir senha</DialogTitle>
              <DialogDescription>
                Defina uma nova senha para o usuário {user.name}.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="newPassword">Nova senha</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsResetPasswordDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="button" onClick={handleResetPassword}>
                Redefinir senha
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

const CreateUserForm = ({ onClose }: { onClose: () => void }) => {
  const { createUser } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
    role: "user",
    permissions: {
      clients: false,
      cities: false,
      reports: true,
      financial: false,
      priceTables: false,
      settings: false
    }
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleRoleChange = (role: string) => {
    let permissions = { ...formData.permissions };
    
    if (role === 'admin') {
      permissions = {
        clients: true,
        cities: true,
        reports: true,
        financial: true,
        priceTables: true,
        settings: true
      };
    } else if (role === 'manager') {
      permissions = {
        clients: true,
        cities: true,
        reports: true,
        financial: true,
        priceTables: true,
        settings: false
      };
    }
    
    setFormData(prev => ({ 
      ...prev, 
      role: role as 'admin' | 'manager' | 'user',
      permissions
    }));
  };

  const handlePermissionChange = (key: keyof UserPermissions) => {
    setFormData(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [key]: !prev.permissions[key]
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!formData.name.trim() || !formData.username.trim() || !formData.password.trim()) {
      setError("Todos os campos são obrigatórios");
      return;
    }
    
    setIsSubmitting(true);
    try {
      await createUser(formData);
      onClose();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Erro ao criar usuário");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="grid gap-4">
        <div>
          <Label htmlFor="name">Nome completo</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="username">Nome de usuário</Label>
          <Input
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="password">Senha</Label>
          <Input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="role">Função</Label>
          <Select
            value={formData.role}
            onValueChange={handleRoleChange}
          >
            <SelectTrigger id="role" className="mt-1">
              <SelectValue placeholder="Selecione a função" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Administrador</SelectItem>
              <SelectItem value="manager">Gerente</SelectItem>
              <SelectItem value="user">Usuário</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {formData.role !== "admin" && (
        <div className="mt-4">
          <h3 className="text-sm font-medium mb-2">Permissões</h3>
          <Separator className="mb-4" />
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="perm-clients">Clientes</Label>
                <Switch 
                  id="perm-clients"
                  checked={formData.permissions.clients} 
                  onCheckedChange={() => handlePermissionChange('clients')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="perm-cities">Cidades</Label>
                <Switch 
                  id="perm-cities"
                  checked={formData.permissions.cities} 
                  onCheckedChange={() => handlePermissionChange('cities')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="perm-reports">Relatórios</Label>
                <Switch 
                  id="perm-reports"
                  checked={formData.permissions.reports} 
                  onCheckedChange={() => handlePermissionChange('reports')}
                />
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="perm-financial">Financeiro</Label>
                <Switch 
                  id="perm-financial"
                  checked={formData.permissions.financial} 
                  onCheckedChange={() => handlePermissionChange('financial')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="perm-priceTables">Tabelas de Preço</Label>
                <Switch 
                  id="perm-priceTables"
                  checked={formData.permissions.priceTables} 
                  onCheckedChange={() => handlePermissionChange('priceTables')}
                />
              </div>
              
              {formData.role === "manager" && (
                <div className="flex items-center justify-between">
                  <Label htmlFor="perm-settings">Configurações</Label>
                  <Switch 
                    id="perm-settings"
                    checked={formData.permissions.settings} 
                    onCheckedChange={() => handlePermissionChange('settings')}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      <DialogFooter className="mt-6">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Criando..." : "Criar Usuário"}
        </Button>
      </DialogFooter>
    </form>
  );
};

const SystemSettingsForm = () => {
  const [formData, setFormData] = useState({
    companyName: "Velomax Brasil",
    address: "Av. Principal, 123 - Fortaleza, CE",
    phone: "(85) 3232-0000",
    email: "contato@velomaxbrasil.com.br",
    cnpj: "12.345.678/0001-90",
    minimumRate: 0,
    theme: "light"
  });
  
  const [isSaving, setIsSaving] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleThemeChange = (theme: string) => {
    setFormData(prev => ({ ...prev, theme }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate saving
    setTimeout(() => {
      toast.success("Configurações do sistema atualizadas com sucesso");
      setIsSaving(false);
    }, 800);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="companyName">Nome da Empresa</Label>
          <Input
            id="companyName"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
          />
        </div>
        
        <div>
          <Label htmlFor="cnpj">CNPJ</Label>
          <Input
            id="cnpj"
            name="cnpj"
            value={formData.cnpj}
            onChange={handleChange}
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="address">Endereço</Label>
        <Textarea
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          rows={2}
        />
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="phone">Telefone</Label>
          <Input
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>
        
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="minimumRate">Taxa Mínima de Frete (R$)</Label>
        <Input
          id="minimumRate"
          name="minimumRate"
          type="number"
          step="0.01"
          value={formData.minimumRate}
          onChange={handleChange}
        />
      </div>
      
      <div>
        <Label htmlFor="theme">Tema do Sistema</Label>
        <Select
          value={formData.theme}
          onValueChange={handleThemeChange}
        >
          <SelectTrigger id="theme" className="mt-1">
            <SelectValue placeholder="Selecione o tema" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">Claro</SelectItem>
            <SelectItem value="dark">Escuro</SelectItem>
            <SelectItem value="system">Sistema (automático)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Button type="submit" disabled={isSaving} className="mt-6">
        {isSaving ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Salvando...
          </>
        ) : (
          <>
            <SettingsIcon className="mr-2 h-4 w-4" />
            Salvar Configurações
          </>
        )}
      </Button>
    </form>
  );
};

const Settings = () => {
  const { user, users } = useAuth();
  const [isCreateUserDialogOpen, setIsCreateUserDialogOpen] = useState(false);
  
  // Only admins can access settings
  if (user?.role !== 'admin') {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center p-8">
          <h1 className="text-2xl font-bold mb-4">Acesso Restrito</h1>
          <p className="text-muted-foreground">
            Você não tem permissão para acessar esta página.
          </p>
        </div>
      </AppLayout>
    );
  }
  
  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Configurações</h2>
            <p className="text-muted-foreground">
              Gerencie usuários e configurações do sistema.
            </p>
          </div>
          
          <Dialog open={isCreateUserDialogOpen} onOpenChange={setIsCreateUserDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                Novo Usuário
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>Criar Novo Usuário</DialogTitle>
                <DialogDescription>
                  Preencha as informações para criar um novo usuário no sistema.
                </DialogDescription>
              </DialogHeader>
              <CreateUserForm onClose={() => setIsCreateUserDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
        
        <Tabs defaultValue="users">
          <TabsList>
            <TabsTrigger value="users">Usuários</TabsTrigger>
            <TabsTrigger value="system">Configurações do Sistema</TabsTrigger>
          </TabsList>
          
          <TabsContent value="users" className="mt-6">
            <div className="space-y-4">
              <h3 className="text-xl font-medium">Gerenciar Usuários</h3>
              
              <div className="space-y-4">
                {users.map((u) => (
                  <UserPermissionCard 
                    key={u.id} 
                    user={u} 
                    canEdit={user?.role === 'admin'} 
                  />
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="system" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Configurações do Sistema</CardTitle>
                <CardDescription>
                  Configurações gerais do sistema Velomax
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SystemSettingsForm />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Settings;
