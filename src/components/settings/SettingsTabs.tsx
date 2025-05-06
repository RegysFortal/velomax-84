
import React, { useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SystemSettings } from './SystemSettings';
import { NotificationSettings } from './NotificationSettings';
import { BudgetBackupTools } from '@/components/budget/BudgetBackupTools';
import { SystemBackup } from './SystemBackup';
import { UserManagement } from './UserManagement';
import { CompanySettings } from './CompanySettings';
import { BudgetProvider } from '@/contexts/budget';

interface SettingsTabsProps {
  activeTab: string;
  handleTabChange: (value: string) => void;
  permissions: {
    system: boolean;
    company: boolean;
    users: boolean;
    backup: boolean;
    notifications: boolean;
  };
}

export const SettingsTabs: React.FC<SettingsTabsProps> = ({
  activeTab,
  handleTabChange,
  permissions,
}) => {
  // Log when the component renders with which active tab
  useEffect(() => {
    console.log("SettingsTabs rendered with activeTab:", activeTab);
    console.log("Permissions:", permissions);
  }, [activeTab, permissions]);

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
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
  );
};
