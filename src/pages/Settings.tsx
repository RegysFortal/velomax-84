
import React, { useState } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SystemSettings } from '@/components/settings/SystemSettings';
import { NotificationSettings } from '@/components/settings/NotificationSettings';
import { BudgetBackupTools } from '@/components/budget/BudgetBackupTools';
import { SystemBackup } from '@/components/settings/SystemBackup';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('system');

  return (
    <AppLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
          <p className="text-muted-foreground">
            Gerencie as configurações do sistema.
          </p>
        </div>

        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="system">Sistema</TabsTrigger>
            <TabsTrigger value="backup">Backup</TabsTrigger>
            <TabsTrigger value="notifications">Notificações</TabsTrigger>
          </TabsList>
          
          <TabsContent value="system" className="space-y-6">
            <SystemSettings />
          </TabsContent>
          
          <TabsContent value="backup" className="space-y-6">
            <SystemBackup />
            <BudgetBackupTools />
          </TabsContent>
          
          <TabsContent value="notifications" className="space-y-6">
            <NotificationSettings />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default SettingsPage;
