
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';

interface TopClient {
  id: string;
  name: string;
  deliveries: number;
  freight: number;
  avgTicket: number;
}

interface TopClientsTableProps {
  topClients: TopClient[];
}

export const TopClientsTable = ({ topClients }: TopClientsTableProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Clientes Mais Ativos (Top 5)</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead className="text-center">Entregas</TableHead>
              <TableHead className="text-right">Faturamento</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {topClients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center">
                  Nenhum cliente encontrado
                </TableCell>
              </TableRow>
            ) : (
              topClients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell className="font-medium">{client.name}</TableCell>
                  <TableCell className="text-center">{client.deliveries}</TableCell>
                  <TableCell className="text-right">{formatCurrency(client.freight)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
