
import { useEffect, useState } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { useActivityLog } from '@/contexts/ActivityLogContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { BadgeExtended } from '@/components/ui/badge-extended';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  Search, 
  Download, 
  Filter, 
  ArrowUpDown,
  Clock,
  User,
  Activity,
  FileText,
  Info
} from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ActivityAction, ActivityLog, EntityType, BadgeVariant } from '@/types/activity';

const ActivityLogs = () => {
  const { logs } = useActivityLog();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortColumn, setSortColumn] = useState<keyof ActivityLog | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filteredLogs, setFilteredLogs] = useState<ActivityLog[]>([]);
  const [page, setPage] = useState(1);
  const logsPerPage = 10;

  // Date range filter state
  const [fromDate, setFromDate] = useState<Date | undefined>();
  const [toDate, setToDate] = useState<Date | undefined>();

  useEffect(() => {
    let currentLogs = [...logs];

    // Apply date range filter
    if (fromDate && toDate) {
      currentLogs = currentLogs.filter(log => {
        const logDate = parseISO(log.timestamp);
        return logDate >= fromDate && logDate <= toDate;
      });
    }

    // Apply search filter
    if (searchQuery) {
      currentLogs = currentLogs.filter(log =>
        log.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.entityType.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (log.entityName && log.entityName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        log.details?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.ipAddress?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply sorting
    if (sortColumn) {
      currentLogs.sort((a, b) => {
        const aValue = a[sortColumn] || '';
        const bValue = b[sortColumn] || '';

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        } else if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
        } else {
          return 0;
        }
      });
    }

    setFilteredLogs(currentLogs);
    setPage(1); // Reset page on filter change
  }, [logs, searchQuery, sortColumn, sortDirection, fromDate, toDate]);

  const handleSort = (column: keyof ActivityLog) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const paginatedLogs = filteredLogs.slice((page - 1) * logsPerPage, page * logsPerPage);
  const totalPages = Math.ceil(filteredLogs.length / logsPerPage);

  const renderActionBadge = (action: ActivityAction) => {
    let variant: BadgeVariant = 'default';
    let label = '';

    switch (action) {
      case 'create':
        variant = 'success';
        label = 'Criação';
        break;
      case 'update':
        variant = 'secondary';
        label = 'Atualização';
        break;
      case 'delete':
        variant = 'destructive';
        label = 'Exclusão';
        break;
      case 'login':
        variant = 'default';
        label = 'Login';
        break;
      case 'logout':
        variant = 'outline';
        label = 'Logout';
        break;
      default:
        variant = 'outline';
        label = action.charAt(0).toUpperCase() + action.slice(1).replace('_', ' ');
    }

    return <BadgeExtended variant={variant}>{label}</BadgeExtended>;
  };

  const renderEntityType = (entityType: EntityType) => {
    let label = '';

    switch (entityType) {
      case 'user':
        label = 'Usuário';
        break;
      case 'client':
        label = 'Cliente';
        break;
      case 'delivery':
        label = 'Entrega';
        break;
      case 'shipment':
        label = 'Embarque';
        break;
      case 'vehicle':
        label = 'Veículo';
        break;
      case 'employee':
        label = 'Funcionário';
        break;
      case 'price_table':
        label = 'Tabela de Preços';
        break;
      case 'city':
        label = 'Cidade';
        break;
      case 'maintenance':
        label = 'Manutenção';
        break;
      case 'tire':
        label = 'Pneu';
        break;
      case 'report':
        label = 'Relatório';
        break;
      case 'system':
        label = 'Sistema';
        break;
      default:
        label = entityType.charAt(0).toUpperCase() + entityType.slice(1).replace('_', ' ');
    }

    return label;
  };

  return (
    <AppLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Logs de Atividade</h1>
            <p className="text-muted-foreground">
              Visualize as atividades realizadas no sistema
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Input
                type="search"
                placeholder="Buscar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" />
                  Filtrar por Data
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-4" align="end">
                <div className="grid gap-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <p className="text-sm font-medium">De:</p>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[150px] justify-start text-left font-normal",
                              !fromDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {fromDate ? format(fromDate, "dd/MM/yyyy", { locale: ptBR }) : <span>Selecione a data</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={fromDate}
                            onSelect={setFromDate}
                            disabled={(date) =>
                              toDate ? date > toDate : false
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium">Até:</p>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[150px] justify-start text-left font-normal",
                              !toDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {toDate ? format(toDate, "dd/MM/yyyy", { locale: ptBR }) : <span>Selecione a data</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={toDate}
                            onSelect={setToDate}
                            disabled={(date) =>
                              fromDate ? date < fromDate : false
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Exportar
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Registros de Atividade</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[150px]">
                      Usuário
                      <Button variant="ghost" size="sm" onClick={() => handleSort('userName')}>
                        <ArrowUpDown className="h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      Ação
                      <Button variant="ghost" size="sm" onClick={() => handleSort('action')}>
                        <ArrowUpDown className="h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      Entidade
                      <Button variant="ghost" size="sm" onClick={() => handleSort('entityType')}>
                        <ArrowUpDown className="h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      Nome
                      <Button variant="ghost" size="sm" onClick={() => handleSort('entityName')}>
                        <ArrowUpDown className="h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      Detalhes
                      <Button variant="ghost" size="sm" onClick={() => handleSort('details')}>
                        <ArrowUpDown className="h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead className="w-[150px]">
                      Data/Hora
                      <Button variant="ghost" size="sm" onClick={() => handleSort('timestamp')}>
                        <ArrowUpDown className="h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      IP
                      <Button variant="ghost" size="sm" onClick={() => handleSort('ipAddress')}>
                        <ArrowUpDown className="h-4 w-4" />
                      </Button>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          {log.userName}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Activity className="h-4 w-4" />
                          {renderActionBadge(log.action)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          {renderEntityType(log.entityType)}
                        </div>
                      </TableCell>
                      <TableCell>{log.entityName}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Info className="h-4 w-4" />
                          {log.details}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          {format(parseISO(log.timestamp), "dd/MM/yyyy HH:mm:ss", { locale: ptBR })}
                        </div>
                      </TableCell>
                      <TableCell>{log.ipAddress}</TableCell>
                    </TableRow>
                  ))}
                  {paginatedLogs.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center">
                        Nenhum registro encontrado.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </ScrollArea>
            <div className="flex justify-between items-center mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
              >
                Anterior
              </Button>
              <span>Página {page} de {totalPages}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
              >
                Próximo
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default ActivityLogs;

function cn(...inputs: any) {
  let classNames = '';
  for (let i = 0; i < inputs.length; i++) {
    const input = inputs[i];
    if (typeof input === 'string') {
      classNames += input + ' ';
    } else if (typeof input === 'object' && input !== null) {
      for (const key in input) {
        if (input.hasOwnProperty(key) && input[key]) {
          classNames += key + ' ';
        }
      }
    }
  }
  return classNames.trim();
}
