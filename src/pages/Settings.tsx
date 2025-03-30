
import React, { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { User, UserPermissions } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const UserPermissionCard = ({ user, canEdit }: { user: User, canEdit: boolean }) => {
  const { updateUserPermissions } = useAuth();
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
          
          {canEdit && user.role !== 'admin' && (
            <div className="flex justify-end">
              <Button onClick={handleSave}>Salvar Alterações</Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const Settings = () => {
  const { user, users } = useAuth();
  
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
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Configurações</h2>
          <p className="text-muted-foreground">
            Gerencie usuários e permissões do sistema.
          </p>
        </div>
        
        <Tabs defaultValue="permissions">
          <TabsList>
            <TabsTrigger value="permissions">Permissões de Usuários</TabsTrigger>
            <TabsTrigger value="system">Configurações do Sistema</TabsTrigger>
          </TabsList>
          
          <TabsContent value="permissions" className="mt-6">
            <div className="space-y-4">
              <h3 className="text-xl font-medium">Gerenciar Permissões de Usuários</h3>
              
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
                <p className="text-muted-foreground">
                  Configurações do sistema serão implementadas em breve.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Settings;
