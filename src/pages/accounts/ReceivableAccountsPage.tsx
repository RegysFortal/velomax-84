
import { AppLayout } from '@/components/AppLayout';
import { ReceivableAccountsForm } from './components/ReceivableAccountsForm';
import { ReceivableAccountsStats } from './components/ReceivableAccountsStats';
import { ReceivableAccountsHeader } from './components/ReceivableAccountsHeader';
import { ReceivableAccountsTabs } from './components/ReceivableAccountsTabs';
import { useReceivableAccountsPage } from './hooks/useReceivableAccountsPage';

export default function ReceivableAccountsPage() {
  const {
    accounts,
    isLoading,
    isFormOpen,
    setIsFormOpen,
    editingAccount,
    handleAddAccount,
    handleUpdateAccount,
    handleDeleteAccount,
    handleEdit,
    handleMarkAsReceived
  } = useReceivableAccountsPage();
  
  return (
    <AppLayout>
      <div className="flex flex-col gap-6">
        <ReceivableAccountsHeader 
          onNewAccount={() => { setIsFormOpen(true); }}
        />

        {/* Summary cards */}
        <ReceivableAccountsStats accounts={accounts} />
        
        <ReceivableAccountsTabs
          accounts={accounts}
          onEdit={handleEdit}
          onDelete={handleDeleteAccount}
          onMarkAsReceived={handleMarkAsReceived}
          isLoading={isLoading}
        />
        
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
