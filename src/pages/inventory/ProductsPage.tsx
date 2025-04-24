
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
import { Package, Plus, Search } from 'lucide-react';
import { FormField } from '@/components/ui/form-field';
import { Product } from '@/types';

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

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [products] = useState<Product[]>(mockProducts);
  
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    product.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Package className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Produtos e Materiais</h1>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Novo Produto
        </Button>
      </div>
      
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar por nome ou código..."
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
              <TableHead>Código</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Unidade</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Estoque Atual</TableHead>
              <TableHead>Localização</TableHead>
              <TableHead>Fornecedor</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.code}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.unit}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell className={product.currentStock <= (product.minStock || 0) ? 'text-red-500 font-medium' : ''}>
                    {product.currentStock} {product.unit}
                  </TableCell>
                  <TableCell>{product.location}</TableCell>
                  <TableCell>{product.supplier}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center h-24">
                  {searchTerm ? "Nenhum produto encontrado" : "Nenhum produto cadastrado"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Product form would be added as a dialog component */}
    </div>
  );
}
