
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useClients } from '@/contexts/clients';
import { ClientTable } from '@/components/client/ClientTable';
import { toast } from 'sonner';
import { Client } from '@/types';

export function ClientsManagement() {
  const { clients, loading, deleteClient, updateClient } = useClients();
  const [searchTerm, setSearchTerm] = useState('');

  // Sort clients alphabetically by trading name or name
  const sortedClients = [...clients].sort((a, b) => {
    const nameA = (a.tradingName || a.name).toLowerCase();
    const nameB = (b.tradingName || b.name).toLowerCase();
    return nameA.localeCompare(nameB, 'pt-BR');
  });

  const handleEditClient = (client: Client) => {
    // In the settings context, we'll just show a toast since we don't have the edit dialog here
    toast.info("Edição de cliente", {
      description: `Para editar ${client.name}, acesse a página de Clientes.`
    });
  };

  const handleDeleteClient = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este cliente?')) {
      deleteClient(id);
      toast.success("Cliente excluído com sucesso");
    }
  };

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
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <ClientTable 
              clients={sortedClients}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              onEditClient={handleEditClient}
              onDeleteClient={handleDeleteClient}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
