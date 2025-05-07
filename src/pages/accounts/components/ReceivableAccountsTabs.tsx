
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReceivableAccountsTabContent } from './ReceivableAccountsTabContent';
import { ReceivableAccount } from '@/types/financial';

interface ReceivableAccountsTabsProps {
  accounts: ReceivableAccount[];
  onEdit: (account: ReceivableAccount) => void;
  onDelete: (id: string) => void;
  onMarkAsReceived: (id: string, fullAmount: boolean, partialAmount?: number) => void;
  isLoading: boolean;
}

export const ReceivableAccountsTabs: React.FC<ReceivableAccountsTabsProps> = ({
  accounts,
  onEdit,
  onDelete,
  onMarkAsReceived,
  isLoading
}) => {
  const [activeTab, setActiveTab] = useState("all");

  return (
    <Tabs defaultValue="all" className="w-full" value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="mb-4">
        <TabsTrigger value="all">Todas</TabsTrigger>
        <TabsTrigger value="pending">Pendentes</TabsTrigger>
        <TabsTrigger value="overdue">Atrasadas</TabsTrigger>
        <TabsTrigger value="received">Recebidas</TabsTrigger>
      </TabsList>
      
      <TabsContent value="all">
        <ReceivableAccountsTabContent 
          accounts={accounts}
          onEdit={onEdit}
          onDelete={onDelete}
          onMarkAsReceived={onMarkAsReceived}
          isLoading={isLoading}
        />
      </TabsContent>
      
      <TabsContent value="pending">
        <ReceivableAccountsTabContent 
          accounts={accounts.filter(account => account.status === 'pending')}
          onEdit={onEdit}
          onDelete={onDelete}
          onMarkAsReceived={onMarkAsReceived}
          isLoading={isLoading}
        />
      </TabsContent>
      
      <TabsContent value="overdue">
        <ReceivableAccountsTabContent 
          accounts={accounts.filter(account => account.status === 'overdue')}
          onEdit={onEdit}
          onDelete={onDelete}
          onMarkAsReceived={onMarkAsReceived}
          isLoading={isLoading}
        />
      </TabsContent>
      
      <TabsContent value="received">
        <ReceivableAccountsTabContent 
          accounts={accounts.filter(account => 
            account.status === 'received' || account.status === 'partially_received'
          )}
          onEdit={onEdit}
          onDelete={onDelete}
          onMarkAsReceived={onMarkAsReceived}
          isLoading={isLoading}
        />
      </TabsContent>
    </Tabs>
  );
};
