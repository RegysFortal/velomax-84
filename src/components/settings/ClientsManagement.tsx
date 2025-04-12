
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useClients } from '@/contexts/clients';
import { ClientTable } from '@/components/client/ClientTable';

export function ClientsManagement() {
  const { clients, isLoading } = useClients();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gerenciamento de Clientes</CardTitle>
          <CardDescription>
            Visualize e gerencie a base de clientes da empresa.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <ClientTable clients={clients} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
