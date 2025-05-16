
import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
} from '@/components/ui/card';
import { useClients } from '@/contexts';
import { Client } from '@/types';
import { ClientTable } from '@/components/client/ClientTable';
import { ClientAddDialog } from '@/components/client/ClientAddDialog';
import { ClientEditDialog } from '@/components/client/ClientEditDialog';

const ClientsPage = () => {
  const { clients, deleteClient } = useClients();
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const handleEditClient = useCallback((client: Client) => {
    console.log("Editing client:", client);
    setSelectedClient(client);
    setIsEditModalOpen(true);
  }, []);

  const handleDeleteClient = useCallback((id: string) => {
    deleteClient(id);
  }, [deleteClient]);

  const handleEditModalClose = useCallback((open: boolean) => {
    console.log("Edit modal state change:", open);
    if (!open) {
      setIsEditModalOpen(false);
      // Only reset selectedClient when the modal is definitely closed
      setTimeout(() => {
        setSelectedClient(null);
      }, 100); // Increased delay for better reliability
    } else {
      setIsEditModalOpen(open);
    }
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clientes</h1>
          <p className="text-muted-foreground">
            Gerencie os clientes da sua empresa.
          </p>
        </div>
        <ClientAddDialog />
      </div>

      <Card>
        <CardHeader className="pb-2">
        </CardHeader>
        <CardContent className="pl-2 pb-4 pt-0">
          <ClientTable 
            clients={clients}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onEditClient={handleEditClient}
            onDeleteClient={handleDeleteClient}
          />
        </CardContent>
      </Card>

      <ClientEditDialog 
        isOpen={isEditModalOpen}
        onOpenChange={handleEditModalClose}
        client={selectedClient}
      />
    </div>
  );
};

export default ClientsPage;
