import { useState } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { LogbookEntry } from '@/types';
import { useLogbook } from '@/contexts/LogbookContext';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CalendarIcon, Clock, Download, FilePlus, Fuel, GasTank, Plus, Search, Truck, User, UserCheck } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LogbookEntryForm from '@/components/logbook/LogbookEntryForm';
import FuelRecordForm from '@/components/logbook/FuelRecordForm';

const Logbook = () => {
  const { entries, vehicles, employees, loading } = useLogbook();
  const [isNewEntryOpen, setIsNewEntryOpen] = useState(false);
  const [isNewFuelOpen, setIsNewFuelOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { toast } = useToast();

  const filteredEntries = entries.filter(entry => {
    const entryDate = new Date(entry.date);
    return (
      entryDate.getDate() === selectedDate.getDate() &&
      entryDate.getMonth() === selectedDate.getMonth() &&
      entryDate.getFullYear() === selectedDate.getFullYear()
    );
  });

  const handleNewEntrySuccess = () => {
    setIsNewEntryOpen(false);
    toast({
      title: "Registro criado",
      description: "Entrada do diário de bordo foi registrada com sucesso.",
    });
  };

  const handleNewFuelSuccess = () => {
    setIsNewFuelOpen(false);
    toast({
      title: "Abastecimento registrado",
      description: "O registro de abastecimento foi criado com sucesso.",
    });
  };

  return (
    <AppLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Diário de Bordo</h1>
            <p className="text-muted-foreground">
              Gerencie saídas e entradas de veículos, abastecimentos e manutenções.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-[240px] justify-start text-left font-normal",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(selectedDate, "PPP", { locale: ptBR })}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>

            <Dialog open={isNewEntryOpen} onOpenChange={setIsNewEntryOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <FilePlus className="h-4 w-4" />
                  Novo registro
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Registrar saída/entrada de veículo</DialogTitle>
                  <DialogDescription>
                    Preencha os dados da saída e, quando o veículo retornar, complete os dados de retorno.
                  </DialogDescription>
                </DialogHeader>
                <LogbookEntryForm
                  onSuccess={handleNewEntrySuccess}
                  onCancel={() => setIsNewEntryOpen(false)}
                />
              </DialogContent>
            </Dialog>

            <Dialog open={isNewFuelOpen} onOpenChange={setIsNewFuelOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2" variant="outline">
                  <Fuel className="h-4 w-4" />
                  Abastecimento
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Registrar abastecimento</DialogTitle>
                  <DialogDescription>
                    Registre os detalhes do abastecimento de combustível.
                  </DialogDescription>
                </DialogHeader>
                <FuelRecordForm
                  onSuccess={handleNewFuelSuccess}
                  onCancel={() => setIsNewFuelOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Tabs defaultValue="entries">
          <TabsList>
            <TabsTrigger value="entries">Registros do dia</TabsTrigger>
            <TabsTrigger value="fuel">Abastecimentos</TabsTrigger>
            <TabsTrigger value="maintenance">Manutenções</TabsTrigger>
          </TabsList>
          
          <TabsContent value="entries" className="mt-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-md font-medium">
                  Registros de {format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                </CardTitle>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
              </CardHeader>
              <CardContent>
                {filteredEntries.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <Clock className="h-10 w-10 text-muted-foreground mb-3" />
                    <p className="text-muted-foreground">Nenhum registro encontrado para esta data.</p>
                    <Button variant="outline" className="mt-4" onClick={() => setIsNewEntryOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Criar novo registro
                    </Button>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Veículo</TableHead>
                        <TableHead>Motorista</TableHead>
                        <TableHead>Saída</TableHead>
                        <TableHead>Km Saída</TableHead>
                        <TableHead>Retorno</TableHead>
                        <TableHead>Km Retorno</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredEntries.map((entry) => {
                        const vehicle = vehicles.find(v => v.id === entry.vehicleId);
                        const driver = employees.find(e => e.id === entry.driverId);
                        
                        return (
                          <TableRow key={entry.id}>
                            <TableCell className="font-medium">{vehicle?.plate} - {vehicle?.model}</TableCell>
                            <TableCell>{driver?.name}</TableCell>
                            <TableCell>{entry.departureTime}</TableCell>
                            <TableCell>{entry.departureOdometer} km</TableCell>
                            <TableCell>{entry.returnTime || "---"}</TableCell>
                            <TableCell>{entry.returnOdometer ? `${entry.returnOdometer} km` : "---"}</TableCell>
                            <TableCell>
                              <Button variant="ghost" size="icon">
                                <Search className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="fuel" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Abastecimentos</CardTitle>
                <CardDescription>
                  Registros de abastecimentos de combustível dos veículos.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Implementação dos abastecimentos em andamento.</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="maintenance" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Manutenções</CardTitle>
                <CardDescription>
                  Registros de manutenções realizadas nos veículos.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Implementação das manutenções em andamento.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-md font-medium">Veículos</CardTitle>
                <Truck className="h-4 w-4 text-muted-foreground" />
              </div>
              <CardDescription>Status dos veículos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {vehicles.map(vehicle => (
                  <div key={vehicle.id} className="flex items-center justify-between border-b pb-2">
                    <div>
                      <p className="font-medium">{vehicle.plate}</p>
                      <p className="text-sm text-muted-foreground">{vehicle.model} {vehicle.year}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{vehicle.currentOdometer} km</p>
                      {vehicle.nextOilChangeKm - vehicle.currentOdometer < 1000 ? (
                        <p className="text-sm text-destructive">Troca de óleo em {vehicle.nextOilChangeKm - vehicle.currentOdometer} km</p>
                      ) : (
                        <p className="text-sm text-muted-foreground">Óleo: {vehicle.nextOilChangeKm - vehicle.currentOdometer} km</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-md font-medium">Funcionários</CardTitle>
                <UserCheck className="h-4 w-4 text-muted-foreground" />
              </div>
              <CardDescription>Equipe em serviço</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {employees.map(employee => {
                  const isWorking = filteredEntries.some(
                    entry => (entry.driverId === employee.id || entry.assistantId === employee.id) && !entry.returnTime
                  );
                  
                  return (
                    <div key={employee.id} className="flex items-center justify-between border-b pb-2">
                      <div>
                        <p className="font-medium">{employee.name}</p>
                        <p className="text-sm text-muted-foreground">{employee.role === 'driver' ? 'Motorista' : 'Ajudante'}</p>
                      </div>
                      <div>
                        <span className={cn(
                          "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                          isWorking 
                            ? "bg-green-100 text-green-800" 
                            : "bg-gray-100 text-gray-800"
                        )}>
                          {isWorking ? 'Em serviço' : 'Disponível'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-md font-medium">Alertas</CardTitle>
                <Fuel className="h-4 w-4 text-muted-foreground" />
              </div>
              <CardDescription>Manutenções importantes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {vehicles.map(vehicle => {
                  if (vehicle.nextOilChangeKm - vehicle.currentOdometer < 500) {
                    return (
                      <div key={`oil-${vehicle.id}`} className="p-3 bg-amber-50 border border-amber-200 rounded-md">
                        <p className="font-medium text-amber-800">Troca de óleo necessária</p>
                        <p className="text-sm text-amber-700">
                          {vehicle.plate} - {vehicle.model} precisa trocar o óleo em {vehicle.nextOilChangeKm - vehicle.currentOdometer} km
                        </p>
                      </div>
                    );
                  }
                  return null;
                }).filter(Boolean)}
                
                {vehicles.length > 0 && vehicles.every(v => v.nextOilChangeKm - v.currentOdometer >= 500) && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                    <p className="font-medium text-green-800">Sem alertas pendentes</p>
                    <p className="text-sm text-green-700">
                      Todos os veículos estão em dia com a manutenção
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default Logbook;
