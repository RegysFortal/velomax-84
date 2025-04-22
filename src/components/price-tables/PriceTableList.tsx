
import React from 'react';
import { PriceTable } from '@/types';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2 } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface PriceTableListProps {
  priceTables: PriceTable[];
  onEdit: (priceTable: PriceTable) => void;
  onDelete: (id: string) => void;
}

export function PriceTableList({ priceTables, onEdit, onDelete }: PriceTableListProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-md font-medium">
          Lista de Tabelas de Preços
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Serviços Personalizados</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {priceTables.map((priceTable) => (
              <TableRow key={priceTable.id}>
                <TableCell className="font-medium">{priceTable.name}</TableCell>
                <TableCell>{priceTable.description}</TableCell>
                <TableCell>
                  {priceTable.minimumRate.customServices?.length ? (
                    <div className="flex flex-wrap gap-1">
                      {priceTable.minimumRate.customServices.map((service) => (
                        <Badge key={service.id} variant="outline">{service.name}</Badge>
                      ))}
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">Nenhum</span>
                  )}
                </TableCell>
                <TableCell className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => onEdit(priceTable)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onDelete(priceTable.id)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
