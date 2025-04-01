
import { useAuth } from '@/contexts/AuthContext';
import { useLogbook } from '@/contexts/LogbookContext';
import { AppLayout } from '@/components/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, ClipboardList, Package, TrendingUp, Truck, Users, Calendar, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { format, isSameDay, isSameMonth, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

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
  const isAdmin = user?.role === 'admin';
  const isManager = user?.role === 'manager';
  const hasClientAccess = user?.permissions?.clients;
  const hasFinancialAccess = user?.permissions?.financial;
  const hasReportsAccess = user?.permissions?.reports;
  
  const today = new Date();
  
  // Find employees with birthdays today
  const birthdaysToday = employees.filter(employee => {
    if (!employee.dateOfBirth) return false;
    const birthDate = parseISO(employee.dateOfBirth);
    return isSameDay(new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate()), today);
  });
  
  // Find employees with birthdays this month
  const birthdaysThisMonth = employees.filter(employee => {
    if (!employee.dateOfBirth) return false;
    const birthDate = parseISO(employee.dateOfBirth);
    return isSameMonth(new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate()), today) && 
           !birthdaysToday.includes(employee);
  });
  
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
          <h2 className="text-xl font-semibold mb-4">Acesso Rápido</h2>
          <div className="flex flex-wrap gap-3">
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
