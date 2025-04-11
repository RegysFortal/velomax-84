
import React from 'react';
import { TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface BudgetTableHeaderProps {
  requestSort: (key: string) => void;
  sortConfig: { key: string; direction: 'ascending' | 'descending' } | null;
}

export function BudgetTableHeader({ requestSort, sortConfig }: BudgetTableHeaderProps) {
  const getSortIcon = (key: string) => {
    if (!sortConfig || sortConfig.key !== key) {
      return null;
    }
    return sortConfig.direction === 'ascending' ? 
      <ArrowUp className="h-4 w-4 ml-1" /> : 
      <ArrowDown className="h-4 w-4 ml-1" />;
  };

  return (
    <TableHeader>
      <TableRow>
        <TableHead 
          className="cursor-pointer"
          onClick={() => requestSort('client')}
        >
          <div className="flex items-center">
            Cliente
            {getSortIcon('client')}
          </div>
        </TableHead>
        <TableHead 
          className="cursor-pointer"
          onClick={() => requestSort('date')}
        >
          <div className="flex items-center">
            Data
            {getSortIcon('date')}
          </div>
        </TableHead>
        <TableHead 
          className="cursor-pointer"
          onClick={() => requestSort('volumes')}
        >
          <div className="flex items-center">
            Volumes
            {getSortIcon('volumes')}
          </div>
        </TableHead>
        <TableHead 
          className="cursor-pointer"
          onClick={() => requestSort('weight')}
        >
          <div className="flex items-center">
            Peso
            {getSortIcon('weight')}
          </div>
        </TableHead>
        <TableHead 
          className="cursor-pointer text-right"
          onClick={() => requestSort('value')}
        >
          <div className="flex items-center justify-end">
            Valor Total
            {getSortIcon('value')}
          </div>
        </TableHead>
        <TableHead className="text-right">Ações</TableHead>
      </TableRow>
    </TableHeader>
  );
}
