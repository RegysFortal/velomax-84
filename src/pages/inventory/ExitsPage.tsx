
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
import { StockExit } from '@/types';

// Mock data for demonstration
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
  const [exits] = useState<StockExit[]>(mockExits);
  
  const filteredExits = exits.filter(exit => 
    exit.productName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (exit.documentNumber && exit.documentNumber.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Format date for display
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="container py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <PackageMinus className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Saída de Materiais</h1>
        </div>
        <Button>
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
      
      {/* Exit form would be added as a dialog component */}
    </div>
  );
}
