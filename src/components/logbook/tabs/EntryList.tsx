
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Download, Clock, Plus, Search } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { LogbookEntry, Vehicle, Employee } from '@/types';

interface EntryListProps {
  entries: LogbookEntry[];
  vehicles: Vehicle[];
  employees: Employee[];
  selectedDate: Date;
  onNewEntry: () => void;
}

export const EntryList: React.FC<EntryListProps> = ({
  entries,
  vehicles,
  employees,
  selectedDate,
  onNewEntry
}) => {
  const filteredEntries = entries.filter(entry => {
    const entryDate = new Date(entry.date);
    return (
      entryDate.getDate() === selectedDate.getDate() &&
      entryDate.getMonth() === selectedDate.getMonth() &&
      entryDate.getFullYear() === selectedDate.getFullYear()
    );
  });

  return (
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
            <Button variant="outline" className="mt-4" onClick={onNewEntry}>
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
                    <TableCell>{entry.endOdometer ? `${entry.endOdometer} km` : "---"}</TableCell>
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
  );
};
