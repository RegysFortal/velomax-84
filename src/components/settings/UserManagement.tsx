import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserManagementTable } from '@/components/user/UserManagementTable';
import { PasswordUpdateForm } from '@/components/user/PasswordUpdateForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/auth/AuthContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export function UserManagement() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('userList');
  const [hasAccess, setHasAccess] = useState(false);
  
  // Check if the user has permission to manage users
  useEffect(() => {
    const checkPermissions = async () => {
      try {
        if (!user) {
          setHasAccess(false);
          return;
        }
        
        // Fallback to role check first
        if (user.role === 'admin') {
          setHasAccess(true);
          return;
        }
        
        // Try Supabase RPC only if role check didn't grant access
        try {
          const { data: accessAllowed, error } = await supabase.rpc('user_has_user_management_access');
          
          if (error) {
            console.error("Error checking user management permissions:", error);
            // Already checked role above, so keep as false if we get here
            setHasAccess(false);
          } else {
            setHasAccess(!!accessAllowed);
          }
        } catch (error) {
          console.error("Exception checking user management access:", error);
          // Already checked role above, so keep as false if we get here
          setHasAccess(false);
        }
      } catch (error) {
        console.error("Error in permission check flow:", error);
        setHasAccess(user?.role === 'admin');
      }
    };
    
    checkPermissions();
  }, [user]);

  // If the user doesn't have access, show a restricted access message
  if (!hasAccess) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Gerenciamento de Usuários</CardTitle>
            <CardDescription>
              Acesso restrito. Você não tem permissão para gerenciar usuários do sistema.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Apenas administradores podem acessar o gerenciamento de usuários.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

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
