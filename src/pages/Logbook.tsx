
import { useState } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, FileText, Edit, Trash2, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useLogbook } from '@/contexts/LogbookContext';
import { Badge } from '@/components/ui/badge';

export default function Logbook() {
  const { entries, fuelRecords, updateEntry } = useLogbook();
  const [activeTab, setActiveTab] = useState('entries');
  
  const handleCompleteTrip = async (id: string) => {
    const entry = entries.find(e => e.id === id);
    if (entry) {
      const now = new Date();
      await updateEntry(id, {
        status: 'completed',
        returnTime: format(now, 'HH:mm'),
        endOdometer: entry.departureOdometer + 100, // This would be replaced with actual end odometer
        tripDistance: 100, // This would be calculated from departure and end odometer
      });
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="success">Concluído</Badge>;
      case 'in_progress':
        return <Badge variant="warning">Em Andamento</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelado</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <AppLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Diário de Bordo</h1>
            <p className="text-muted-foreground">
              Controle de viagens e abastecimentos da frota
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nova Entrada
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Total de Viagens</CardTitle>
              <CardDescription>Últimos 30 dias</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{entries.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Distância Percorrida</CardTitle>
              <CardDescription>Últimos 30 dias</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {entries.reduce((acc, entry) => acc + (entry.tripDistance || 0), 0)} km
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Gasto com Combustível</CardTitle>
              <CardDescription>Últimos 30 dias</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(fuelRecords.reduce((acc, record) => acc + record.totalCost, 0))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList>
            <TabsTrigger value="entries">Registros de Viagem</TabsTrigger>
            <TabsTrigger value="fuel">Abastecimentos</TabsTrigger>
          </TabsList>
          
          <TabsContent value="entries">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Veículo</TableHead>
                    <TableHead>Motorista</TableHead>
                    <TableHead>Destino</TableHead>
                    <TableHead>Objetivo</TableHead>
                    <TableHead>Km</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {entries.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center">
                        Nenhum registro encontrado
                      </TableCell>
                    </TableRow>
                  ) : (
                    entries.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell>
                          {format(new Date(entry.date), 'dd/MM/yyyy', { locale: ptBR })}
                        </TableCell>
                        <TableCell>Placa {entry.vehicleId}</TableCell>
                        <TableCell>Motorista {entry.driverId}</TableCell>
                        <TableCell>{entry.destination}</TableCell>
                        <TableCell>{entry.purpose}</TableCell>
                        <TableCell>{entry.tripDistance || '-'}</TableCell>
                        <TableCell>{getStatusBadge(entry.status)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            {entry.status === 'in_progress' && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleCompleteTrip(entry.id)}
                              >
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Completar
                              </Button>
                            )}
                            <Button variant="ghost" size="icon">
                              <FileText className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          <TabsContent value="fuel">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Veículo</TableHead>
                    <TableHead>Combustível</TableHead>
                    <TableHead>Litros</TableHead>
                    <TableHead>Valor/L</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Posto</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fuelRecords.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center">
                        Nenhum registro encontrado
                      </TableCell>
                    </TableRow>
                  ) : (
                    fuelRecords.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>
                          {format(new Date(record.date), 'dd/MM/yyyy', { locale: ptBR })}
                        </TableCell>
                        <TableCell>Placa {record.vehicleId}</TableCell>
                        <TableCell>{record.fuelType}</TableCell>
                        <TableCell>{record.liters} L</TableCell>
                        <TableCell>{formatCurrency(record.pricePerLiter)}</TableCell>
                        <TableCell>{formatCurrency(record.totalCost)}</TableCell>
                        <TableCell>{record.station || '-'}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
