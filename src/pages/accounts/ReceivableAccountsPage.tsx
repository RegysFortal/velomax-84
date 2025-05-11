
import { AppLayout } from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus } from 'lucide-react';
import { ReceivableAccountsTable } from './components/ReceivableAccountsTable';
import { ReceivableAccountsForm } from './components/ReceivableAccountsForm';
import { ReceivableAccountsFilters } from './components/ReceivableAccountsFilters';
import { ReceivableAccountsStats } from './components/ReceivableAccountsStats';
import { useReceivableAccountsPage } from './hooks/useReceivableAccounts';

export default function ReceivableAccountsPage() {
  const {
    accounts,
    isLoading,
    isFormOpen,
    setIsFormOpen,
    editingAccount,
    setEditingAccount,
    activeTab,
    setActiveTab,
    handleAddAccount,
    handleUpdateAccount,
    handleDeleteAccount,
    handleEdit,
    handleMarkAsReceived,
    getFilteredAccounts
  } = useReceivableAccountsPage();
  
  return (
    <AppLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Contas a Receber</h1>
            <p className="text-muted-foreground">
              Gerencie todas as suas contas a receber em um só lugar.
            </p>
          </div>
          <Button onClick={() => { setIsFormOpen(true); setEditingAccount(null); }}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Conta
          </Button>
        </div>

        {/* Summary cards */}
        <ReceivableAccountsStats accounts={accounts} />
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="all">Todas</TabsTrigger>
            <TabsTrigger value="pending">Pendentes</TabsTrigger>
            <TabsTrigger value="overdue">Atrasadas</TabsTrigger>
            <TabsTrigger value="received">Recebidas</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <div className="space-y-4">
              <ReceivableAccountsFilters />
              <ReceivableAccountsTable 
                accounts={getFilteredAccounts('all')} 
                onEdit={handleEdit} 
                onDelete={handleDeleteAccount}
                onMarkAsReceived={handleMarkAsReceived}
                isLoading={isLoading}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="pending">
            <div className="space-y-4">
              <ReceivableAccountsFilters />
              <ReceivableAccountsTable 
                accounts={getFilteredAccounts('pending')} 
                onEdit={handleEdit} 
                onDelete={handleDeleteAccount}
                onMarkAsReceived={handleMarkAsReceived}
                isLoading={isLoading}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="overdue">
            <div className="space-y-4">
              <ReceivableAccountsFilters />
              <ReceivableAccountsTable 
                accounts={getFilteredAccounts('overdue')} 
                onEdit={handleEdit} 
                onDelete={handleDeleteAccount}
                onMarkAsReceived={handleMarkAsReceived}
                isLoading={isLoading}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="received">
            <div className="space-y-4">
              <ReceivableAccountsFilters />
              <ReceivableAccountsTable 
                accounts={getFilteredAccounts('received')} 
                onEdit={handleEdit} 
                onDelete={handleDeleteAccount}
                onMarkAsReceived={handleMarkAsReceived}
                isLoading={isLoading}
              />
            </div>
          </TabsContent>
        </Tabs>
        
        {isFormOpen && (
          <ReceivableAccountsForm 
            open={isFormOpen}
            onOpenChange={setIsFormOpen}
            onSubmit={editingAccount ? 
              (data) => handleUpdateAccount(editingAccount.id, data) : 
              handleAddAccount
            }
            account={editingAccount}
          />
        )}
      </div>
    </AppLayout>
  );
}
