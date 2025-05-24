
import React from 'react';
import { TableHead, TableHeader, TableRow } from '@/components/ui/table';

export function DeliveryTableHeader() {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="px-2 py-2 min-w-[50px]">Minuta</TableHead>
        <TableHead className="px-2 py-2 min-w-[150px]">Cliente</TableHead>
        <TableHead className="px-2 py-2 min-w-[80px]">Data</TableHead>
        <TableHead className="px-2 py-2 min-w-[80px]">Hora</TableHead>
        <TableHead className="px-2 py-2 min-w-[120px]">Recebedor</TableHead>
        <TableHead className="px-2 py-2 min-w-[80px]">Peso</TableHead>
        <TableHead className="px-2 py-2 min-w-[80px]">Volumes</TableHead>
        <TableHead className="px-2 py-2 min-w-[120px]">Tipo</TableHead>
        <TableHead className="px-2 py-2 min-w-[100px]">Valor</TableHead>
        <TableHead className="px-2 py-2 min-w-[120px]">Ocorrência</TableHead>
        <TableHead className="text-right px-2 py-2 min-w-[80px]">Ações</TableHead>
      </TableRow>
    </TableHeader>
  );
}
