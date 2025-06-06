
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { BarChart3, Package, Users, TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import { StorageStats } from '@/types/storage';

// Mock data for demonstration
const mockStats: StorageStats = {
  totalProducts: 156,
  totalItemsStored: 2847,
  activeClients: 23,
  entriesThisMonth: 45,
  exitsThisMonth: 38,
  entriesThisWeek: 12,
  exitsThisWeek: 9,
  entriesToday: 3,
  exitsToday: 2
};

const mockStockByClient = [
  { client: 'Tech Solutions', items: 450, percentage: 25 },
  { client: 'Auto Parts Inc', items: 380, percentage: 21 },
  { client: 'Medical Devices', items: 320, percentage: 18 },
  { client: 'Construction Co', items: 290, percentage: 16 },
  { client: 'Outros', items: 360, percentage: 20 }
];

const mockMovementData = [
  { period: 'Jan', entradas: 42, saidas: 35 },
  { period: 'Fev', entradas: 38, saidas: 41 },
  { period: 'Mar', entradas: 45, saidas: 38 },
  { period: 'Abr', entradas: 52, saidas: 44 },
  { period: 'Mai', entradas: 48, saidas: 46 },
  { period: 'Jun', entradas: 55, saidas: 52 }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function DashboardPage() {
  return (
    <div className="container py-6 space-y-6">
      <div className="flex items-center space-x-2">
        <BarChart3 className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Dashboard de Armazenagem</h1>
      </div>
      
      {/* Resumo Geral */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Produtos em Estoque</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">tipos diferentes</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Itens Armazenados</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.totalItemsStored.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">unidades totais</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes Ativos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.activeClients}</div>
            <p className="text-xs text-muted-foreground">com estoque</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Movimento Hoje</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                <span className="text-sm font-medium">{mockStats.entriesToday}</span>
              </div>
              <div className="flex items-center">
                <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                <span className="text-sm font-medium">{mockStats.exitsToday}</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">entradas / saídas</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Movimentação por Período */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle>Movimentação por Período</CardTitle>
            <CardDescription>Entradas e saídas nos últimos 6 meses</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockMovementData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="entradas" fill="#22c55e" name="Entradas" />
                <Bar dataKey="saidas" fill="#ef4444" name="Saídas" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        {/* Estatísticas Rápidas */}
        <Card>
          <CardHeader>
            <CardTitle>Estatísticas</CardTitle>
            <CardDescription>Resumo de movimentação</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Este Mês</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-muted-foreground">Entradas:</span>
                <span className="text-sm font-medium text-green-600">{mockStats.entriesThisMonth}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-muted-foreground">Saídas:</span>
                <span className="text-sm font-medium text-red-600">{mockStats.exitsThisMonth}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Esta Semana</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-muted-foreground">Entradas:</span>
                <span className="text-sm font-medium text-green-600">{mockStats.entriesThisWeek}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-muted-foreground">Saídas:</span>
                <span className="text-sm font-medium text-red-600">{mockStats.exitsThisWeek}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Estoque por Cliente */}
      <Card>
        <CardHeader>
          <CardTitle>Estoque por Cliente</CardTitle>
          <CardDescription>Distribuição de itens armazenados por cliente</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={mockStockByClient}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ client, percentage }) => `${client} (${percentage}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="items"
                >
                  {mockStockByClient.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            
            <div className="space-y-2">
              {mockStockByClient.map((client, index) => (
                <div key={client.client} className="flex items-center justify-between p-2 rounded border">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-sm font-medium">{client.client}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{client.items.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">{client.percentage}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
