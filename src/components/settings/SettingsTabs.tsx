
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CompanySettings } from "./CompanySettings";
import { SystemSettings } from "./SystemSettings";
import { UserManagement } from "./UserManagement";
import { SystemBackup } from "./SystemBackup";
import { DataBackup } from "./DataBackup";
import { NotificationSettings } from "./NotificationSettings";
import { EmployeesManagement } from "./EmployeesManagement";
import { ClientsManagement } from "./ClientsManagement";
import { ContractorsManagement } from "./ContractorsManagement";
import { useSettingsPermissions } from "./useSettingsPermissions";

export function SettingsTabs() {
  const { canAccessSystemSettings, canAccessUserManagement, canAccessBackup } = useSettingsPermissions();

  return (
    <Tabs defaultValue="company" className="space-y-4">
      <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 xl:grid-cols-8">
        <TabsTrigger value="company">Empresa</TabsTrigger>
        <TabsTrigger value="notifications">Notificações</TabsTrigger>
        <TabsTrigger value="employees">Funcionários</TabsTrigger>
        <TabsTrigger value="clients">Clientes</TabsTrigger>
        <TabsTrigger value="contractors">Terceirizados</TabsTrigger>
        {canAccessBackup && <TabsTrigger value="backup">Backup</TabsTrigger>}
        {canAccessBackup && <TabsTrigger value="data-backup">Backup Dados</TabsTrigger>}
        {canAccessSystemSettings && <TabsTrigger value="system">Sistema</TabsTrigger>}
        {canAccessUserManagement && <TabsTrigger value="users">Usuários</TabsTrigger>}
      </TabsList>

      <TabsContent value="company">
        <CompanySettings />
      </TabsContent>

      <TabsContent value="notifications">
        <NotificationSettings />
      </TabsContent>

      <TabsContent value="employees">
        <EmployeesManagement />
      </TabsContent>

      <TabsContent value="clients">
        <ClientsManagement />
      </TabsContent>

      <TabsContent value="contractors">
        <ContractorsManagement />
      </TabsContent>

      {canAccessBackup && (
        <TabsContent value="backup">
          <SystemBackup />
        </TabsContent>
      )}

      {canAccessBackup && (
        <TabsContent value="data-backup">
          <DataBackup />
        </TabsContent>
      )}

      {canAccessSystemSettings && (
        <TabsContent value="system">
          <SystemSettings />
        </TabsContent>
      )}

      {canAccessUserManagement && (
        <TabsContent value="users">
          <UserManagement />
        </TabsContent>
      )}
    </Tabs>
  );
}
