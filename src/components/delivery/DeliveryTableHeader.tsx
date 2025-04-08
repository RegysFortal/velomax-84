
import React from 'react';
import { TableHead, TableHeader, TableRow } from '@/components/ui/table';

export function DeliveryTableHeader() {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>Minuta</TableHead>
        <TableHead>Cliente</TableHead>
        <TableHead>Data</TableHead>
        <TableHead>Hora</TableHead>
        <TableHead>Recebedor</TableHead>
        <TableHead>Peso</TableHead>
        <TableHead>Volumes</TableHead>
        <TableHead>Tipo</TableHead>
        <TableHead>Valor</TableHead>
        <TableHead>Ocorrência</TableHead>
        <TableHead className="text-right">Ações</TableHead>
      </TableRow>
    </TableHeader>
  );
}
