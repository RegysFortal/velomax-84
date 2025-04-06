
import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { ProfileUpdateForm } from '@/components/user/ProfileUpdateForm';
import { PasswordUpdateForm } from '@/components/user/PasswordUpdateForm';
import { UserManagementTable } from '@/components/user/UserManagementTable';
import { NotificationSettings } from '@/components/settings/NotificationSettings';
import { SystemSettings } from '@/components/settings/SystemSettings';
import { Bell, HardDrive, LockKeyhole, User, Users, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile');
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (user && user.role === 'admin') {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
      // If user is not admin and tries to access users tab, redirect to profile
      if (activeTab === 'users') {
        setActiveTab('profile');
      }
    }
  }, [user, activeTab]);

  return (
    <AppLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
          <p className="text-muted-foreground">
            Gerencie suas preferências e configurações de conta.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-6">
          <div className="md:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 h-auto md:w-fit p-1">
                <TabsTrigger
                  value="profile"
                  className="flex items-center gap-2 h-9 rounded-lg px-3"
                >
                  <User className="h-4 w-4" />
                  <span>Perfil</span>
                </TabsTrigger>
                <TabsTrigger
                  value="security"
                  className="flex items-center gap-2 h-9 rounded-lg px-3"
                >
                  <LockKeyhole className="h-4 w-4" />
                  <span>Segurança</span>
                </TabsTrigger>
                <TabsTrigger
                  value="notifications"
                  className="flex items-center gap-2 h-9 rounded-lg px-3"
                >
                  <Bell className="h-4 w-4" />
                  <span>Notificações</span>
                </TabsTrigger>
                <TabsTrigger
                  value="system"
                  className="flex items-center gap-2 h-9 rounded-lg px-3"
                >
                  <HardDrive className="h-4 w-4" />
                  <span>Sistema</span>
                </TabsTrigger>
                {isAdmin && (
                  <TabsTrigger
                    value="users"
                    className="flex items-center gap-2 h-9 rounded-lg px-3"
                  >
                    <Users className="h-4 w-4" />
                    <span>Usuários</span>
                  </TabsTrigger>
                )}
              </TabsList>

              <TabsContent value="profile" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Perfil</CardTitle>
                    <CardDescription>
                      Gerencie as informações do seu perfil.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ProfileUpdateForm />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="security" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Senha</CardTitle>
                    <CardDescription>
                      Altere sua senha de acesso.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <PasswordUpdateForm />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notifications" className="space-y-4">
                <NotificationSettings />
              </TabsContent>

              <TabsContent value="system" className="space-y-4">
                <div className="mb-6">
                  {isAdmin ? (
                    <SystemSettings />
                  ) : (
                    <Alert variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        Apenas administradores têm acesso às configurações do sistema.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </TabsContent>

              {isAdmin && (
                <TabsContent value="users" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Gestão de Usuários</CardTitle>
                      <CardDescription>
                        Gerencie usuários e suas permissões no sistema.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <UserManagementTable />
                    </CardContent>
                  </Card>
                </TabsContent>
              )}
            </Tabs>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
