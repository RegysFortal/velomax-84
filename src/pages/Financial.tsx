
import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { FinancialProvider } from '@/contexts/financial/FinancialContext';

// Components for each tab
import { FinancialReportsPage } from './accounts/FinancialReportsPage';
import { ReceivableAccountsPage } from './accounts/ReceivableAccountsPage';
import { PayableAccountsPage } from './accounts/PayableAccountsPage';

const financialTabs = [
  { id: 'reports', label: 'Relatórios' },
  { id: 'receivable', label: 'Contas a Receber' },
  { id: 'payable', label: 'Contas a Pagar' }
];

const FinancialPage = () => {
  const [activeTab, setActiveTab] = useState('reports');
  const { toast } = useToast();

  useEffect(() => {
    // Check if we have RPC functions for receivable accounts
    const checkDatabaseSetup = async () => {
      try {
        const { error } = await fetch('/api/check-receivable-functions')
          .then(res => {
            if (!res.ok) throw new Error('API request failed');
            return res.json();
          });
          
        if (error) {
          console.error("Database setup error:", error);
          toast({
            title: "Aviso",
            description: "As funções de banco de dados para contas a receber podem não estar configuradas corretamente.",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error("Error checking database setup:", error);
      }
    };
    
    checkDatabaseSetup();
  }, [toast]);

  return (
    <FinancialProvider>
      <AppLayout>
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Gestão Financeira</h1>
            <p className="text-muted-foreground">
              Gerencie relatórios financeiros, contas a receber e a pagar.
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList>
              {financialTabs.map(tab => (
                <TabsTrigger key={tab.id} value={tab.id}>
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="reports" className="space-y-4 mt-6">
              <FinancialReportsPage />
            </TabsContent>

            <TabsContent value="receivable" className="space-y-4 mt-6">
              <ReceivableAccountsPage />
            </TabsContent>

            <TabsContent value="payable" className="space-y-4 mt-6">
              <PayableAccountsPage />
            </TabsContent>
          </Tabs>
        </div>
      </AppLayout>
    </FinancialProvider>
  );
};

export default FinancialPage;
