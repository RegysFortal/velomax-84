
import React from 'react';
import { ReceivableAccountsFilters } from './ReceivableAccountsFilters';
import { ReceivableAccountsTable } from './ReceivableAccountsTable';
import { ReceivableAccount } from '@/types/financial';

interface ReceivableAccountsTabContentProps {
  accounts: ReceivableAccount[];
  onEdit: (account: ReceivableAccount) => void;
  onDelete: (id: string) => void;
  onMarkAsReceived: (id: string, fullAmount: boolean, partialAmount?: number) => void;
  isLoading: boolean;
}

export const ReceivableAccountsTabContent: React.FC<ReceivableAccountsTabContentProps> = ({
  accounts,
  onEdit,
  onDelete,
  onMarkAsReceived,
  isLoading
}) => {
  return (
    <div className="space-y-4">
      <ReceivableAccountsFilters />
      <ReceivableAccountsTable 
        accounts={accounts} 
        onEdit={onEdit} 
        onDelete={onDelete}
        onMarkAsReceived={onMarkAsReceived}
        isLoading={isLoading}
      />
    </div>
  );
};
