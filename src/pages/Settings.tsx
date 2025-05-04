
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

  // Fetch user permissions from Supabase
  useEffect(() => {
    const fetchPermissions = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Fallback to role-based permissions
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
        
        // Try to fetch from Supabase if role-based didn't set permissions
        try {
          const { data: systemAccess, error: systemError } = await supabase.rpc('user_has_system_settings_access');
          const { data: companyAccess, error: companyError } = await supabase.rpc('user_has_company_settings_access');
          const { data: userAccess, error: userError } = await supabase.rpc('user_has_user_management_access');
          const { data: backupAccess, error: backupError } = await supabase.rpc('user_has_backup_access');
          const { data: notifAccess, error: notifError } = await supabase.rpc('user_has_notification_settings_access');

          if (systemError || companyError || userError || backupError || notifError) {
            console.error("Error fetching permissions:", { systemError, companyError, userError, backupError, notifError });
            toast.error("Erro ao verificar permissões, usando padrões");
            
            // Default permissions if errors occurred
            setPermissions({
              system: false,
              company: false,
              users: false,
              backup: false,
              notifications: true
            });
          } else {
            setPermissions({
              system: !!systemAccess,
              company: !!companyAccess,
              users: !!userAccess,
              backup: !!backupAccess,
              notifications: notifAccess !== false // Default to true unless explicitly false
            });
          }
        } catch (error) {
          console.error("Error checking permissions:", error);
          // Default permissions on exception
          setPermissions({
            system: false,
            company: false,
            users: false,
            backup: false,
            notifications: true
          });
        }
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
