
import React, { useEffect } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { UserManagementTable } from '@/components/user/UserManagementTable';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/auth/AuthContext';

const Users = () => {
  const { refreshUsers } = useAuth();

  // Carregar usuários quando a página for acessada
  useEffect(() => {
    refreshUsers().catch(err => {
      console.error("Erro ao carregar usuários na página:", err);
    });
  }, [refreshUsers]);

  return (
    <AppLayout>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Gerenciamento de Usuários</CardTitle>
            <CardDescription>
              Adicione, edite ou remova usuários do sistema. Configure permissões de acesso.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UserManagementTable />
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Users;
