
import { useAuth } from '@/contexts/AuthContext';
import { AppLayout } from '@/components/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, ClipboardList, Package, TrendingUp, Truck, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const DashboardCard = ({ 
  title, 
  value, 
  description, 
  icon: Icon,
  href,
  iconColor = "text-primary" 
}: { 
  title: string, 
  value: string, 
  description: string, 
  icon: React.ElementType,
  href?: string,
  iconColor?: string
}) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className={`h-4 w-4 ${iconColor}`} />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">{description}</p>
      {href && (
        <Button asChild variant="link" className="px-0 mt-2">
          <Link to={href}>Ver detalhes</Link>
        </Button>
      )}
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const canManageClients = isAdmin || user?.role === 'manager';
  
  // Mock data - would come from API in production
  const stats = {
    clients: 32,
    deliveries: 178,
    activeDeliveries: 24,
    currentMonthDeliveries: 45,
    avgFreight: 'R$ 84,35',
    totalFreight: 'R$ 3.795,75'
  };
  
  return (
    <AppLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Bem-vindo, {user?.name}! Aqui estão os dados do sistema.
          </p>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {canManageClients && (
            <DashboardCard
              title="Clientes Cadastrados"
              value={stats.clients.toString()}
              description="Total de clientes no sistema"
              icon={Users}
              href="/clients"
            />
          )}
          <DashboardCard
            title="Total de Entregas"
            value={stats.deliveries.toString()}
            description="Número total de entregas registradas"
            icon={Package}
            href="/deliveries"
          />
          <DashboardCard
            title="Entregas Ativas"
            value={stats.activeDeliveries.toString()}
            description="Entregas em andamento"
            icon={Truck}
            iconColor="text-velomax-red"
          />
          <DashboardCard
            title="Entregas do Mês"
            value={stats.currentMonthDeliveries.toString()}
            description="Total de entregas no mês atual"
            icon={ClipboardList}
          />
          <DashboardCard
            title="Frete Médio"
            value={stats.avgFreight}
            description="Valor médio dos fretes"
            icon={TrendingUp}
            iconColor="text-green-500"
          />
          <DashboardCard
            title="Total de Fretes (Mês)"
            value={stats.totalFreight}
            description="Valor total dos fretes no mês atual"
            icon={BarChart3}
            href="/reports"
            iconColor="text-blue-500"
          />
        </div>
        
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Acesso Rápido</h2>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link to="/deliveries/new">Nova Entrega</Link>
            </Button>
            
            {canManageClients && (
              <Button asChild variant="outline">
                <Link to="/clients/new">Novo Cliente</Link>
              </Button>
            )}
            
            <Button asChild variant="outline">
              <Link to="/reports">Gerar Relatório</Link>
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
