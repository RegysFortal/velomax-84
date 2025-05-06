
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
import { StockExit, Product } from '@/types';
import { ExitFormDialog } from '@/components/inventory/ExitFormDialog';
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

const mockExits: StockExit[] = [
  {
    id: '1',
    date: new Date().toISOString(),
    productId: '1',
    productName: 'Pneu 175/70 R14',
    quantity: 2,
    purpose: 'Manutenção',
    withdrawnBy: 'Carlos Pereira',
    documentNumber: 'OS-123456',
    observations: 'Substituição de pneus da van de transporte',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    date: new Date(Date.now() - 86400000).toISOString(), // yesterday
    productId: '2',
    productName: 'Óleo Lubrificante 15W40',
    quantity: 5,
    purpose: 'Manutenção',
    withdrawnBy: 'Pedro Santos',
    documentNumber: 'OS-123457',
    observations: 'Troca de óleo dos veículos da frota',
    createdAt: new Date(Date.now() - 86400000).toISOString()
  }
];

export default function ExitsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [exits, setExits] = useState<StockExit[]>(mockExits);
  const [products] = useState<Product[]>(mockProducts);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedExit, setSelectedExit] = useState<StockExit | undefined>(undefined);
  const { toast } = useToast();
  
  const filteredExits = exits.filter(exit => 
    exit.productName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (exit.documentNumber && exit.documentNumber.toLowerCase().includes(searchTerm.toLowerCase()))
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

  const handleSave = (exitData: Omit<StockExit, 'id' | 'createdAt'>) => {
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
      const newExit: StockExit = {
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

  const handleEdit = (exit: StockExit) => {
    setSelectedExit(exit);
    setIsDialogOpen(true);
  };

  return (
    <div className="container py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <PackageMinus className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Saída de Materiais</h1>
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
            placeholder="Buscar por produto ou documento..."
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
              <TableHead>Finalidade</TableHead>
              <TableHead>Documento</TableHead>
              <TableHead>Retirado por</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredExits.length > 0 ? (
              filteredExits.map((exit) => (
                <TableRow key={exit.id}>
                  <TableCell>{formatDate(exit.date)}</TableCell>
                  <TableCell>{exit.productName}</TableCell>
                  <TableCell>{exit.quantity}</TableCell>
                  <TableCell>{exit.purpose}</TableCell>
                  <TableCell>{exit.documentNumber || '-'}</TableCell>
                  <TableCell>{exit.withdrawnBy}</TableCell>
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
                <TableCell colSpan={7} className="text-center h-24">
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
