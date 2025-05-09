
import React, { useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SystemSettings } from './SystemSettings';
import { NotificationSettings } from './NotificationSettings';
import { BudgetBackupTools } from '@/components/budget/BudgetBackupTools';
import { SystemBackup } from './SystemBackup';
import { UserManagement } from './UserManagement';
import { CompanySettings } from './CompanySettings';
import { ClientsManagement } from './ClientsManagement';
import { BudgetProvider } from '@/contexts/budget';
import { toast } from 'sonner';
import { EmployeesManagement } from './EmployeesManagement';
import { ContractorsManagement } from './ContractorsManagement';

interface SettingsTabsProps {
  activeTab: string;
  handleTabChange: (value: string) => void;
  permissions: {
    system: boolean;
    company: boolean;
    users: boolean;
    backup: boolean;
    notifications: boolean;
    clients: boolean;
    employees: boolean;
    contractors: boolean;
  };
}

export const SettingsTabs: React.FC<SettingsTabsProps> = ({
  activeTab,
  handleTabChange,
  permissions,
}) => {
  // Debug logs to help troubleshoot issues
  useEffect(() => {
    console.log("SettingsTabs rendered with activeTab:", activeTab);
    console.log("Permissions:", permissions);
  }, [activeTab, permissions]);

  // Renderizar apenas as abas com permissões
  const availableTabs = Object.entries(permissions)
    .filter(([_, hasPermission]) => hasPermission)
    .map(([tab]) => tab);

  console.log("Available tabs:", availableTabs);
  
  if (availableTabs.length === 0) {
    return (
      <div className="p-4 text-center">
        <p>Você não tem permissões para visualizar as configurações do sistema.</p>
      </div>
    );
  }

  // Verificar se a aba ativa está disponível, caso contrário, redirecionar para a primeira aba disponível
  useEffect(() => {
    if (availableTabs.length > 0 && !availableTabs.includes(activeTab)) {
      console.log(`Active tab ${activeTab} not available. Switching to ${availableTabs[0]}`);
      handleTabChange(availableTabs[0]);
      toast.info("Redirecionado para a aba disponível", {
        description: "A aba selecionada não está disponível com suas permissões atuais."
      });
    }
  }, [activeTab, availableTabs, handleTabChange]);

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
      <TabsList className="mb-6">
        {permissions.system && <TabsTrigger value="system">Sistema</TabsTrigger>}
        {permissions.company && <TabsTrigger value="company">Empresa</TabsTrigger>}
        {permissions.users && <TabsTrigger value="users">Usuários</TabsTrigger>}
        {permissions.backup && <TabsTrigger value="backup">Backup</TabsTrigger>}
        {permissions.clients && <TabsTrigger value="clients">Clientes</TabsTrigger>}
        {permissions.employees && <TabsTrigger value="employees">Funcionários</TabsTrigger>}
        {permissions.contractors && <TabsTrigger value="contractors">Terceiros</TabsTrigger>}
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
      
      {permissions.clients && (
        <TabsContent value="clients" className="space-y-6">
          <ClientsManagement />
        </TabsContent>
      )}
      
      {permissions.employees && (
        <TabsContent value="employees" className="space-y-6">
          <EmployeesManagement />
        </TabsContent>
      )}
      
      {permissions.contractors && (
        <TabsContent value="contractors" className="space-y-6">
          <ContractorsManagement />
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
