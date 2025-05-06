
import React from 'react';
import { TableHeader, TableHead, TableRow } from '@/components/ui/table';

export const UserTableHeader = () => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>Nome</TableHead>
        <TableHead>Usuário</TableHead>
        <TableHead>Email</TableHead>
        <TableHead>Função</TableHead>
        <TableHead>Cargo</TableHead>
        <TableHead>Departamento</TableHead>
        <TableHead className="text-right">Ações</TableHead>
      </TableRow>
    </TableHeader>
  );
};
