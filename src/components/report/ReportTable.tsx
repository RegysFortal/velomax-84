
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Delivery } from '@/types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ReportTableProps {
  deliveries: Delivery[];
}

export function ReportTable({ deliveries }: ReportTableProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Minuta</TableHead>
            <TableHead>Data de Entrega</TableHead>
            <TableHead>Destinatário</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead className="text-right">Peso</TableHead>
            <TableHead className="text-right">Valor Frete</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {deliveries.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center">Nenhuma entrega encontrada</TableCell>
            </TableRow>
          ) : (
            deliveries.map((delivery) => (
              <TableRow key={delivery.id}>
                <TableCell className="font-medium">{delivery.minuteNumber}</TableCell>
                <TableCell>
                  {format(new Date(delivery.deliveryDate), 'dd/MM/yyyy', { locale: ptBR })}
                </TableCell>
                <TableCell>{delivery.receiverName}</TableCell>
                <TableCell>{delivery.deliveryType}</TableCell>
                <TableCell className="text-right">{delivery.weight} kg</TableCell>
                <TableCell className="text-right">{formatCurrency(delivery.totalFreight)}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
