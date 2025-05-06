
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
import { StockEntry, Product } from '@/types';
import { EntryFormDialog } from '@/components/inventory/EntryFormDialog';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';

// Mock data for demonstration
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Pneu 175/70 R14',
    code: 'PN17570R14',
    unit: 'unidade',
    category: 'Peça de reposição',
    supplier: 'Auto Peças Brasil',
    location: 'Corredor B, Prateleira 3',
    minStock: 5,
    currentStock: 12,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Óleo Lubrificante 15W40',
    code: 'OL15W40',
    unit: 'L',
    category: 'Insumo',
    supplier: 'Petrobrás Distribuidora',
    location: 'Corredor A, Prateleira 1',
    minStock: 20,
    currentStock: 45,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const mockEntries: StockEntry[] = [
  {
    id: '1',
    date: new Date().toISOString(),
    productId: '1',
    productName: 'Pneu 175/70 R14',
    quantity: 10,
    invoiceNumber: 'NF-45678',
    supplier: 'Auto Peças Brasil',
    unitPrice: 250,
    totalPrice: 2500,
    transportDocument: 'CT-12345',
    receivedBy: 'João Silva',
    observations: 'Entrega realizada dentro do prazo',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    date: new Date(Date.now() - 86400000).toISOString(), // yesterday
    productId: '2',
    productName: 'Óleo Lubrificante 15W40',
    quantity: 20,
    invoiceNumber: 'NF-45679',
    supplier: 'Petrobrás Distribuidora',
    unitPrice: 25,
    totalPrice: 500,
    transportDocument: 'CT-12346',
    receivedBy: 'Maria Oliveira',
    observations: '',
    createdAt: new Date(Date.now() - 86400000).toISOString()
  }
];

export default function EntriesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [entries, setEntries] = useState<StockEntry[]>(mockEntries);
  const [products] = useState<Product[]>(mockProducts);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<StockEntry | undefined>(undefined);
  const { toast } = useToast();
  
  const filteredEntries = entries.filter(entry => 
    entry.productName.toLowerCase().includes(searchTerm.toLowerCase()) || 
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

  const handleSave = (entryData: Omit<StockEntry, 'id' | 'createdAt'>) => {
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
      const newEntry: StockEntry = {
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

  const handleEdit = (entry: StockEntry) => {
    setSelectedEntry(entry);
    setIsDialogOpen(true);
  };

  return (
    <div className="container py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <PackagePlus className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Entrada de Materiais</h1>
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
              <TableHead>Quantidade</TableHead>
              <TableHead>Nota Fiscal</TableHead>
              <TableHead>Fornecedor</TableHead>
              <TableHead>Valor Total</TableHead>
              <TableHead>Recebido por</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEntries.length > 0 ? (
              filteredEntries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>{formatDate(entry.date)}</TableCell>
                  <TableCell>{entry.productName}</TableCell>
                  <TableCell>{entry.quantity}</TableCell>
                  <TableCell>{entry.invoiceNumber}</TableCell>
                  <TableCell>{entry.supplier}</TableCell>
                  <TableCell>{formatCurrency(entry.totalPrice)}</TableCell>
                  <TableCell>{entry.receivedBy}</TableCell>
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
        entry={selectedEntry}
      />
    </div>
  );
}
