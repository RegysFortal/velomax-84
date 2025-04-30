
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SystemSettings } from '@/components/settings/SystemSettings';
import { NotificationSettings } from '@/components/settings/NotificationSettings';
import { BudgetBackupTools } from '@/components/budget/BudgetBackupTools';
import { SystemBackup } from '@/components/settings/SystemBackup';
import { UserManagement } from '@/components/settings/UserManagement';
import { CompanySettings } from '@/components/settings/CompanySettings';
import { toast } from 'sonner';
import { BudgetProvider } from '@/contexts/budget';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('system');

  const handleTabChange = (value: string) => {
    try {
      setActiveTab(value);
    } catch (error) {
      console.error("Error changing tab:", error);
      toast.error("Ocorreu um erro ao mudar de aba. Por favor, tente novamente.");
    }
  };

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
          <TabsTrigger value="system">Sistema</TabsTrigger>
          <TabsTrigger value="company">Empresa</TabsTrigger>
          <TabsTrigger value="users">Usuários</TabsTrigger>
          <TabsTrigger value="backup">Backup</TabsTrigger>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
        </TabsList>
        
        <TabsContent value="system" className="space-y-6">
          <SystemSettings />
        </TabsContent>
        
        <TabsContent value="company" className="space-y-6">
          <CompanySettings />
        </TabsContent>
        
        <TabsContent value="users" className="space-y-6">
          <UserManagement />
        </TabsContent>
        
        <TabsContent value="backup" className="space-y-6">
          <SystemBackup />
          <BudgetProvider>
            <BudgetBackupTools />
          </BudgetProvider>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-6">
          <NotificationSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
