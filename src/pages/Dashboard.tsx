
import { useAuth } from '@/contexts/AuthContext';
import { useLogbook } from '@/contexts/LogbookContext';
import { useShipments } from '@/contexts/ShipmentsContext';
import { AppLayout } from '@/components/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, ClipboardList, Package, TrendingUp, Truck, Users, Calendar, Gift, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { format, isSameDay, isSameMonth, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { StatusBadge } from '@/components/shipment/StatusBadge';
import { Shipment } from '@/types/shipment';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useEffect, useState } from 'react';
import { useClients } from '@/contexts/ClientsContext';
import { useDeliveries } from '@/contexts/DeliveriesContext';

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
  const { employees } = useLogbook();
  const { shipments } = useShipments();
  const { clients } = useClients();
  const { deliveries } = useDeliveries();
  const [stats, setStats] = useState({
    clients: 0,
    deliveries: 0,
    activeDeliveries: 0,
    currentMonthDeliveries: 0,
    avgFreight: 'R$ 0,00',
    totalFreight: 'R$ 0,00'
  });
  
  const isAdmin = user?.role === 'admin';
  const isManager = user?.role === 'manager';
  const hasClientAccess = user?.permissions?.clients;
  const hasFinancialAccess = user?.permissions?.financial;
  const hasReportsAccess = user?.permissions?.reports;
  
  const today = new Date();
  
  useEffect(() => {
    // Since Delivery type does not have a 'status' property, let's consider all
    // deliveries as active for now - this would need a proper implementation
    const activeDeliveries = deliveries.length;
    
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const currentMonthDeliveries = deliveries.filter(d => {
      const deliveryDate = new Date(d.deliveryDate);
      return deliveryDate.getMonth() === currentMonth && deliveryDate.getFullYear() === currentYear;
    }).length;
    
    const freightValues = deliveries.map(d => d.totalFreight || 0);
    const totalFreight = freightValues.reduce((sum, value) => sum + value, 0);
    const avgFreight = freightValues.length > 0 ? totalFreight / freightValues.length : 0;
    
    const formatter = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
    
    setStats({
      clients: clients.length,
      deliveries: deliveries.length,
      activeDeliveries,
      currentMonthDeliveries,
      avgFreight: formatter.format(avgFreight),
      totalFreight: formatter.format(totalFreight)
    });
  }, [clients, deliveries, today]);
  
  const birthdaysToday = employees.filter(employee => {
    if (!employee.dateOfBirth) return false;
    const birthDate = parseISO(employee.dateOfBirth);
    return isSameDay(new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate()), today);
  });
  
  const birthdaysThisMonth = employees.filter(employee => {
    if (!employee.dateOfBirth) return false;
    const birthDate = parseISO(employee.dateOfBirth);
    return isSameMonth(new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate()), today) && 
           !birthdaysToday.includes(employee);
  });
  
  const isShipmentOverdue = (shipment: Shipment) => {
    if (!shipment.arrivalDate) return false;
    
    const arrivalDate = new Date(shipment.arrivalDate);
    const today = new Date();
    
    arrivalDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    
    return arrivalDate < today && shipment.status !== 'delivered';
  };
  
  const overdueShipments = shipments.filter(isShipmentOverdue);
  const retainedShipments = shipments.filter(s => s.isRetained);
  
  const shipmentStats = {
    total: shipments.length,
    inTransit: shipments.filter(s => s.status === 'in_transit').length,
    retained: retainedShipments.length,
    delivered: shipments.filter(s => s.status === 'delivered').length,
    overdue: overdueShipments.length
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
        
        {overdueShipments.length > 0 && (
          <Alert className="bg-amber-50 border-amber-200">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            <AlertTitle className="text-amber-800">Embarques atrasados!</AlertTitle>
            <AlertDescription className="text-amber-700">
              Existem {overdueShipments.length} embarques atrasados que ainda não foram retirados.
            </AlertDescription>
            <Button asChild variant="link" className="p-0 mt-2">
              <Link to="/shipments">Ver detalhes</Link>
            </Button>
          </Alert>
        )}
        
        {retainedShipments.length > 0 && (
          <Alert className="bg-red-50 border-red-200">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <AlertTitle className="text-red-800">Embarques retidos!</AlertTitle>
            <AlertDescription className="text-red-700">
              Existem {retainedShipments.length} embarques retidos na fiscalização.
            </AlertDescription>
            <Button asChild variant="link" className="p-0 mt-2">
              <Link to="/shipments">Ver detalhes</Link>
            </Button>
          </Alert>
        )}
        
        {birthdaysToday.length > 0 && isAdmin && (
          <Alert className="bg-blue-50 border-blue-200">
            <Gift className="h-5 w-5 text-blue-600" />
            <AlertTitle className="text-blue-800">Aniversariante(s) do dia!</AlertTitle>
            <AlertDescription className="text-blue-700">
              {birthdaysToday.map(employee => (
                <div key={employee.id} className="font-medium">
                  Feliz aniversário para {employee.name}!
                </div>
              ))}
            </AlertDescription>
          </Alert>
        )}
        
        {birthdaysThisMonth.length > 0 && isAdmin && (
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Aniversariantes do mês</CardTitle>
                <Calendar className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {birthdaysThisMonth.map(employee => {
                  if (!employee.dateOfBirth) return null;
                  const birthDate = parseISO(employee.dateOfBirth);
                  return (
                    <div key={employee.id} className="flex justify-between items-center text-sm">
                      <span>{employee.name}</span>
                      <span className="text-muted-foreground">
                        {format(new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate()), "dd 'de' MMMM", { locale: ptBR })}
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <DashboardCard
            title="Total de Embarques"
            value={shipmentStats.total.toString()}
            description="Número total de embarques registrados"
            icon={Package}
            href="/shipments"
          />
          
          <DashboardCard
            title="Em Trânsito"
            value={shipmentStats.inTransit.toString()}
            description="Embarques em trânsito"
            icon={Truck}
            href="/shipments"
          />
          
          <DashboardCard
            title="Retidos"
            value={shipmentStats.retained.toString()}
            description="Embarques retidos pela fiscalização"
            icon={AlertTriangle}
            href="/shipments"
            iconColor="text-red-500"
          />
          
          <DashboardCard
            title="Embarques Atrasados"
            value={shipmentStats.overdue.toString()}
            description="Não retirados após data prevista"
            icon={AlertTriangle}
            href="/shipments"
            iconColor="text-amber-500"
          />
          
          {hasClientAccess && (
            <DashboardCard
              title="Clientes Cadastrados"
              value={stats.clients.toString()}
              description="Total de clientes no sistema"
              icon={Users}
              href="/clients"
            />
          )}
          
          {hasReportsAccess && (
            <DashboardCard
              title="Total de Entregas"
              value={stats.deliveries.toString()}
              description="Número total de entregas registradas"
              icon={Package}
              href="/deliveries"
            />
          )}
          
          {hasReportsAccess && (
            <DashboardCard
              title="Entregas Ativas"
              value={stats.activeDeliveries.toString()}
              description="Entregas em andamento"
              icon={Truck}
              iconColor="text-velomax-red"
            />
          )}
          
          {hasReportsAccess && (
            <DashboardCard
              title="Entregas do Mês"
              value={stats.currentMonthDeliveries.toString()}
              description="Total de entregas no mês atual"
              icon={ClipboardList}
            />
          )}
          
          {hasFinancialAccess && (
            <DashboardCard
              title="Frete Médio"
              value={stats.avgFreight}
              description="Valor médio dos fretes"
              icon={TrendingUp}
              iconColor="text-green-500"
            />
          )}
          
          {hasFinancialAccess && (
            <DashboardCard
              title="Total de Fretes (Mês)"
              value={stats.totalFreight}
              description="Valor total dos fretes no mês atual"
              icon={BarChart3}
              href="/reports"
              iconColor="text-blue-500"
            />
          )}
        </div>
        
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Embarques que necessitam atenção</h2>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Embarques atrasados e retidos</CardTitle>
              <CardDescription>
                Lista dos embarques que requerem atenção imediata
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-white rounded-md overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Empresa</TableHead>
                      <TableHead>Conhecimento</TableHead>
                      <TableHead>Chegada</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {overdueShipments.length === 0 && retainedShipments.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-4">
                          Não há embarques atrasados ou retidos
                        </TableCell>
                      </TableRow>
                    ) : (
                      [...overdueShipments, ...retainedShipments]
                        .filter((shipment, index, self) => 
                          index === self.findIndex((s) => s.id === shipment.id)
                        )
                        .slice(0, 5)
                        .map((shipment) => (
                          <TableRow 
                            key={shipment.id}
                            className={shipment.isRetained ? "bg-red-50" : "bg-amber-50"}
                          >
                            <TableCell>{shipment.companyName}</TableCell>
                            <TableCell>{shipment.trackingNumber}</TableCell>
                            <TableCell>
                              {shipment.arrivalDate 
                                ? format(new Date(shipment.arrivalDate), 'dd/MM/yyyy', { locale: ptBR })
                                : 'Não definida'}
                            </TableCell>
                            <TableCell>
                              <StatusBadge status={shipment.status} />
                            </TableCell>
                          </TableRow>
                        ))
                    )}
                  </TableBody>
                </Table>
              </div>
              {(overdueShipments.length > 0 || retainedShipments.length > 0) && (
                <div className="mt-4 text-right">
                  <Button asChild variant="outline">
                    <Link to="/shipments">Ver todos os embarques</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Acesso Rápido</h2>
          <div className="flex flex-wrap gap-3">
            {hasReportsAccess && (
              <Button asChild>
                <Link to="/shipments/new">Novo Embarque</Link>
              </Button>
            )}
            
            {hasReportsAccess && (
              <Button asChild>
                <Link to="/deliveries/new">Nova Entrega</Link>
              </Button>
            )}
            
            {hasClientAccess && (
              <Button asChild variant="outline">
                <Link to="/clients/new">Novo Cliente</Link>
              </Button>
            )}
            
            {hasReportsAccess && (
              <Button asChild variant="outline">
                <Link to="/reports">Gerar Relatório</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
