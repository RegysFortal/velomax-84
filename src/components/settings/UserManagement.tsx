
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserManagementTable } from '@/components/user/UserManagementTable';
import { PasswordUpdateForm } from '@/components/user/PasswordUpdateForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/auth/AuthContext';

export function UserManagement() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('userList');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gerenciamento de Usuários</CardTitle>
          <CardDescription>
            Adicione, edite ou remova usuários do sistema. Configure permissões de acesso.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="userList">Lista de Usuários</TabsTrigger>
              {user && <TabsTrigger value="password">Alterar Senha</TabsTrigger>}
            </TabsList>
            
            <TabsContent value="userList" className="space-y-6">
              <UserManagementTable />
            </TabsContent>
            
            {user && (
              <TabsContent value="password" className="space-y-6">
                <PasswordUpdateForm />
              </TabsContent>
            )}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
