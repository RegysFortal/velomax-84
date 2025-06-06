
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
import { PackageMinus, Plus, Search } from 'lucide-react';
import { StorageExit, StorageProduct } from '@/types/storage';
import { ExitFormDialog } from '@/components/storage/ExitFormDialog';
import { useToast } from '@/hooks/use-toast';
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

const mockExits: StorageExit[] = [
  {
    id: '1',
    exitDate: new Date().toISOString().split('T')[0],
    productId: '1',
    productDescription: 'Equipamentos Eletrônicos - Notebooks',
    quantity: 10,
    withdrawnBy: 'Tech Company Ltda',
    invoiceNumber: 'NF-654321',
    observations: 'Retirada para cliente final',
    createdAt: new Date().toISOString()
  }
];

export default function ExitsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [exits, setExits] = useState<StorageExit[]>(mockExits);
  const [products] = useState<StorageProduct[]>(mockProducts);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedExit, setSelectedExit] = useState<StorageExit | undefined>(undefined);
  const { toast } = useToast();
  
  const filteredExits = exits.filter(exit => 
    exit.productDescription.toLowerCase().includes(searchTerm.toLowerCase()) || 
    exit.withdrawnBy.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Format date for display
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const handleOpenDialog = () => {
    setSelectedExit(undefined);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleSave = (exitData: Omit<StorageExit, 'id' | 'createdAt'>) => {
    if (selectedExit) {
      // Atualizar saída existente
      const updatedExits = exits.map(e => 
        e.id === selectedExit.id 
          ? { 
              ...e, 
              ...exitData
            } 
          : e
      );
      setExits(updatedExits);
      toast({
        title: "Saída atualizada",
        description: "As alterações foram salvas com sucesso"
      });
    } else {
      // Criar nova saída
      const newExit: StorageExit = {
        ...exitData,
        id: uuidv4(),
        createdAt: new Date().toISOString()
      };
      setExits([...exits, newExit]);
      toast({
        title: "Saída registrada",
        description: "A nova saída foi registrada com sucesso"
      });
    }
  };

  const handleEdit = (exit: StorageExit) => {
    setSelectedExit(exit);
    setIsDialogOpen(true);
  };

  return (
    <div className="container py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <PackageMinus className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Nova Saída de Produto</h1>
        </div>
        <Button onClick={handleOpenDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Saída
        </Button>
      </div>
      
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar por produto ou retirado por..."
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
              <TableHead>Retirado Por</TableHead>
              <TableHead>Nota Fiscal</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredExits.length > 0 ? (
              filteredExits.map((exit) => (
                <TableRow key={exit.id}>
                  <TableCell>{formatDate(exit.exitDate)}</TableCell>
                  <TableCell>{exit.productDescription}</TableCell>
                  <TableCell>{exit.quantity}</TableCell>
                  <TableCell>{exit.withdrawnBy}</TableCell>
                  <TableCell>{exit.invoiceNumber || '-'}</TableCell>
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleEdit(exit)}
                    >
                      Editar
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-24">
                  {searchTerm ? "Nenhuma saída encontrada" : "Nenhuma saída registrada"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      <ExitFormDialog 
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        onSave={handleSave}
        products={products}
        exit={selectedExit}
      />
    </div>
  );
}
