
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
import { StorageProduct } from '@/types/storage';
import { ProductFormDialog } from '@/components/storage/ProductFormDialog';
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

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<StorageProduct[]>(mockProducts);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<StorageProduct | undefined>(undefined);
  const { toast } = useToast();
  
  const filteredProducts = products.filter(product => 
    product.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
    product.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenDialog = () => {
    setSelectedProduct(undefined);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleSave = (productData: Omit<StorageProduct, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (selectedProduct) {
      // Atualizar produto existente
      const updatedProducts = products.map(p => 
        p.id === selectedProduct.id 
          ? { 
              ...p, 
              ...productData, 
              updatedAt: new Date().toISOString() 
            } 
          : p
      );
      setProducts(updatedProducts);
      toast({
        title: "Produto atualizado",
        description: "As alterações foram salvas com sucesso"
      });
    } else {
      // Criar novo produto
      const newProduct: StorageProduct = {
        ...productData,
        id: uuidv4(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setProducts([...products, newProduct]);
      toast({
        title: "Produto cadastrado",
        description: "O novo produto foi adicionado ao sistema"
      });
    }
  };

  const handleEdit = (product: StorageProduct) => {
    setSelectedProduct(product);
    setIsDialogOpen(true);
  };

  // Format currency
  const formatCurrency = (value: number): string => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <div className="container py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Package className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Cadastro de Produtos</h1>
        </div>
        <Button onClick={handleOpenDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Produto
        </Button>
      </div>
      
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar por descrição ou código..."
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
              <TableHead>Descrição do Produto</TableHead>
              <TableHead>Valor Unitário</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.code}</TableCell>
                  <TableCell>{product.description}</TableCell>
                  <TableCell>{formatCurrency(product.unitPrice)}</TableCell>
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleEdit(product)}
                    >
                      Editar
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center h-24">
                  {searchTerm ? "Nenhum produto encontrado" : "Nenhum produto cadastrado"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      <ProductFormDialog 
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        onSave={handleSave}
        product={selectedProduct}
      />
    </div>
  );
}
