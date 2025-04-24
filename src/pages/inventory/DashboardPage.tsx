
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Database, Search, AlertTriangle, PackagePlus, PackageMinus } from 'lucide-react';
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
    currentStock: 3, // Below min stock
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
  },
  {
    id: '3',
    name: 'Filtro de óleo',
    code: 'FO12345',
    unit: 'unidade',
    category: 'Peça de reposição',
    supplier: 'Auto Peças Brasil',
    location: 'Corredor B, Prateleira 2',
    minStock: 10,
    currentStock: 4, // Below min stock
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export default function DashboardPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [products] = useState<Product[]>(mockProducts);
  
  const lowStockItems = products.filter(product => 
    product.minStock !== undefined && product.currentStock <= product.minStock
  );
  
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    product.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayProducts = activeTab === 'alerts' ? lowStockItems : filteredProducts;

  return (
    <div className="container py-6 space-y-6">
      <div className="flex items-center space-x-2">
        <Database className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Dashboard de Estoque</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total de Produtos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-amber-50 dark:bg-amber-950">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <AlertTriangle className="h-4 w-4 mr-1 text-amber-600" />
              <span>Produtos Abaixo do Mínimo</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lowStockItems.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Movimentações Hoje</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center space-x-4">
            <div className="flex items-center">
              <PackagePlus className="h-4 w-4 mr-1 text-green-600" />
              <span className="text-lg font-medium">2</span>
            </div>
            <div className="flex items-center">
              <PackageMinus className="h-4 w-4 mr-1 text-red-600" />
              <span className="text-lg font-medium">1</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs 
        defaultValue="all" 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <TabsList>
            <TabsTrigger value="all">Todos os Itens</TabsTrigger>
            <TabsTrigger value="alerts" className="flex items-center gap-1">
              <AlertTriangle className="h-3.5 w-3.5" />
              Alertas de Estoque
            </TabsTrigger>
          </TabsList>
          
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar produto..."
              className="pl-8 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <TabsContent value="all" className="m-0">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Estoque Atual</TableHead>
                  <TableHead>Estoque Mínimo</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayProducts.length > 0 ? (
                  displayProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>{product.code}</TableCell>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>{product.currentStock}</TableCell>
                      <TableCell>{product.minStock || '-'}</TableCell>
                      <TableCell>
                        {product.minStock !== undefined && product.currentStock <= product.minStock ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Abaixo do mínimo
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            Normal
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center h-24">
                      {searchTerm ? "Nenhum produto encontrado" : "Nenhum produto cadastrado"}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        
        <TabsContent value="alerts" className="m-0">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Estoque Atual</TableHead>
                  <TableHead>Estoque Mínimo</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lowStockItems.length > 0 ? (
                  lowStockItems.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>{product.code}</TableCell>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell className="text-red-600 font-medium">{product.currentStock}</TableCell>
                      <TableCell>{product.minStock}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Abaixo do mínimo
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center h-24">
                      <span className="flex items-center justify-center gap-1">
                        Nenhum produto abaixo do estoque mínimo
                      </span>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Additional charts and reports would go here */}
    </div>
  );
}
