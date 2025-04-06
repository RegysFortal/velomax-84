import { useState } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { useActivityLog } from '@/contexts/ActivityLogContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Filter, Trash2, User, FileText, Database } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { ActivityAction, EntityType, BadgeVariant } from '@/types/activity';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';

export default function ActivityLogs() {
  const { logs, getLogsByAction, getLogsByEntityType, getLogsByDateRange, clearAllLogs } = useActivityLog();
  const { user } = useAuth();
  const [startDate, setStartDate] = useState<string>(
    format(new Date(new Date().setDate(new Date().getDate() - 7)), 'yyyy-MM-dd')
  );
  const [endDate, setEndDate] = useState<string>(
    format(new Date(), 'yyyy-MM-dd')
  );
  const [actionFilter, setActionFilter] = useState<ActivityAction | 'all'>('all');
  const [entityFilter, setEntityFilter] = useState<EntityType | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const isAdmin = user?.role === 'admin';
  
  if (!isAdmin) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-[70vh]">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Acesso Restrito</h2>
            <p className="text-muted-foreground">Esta página está disponível apenas para administradores.</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  const filteredLogs = logs.filter(log => {
    const logDate = new Date(log.timestamp);
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    
    if (!(logDate >= start && logDate <= end)) {
      return false;
    }
    
    if (actionFilter !== 'all' && log.action !== actionFilter) {
      return false;
    }
    
    if (entityFilter !== 'all' && log.entityType !== entityFilter) {
      return false;
    }
    
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const userNameMatch = log.userName.toLowerCase().includes(searchLower);
      const entityNameMatch = log.entityName?.toLowerCase().includes(searchLower) || false;
      const detailsMatch = log.details?.toLowerCase().includes(searchLower) || false;
      
      if (!(userNameMatch || entityNameMatch || detailsMatch)) {
        return false;
      }
    }
    
    return true;
  });

  const getActionDisplay = (action: ActivityAction): string => {
    const actionMap: Record<ActivityAction, string> = {
      login: 'Login',
      logout: 'Logout',
      create: 'Criação',
      update: 'Atualização',
      delete: 'Exclusão',
      view: 'Visualização',
      export: 'Exportação',
      import: 'Importação',
      register: 'Registro',
      password_reset: 'Redefinição de Senha',
      system: 'Sistema'
    };
    return actionMap[action] || action;
  };

  const getEntityDisplay = (entityType: EntityType): string => {
    const entityMap: Record<EntityType, string> = {
      user: 'Usuário',
      client: 'Cliente',
      delivery: 'Entrega',
      shipment: 'Embarque',
      vehicle: 'Veículo',
      employee: 'Funcionário',
      price_table: 'Tabela de Preços',
      city: 'Cidade',
      maintenance: 'Manutenção',
      tire: 'Pneu',
      report: 'Relatório',
      system: 'Sistema'
    };
    return entityMap[entityType] || entityType;
  };
  
  const getActionBadgeVariant = (action: ActivityAction): BadgeVariant => {
    switch (action) {
      case 'create':
        return 'default';
      case 'update':
        return 'outline';
      case 'delete':
        return 'destructive';
      case 'login':
        return 'success';
      case 'logout':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <AppLayout>
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Logs de Atividades</h1>
            <p className="text-muted-foreground">
              Monitore todas as atividades dos usuários no sistema
            </p>
          </div>
          <Button 
            variant="destructive" 
            onClick={clearAllLogs}
            size="sm"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Limpar Logs
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Clock className="mr-2 h-4 w-4" />
                Total de Atividades
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{logs.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <User className="mr-2 h-4 w-4" />
                Usuários Ativos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{new Set(logs.map(log => log.userId)).size}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Database className="mr-2 h-4 w-4" />
                Operações CRUD
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {logs.filter(log => ['create', 'update', 'delete'].includes(log.action)).length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <FileText className="mr-2 h-4 w-4" />
                Logs no Período
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{filteredLogs.length}</div>
            </CardContent>
          </Card>
        </div>
        
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm font-medium mb-3 flex items-center">
            <Filter className="mr-2 h-4 w-4" />
            Filtros
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <Label htmlFor="startDate">Data inicial</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="endDate">Data final</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="action">Ação</Label>
              <Select 
                value={actionFilter} 
                onValueChange={(val: ActivityAction | 'all') => setActionFilter(val)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Todas as ações" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as ações</SelectItem>
                  <SelectItem value="login">Login</SelectItem>
                  <SelectItem value="logout">Logout</SelectItem>
                  <SelectItem value="create">Criação</SelectItem>
                  <SelectItem value="update">Atualização</SelectItem>
                  <SelectItem value="delete">Exclusão</SelectItem>
                  <SelectItem value="view">Visualização</SelectItem>
                  <SelectItem value="export">Exportação</SelectItem>
                  <SelectItem value="import">Importação</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="entity">Entidade</Label>
              <Select 
                value={entityFilter} 
                onValueChange={(val: EntityType | 'all') => setEntityFilter(val)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Todas as entidades" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as entidades</SelectItem>
                  <SelectItem value="user">Usuário</SelectItem>
                  <SelectItem value="client">Cliente</SelectItem>
                  <SelectItem value="delivery">Entrega</SelectItem>
                  <SelectItem value="shipment">Embarque</SelectItem>
                  <SelectItem value="vehicle">Veículo</SelectItem>
                  <SelectItem value="employee">Funcionário</SelectItem>
                  <SelectItem value="price_table">Tabela de Preços</SelectItem>
                  <SelectItem value="city">Cidade</SelectItem>
                  <SelectItem value="maintenance">Manutenção</SelectItem>
                  <SelectItem value="tire">Pneu</SelectItem>
                  <SelectItem value="report">Relatório</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="search">Buscar</Label>
              <Input
                id="search"
                placeholder="Usuário, entidade ou detalhes"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
        </div>
        
        <ScrollArea className="h-[calc(100vh-500px)]">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data/Hora</TableHead>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Ação</TableHead>
                  <TableHead>Entidade</TableHead>
                  <TableHead>Nome/ID</TableHead>
                  <TableHead>Detalhes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      Nenhum log encontrado para os filtros selecionados
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="whitespace-nowrap">
                        {format(new Date(log.timestamp), 'dd/MM/yyyy HH:mm:ss', { locale: ptBR })}
                      </TableCell>
                      <TableCell>{log.userName}</TableCell>
                      <TableCell>
                        <Badge variant={getActionBadgeVariant(log.action)}>
                          {getActionDisplay(log.action)}
                        </Badge>
                      </TableCell>
                      <TableCell>{getEntityDisplay(log.entityType)}</TableCell>
                      <TableCell>
                        {log.entityName || log.entityId || '-'}
                      </TableCell>
                      <TableCell className="max-w-[250px] truncate">
                        {log.details || '-'}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </ScrollArea>
      </div>
    </AppLayout>
  );
}
