
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { Client } from '@/types';
import { SearchWithMagnifier } from '@/components/ui/search-with-magnifier';

interface ClientTableProps {
  clients: Client[];
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  onEditClient: (client: Client) => void;
  onDeleteClient: (id: string) => void;
}

export function ClientTable({
  clients,
  searchTerm,
  setSearchTerm,
  onEditClient,
  onDeleteClient,
}: ClientTableProps) {
  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.tradingName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-md font-semibold">Clientes Recentes</h3>
        <p className="text-sm text-muted-foreground">
          {clients.length} clientes no total
        </p>
        <SearchWithMagnifier
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Buscar clientes..."
          className="w-[200px] md:w-[300px]"
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Nome</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Telefone</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredClients.map((client) => (
            <TableRow key={client.id}>
              <TableCell className="font-medium">{client.name}</TableCell>
              <TableCell>{client.email}</TableCell>
              <TableCell>{client.phone}</TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEditClient(client)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDeleteClient(client.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {filteredClients.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                Nenhum cliente encontrado.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
