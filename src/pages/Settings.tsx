import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SystemSettings } from '@/components/settings/SystemSettings';
import { NotificationSettings } from '@/components/settings/NotificationSettings';
import { BudgetBackupTools } from '@/components/budget/BudgetBackupTools';
import { SystemBackup } from '@/components/settings/SystemBackup';
import { UserManagement } from '@/components/settings/UserManagement';
import { CompanySettings } from '@/components/settings/CompanySettings';
import { toast } from 'sonner';
import { BudgetProvider } from '@/contexts/budget';
import { useAuth } from '@/contexts/auth/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('system');
  const { user } = useAuth();
  const [permissions, setPermissions] = useState({
    system: false,
    company: false,
    users: false,
    backup: false,
    notifications: true // Default to true as all users can manage their own notifications
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user permissions from Supabase or use role-based fallback
  useEffect(() => {
    const fetchPermissions = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Fallback to role-based permissions first for reliability
        if (user.role === 'admin') {
          setPermissions({
            system: true,
            company: true,
            users: true,
            backup: true,
            notifications: true
          });
          setLoading(false);
          return;
        } else if (user.role === 'manager') {
          setPermissions({
            system: false,
            company: false,
            users: false,
            backup: true,
            notifications: true
          });
          setLoading(false);
          return;
        }
        
        // Only try Supabase RPC if role check didn't set full permissions
        const permissionPromises = [
          supabase.rpc('user_has_system_settings_access').then(({ data, error }) => {
            if (error) throw new Error(`System settings access check failed: ${error.message}`);
            return { key: 'system', value: !!data };
          }),
          supabase.rpc('user_has_company_settings_access').then(({ data, error }) => {
            if (error) throw new Error(`Company settings access check failed: ${error.message}`);
            return { key: 'company', value: !!data };
          }),
          supabase.rpc('user_has_user_management_access').then(({ data, error }) => {
            if (error) throw new Error(`User management access check failed: ${error.message}`);
            return { key: 'users', value: !!data };
          }),
          supabase.rpc('user_has_backup_access').then(({ data, error }) => {
            if (error) throw new Error(`Backup access check failed: ${error.message}`);
            return { key: 'backup', value: !!data };
          }),
          // Notifications are assumed to be available to all users
          Promise.resolve({ key: 'notifications', value: true })
        ];

        const results = await Promise.allSettled(permissionPromises);
        
        const newPermissions = { ...permissions };
        let hasErrors = false;
        
        results.forEach(result => {
          if (result.status === 'fulfilled') {
            const { key, value } = result.value;
            newPermissions[key as keyof typeof permissions] = value;
          } else {
            console.error("Permission check failed:", result.reason);
            hasErrors = true;
          }
        });
        
        if (hasErrors) {
          setError("Alguns serviços de permissão não estão disponíveis. Usando permissões baseadas em função.");
        }
        
        setPermissions(newPermissions);
      } catch (error) {
        console.error("Error fetching permissions:", error);
        setError("Erro ao carregar permissões. Usando configurações padrão.");
        
        // Keep notifications available by default
        setPermissions(prev => ({
          ...prev,
          notifications: true
        }));
      } finally {
        setLoading(false);
      }
    };

    fetchPermissions();
  }, [user]);

  useEffect(() => {
    // If current tab is not accessible, switch to the first accessible tab
    if (!loading && !permissions[activeTab as keyof typeof permissions]) {
      const firstAccessibleTab = Object.keys(permissions).find(tab => permissions[tab as keyof typeof permissions]);
      if (firstAccessibleTab) {
        setActiveTab(firstAccessibleTab);
      }
    }
  }, [permissions, loading, activeTab]);

  const handleTabChange = (value: string) => {
    try {
      if (permissions[value as keyof typeof permissions]) {
        setActiveTab(value);
      } else {
        toast.error("Você não tem permissão para acessar esta seção");
      }
    } catch (error) {
      console.error("Error changing tab:", error);
      toast.error("Ocorreu um erro ao mudar de aba. Por favor, tente novamente.");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
          <p className="text-muted-foreground">
            Carregando configurações...
          </p>
        </div>
        <div className="w-full h-40 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  // Always show at least notifications if nothing else is accessible
  if (!Object.values(permissions).some(Boolean)) {
    setPermissions(prev => ({ ...prev, notifications: true }));
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
        <p className="text-muted-foreground">
          Gerencie as configurações do sistema.
        </p>
      </div>

      {error && (
        <Alert variant="warning" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="mb-6">
          {permissions.system && <TabsTrigger value="system">Sistema</TabsTrigger>}
          {permissions.company && <TabsTrigger value="company">Empresa</TabsTrigger>}
          {permissions.users && <TabsTrigger value="users">Usuários</TabsTrigger>}
          {permissions.backup && <TabsTrigger value="backup">Backup</TabsTrigger>}
          {permissions.notifications && <TabsTrigger value="notifications">Notificações</TabsTrigger>}
        </TabsList>
        
        {permissions.system && (
          <TabsContent value="system" className="space-y-6">
            <SystemSettings />
          </TabsContent>
        )}
        
        {permissions.company && (
          <TabsContent value="company" className="space-y-6">
            <CompanySettings />
          </TabsContent>
        )}
        
        {permissions.users && (
          <TabsContent value="users" className="space-y-6">
            <UserManagement />
          </TabsContent>
        )}
        
        {permissions.backup && (
          <TabsContent value="backup" className="space-y-6">
            <SystemBackup />
            <BudgetProvider>
              <BudgetBackupTools />
            </BudgetProvider>
          </TabsContent>
        )}
        
        {permissions.notifications && (
          <TabsContent value="notifications" className="space-y-6">
            <NotificationSettings />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default SettingsPage;
