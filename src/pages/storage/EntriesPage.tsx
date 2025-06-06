
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { PackagePlus, Plus, Search } from 'lucide-react';
import { StorageEntry, StorageProduct } from '@/types/storage';
import { EntryFormDialog } from '@/components/storage/EntryFormDialog';
import { useToast } from '@/hooks/use-toast';
import { useClients } from '@/contexts';
import { v4 as uuidv4 } from 'uuid';

// Mock data for demonstration
const mockProducts: StorageProduct[] = [
  {
    id: '1',
    description: 'Equipamentos Eletrônicos - Notebooks',
    code: 'ELE001',
    unitPrice: 2500.00,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    description: 'Peças Automotivas - Filtros',
    code: 'AUT002',
    unitPrice: 45.50,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const mockEntries: StorageEntry[] = [
  {
    id: '1',
    arrivalDate: new Date().toISOString().split('T')[0],
    productId: '1',
    productDescription: 'Equipamentos Eletrônicos - Notebooks',
    quantity: 50,
    invoiceNumber: 'NF-123456',
    supplier: 'Tech Solutions Ltda',
    clientId: '1',
    unitPrice: 2500.00,
    totalPrice: 125000.00,
    carrier: 'Transportadora Express',
    transportDocument: 'CT-e 789012',
    receivedBy: 'João Silva',
    observations: 'Mercadoria em perfeito estado',
    createdAt: new Date().toISOString()
  }
];

export default function EntriesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [entries, setEntries] = useState<StorageEntry[]>(mockEntries);
  const [products] = useState<StorageProduct[]>(mockProducts);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<StorageEntry | undefined>(undefined);
  const { toast } = useToast();
  const { clients } = useClients();
  
  const filteredEntries = entries.filter(entry => 
    entry.productDescription.toLowerCase().includes(searchTerm.toLowerCase()) || 
    entry.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Format date for display
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  // Format currency
  const formatCurrency = (value: number): string => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const handleOpenDialog = () => {
    setSelectedEntry(undefined);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleSave = (entryData: Omit<StorageEntry, 'id' | 'createdAt'>) => {
    if (selectedEntry) {
      // Atualizar entrada existente
      const updatedEntries = entries.map(e => 
        e.id === selectedEntry.id 
          ? { 
              ...e, 
              ...entryData
            } 
          : e
      );
      setEntries(updatedEntries);
      toast({
        title: "Entrada atualizada",
        description: "As alterações foram salvas com sucesso"
      });
    } else {
      // Criar nova entrada
      const newEntry: StorageEntry = {
        ...entryData,
        id: uuidv4(),
        createdAt: new Date().toISOString()
      };
      setEntries([...entries, newEntry]);
      toast({
        title: "Entrada registrada",
        description: "A nova entrada foi registrada com sucesso"
      });
    }
  };

  const handleEdit = (entry: StorageEntry) => {
    setSelectedEntry(entry);
    setIsDialogOpen(true);
  };

  const getClientName = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    return client?.name || 'Cliente não encontrado';
  };

  return (
    <div className="container py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <PackagePlus className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Nova Entrada de Produto</h1>
        </div>
        <Button onClick={handleOpenDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Entrada
        </Button>
      </div>
      
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar por produto ou nota fiscal..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Produto</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Quantidade</TableHead>
              <TableHead>Nota Fiscal</TableHead>
              <TableHead>Fornecedor</TableHead>
              <TableHead>Valor Total</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEntries.length > 0 ? (
              filteredEntries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>{formatDate(entry.arrivalDate)}</TableCell>
                  <TableCell>{entry.productDescription}</TableCell>
                  <TableCell>{getClientName(entry.clientId)}</TableCell>
                  <TableCell>{entry.quantity}</TableCell>
                  <TableCell>{entry.invoiceNumber}</TableCell>
                  <TableCell>{entry.supplier}</TableCell>
                  <TableCell>{formatCurrency(entry.totalPrice)}</TableCell>
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleEdit(entry)}
                    >
                      Editar
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center h-24">
                  {searchTerm ? "Nenhuma entrada encontrada" : "Nenhuma entrada registrada"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      <EntryFormDialog 
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        onSave={handleSave}
        products={products}
        clients={clients}
        entry={selectedEntry}
      />
    </div>
  );
}
